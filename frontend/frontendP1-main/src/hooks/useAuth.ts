import { useState, useCallback } from 'react';
import api from '../config/api';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../config/constants';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  username: string;
  bio?: string;
  userType?: 'user' | 'expert';
  areaOfExpertise?: string;
}

export const useAuthService = () => {
  const { dispatch } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;
      
      // Store auth data
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      
      // Update context
      dispatch({ type: 'AUTH_SUCCESS', payload: { token, user } });
      
      return { success: true, data: { token, user } };
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Login failed';
      setError(errorMessage);
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const register = useCallback(async (userData: RegisterData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;
      
      // Store auth data
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      
      // Update context
      dispatch({ type: 'AUTH_SUCCESS', payload: { token, user } });
      
      return { success: true, data: { token, user } };
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Registration failed';
      setError(errorMessage);
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      
      // Clear stored data
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
      
      // Update context
      dispatch({ type: 'AUTH_LOGOUT' });
      
      return { success: true };
    } catch (err: any) {
      const errorMessage = 'Logout failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const clearError = useCallback(() => {
    setError(null);
    dispatch({ type: 'CLEAR_ERROR' });
  }, [dispatch]);

  return {
    login,
    register,
    logout,
    clearError,
    loading,
    error,
  };
};
