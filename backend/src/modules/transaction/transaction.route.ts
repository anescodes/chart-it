import { Router } from 'express';
import { TransactionController } from './transaction.controller.js';
import { authenticateToken } from '../../middlewares/auth.middleware.js';

const transactionRouter = Router();
const controller = new TransactionController();

transactionRouter.use(authenticateToken);

transactionRouter.get('/', controller.getTransactions);
transactionRouter.get('/summary', controller.getSummary);
transactionRouter.post('/', controller.createTransaction);
transactionRouter.delete('/:id', controller.deleteTransaction);

export default transactionRouter;