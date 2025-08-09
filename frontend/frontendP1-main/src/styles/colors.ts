// Color palette for the app
export const COLORS = {
  // Primary colors
  primary: '#007AFF',
  primaryDark: '#0056CC',
  primaryLight: '#4DA2FF',
  
  // Secondary colors
  secondary: '#FF6B35',
  secondaryDark: '#E55A2B',
  secondaryLight: '#FF8A5C',
  
  // Neutral colors
  black: '#000000',
  white: '#FFFFFF',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Background colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F9FAFB',
    accent: '#F3F4F6',
  },
  
  // Text colors
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    accent: '#9CA3AF',
    inverse: '#FFFFFF',
  },
  
  // Border colors
  border: {
    light: '#E5E7EB',
    medium: '#D1D5DB',
    dark: '#9CA3AF',
  },
} as const;

// Color themes
export const LIGHT_THEME = {
  background: COLORS.background.primary,
  surface: COLORS.background.secondary,
  primary: COLORS.primary,
  text: COLORS.text.primary,
  textSecondary: COLORS.text.secondary,
  border: COLORS.border.light,
} as const;

export const DARK_THEME = {
  background: COLORS.gray[900],
  surface: COLORS.gray[800],
  primary: COLORS.primaryLight,
  text: COLORS.white,
  textSecondary: COLORS.gray[300],
  border: COLORS.gray[700],
} as const;
