// express app (helmet, cors, morgan, json)
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { router as authRoutes } from './api/routes/auth.routes';
import { router as productRoutes } from './api/routes/products.routes';
import { errorHandler } from './api/middleware/error';

export const app: Application = express();
app.use(helmet());
// Allow all origins for development; restrict in production for security.
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan('tiny'));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);

app.use((req, res) => res.status(404).json({ error: { message: 'Not Found' } }));

/**
 * Custom error handler middleware.
 * Catches errors thrown in route handlers or middleware and sends a JSON response
 * with the error message and appropriate HTTP status code.
 * Should be placed after all other middleware and routes.
 */
app.use(errorHandler);
app.use(errorHandler);
