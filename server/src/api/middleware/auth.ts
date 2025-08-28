// verifyJWT, requireRole('admin'

import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { loadEnv } from '../../config/env';

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: { message: 'Unauthenticated' } });
    return;
  }
  try {
    const payload = jwt.verify(token, loadEnv().JWT_SECRET) as any;
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
