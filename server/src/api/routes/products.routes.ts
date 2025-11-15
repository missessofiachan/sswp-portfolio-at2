import { type Router as ExpressRouter, Router } from 'express';
import { getDb } from '../../config/firestore';
import * as ctrl from '../controllers/products.controller';
import { requireAuth, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { productCreateSchema, productUpdateSchema } from '../validators/products.schema';
export const router: ExpressRouter = Router();

router.get('/admin/stats', requireAuth, requireRole('admin'), ctrl.stats);
router.get('/admin/timeseries', requireAuth, requireRole('admin'), ctrl.timeseries);

router.get('/', ctrl.list);
// Diagnostic endpoint for health checks or testing database connectivity
router.get('/__smoke', async (_req, res) => {
  const db = getDb();
  const expireAt = new Date(Date.now() + 60 * 60 * 1000);
  const nowDoc = await db.collection('diagnostics').add({ at: Date.now(), expireAt });
  const snap = await nowDoc.get();
  res.json({ ok: true, wrote: snap.exists });
});
router.get('/:id', ctrl.getById);
router.post('/', requireAuth, validate(productCreateSchema), ctrl.create);
router.put('/:id', requireAuth, validate(productUpdateSchema), ctrl.update);
router.delete('/:id', requireAuth, requireRole('admin'), ctrl.remove);
