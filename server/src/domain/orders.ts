/**
 * Order Domain Types
 *
 * Defines the data structures and interfaces for the order management system.
 * Orders link products with customers and track the purchase lifecycle.
 *
 * @fileoverview Order domain types and interfaces
 * @module domain/orders
 */

/**
 * Order status enumeration
 *
 * @enum {string}
 */
export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

/**
 * Payment status enumeration
 *
 * @enum {string}
 */
export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

/**
 * Payment method enumeration
 *
 * @enum {string}
 */
export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BANK_TRANSFER = 'bank_transfer',
  CASH_ON_DELIVERY = 'cash_on_delivery',
}

/**
 * Individual item within an order
 *
 * @interface OrderItem
 * @property {string} productId - Reference to the product
 * @property {string} productName - Product name at time of order (for history)
 * @property {number} quantity - Number of items ordered
 * @property {number} unitPrice - Price per unit at time of order
 * @property {number} totalPrice - Total price for this line item (quantity * unitPrice)
 * @property {string} [productImage] - Product image URL at time of order
 */
export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productImage?: string;
}

/**
 * Shipping address information
 *
 * @interface ShippingAddress
 * @property {string} fullName - Recipient's full name
 * @property {string} street - Street address
 * @property {string} city - City name
 * @property {string} state - State or province
 * @property {string} postalCode - Postal/ZIP code
 * @property {string} country - Country name
 * @property {string} [phone] - Optional phone number
 */
export interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

/**
 * Order tracking information
 *
 * @interface OrderTracking
 * @property {string} [trackingNumber] - Shipping tracking number
 * @property {string} [carrier] - Shipping carrier name
 * @property {Date} [shippedAt] - When the order was shipped
 * @property {Date} [estimatedDelivery] - Estimated delivery date
 */
export interface OrderTracking {
  trackingNumber?: string;
  carrier?: string;
  shippedAt?: Date;
  estimatedDelivery?: Date;
}

/**
 * Complete order entity
 *
 * @interface Order
 * @property {string} id - Unique order identifier
 * @property {string} userId - ID of the user who placed the order
 * @property {string} userEmail - Email of the user (for reference)
 * @property {OrderItem[]} items - Array of ordered items
 * @property {number} subtotal - Sum of all item totals before tax/shipping
 * @property {number} taxAmount - Tax amount applied
 * @property {number} shippingCost - Shipping cost
 * @property {number} totalAmount - Final total amount (subtotal + tax + shipping)
 * @property {OrderStatus} status - Current order status
 * @property {PaymentStatus} paymentStatus - Current payment status
 * @property {PaymentMethod} paymentMethod - Payment method used
 * @property {ShippingAddress} shippingAddress - Delivery address
 * @property {OrderTracking} [tracking] - Optional tracking information
 * @property {string} [notes] - Optional order notes
 * @property {Date} createdAt - When the order was created
 * @property {Date} updatedAt - When the order was last updated
 */
export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  shippingAddress: ShippingAddress;
  tracking?: OrderTracking;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Order creation input (what users provide when placing an order)
 *
 * @interface CreateOrderInput
 * @property {Array<{productId: string, quantity: number}>} items - Items to order
 * @property {PaymentMethod} paymentMethod - Selected payment method
 * @property {ShippingAddress} shippingAddress - Delivery address
 * @property {string} [notes] - Optional order notes
 */
export interface CreateOrderInput {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  paymentMethod: PaymentMethod;
  shippingAddress: ShippingAddress;
  notes?: string;
}

/**
 * Order update input (for admin updates)
 *
 * @interface UpdateOrderInput
 * @property {OrderStatus} [status] - New order status
 * @property {PaymentStatus} [paymentStatus] - New payment status
 * @property {OrderTracking} [tracking] - Updated tracking information
 * @property {string} [notes] - Updated notes
 */
export interface UpdateOrderInput {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  tracking?: OrderTracking;
  notes?: string;
}

/**
 * Order statistics for admin dashboard
 *
 * @interface OrderStats
 * @property {number} totalOrders - Total number of orders
 * @property {number} totalRevenue - Total revenue from all orders
 * @property {number} averageOrderValue - Average order value
 * @property {number} pendingOrders - Number of pending orders
 * @property {Object} statusBreakdown - Orders grouped by status
 */
export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  pendingOrders: number;
  statusBreakdown: Record<OrderStatus, number>;
}
