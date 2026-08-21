import { z } from 'zod';

export const createTransactionSchema = z.object({
  amount: z
    .number({ message: 'Amount must be a number' })
    .positive('Amount must be greater than 0'),
  type: z.enum(['INCOME', 'EXPENSE'], { message: 'Type must be INCOME or EXPENSE' }),
  categoryId: z.string().uuid('Invalid category ID format').optional().nullable(),
  description: z.string().max(255).optional(),
  transactionDate: z.string().datetime().optional(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;