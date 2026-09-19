import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1, 'The name is required').max(100),

  color: z
    .string()
    .regex(
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      'Invalid Hex color'
    )
    .optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;