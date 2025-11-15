/**
 * Rate limiting middleware to protect against abuse and DoS attacks.
 * Uses in-memory store for simplicity (use Redis for production with multiple servers).
 */

import type { NextFunction, Request, Response } from 'express';
import { logRateLimitHit } from '../../utils/securityLogger';
import { getCorrelationId } from './correlationId';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private store = new Map<string, RateLimitEntry>();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every minute
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.store.entries()) {
        if (now > entry.resetTime) {
          this.store.delete(key);
        }
      }
    }, 60000);
  }

  check(
    key: string,
    limit: number,
    windowMs: number
  ): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || now > entry.resetTime) {
      // New window
      const resetTime = now + windowMs;
      this.store.set(key, { count: 1, resetTime });
      return { allowed: true, remaining: limit - 1, resetTime };
    }

    if (entry.count >= limit) {
      // Limit exceeded
      return { allowed: false, remaining: 0, resetTime: entry.resetTime };
    }

    // Increment count
    entry.count++;
    this.store.set(key, entry);
    return { allowed: true, remaining: limit - entry.count, resetTime: entry.resetTime };
  }

  reset(key: string): void {
    this.store.delete(key);
  }

  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.store.clear();
  }
}

const limiter = new RateLimiter();

export interface RateLimitOptions {
  windowMs?: number; // Time window in milliseconds (default: 15 minutes)
  max?: number; // Max requests per window (default: 100)
  keyGenerator?: (req: Request) => string; // Function to generate rate limit key
  skipSuccessfulRequests?: boolean; // Don't count successful requests
  skipFailedRequests?: boolean; // Don't count failed requests
  message?: string; // Custom error message
}

/**
 * Rate limit middleware factory
 *
 * @example
 * ```typescript
 * // Global rate limit
 * app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
 *
 * // Route-specific rate limit
 * router.post('/login', rateLimit({ max: 5, windowMs: 15 * 60 * 1000 }), loginHandler);
 *
 * // Rate limit by user ID
 * router.post('/api/data', rateLimit({
 *   max: 50,
 *   keyGenerator: (req) => (req as any).user?.id || req.ip
 * }), dataHandler);
 * ```
 */
export function rateLimit(options: RateLimitOptions = {}) {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    max = 100,
    keyGenerator = (req: Request) => req.ip || 'unknown',
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
    message = 'Too many requests, please try again later.',
  } = options;

  return (req: Request, res: Response, next: NextFunction): void => {
    const key = keyGenerator(req);
    const result = limiter.check(key, max, windowMs);

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', max.toString());
    res.setHeader('X-RateLimit-Remaining', result.remaining.toString());
    res.setHeader('X-RateLimit-Reset', new Date(result.resetTime).toISOString());

    if (!result.allowed) {
      const correlationId = getCorrelationId(req);

      // Log rate limit hit
      logRateLimitHit({
        ip: req.ip || 'unknown',
        path: req.path,
        userId: (req as any).user?.id,
        correlationId,
      });

      res.status(429).json({
        error: {
          message,
          retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
        },
      });
      return;
    }

    // Track response to potentially skip counting
    if (skipSuccessfulRequests || skipFailedRequests) {
      const originalSend = res.send;
      res.send = function (body: any) {
        const statusCode = res.statusCode;
        const isSuccessful = statusCode >= 200 && statusCode < 400;
        const shouldSkip =
          (skipSuccessfulRequests && isSuccessful) || (skipFailedRequests && !isSuccessful);

        if (shouldSkip) {
          // Decrement count if we're skipping this request
          const entry = limiter['store'].get(key);
          if (entry) {
            entry.count = Math.max(0, entry.count - 1);
          }
        }

        return originalSend.call(this, body);
      };
    }

    next();
  };
}

/**
 * Predefined rate limiters for common use cases
 */

/**
 * Strict rate limit for authentication endpoints
 * 5 attempts per 15 minutes
 */
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many authentication attempts. Please try again in 15 minutes.',
  skipSuccessfulRequests: true, // Only count failed attempts
});

/**
 * Standard API rate limit
 * 100 requests per 15 minutes
 */
export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

/**
 * Relaxed rate limit for read operations
 * 1000 requests per 15 minutes
 */
export const readRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
});

/**
 * Strict rate limit for write operations
 * 20 requests per minute
 */
export const writeRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
});

/**
 * Very strict rate limit for expensive operations (uploads, exports, etc.)
 * 5 requests per 5 minutes
 */
export const expensiveOperationRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  message: 'Too many requests for this resource. Please try again in a few minutes.',
});

// Cleanup on process exit
process.on('SIGTERM', () => limiter.destroy());
process.on('SIGINT', () => limiter.destroy());
