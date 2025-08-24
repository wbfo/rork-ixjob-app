import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GradientBackground } from '@/theme/GradientBackground';
import { layout, spacing, colors } from '@/theme/tokens';

interface ScreenProps {
  children: React.ReactNode;
  withGradient?: boolean;
  withVignette?: boolean;
  gradientOverride?: [string, string];
}

export function Screen({ children, withGradient = true, withVignette = true, gradientOverride }: ScreenProps) {

  if (!withGradient) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          {children}
        </View>
      </View>
    );
  }

  return (
    <GradientBackground withVignette={withVignette} colorsOverride={gradientOverride}>
      <View style={styles.content}>
        {children}
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: { 
    flex: 1, 
    paddingHorizontal: spacing.lg,
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
    width: '100%'
  },
});