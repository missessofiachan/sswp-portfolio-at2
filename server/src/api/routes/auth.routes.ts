import { Router, type Router as ExpressRouter } from 'express';
import { login, register } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { loginSchema, registerSchema } from '../validators/auth.schema';
/**
 * Express router that groups authentication-related endpoints.
 *
 * This Router instance is created via express.Router() and is intended to contain
 * all routes for user authentication (for example: login, logout, register,
 * password reset, token refresh). It is exported so it can be mounted into the
 * main Express application (commonly under the "/auth" path).
 *
 * @public
 * @type {ExpressRouter}
 * @example
 * // in your app bootstrap
 * import { router as authRouter } from './api/routes/auth.routes';
 * app.use('/auth', authRouter);
 */
export const router: ExpressRouter = Router();
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
