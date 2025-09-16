import { Router, type Router as ExpressRouter } from 'express';
import { getDb } from '../../config/firestore';

// Maintenance router providing manual cleanup operations. Guarded by maintenanceGuard middleware.
export const router: ExpressRouter = Router();

router.post('/cleanup', async (_req, res) => {
  const db = getDb();
  const now = Date.now();
  const cutoffLogs = now - 90 * 24 * 60 * 60 * 1000; // 90 days
  const batch = db.batch();

  // Expired password reset tokens
  const resetsSnap = await db
    .collection('password_resets')
    .where('expiresAt', '<', now)
    .limit(200)
    .get();
  resetsSnap.forEach((d) => batch.delete(d.ref));

  // Old logs (inefficient full scan limited to 500) — for large volume use TTL or partitioning
  const logsSnap = await db.collection('logs').limit(500).get();
  logsSnap.forEach((d) => {
    const data = d.data() as { ts?: string };
    if (data.ts && Date.parse(data.ts) < cutoffLogs) batch.delete(d.ref);
  });

  await batch.commit();
  res.json({ data: { removed: { resets: resetsSnap.size } } });
});

export default router;
