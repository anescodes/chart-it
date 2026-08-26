// src/types/index.ts

export * from './auth.types';
export * from './category.types';
export * from './transaction.types';

export interface DashboardSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  recentTransactions: import('./transaction.types').Transaction[];
}