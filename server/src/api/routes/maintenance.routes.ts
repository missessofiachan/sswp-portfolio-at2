import { Router, type Router as ExpressRouter } from 'express';
import { getDb } from '../../config/firestore';
import { tokenRevocationService } from '../../services/tokenRevocation.service';

// Maintenance router providing manual cleanup operations. Guarded by maintenanceGuard middleware.
export const router: ExpressRouter = Router();

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
      resetsSnap.forEach((d) => batch.delete(d.ref));
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
        logsSnap.forEach((d) => batch.delete(d.ref));
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
