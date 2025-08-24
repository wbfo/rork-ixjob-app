import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { radius, spacing } from '@/theme/tokens';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: keyof typeof spacing;
  testID?: string;
}

export function Card({ children, style, padding = 'lg', testID }: CardProps) {
  return (
    <View style={[styles.container, { padding: spacing[padding] }, style]} testID={testID}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
});