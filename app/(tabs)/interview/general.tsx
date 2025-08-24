import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { EmptyView } from '@/components/EmptyView';
import { useHeaderTitle } from '@/hooks/useHeaderTitle';

export default function GeneralInterviewScreen() {
  const { t } = useTranslation();
  useHeaderTitle('nav.interview');
  
  return (
    <View style={styles.container} testID="general-interview-screen">
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