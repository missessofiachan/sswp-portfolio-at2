/**
 * Order Detail Page
 *
 * Displays complete details of a single order including:
 * - Order status and timeline
 * - Items in the order
 * - Shipping information
 * - Payment details
 * - Order actions (cancel if allowed)
 *
 * @fileoverview Order detail page component
 * @module pages/OrderDetail
 */

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ordersApi } from '../api/clients/orders.api';
import { showToast } from '../lib/toast';
import type { Order } from '../types/orders';
import { ORDER_STATUS_INFO, PAYMENT_METHOD_INFO } from '../types/orders';
import * as styles from './OrderDetail.css';

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    if (!id) {
      setError('Order ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const orderData = await ordersApi.getOrder(id);
      setOrder(orderData);
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to load order';
      setError(errorMsg);
      showToast(errorMsg, { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;

    const confirmed = window.confirm(
      'Are you sure you want to cancel this order? This action cannot be undone.'
    );

    if (!confirmed) return;

    try {
      setCancelling(true);
      const updatedOrder = await ordersApi.cancelOrder(order.id);
      setOrder(updatedOrder);
      showToast('Order cancelled successfully', { type: 'success' });
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to cancel order';
      showToast(errorMsg, { type: 'error' });
    } finally {
      setCancelling(false);
    }
  };

  const canCancelOrder = (order: Order): boolean => {
    return (
      order.status === 'pending' || order.status === 'confirmed' || order.status === 'processing'
    );
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading order details...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Error</h2>
          <p>{error || 'Order not found'}</p>
          <Link to="/orders" className={styles.backLink}>
            ← Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = ORDER_STATUS_INFO[order.status];
  const paymentMethodInfo = PAYMENT_METHOD_INFO[order.paymentMethod];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link to="/orders" className={styles.backLink}>
          ← Back to Orders
        </Link>
        <h1 className={styles.title}>Order Details</h1>
        <p className={styles.orderId}>Order #{order.id}</p>
      </div>

      <div className={styles.grid}>
        {/* Status Card */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Status</h2>
          <div className={styles.statusBadge} style={{ backgroundColor: statusInfo.color }}>
            {statusInfo.label}
          </div>
          <p className={styles.statusDescription}>{statusInfo.description}</p>
          <div className={styles.dates}>
            <div>
              <strong>Placed:</strong> {new Date(order.createdAt).toLocaleDateString()}
            </div>
            <div>
              <strong>Updated:</strong> {new Date(order.updatedAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Payment Card */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Payment</h2>
          <div className={styles.paymentMethod}>
            <span className={styles.paymentIcon}>{paymentMethodInfo.icon}</span>
            <span>{paymentMethodInfo.label}</span>
          </div>
          <div className={styles.paymentStatus}>
            Status: <strong>{order.paymentStatus}</strong>
          </div>
        </div>

        {/* Shipping Card */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Shipping Address</h2>
          <address className={styles.address}>
            <strong>{order.shippingAddress.fullName}</strong>
            <br />
            {order.shippingAddress.street}
            <br />
            {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
            {order.shippingAddress.postalCode}
            <br />
            {order.shippingAddress.country}
            {order.shippingAddress.phone && (
              <>
                <br />
                Phone: {order.shippingAddress.phone}
              </>
            )}
          </address>
        </div>

        {/* Tracking Card (if available) */}
        {order.tracking && order.tracking.trackingNumber && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Tracking</h2>
            <div className={styles.tracking}>
              <div>
                <strong>Tracking Number:</strong> {order.tracking.trackingNumber}
              </div>
              {order.tracking.carrier && (
                <div>
                  <strong>Carrier:</strong> {order.tracking.carrier}
                </div>
              )}
              {order.tracking.shippedAt && (
                <div>
                  <strong>Shipped:</strong>{' '}
                  {new Date(order.tracking.shippedAt).toLocaleDateString()}
                </div>
              )}
              {order.tracking.estimatedDelivery && (
                <div>
                  <strong>Estimated Delivery:</strong>{' '}
                  {new Date(order.tracking.estimatedDelivery).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Order Items */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Order Items</h2>
        <div className={styles.itemsList}>
          {order.items.map((item, index) => (
            <div key={index} className={styles.item}>
              {item.productImage && (
                <img src={item.productImage} alt={item.productName} className={styles.itemImage} />
              )}
              <div className={styles.itemDetails}>
                <div className={styles.itemName}>{item.productName}</div>
                <div className={styles.itemMeta}>
                  Quantity: {item.quantity} × ${item.unitPrice.toFixed(2)}
                </div>
              </div>
              <div className={styles.itemPrice}>${item.totalPrice.toFixed(2)}</div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className={styles.summary}>
          <div className={styles.summaryRow}>
            <span>Subtotal:</span>
            <span>${order.subtotal.toFixed(2)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Tax:</span>
            <span>${order.taxAmount.toFixed(2)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Shipping:</span>
            <span>${order.shippingCost.toFixed(2)}</span>
          </div>
          <div className={styles.summaryRowTotal}>
            <span>Total:</span>
            <span>${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Notes (if any) */}
      {order.notes && (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Order Notes</h2>
          <p className={styles.notes}>{order.notes}</p>
        </div>
      )}

      {/* Actions */}
      {canCancelOrder(order) && (
        <div className={styles.actions}>
          <button onClick={handleCancelOrder} disabled={cancelling} className={styles.cancelButton}>
            {cancelling ? 'Cancelling...' : 'Cancel Order'}
          </button>
        </div>
      )}
    </div>
  );
}
