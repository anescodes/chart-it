import { Router } from 'express';
import { AnalyticsController } from './analytics.controller.js';
import { authenticateToken } from '../../middlewares/auth.middleware.js';

const router = Router();
const controller = new AnalyticsController();

router.get('/', authenticateToken, controller.getAnalytics);
export default router;