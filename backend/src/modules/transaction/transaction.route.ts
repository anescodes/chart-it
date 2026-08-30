import { Router } from 'express';
import { TransactionController } from './transaction.controller.js';
import { authenticateToken } from '../../middlewares/auth.middleware.js';

const router = Router();
const controller = new TransactionController();

// 1. تطبيق حماية الـ JWT على كل مسارات المعاملات
router.use(authenticateToken);

// 2. المسارات الثابتة والمحددة (Static Routes) - توضع أولاً
router.get('/', controller.getTransactions);
router.get('/summary', controller.getSummary);
router.get('/export/csv', controller.exportCsv); // 👈 تمت الإضافة هنا قبل /:id

// 3. المسارات الديناميكية والعمليات الخاطفة (Dynamic Routes) - توضع أخيراً
router.post('/', controller.createTransaction);
router.delete('/:id', controller.deleteTransaction);

export default router;