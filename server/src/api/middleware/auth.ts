// JWT verification and role guard middleware

import type { Request, Response, NextFunction } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { loadEnv } from '../../config/env';

const env = loadEnv();

interface DecodedToken extends JwtPayload {
  id?: unknown;
  email?: unknown;
  role?: unknown;
}

interface AuthenticatedUser {
  id: string;
  role: string;
  email?: string;
}

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
    const payload = jwt.verify(token, env.JWT_SECRET) as DecodedToken;
    const idFromToken =
      typeof payload.id === 'string'
        ? payload.id
        : typeof payload.sub === 'string'
          ? payload.sub
          : undefined;
    const role = typeof payload.role === 'string' ? payload.role : undefined;

    if (!idFromToken || !role) {
      res.status(401).json({ error: { message: 'Invalid token' } });
      return;
    }

    const user: AuthenticatedUser = {
      id: idFromToken,
      role,
      email: typeof payload.email === 'string' ? payload.email : undefined,
    };

    // Store normalized payload on request (use any to avoid type augmentation)
    (req as any).user = user;
    next();
    return;
  } catch {
    res.status(401).json({ error: { message: 'Invalid token' } });
    return;
  }
}

export function requireRole(role: 'admin' | 'user') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user as AuthenticatedUser | undefined;
    if (!user || user.role !== role) {
      res.status(403).json({ error: { message: 'Forbidden' } });
      return;
    }
    next();
    return;
  };
}
