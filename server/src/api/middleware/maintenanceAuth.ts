import type { NextFunction, Request, Response } from 'express';
import { loadEnv } from '../../config/env';
import { requireAuth, requireRole } from './auth';

const { MAINTENANCE_SECRET } = loadEnv();

/**
 * Maintenance guard: if MAINTENANCE_SECRET is set, require matching header `x-maint-secret`.
 * Otherwise fall back to admin authentication (JWT + role=admin).
 */
export async function maintenanceGuard(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const secret = process.env.MAINTENANCE_SECRET ?? MAINTENANCE_SECRET;
  if (secret) {
    const header = req.header('x-maint-secret');
    if (header !== secret) {
      res.status(403).json({ error: { message: 'Forbidden' } });
      return;
    }
    next();
    return;
  }
  // Fallback: ensure admin auth
  await requireAuth(req, res, (err?: any) => {
    if (err) return; // requireAuth already responded
    return requireRole('admin')(req, res, next);
  });
}

export default maintenanceGuard;
