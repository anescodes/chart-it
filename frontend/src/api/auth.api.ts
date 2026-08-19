// src/api/auth.api.ts
import { apiClient } from './client';
import type { LoginCredentials, RegisterCredentials, AuthResponse, User } from '../types/auth.types';

// واجهة لتطابق رد الـ Backend الخاص بك
interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // المسار النهائي المكتمل: http://localhost:5000/api/auth/login
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return response.data.data; // استخراج { user, token } المباشر
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    // المسار النهائي المكتمل: http://localhost:5000/api/auth/register
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', credentials);
    return response.data.data; // استخراج { user, token } المباشر
  },

  getMe: async (): Promise<User> => {
    // المسار النهائي المكتمل: http://localhost:5000/api/auth/me
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  },
};