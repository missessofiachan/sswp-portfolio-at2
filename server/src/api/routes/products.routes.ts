import { Router, type Router as ExpressRouter } from 'express';
import * as ctrl from '../controllers/products.controller';
import { requireAuth, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { productCreateSchema, productUpdateSchema } from '../validators/products.schema';
import { getDb } from '../../config/firestore';
export const router: ExpressRouter = Router();

router.get('/admin/stats', requireAuth, requireRole('admin'), ctrl.stats);

router.get('/', ctrl.list);
router.get('/:id', ctrl.getById);
router.post('/', requireAuth, validate(productCreateSchema), ctrl.create);
router.put('/:id', requireAuth, validate(productUpdateSchema), ctrl.update);
router.delete('/:id', requireAuth, requireRole('admin'), ctrl.remove);
// Diagnostic endpoint for health checks or testing database connectivity
router.get('/__smoke', async (_req, res) => {
  const db = getDb();
  // Add a TTL field (e.g., expireAt) set to 1 hour from now
  const expireAt = new Date(Date.now() + 60 * 60 * 1000);
  /**
   * Reference to the newly created diagnostic document in the Firestore "diagnostics" collection.
   *
   * This is the DocumentReference returned by Firestore's add() operation. It contains the
   * auto-generated document ID and provides methods to read, update, or delete the document.
   *
   * @remarks
   * - Use nowDoc.id to access the generated document identifier.
   * - Use nowDoc.get(), nowDoc.update(data), or nowDoc.delete() to operate on the persisted document.
   *
   * @type {FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>}
   * @example
   * // Get the generated ID:
   * // const id = nowDoc.id;
   *
   * @see https://firebase.google.com/docs/firestore/manage-data/add-data#add_a_document
   */
  const nowDoc = await db.collection('diagnostics').add({ at: Date.now(), expireAt });
  const snap = await nowDoc.get();
  res.json({ ok: true, wrote: snap.exists });
});
