/**
 * Order Routes
 *
 * Express router configuration for order-related endpoints.
 * Includes authentication, validation, and role-based access control.
 *
 * @fileoverview Order API routes
 * @module api/routes/orders
 */

import { OrderService } from '@server/services/orders';
import { Router } from 'express';
import { FirestoreOrderRepository } from '../../data/firestore/FirestoreOrderRepository';
import { OrderController } from '../controllers/order.controller';
import { requireAuth, requireRole } from '../middleware/auth';
import { validateBody, validateParams, validateQuery } from '../middleware/validation';
import {
  createOrderSchema,
  orderIdSchema,
  orderQuerySchema,
  orderStatsQuerySchema,
  updateOrderSchema,
} from '../validators/order.validators';

/**
 * Create and configure order routes
 *
 * @returns {Router} Configured Express router
 */
export function createOrderRoutes(): Router {
  const router = Router();

  // Initialize dependencies
  const orderRepository = new FirestoreOrderRepository();
  const orderService = new OrderService(orderRepository);
  const orderController = new OrderController(orderService);

  /**
   * @route GET /api/orders/stats
   * @desc Get order statistics
   * @access Private (Admin only)
   */
  router.get(
    '/stats',
    requireAuth,
    requireRole('admin'),
    validateQuery(orderStatsQuerySchema),
    (req, res) => orderController.getOrderStats(req, res)
  );

  /**
   * @route GET /api/orders/my
   * @desc Get current user's orders
   * @access Private
   */
  router.get('/my', requireAuth, validateQuery(orderQuerySchema), (req, res) =>
    orderController.getMyOrders(req, res)
  );

  /**
   * @route POST /api/orders
   * @desc Create a new order
   * @access Private
   */
  router.post('/', requireAuth, validateBody(createOrderSchema), (req, res) =>
    orderController.createOrder(req, res)
  );

  /**
   * @route GET /api/orders
   * @desc Get all orders (admin only)
   * @access Private (Admin only)
   */
  router.get('/', requireAuth, requireRole('admin'), validateQuery(orderQuerySchema), (req, res) =>
    orderController.getAllOrders(req, res)
  );

  /**
   * @route GET /api/orders/:id
   * @desc Get order by ID
   * @access Private
   */
  router.get('/:id', requireAuth, validateParams(orderIdSchema), (req, res) =>
    orderController.getOrder(req, res)
  );

  /**
   * @route PUT /api/orders/:id
   * @desc Update an order
   * @access Private
   */
  router.put(
    '/:id',
    requireAuth,
    validateParams(orderIdSchema), // Validate route parameter
    validateBody(updateOrderSchema), // Validate request body
    (req, res) => orderController.updateOrder(req, res)
  );

  /**
   * @desc Cancel an order
   * @access Private
   */
  router.post('/:id/cancel', requireAuth, validateParams(orderIdSchema), (req, res) =>
    orderController.cancelOrder(req, res)
  );

  /**
   * @route DELETE /api/orders/:id
   * @desc Delete an order (admin only)
   * @access Private (Admin only)
   */
  router.delete(
    '/:id',
    requireAuth,
    requireRole('admin'),
    validateParams(orderIdSchema), // Validate route parameter
    (req, res) => orderController.deleteOrder(req, res)
  );

  return router;
}

export default createOrderRoutes;
