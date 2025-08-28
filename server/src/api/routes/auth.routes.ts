import { Router, type Router as ExpressRouter } from 'express';
import { login, register } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { loginSchema, registerSchema } from '../validators/auth.schema';
export const router: ExpressRouter = Router();
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
