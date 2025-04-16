import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '@/lib/api/auth';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'tenant';
  phone: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string, role: 'owner' | 'tenant') => Promise<void>;
  signUp: (data: { name: string; email: string; password: string; phone: string; role: 'owner' | 'tenant' }) => Promise<void>;
  signOut: () => Promise<void>;
  loadStoredAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isLoading: true,
  error: null,

  loadStoredAuth: async () => {
    try {
      set({ isLoading: true, error: null });
      const [token, userStr] = await Promise.all([
        AsyncStorage.getItem('auth_token'),
        AsyncStorage.getItem('auth_user')
      ]);
      
      if (token && userStr) {
        const user = JSON.parse(userStr);
        // Validate token with backend
        try {
          const { user: freshUser } = await authApi.validateToken();
          set({ token, user: freshUser, isLoading: false });
        } catch (error) {
          // Token is invalid, clear storage
          await AsyncStorage.multiRemove(['auth_token', 'auth_user']);
          set({ token: null, user: null, isLoading: false });
        }
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Error loading auth state:', error);
      set({ isLoading: false, error: 'Failed to load authentication state' });
    }
  },

  signIn: async (email: string, password: string, role: 'owner' | 'tenant') => {
    try {
      set({ isLoading: true, error: null });
      const { token, user } = await authApi.login(email, password, role);

      // Store auth data
      await Promise.all([
        AsyncStorage.setItem('auth_token', token),
        AsyncStorage.setItem('auth_user', JSON.stringify(user))
      ]);

      set({ token, user, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Authentication failed';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  signUp: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const { token, user } = await authApi.signup(data);

      // Store auth data
      await Promise.all([
        AsyncStorage.setItem('auth_token', token),
        AsyncStorage.setItem('auth_user', JSON.stringify(user))
      ]);

      set({ token, user, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true, error: null });
      await Promise.all([
        AsyncStorage.removeItem('auth_token'),
        AsyncStorage.removeItem('auth_user')
      ]);
      set({ token: null, user: null, isLoading: false });
    } catch (error) {
      console.error('Sign out error:', error);
      set({ error: 'Sign out failed', isLoading: false });
      throw new Error('Sign out failed');
    }
  },
}));