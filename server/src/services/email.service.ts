// Email service with pluggable providers (SendGrid, Console/stub, etc.)
import type { EmailProvider } from './email/EmailProvider.interface';
import { ConsoleEmailProvider } from './email/ConsoleEmailProvider';
import { SendGridEmailProvider } from './email/SendGridEmailProvider';
import { loadEnv } from '../config/env';

/**
 * Email service factory - selects the appropriate provider based on configuration.
 *
 * Providers:
 * - ConsoleEmailProvider: Development/testing (logs to console)
 * - SendGridEmailProvider: Production with SendGrid
 *
 * Environment Variables:
 * - EMAIL_PROVIDER: 'console' | 'sendgrid' (default: 'console')
 * - SENDGRID_API_KEY: Required if using SendGrid
 * - EMAIL_FROM: Sender email address (required for SendGrid)
 * - FRONTEND_URL: Frontend URL for email links (optional, defaults to localhost)
 */
function createEmailService(): EmailProvider {
  const env = loadEnv();
  const emailProvider = process.env.EMAIL_PROVIDER || 'console';

  if (emailProvider === 'sendgrid') {
    const apiKey = process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.EMAIL_FROM;

    if (!apiKey || !fromEmail) {
      console.error(
        '⚠️  SendGrid email provider requires SENDGRID_API_KEY and EMAIL_FROM. Falling back to console.'
      );
      return new ConsoleEmailProvider();
    }

    console.log('✓ Email service initialized with SendGrid');
    return new SendGridEmailProvider({
      apiKey,
      fromEmail,
      frontendUrl: process.env.FRONTEND_URL,
    });
  }

  // Default to console for development
  console.log('✓ Email service initialized with Console (dev mode)');
  return new ConsoleEmailProvider();
}

export const emailService = createEmailService();
