/**
 * Prometheus Metrics Middleware
 *
 * Collects HTTP request metrics automatically for all routes.
 * Tracks request count, duration, and error rates.
 *
 * @fileoverview Metrics collection middleware
 * @module api/middleware/metrics
 */

import type { NextFunction, Request, Response } from 'express';
import {
  httpErrorsTotal,
  httpRequestDuration,
  httpRequestTotal,
} from '../../services/monitoring/metrics.service';

/**
 * Middleware to collect HTTP request metrics
 * Should be applied early in the middleware chain
 */
export function metricsMiddleware(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();
  const method = req.method;

  // Normalize route path (remove IDs and query params for better aggregation)
  const route = normalizeRoute(req.route?.path || req.path);

  // Override res.end to capture response metrics
  const originalEnd = res.end.bind(res);

  res.end = (chunk?: unknown, encoding?: unknown, cb?: () => void) => {
    const duration = (Date.now() - startTime) / 1000; // Convert to seconds
    const statusCode = res.statusCode.toString();

    // Record metrics
    httpRequestDuration.observe({ method, route, status_code: statusCode }, duration);
    httpRequestTotal.inc({ method, route, status_code: statusCode });

    // Record errors (4xx and 5xx)
    if (res.statusCode >= 400) {
      httpErrorsTotal.inc({ method, route, status_code: statusCode });
    }

    // Call original end
    if (encoding !== undefined) {
      return originalEnd(chunk, encoding as BufferEncoding, cb);
    }
    return originalEnd(chunk, cb);
  };

  next();
}

/**
 * Normalize route path for better metric aggregation
 * Replaces IDs and dynamic segments with placeholders
 */
function normalizeRoute(path: string): string {
  // Replace UUIDs and IDs with placeholders
  return path
    .replace(/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '/:id')
    .replace(/\/\d+/g, '/:id')
    .replace(/\/[^/]+$/g, '/:id'); // Replace last segment if it looks like an ID
}
