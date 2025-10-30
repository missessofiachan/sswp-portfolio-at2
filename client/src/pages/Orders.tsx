/**
 * Orders Page Component
 *
 * Displays a list of user orders with status, order details, and actions.
 * Includes order filtering, pagination, and order management.
 *
 * @fileoverview Orders list page
 * @module pages/Orders
 */

import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ordersApi } from '../api/clients/orders.api';
import ErrorAlert from '../components/ui/ErrorAlert';
import { showToast } from '../lib/toast';
import { ORDER_STATUS_INFO, PAYMENT_METHOD_INFO, OrderStatus, type Order } from '../types/orders';

/**
 * Orders page component
 */
export function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<any>(null);
  const [errorIndexUrl, setErrorIndexUrl] = useState<string | undefined>(undefined);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const result = await ordersApi.getMyOrders();
        setOrders(result.orders);
        setHasMore(result.hasMore);
      } catch (err) {
        const e: any = err;
        setError(e?.message || 'Failed to load orders');
        setErrorDetails(e?.details);
        setErrorIndexUrl(e?.indexUrl);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      setCancellingOrderId(orderId);
      await ordersApi.cancelOrder(orderId);
      // Refresh orders list
      const result = await ordersApi.getMyOrders();
      setOrders(result.orders);
      setHasMore(result.hasMore);
      showToast('Order cancelled successfully', { type: 'success' });
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to cancel order', { type: 'error' });
    } finally {
      setCancellingOrderId(null);
    }
  };

  const handleLoadMore = async () => {
    if (!hasMore || loadingMore || orders.length === 0) return;

    try {
      setLoadingMore(true);
      const lastOrderId = orders[orders.length - 1].id;
      const result = await ordersApi.getMyOrders({ lastOrderId });
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

  // Filter and search orders
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter((order) => order.status === statusFilter);
    }

    // Filter by search query (order ID or items)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (order) =>
          order.id.toLowerCase().includes(query) ||
          order.items.some((item) => item.productName.toLowerCase().includes(query))
      );
    }

    return result;
  }, [orders, statusFilter, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-2xl w-full space-y-4">
          <ErrorAlert message={error} details={errorDetails} indexUrl={errorIndexUrl} />
          <div className="text-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Orders Yet</h1>
          <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
          <Link
            to="/products"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 inline-block"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="mt-2 text-gray-600">Track and manage your orders</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status Filter */}
            <div>
              <label
                htmlFor="status-filter"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
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

            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Orders
              </label>
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by order ID or product name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Active Filters Summary */}
          {(statusFilter !== 'all' || searchQuery.trim()) && (
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">Active filters:</span>
              {statusFilter !== 'all' && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  Status: {ORDER_STATUS_INFO[statusFilter].label}
                </span>
              )}
              {searchQuery.trim() && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  Search: "{searchQuery}"
                </span>
              )}
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setSearchQuery('');
                }}
                className="ml-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredOrders.length} of {orders.length} orders
        </div>

        {/* No Results */}
        {filteredOrders.length === 0 && orders.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-600">No orders match your filters.</p>
            <button
              onClick={() => {
                setStatusFilter('all');
                setSearchQuery('');
              }}
              className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}

        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const statusInfo = ORDER_STATUS_INFO[order.status];
            const paymentInfo = PAYMENT_METHOD_INFO[order.paymentMethod];
            const canCancel = order.status === 'pending' || order.status === 'confirmed';

            return (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Order Header */}
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.id.slice(-8)}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: `${statusInfo.color}20`,
                          color: statusInfo.color,
                        }}
                      >
                        {statusInfo.label}
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0 flex space-x-2">
                      <Link
                        to={`/orders/${order.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Details
                      </Link>
                      {canCancel && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={cancellingOrderId === order.id}
                          className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {cancellingOrderId === order.id ? 'Cancelling...' : 'Cancel Order'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Content */}
                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Order Items */}
                    <div className="lg:col-span-2">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Items Ordered</h4>
                      <div className="space-y-3">
                        {order.items.slice(0, 3).map((item, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            {item.productImage && (
                              <div className="w-12 h-12 flex-shrink-0">
                                <img
                                  src={item.productImage}
                                  alt={item.productName}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {item.productName}
                              </p>
                              <p className="text-xs text-gray-500">
                                Qty: {item.quantity} × ${item.unitPrice.toFixed(2)}
                              </p>
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              ${item.totalPrice.toFixed(2)}
                            </div>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <p className="text-sm text-gray-500">
                            + {order.items.length - 3} more items
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Order Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal:</span>
                          <span className="text-gray-900">${order.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax:</span>
                          <span className="text-gray-900">${order.taxAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping:</span>
                          <span className="text-gray-900">
                            {order.shippingCost === 0
                              ? 'Free'
                              : `$${order.shippingCost.toFixed(2)}`}
                          </span>
                        </div>
                        <div className="border-t pt-2">
                          <div className="flex justify-between font-semibold">
                            <span className="text-gray-900">Total:</span>
                            <span className="text-gray-900">${order.totalAmount.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t">
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-600">Payment:</span>
                            <span className="text-gray-900">
                              {paymentInfo.icon} {paymentInfo.label}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Shipping Address</h4>
                    <div className="text-sm text-gray-600">
                      <p>{order.shippingAddress.fullName}</p>
                      <p>{order.shippingAddress.street}</p>
                      <p>
                        {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                        {order.shippingAddress.postalCode}
                      </p>
                      <p>{order.shippingAddress.country}</p>
                      {order.shippingAddress.phone && <p>Phone: {order.shippingAddress.phone}</p>}
                    </div>
                  </div>

                  {/* Order Notes */}
                  {order.notes && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Order Notes</h4>
                      <p className="text-sm text-gray-600">{order.notes}</p>
                    </div>
                  )}

                  {/* Tracking Information */}
                  {order.tracking && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Tracking Information
                      </h4>
                      <div className="text-sm text-gray-600">
                        {order.tracking.carrier && <p>Carrier: {order.tracking.carrier}</p>}
                        {order.tracking.trackingNumber && (
                          <p>Tracking Number: {order.tracking.trackingNumber}</p>
                        )}
                        {order.tracking.shippedAt && (
                          <p>Shipped: {new Date(order.tracking.shippedAt).toLocaleDateString()}</p>
                        )}
                        {order.tracking.estimatedDelivery && (
                          <p>
                            Estimated Delivery:{' '}
                            {new Date(order.tracking.estimatedDelivery).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-8 text-center">
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
    </div>
  );
}
