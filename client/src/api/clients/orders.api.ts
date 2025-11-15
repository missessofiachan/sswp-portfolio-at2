/**
 * Order API Client
 *
 * HTTP client for order-related operations in the frontend.
 * Handles order creation, retrieval, updates, and provides proper error handling.
 *
 * @fileoverview Order API client for frontend
 * @module api/clients/orders
 */

import { axiosInstance } from '../../lib/axios';
import type {
  CreateOrderInput,
  Order,
  OrderListResponse,
  OrderResponse,
  OrderStatsResponse,
  OrderStatus,
  UpdateOrderInput,
} from '../../types/orders';

/**
 * Order API client class
 *
 * @class OrdersApi
 */
export class OrdersApi {
  private readonly baseUrl = '/orders';

  /**
   * Create a new order
   *
   * @param {CreateOrderInput} orderData - Order data to create
   * @returns {Promise<Order>} The created order
   * @throws {Error} If order creation fails
   */
  async createOrder(orderData: CreateOrderInput): Promise<Order> {
    try {
      const response = await axiosInstance.post<OrderResponse>(this.baseUrl, orderData);

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'Failed to create order');
      }

      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to create order. Please try again.');
    }
  }

  /**
   * Get an order by ID
   *
   * @param {string} orderId - Order ID to retrieve
   * @returns {Promise<Order>} The order
   * @throws {Error} If order not found or access denied
   */
  async getOrder(orderId: string): Promise<Order> {
    try {
      const response = await axiosInstance.get<OrderResponse>(`${this.baseUrl}/${orderId}`);

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'Order not found');
      }

      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Order not found');
      }
      if (error.response?.status === 403) {
        throw new Error('Access denied to this order');
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to get order. Please try again.');
    }
  }

  /**
   * Get current user's orders
   *
   * @param {Object} [params] - Query parameters
   * @param {number} [params.limit] - Number of orders to return
   * @param {string} [params.lastOrderId] - Last order ID for pagination
   * @returns {Promise<{orders: Order[], hasMore: boolean}>} User orders with pagination info
   * @throws {Error} If request fails
   */
  async getMyOrders(params?: {
    limit?: number;
    lastOrderId?: string;
  }): Promise<{ orders: Order[]; hasMore: boolean }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.lastOrderId) queryParams.append('lastOrderId', params.lastOrderId);

      const url = queryParams.toString()
        ? `${this.baseUrl}/my?${queryParams.toString()}`
        : `${this.baseUrl}/my`;

      const response = await axiosInstance.get<OrderListResponse>(url);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to get orders');
      }

      return {
        orders: response.data.data || [],
        hasMore: response.data.meta?.hasMore || false,
      };
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to get orders. Please try again.');
    }
  }

  /**
   * Get all orders (admin only)
   *
   * @param {Object} [params] - Query parameters
   * @param {number} [params.limit] - Number of orders to return
   * @param {string} [params.lastOrderId] - Last order ID for pagination
   * @param {OrderStatus} [params.status] - Filter by order status
   * @returns {Promise<{orders: Order[], hasMore: boolean}>} All orders with pagination info
   * @throws {Error} If request fails or access denied
   */
  async getAllOrders(params?: {
    limit?: number;
    lastOrderId?: string;
    status?: OrderStatus;
  }): Promise<{ orders: Order[]; hasMore: boolean }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.lastOrderId) queryParams.append('lastOrderId', params.lastOrderId);
      if (params?.status) queryParams.append('status', params.status);

      const url = queryParams.toString()
        ? `${this.baseUrl}?${queryParams.toString()}`
        : this.baseUrl;

      const response = await axiosInstance.get<OrderListResponse>(url);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to get orders');
      }

      return {
        orders: response.data.data || [],
        hasMore: response.data.meta?.hasMore || false,
      };
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('Admin access required');
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to get orders. Please try again.');
    }
  }

  /**
   * Update an order
   *
   * @param {string} orderId - Order ID to update
   * @param {UpdateOrderInput} updateData - Data to update
   * @returns {Promise<Order>} The updated order
   * @throws {Error} If update fails or access denied
   */
  async updateOrder(orderId: string, updateData: UpdateOrderInput): Promise<Order> {
    try {
      const response = await axiosInstance.put<OrderResponse>(
        `${this.baseUrl}/${orderId}`,
        updateData
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'Failed to update order');
      }

      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('Access denied to update this order');
      }
      if (error.response?.status === 404) {
        throw new Error('Order not found');
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to update order. Please try again.');
    }
  }

  /**
   * Cancel an order
   *
   * @param {string} orderId - Order ID to cancel
   * @returns {Promise<Order>} The cancelled order
   * @throws {Error} If cancellation fails or access denied
   */
  async cancelOrder(orderId: string): Promise<Order> {
    try {
      const response = await axiosInstance.post<OrderResponse>(`${this.baseUrl}/${orderId}/cancel`);

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'Failed to cancel order');
      }

      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('Access denied to cancel this order');
      }
      if (error.response?.status === 404) {
        throw new Error('Order not found');
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to cancel order. Please try again.');
    }
  }

  /**
   * Delete an order (admin only)
   *
   * @param {string} orderId - Order ID to delete
   * @returns {Promise<void>}
   * @throws {Error} If deletion fails or access denied
   */
  async deleteOrder(orderId: string): Promise<void> {
    try {
      const response = await axiosInstance.delete<{ success: boolean; message?: string }>(
        `${this.baseUrl}/${orderId}`
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete order');
      }
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('Admin access required');
      }
      if (error.response?.status === 404) {
        throw new Error('Order not found');
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to delete order. Please try again.');
    }
  }

  /**
   * Get order statistics (admin only)
   *
   * @param {Object} [params] - Query parameters
   * @param {Date} [params.startDate] - Start date for statistics
   * @param {Date} [params.endDate] - End date for statistics
   * @returns {Promise<OrderStats>} Order statistics
   * @throws {Error} If request fails or access denied
   */
  async getOrderStats(params?: {
    startDate?: Date;
    endDate?: Date;
  }): Promise<import('../../types/orders').OrderStats> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.startDate) {
        queryParams.append('startDate', params.startDate.toISOString());
      }
      if (params?.endDate) {
        queryParams.append('endDate', params.endDate.toISOString());
      }

      const url = queryParams.toString()
        ? `${this.baseUrl}/stats?${queryParams.toString()}`
        : `${this.baseUrl}/stats`;

      const response = await axiosInstance.get<OrderStatsResponse>(url);

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'Failed to get order statistics');
      }

      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('Admin access required');
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to get order statistics. Please try again.');
    }
  }
}

/**
 * Default order API client instance
 */
export const ordersApi = new OrdersApi();
