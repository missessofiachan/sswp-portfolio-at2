/**
 * Order Controller
 *
 * HTTP request handlers for order-related operations.
 * Handles order creation, retrieval, updates, and administrative functions.
 *
 * @fileoverview Order HTTP controllers
 * @module api/controllers/OrderController
 */

import { Request, Response } from 'express';
import { OrderService } from '../../services/order.service';
import { CreateOrderInput, UpdateOrderInput, OrderStatus } from '../../domain/orders';
import { logError } from '../../utils/logger';

/**
 * Interface for authenticated request with user data
 */
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

function parseOptionalLimit(value: unknown): number | undefined {
  if (value == null) {
    return undefined;
  }
  const parsed = Number.parseInt(String(value), 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return undefined;
  }
  return parsed;
}

function extractStatus(error: Error, fallback: number): number {
  const status = (error as any)?.status;
  return typeof status === 'number' && status >= 100 && status < 600 ? status : fallback;
}

function inferStatusFromMessage(message: string | undefined): number | undefined {
  if (!message) return undefined;
  const normalized = message.toLowerCase();
  if (normalized.includes('access denied') || normalized.includes('forbidden')) {
    return 403;
  }
  if (normalized.includes('not found')) {
    return 404;
  }
  if (normalized.includes('unauthenticated') || normalized.includes('invalid token')) {
    return 401;
  }
  return undefined;
}

function respondWithError(res: Response, error: Error, fallback: number): void {
  const inferred = inferStatusFromMessage(error.message);
  const status = extractStatus(error, inferred ?? fallback);
  res.status(status).json({
    success: false,
    message: error.message,
  });
}

/**
 * Controller class for order operations
 *
 * @class OrderController
 */
export class OrderController {
  private orderService: OrderService;

  /**
   * Create a new OrderController instance
   *
   * @param {OrderService} orderService - Order service for business logic
   */
  constructor(orderService: OrderService) {
    this.orderService = orderService;
  }

  /**
   * Create a new order
   *
   * @route POST /api/orders
   * @access Private
   * @param {AuthenticatedRequest} req - Express request with authenticated user
   * @param {Response} res - Express response
   * @returns {Promise<void>}
   */
  async createOrder(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const userEmail = req.user!.email;
      const orderData: CreateOrderInput = req.body;

      const order = await this.orderService.createOrder(orderData, userId, userEmail);

      res.status(201).json({
        success: true,
        data: order,
        message: 'Order created successfully',
      });
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to create order');
      const status = extractStatus(err, 400);
      logError('Failed to create order', err, {
        userId: req.user?.id,
        status,
      });
      respondWithError(res, err, 400);
    }
  }

  /**
   * Get an order by ID
   *
   * @route GET /api/orders/:id
   * @access Private
   * @param {AuthenticatedRequest} req - Express request with authenticated user
   * @param {Response} res - Express response
   * @returns {Promise<void>}
   */
  async getOrder(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const isAdmin = req.user!.role === 'admin';

      const order = await this.orderService.getOrder(id, userId, isAdmin);

      if (!order) {
        res.status(404).json({
          success: false,
          message: 'Order not found',
        });
        return;
      }

      res.json({
        success: true,
        data: order,
      });
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to get order');
      logError('Failed to get order', err, {
        orderId: req.params.id,
        userId: req.user?.id,
      });
      respondWithError(res, err, 500);
    }
  }

  /**
   * Get current user's orders
   *
   * @route GET /api/orders/my
   * @access Private
   * @param {AuthenticatedRequest} req - Express request with authenticated user
   * @param {Response} res - Express response
   * @returns {Promise<void>}
   */
  async getMyOrders(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const limit = parseOptionalLimit(req.query.limit);
      const lastOrderId = req.query.lastOrderId as string;

      const orders = await this.orderService.getUserOrders(userId, limit, lastOrderId);
      const hasMore = limit ? orders.length > limit : false;
      const data = limit ? orders.slice(0, limit) : orders;

      res.json({
        success: true,
        data,
        meta: {
          count: data.length,
          hasMore,
        },
      });
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to get orders');
      logError('Failed to get my orders', err, {
        userId: req.user?.id,
      });
      respondWithError(res, err, 500);
    }
  }

  /**
   * Get all orders (admin only)
   *
   * @route GET /api/orders
   * @access Private (Admin)
   * @param {AuthenticatedRequest} req - Express request with authenticated user
   * @param {Response} res - Express response
   * @returns {Promise<void>}
   */
  async getAllOrders(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const limit = parseOptionalLimit(req.query.limit);
      const lastOrderId = req.query.lastOrderId as string;
      const status = req.query.status as OrderStatus;

      const orders = await this.orderService.getAllOrders(limit, lastOrderId, status);
      const hasMore = limit ? orders.length > limit : false;
      const data = limit ? orders.slice(0, limit) : orders;

      res.json({
        success: true,
        data,
        meta: {
          count: data.length,
          hasMore,
        },
      });
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to get orders');
      logError('Failed to get all orders', err, {
        userId: req.user?.id,
        status: req.query.status,
      });
      respondWithError(res, err, 500);
    }
  }

  /**
   * Update an order
   *
   * @route PUT /api/orders/:id
   * @access Private
   * @param {AuthenticatedRequest} req - Express request with authenticated user
   * @param {Response} res - Express response
   * @returns {Promise<void>}
   */
  async updateOrder(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const isAdmin = req.user!.role === 'admin';
      const updateData: UpdateOrderInput = req.body;

      const order = await this.orderService.updateOrder(id, updateData, userId, isAdmin);

      res.json({
        success: true,
        data: order,
        message: 'Order updated successfully',
      });
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to update order');
      logError('Failed to update order', err, {
        orderId: req.params.id,
        userId: req.user?.id,
      });
      respondWithError(res, err, 400);
    }
  }

  /**
   * Cancel an order
   *
   * @route POST /api/orders/:id/cancel
   * @access Private
   * @param {AuthenticatedRequest} req - Express request with authenticated user
   * @param {Response} res - Express response
   * @returns {Promise<void>}
   */
  async cancelOrder(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const isAdmin = req.user!.role === 'admin';

      const order = await this.orderService.cancelOrder(id, userId, isAdmin);

      res.json({
        success: true,
        data: order,
        message: 'Order cancelled successfully',
      });
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to cancel order');
      logError('Failed to cancel order', err, {
        orderId: req.params.id,
        userId: req.user?.id,
      });
      respondWithError(res, err, 400);
    }
  }

  /**
   * Delete an order (admin only)
   *
   * @route DELETE /api/orders/:id
   * @access Private (Admin)
   * @param {AuthenticatedRequest} req - Express request with authenticated user
   * @param {Response} res - Express response
   * @returns {Promise<void>}
   */
  async deleteOrder(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      await this.orderService.deleteOrder(id);

      res.json({
        success: true,
        message: 'Order deleted successfully',
      });
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to delete order');
      logError('Failed to delete order', err, {
        orderId: req.params.id,
        userId: req.user?.id,
      });
      respondWithError(res, err, 500);
    }
  }

  /**
   * Get order statistics (admin only)
   *
   * @route GET /api/orders/stats
   * @access Private (Admin)
   * @param {AuthenticatedRequest} req - Express request with authenticated user
   * @param {Response} res - Express response
   * @returns {Promise<void>}
   */
  async getOrderStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

      const stats = await this.orderService.getOrderStats(startDate, endDate);

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to get order statistics');
      logError('Failed to get order statistics', err, {
        userId: req.user?.id,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
      });
      respondWithError(res, err, 500);
    }
  }
}
