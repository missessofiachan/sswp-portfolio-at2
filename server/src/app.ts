// express app (helmet, cors, morgan, json)
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { router as authRoutes } from './api/routes/auth.routes';
import { router as productRoutes } from './api/routes/products.routes';
import { errorHandler } from './api/middleware/error';

export const app = express();
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan('tiny'));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);

app.use((req, res) => res.status(404).json({ error: { message: 'Not Found' } }));
app.use(errorHandler);
