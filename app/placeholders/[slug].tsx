import React from 'react';
import { useTranslation } from 'react-i18next';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { EmptyView } from '@/components/EmptyView';

export default function PlaceholderBySlug() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ slug?: string }>();
  const slug = params.slug ?? 'feature';
  const titleKey = `nav.${slug}`;
  const title = t(titleKey as any, { defaultValue: t('common:comingSoon') });

  return (
    <View style={styles.container} testID="placeholder-slug">
      <Stack.Screen options={{ title }} />
      <EmptyView
        title={t('common:comingSoon')}
        message={t('common:workInProgress')}
        actionLabel={t('common:goHome')}
        onAction={() => router.push('/(tabs)/dashboard')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
