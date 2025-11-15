/**
 * Central logging utilities built on top of Winston providing structured file
 * output, console formatting for development, and HTTP request middleware.
 */
import type { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { createLogger, format, transports } from 'winston';
import { getCorrelationId } from '../api/middleware/correlationId';
import { loadEnv } from '../config/env';

type LogLevel = 'info' | 'error' | 'warn' | 'debug';

interface HttpLogMeta {
  method: string;
  path: string;
  status: number;
  durationMs: number;
  ip?: string;
  userAgent?: string;
  contentLength?: number | null;
}

const env = loadEnv();

const LOG_TO_FILE = (() => {
  const raw = env.LOG_TO_FILE;
  if (!raw) return true;
  const normalized = raw.trim().toLowerCase();
  return !['0', 'false', 'no', 'off'].includes(normalized);
})();

const LOG_DIRECTORY =
  env.LOG_DIR && env.LOG_DIR.trim().length > 0
    ? path.resolve(process.cwd(), env.LOG_DIR)
    : path.resolve(process.cwd(), 'logs');
const LOG_FILENAME = env.LOG_FILE && env.LOG_FILE.trim().length > 0 ? env.LOG_FILE : 'app.log';
const LOG_PATH = path.join(LOG_DIRECTORY, LOG_FILENAME);
const LOG_LEVEL =
  env.LOG_LEVEL && env.LOG_LEVEL.trim().length > 0
    ? env.LOG_LEVEL
    : process.env.NODE_ENV === 'production'
      ? 'info'
      : 'debug';
const MAX_SIZE_BYTES =
  typeof env.LOG_MAX_SIZE === 'number' && Number.isFinite(env.LOG_MAX_SIZE) && env.LOG_MAX_SIZE > 0
    ? env.LOG_MAX_SIZE
    : undefined;
const MAX_FILES =
  typeof env.LOG_MAX_FILES === 'number' &&
  Number.isFinite(env.LOG_MAX_FILES) &&
  env.LOG_MAX_FILES > 0
    ? env.LOG_MAX_FILES
    : undefined;

function ensureLogDirectory(dir: string) {
  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to prepare log directory:', error);
  }
}

if (LOG_TO_FILE) {
  ensureLogDirectory(LOG_DIRECTORY);
}

const loggerInstance = createLogger({
  level: LOG_LEVEL,
  format: format.combine(
    format.errors({ stack: true }),
    format.metadata({ fillExcept: ['message', 'level', 'timestamp'] }),
    format.timestamp(),
    format.json()
  ),
  transports: LOG_TO_FILE
    ? [
        new transports.File({
          filename: LOG_PATH,
          maxsize: MAX_SIZE_BYTES ?? 5 * 1024 * 1024,
          maxFiles: MAX_FILES ?? 5,
          tailable: true,
        }),
      ]
    : [],
});

if (process.env.NODE_ENV !== 'production' || !LOG_TO_FILE) {
  loggerInstance.add(
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf(({ level, message, timestamp, ...rest }) => {
          const { metadata, ...extra } = rest as Record<string, unknown>;
          const mergedMeta = {
            ...(typeof metadata === 'object' && metadata !== null ? metadata : {}),
            ...extra,
          };
          const metaString =
            mergedMeta && Object.keys(mergedMeta).length > 0
              ? ` ${JSON.stringify(mergedMeta)}`
              : '';
          return `${timestamp as string} ${level}: ${message as string}${metaString}`;
        })
      ),
    })
  );
}

function base(level: LogLevel, message: string, meta?: Record<string, any>) {
  if (meta && Object.keys(meta).length > 0) {
    loggerInstance.log(level, message, meta);
  } else {
    loggerInstance.log(level, message);
  }
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
  loggerInstance.info(`${meta.method} ${meta.path} ${meta.status}`, { type: 'http', ...meta });
}

// Express middleware for request logging (replaces morgan). Adds no in-memory queue.
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = process.hrtime.bigint();
  const correlationId = getCorrelationId(req);

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
        correlationId,
      } as any);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('requestLogger error:', err);
    }
  });
  next();
}

export const logger = { logInfo, logWarn, logDebug, logError, logHttp };

export const winstonLogger = loggerInstance;

export default logger;
