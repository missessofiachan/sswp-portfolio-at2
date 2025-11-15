/**
 * Correlation ID middleware for request tracing.
 *
 * Generates or extracts a unique ID for each request to enable
 * tracing across services, logs, and error reports.
 */

import { randomBytes } from 'crypto';
import type { NextFunction, Request, Response } from 'express';

/**
 * Header name for correlation ID
 */
export const CORRELATION_ID_HEADER = 'x-correlation-id';

/**
 * Generate a short, URL-safe correlation ID
 */
function generateCorrelationId(): string {
  return randomBytes(16).toString('hex');
}

/**
 * Middleware that adds a correlation ID to each request.
 *
 * - Checks for existing correlation ID in request header
 * - Generates new ID if not present
 * - Attaches to request object and response header
 * - Makes ID available for logging
 *
 * Usage in logs:
 * ```typescript
 * const correlationId = (req as any).correlationId;
 * logInfo('Processing request', { correlationId, userId: req.user.id });
 * ```
 */
export function correlationIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Check if client sent a correlation ID (for distributed tracing)
  let correlationId = req.headers[CORRELATION_ID_HEADER] as string | undefined;

  // Generate new ID if not present or invalid
  if (!correlationId || typeof correlationId !== 'string' || correlationId.length === 0) {
    correlationId = generateCorrelationId();
  }

  // Attach to request object for use in handlers
  (req as any).correlationId = correlationId;

  // Add to response headers for client-side tracing
  res.setHeader(CORRELATION_ID_HEADER, correlationId);

  next();
}

/**
 * Extract correlation ID from request
 */
export function getCorrelationId(req: Request): string | undefined {
  return (req as any).correlationId;
}
