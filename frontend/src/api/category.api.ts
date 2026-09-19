import { apiClient } from './client';
import type {
  Category,
  CreateCategoryInput,
} from '../types/category.types';

export const categoryApi = {
  getAll: async (): Promise<Category[]> => {
    const res = await apiClient.get('/categories');

    return Array.isArray(res.data)
      ? res.data
      : res.data.data || [];
  },

  create: async (
    payload: CreateCategoryInput
  ): Promise<Category> => {
    const res = await apiClient.post('/categories', payload);

    return res.data.data || res.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/categories/${id}`);
  },
};