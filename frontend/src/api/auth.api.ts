import { apiClient } from './client';
import type { 
  LoginCredentials, 
  RegisterCredentials, 
  AuthResponse, 
  User, 
  ChangePasswordCredentials 
} from '../types/auth.types';

interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return response.data.data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', credentials);
    return response.data.data;
  },

  getMe: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  },

  changePassword: async (data: ChangePasswordCredentials): Promise<void> => {
    await apiClient.patch<ApiResponse<void>>('/auth/change-password', data);
  },

  changeUsername: async (data: { newUsername: string }): Promise<User> => {
    const response = await apiClient.patch<ApiResponse<User>>('/auth/change-username', data);
    return response.data.data;
  },
};