import React from 'react';
import { Stack } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { colors, spacing } from '@/theme/tokens';
import { router } from 'expo-router';

export default function PlaceholderScreen() {
  return (
    <View style={styles.container} testID="placeholder-screen">
      <Stack.Screen options={{ title: 'Coming Soon' }} />
      <View style={styles.card} testID="placeholder-card">
        <View style={styles.iconWrap}>
          <Sparkles size={28} color={colors.primary} />
        </View>
        <Text style={styles.title}>Coming Soon</Text>
        <Text style={styles.subtitle}>This feature is under construction. Check back shortly.</Text>
        <TouchableOpacity
          onPress={() => router.replace('/(tabs)/dashboard')}
          style={styles.cta}
          testID="placeholder-go-home"
        >
          <Text style={styles.ctaText}>Go to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, alignItems: 'center', justifyContent: 'center' },
  card: { width: '100%', maxWidth: 520, backgroundColor: colors.card, borderRadius: 16, padding: spacing.xl, alignItems: 'center' },
  iconWrap: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#EEF5FF', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  title: { fontSize: 22, fontWeight: '700' as const, color: colors.text, marginBottom: spacing.xs },
  subtitle: { fontSize: 14, color: colors.textMuted, textAlign: 'center', marginBottom: spacing.lg },
  cta: { backgroundColor: colors.primary, paddingVertical: 12, paddingHorizontal: 18, borderRadius: 12 },
  ctaText: { color: '#fff', fontWeight: '700' as const },
});