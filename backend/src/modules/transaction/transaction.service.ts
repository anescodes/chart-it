import { eq, and, desc, sql } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { transactions, categories } from '../../db/schema.js';
import type { CreateTransactionInput } from './transaction.schema.js';
import { ApiError } from '../../utils/ApiError.js';

export class TransactionService {
  async getUserTransactions(userId: string) {
    return await db
      .select({
        id: transactions.id,
        userId: transactions.userId,
        amount: sql<number>`CAST(${transactions.amount} AS FLOAT)`,
        type: transactions.type,
        description: transactions.description,
        transactionDate: transactions.transactionDate,
        createdAt: transactions.createdAt,
        category: {
          id: categories.id,
          name: categories.name,
          type: categories.type,
          color: categories.color, // تعتمد على color الموجود في الـ schema
        },
      })
      .from(transactions)
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.transactionDate));
  }

  async getDashboardSummary(userId: string) {
    const stats = await db
      .select({
        type: transactions.type,
        totalAmount: sql<number>`COALESCE(SUM(CAST(${transactions.amount} AS FLOAT)), 0)`,
      })
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .groupBy(transactions.type);

    let monthlyIncome = 0;
    let totalExpenses = 0;

    stats.forEach((row) => {
      if (row.type === 'INCOME') monthlyIncome = Number(row.totalAmount);
      if (row.type === 'EXPENSE') totalExpenses = Number(row.totalAmount);
    });

    return {
      totalBalance: monthlyIncome - totalExpenses,
      monthlyIncome,
      totalExpenses,
    };
  }

  async createTransaction(userId: string, input: CreateTransactionInput) {
    if (input.categoryId) {
      const [categoryExists] = await db
        .select({ id: categories.id })
        .from(categories)
        .where(
          and(
            eq(categories.id, input.categoryId),
            sql`(${categories.userId} IS NULL OR ${categories.userId} = ${userId})`
          )
        );

      if (!categoryExists) {
        throw new ApiError(404, 'Selected category does not exist');
      }
    }

    const [newTransaction] = await db
      .insert(transactions)
      .values({
        userId,
        amount: input.amount.toFixed(2),
        type: input.type,
        categoryId: input.categoryId || null,
        description: input.description || null,
        transactionDate: input.transactionDate ? new Date(input.transactionDate) : new Date(),
      })
      .returning();

    return newTransaction;
  }

  async deleteTransaction(userId: string, transactionId: string) {
    const [deleted] = await db
      .delete(transactions)
      .where(and(eq(transactions.id, transactionId), eq(transactions.userId, userId)))
      .returning();

    if (!deleted) {
      throw new ApiError(404, 'Transaction not found or unauthorized');
    }

    return deleted;
  }
}