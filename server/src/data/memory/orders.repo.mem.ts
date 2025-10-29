import crypto from 'crypto';
import {
  OrderStatus,
  PaymentStatus,
  type CreateOrderInput,
  type Order,
  type OrderStats,
  type ShippingAddress,
  type UpdateOrderInput,
} from '../../domain/orders';
import type { OrderRepository } from '../ports/OrderRepository';
import type { ProductsRepo } from '../ports/products.repo';

type StoredOrder = Order & { inventoryReleased: boolean };

export class InMemoryOrderRepository implements OrderRepository {
  private readonly orders = new Map<string, StoredOrder>();
  private readonly freeShippingThreshold = 100;
  private readonly defaultShippingCost = 10;

  constructor(private readonly productsRepo: ProductsRepo) {}

  async create(orderData: CreateOrderInput, userId: string, userEmail: string): Promise<Order> {
    const now = new Date();
    const items: Order['items'] = [];
    let subtotal = 0;

    for (const item of orderData.items) {
      const quantity = Math.floor(item.quantity);
      if (!Number.isFinite(quantity) || quantity <= 0) {
        throw this.createBadRequestError(
          `Invalid quantity for product ${item.productId}: ${item.quantity}`
        );
      }

      const product = await this.productsRepo.getById(item.productId);
      if (!product) {
        throw this.createProductNotFoundError(item.productId);
      }

      const availableStock = Number.isFinite(product.stock) ? Math.floor(product.stock) : 0;
      if (quantity > availableStock) {
        throw this.createInsufficientStockError(product.id, product.name, availableStock, quantity);
      }

      const unitPrice = Number.isFinite(product.price) && product.price >= 0 ? product.price : 0;
      const lineTotal = unitPrice * quantity;
      subtotal += lineTotal;

      items.push({
        productId: product.id,
        productName: product.name,
        quantity,
        unitPrice,
        totalPrice: lineTotal,
        productImage: Array.isArray(product.images) ? product.images[0] : undefined,
      });

      await this.productsRepo.update(product.id, { stock: availableStock - quantity });
    }

    const taxRate = 0.1;
    const taxAmount = subtotal * taxRate;
    const shippingCost = this.calculateShippingCost(subtotal);
    const totalAmount = subtotal + taxAmount + shippingCost;

    const id = crypto.randomUUID();
    const record: StoredOrder = {
      id,
      userId,
      userEmail,
      items,
      subtotal,
      taxAmount,
      shippingCost,
      totalAmount,
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      paymentMethod: orderData.paymentMethod,
      shippingAddress: orderData.shippingAddress,
      notes: orderData.notes,
      tracking: undefined,
      createdAt: now,
      updatedAt: now,
      inventoryReleased: false,
    };

    this.orders.set(id, record);
    return this.cloneOrder(record);
  }

  async findById(id: string): Promise<Order | null> {
    const order = this.orders.get(id);
    return order ? this.cloneOrder(order) : null;
  }

  async findByUserId(userId: string, limit?: number, lastOrderId?: string): Promise<Order[]> {
    const ordered = Array.from(this.orders.values())
      .filter((order) => order.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return this.slicePaginated(ordered, limit, lastOrderId).map((order) => this.cloneOrder(order));
  }

  async findAll(limit?: number, lastOrderId?: string, status?: OrderStatus): Promise<Order[]> {
    const ordered = Array.from(this.orders.values())
      .filter((order) => (status ? order.status === status : true))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return this.slicePaginated(ordered, limit, lastOrderId).map((order) => this.cloneOrder(order));
  }

  async update(id: string, updateData: UpdateOrderInput): Promise<Order> {
    const existing = this.orders.get(id);
    if (!existing) {
      throw this.createOrderNotFoundError(id);
    }

    const previousStatus = existing.status;
    const next: StoredOrder = {
      ...existing,
      notes: updateData.notes ?? existing.notes,
      updatedAt: new Date(),
      status: updateData.status ?? existing.status,
      paymentStatus: updateData.paymentStatus ?? existing.paymentStatus,
      tracking: updateData.tracking
        ? {
            ...existing.tracking,
            ...updateData.tracking,
          }
        : existing.tracking,
      shippingAddress: updateData.shippingAddress
        ? this.cloneShippingAddress(updateData.shippingAddress)
        : existing.shippingAddress,
    };

    const shouldReleaseInventory =
      this.shouldReleaseInventory(previousStatus, next.status) && !existing.inventoryReleased;
    if (shouldReleaseInventory) {
      await this.restoreInventory(existing);
      next.inventoryReleased = true;
    }

    this.orders.set(id, next);
    return this.cloneOrder(next);
  }

  async delete(id: string): Promise<void> {
    const existing = this.orders.get(id);
    if (!existing) {
      throw this.createOrderNotFoundError(id);
    }
    if (!existing.inventoryReleased) {
      await this.restoreInventory(existing);
    }
    this.orders.delete(id);
  }

  async getStats(startDate?: Date, endDate?: Date): Promise<OrderStats> {
    const subset = Array.from(this.orders.values()).filter((order) => {
      if (startDate && order.createdAt < startDate) return false;
      if (endDate && order.createdAt > endDate) return false;
      return true;
    });

    const totalOrders = subset.length;
    const totalRevenue = subset.reduce((sum, order) => sum + order.totalAmount, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const statusBreakdown = Object.values(OrderStatus).reduce(
      (acc, status) => {
        acc[status] = subset.filter((order) => order.status === status).length;
        return acc;
      },
      {} as Record<OrderStatus, number>
    );

    return {
      totalOrders,
      totalRevenue,
      averageOrderValue,
      pendingOrders: statusBreakdown[OrderStatus.PENDING] ?? 0,
      statusBreakdown,
    };
  }

  async isOwnedByUser(orderId: string, userId: string): Promise<boolean> {
    const order = this.orders.get(orderId);
    return order?.userId === userId;
  }

  private slicePaginated(
    ordered: StoredOrder[],
    limit?: number,
    lastOrderId?: string
  ): StoredOrder[] {
    if (!limit) return ordered.slice();
    let startIndex = 0;
    if (lastOrderId) {
      const idx = ordered.findIndex((order) => order.id === lastOrderId);
      if (idx >= 0) {
        startIndex = idx + 1;
      }
    }
    return ordered.slice(startIndex, startIndex + limit);
  }

  private shouldReleaseInventory(previous: OrderStatus, next: OrderStatus): boolean {
    if (previous === next) return false;
    const releasingStatuses = new Set([OrderStatus.CANCELLED, OrderStatus.REFUNDED]);
    return releasingStatuses.has(next);
  }

  private async restoreInventory(order: StoredOrder): Promise<void> {
    for (const item of order.items) {
      const product = await this.productsRepo.getById(item.productId);
      if (!product) {
        continue;
      }
      const currentStock = Number.isFinite(product.stock) ? Math.floor(product.stock) : 0;
      await this.productsRepo.update(item.productId, {
        stock: currentStock + Math.max(0, Math.floor(item.quantity)),
      });
    }
  }

  private calculateShippingCost(subtotal: number): number {
    return subtotal > this.freeShippingThreshold ? 0 : this.defaultShippingCost;
  }

  private cloneOrder(order: StoredOrder): Order {
    return {
      id: order.id,
      userId: order.userId,
      userEmail: order.userEmail,
      items: order.items.map((item) => ({ ...item })),
      subtotal: order.subtotal,
      taxAmount: order.taxAmount,
      shippingCost: order.shippingCost,
      totalAmount: order.totalAmount,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      shippingAddress: this.cloneShippingAddress(order.shippingAddress),
      tracking: order.tracking ? { ...order.tracking } : undefined,
      notes: order.notes,
      createdAt: new Date(order.createdAt),
      updatedAt: new Date(order.updatedAt),
    };
  }

  private cloneShippingAddress(address: ShippingAddress): ShippingAddress {
    return { ...address };
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
    (error as any).status = 404;
    return error;
  }

  private createOrderNotFoundError(orderId: string): Error {
    const error = new Error(`Order not found: ${orderId}`);
    (error as any).status = 404;
    return error;
  }

  private createBadRequestError(message: string): Error {
    const error = new Error(message);
    (error as any).status = 400;
    return error;
  }
}
