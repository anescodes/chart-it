import { apiClient } from './client';

export interface CreateTransactionDto {
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  categoryId?: string | null;
  description?: string;
  transactionDate?: string; // 👈 تغيير اسم الحقل هنا
}

export const transactionApi = {
  getAll: async () => {
    const res = await apiClient.get('/transactions');
    return res.data?.data || res.data || [];
  },

  create: async (data: CreateTransactionDto) => {
    const res = await apiClient.post('/transactions', data);
    return res.data?.data || res.data;
  },

  delete: async (id: string) => {
    const res = await apiClient.delete(`/transactions/${id}`);
    return res.data;
  },
};