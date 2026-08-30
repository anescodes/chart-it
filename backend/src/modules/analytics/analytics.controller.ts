import type { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from './analytics.service.js';
import { getAnalyticsQuerySchema } from './analytics.schema.js';
import { ApiError } from '../../utils/ApiError.js';

const analyticsService = new AnalyticsService();

export class AnalyticsController {
  async getAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId; // Populated by authenticateToken
      if (!userId) {
        throw new ApiError(401, 'User authentication required');
      }

      const parsedQuery = getAnalyticsQuerySchema.parse(req.query);

      const data = await analyticsService.getAnalytics(userId, parsedQuery.timeframe);
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}