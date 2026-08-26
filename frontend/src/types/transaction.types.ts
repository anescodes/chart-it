export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Transaction {
  id: string;
  userId: string;
  categoryId?: string | null;
  amount: number | string; // Numeric columns in PostgreSQL/Drizzle are often returned as strings
  type: TransactionType;
  description?: string | null;
  transactionDate: string; // 👈 Updated to match backend schema name
  createdAt?: string;
}