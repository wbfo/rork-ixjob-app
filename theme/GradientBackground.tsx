import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme/tokens';

interface GradientBackgroundProps {
  children: React.ReactNode;
  withVignette?: boolean;
  edges?: Edge[];
  colorsOverride?: [string, string];
}

export function GradientBackground({ children, withVignette = true, edges = ['top'], colorsOverride }: GradientBackgroundProps) {
  const gradientColors = colorsOverride ?? [colors.bgStart, colors.bgEnd];
  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={gradientColors} 
        start={{ x: 0, y: 0 }} 
        end={{ x: 0, y: 1 }} 
        style={StyleSheet.absoluteFill} 
      />
      {withVignette && <View style={styles.vignette} />}
      <SafeAreaView style={styles.safeArea} edges={edges}>
        {children}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  vignette: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: colors.vignette,
    opacity: 0.6,
  },
  safeArea: { 
    flex: 1 
  },
});