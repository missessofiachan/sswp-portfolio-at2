import { type Router as ExpressRouter, Router } from 'express';
import * as ctrl from '../controllers/favorites.controller';
import { requireAuth } from '../middleware/auth';

export const router: ExpressRouter = Router();

router.use(requireAuth);
router.get('/', ctrl.list);
router.get('/:productId', ctrl.status);
router.post('/:productId', ctrl.add);
router.delete('/:productId', ctrl.remove);

export default router;
