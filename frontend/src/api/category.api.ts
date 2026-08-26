// src/api/category.api.ts
import { apiClient } from './client';
import type { Category } from '../types/category.types';

export const categoryApi = {
  getAll: async (): Promise<Category[]> => {
    const res = await apiClient.get('/categories');
    // إذا كان الباك إند يرجع المصفوفة في res.data أو res.data.data
    return Array.isArray(res.data) ? res.data : res.data.data || [];
  },

  create: async (payload: Omit<Category, 'id'>): Promise<Category> => {
    const res = await apiClient.post('/categories', payload);
    return res.data.data || res.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/categories/${id}`);
  },
};