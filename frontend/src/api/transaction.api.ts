import { apiClient } from './client';

export interface CreateTransactionDto {
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  categoryId?: string | null;
  description?: string;
  transactionDate?: string;
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

  // 👈 دالة التصدير الجديدة
  exportCsv: async (): Promise<Blob> => {
    const res = await apiClient.get('/transactions/export/csv', {
      responseType: 'blob', // 👈 يتطلب استلام الملف كـ Blob
    });
    return res.data;
  },
};