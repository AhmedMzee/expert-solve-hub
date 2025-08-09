import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './baseService';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  username: string;
  bio?: string;
  userType: 'user' | 'student' | 'expert' | 'admin';
  profilePicture?: string;
  expertiseCategories?: number[];
}

export interface User {
  user_id: number;
  email: string;
  full_name: string;
  username: string;
  bio?: string;
  user_type: 'user' | 'student' | 'expert' | 'admin';
  profile_picture?: string;
  created_at: string;
  updated_at: string;
  expertise_areas?: string[];
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

class AuthService {
  async login(credentials: LoginData): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;
      
      // Store auth data
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;
      
      // Store auth data
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  }

  async logout(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(['authToken', 'userData']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async getStoredUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Get stored user error:', error);
      return null;
    }
  }

  async getStoredToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Get stored token error:', error);
      return null;
    }
  }

  async getCurrentProfile(): Promise<User> {
    try {
      const response = await api.get('/auth/profile');
      const user = response.data;
      
      // Update stored user data
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      
      return user;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to get profile');
    }
  }
}

export const authService = new AuthService();
