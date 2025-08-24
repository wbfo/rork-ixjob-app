import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { colors, fontSizes, spacing } from '@/theme/tokens';

interface LoadingViewProps {
  message?: string;
}

export function LoadingView({ message = 'Loading...' }: LoadingViewProps) {
  return (
    <View style={styles.container} testID="loading-view">
      <ActivityIndicator size="large" color={colors.textOnBlue} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: spacing.lg,
  },
  text: {
    marginTop: spacing.sm,
    fontSize: fontSizes.md,
    color: colors.textOnBlueSecondary,
  },
});