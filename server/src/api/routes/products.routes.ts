import { Router, type Router as ExpressRouter } from 'express';
import * as ctrl from '../controllers/products.controller';
import { requireAuth, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { productCreateSchema, productUpdateSchema } from '../validators/products.schema';
import { getDb } from '../../config/firestore';

export const router: ExpressRouter = Router();

router.get('/', ctrl.list);
router.get('/:id', ctrl.getById);
router.post('/', requireAuth, validate(productCreateSchema), ctrl.create);
router.put('/:id', requireAuth, validate(productUpdateSchema), ctrl.update);
router.delete('/:id', requireAuth, requireRole('admin'), ctrl.remove);

router.get('/admin/stats', requireAuth, requireRole('admin'), ctrl.stats);
router.get('/__smoke', async (_req, res) => {
  const db = getDb();
  const nowDoc = await db.collection('diagnostics').add({ at: Date.now() });
  const snap = await nowDoc.get();
  res.json({ ok: true, wrote: snap.exists });
});
