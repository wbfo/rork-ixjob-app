import React from 'react';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { colors } from '@/theme/tokens';

export default function CommunityLayout() {
  const { t } = useTranslation();
  
  return (
    <Stack 
      screenOptions={{ 
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{
          title: t('nav.community', 'Community'),
          headerBackTitle: t('common.back', 'Back')
        }} 
      />
    </Stack>
  );
}