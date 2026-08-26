import { Router } from 'express';
import { TransactionController } from './transaction.controller.js';
import { authenticateToken } from '../../middlewares/auth.middleware.js'; // 👈 ضروري جداً

const router = Router();
const controller = new TransactionController();

router.use(authenticateToken);

router.get('/', controller.getTransactions);
router.get('/summary', controller.getSummary);
router.post('/', controller.createTransaction);
router.delete('/:id', controller.deleteTransaction);

export default router;