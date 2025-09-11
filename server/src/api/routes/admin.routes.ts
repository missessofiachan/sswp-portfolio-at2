import { Router, type Router as ExpressRouter } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import * as ctrl from '../controllers/admin.controller';

export const router: ExpressRouter = Router();

// All admin routes require authentication and admin role
router.use(requireAuth, requireRole('admin'));

// Users management
router.get('/users', ctrl.listUsers);
router.delete('/users/:id', ctrl.removeUser);
router.post('/users/:id/promote', ctrl.promoteUser);
router.post('/users/:id/demote', ctrl.demoteUser);

export default router;
