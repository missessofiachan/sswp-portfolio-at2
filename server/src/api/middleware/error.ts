/**
 * Centralized error handler middleware for Express.
 *
 * @param err - The error thrown in a route or middleware.
 * @param _req - The Express request object (unused).
 * @param res - The Express response object.
 * @param _next - The next middleware function (unused).
 */
import type { Request, Response, NextFunction } from 'express';
import { monitoring } from '../../utils/monitoring';
import { getCorrelationId } from './correlationId';

interface AppError {
  status?: number;
  message?: string;
}

function isAppError(error: unknown): error is AppError {
  return typeof error === 'object' && error !== null && ('status' in error || 'message' in error);
}

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  const anyErr = err as any;
  const correlationId = getCorrelationId(req);

  // Determine status code
  let statusCode = 500;
  if (isAppError(err)) {
    const appErr = err as AppError;
    if (typeof appErr.status === 'number') {
      statusCode = appErr.status;
    }
  }

  // Capture error in monitoring system (but not for expected errors like 400/404)
  if (statusCode >= 500 && err instanceof Error) {
    monitoring.captureException(err, {
      path: req.path,
      method: req.method,
      correlationId,
      user: (req as any).user,
    });
  }

  // Handle Firestore 'requires an index' error (FAILED_PRECONDITION) and surface the console link if present
  const messageStr = typeof anyErr?.message === 'string' ? anyErr.message : undefined;
  if (
    anyErr?.code === 'failed-precondition' ||
    (typeof messageStr === 'string' && messageStr.toLowerCase().includes('requires an index'))
  ) {
    // Try to extract the index creation URL from the message
    const urlMatch = typeof messageStr === 'string' ? messageStr.match(/https?:\/\/[^\s)]+/) : null;
    const indexUrl = urlMatch ? urlMatch[0] : undefined;
    const payload: Record<string, unknown> = {
      message: 'Firestore index required for this query',
      details: messageStr,
    };
    if (indexUrl) payload.indexUrl = indexUrl;
    res.status(400).json({ error: payload });
    return;
  }

  // Handle common Firestore transaction precondition error (reads-before-writes)
  if (
    typeof messageStr === 'string' &&
    messageStr.toLowerCase().includes('transactions require all reads')
  ) {
    res.status(400).json({
      error: {
        message: 'Firestore transaction precondition failed: all reads must complete before writes',
        details: messageStr,
      },
    });
    return;
  }

  // Generic AppError mapping
  const message =
    isAppError(err) && typeof err.message === 'string' ? err.message : 'Internal Server Error';
  res.status(statusCode).json({ error: { message } });
}
