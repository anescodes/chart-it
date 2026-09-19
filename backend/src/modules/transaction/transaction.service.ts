import { eq, and, desc, sql, isNull, or } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { transactions, categories } from '../../db/schema.js';
import type { CreateTransactionInput } from './transaction.schema.js';
import { ApiError } from '../../utils/ApiError.js';

export class TransactionService {
  async getUserTransactions(userId: string) {
    if (!userId) {
      throw new ApiError(401, 'User authentication required');
    }

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
          color: categories.color,
        },
      })
      .from(transactions)
      .leftJoin(
        categories,
        eq(transactions.categoryId, categories.id)
      )
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.transactionDate));
  }

  async getDashboardSummary(userId: string) {
    if (!userId) {
      throw new ApiError(401, 'User authentication required');
    }

    const stats = await db
      .select({
        type: transactions.type,
        totalAmount: sql<number>`
          COALESCE(
            SUM(CAST(${transactions.amount} AS FLOAT)),
            0
          )
        `,
      })
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .groupBy(transactions.type);

    let monthlyIncome = 0;
    let totalExpenses = 0;

    stats.forEach((row) => {
      if (row.type === 'INCOME') {
        monthlyIncome = Number(row.totalAmount);
      }

      if (row.type === 'EXPENSE') {
        totalExpenses = Number(row.totalAmount);
      }
    });

    return {
      totalBalance: monthlyIncome - totalExpenses,
      monthlyIncome,
      totalExpenses,
    };
  }

  async createTransaction(
    userId: string,
    input: CreateTransactionInput
  ) {
    // 1. Check that the user is authenticated
    if (!userId) {
      throw new ApiError(401, 'Unauthorized: User ID is missing');
    }

    // 2. Clean categoryId if it is empty
    const cleanCategoryId =
      input.categoryId && input.categoryId.trim() !== ''
        ? input.categoryId
        : null;

    // 3. Verify that the selected category exists
    //    and belongs either to the user or is a global category
    if (cleanCategoryId) {
      const [categoryExists] = await db
        .select({
          id: categories.id,
        })
        .from(categories)
        .where(
          and(
            eq(categories.id, cleanCategoryId),
            or(
              isNull(categories.userId),
              eq(categories.userId, userId)
            )
          )
        );

      if (!categoryExists) {
        throw new ApiError(
          404,
          'Selected category does not exist'
        );
      }
    }

    // 4. Create the transaction
    const [newTransaction] = await db
      .insert(transactions)
      .values({
        userId: userId,
        amount: input.amount.toFixed(2),
        type: input.type,
        categoryId: cleanCategoryId,
        description: input.description || null,
        transactionDate: input.transactionDate
          ? new Date(input.transactionDate)
          : new Date(),
      })
      .returning();

    return newTransaction;
  }

  async deleteTransaction(
    userId: string,
    transactionId: string
  ) {
    if (!userId) {
      throw new ApiError(
        401,
        'User authentication required'
      );
    }

    const [deleted] = await db
      .delete(transactions)
      .where(
        and(
          eq(transactions.id, transactionId),
          eq(transactions.userId, userId)
        )
      )
      .returning();

    if (!deleted) {
      throw new ApiError(
        404,
        'Transaction not found or unauthorized'
      );
    }

    return deleted;
  }

  async exportTransactionsCsv(
    userId: string
  ): Promise<string> {
    const userTransactions = await db
      .select({
        id: transactions.id,
        amount: transactions.amount,
        type: transactions.type,
        categoryName: categories.name,
        description: transactions.description,
        transactionDate: transactions.transactionDate,
      })
      .from(transactions)
      .leftJoin(
        categories,
        eq(transactions.categoryId, categories.id)
      )
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.transactionDate));

    // CSV headers
    const headers = [
      'ID',
      'Date',
      'Type',
      'Category',
      'Amount',
      'Description',
    ];

    // Convert transactions to CSV rows
    const rows = userTransactions.map((tx) => {
      const dateStr = tx.transactionDate
        ? new Date(tx.transactionDate)
            .toISOString()
            .split('T')[0]
        : '';

      const category =
        tx.categoryName || 'Uncategorized';

      const description = tx.description
        ? `"${tx.description.replace(/"/g, '""')}"`
        : '""';

      return [
        tx.id,
        dateStr,
        tx.type,
        `"${category}"`,
        tx.amount,
        description,
      ].join(',');
    });

    return [
      headers.join(','),
      ...rows,
    ].join('\n');
  }
}