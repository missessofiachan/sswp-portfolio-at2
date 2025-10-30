/**
 * SendGrid email provider implementation.
 * Requires SENDGRID_API_KEY environment variable.
 */

import type { EmailProvider } from './EmailProvider.interface';
import type { OrderStatus } from '../../domain/orders';
import { logInfo, logError } from '../../utils/logger';

export class SendGridEmailProvider implements EmailProvider {
  private apiKey: string;
  private fromEmail: string;
  private frontendUrl: string;

  constructor(config: { apiKey: string; fromEmail: string; frontendUrl?: string }) {
    this.apiKey = config.apiKey;
    this.fromEmail = config.fromEmail;
    this.frontendUrl = config.frontendUrl || 'http://localhost:5173';
  }

  async sendPasswordReset({ to, token }: { to: string; token: string }): Promise<void> {
    const resetLink = `${this.frontendUrl}/reset-password?token=${token}`;

    try {
      await this.sendEmail({
        to,
        subject: "Reset Your Password - Sofia's Shop",
        html: `
          <h2>Reset Your Password</h2>
          <p>You requested a password reset for your Sofia's Shop account.</p>
          <p>Click the link below to reset your password:</p>
          <p><a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a></p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, you can safely ignore this email.</p>
          <hr>
          <p style="color: #666; font-size: 12px;">Sofia's Shop</p>
        `,
        text: `Reset your password for Sofia's Shop.\n\nClick this link: ${resetLink}\n\nThis link expires in 1 hour.`,
      });

      logInfo('Password reset email sent', { to });
    } catch (error) {
      logError('Failed to send password reset email', error, { to });
      throw error;
    }
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
    const orderLink = `${this.frontendUrl}/orders/${orderId}`;

    try {
      await this.sendEmail({
        to,
        subject: `Order Update - ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)} - Sofia's Shop`,
        html: `
          <h2>Order Status Update</h2>
          <p>Your order #${orderId} status has been updated.</p>
          <p><strong>Previous Status:</strong> ${previousStatus}</p>
          <p><strong>New Status:</strong> ${newStatus}</p>
          <p><a href="${orderLink}" style="background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">View Order</a></p>
          <hr>
          <p style="color: #666; font-size: 12px;">Sofia's Shop</p>
        `,
        text: `Your order #${orderId} status has been updated from ${previousStatus} to ${newStatus}.\n\nView your order: ${orderLink}`,
      });

      logInfo('Order status update email sent', { to, orderId, newStatus });
    } catch (error) {
      logError('Failed to send order status update email', error, { to, orderId });
      // Don't throw - email failure shouldn't break the order update
    }
  }

  async sendOrderConfirmation(params: {
    to: string;
    orderId: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    total: number;
  }): Promise<void> {
    const orderLink = `${this.frontendUrl}/orders/${params.orderId}`;

    const itemsHtml = params.items
      .map(
        (item) =>
          `<tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>$${(item.quantity * item.price).toFixed(2)}</td>
          </tr>`
      )
      .join('');

    try {
      await this.sendEmail({
        to: params.to,
        subject: `Order Confirmation #${params.orderId} - Sofia's Shop`,
        html: `
          <h2>Thank You for Your Order!</h2>
          <p>Your order has been received and is being processed.</p>
          <p><strong>Order Number:</strong> ${params.orderId}</p>
          
          <h3>Order Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f5f5f5;">
                <th style="padding: 8px; text-align: left;">Item</th>
                <th style="padding: 8px; text-align: left;">Qty</th>
                <th style="padding: 8px; text-align: left;">Price</th>
                <th style="padding: 8px; text-align: left;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr style="background-color: #f5f5f5; font-weight: bold;">
                <td colspan="3" style="padding: 8px; text-align: right;">Total:</td>
                <td style="padding: 8px;">$${params.total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
          
          <p><a href="${orderLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 20px;">View Order</a></p>
          <hr>
          <p style="color: #666; font-size: 12px;">Sofia's Shop</p>
        `,
        text: `Thank you for your order!\n\nOrder #${params.orderId}\n\n${params.items.map((i) => `${i.name} x${i.quantity} - $${(i.quantity * i.price).toFixed(2)}`).join('\n')}\n\nTotal: $${params.total.toFixed(2)}\n\nView order: ${orderLink}`,
      });

      logInfo('Order confirmation email sent', { to: params.to, orderId: params.orderId });
    } catch (error) {
      logError('Failed to send order confirmation email', error, {
        to: params.to,
        orderId: params.orderId,
      });
      // Don't throw - email failure shouldn't break the order creation
    }
  }

  async sendWelcomeEmail({ to, name }: { to: string; name?: string }): Promise<void> {
    try {
      await this.sendEmail({
        to,
        subject: "Welcome to Sofia's Shop!",
        html: `
          <h2>Welcome to Sofia's Shop${name ? `, ${name}` : ''}!</h2>
          <p>Thank you for creating an account with us.</p>
          <p>Start exploring our handcrafted collection of unique items.</p>
          <p><a href="${this.frontendUrl}/products" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Browse Products</a></p>
          <hr>
          <p style="color: #666; font-size: 12px;">Sofia's Shop</p>
        `,
        text: `Welcome to Sofia's Shop${name ? `, ${name}` : ''}!\n\nThank you for creating an account.\n\nBrowse products: ${this.frontendUrl}/products`,
      });

      logInfo('Welcome email sent', { to });
    } catch (error) {
      logError('Failed to send welcome email', error, { to });
      // Don't throw - email failure shouldn't break registration
    }
  }

  private async sendEmail(params: {
    to: string;
    subject: string;
    html: string;
    text: string;
  }): Promise<void> {
    // SendGrid API v3
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: params.to }],
            subject: params.subject,
          },
        ],
        from: { email: this.fromEmail },
        content: [
          {
            type: 'text/plain',
            value: params.text,
          },
          {
            type: 'text/html',
            value: params.html,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`SendGrid API error: ${response.status} - ${errorText}`);
    }
  }
}
