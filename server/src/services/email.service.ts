// Simple email service abstraction (stub). In production integrate with a provider (SES, SendGrid, etc.).
import { logInfo } from '../utils/logger';
import { OrderStatus } from '../domain/orders';

export interface EmailService {
  sendPasswordReset(opts: { to: string; token: string }): Promise<void>;
  sendOrderStatusUpdate(opts: {
    to: string;
    orderId: string;
    previousStatus: OrderStatus;
    newStatus: OrderStatus;
  }): Promise<void>;
}

class ConsoleEmailService implements EmailService {
  async sendPasswordReset({ to, token }: { to: string; token: string }) {
    // In real impl: generate URL and send via SMTP/provider
    logInfo('Password reset email (stub)', { to, tokenPreview: token.slice(0, 6) + '...' });
  }

  async sendOrderStatusUpdate({
    to,
    orderId,
    previousStatus,
    newStatus,
  }: {
    to: string;
    orderId: string;
    previousStatus: OrderStatus;
    newStatus: OrderStatus;
  }) {
    logInfo('Order status update email (stub)', {
      to,
      orderId,
      previousStatus,
      newStatus,
    });
  }
}

export const emailService: EmailService = new ConsoleEmailService();
