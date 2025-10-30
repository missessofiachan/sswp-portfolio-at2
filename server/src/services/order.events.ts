import { EventEmitter } from 'node:events';
import type { Order, OrderStatus } from '../domain/orders';

export interface OrderEvents {
  orderStatusChanged: {
    order: Order;
    previousStatus: OrderStatus;
    newStatus: OrderStatus;
  };
}

class OrderEventEmitter extends EventEmitter {
  emit<K extends keyof OrderEvents>(eventName: K, payload: OrderEvents[K]): boolean {
    return super.emit(eventName, payload);
  }

  on<K extends keyof OrderEvents>(eventName: K, listener: (payload: OrderEvents[K]) => void): this {
    return super.on(eventName, listener);
  }

  once<K extends keyof OrderEvents>(
    eventName: K,
    listener: (payload: OrderEvents[K]) => void
  ): this {
    return super.once(eventName, listener);
  }
}

export const orderEvents = new OrderEventEmitter();

export default orderEvents;
