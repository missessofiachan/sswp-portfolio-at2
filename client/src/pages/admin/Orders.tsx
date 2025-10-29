/**
 * Admin Orders Management Page
 *
 * Allows administrators to view and manage all orders in the system.
 * Features include:
 * - View all orders with filtering
 * - Order statistics dashboard
 * - Update order status
 * - View order details
 * - Pagination
 *
 * @fileoverview Admin orders management page
 * @module pages/admin/Orders
 */

import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ordersApi } from '../../api/clients/orders.api';
import { showToast } from '../../lib/toast';
import { ORDER_STATUS_INFO, OrderStatus, type Order, type OrderStats } from '../../types/orders';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    loadOrders();
    loadStats();
  }, [statusFilter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await ordersApi.getAllOrders({
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      setOrders(result.orders);
      setHasMore(result.hasMore);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load orders';
      setError(errorMsg);
      showToast(errorMsg, { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await ordersApi.getOrderStats();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const handleLoadMore = async () => {
    if (!hasMore || loadingMore || orders.length === 0) return;

    try {
      setLoadingMore(true);
      const lastOrderId = orders[orders.length - 1].id;
      const result = await ordersApi.getAllOrders({
        lastOrderId,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      setOrders((prev) => [...prev, ...result.orders]);
      setHasMore(result.hasMore);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to load more orders', {
        type: 'error',
      });
    } finally {
      setLoadingMore(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await ordersApi.updateOrder(orderId, { status: newStatus });
      showToast('Order status updated successfully', { type: 'success' });
      // Reload orders and stats
      await loadOrders();
      await loadStats();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to update order', { type: 'error' });
    }
  };

  // Filter orders by search query
  const filteredOrders = useMemo(() => {
    if (!searchQuery.trim()) return orders;

    const query = searchQuery.toLowerCase();
    return orders.filter(
      (order) =>
        order.id.toLowerCase().includes(query) ||
        order.userEmail.toLowerCase().includes(query) ||
        order.items.some((item) => item.productName.toLowerCase().includes(query))
    );
  }, [orders, searchQuery]);

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
        <p className="mt-2 text-gray-600">Manage and track all customer orders</p>
      </div>

      {/* Statistics Dashboard */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-sm font-medium text-gray-600">Total Orders</div>
            <div className="mt-2 text-3xl font-bold text-gray-900">{stats.totalOrders}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-sm font-medium text-gray-600">Total Revenue</div>
            <div className="mt-2 text-3xl font-bold text-green-600">
              ${stats.totalRevenue.toFixed(2)}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-sm font-medium text-gray-600">Average Order Value</div>
            <div className="mt-2 text-3xl font-bold text-blue-600">
              ${stats.averageOrderValue.toFixed(2)}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-sm font-medium text-gray-600">Pending Orders</div>
            <div className="mt-2 text-3xl font-bold text-orange-600">{stats.pendingOrders}</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Orders</option>
              <option value={OrderStatus.PENDING}>Pending</option>
              <option value={OrderStatus.CONFIRMED}>Confirmed</option>
              <option value={OrderStatus.PROCESSING}>Processing</option>
              <option value={OrderStatus.SHIPPED}>Shipped</option>
              <option value={OrderStatus.DELIVERED}>Delivered</option>
              <option value={OrderStatus.CANCELLED}>Cancelled</option>
              <option value={OrderStatus.REFUNDED}>Refunded</option>
            </select>
          </div>
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Orders
            </label>
            <input
              id="search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order ID, email, or product..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredOrders.length} of {orders.length} orders
      </div>

      {/* Orders Table */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">{error}</div>
      )}

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-600">No orders found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => {
                  const statusInfo = ORDER_STATUS_INFO[order.status];
                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.id.slice(-8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {order.userEmail}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${order.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleUpdateStatus(order.id, e.target.value as OrderStatus)
                          }
                          className="text-sm rounded px-2 py-1 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          style={{
                            backgroundColor: `${statusInfo.color}20`,
                            color: statusInfo.color,
                          }}
                        >
                          <option value={OrderStatus.PENDING}>Pending</option>
                          <option value={OrderStatus.CONFIRMED}>Confirmed</option>
                          <option value={OrderStatus.PROCESSING}>Processing</option>
                          <option value={OrderStatus.SHIPPED}>Shipped</option>
                          <option value={OrderStatus.DELIVERED}>Delivered</option>
                          <option value={OrderStatus.CANCELLED}>Cancelled</option>
                          <option value={OrderStatus.REFUNDED}>Refunded</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          to={`/orders/${order.id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loadingMore ? 'Loading...' : 'Load More Orders'}
          </button>
        </div>
      )}
    </div>
  );
}
