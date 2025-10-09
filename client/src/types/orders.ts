/**
 * Order Types for Frontend
 *
 * TypeScript types and interfaces for order management in the frontend.
 * These types correspond to the backend order domain but are optimized for UI use.
 *
 * @fileoverview Frontend order types and interfaces
 * @module types/orders
 */

/**
 * Order status enumeration
 */
export const OrderStatus = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

/**
 * Payment status enumeration
 */
export const PaymentStatus = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

/**
 * Payment method enumeration
 */
export const PaymentMethod = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  BANK_TRANSFER: 'bank_transfer',
  CASH_ON_DELIVERY: 'cash_on_delivery',
} as const;

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

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
  shippedAt?: string; // ISO string for frontend
  estimatedDelivery?: string; // ISO string for frontend
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
  createdAt: string; // ISO string for frontend
  updatedAt: string; // ISO string for frontend
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

/**
 * API response wrapper for orders
 */
export interface OrderResponse {
  success: boolean;
  data?: Order;
  message?: string;
}

/**
 * API response wrapper for order list
 */
export interface OrderListResponse {
  success: boolean;
  data?: Order[];
  meta?: {
    count: number;
    hasMore: boolean;
  };
  message?: string;
}

/**
 * API response wrapper for order statistics
 */
export interface OrderStatsResponse {
  success: boolean;
  data?: OrderStats;
  message?: string;
}

/**
 * Cart item for order creation
 */
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

/**
 * Order status display information
 */
export interface OrderStatusInfo {
  status: OrderStatus;
  label: string;
  color: string;
  description: string;
}

/**
 * Payment method display information
 */
export interface PaymentMethodInfo {
  method: PaymentMethod;
  label: string;
  icon?: string;
}

/**
 * Helper functions for order status display
 */
export const ORDER_STATUS_INFO: Record<OrderStatus, OrderStatusInfo> = {
  [OrderStatus.PENDING]: {
    status: OrderStatus.PENDING,
    label: 'Pending',
    color: '#f59e0b',
    description: 'Order is awaiting confirmation',
  },
  [OrderStatus.CONFIRMED]: {
    status: OrderStatus.CONFIRMED,
    label: 'Confirmed',
    color: '#3b82f6',
    description: 'Order confirmed and being prepared',
  },
  [OrderStatus.PROCESSING]: {
    status: OrderStatus.PROCESSING,
    label: 'Processing',
    color: '#8b5cf6',
    description: 'Order is being processed',
  },
  [OrderStatus.SHIPPED]: {
    status: OrderStatus.SHIPPED,
    label: 'Shipped',
    color: '#06b6d4',
    description: 'Order has been shipped',
  },
  [OrderStatus.DELIVERED]: {
    status: OrderStatus.DELIVERED,
    label: 'Delivered',
    color: '#10b981',
    description: 'Order has been delivered',
  },
  [OrderStatus.CANCELLED]: {
    status: OrderStatus.CANCELLED,
    label: 'Cancelled',
    color: '#ef4444',
    description: 'Order has been cancelled',
  },
  [OrderStatus.REFUNDED]: {
    status: OrderStatus.REFUNDED,
    label: 'Refunded',
    color: '#6b7280',
    description: 'Order has been refunded',
  },
};

/**
 * Helper functions for payment method display
 */
export const PAYMENT_METHOD_INFO: Record<PaymentMethod, PaymentMethodInfo> = {
  [PaymentMethod.CREDIT_CARD]: {
    method: PaymentMethod.CREDIT_CARD,
    label: 'Credit Card',
    icon: '💳',
  },
  [PaymentMethod.DEBIT_CARD]: {
    method: PaymentMethod.DEBIT_CARD,
    label: 'Debit Card',
    icon: '💳',
  },
  [PaymentMethod.BANK_TRANSFER]: {
    method: PaymentMethod.BANK_TRANSFER,
    label: 'Bank Transfer',
    icon: '🏦',
  },
  [PaymentMethod.CASH_ON_DELIVERY]: {
    method: PaymentMethod.CASH_ON_DELIVERY,
    label: 'Cash on Delivery',
    icon: '💵',
  },
};
