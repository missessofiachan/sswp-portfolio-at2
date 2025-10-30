/**
 * Console-only email provider for development/testing.
 * Logs emails to console instead of sending them.
 */

import type { EmailProvider } from './EmailProvider.interface';
import type { OrderStatus } from '../../domain/orders';
import { logInfo } from '../../utils/logger';

export class ConsoleEmailProvider implements EmailProvider {
  async sendPasswordReset({ to, token }: { to: string; token: string }): Promise<void> {
    logInfo('📧 Password reset email (console only)', {
      to,
      tokenPreview: token.slice(0, 6) + '...',
      resetLink: `${this.getFrontendUrl()}/reset-password?token=${token}`,
    });
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
  }): Promise<void> {
    logInfo('📧 Order status update email (console only)', {
      to,
      orderId,
      previousStatus,
      newStatus,
      orderLink: `${this.getFrontendUrl()}/orders/${orderId}`,
    });
  }

  async sendOrderConfirmation(params: {
    to: string;
    orderId: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    total: number;
  }): Promise<void> {
    logInfo('📧 Order confirmation email (console only)', {
      to: params.to,
      orderId: params.orderId,
      itemCount: params.items.length,
      total: params.total,
      orderLink: `${this.getFrontendUrl()}/orders/${params.orderId}`,
    });
  }

  async sendWelcomeEmail({ to, name }: { to: string; name?: string }): Promise<void> {
    logInfo('📧 Welcome email (console only)', {
      to,
      name: name || 'there',
    });
  }

  private getFrontendUrl(): string {
    return process.env.FRONTEND_URL || 'http://localhost:5173';
  }
}
