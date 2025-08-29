// JWT verification and role guard middleware

import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { loadEnv } from '../../config/env';

const env = loadEnv();

/**
 * Express middleware that enforces authentication via a JSON Web Token (JWT).
 *
 * The middleware expects an Authorization header with the Bearer scheme:
 * "Authorization: Bearer <token>". It verifies the token using `env.JWT_SECRET`
 * via `jwt.verify`. If verification succeeds, the decoded payload is attached
 * to the request object as `req.user` (cast to `any` to avoid type augmentation)
 * and the request is passed to the next middleware/handler.
 *
 * If no token is present, the middleware responds with HTTP 401 and JSON:
 * { error: { message: 'Unauthenticated' } }.
 * If token verification fails, it responds with HTTP 401 and JSON:
 * { error: { message: 'Invalid token' } }.
 *
 * @param req - Express Request object. On success, `req.user` will contain the decoded token payload.
 * @param res - Express Response object used to send 401 responses on failure.
 * @param next - Express NextFunction; called when authentication succeeds.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: { message: 'Unauthenticated' } });
    return;
  }
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as any;
    // Store payload on request (use any to avoid type augmentation)
    (req as any).user = payload;
    next();
    return;
  } catch {
    res.status(401).json({ error: { message: 'Invalid token' } });
    return;
  }
}

export function requireRole(role: 'admin' | 'user') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;
    if (!user || user.role !== role) {
      res.status(403).json({ error: { message: 'Forbidden' } });
      return;
    }
    next();
    return;
  };
}
