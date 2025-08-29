/**
 * Centralized error handler middleware for Express.
 * 
// The '_next' parameter is required by Express error handler signature but is intentionally unused.
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
 * @param _req - The Express request object (unused).
 * @param res - The Express response object.
* @param _next - The next middleware function (unused).
*/
import type { Request, Response, NextFunction } from 'express';

interface AppError {
  status?: number;
  message?: string;
}

function isAppError(error: unknown): error is AppError {
  return typeof error === 'object' && error !== null && ('status' in error || 'message' in error);
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const status = isAppError(err) && typeof err.status === 'number' ? err.status : 500;
  const message =
    isAppError(err) && typeof err.message === 'string' ? err.message : 'Internal Server Error';
  res.status(status).json({ error: { message } });
}
