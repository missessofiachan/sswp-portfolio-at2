import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockedEmailService = vi.hoisted(() => ({
  sendPasswordReset: vi.fn(),
  sendOrderStatusUpdate: vi.fn(),
}));

const mockedOrderEvents = vi.hoisted(() => ({
  emit: vi.fn(),
}));

vi.mock('../services/email.service', () => ({
  emailService: mockedEmailService,
}));

vi.mock('../services/order.events', () => ({
  orderEvents: mockedOrderEvents,
}));

import { OrderService } from '../services/order.service';
import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  type CreateOrderInput,
  type Order,
} from '../domain/orders';
import type { OrderRepository } from '../data/ports/OrderRepository';

const emailServiceMock = mockedEmailService as {
  sendPasswordReset: vi.Mock;
  sendOrderStatusUpdate: vi.Mock;
};
const orderEventsMock = mockedOrderEvents as { emit: vi.Mock };

function buildOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: 'order-1',
    userId: 'user-1',
    userEmail: 'user@example.com',
    items: [
      {
        productId: 'prod-1',
        productName: 'Product 1',
        quantity: 2,
        unitPrice: 25,
        totalPrice: 50,
        productImage: undefined,
      },
    ],
    subtotal: 50,
    taxAmount: 5,
    shippingCost: 0,
    totalAmount: 55,
    status: OrderStatus.PENDING,
    paymentStatus: PaymentStatus.PAID,
    paymentMethod: PaymentMethod.CREDIT_CARD,
    shippingAddress: {
      fullName: 'Jane Doe',
      street: '123 Main St',
      city: 'Faketown',
      state: 'CA',
      postalCode: '90000',
      country: 'USA',
      phone: '555-1234',
    },
    tracking: undefined,
    notes: 'Leave at door',
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
    ...overrides,
  };
}

function buildCreateInput(overrides: Partial<CreateOrderInput> = {}): CreateOrderInput {
  return {
    items: [{ productId: 'prod-1', quantity: 1 }],
    paymentMethod: PaymentMethod.CREDIT_CARD,
    shippingAddress: {
      fullName: 'Jane Doe',
      street: '123 Main St',
      city: 'Faketown',
      state: 'CA',
      postalCode: '90000',
      country: 'USA',
      phone: '555-1234',
    },
    notes: 'Leave at door',
    ...overrides,
  };
}

describe('OrderService', () => {
  let repo: vi.Mocked<OrderRepository>;
  let service: OrderService;

  beforeEach(() => {
    repo = {
      create: vi.fn(),
      findById: vi.fn(),
      findByUserId: vi.fn(),
      findAll: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      getStats: vi.fn(),
      isOwnedByUser: vi.fn(),
    } as unknown as vi.Mocked<OrderRepository>;

    service = new OrderService(repo);
    emailServiceMock.sendPasswordReset.mockReset();
    emailServiceMock.sendOrderStatusUpdate.mockReset();
    orderEventsMock.emit.mockReset();
  });

  describe('createOrder', () => {
    it('creates an order when provided valid data', async () => {
      const order = buildOrder();
      repo.create.mockResolvedValue(order);

      const input = buildCreateInput();
      const result = await service.createOrder(input, 'user-1', 'user@example.com');

      expect(repo.create).toHaveBeenCalledWith(input, 'user-1', 'user@example.com');
      expect(result).toBe(order);
    });

    it('throws when no items are provided', async () => {
      const input = buildCreateInput({ items: [] });
      await expect(service.createOrder(input, 'user-1', 'user@example.com')).rejects.toThrow(
        'Order must contain at least one item'
      );
      expect(repo.create).not.toHaveBeenCalled();
    });

    it('throws when shipping address is missing fields', async () => {
      const input = buildCreateInput({
        shippingAddress: {
          fullName: 'Jane',
          street: '',
          city: 'Town',
          state: 'CA',
          postalCode: '90000',
          country: 'USA',
        },
      });
      await expect(service.createOrder(input, 'user-1', 'user@example.com')).rejects.toThrow(
        'Incomplete shipping address provided'
      );
    });

    it('throws when any item has an invalid quantity', async () => {
      const input = buildCreateInput({
        items: [{ productId: 'prod-1', quantity: 0 }],
      });
      await expect(service.createOrder(input, 'user-1', 'user@example.com')).rejects.toThrow(
        'Invalid quantity: 0'
      );
    });

    it('maps insufficient stock errors to conflict responses', async () => {
      const repoError = new Error('Insufficient stock');
      (repoError as any).code = 'INSUFFICIENT_STOCK';
      (repoError as any).productId = 'prod-1';
      (repoError as any).available = 0;
      (repoError as any).requested = 1;
      repo.create.mockRejectedValue(repoError);

      const input = buildCreateInput();
      await expect(service.createOrder(input, 'user-1', 'user@example.com')).rejects.toMatchObject({
        message: 'Insufficient stock',
        status: 409,
      });
    });

    it('maps missing products to not found responses', async () => {
      const repoError = new Error('Product not found');
      (repoError as any).code = 'PRODUCT_NOT_FOUND';
      (repoError as any).productId = 'prod-unknown';
      repo.create.mockRejectedValue(repoError);

      const input = buildCreateInput();
      await expect(service.createOrder(input, 'user-1', 'user@example.com')).rejects.toMatchObject({
        message: 'Product not found',
        status: 404,
      });
    });
  });

  describe('getOrder', () => {
    it('returns order for owners', async () => {
      const order = buildOrder();
      repo.findById.mockResolvedValue(order);

      const result = await service.getOrder('order-1', 'user-1', false);

      expect(repo.findById).toHaveBeenCalledWith('order-1');
      expect(result).toBe(order);
    });

    it('allows admins to view any order', async () => {
      const order = buildOrder({ userId: 'another-user' });
      repo.findById.mockResolvedValue(order);

      const result = await service.getOrder('order-1', 'user-1', true);

      expect(result).toBe(order);
    });

    it('throws when non-admins request orders they do not own', async () => {
      const order = buildOrder({ userId: 'other-user' });
      repo.findById.mockResolvedValue(order);

      await expect(service.getOrder('order-1', 'user-1', false)).rejects.toThrow(
        'Access denied: You can only view your own orders'
      );
    });
  });

  describe('getUserOrders', () => {
    it('delegates to repository', async () => {
      const orders = [buildOrder()];
      repo.findByUserId.mockResolvedValue(orders);

      const result = await service.getUserOrders('user-1', 10, 'cursor');

      expect(repo.findByUserId).toHaveBeenCalledWith('user-1', 11, 'cursor');
      expect(result).toBe(orders);
    });
  });

  describe('getAllOrders', () => {
    it('delegates to repository', async () => {
      const orders = [buildOrder()];
      repo.findAll.mockResolvedValue(orders);

      const result = await service.getAllOrders(5, 'cursor', OrderStatus.SHIPPED);

      expect(repo.findAll).toHaveBeenCalledWith(6, 'cursor', OrderStatus.SHIPPED);
      expect(result).toBe(orders);
    });
  });

  describe('updateOrder', () => {
    it('allows admins to update any order', async () => {
      const order = buildOrder({ status: OrderStatus.PENDING });
      const updated = buildOrder({ notes: 'updated', status: OrderStatus.CONFIRMED });
      repo.findById.mockResolvedValue(order);
      repo.update.mockResolvedValue(updated);

      const result = await service.updateOrder(
        'order-1',
        { notes: 'updated', status: OrderStatus.CONFIRMED },
        'admin-id',
        true
      );

      expect(repo.update).toHaveBeenCalledWith('order-1', {
        notes: 'updated',
        status: OrderStatus.CONFIRMED,
      });
      expect(result).toBe(updated);
      expect(emailServiceMock.sendOrderStatusUpdate).toHaveBeenCalledWith({
        to: updated.userEmail,
        orderId: updated.id,
        previousStatus: OrderStatus.PENDING,
        newStatus: OrderStatus.CONFIRMED,
      });
      expect(orderEventsMock.emit).toHaveBeenCalledWith('orderStatusChanged', {
        order: updated,
        previousStatus: OrderStatus.PENDING,
        newStatus: OrderStatus.CONFIRMED,
      });
    });

    it('prevents non-admins from updating orders they do not own', async () => {
      const order = buildOrder({ userId: 'other-user' });
      repo.findById.mockResolvedValue(order);

      await expect(service.updateOrder('order-1', { notes: 'x' }, 'user-1', false)).rejects.toThrow(
        'Access denied: You can only update your own orders'
      );
      expect(repo.update).not.toHaveBeenCalled();
    });

    it('prevents non-admins from updating processed orders', async () => {
      const order = buildOrder({ status: OrderStatus.CONFIRMED });
      repo.findById.mockResolvedValue(order);

      await expect(service.updateOrder('order-1', { notes: 'x' }, 'user-1', false)).rejects.toThrow(
        'Cannot modify order after it has been processed'
      );
    });

    it('blocks non-admin updates to restricted fields', async () => {
      const order = buildOrder({ userId: 'user-1' });
      repo.findById.mockResolvedValue(order);

      await expect(
        service.updateOrder('order-1', { status: OrderStatus.CONFIRMED }, 'user-1', false)
      ).rejects.toThrow('Unauthorized field updates: status');
    });

    it('allows non-admins to update shipping address when pending', async () => {
      const order = buildOrder({ userId: 'user-1', status: OrderStatus.PENDING });
      const updatedAddress = {
        fullName: 'Jane Updated',
        street: '456 Updated St',
        city: 'Newtown',
        state: 'NY',
        postalCode: '10001',
        country: 'USA',
        phone: '555-9999',
      };
      const updatedOrder = buildOrder({ shippingAddress: updatedAddress });
      repo.findById.mockResolvedValue(order);
      repo.update.mockResolvedValue(updatedOrder);

      const result = await service.updateOrder(
        'order-1',
        { shippingAddress: updatedAddress },
        'user-1',
        false
      );

      expect(repo.update).toHaveBeenCalledWith('order-1', {
        shippingAddress: updatedAddress,
      });
      expect(result).toBe(updatedOrder);
      expect(emailServiceMock.sendOrderStatusUpdate).not.toHaveBeenCalled();
      expect(orderEventsMock.emit).not.toHaveBeenCalled();
    });

    it('validates shipping address completeness on update', async () => {
      const order = buildOrder({ userId: 'user-1', status: OrderStatus.PENDING });
      repo.findById.mockResolvedValue(order);

      await expect(
        service.updateOrder(
          'order-1',
          {
            shippingAddress: {
              fullName: '',
              street: '456 Updated St',
              city: 'Newtown',
              state: 'NY',
              postalCode: '10001',
              country: 'USA',
              phone: '555-9999',
            },
          },
          'user-1',
          false
        )
      ).rejects.toThrow('Incomplete shipping address provided');
      expect(repo.update).not.toHaveBeenCalled();
      expect(emailServiceMock.sendOrderStatusUpdate).not.toHaveBeenCalled();
      expect(orderEventsMock.emit).not.toHaveBeenCalled();
    });

    it('validates status transitions', async () => {
      const order = buildOrder({ status: OrderStatus.DELIVERED });
      repo.findById.mockResolvedValue(order);

      await expect(
        service.updateOrder('order-1', { status: OrderStatus.PROCESSING }, 'admin', true)
      ).rejects.toThrow('Invalid status transition from delivered to processing');
    });
  });

  describe('cancelOrder', () => {
    it('cancels order when allowed', async () => {
      const order = buildOrder({ status: OrderStatus.PENDING });
      const cancelled = buildOrder({ status: OrderStatus.CANCELLED });
      repo.findById.mockResolvedValue(order);
      repo.update.mockResolvedValue(cancelled);

      const result = await service.cancelOrder('order-1', 'user-1', false);

      expect(repo.update).toHaveBeenCalledWith('order-1', {
        status: OrderStatus.CANCELLED,
      });
      expect(result).toBe(cancelled);
      expect(emailServiceMock.sendOrderStatusUpdate).toHaveBeenCalledWith({
        to: cancelled.userEmail,
        orderId: cancelled.id,
        previousStatus: OrderStatus.PENDING,
        newStatus: OrderStatus.CANCELLED,
      });
      expect(orderEventsMock.emit).toHaveBeenCalledWith('orderStatusChanged', {
        order: cancelled,
        previousStatus: OrderStatus.PENDING,
        newStatus: OrderStatus.CANCELLED,
      });
    });

    it('prevents non-admins from cancelling orders they do not own', async () => {
      const order = buildOrder({ userId: 'other-user' });
      repo.findById.mockResolvedValue(order);

      await expect(service.cancelOrder('order-1', 'user-1', false)).rejects.toThrow(
        'Access denied: You can only cancel your own orders'
      );
    });

    it('rejects cancellation when status is not cancellable', async () => {
      const order = buildOrder({ status: OrderStatus.SHIPPED });
      repo.findById.mockResolvedValue(order);

      await expect(service.cancelOrder('order-1', 'user-1', true)).rejects.toThrow(
        'Cannot cancel order with status: shipped'
      );
    });
  });

  describe('other operations', () => {
    it('deletes an order via repository', async () => {
      await service.deleteOrder('order-1');
      expect(repo.delete).toHaveBeenCalledWith('order-1');
    });

    it('fetches stats via repository', async () => {
      const stats = {
        totalOrders: 1,
        totalRevenue: 55,
        averageOrderValue: 55,
        pendingOrders: 0,
        statusBreakdown: {
          [OrderStatus.PENDING]: 0,
          [OrderStatus.CONFIRMED]: 0,
          [OrderStatus.PROCESSING]: 0,
          [OrderStatus.SHIPPED]: 0,
          [OrderStatus.DELIVERED]: 1,
          [OrderStatus.CANCELLED]: 0,
          [OrderStatus.REFUNDED]: 0,
        },
      };
      repo.getStats.mockResolvedValue(stats);

      const result = await service.getOrderStats();
      expect(repo.getStats).toHaveBeenCalledWith(undefined, undefined);
      expect(result).toBe(stats);
    });

    it('checks ownership through repository', async () => {
      repo.isOwnedByUser.mockResolvedValue(true);
      const result = await service.doesUserOwnOrder('order-1', 'user-1');
      expect(repo.isOwnedByUser).toHaveBeenCalledWith('order-1', 'user-1');
      expect(result).toBe(true);
    });
  });
});
