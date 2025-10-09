/**
 * Orders Page Component
 *
 * Displays a list of user orders with status, order details, and actions.
 * Includes order filtering, pagination, and order management.
 *
 * @fileoverview Orders list page
 * @module pages/Orders
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ordersApi } from '../api/clients/orders.api';
import { ORDER_STATUS_INFO, PAYMENT_METHOD_INFO, type Order } from '../types/orders';

/**
 * Orders page component
 */
export function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const result = await ordersApi.getMyOrders();
        setOrders(result.orders);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load orders');
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
      await ordersApi.cancelOrder(orderId);
      // Refresh orders list
      const result = await ordersApi.getMyOrders();
      setOrders(result.orders);
      alert('Order cancelled successfully');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to cancel order');
    }
  };

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Orders</h1>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
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

        <div className="space-y-6">
          {orders.map((order) => {
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
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Cancel Order
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
                              <img
                                src={item.productImage}
                                alt={item.productName}
                                className="w-12 h-12 object-cover rounded-lg"
                              />
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
      </div>
    </div>
  );
}
