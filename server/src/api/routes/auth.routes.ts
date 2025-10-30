import { Router, type Router as ExpressRouter } from 'express';
import {
  login,
  register,
  requestPasswordReset,
  resetPassword,
} from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import {
  loginSchema,
  registerSchema,
  requestResetSchema,
  resetPasswordSchema,
} from '../validators/auth.schema';
import { authRateLimit } from '../middleware/rateLimit';
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

// Apply auth rate limiting to all authentication endpoints
router.post('/register', authRateLimit, validate(registerSchema), register);
router.post('/login', authRateLimit, validate(loginSchema), login);
router.post('/password/request', authRateLimit, validate(requestResetSchema), requestPasswordReset);
router.post('/password/reset', authRateLimit, validate(resetPasswordSchema), resetPassword);
