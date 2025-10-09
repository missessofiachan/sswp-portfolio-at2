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
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create order',
      });
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
      if (error instanceof Error && error.message.includes('Access denied')) {
        res.status(403).json({
          success: false,
          message: error.message,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get order',
      });
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
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const lastOrderId = req.query.lastOrderId as string;

      const orders = await this.orderService.getUserOrders(userId, limit, lastOrderId);

      res.json({
        success: true,
        data: orders,
        meta: {
          count: orders.length,
          hasMore: limit ? orders.length === limit : false,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get orders',
      });
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
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const lastOrderId = req.query.lastOrderId as string;
      const status = req.query.status as OrderStatus;

      const orders = await this.orderService.getAllOrders(limit, lastOrderId, status);

      res.json({
        success: true,
        data: orders,
        meta: {
          count: orders.length,
          hasMore: limit ? orders.length === limit : false,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get orders',
      });
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
      if (error instanceof Error && error.message.includes('Access denied')) {
        res.status(403).json({
          success: false,
          message: error.message,
        });
        return;
      }

      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }

      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update order',
      });
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
      if (error instanceof Error && error.message.includes('Access denied')) {
        res.status(403).json({
          success: false,
          message: error.message,
        });
        return;
      }

      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }

      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to cancel order',
      });
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
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete order',
      });
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
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get order statistics',
      });
    }
  }
}
