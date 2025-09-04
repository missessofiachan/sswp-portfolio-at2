import { Router, type Router as ExpressRouter } from 'express';
import { loadEnv } from '../../config/env';
import { getDb } from '../../config/firestore';

export const router: ExpressRouter = Router();

type HealthResponse = {
  api: {
    ok: true;
    timestamp: string;
    uptimeSec: number;
  };
  database: {
    ok: boolean;
    store: 'firestore' | 'memory';
    latencyMs: number | null;
    error?: string;
  };
};

router.get('/', async (_req, res) => {
  const { DATA_STORE } = loadEnv();

  let dbOk = false;
  let latencyMs: number | null = null;
  let error: string | undefined;

  if (DATA_STORE === 'memory') {
    dbOk = true;
    latencyMs = 0;
  } else {
    try {
      const db = getDb();
      const start = Date.now();
      // Read-only check against a stable document path to avoid writes.
      await db.collection('diagnostics').doc('__health').get();
      latencyMs = Date.now() - start;
      dbOk = true;
    } catch (err) {
      dbOk = false;
      latencyMs = null;
      error = (err as Error)?.message ?? 'Unknown error';
    }
  }

  const body: HealthResponse = {
    api: {
      ok: true,
      timestamp: new Date().toISOString(),
      uptimeSec: Math.round(process.uptime()),
    },
    database: {
      ok: dbOk,
      store: DATA_STORE,
      latencyMs,
      ...(error ? { error } : {}),
    },
  };

  res.status(dbOk ? 200 : 503).json(body);
});
