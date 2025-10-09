/**
 * Express Application Configuration
 *
 * This module configures and exports the main Express application instance for
 * Sofia's Shop portfolio backend. The app includes all necessary middleware,
 * route handlers, security configurations, and error handling.
 *
 * **Key Features:**
 * - Security headers via Helmet
 * - CORS configuration for cross-origin requests
 * - JSON request parsing
 * - File upload support via express-fileupload
 * - JWT-based authentication
 * - Request/response logging
 * - Static file serving for uploaded images
 * - Comprehensive error handling
 *
 * **Environment Configuration:**
 * - `CORS_ORIGIN`: Allowed origin for CORS (defaults to any origin in dev)
 * - `UPLOAD_MAX_MB`: Maximum file upload size in MB (default: 5)
 * - `NODE_ENV`: Environment mode (development/production)
 *
 * **Routes:**
 * - `/api/v1/auth` - Authentication (login, register, password reset)
 * - `/api/v1/products` - Product CRUD operations
 * - `/api/v1/admin` - Admin-only operations (user management)
 * - `/api/v1/uploads` - File upload handling
 * - `/api/v1/health` - Health check endpoint
 * - `/api/v1/maintenance` - Maintenance operations (admin only)
 * - `/uploads` - Static file serving for uploaded images
 * - `/api/v1/files` - Alternative static file serving path for dev proxy
 *
 * **Security:**
 * - Helmet for security headers
 * - CORS protection
 * - File type validation for uploads
 * - Size limits on uploads
 * - JWT token validation for protected routes
 *
 * @fileoverview Express application configuration for Sofia's Shop backend
 * @author Sofia's Shop Development Team
 * @module app
 */

// express app (helmet, cors, morgan, json)
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
// Removed morgan in favor of custom Firestore-backed logger
import fileUpload from 'express-fileupload';
import path from 'path';
import { router as authRoutes } from './api/routes/auth.routes';
import { router as productRoutes } from './api/routes/products.routes';
import { router as adminRoutes } from './api/routes/admin.routes';
import { router as uploadsRoutes } from './api/routes/uploads.routes';
import { router as healthRoutes } from './api/routes/health.routes';
import { router as maintenanceRoutes } from './api/routes/maintenance.routes';
import { createOrderRoutes } from './api/routes/orders.routes';
import { maintenanceGuard } from './api/middleware/maintenanceAuth';
import { errorHandler } from './api/middleware/error';
import { requestLogger } from './utils/logger';

/**
 * Express application instance created by calling express().
 *
 * This exported constant represents the central Application object used
 * to configure middleware, routes, error handlers, and other server
 * behavior. It is exported so the server startup logic or test suites can
 * import and operate on the same app instance.
 *
 * @remarks
 * - The app is created but not bound to a network port here; the caller
 *   should start the HTTP server (for example with app.listen or by
 *   attaching it to an http.Server) elsewhere.
 * - Configure middleware and routes on this instance in the application
 *   initialization modules to ensure they are available to all consumers.
 *
 * @public
 */
export const app: Application = express();
app.use(helmet());
// Allow all origins for development; restrict in production for security.
// CORS: allow any origin in dev; restrict in production via CORS_ORIGIN env
const corsOrigin =
  process.env.CORS_ORIGIN || (process.env.NODE_ENV === 'production' ? undefined : true);
app.use(
  cors({
    origin: corsOrigin ?? 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(requestLogger);
// Enable multipart/form-data for file uploads
const MAX_MB = Number(process.env.UPLOAD_MAX_MB || 5);
app.use(
  fileUpload({
    createParentPath: true,
    limits: { fileSize: MAX_MB * 1024 * 1024 },
  })
);
// Serve uploaded files statically
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));
// Also serve under the API prefix so dev proxy forwards correctly
app.use('/api/v1/files', express.static(path.resolve(process.cwd(), 'uploads')));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/uploads', uploadsRoutes);
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/maintenance', maintenanceGuard, maintenanceRoutes);
app.use('/api/v1/orders', createOrderRoutes());

app.use((req, res) => res.status(404).json({ error: { message: 'Not Found' } }));

/**
 * Custom error handler middleware.
 * Catches errors thrown in route handlers or middleware and sends a JSON response
 * with the error message and appropriate HTTP status code.
 * Should be placed after all other middleware and routes.
 */
app.use(errorHandler);
