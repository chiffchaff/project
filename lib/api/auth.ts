import apiClient from './client';
import { User } from '@/store/auth';

interface LoginResponse {
  token: string;
  user: User;
}

interface SignupResponse {
  token: string;
  user: User;
}

export const authApi = {
  login: async (email: string, password: string, role: string) => {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', {
        email,
        password,
        role,
      });
      return response.data;
    } catch (error) {
      console.error('API Login error:', error);
      throw error;
    }
  },

  signup: async (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: 'owner' | 'tenant';
  }) => {
    const response = await apiClient.post<SignupResponse>('/auth/signup', data);
    return response.data;
  },

  validateToken: async () => {
    const response = await apiClient.get<{ user: User }>('/auth/me');
    return response.data;
  },

  requestPasswordReset: async (email: string) => {
    await apiClient.post('/auth/forgot-password', { email });
  },

  resetPassword: async (token: string, password: string) => {
    await apiClient.post('/auth/reset-password', { token, password });
  },
};