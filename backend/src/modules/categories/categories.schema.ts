import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1, 'the name is required').max(100),
  type: z.enum(['INCOME', 'EXPENSE']),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'رمز اللون Hex غير صالح').optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;