/**
 * Order API Validation Schemas
 *
 * Joi validation schemas for order-related API endpoints.
 * Provides input validation for order creation, updates, and queries.
 *
 * @fileoverview Order validation schemas
 * @module api/validators/order.validators
 */

import Joi from 'joi';
import { OrderStatus, PaymentStatus, PaymentMethod } from '../../domain/orders';

/**
 * Validation schema for order item
 */
const orderItemSchema = Joi.object({
  productId: Joi.string().required().description('Product ID to order'),
  quantity: Joi.number()
    .integer()
    .min(1)
    .required()
    .description('Quantity to order (must be positive)'),
});

/**
 * Validation schema for shipping address
 */
const shippingAddressSchema = Joi.object({
  fullName: Joi.string().trim().min(1).max(100).required().description('Full name of recipient'),
  street: Joi.string().trim().min(1).max(200).required().description('Street address'),
  city: Joi.string().trim().min(1).max(100).required().description('City name'),
  state: Joi.string().trim().min(1).max(100).required().description('State or province'),
  postalCode: Joi.string().trim().min(1).max(20).required().description('Postal or ZIP code'),
  country: Joi.string().trim().min(1).max(100).required().description('Country name'),
  phone: Joi.string().trim().max(20).optional().description('Optional phone number'),
});

/**
 * Validation schema for order tracking information
 */
const orderTrackingSchema = Joi.object({
  trackingNumber: Joi.string().trim().max(100).optional().description('Shipping tracking number'),
  carrier: Joi.string().trim().max(100).optional().description('Shipping carrier name'),
  shippedAt: Joi.date().optional().description('Date when order was shipped'),
  estimatedDelivery: Joi.date().optional().description('Estimated delivery date'),
});

/**
 * Validation schema for creating an order
 */
export const createOrderSchema = Joi.object({
  items: Joi.array()
    .items(orderItemSchema)
    .min(1)
    .required()
    .description('Array of items to order (at least one required)'),
  paymentMethod: Joi.string()
    .valid(...Object.values(PaymentMethod))
    .required()
    .description('Payment method for the order'),
  shippingAddress: shippingAddressSchema.required().description('Delivery address'),
  notes: Joi.string().trim().max(500).optional().description('Optional order notes'),
});

/**
 * Validation schema for updating an order
 */
export const updateOrderSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(OrderStatus))
    .optional()
    .description('New order status'),
  paymentStatus: Joi.string()
    .valid(...Object.values(PaymentStatus))
    .optional()
    .description('New payment status'),
  tracking: orderTrackingSchema.optional().description('Updated tracking information'),
  notes: Joi.string().trim().max(500).optional().description('Updated order notes'),
  shippingAddress: shippingAddressSchema.optional().description('Updated shipping address'),
});

/**
 * Validation schema for order query parameters
 */
export const orderQuerySchema = Joi.object({
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .optional()
    .description('Number of orders to return (1-100)'),
  lastOrderId: Joi.string().optional().description('Last order ID for pagination'),
  status: Joi.string()
    .valid(...Object.values(OrderStatus))
    .optional()
    .description('Filter by order status'),
});

/**
 * Validation schema for order statistics query
 */
export const orderStatsQuerySchema = Joi.object({
  startDate: Joi.date().optional().description('Start date for statistics (ISO 8601 format)'),
  endDate: Joi.date().optional().description('End date for statistics (ISO 8601 format)'),
}).custom((value, helpers) => {
  // Ensure endDate is after startDate if both are provided
  if (value.startDate && value.endDate && value.endDate < value.startDate) {
    return helpers.error('any.invalid', {
      message: 'End date must be after start date',
    });
  }
  return value;
});

/**
 * Validation schema for order ID parameter
 */
export const orderIdSchema = Joi.object({
  id: Joi.string().required().description('Order ID'),
});
