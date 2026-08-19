import { create } from 'zustand';
import type { Transaction, CreateTransactionInput } from '../types/expense.types';

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  fetchTransactions: () => Promise<void>;
  addTransaction: (input: CreateTransactionInput) => void;
  deleteTransaction: (id: string) => void;
}

export const useExpenseStore = create<TransactionState>((set) => ({
  transactions: [
    {
      id: '1',
      userId: 'u1',
      amount: 84.50,
      type: 'EXPENSE',
      description: 'Supermarket Groceries',
      transactionDate: '2026-08-18',
      createdAt: new Date().toISOString(),
      category: { id: 'c1', name: 'Food & Dining', type: 'EXPENSE', color: '#6366f1' }
    },
    {
      id: '2',
      userId: 'u1',
      amount: 2500.00,
      type: 'INCOME',
      description: 'Monthly Salary',
      transactionDate: '2026-08-01',
      createdAt: new Date().toISOString(),
      category: { id: 'c2', name: 'Salary', type: 'INCOME', color: '#10b981' }
    },
    {
      id: '3',
      userId: 'u1',
      amount: 45.00,
      type: 'EXPENSE',
      description: 'Fuel Station',
      transactionDate: '2026-08-15',
      createdAt: new Date().toISOString(),
      category: { id: 'c3', name: 'Transportation', type: 'EXPENSE', color: '#f59e0b' }
    },
    {
      id: '4',
      userId: 'u1',
      amount: 15.99,
      type: 'EXPENSE',
      description: 'Netflix Subscription',
      transactionDate: '2026-08-10',
      createdAt: new Date().toISOString(),
      category: { id: 'c4', name: 'Entertainment', type: 'EXPENSE', color: '#ec4899' }
    }
  ],
  isLoading: false,
  error: null,

  fetchTransactions: async () => {
    set({ isLoading: true });
    set({ isLoading: false });
  },

  addTransaction: (input) =>
    set((state) => ({
      transactions: [
        {
          ...input,
          id: Date.now().toString(),
          userId: 'u1',
          transactionDate: input.transactionDate || new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString(),
          category: {
            id: 'c-temp',
            name: input.type === 'INCOME' ? 'General Income' : 'General Expense',
            type: input.type,
            color: input.type === 'INCOME' ? '#10b981' : '#6366f1'
          }
        },
        ...state.transactions,
      ],
    })),

  deleteTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    })),
}));