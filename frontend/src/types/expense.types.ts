export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Category {
  id: string;
  userId?: string | null;
  name: string;
  type: TransactionType;
  color?: string | null;
  createdAt?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  categoryId?: string | null;
  category?: Category;
  amount: number;
  type: TransactionType;
  description?: string | null;
  transactionDate: string;
  createdAt: string;
}

export interface CreateTransactionInput {
  amount: number;
  type: TransactionType;
  categoryId?: string;
  description?: string;
  transactionDate?: string;
}