/**
 * Firestore Order Repository Implementation
 *
 * Implements the OrderRepository interface using Firestore as the data store.
 * Handles order CRUD operations, user order queries, and order statistics.
 *
 * @fileoverview Firestore implementation of order repository
 * @module data/firestore/FirestoreOrderRepository
 */

import * as admin from 'firebase-admin';
import { getDb } from '../../config/firestore';
import { OrderRepository } from '../ports/OrderRepository';
import {
  Order,
  CreateOrderInput,
  UpdateOrderInput,
  OrderStats,
  OrderStatus,
  PaymentStatus,
} from '../../domain/orders';
import { ProductRepository } from '../ports/ProductRepository';

/**
 * Firestore implementation of the order repository
 *
 * @class FirestoreOrderRepository
 * @implements {OrderRepository}
 */
export class FirestoreOrderRepository implements OrderRepository {
  private readonly collectionName = 'orders';
  private productRepository: ProductRepository;

  // Shipping configuration (can be injected or loaded from config in future)
  private readonly freeShippingThreshold = 100;
  private readonly defaultShippingCost = 10;

  /**
   * Create a new FirestoreOrderRepository instance
   *
   * @param {ProductRepository} productRepository - Product repository for order validation
   */
  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }
  async getStats(startDate?: Date, endDate?: Date): Promise<OrderStats> {
    const db = getDb();
    let baseQuery: admin.firestore.Query = db.collection(this.collectionName);

    if (startDate) {
      baseQuery = baseQuery.where('createdAt', '>=', admin.firestore.Timestamp.fromDate(startDate));
    }

    if (endDate) {
      baseQuery = baseQuery.where('createdAt', '<=', admin.firestore.Timestamp.fromDate(endDate));
    }

    // Total orders using Firestore count() aggregation
    const totalOrdersAgg = await baseQuery.count().get();
    const totalOrders = totalOrdersAgg.data()?.count ?? 0;

    // Pending orders count
    const pendingOrdersAgg = await baseQuery
      .where('status', '==', OrderStatus.PENDING)
      .count()
      .get();
    const pendingOrders = pendingOrdersAgg.data()?.count ?? 0;

    // Status breakdown
    const statusBreakdown: Record<OrderStatus, number> = {} as Record<OrderStatus, number>;
    for (const status of Object.values(OrderStatus) as OrderStatus[]) {
      const statusAgg = await baseQuery.where('status', '==', status).count().get();
      statusBreakdown[status] = statusAgg.data()?.count ?? 0;
    }

    // Calculate revenue and average order value by selecting only totalAmount
    const revenueSnapshot = await baseQuery.select('totalAmount').get();
    let totalRevenue = 0;
    revenueSnapshot.forEach((doc) => {
      const data = doc.data();
      const amt = data?.totalAmount;
      if (typeof amt === 'number') {
        totalRevenue += amt;
      }
    });

    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalOrders,
      totalRevenue,
      averageOrderValue,
      pendingOrders,
      statusBreakdown,
    };
  }

  /**
   * Create a new order with product validation and pricing
   *
   * @param {CreateOrderInput} orderData - Order data to create
   * @param {string} userId - ID of the user creating the order
   * @param {string} userEmail - Email of the user creating the order
   * @returns {Promise<Order>} The created order
   * @throws {Error} If product validation fails or order creation fails
   */
  async create(orderData: CreateOrderInput, userId: string, userEmail: string): Promise<Order> {
    const db = getDb();
    const batch = db.batch();
    const orderDocRef = db.collection(this.collectionName).doc();

    // Validate products and calculate pricing
    const orderItems = [];
    let subtotal = 0;

    // Fetch all products in parallel
    const products = await Promise.all(
      orderData.items.map((item) => this.productRepository.findById(item.productId))
    );

    for (let i = 0; i < orderData.items.length; i++) {
      const item = orderData.items[i];
      const product = products[i];
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      if (item.quantity <= 0) {
        throw new Error(`Invalid quantity for product ${product.name}: ${item.quantity}`);
      }

      const itemTotal = product.price * item.quantity;
      orderItems.push({
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: product.price,
        totalPrice: itemTotal,
        productImage: product.imageUrls?.[0],
      });

      subtotal += itemTotal;
    }

    // Calculate tax and shipping (shipping logic is now configurable)
    const taxRate = 0.1; // 10% tax
    const taxAmount = subtotal * taxRate;
    const shippingCost = this.calculateShippingCost(subtotal);
    const totalAmount = subtotal + taxAmount + shippingCost;

    const now = new Date();
    const order: Omit<Order, 'id'> = {
      userId,
      userEmail,
      items: orderItems,
      subtotal,
      taxAmount,
      shippingCost,
      totalAmount,
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      paymentMethod: orderData.paymentMethod,
      shippingAddress: orderData.shippingAddress,
      notes: orderData.notes,
      createdAt: now,
      updatedAt: now,
    };

    // Convert dates to Firestore timestamps for storage
    const firestoreOrder = {
      ...order,
      createdAt: admin.firestore.Timestamp.fromDate(order.createdAt),
      updatedAt: admin.firestore.Timestamp.fromDate(order.updatedAt),
    };

    batch.set(orderDocRef, firestoreOrder);
    await batch.commit();

    return {
      id: orderDocRef.id,
      ...order,
    };
  }

  /**
   * Find an order by ID
   *
   * @param {string} id - Order ID to find
   * @returns {Promise<Order | null>} The order if found, null otherwise
   */
  async findById(id: string): Promise<Order | null> {
    const db = getDb();
    const orderDoc = await db.collection(this.collectionName).doc(id).get();

    if (!orderDoc.exists) {
      return null;
    }

    return this.mapFirestoreDocToOrder(orderDoc.id, orderDoc.data()!);
  }

  /**
   * Find all orders for a specific user
   *
   * @param {string} userId - User ID to find orders for
   * @param {number} [limit] - Optional limit for pagination
   * @param {string} [lastOrderId] - Optional last order ID for pagination
   * @returns {Promise<Order[]>} Array of user orders
   */
  async findByUserId(userId: string, limit?: number, lastOrderId?: string): Promise<Order[]> {
    const db = getDb();
    let query = db
      .collection(this.collectionName)
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc');

    if (limit) {
      query = query.limit(limit);
    }

    if (lastOrderId) {
      const lastOrderDoc = await db.collection(this.collectionName).doc(lastOrderId).get();
      if (lastOrderDoc.exists) {
        query = query.startAfter(lastOrderDoc);
      }
    }

    const snapshot = await query.get();
    return snapshot.docs.map((doc: admin.firestore.QueryDocumentSnapshot) =>
      this.mapFirestoreDocToOrder(doc.id, doc.data())
    );
  }

  /**
   * Find all orders (admin function)
   *
   * @param {number} [limit] - Optional limit for pagination
   * @param {string} [lastOrderId] - Optional last order ID for pagination
   * @param {OrderStatus} [status] - Optional status filter
   * @returns {Promise<Order[]>} Array of all orders
   */
  async findAll(limit?: number, lastOrderId?: string, status?: OrderStatus): Promise<Order[]> {
    const db = getDb();
    let query = db.collection(this.collectionName).orderBy('createdAt', 'desc');

    if (status) {
      query = db
        .collection(this.collectionName)
        .where('status', '==', status)
        .orderBy('createdAt', 'desc');
    }

    if (limit) {
      query = query.limit(limit);
    }

    if (lastOrderId) {
      const lastOrderDoc = await db.collection(this.collectionName).doc(lastOrderId).get();
      if (lastOrderDoc.exists) {
        query = query.startAfter(lastOrderDoc);
      }
    }

    const snapshot = await query.get();
    return snapshot.docs.map((doc: admin.firestore.QueryDocumentSnapshot) =>
      this.mapFirestoreDocToOrder(doc.id, doc.data())
    );
  }

  /**
   * Update an existing order
   *
   * @param {string} id - Order ID to update
   * @param {UpdateOrderInput} updateData - Data to update
   * @returns {Promise<Order>} The updated order
   * @throws {Error} If order not found or update fails
   */
  async update(id: string, updateData: UpdateOrderInput): Promise<Order> {
    const db = getDb();
    const orderRef = db.collection(this.collectionName).doc(id);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      throw new Error(`Order not found: ${id}`);
    }

    const updatePayload: any = {
      ...updateData,
      updatedAt: admin.firestore.Timestamp.fromDate(new Date()),
    };

    // Convert tracking dates to Firestore timestamps if present
    if (updateData.tracking?.shippedAt) {
      updatePayload.tracking = {
        ...updateData.tracking,
        shippedAt: admin.firestore.Timestamp.fromDate(updateData.tracking.shippedAt),
      };
    }

    if (updateData.tracking?.estimatedDelivery) {
      updatePayload.tracking = {
        ...updatePayload.tracking,
        estimatedDelivery: admin.firestore.Timestamp.fromDate(
          updateData.tracking.estimatedDelivery
        ),
      };
    }

    await orderRef.update(updatePayload);

    const updatedDoc = await orderRef.get();
    return this.mapFirestoreDocToOrder(updatedDoc.id, updatedDoc.data()!);
  }

  /**
   * Delete an order (admin function)
   *
   * @param {string} id - Order ID to delete
   * @returns {Promise<void>}
   * @throws {Error} If order not found
   */
  async delete(id: string): Promise<void> {
    const db = getDb();
    const orderRef = db.collection(this.collectionName).doc(id);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      throw new Error(`Order not found: ${id}`);
    }

    await orderRef.delete();
  }

  /**
   * Check if user owns the order
   *
   * @param {string} orderId - Order ID to check
   * @param {string} userId - User ID to verify ownership
   * @returns {Promise<boolean>} True if user owns the order
   */
  async isOwnedByUser(orderId: string, userId: string): Promise<boolean> {
    const order = await this.findById(orderId);
    return order?.userId === userId;
  }

  /**
   * Calculate shipping cost based on subtotal.
   * This logic is configurable via class properties.
   *
   * @private
   * @param {number} subtotal - The order subtotal
   * @returns {number} Shipping cost
   */
  private calculateShippingCost(subtotal: number): number {
    return subtotal > this.freeShippingThreshold ? 0 : this.defaultShippingCost;
  }

  /**
   * Map Firestore document data to Order domain object
   *
   * @private
   * @param {string} id - Document ID
   * @param {admin.firestore.DocumentData} data - Firestore document data
   * @returns {Order} Mapped order object
   */
  private mapFirestoreDocToOrder(id: string, data: admin.firestore.DocumentData): Order {
    return {
      id,
      userId: data.userId,
      userEmail: data.userEmail,
      items: data.items,
      subtotal: data.subtotal,
      taxAmount: data.taxAmount,
      shippingCost: data.shippingCost,
      totalAmount: data.totalAmount,
      status: data.status,
      paymentStatus: data.paymentStatus,
      paymentMethod: data.paymentMethod,
      shippingAddress: data.shippingAddress,
      tracking: data.tracking
        ? {
            ...data.tracking,
            shippedAt: data.tracking.shippedAt?.toDate(),
            estimatedDelivery: data.tracking.estimatedDelivery?.toDate(),
          }
        : undefined,
      notes: data.notes,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    };
  }
}
