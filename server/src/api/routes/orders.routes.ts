/**
 * Order Routes
 *
 * Express router configuration for order-related endpoints.
 * Includes authentication, validation, and role-based access control.
 *
 * @fileoverview Order API routes
 * @module api/routes/orders
 */

import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { OrderService } from '../../services/order.service';
import { FirestoreOrderRepository } from '../../data/firestore/FirestoreOrderRepository';
import { ProductRepositoryAdapter } from '../../data/adapters/ProductRepositoryAdapter';
import { fsProductsRepo } from '../../data/firestore/products.repo.fs';
import { requireAuth, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createOrderSchema,
  updateOrderSchema,
  orderQuerySchema,
  orderStatsQuerySchema,
  orderIdSchema,
} from '../validators/order.validators';

/**
 * Create and configure order routes
 *
 * @returns {Router} Configured Express router
 */
export function createOrderRoutes(): Router {
  const router = Router();

  // Initialize dependencies
  const productRepository = new ProductRepositoryAdapter(fsProductsRepo);
  const orderRepository = new FirestoreOrderRepository(productRepository);
  const orderService = new OrderService(orderRepository as any);
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
    validate(orderStatsQuerySchema),
    (req, res) => orderController.getOrderStats(req, res)
  );

  /**
   * @route GET /api/orders/my
   * @desc Get current user's orders
   * @access Private
   */
  router.get('/my', requireAuth, validate(orderQuerySchema), (req, res) =>
    orderController.getMyOrders(req, res)
  );

  /**
   * @route POST /api/orders
   * @desc Create a new order
   * @access Private
   */
  router.post('/', requireAuth, validate(createOrderSchema), (req, res) =>
    orderController.createOrder(req, res)
  );

  /**
   * @route GET /api/orders
   * @desc Get all orders (admin only)
   * @access Private (Admin only)
   */
  router.get('/', requireAuth, requireRole('admin'), validate(orderQuerySchema), (req, res) =>
    orderController.getAllOrders(req, res)
  );

  /**
   * @route GET /api/orders/:id
   * @desc Get order by ID
   * @access Private
   */
  router.get('/:id', requireAuth, validate(orderIdSchema), (req, res) =>
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
    validate(orderIdSchema), // Validate route parameter
    validate(updateOrderSchema), // Validate request body
    (req, res) => orderController.updateOrder(req, res)
  );

  /**
  router.post('/:id/cancel', requireAuth, validate(orderIdSchema), (req, res) => orderController.cancelOrder(req, res));
   * @desc Cancel an order
   * @access Private
   */
  router.post('/:id/cancel', requireAuth, (req, res) => orderController.cancelOrder(req, res));

  /**
   * @route DELETE /api/orders/:id
   * @desc Delete an order (admin only)
   * @access Private (Admin only)
   */
  router.delete(
    '/:id',
    requireAuth,
    requireRole('admin'),
    validate(orderIdSchema), // Validate route parameter
    (req, res) => orderController.deleteOrder(req, res)
  );

  return router;
}

export default createOrderRoutes;
