export const colors = {
  // Background gradients
  bgStart: '#1FA2FF',
  bgEnd: '#0E63FF',
  blue600: '#0E63FF',
  
  // Card and surfaces
  card: 'rgba(255,255,255,0.96)',
  cardShadow: 'rgba(0,0,0,0.15)',
  background: '#F9FAFB',
  surface: '#FFFFFF',
  
  // Text colors
  text: '#0D1B2A',
  textMuted: '#5E6A7D',
  textMutedOnBlue: '#EAF2FF',
  textOnBlue: '#FFFFFF',
  textOnBlueSecondary: '#FFFFFFCC',
  textOnBlueTertiary: '#FFFFFFA8',
  textOnBlueQuaternary: '#FFFFFFB3',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  textInverse: '#FFFFFF',
  textPrimary: '#111827',
  
  // Primary colors
  primary: '#2B6FFF',
  primaryDark: '#1847E6',
  primaryLight: '#7BA5FF',
  
  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  
  // Borders
  border: '#E6EAF2',
  borderActive: '#0E63FF',
  borderLight: '#E5E7EB',
  
  // Overlays
  vignette: 'rgba(0, 0, 0, 0.08)',
  
  // Tab bar
  tabBarBackground: '#FFFFFF',
  tabBarInactive: '#9CA3AF',
  tabBarActive: '#2B6FFF',
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 28,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const fontWeights = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const shadows = {
  card: {
    shadowColor: colors.cardShadow,
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  subtle: {
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
} as const;

export const layout = {
  maxContentWidth: 420,
  headerRatio: 0.382, // Golden ratio
  thumbZoneHeight: 96,
  minTapTarget: 48,
  buttonHeight: 56,
} as const;