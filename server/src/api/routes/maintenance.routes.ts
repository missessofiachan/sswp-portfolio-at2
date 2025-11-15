import { getDb } from '@server/config/firestore';
import { tokenRevocationService } from '@server/services/auth';
import {
  auditLogsService,
  getMaintenanceState,
  setMaintenanceState,
} from '@server/services/monitoring';
import { type Router as ExpressRouter, Router } from 'express';

// Maintenance router providing manual cleanup operations. Guarded by maintenanceGuard middleware.
export const router: ExpressRouter = Router();

function getActor(req: any): { id?: string; email?: string } | undefined {
  return req?.user;
}

router.get('/state', async (req, res) => {
  const state = await getMaintenanceState();
  res.json({ data: state });
});

router.post('/state', async (req, res) => {
  const { enabled } = req.body ?? {};
  if (typeof enabled !== 'boolean') {
    res.status(400).json({ error: { message: 'enabled must be a boolean' } });
    return;
  }
  const actor = getActor(req);
  const state = await setMaintenanceState(enabled, actor);
  auditLogsService
    .log({
      action: 'maintenance.toggle',
      summary: `Maintenance mode ${enabled ? 'enabled' : 'disabled'}`,
      actorId: actor?.id,
      actorEmail: actor?.email,
      metadata: { enabled },
    })
    .catch(() => undefined);
  res.json({ data: state });
});

/**
 * POST /cleanup - Clean up expired records
 *
 * Efficiently removes:
 * - Expired password reset tokens (indexed query)
 * - Expired token revocations (indexed query)
 * - Old logs (indexed query if ts field is indexed)
 *
 * Note: For production at scale, consider:
 * - Firestore TTL policies (auto-cleanup)
 * - Scheduled Cloud Functions
 * - Background jobs with retry logic
 */
router.post('/cleanup', async (_req, res) => {
  const db = getDb();
  const now = Date.now();
  const cutoffLogs = now - 90 * 24 * 60 * 60 * 1000; // 90 days

  const results = {
    passwordResets: 0,
    tokenRevocations: 0,
    logs: 0,
  };

  try {
    // 1. Clean up expired password reset tokens (indexed query)
    // This is efficient because we query by expiresAt field
    const resetsSnap = await db
      .collection('password_resets')
      .where('expiresAt', '<', now)
      .limit(200)
      .get();

    if (!resetsSnap.empty) {
      const batch = db.batch();
      for (const doc of resetsSnap.docs) {
        batch.delete(doc.ref);
      }
      await batch.commit();
      results.passwordResets = resetsSnap.size;
    }

    // 2. Clean up expired token revocations (uses indexed query internally)
    results.tokenRevocations = await tokenRevocationService.cleanupExpiredRevocations(200);

    // 3. Clean up old logs (indexed query on ts field)
    // NOTE: This requires a composite index on (ts, ASC)
    // If index doesn't exist, Firestore will return an error with creation link
    try {
      const logsSnap = await db
        .collection('logs')
        .where('ts', '<', new Date(cutoffLogs).toISOString())
        .limit(500)
        .get();

      if (!logsSnap.empty) {
        const batch = db.batch();
        for (const doc of logsSnap.docs) {
          batch.delete(doc.ref);
        }
        await batch.commit();
        results.logs = logsSnap.size;
      }
    } catch (logError: any) {
      // If index doesn't exist, log warning but don't fail the entire cleanup
      if (logError?.code === 9 || logError?.code === 'failed-precondition') {
        console.warn(
          '⚠️  Logs cleanup skipped - Firestore index required. Create index at:',
          logError.message?.match(/https?:\/\/[^\s)]+/)?.[0]
        );
      } else {
        throw logError;
      }
    }

    res.json({
      data: {
        removed: results,
        note: 'For production at scale, consider Firestore TTL policies or Cloud Functions',
      },
    });
  } catch (error) {
    console.error('Cleanup error:', error);
    res.status(500).json({
      error: {
        message: 'Cleanup failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
    });
  }
});

export default router;
