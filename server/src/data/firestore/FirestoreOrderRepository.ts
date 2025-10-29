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

/**
 * Firestore implementation of the order repository
 *
 * @class FirestoreOrderRepository
 * @implements {OrderRepository}
 */
export class FirestoreOrderRepository implements OrderRepository {
  private readonly collectionName = 'orders';
  private readonly productsCollectionName = 'products';

  // Shipping configuration (can be injected or loaded from config in future)
  private readonly freeShippingThreshold = 100;
  private readonly defaultShippingCost = 10;
  async getStats(startDate?: Date, endDate?: Date): Promise<OrderStats> {
    const db = getDb();
    let baseQuery: admin.firestore.Query = db.collection(this.collectionName);

    if (startDate) {
      baseQuery = baseQuery.where('createdAt', '>=', admin.firestore.Timestamp.fromDate(startDate));
    }

    if (endDate) {
      baseQuery = baseQuery.where('createdAt', '<=', admin.firestore.Timestamp.fromDate(endDate));
    }

    const statusValues = Object.values(OrderStatus) as OrderStatus[];
    const countsPromise = Promise.all([
      baseQuery.count().get(),
      ...statusValues.map((status) => baseQuery.where('status', '==', status).count().get()),
    ]);
    const revenuePromise = baseQuery.select('totalAmount').get();

    const [countResults, revenueSnapshot] = await Promise.all([countsPromise, revenuePromise]);
    const [totalOrdersAgg, ...statusAggs] = countResults;
    const totalOrders = totalOrdersAgg.data()?.count ?? 0;

    const statusBreakdown: Record<OrderStatus, number> = {} as Record<OrderStatus, number>;
    statusValues.forEach((status, index) => {
      const count = statusAggs[index]?.data()?.count ?? 0;
      statusBreakdown[status] = count;
    });
    const pendingOrders = statusBreakdown[OrderStatus.PENDING] ?? 0;

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
    const orderDocRef = db.collection(this.collectionName).doc();
    const now = new Date();

    await db.runTransaction(async (tx) => {
      const orderItems: Order['items'] = [];
      let subtotal = 0;

      for (const item of orderData.items) {
        const quantity = Math.floor(item.quantity);
        if (!Number.isFinite(quantity) || quantity <= 0) {
          throw new Error(`Invalid quantity for product ${item.productId}: ${item.quantity}`);
        }

        const productRef = db.collection(this.productsCollectionName).doc(item.productId);
        const productSnap = await tx.get(productRef);

        if (!productSnap.exists) {
          throw this.createProductNotFoundError(item.productId);
        }

        const productData = productSnap.data() || {};
        const productName =
          typeof productData.name === 'string' ? productData.name : 'Unnamed product';
        const unitPriceRaw = Number(productData.price ?? 0);
        const unitPrice = Number.isFinite(unitPriceRaw) && unitPriceRaw >= 0 ? unitPriceRaw : 0;

        const stockRaw =
          typeof productData.stock === 'number'
            ? productData.stock
            : typeof productData.stock === 'string'
              ? Number(productData.stock)
              : 0;
        const availableStock =
          Number.isFinite(stockRaw) && stockRaw >= 0 ? Math.floor(stockRaw) : 0;

        if (quantity > availableStock) {
          throw this.createInsufficientStockError(
            item.productId,
            productName,
            availableStock,
            quantity
          );
        }

        const itemTotal = unitPrice * quantity;
        subtotal += itemTotal;

        const productImageCandidate =
          Array.isArray(productData.images) && typeof productData.images[0] === 'string'
            ? (productData.images[0] as string)
            : Array.isArray(productData.imageUrls) && typeof productData.imageUrls[0] === 'string'
              ? (productData.imageUrls[0] as string)
              : undefined;

        const orderItem: Order['items'][number] = {
          productId: item.productId,
          productName,
          quantity,
          unitPrice,
          totalPrice: itemTotal,
        };

        if (typeof productImageCandidate === 'string') {
          orderItem.productImage = productImageCandidate;
        }

        orderItems.push(orderItem);

        tx.update(productRef, {
          stock: admin.firestore.FieldValue.increment(-quantity),
        });
      }

      const taxRate = 0.1;
      const taxAmount = subtotal * taxRate;
      const shippingCost = this.calculateShippingCost(subtotal);
      const totalAmount = subtotal + taxAmount + shippingCost;

      const firestoreOrder = {
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
        createdAt: admin.firestore.Timestamp.fromDate(now),
        updatedAt: admin.firestore.Timestamp.fromDate(now),
        inventoryReleased: false,
      };

      tx.set(orderDocRef, firestoreOrder);
    });

    // Fetch the created order to return complete data
    const createdDoc = await orderDocRef.get();
    return this.mapFirestoreDocToOrder(createdDoc.id, createdDoc.data()!);
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
    let query: admin.firestore.Query = db
      .collection(this.collectionName)
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc');

    if (lastOrderId) {
      const cursorDoc = await db.collection(this.collectionName).doc(lastOrderId).get();
      if (cursorDoc.exists) {
        const data = cursorDoc.data();
        if (data?.userId === userId) {
          query = query.startAfter(cursorDoc);
        }
      }
    }

    if (limit && Number.isFinite(limit)) {
      query = query.limit(limit);
    }

    const snapshot = await query.get();
    return snapshot.docs.map((doc) => this.mapFirestoreDocToOrder(doc.id, doc.data()));
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
    let query: admin.firestore.Query = db.collection(this.collectionName);

    if (status) {
      query = query.where('status', '==', status);
    }

    query = query.orderBy('createdAt', 'desc');

    if (lastOrderId) {
      const cursorDoc = await db.collection(this.collectionName).doc(lastOrderId).get();
      if (cursorDoc.exists) {
        const data = cursorDoc.data();
        if (!status || data?.status === status) {
          query = query.startAfter(cursorDoc);
        }
      }
    }

    if (limit && Number.isFinite(limit)) {
      query = query.limit(limit);
    }

    const snapshot = await query.get();
    return snapshot.docs.map((doc) => this.mapFirestoreDocToOrder(doc.id, doc.data()));
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
    const now = new Date();

    await db.runTransaction(async (tx) => {
      const orderDoc = await tx.get(orderRef);

      if (!orderDoc.exists) {
        throw this.createOrderNotFoundError(id);
      }

      const existing = orderDoc.data() || {};
      const updatePayload: Record<string, unknown> = {
        updatedAt: admin.firestore.Timestamp.fromDate(now),
      };

      if (updateData.status !== undefined) {
        updatePayload.status = updateData.status;
      }
      if (updateData.paymentStatus !== undefined) {
        updatePayload.paymentStatus = updateData.paymentStatus;
      }
      if (updateData.notes !== undefined) {
        updatePayload.notes = updateData.notes;
      }
      if (updateData.shippingAddress !== undefined) {
        updatePayload.shippingAddress = updateData.shippingAddress;
      }
      if (updateData.tracking) {
        const tracking: Record<string, unknown> = { ...updateData.tracking };
        if (updateData.tracking.shippedAt) {
          tracking.shippedAt = admin.firestore.Timestamp.fromDate(updateData.tracking.shippedAt);
        }
        if (updateData.tracking.estimatedDelivery) {
          tracking.estimatedDelivery = admin.firestore.Timestamp.fromDate(
            updateData.tracking.estimatedDelivery
          );
        }
        updatePayload.tracking = tracking;
      }

      const currentStatus = existing.status as OrderStatus;
      const inventoryReleased = existing.inventoryReleased === true;
      const willReleaseInventory =
        updateData.status !== undefined &&
        [OrderStatus.CANCELLED, OrderStatus.REFUNDED].includes(updateData.status) &&
        !inventoryReleased &&
        ![OrderStatus.CANCELLED, OrderStatus.REFUNDED].includes(currentStatus as OrderStatus);

      if (willReleaseInventory) {
        const items = Array.isArray(existing.items) ? existing.items : [];
        await this.restoreInventory(tx, db, items);
        updatePayload.inventoryReleased = true;
      }

      tx.update(orderRef, updatePayload);
    });

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

    await db.runTransaction(async (tx) => {
      const orderDoc = await tx.get(orderRef);

      if (!orderDoc.exists) {
        throw this.createOrderNotFoundError(id);
      }

      const data = orderDoc.data() || {};
      if (data.inventoryReleased !== true) {
        const items = Array.isArray(data.items) ? data.items : [];
        await this.restoreInventory(tx, db, items);
      }

      tx.delete(orderRef);
    });
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

  private createInsufficientStockError(
    productId: string,
    productName: string,
    available: number,
    requested: number
  ): Error {
    const error = new Error(
      `Insufficient stock for ${productName}. Requested ${requested}, but only ${available} left.`
    );
    (error as any).code = 'INSUFFICIENT_STOCK';
    (error as any).productId = productId;
    (error as any).available = available;
    (error as any).requested = requested;
    return error;
  }

  private createProductNotFoundError(productId: string): Error {
    const error = new Error(`Product not found: ${productId}`);
    (error as any).code = 'PRODUCT_NOT_FOUND';
    (error as any).productId = productId;
    return error;
  }

  private createOrderNotFoundError(orderId: string): Error {
    const error = new Error(`Order not found: ${orderId}`);
    (error as any).status = 404;
    return error;
  }

  private async restoreInventory(
    tx: admin.firestore.Transaction,
    db: admin.firestore.Firestore,
    items: Array<{ productId?: string; quantity?: number }>
  ): Promise<void> {
    if (!Array.isArray(items)) return;
    for (const item of items) {
      const productId = typeof item.productId === 'string' ? item.productId : null;
      const qtyRaw = Number(item?.quantity ?? 0);
      const quantity = Number.isFinite(qtyRaw) ? Math.floor(qtyRaw) : 0;
      if (!productId || quantity <= 0) continue;
      const productRef = db.collection(this.productsCollectionName).doc(productId);
      const productDoc = await tx.get(productRef);
      if (!productDoc.exists) continue;
      tx.update(productRef, {
        stock: admin.firestore.FieldValue.increment(quantity),
      });
    }
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
