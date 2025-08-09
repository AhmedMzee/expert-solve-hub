import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, USER_TYPES } from '../config/constants';

// Types
export interface User {
  user_id: string;
  email: string;
  full_name: string;
  username: string;
  bio?: string;
  user_type: typeof USER_TYPES.USER | typeof USER_TYPES.EXPERT;
  area_of_expertise?: string;
  profile_picture?: string;
  created_at: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  user: User | null;
  error: string | null;
}

export type AuthAction =
  | { type: 'AUTH_LOADING' }
  | { type: 'AUTH_SUCCESS'; payload: { token: string; user: User } }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'CLEAR_ERROR' };

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  token: null,
  user: null,
  error: null,
};

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_LOADING':
      return { ...state, isLoading: true, error: null };
    
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        token: action.payload.token,
        user: action.payload.user,
        error: null,
      };
    
    case 'AUTH_ERROR':
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        token: null,
        user: null,
        error: action.payload,
      };
    
    case 'AUTH_LOGOUT':
      return {
        ...initialState,
        isLoading: false,
      };
    
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    default:
      return state;
  }
};

// Context
const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
} | null>(null);

// Provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for stored auth data on app start
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        dispatch({ type: 'AUTH_LOADING' });
        
        const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
        
        if (token && userData) {
          const user = JSON.parse(userData);
          dispatch({ type: 'AUTH_SUCCESS', payload: { token, user } });
        } else {
          dispatch({ type: 'AUTH_LOGOUT' });
        }
      } catch (error) {
        console.error('Auth state check error:', error);
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    };

    checkAuthState();
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
