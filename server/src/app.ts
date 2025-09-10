// express app (helmet, cors, morgan, json)
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import fileUpload from 'express-fileupload';
import path from 'path';
import { router as authRoutes } from './api/routes/auth.routes';
import { router as productRoutes } from './api/routes/products.routes';
import { router as adminRoutes } from './api/routes/admin.routes';
import { router as uploadsRoutes } from './api/routes/uploads.routes';
import { router as healthRoutes } from './api/routes/health.routes';
import { errorHandler } from './api/middleware/error';

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
app.use(morgan('tiny'));
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

app.use((req, res) => res.status(404).json({ error: { message: 'Not Found' } }));

/**
 * Custom error handler middleware.
 * Catches errors thrown in route handlers or middleware and sends a JSON response
 * with the error message and appropriate HTTP status code.
 * Should be placed after all other middleware and routes.
 */
app.use(errorHandler);
