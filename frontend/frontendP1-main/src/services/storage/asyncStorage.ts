import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../config/constants';

// Generic storage utilities
export const setItem = async (key: string, value: any): Promise<void> => {
  try {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    await AsyncStorage.setItem(key, stringValue);
  } catch (error) {
    console.error('Error setting item in storage:', error);
    throw error;
  }
};

export const getItem = async <T>(key: string): Promise<T | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value === null) return null;
    
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  } catch (error) {
    console.error('Error getting item from storage:', error);
    return null;
  }
};

export const removeItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing item from storage:', error);
    throw error;
  }
};

export const clearStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw error;
  }
};

// Specific storage functions
export const storeAuthToken = async (token: string): Promise<void> => {
  return setItem(STORAGE_KEYS.AUTH_TOKEN, token);
};

export const getAuthToken = async (): Promise<string | null> => {
  return getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
};

export const removeAuthToken = async (): Promise<void> => {
  return removeItem(STORAGE_KEYS.AUTH_TOKEN);
};

export const storeUserData = async (userData: any): Promise<void> => {
  return setItem(STORAGE_KEYS.USER_DATA, userData);
};

export const getUserData = async (): Promise<any | null> => {
  return getItem(STORAGE_KEYS.USER_DATA);
};

export const removeUserData = async (): Promise<void> => {
  return removeItem(STORAGE_KEYS.USER_DATA);
};

export const storeThemePreference = async (theme: string): Promise<void> => {
  return setItem(STORAGE_KEYS.THEME_PREFERENCE, theme);
};

export const getThemePreference = async (): Promise<string | null> => {
  return getItem<string>(STORAGE_KEYS.THEME_PREFERENCE);
};

export const storeLanguagePreference = async (language: string): Promise<void> => {
  return setItem(STORAGE_KEYS.LANGUAGE_PREFERENCE, language);
};

export const getLanguagePreference = async (): Promise<string | null> => {
  return getItem<string>(STORAGE_KEYS.LANGUAGE_PREFERENCE);
};
