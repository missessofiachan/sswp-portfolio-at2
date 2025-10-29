import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Response } from 'express';
import { OrderController } from '../api/controllers/order.controller';
import { OrderStatus, PaymentMethod, PaymentStatus, type Order } from '../domain/orders';
import type { OrderService } from '../services/order.service';

type MockedOrderService = {
  [K in keyof OrderService]: OrderService[K] extends (...args: infer Args) => infer Return
    ? vi.Mock<Return, Args>
    : OrderService[K];
};

function createResponse() {
  const res: Partial<Response> = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.send = vi.fn().mockReturnValue(res);
  return res as Response & {
    status: ReturnType<typeof vi.fn>;
    json: ReturnType<typeof vi.fn>;
    send: ReturnType<typeof vi.fn>;
  };
}

function buildOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: 'order-1',
    userId: 'user-1',
    userEmail: 'user@example.com',
    items: [
      {
        productId: 'prod-1',
        productName: 'Product 1',
        quantity: 1,
        unitPrice: 10,
        totalPrice: 10,
      },
    ],
    subtotal: 10,
    taxAmount: 1,
    shippingCost: 0,
    totalAmount: 11,
    status: OrderStatus.PENDING,
    paymentStatus: PaymentStatus.PAID,
    paymentMethod: PaymentMethod.CREDIT_CARD,
    shippingAddress: {
      fullName: 'Jane Doe',
      street: '123 Street',
      city: 'City',
      state: 'CA',
      postalCode: '12345',
      country: 'USA',
    },
    notes: undefined,
    tracking: undefined,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
    ...overrides,
  };
}

describe('OrderController', () => {
  let service: MockedOrderService;
  let controller: OrderController;

  beforeEach(() => {
    service = {
      createOrder: vi.fn(),
      getOrder: vi.fn(),
      getUserOrders: vi.fn(),
      getAllOrders: vi.fn(),
      updateOrder: vi.fn(),
      cancelOrder: vi.fn(),
      deleteOrder: vi.fn(),
      getOrderStats: vi.fn(),
      doesUserOwnOrder: vi.fn(),
    } as unknown as MockedOrderService;
    controller = new OrderController(service as unknown as OrderService);
  });

  describe('createOrder', () => {
    it('returns created order on success', async () => {
      const order = buildOrder();
      service.createOrder.mockResolvedValue(order);
      const req: any = {
        body: { foo: 'bar' },
        user: { id: 'user-1', email: 'user@example.com' },
      };
      const res = createResponse();

      await controller.createOrder(req, res);

      expect(service.createOrder).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: order,
        message: 'Order created successfully',
      });
    });

    it('returns 400 when service throws', async () => {
      service.createOrder.mockRejectedValue(new Error('Failed'));
      const req: any = {
        body: {},
        user: { id: 'user-1', email: 'user@example.com' },
      };
      const res = createResponse();

      await controller.createOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Failed',
      });
    });
  });

  describe('getOrder', () => {
    it('returns order data when found', async () => {
      const order = buildOrder();
      service.getOrder.mockResolvedValue(order);
      const req: any = {
        params: { id: 'order-1' },
        user: { id: 'user-1', role: 'user' },
      };
      const res = createResponse();

      await controller.getOrder(req, res);

      expect(service.getOrder).toHaveBeenCalledWith('order-1', 'user-1', false);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: order });
    });

    it('returns 404 when not found', async () => {
      service.getOrder.mockResolvedValue(null);
      const req: any = {
        params: { id: 'order-1' },
        user: { id: 'user-1', role: 'user' },
      };
      const res = createResponse();

      await controller.getOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Order not found',
      });
    });

    it('returns 403 when access denied', async () => {
      service.getOrder.mockRejectedValue(new Error('Access denied: nope'));
      const req: any = {
        params: { id: 'order-1' },
        user: { id: 'user-1', role: 'user' },
      };
      const res = createResponse();

      await controller.getOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Access denied: nope',
      });
    });
  });

  describe('getMyOrders', () => {
    it('returns orders with meta information', async () => {
      const orders = [buildOrder(), buildOrder()];
      service.getUserOrders.mockResolvedValue(orders);
      const req: any = {
        query: { limit: '1', lastOrderId: 'cursor' },
        user: { id: 'user-1' },
      };
      const res = createResponse();

      await controller.getMyOrders(req, res);

      expect(service.getUserOrders).toHaveBeenCalledWith('user-1', 1, 'cursor');
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: [orders[0]],
        meta: { count: 1, hasMore: true },
      });
    });
  });

  describe('getAllOrders', () => {
    it('returns list for admins', async () => {
      const orders = [buildOrder()];
      service.getAllOrders.mockResolvedValue(orders);
      const req: any = {
        query: { limit: '2', lastOrderId: 'cursor', status: OrderStatus.PENDING },
      };
      const res = createResponse();

      await controller.getAllOrders(req, res);

      expect(service.getAllOrders).toHaveBeenCalledWith(2, 'cursor', OrderStatus.PENDING);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: orders,
        meta: { count: 1, hasMore: false },
      });
    });
  });

  describe('updateOrder', () => {
    it('returns updated order on success', async () => {
      const updated = buildOrder({ notes: 'updated' });
      service.getOrder.mockResolvedValue(updated);
      service.updateOrder.mockResolvedValue(updated);
      const req: any = {
        params: { id: 'order-1' },
        body: { notes: 'updated' },
        user: { id: 'admin', role: 'admin' },
      };
      const res = createResponse();

      await controller.updateOrder(req, res);

      expect(service.updateOrder).toHaveBeenCalledWith(
        'order-1',
        { notes: 'updated' },
        'admin',
        true
      );
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: updated,
        message: 'Order updated successfully',
      });
    });

    it('returns 403 when access denied', async () => {
      service.updateOrder.mockRejectedValue(new Error('Access denied: nope'));
      const req: any = {
        params: { id: 'order-1' },
        body: { notes: 'nope' },
        user: { id: 'user-1', role: 'user' },
      };
      const res = createResponse();

      await controller.updateOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Access denied: nope',
      });
    });

    it('returns 404 when order not found', async () => {
      service.updateOrder.mockRejectedValue(new Error('Order not found: order-1'));
      const req: any = {
        params: { id: 'order-1' },
        body: {},
        user: { id: 'admin', role: 'admin' },
      };
      const res = createResponse();

      await controller.updateOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Order not found: order-1',
      });
    });
  });

  describe('cancelOrder', () => {
    it('returns cancelled order on success', async () => {
      const cancelled = buildOrder({ status: OrderStatus.CANCELLED });
      service.cancelOrder.mockResolvedValue(cancelled);
      const req: any = {
        params: { id: 'order-1' },
        user: { id: 'user-1', role: 'user' },
      };
      const res = createResponse();

      await controller.cancelOrder(req, res);

      expect(service.cancelOrder).toHaveBeenCalledWith('order-1', 'user-1', false);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: cancelled,
        message: 'Order cancelled successfully',
      });
    });

    it('returns 403 when cancellation forbidden', async () => {
      service.cancelOrder.mockRejectedValue(new Error('Access denied: nope'));
      const req: any = {
        params: { id: 'order-1' },
        user: { id: 'user-1', role: 'user' },
      };
      const res = createResponse();

      await controller.cancelOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Access denied: nope',
      });
    });
  });

  describe('deleteOrder', () => {
    it('responds with success message', async () => {
      service.deleteOrder.mockResolvedValue();
      const req: any = { params: { id: 'order-1' } };
      const res = createResponse();

      await controller.deleteOrder(req, res);

      expect(service.deleteOrder).toHaveBeenCalledWith('order-1');
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Order deleted successfully',
      });
    });

    it('returns 404 when order missing', async () => {
      service.deleteOrder.mockRejectedValue(new Error('Order not found'));
      const req: any = { params: { id: 'order-1' } };
      const res = createResponse();

      await controller.deleteOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Order not found',
      });
    });

    it('returns 500 on unexpected errors', async () => {
      service.deleteOrder.mockRejectedValue(new Error('fail'));
      const req: any = { params: { id: 'order-1' } };
      const res = createResponse();

      await controller.deleteOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'fail',
      });
    });
  });

  describe('getOrderStats', () => {
    it('returns stats from service', async () => {
      const stats = {
        totalOrders: 1,
        totalRevenue: 100,
        averageOrderValue: 100,
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
      service.getOrderStats.mockResolvedValue(stats);
      const req: any = { query: { startDate: '2024-01-01', endDate: '2024-01-31' } };
      const res = createResponse();

      await controller.getOrderStats(req, res);

      expect(service.getOrderStats).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ success: true, data: stats });
    });

    it('returns 500 on error', async () => {
      service.getOrderStats.mockRejectedValue(new Error('boom'));
      const req: any = { query: {} };
      const res = createResponse();

      await controller.getOrderStats(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'boom',
      });
    });
  });
});
