import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from './colors';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Layout constants
export const LAYOUT = {
  // Screen dimensions
  screen: {
    width: screenWidth,
    height: screenHeight,
  },
  
  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
  },
  
  // Border radius
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    full: 9999,
  },
  
  // Shadows
  shadow: {
    sm: {
      shadowColor: COLORS.black,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: COLORS.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: COLORS.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
  },
} as const;

// Global layout styles
export const globalStyles = StyleSheet.create({
  // Containers
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  content: {
    flex: 1,
    padding: LAYOUT.spacing.md,
  },
  contentCentered: {
    flex: 1,
    padding: LAYOUT.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Common layouts
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  spaceAround: {
    justifyContent: 'space-around',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Cards and surfaces
  card: {
    backgroundColor: COLORS.white,
    borderRadius: LAYOUT.borderRadius.lg,
    padding: LAYOUT.spacing.md,
    ...LAYOUT.shadow.md,
  },
  surface: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: LAYOUT.borderRadius.md,
    padding: LAYOUT.spacing.sm,
  },
  
  // Dividers
  divider: {
    height: 1,
    backgroundColor: COLORS.border.light,
    marginVertical: LAYOUT.spacing.sm,
  },
  
  // Common margins and paddings
  marginVertical: {
    marginVertical: LAYOUT.spacing.md,
  },
  marginHorizontal: {
    marginHorizontal: LAYOUT.spacing.md,
  },
  paddingVertical: {
    paddingVertical: LAYOUT.spacing.md,
  },
  paddingHorizontal: {
    paddingHorizontal: LAYOUT.spacing.md,
  },
});
