import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { EmptyView } from '@/components/EmptyView';

export default function PlaceholderScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ title?: string }>();
  return (
    <View style={styles.container} testID="placeholder-screen">
      <Stack.Screen options={{ title: params.title ?? t('common:comingSoon') }} />
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
