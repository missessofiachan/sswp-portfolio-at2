/**
 * Error monitoring and performance tracking integration.
 * Supports Sentry and other monitoring services.
 */

import type { Request } from 'express';

export interface ErrorMonitoringService {
  /**
   * Initialize the monitoring service
   */
  init(): void;

  /**
   * Capture an exception
   */
  captureException(error: Error, context?: Record<string, any>): void;

  /**
   * Capture a message (for warnings or info)
   */
  captureMessage(
    message: string,
    level: 'info' | 'warning' | 'error',
    context?: Record<string, any>
  ): void;

  /**
   * Set user context for error tracking
   */
  setUser(user: { id: string; email?: string }): void;

  /**
   * Clear user context
   */
  clearUser(): void;

  /**
   * Add breadcrumb for debugging
   */
  addBreadcrumb(message: string, category: string, data?: Record<string, any>): void;

  /**
   * Capture request context
   */
  captureRequestContext(req: Request): void;
}

/**
 * Console-only monitoring service for development
 */
class ConsoleMonitoringService implements ErrorMonitoringService {
  init(): void {
    console.log('✓ Monitoring initialized (console mode)');
  }

  captureException(error: Error, context?: Record<string, any>): void {
    console.error('🔴 Exception captured:', error);
    if (context) {
      console.error('Context:', context);
    }
  }

  captureMessage(
    message: string,
    level: 'info' | 'warning' | 'error',
    context?: Record<string, any>
  ): void {
    const icon = level === 'error' ? '🔴' : level === 'warning' ? '🟡' : 'ℹ️';
    console.log(`${icon} Message [${level}]:`, message);
    if (context) {
      console.log('Context:', context);
    }
  }

  setUser(user: { id: string; email?: string }): void {
    console.log('👤 User context set:', user);
  }

  clearUser(): void {
    console.log('👤 User context cleared');
  }

  addBreadcrumb(message: string, category: string, data?: Record<string, any>): void {
    console.log(`🍞 Breadcrumb [${category}]:`, message, data);
  }

  captureRequestContext(req: Request): void {
    console.log('🌐 Request context:', {
      method: req.method,
      path: req.path,
      ip: req.ip,
    });
  }
}

/**
 * Sentry monitoring service
 * Requires: npm install @sentry/node
 *
 * Environment variables:
 * - SENTRY_DSN: Your Sentry project DSN
 * - SENTRY_ENVIRONMENT: Environment name (development, staging, production)
 * - SENTRY_RELEASE: Release version (optional)
 */
class SentryMonitoringService implements ErrorMonitoringService {
  private Sentry: any = null;
  private initialized = false;

  init(): void {
    try {
      // Dynamic import to make Sentry optional
      this.Sentry = require('@sentry/node');

      const dsn = process.env.SENTRY_DSN;
      if (!dsn) {
        console.warn('⚠️  SENTRY_DSN not set. Sentry monitoring disabled.');
        return;
      }

      this.Sentry.init({
        dsn,
        environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'development',
        release: process.env.SENTRY_RELEASE,
        tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
        beforeSend(event: any, hint: any) {
          // Filter out sensitive data
          if (event.request?.headers?.authorization) {
            event.request.headers.authorization = '[Filtered]';
          }
          return event;
        },
      });

      this.initialized = true;
      console.log('✓ Sentry monitoring initialized');
    } catch (error) {
      console.warn('⚠️  Sentry not available. Install with: npm install @sentry/node');
    }
  }

  captureException(error: Error, context?: Record<string, any>): void {
    if (!this.initialized || !this.Sentry) {
      console.error('Exception (Sentry not initialized):', error);
      return;
    }

    this.Sentry.captureException(error, {
      extra: context,
    });
  }

  captureMessage(
    message: string,
    level: 'info' | 'warning' | 'error',
    context?: Record<string, any>
  ): void {
    if (!this.initialized || !this.Sentry) {
      console.log(`Message [${level}] (Sentry not initialized):`, message);
      return;
    }

    this.Sentry.captureMessage(message, {
      level: level === 'warning' ? 'warning' : level === 'error' ? 'error' : 'info',
      extra: context,
    });
  }

  setUser(user: { id: string; email?: string }): void {
    if (!this.initialized || !this.Sentry) return;

    this.Sentry.setUser({
      id: user.id,
      email: user.email,
    });
  }

  clearUser(): void {
    if (!this.initialized || !this.Sentry) return;

    this.Sentry.setUser(null);
  }

  addBreadcrumb(message: string, category: string, data?: Record<string, any>): void {
    if (!this.initialized || !this.Sentry) return;

    this.Sentry.addBreadcrumb({
      message,
      category,
      data,
      level: 'info',
    });
  }

  captureRequestContext(req: Request): void {
    if (!this.initialized || !this.Sentry) return;

    this.Sentry.setContext('request', {
      method: req.method,
      url: req.originalUrl,
      headers: {
        'user-agent': req.get('user-agent'),
        // Don't include authorization header
      },
      ip: req.ip,
    });
  }
}

/**
 * Factory function to create the appropriate monitoring service
 */
function createMonitoringService(): ErrorMonitoringService {
  const provider = process.env.MONITORING_PROVIDER || 'console';

  if (provider === 'sentry') {
    return new SentryMonitoringService();
  }

  return new ConsoleMonitoringService();
}

export const monitoring = createMonitoringService();
