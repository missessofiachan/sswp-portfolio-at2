/**
 * Express Application Configuration
 *
 * This module configures and exports the main Express application instance for
 * Sofia's Shop portfolio backend. The app includes all necessary middleware,
 * route handlers, security configurations, and error handling.
 */

import cors from 'cors';
// express app (helmet, cors, morgan, json)
import express, { type Application } from 'express';
// Removed morgan in favor of custom Firestore-backed logger
import fileUpload from 'express-fileupload';
import helmet from 'helmet';
import { correlationIdMiddleware } from './api/middleware/correlationId';
import { errorHandler } from './api/middleware/error';
import { maintenanceGuard } from './api/middleware/maintenanceAuth';
import { metricsMiddleware } from './api/middleware/metrics';
import { apiRateLimit } from './api/middleware/rateLimit';
import { router as activityFeedRoutes } from './api/routes/activityFeed.routes';
import { router as adminRoutes } from './api/routes/admin.routes';
import { router as authRoutes } from './api/routes/auth.routes';
import { router as favoritesRoutes } from './api/routes/favorites.routes';
import { router as healthRoutes } from './api/routes/health.routes';
import { router as maintenanceRoutes } from './api/routes/maintenance.routes';
import { router as metricsRoutes } from './api/routes/metrics.routes';
import { createOrderRoutes } from './api/routes/orders.routes';
import { router as productRoutes } from './api/routes/products.routes';
import { router as uploadsRoutes } from './api/routes/uploads.routes';
import { loadEnv } from './config/env';
import { initializeOrderAuditListeners } from './services/orders';
import { requestLogger } from './utils/logger';
import { monitoring } from './utils/monitoring';

const env = loadEnv();

// Initialize error monitoring early
monitoring.init();

// Initialize order audit listeners for tracking order lifecycle events
initializeOrderAuditListeners();

export const app: Application = express();
app.use(helmet());

// CORS Configuration

let corsOrigin: string | string[] | boolean;
if (process.env.NODE_ENV === 'production') {
  if (!env.CORS_ORIGIN) {
    console.error('⚠️  WARNING: CORS_ORIGIN not set in production. This is a security risk!');
    corsOrigin = false; // Block all CORS in production if not configured
  } else {
    // Support comma-separated list of origins
    corsOrigin = env.CORS_ORIGIN.split(',').map((origin) => origin.trim());
    console.log('✓ CORS origins configured:', corsOrigin);
  }
} else {
  corsOrigin = env.CORS_ORIGIN ? env.CORS_ORIGIN.split(',').map((origin) => origin.trim()) : true; // Allow all in development
}

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400, // 24 hours
  })
);
app.use(express.json());
app.use(correlationIdMiddleware);
app.use(requestLogger);

// Prometheus metrics middleware (if enabled)
if (env.METRICS_ENABLED) {
  app.use(metricsMiddleware);
}

// Apply general API rate limiting
// Auth routes have their own stricter rate limits
app.use('/api/v1', apiRateLimit);

// Enable multipart/form-data for file uploads
const { UPLOAD_MAX_MB } = env;
app.use(
  fileUpload({
    createParentPath: true,
    limits: { fileSize: UPLOAD_MAX_MB * 1024 * 1024 },
  })
);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/uploads', uploadsRoutes);
app.use('/api/v1/favorites', favoritesRoutes);
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/maintenance', maintenanceGuard, maintenanceRoutes);
app.use('/api/v1/orders', createOrderRoutes());
app.use('/api/v1/activity-feed', activityFeedRoutes);

// Prometheus metrics endpoint (if enabled)
if (env.METRICS_ENABLED) {
  app.use('/metrics', metricsRoutes);
  console.log('✓ Prometheus metrics enabled at /metrics');
}

app.use((req, res) => res.status(404).json({ error: { message: 'Not Found' } }));

/**

 */
app.use(errorHandler);
