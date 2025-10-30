/**
 * Order Service
 *
 * Business logic layer for order operations. Handles order creation, updates,
 * and provides aggregated views for both users and administrators.
 *
 * @fileoverview Order business logic service
 * @module services/OrderService
 */

import { OrderRepository } from '../data/ports/OrderRepository';
import {
  Order,
  CreateOrderInput,
  UpdateOrderInput,
  OrderStats,
  OrderStatus,
  ShippingAddress,
} from '../domain/orders';
import { emailService } from './email.service';
import { logError } from '../utils/logger';
import { orderEvents } from './order.events';

/**
 * Service class for order business logic
 *
 * @class OrderService
 */
export class OrderService {
  private orderRepository: OrderRepository;

  /**
   * Fields that non-admin users are allowed to update on their orders
   */
  private static readonly USER_ALLOWED_UPDATE_FIELDS = ['notes', 'shippingAddress'];

  private static readonly SHIPPING_ADDRESS_REQUIRED_FIELDS: Array<keyof ShippingAddress> = [
    'fullName',
    'street',
    'city',
    'state',
    'postalCode',
    'country',
  ];

  /**
   * Create a new OrderService instance
   *
   * @param {OrderRepository} orderRepository - Order repository for data access
   */
  constructor(orderRepository: OrderRepository) {
    this.orderRepository = orderRepository;
  }

  /**
   * Create a new order
   *
   * @param {CreateOrderInput} orderData - Order data to create
   * @param {string} userId - ID of the user creating the order
   * @param {string} userEmail - Email of the user creating the order
   * @returns {Promise<Order>} The created order
   * @throws {Error} If order creation fails or validation errors occur
   */
  async createOrder(
    orderData: CreateOrderInput,
    userId: string,
    userEmail: string
  ): Promise<Order> {
    // Validate order data
    if (!orderData.items || orderData.items.length === 0) {
      throw OrderService.badRequest('Order must contain at least one item');
    }

    if (!orderData.shippingAddress) {
      throw OrderService.badRequest('Shipping address is required');
    }

    this.assertShippingAddressComplete(orderData.shippingAddress);

    // Validate quantities
    for (const item of orderData.items) {
      if (item.quantity <= 0) {
        throw OrderService.badRequest(`Invalid quantity: ${item.quantity}`);
      }
      if (!item.productId) {
        throw OrderService.badRequest('Product ID is required for all items');
      }
    }

    try {
      return await this.orderRepository.create(orderData, userId, userEmail);
    } catch (error) {
      const err = error as any;
      if (err?.code === 'INSUFFICIENT_STOCK') {
        const conflictError = new Error(err.message);
        (conflictError as any).status = 409;
        (conflictError as any).code = err.code;
        (conflictError as any).details = {
          productId: err.productId,
          available: err.available,
          requested: err.requested,
        };
        throw conflictError;
      }
      if (err?.code === 'PRODUCT_NOT_FOUND') {
        const notFoundError = new Error(err.message);
        (notFoundError as any).status = 404;
        (notFoundError as any).code = err.code;
        (notFoundError as any).details = { productId: err.productId };
        throw notFoundError;
      }
      if (err instanceof Error) {
        throw err;
      }
      throw new Error('Failed to create order');
    }
  }

  /**
   * Get an order by ID (with ownership validation for non-admin users)
   *
   * @param {string} orderId - Order ID to retrieve
   * @param {string} userId - ID of the requesting user
   * @param {boolean} [isAdmin=false] - Whether the requesting user is an admin
   * @returns {Promise<Order | null>} The order if found and accessible
   * @throws {Error} If user doesn't have access to the order
   */
  async getOrder(orderId: string, userId: string, isAdmin = false): Promise<Order | null> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      return null;
    }

    // Allow admins to view any order, otherwise check ownership
    if (!isAdmin && order.userId !== userId) {
      throw OrderService.forbidden('Access denied: You can only view your own orders');
    }

    return order;
  }

  /**
   * Get all orders for a specific user
   *
   * @param {string} userId - User ID to get orders for
   * @param {number} [limit] - Optional limit for pagination
   * @param {string} [lastOrderId] - Optional last order ID for pagination
   * @returns {Promise<Order[]>} Array of user orders
   */
  async getUserOrders(userId: string, limit?: number, lastOrderId?: string): Promise<Order[]> {
    const fetchLimit = limit ? limit + 1 : undefined;
    return await this.orderRepository.findByUserId(userId, fetchLimit, lastOrderId);
  }

  /**
   * Get all orders (admin function)
   *
   * @param {number} [limit] - Optional limit for pagination
   * @param {string} [lastOrderId] - Optional last order ID for pagination
   * @param {OrderStatus} [status] - Optional status filter
   * @returns {Promise<Order[]>} Array of all orders
   */
  async getAllOrders(limit?: number, lastOrderId?: string, status?: OrderStatus): Promise<Order[]> {
    const fetchLimit = limit ? limit + 1 : undefined;
    return await this.orderRepository.findAll(fetchLimit, lastOrderId, status);
  }

  /**
   * Update an order (admin function or limited user updates)
   *
   * @param {string} orderId - Order ID to update
   * @param {UpdateOrderInput} updateData - Data to update
   * @param {string} userId - ID of the requesting user
   * @param {boolean} [isAdmin=false] - Whether the requesting user is an admin
   * @returns {Promise<Order>} The updated order
   * @throws {Error} If user doesn't have permission or order not found
   */
  async updateOrder(
    orderId: string,
    updateData: UpdateOrderInput,
    userId: string,
    isAdmin = false
  ): Promise<Order> {
    const existingOrder = await this.orderRepository.findById(orderId);

    if (!existingOrder) {
      throw OrderService.notFound(`Order not found: ${orderId}`);
    }

    // For non-admin users, only allow limited updates and only on their own orders
    if (!isAdmin) {
      if (existingOrder.userId !== userId) {
        throw OrderService.forbidden('Access denied: You can only update your own orders');
      }

      // Non-admin users can only update shipping address and notes, and only for pending orders
      if (existingOrder.status !== OrderStatus.PENDING) {
        throw OrderService.badRequest('Cannot modify order after it has been processed');
      }

      // Restrict what non-admin users can update
      const allowedFields = OrderService.USER_ALLOWED_UPDATE_FIELDS;
      const restrictedFields = Object.keys(updateData).filter(
        (key) => !allowedFields.includes(key)
      );

      if (restrictedFields.length > 0) {
        throw OrderService.forbidden(`Unauthorized field updates: ${restrictedFields.join(', ')}`);
      }
    }

    if (updateData.shippingAddress) {
      this.assertShippingAddressComplete(updateData.shippingAddress);
    }

    // Validate status transitions
    if (
      updateData.status &&
      !this.isValidStatusTransition(existingOrder.status, updateData.status)
    ) {
      throw OrderService.badRequest(
        `Invalid status transition from ${existingOrder.status} to ${updateData.status}`
      );
    }

    const updatedOrder = await this.orderRepository.update(orderId, updateData);
    await this.handleStatusChangeIfNeeded(existingOrder, updatedOrder);

    return updatedOrder;
  }

  /**
   * Cancel an order
   *
   * @param {string} orderId - Order ID to cancel
   * @param {string} userId - ID of the requesting user
   * @param {boolean} [isAdmin=false] - Whether the requesting user is an admin
   * @returns {Promise<Order>} The cancelled order
   * @throws {Error} If order cannot be cancelled or user lacks permission
   */
  async cancelOrder(orderId: string, userId: string, isAdmin = false): Promise<Order> {
    const existingOrder = await this.orderRepository.findById(orderId);

    if (!existingOrder) {
      throw OrderService.notFound(`Order not found: ${orderId}`);
    }

    // Check ownership for non-admin users
    if (!isAdmin && existingOrder.userId !== userId) {
      throw OrderService.forbidden('Access denied: You can only cancel your own orders');
    }

    // Check if order can be cancelled
    const cancellableStatuses = [OrderStatus.PENDING, OrderStatus.CONFIRMED];
    if (!cancellableStatuses.includes(existingOrder.status)) {
      throw OrderService.badRequest(`Cannot cancel order with status: ${existingOrder.status}`);
    }

    const updatedOrder = await this.orderRepository.update(orderId, {
      status: OrderStatus.CANCELLED,
    });
    await this.handleStatusChangeIfNeeded(existingOrder, updatedOrder);

    return updatedOrder;
  }

  /**
   * Delete an order (admin function only)
   *
   * @param {string} orderId - Order ID to delete
   * @returns {Promise<void>}
   * @throws {Error} If order not found
   */
  async deleteOrder(orderId: string): Promise<void> {
    await this.orderRepository.delete(orderId);
  }

  /**
   * Get order statistics (admin function)
   *
   * @param {Date} [startDate] - Optional start date for stats
   * @param {Date} [endDate] - Optional end date for stats
   * @returns {Promise<OrderStats>} Order statistics
   */
  async getOrderStats(startDate?: Date, endDate?: Date): Promise<OrderStats> {
    return await this.orderRepository.getStats(startDate, endDate);
  }

  /**
   * Check if user owns an order
   *
   * @param {string} orderId - Order ID to check
   * @param {string} userId - User ID to verify ownership
   * @returns {Promise<boolean>} True if user owns the order
   */
  async doesUserOwnOrder(orderId: string, userId: string): Promise<boolean> {
    return await this.orderRepository.isOwnedByUser(orderId, userId);
  }

  /**
   * Validate order status transitions
   *
   * @private
   * @param {OrderStatus} currentStatus - Current order status
   * @param {OrderStatus} newStatus - New order status
   * @returns {boolean} True if transition is valid
   */
  private isValidStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus): boolean {
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
      [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [OrderStatus.REFUNDED],
      [OrderStatus.CANCELLED]: [OrderStatus.REFUNDED],
      [OrderStatus.REFUNDED]: [],
    };

    return validTransitions[currentStatus]?.includes(newStatus) || false;
  }

  private assertShippingAddressComplete(address: ShippingAddress): void {
    const missing = OrderService.SHIPPING_ADDRESS_REQUIRED_FIELDS.filter((field) => {
      const value = address[field];
      return typeof value !== 'string' || value.trim().length === 0;
    });

    if (missing.length > 0) {
      throw OrderService.badRequest('Incomplete shipping address provided');
    }
  }

  private async handleStatusChangeIfNeeded(previous: Order, updated: Order): Promise<void> {
    if (previous.status === updated.status) {
      return;
    }

    try {
      await emailService.sendOrderStatusUpdate({
        to: updated.userEmail,
        orderId: updated.id,
        newStatus: updated.status,
        previousStatus: previous.status,
      });
    } catch (error) {
      logError('Failed to send order status update email', error, {
        orderId: updated.id,
        previousStatus: previous.status,
        newStatus: updated.status,
      });
    }

    orderEvents.emit('orderStatusChanged', {
      order: updated,
      previousStatus: previous.status,
      newStatus: updated.status,
    });
  }

  private static httpError(message: string, status: number): Error {
    const error = new Error(message);
    (error as any).status = status;
    return error;
  }

  private static badRequest(message: string): Error {
    return OrderService.httpError(message, 400);
  }

  private static forbidden(message: string): Error {
    return OrderService.httpError(message, 403);
  }

  private static notFound(message: string): Error {
    return OrderService.httpError(message, 404);
  }
}
