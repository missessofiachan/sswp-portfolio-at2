// Firestore-backed logger (no in-memory buffering)
// Provides simple helper functions and an Express request logging middleware.
// Each log call writes a document directly to the Firestore `logs` collection.
// If Firestore write fails, it falls back to console logging without throwing.

import type { Request, Response, NextFunction } from 'express';
import { getDb } from '../config/firestore';

type LogLevel = 'info' | 'error' | 'warn' | 'debug';

interface BaseLogDoc {
  level: LogLevel;
  message: string;
  ts: string; // ISO timestamp
  meta?: Record<string, any>;
  type?: string; // e.g. 'http'
}

interface HttpLogMeta {
  method: string;
  path: string;
  status: number;
  durationMs: number;
  ip?: string;
  userAgent?: string;
  contentLength?: number | null;
}

// Environment flag to disable DB writes (e.g. during tests) while preserving interface
const DISABLE_DB_LOGS = process.env.DISABLE_DB_LOGS === '1' || process.env.NODE_ENV === 'test';

function write(doc: BaseLogDoc) {
  if (DISABLE_DB_LOGS) {
    // Still output to console (structured) for local visibility when disabled
    // eslint-disable-next-line no-console
    console.log(JSON.stringify({ _local: true, ...doc }));
    return;
  }
  try {
    const db = getDb();
    // Fire and forget; no awaiting to avoid adding latency to request lifecycle
    void db
      .collection('logs')
      .add(doc)
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Failed to persist log to Firestore:', err);
      });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Logger Firestore initialization error:', err);
  }
}

function base(level: LogLevel, message: string, meta?: Record<string, any>) {
  write({ level, message, meta, ts: new Date().toISOString() });
}

export function logInfo(message: string, meta?: Record<string, any>) {
  base('info', message, meta);
}

export function logWarn(message: string, meta?: Record<string, any>) {
  base('warn', message, meta);
}

export function logDebug(message: string, meta?: Record<string, any>) {
  if (process.env.NODE_ENV !== 'production') base('debug', message, meta);
}

export function logError(message: string, error?: unknown, meta?: Record<string, any>) {
  const errMeta: Record<string, any> = { ...meta };
  if (error instanceof Error) {
    errMeta.error = {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  } else if (error) {
    errMeta.error = error;
  }
  base('error', message, errMeta);
}

export function logHttp(meta: HttpLogMeta) {
  write({
    level: 'info',
    message: `${meta.method} ${meta.path} ${meta.status}`,
    ts: new Date().toISOString(),
    meta,
    type: 'http',
  });
}

// Express middleware for request logging (replaces morgan). Adds no in-memory queue.
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    try {
      const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
      logHttp({
        method: req.method,
        path: req.originalUrl || req.url,
        status: res.statusCode,
        durationMs: Number(durationMs.toFixed(3)),
        ip: req.ip,
        userAgent: req.get('user-agent') || undefined,
        contentLength: res.getHeader('content-length')
          ? Number(res.getHeader('content-length'))
          : null,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('requestLogger error:', err);
    }
  });
  next();
}

export const logger = { logInfo, logWarn, logDebug, logError };

export default logger;
