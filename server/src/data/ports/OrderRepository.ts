/**
 * Order Repository Port
 *
 * Defines the interface for order data access operations.
 * This abstraction allows for different storage implementations.
 *
 * @fileoverview Order repository interface
 * @module data/ports/OrderRepository
 */

import type {
  CreateOrderInput,
  Order,
  OrderStats,
  OrderStatus,
  UpdateOrderInput,
} from '../../domain/orders';

/**
 * Simple product interface for order operations
 */
export interface ProductForOrder {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageUrls?: string[];
}

/**
 * Order repository interface for data access operations
 *
 * @interface OrderRepository
 */
export interface OrderRepository {
  /**
   * Create a new order
   *
   * @param {CreateOrderInput} orderData - Order data to create
   * @param {string} userId - ID of the user creating the order
   * @param {string} userEmail - Email of the user creating the order
   * @returns {Promise<Order>} The created order
   * @throws {Error} If order creation fails
   */
  create(orderData: CreateOrderInput, userId: string, userEmail: string): Promise<Order>;

  /**
   * Find an order by ID
   *
   * @param {string} id - Order ID to find
   * @returns {Promise<Order | null>} The order if found, null otherwise
   */
  findById(id: string): Promise<Order | null>;

  /**
   * Find all orders for a specific user
   *
   * @param {string} userId - User ID to find orders for
   * @param {number} [limit] - Optional limit for pagination
   * @param {string} [lastOrderId] - Optional last order ID for pagination
   * @returns {Promise<Order[]>} Array of user orders
   */
  findByUserId(userId: string, limit?: number, lastOrderId?: string): Promise<Order[]>;

  /**
   * Find all orders (admin function)
   *
   * @param {number} [limit] - Optional limit for pagination
   * @param {string} [lastOrderId] - Optional last order ID for pagination
   * @param {OrderStatus} [status] - Optional status filter
   * @returns {Promise<Order[]>} Array of all orders
   */
  findAll(limit?: number, lastOrderId?: string, status?: OrderStatus): Promise<Order[]>;

  /**
   * Update an existing order
   *
   * @param {string} id - Order ID to update
   * @param {UpdateOrderInput} updateData - Data to update
   * @returns {Promise<Order>} The updated order
   * @throws {Error} If order not found or update fails
   */
  update(id: string, updateData: UpdateOrderInput): Promise<Order>;

  /**
   * Delete an order (admin function)
   *
   * @param {string} id - Order ID to delete
   * @returns {Promise<void>}
   * @throws {Error} If order not found or delete fails
   */
  delete(id: string): Promise<void>;

  /**
   * Get order statistics (admin function)
   *
   * @param {Date} [startDate] - Optional start date for stats
   * @param {Date} [endDate] - Optional end date for stats
   * @returns {Promise<OrderStats>} Order statistics
   */
  getStats(startDate?: Date, endDate?: Date): Promise<OrderStats>;

  /**
   * Check if user owns the order
   *
   * @param {string} orderId - Order ID to check
   * @param {string} userId - User ID to verify ownership
   * @returns {Promise<boolean>} True if user owns the order
   */
  isOwnedByUser(orderId: string, userId: string): Promise<boolean>;
}
