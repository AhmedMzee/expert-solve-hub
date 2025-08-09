import { StyleSheet } from 'react-native';
import { COLORS } from './colors';

// Typography styles
export const TYPOGRAPHY = {
  // Font families
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
  },
  
  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  
  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.6,
  },
  
  // Font weights
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
} as const;

// Global typography styles
export const typographyStyles = StyleSheet.create({
  // Headings
  h1: {
    fontSize: TYPOGRAPHY.fontSize['3xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    lineHeight: TYPOGRAPHY.fontSize['3xl'] * TYPOGRAPHY.lineHeight.tight,
    color: COLORS.text.primary,
  },
  h2: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    lineHeight: TYPOGRAPHY.fontSize['2xl'] * TYPOGRAPHY.lineHeight.tight,
    color: COLORS.text.primary,
  },
  h3: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    lineHeight: TYPOGRAPHY.fontSize.xl * TYPOGRAPHY.lineHeight.tight,
    color: COLORS.text.primary,
  },
  h4: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    lineHeight: TYPOGRAPHY.fontSize.lg * TYPOGRAPHY.lineHeight.normal,
    color: COLORS.text.primary,
  },
  
  // Body text
  body1: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.normal,
    lineHeight: TYPOGRAPHY.fontSize.base * TYPOGRAPHY.lineHeight.normal,
    color: COLORS.text.primary,
  },
  body2: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.normal,
    lineHeight: TYPOGRAPHY.fontSize.sm * TYPOGRAPHY.lineHeight.normal,
    color: COLORS.text.secondary,
  },
  
  // Special text
  caption: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.normal,
    lineHeight: TYPOGRAPHY.fontSize.xs * TYPOGRAPHY.lineHeight.normal,
    color: COLORS.text.accent,
  },
  button: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    lineHeight: TYPOGRAPHY.fontSize.base * TYPOGRAPHY.lineHeight.tight,
  },
  link: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
});
