import { eq, and, gte, lte, sql, desc } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { transactions, categories } from '../../db/schema.js';
import { ApiError } from '../../utils/ApiError.js';

export class AnalyticsService {
  async getAnalytics(userId: string, timeframe: 'month' | 'quarter' | 'year' = 'month') {
    if (!userId) throw new ApiError(401, 'User authentication required');

    const now = new Date();
    let startDate = new Date();

    // 1. تحديد النطاق الزمني
    if (timeframe === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (timeframe === 'quarter') {
      const currentQuarter = Math.floor(now.getMonth() / 3);
      startDate = new Date(now.getFullYear(), currentQuarter * 3, 1);
    } else if (timeframe === 'year') {
      startDate = new Date(now.getFullYear(), 0, 1);
    }

    const durationMs = now.getTime() - startDate.getTime();
    const prevStartDate = new Date(startDate.getTime() - durationMs);
    const prevEndDate = new Date(startDate.getTime() - 1);

    // 2. حساب مجاميع الفترة الحالية والسابقة
    const [currentTotals, previousTotals] = await Promise.all([
      db
        .select({
          type: transactions.type,
          totalAmount: sql<number>`COALESCE(SUM(CAST(${transactions.amount} AS FLOAT)), 0)`,
        })
        .from(transactions)
        .where(
          and(
            eq(transactions.userId, userId),
            gte(transactions.transactionDate, startDate),
            lte(transactions.transactionDate, now)
          )
        )
        .groupBy(transactions.type),

      db
        .select({
          type: transactions.type,
          totalAmount: sql<number>`COALESCE(SUM(CAST(${transactions.amount} AS FLOAT)), 0)`,
        })
        .from(transactions)
        .where(
          and(
            eq(transactions.userId, userId),
            gte(transactions.transactionDate, prevStartDate),
            lte(transactions.transactionDate, prevEndDate)
          )
        )
        .groupBy(transactions.type),
    ]);

    let totalIncome = 0;
    let totalExpenses = 0;
    currentTotals.forEach((row) => {
      if (row.type === 'INCOME') totalIncome = Number(row.totalAmount);
      if (row.type === 'EXPENSE') totalExpenses = Number(row.totalAmount);
    });

    let prevExpenses = 0;
    previousTotals.forEach((row) => {
      if (row.type === 'EXPENSE') prevExpenses = Number(row.totalAmount);
    });

    // 3. حساب الكروت الأساسية
    const daysPassed = Math.max(1, Math.ceil(durationMs / (1000 * 60 * 60 * 24)));
    const avgDailyBurn = Number((totalExpenses / daysPassed).toFixed(2));
    const savingsRate = totalIncome > 0 ? Number((((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1)) : 0;

    const expenseChangePct = prevExpenses > 0 
      ? Number((((totalExpenses - prevExpenses) / prevExpenses) * 100).toFixed(1))
      : 0;

    // 4. توزيع المصاريف حسب الفئات (Spending Distribution)
    const categoryStats = await db
      .select({
        id: categories.id,
        name: categories.name,
        color: categories.color,
        amount: sql<number>`COALESCE(SUM(CAST(${transactions.amount} AS FLOAT)), 0)`,
      })
      .from(transactions)
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(
        and(
          eq(transactions.userId, userId),
          eq(transactions.type, 'EXPENSE'),
          gte(transactions.transactionDate, startDate)
        )
      )
      .groupBy(categories.id, categories.name, categories.color)
      .orderBy(desc(sql`SUM(CAST(${transactions.amount} AS FLOAT))`));

    const highestCategory = categoryStats[0]?.name || 'N/A';
    const highestCategoryAmount = categoryStats[0]?.amount || 0;
    const highestCategoryPct = totalExpenses > 0 ? Math.round((highestCategoryAmount / totalExpenses) * 100) : 0;

    const categoriesDistribution = categoryStats.map((c) => ({
      category: c.name || 'Uncategorized',
      color: c.color || '#6366f1',
      amount: Number(c.amount),
      pct: totalExpenses > 0 ? Math.round((Number(c.amount) / totalExpenses) * 100) : 0,
    }));

    // 5. حساب التوزيع الأسبوعي (Weekly Outflow)
    const weeklyRaw = await db
      .select({
        weekNumber: sql<number>`CAST(EXTRACT(WEEK FROM ${transactions.transactionDate}) AS INTEGER)`,
        amount: sql<number>`COALESCE(SUM(CAST(${transactions.amount} AS FLOAT)), 0)`,
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          eq(transactions.type, 'EXPENSE'),
          gte(transactions.transactionDate, startDate)
        )
      )
      .groupBy(sql`EXTRACT(WEEK FROM ${transactions.transactionDate})`)
      .orderBy(sql`EXTRACT(WEEK FROM ${transactions.transactionDate})`);

    const maxWeeklyAmount = Math.max(...weeklyRaw.map((w) => Number(w.amount)), 1);
    const weeklyOutflow = weeklyRaw.map((w, idx) => ({
      week: `Week ${idx + 1}`,
      amount: Number(w.amount),
      pct: Math.min(100, Math.round((Number(w.amount) / maxWeeklyAmount) * 100)),
      color: idx % 2 === 0 ? 'bg-indigo-500' : 'bg-emerald-500',
    }));

    // Dynamic Insight Banner Message
    let insightTitle = `Your spending behavior is stable this period`;
    if (expenseChangePct < 0) {
      insightTitle = `You saved ${Math.abs(expenseChangePct)}% more compared to last period!`;
    } else if (expenseChangePct > 0) {
      insightTitle = `Expenses increased by ${expenseChangePct}% compared to last period.`;
    }

    return {
      metrics: {
        avgDailyBurn,
        savingsRate,
        expenseChangePct,
        highestCategory,
        highestCategoryPct,
        totalExpenses,
        totalIncome,
      },
      insightTitle,
      weeklyOutflow,
      categoriesDistribution,
    };
  }
}