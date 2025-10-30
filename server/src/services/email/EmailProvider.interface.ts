/**
 * Email provider interface for sending transactional emails.
 * Implementations can use SendGrid, AWS SES, SMTP, or other providers.
 */

import type { OrderStatus } from '../../domain/orders';

export interface EmailProvider {
  /**
   * Send password reset email with token link
   */
  sendPasswordReset(params: { to: string; token: string }): Promise<void>;

  /**
   * Send order status update notification
   */
  sendOrderStatusUpdate(params: {
    to: string;
    orderId: string;
    previousStatus: OrderStatus;
    newStatus: OrderStatus;
  }): Promise<void>;

  /**
   * Send order confirmation email
   */
  sendOrderConfirmation(params: {
    to: string;
    orderId: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    total: number;
  }): Promise<void>;

  /**
   * Send welcome email to new users
   */
  sendWelcomeEmail(params: { to: string; name?: string }): Promise<void>;
}
