import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { TransactionService } from './transaction.service.js';
import { createTransactionSchema } from './transaction.schema.js';

const transactionService = new TransactionService();

export class TransactionController {
  getTransactions = asyncHandler(async (req: Request, res: Response) => {
    const data = await transactionService.getUserTransactions(req.userId!);
    return res.status(200).json(new ApiResponse(200, data, 'Transactions fetched successfully'));
  });

  getSummary = asyncHandler(async (req: Request, res: Response) => {
    const data = await transactionService.getDashboardSummary(req.userId!);
    return res.status(200).json(new ApiResponse(200, data, 'Summary stats calculated successfully'));
  });

  createTransaction = asyncHandler(async (req: Request, res: Response) => {
    const validated = createTransactionSchema.parse(req.body);
    const data = await transactionService.createTransaction(req.userId!, validated);
    return res.status(201).json(new ApiResponse(201, data, 'Transaction created successfully'));
  });

  deleteTransaction = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string; // 👈 تحويل صريح للنوع يمنع التعارض مع asyncHandler
    await transactionService.deleteTransaction(req.userId!, id);
    return res.status(200).json(new ApiResponse(200, null, 'Transaction removed successfully'));
  });
}