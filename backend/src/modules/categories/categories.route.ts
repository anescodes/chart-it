import { Router } from 'express';
import { CategoryController } from './categories.controller.js';
import { authenticateToken } from '../../middlewares/auth.middleware.js';

const router = Router();

const controller = new CategoryController();

router.use(authenticateToken);

router.get('/', controller.getCategories);

router.post('/', controller.createCategory);

router.delete('/:id', controller.deleteCategory);

export default router;