import { z } from 'zod';

export const getAnalyticsQuerySchema = z.object({
  timeframe: z.enum(['month', 'quarter', 'year']).default('month'),
});

export type GetAnalyticsQueryInput = z.infer<typeof getAnalyticsQuerySchema>;