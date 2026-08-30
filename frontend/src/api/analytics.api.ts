import { apiClient } from './client';

export interface AnalyticsResponse {
  metrics: {
    avgDailyBurn: number;
    savingsRate: number;
    expenseChangePct: number;
    highestCategory: string;
    highestCategoryPct: number;
    totalExpenses: number;
    totalIncome: number;
  };
  insightTitle: string;
  weeklyOutflow: Array<{
    week: string;
    amount: number;
    pct: number;
    color: string;
  }>;
  categoriesDistribution: Array<{
    category: string;
    color: string;
    amount: number;
    pct: number;
  }>;
}

export const analyticsApi = {
  getStats: async (timeframe: 'month' | 'quarter' | 'year'): Promise<AnalyticsResponse> => {
    const res = await apiClient.get(`/analytics`, {
      params: { timeframe },
    });
    return res.data?.data || res.data;
  },
};