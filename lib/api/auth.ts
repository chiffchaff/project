import { User, UserWithPassword } from '@/store/auth';
import { firestoreService } from './firestore';
import { generateToken, verifyToken } from '../../utils/auth';
import { hashPassword, verifyPassword } from '../../utils/password';

interface LoginResponse {
  token: string;
  user: User;
}

interface SignupResponse {
  token: string;
  user: User;
}

export const authApi = {
  login: async (email: string, password: string, role: string): Promise<LoginResponse> => {
    try {
      const user = await firestoreService.getUserByEmail(email);
      if (!user || user.role !== role) {
        throw new Error('Invalid credentials');
      }

      const isValidPassword = await verifyPassword(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      const token = generateToken(user.id);
      const { password: _, ...userWithoutPassword } = user;
      return { token, user: userWithoutPassword };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  signup: async (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: 'owner' | 'tenant';
  }): Promise<SignupResponse> => {
    const hashedPassword = await hashPassword(data.password);
    const userData = {
      ...data,
      password: hashedPassword,
    };

    const user = await firestoreService.createUser(userData);
    const token = generateToken(user.id);
    
    const { password: _, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  },

  validateToken: async (token: string) => {
    const userId = verifyToken(token);
    if (!userId) throw new Error('Invalid token');
    
    const user = await firestoreService.getUserByEmail(userId);
    if (!user) throw new Error('User not found');
    
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword };
  },

  requestPasswordReset: async (email: string) => {
    const user = await firestoreService.getUserByEmail(email);
    if (user) {
      // In a real app, send password reset email here
      // For now, just return success
      return true;
    }
    return true; // Don't reveal if email exists
  },

  resetPassword: async (token: string, password: string) => {
    const userId = verifyToken(token);
    if (!userId) throw new Error('Invalid token');
    
    const hashedPassword = await hashPassword(password);
    await firestoreService.updateUser(userId, { password: hashedPassword });
  },
};