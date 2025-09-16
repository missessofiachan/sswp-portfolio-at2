import type { Request, Response, NextFunction } from 'express';
import { requireAuth, requireRole } from './auth';

/**
 * Maintenance guard: if MAINTENANCE_SECRET is set, require matching header `x-maint-secret`.
 * Otherwise fall back to admin authentication (JWT + role=admin).
 */
export function maintenanceGuard(req: Request, res: Response, next: NextFunction): void {
  const secret = process.env.MAINTENANCE_SECRET;
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
  return requireAuth(req, res, (err?: any) => {
    if (err) return; // requireAuth already responded
    return requireRole('admin')(req, res, next);
  });
}

export default maintenanceGuard;
