import { type Router as ExpressRouter, Router } from 'express';
import * as ctrl from '../controllers/admin.controller';
import * as auditCtrl from '../controllers/auditLogs.controller';
import { requireAuth, requireRole } from '../middleware/auth';

export const router: ExpressRouter = Router();

// All admin routes require authentication and admin role
router.use(requireAuth, requireRole('admin'));

// Users management
router.get('/users', ctrl.listUsers);
router.delete('/users/:id', ctrl.removeUser);
router.post('/users/:id/promote', ctrl.promoteUser);
router.post('/users/:id/demote', ctrl.demoteUser);

// Audit logs
router.get('/audit-logs', auditCtrl.list);

export default router;
