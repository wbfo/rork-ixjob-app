import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Globe } from 'lucide-react-native';
import { colors, fontSizes, fontWeights, spacing } from '@/theme/tokens';

interface HeaderProps {
  line1?: string;
  brandTitle?: string;
  tagline?: string;
  showIcon?: boolean;
  style?: any;
}

export function Header({ 
  line1 = 'Welcome to', 
  brandTitle = 'ixJOB', 
  tagline, 
  showIcon = true,
  style 
}: HeaderProps) {
  return (
    <View style={[styles.container, style]}>
      {showIcon && (
        <Globe size={48} color={colors.textOnBlue} style={styles.icon} />
      )}
      <Text style={styles.line1}>{line1}</Text>
      <Text style={styles.brandTitle}>{brandTitle}</Text>
      {tagline && (
        <Text style={styles.tagline}>{tagline}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xl,
  },
  icon: {
    marginBottom: spacing.lg,
  },
  line1: {
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.medium,
    color: colors.textOnBlueSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  brandTitle: {
    fontSize: 40,
    fontWeight: fontWeights.bold,
    color: colors.textOnBlue,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  tagline: {
    fontSize: fontSizes.md,
    color: colors.textOnBlueTertiary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
    paddingHorizontal: spacing.md,
  },
});