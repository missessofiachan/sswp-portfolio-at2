/**
 * Order Domain Types
 * Defines the data structures and interfaces for the order management system.
 * Orders link products with customers and track the purchase lifecycle.
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
 */
export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BANK_TRANSFER = 'bank_transfer',
  CASH_ON_DELIVERY = 'cash_on_delivery',
}

/**
 * Individual item within an order

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

 */
export interface OrderTracking {
  trackingNumber?: string;
  carrier?: string;
  shippedAt?: Date;
  estimatedDelivery?: Date;
}

/**
 * Complete order entity
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

 */
export interface UpdateOrderInput {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  tracking?: OrderTracking;
  notes?: string;
  shippingAddress?: ShippingAddress;
}

/**
 * Order statistics for admin dashboard

 */
export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  pendingOrders: number;
  statusBreakdown: Record<OrderStatus, number>;
}
