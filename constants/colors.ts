// Legacy colors file - use @/theme/tokens instead for new code
import { colors } from '@/theme/tokens';

// Export colors in the old format for backward compatibility
const Colors = {
  ...colors,
  text: {
    primary: colors.text,
    secondary: colors.textSecondary,
    muted: colors.textMuted,
    light: colors.textLight,
    inverse: colors.textInverse,
  },
  bg: {
    primary: colors.background,
    secondary: colors.surface,
    card: colors.card,
  },
};

export default Colors;