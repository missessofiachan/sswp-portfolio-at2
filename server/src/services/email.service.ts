// Simple email service abstraction (stub). In production integrate with a provider (SES, SendGrid, etc.).
import { logInfo } from '../utils/logger';

export interface EmailService {
  sendPasswordReset(opts: { to: string; token: string }): Promise<void>;
}

class ConsoleEmailService implements EmailService {
  async sendPasswordReset({ to, token }: { to: string; token: string }) {
    // In real impl: generate URL and send via SMTP/provider
    logInfo('Password reset email (stub)', { to, tokenPreview: token.slice(0, 6) + '...' });
  }
}

export const emailService: EmailService = new ConsoleEmailService();
