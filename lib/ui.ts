import { StyleSheet } from 'react-native';
import { colors, radius, spacing, shadows, fontSizes, fontWeights, layout } from '@/theme/tokens';

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.card,
  },
  button: {
    height: 56,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    overflow: 'hidden',
  },
  buttonText: {
    color: colors.textOnBlue,
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.textOnBlue,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    fontSize: 16,
    color: colors.text,
  },
  
  // Grid layouts
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.lg,
    alignSelf: 'center',
    width: '100%',
    maxWidth: layout.maxContentWidth,
    paddingHorizontal: spacing.lg,
  } as const,
  gridItem: {
    width: '48%',
  },
  
  // Icon containers
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  iconContainerSmall: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// State management helpers
export const createLoadingState = () => ({
  isLoading: true,
  error: null as string | null,
  data: null as unknown,
});

export const createErrorState = (error: string) => ({
  isLoading: false,
  error,
  data: null as unknown,
});

export const createSuccessState = <T,>(data: T) => ({
  isLoading: false,
  error: null as string | null,
  data,
});

// Common style utilities
export const createIconBackgroundStyle = (color: string, opacity = 0.15) => ({
  backgroundColor: `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
});

export const createShadowStyle = (elevation: number) => ({
  shadowColor: '#000000',
  shadowOpacity: 0.1,
  shadowRadius: elevation * 2,
  shadowOffset: { width: 0, height: elevation },
  elevation,
});

// Layout helpers
export const getBottomPadding = (tabBarHeight: number, safeAreaBottom: number) => 
  tabBarHeight + Math.max(24, safeAreaBottom + 24);

export const getContentMaxWidth = () => layout.maxContentWidth;

// Typography helpers
export const getTextStyle = (variant: 'heading' | 'subheading' | 'body' | 'caption') => {
  switch (variant) {
    case 'heading':
      return { fontSize: fontSizes.xxl, fontWeight: fontWeights.bold, color: colors.textOnBlue };
    case 'subheading':
      return { fontSize: fontSizes.lg, fontWeight: fontWeights.semibold, color: colors.textOnBlueSecondary };
    case 'body':
      return { fontSize: fontSizes.md, fontWeight: fontWeights.normal, color: colors.textOnBlue };
    case 'caption':
      return { fontSize: fontSizes.sm, fontWeight: fontWeights.normal, color: colors.textOnBlueTertiary };
    default:
      return { fontSize: fontSizes.md, fontWeight: fontWeights.normal, color: colors.textOnBlue };
  }
};

// Color utilities
export const getStatusColor = (status: 'success' | 'warning' | 'error' | 'info') => {
  switch (status) {
    case 'success': return colors.success;
    case 'warning': return colors.warning;
    case 'error': return colors.error;
    case 'info': return colors.primary;
    default: return colors.primary;
  }
};

// Auto-contrast utility
const hexToRgb = (hex: string) => {
  const sanitized = hex.replace('#', '');
  const bigint = parseInt(sanitized.length === 3 ? sanitized.split('').map((c) => c + c).join('') : sanitized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b } as const;
};

const relativeLuminance = (hex: string) => {
  const { r, g, b } = hexToRgb(hex);
  const srgb = [r, g, b].map((v) => v / 255).map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
};

export const getAutoContrastText = (backgroundHex: string) => {
  try {
    const L = relativeLuminance(backgroundHex);
    return L > 0.6 ? '#0D1B2A' : '#FFFFFF';
  } catch (e) {
    return '#FFFFFF';
  }
};