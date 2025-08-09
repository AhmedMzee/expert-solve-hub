import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User, LoginData, RegisterData } from '../services/authService';

interface UserContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isExpert: boolean;
  login: (credentials: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isExpert = user?.user_type === 'expert';

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      setIsLoading(true);
      const [storedUser, storedToken] = await Promise.all([
        authService.getStoredUser(),
        authService.getStoredToken(),
      ]);
      
      if (storedUser && storedToken) {
        setUser(storedUser);
        setToken(storedToken);
      }
    } catch (error) {
      console.error('Load stored auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginData) => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      setUser(response.user);
      setToken(response.token);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      const response = await authService.register(data);
      setUser(response.user);
      setToken(response.token);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    try {
      if (token) {
        const updatedUser = await authService.getCurrentProfile();
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Refresh profile error:', error);
    }
  };

  const value: UserContextType = {
    user,
    token,
    isLoading,
    isExpert,
    login,
    register,
    logout,
    refreshProfile,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
