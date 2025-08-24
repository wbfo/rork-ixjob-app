import React from 'react';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function ResourcesLayout() {
  const { t } = useTranslation();
  
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          title: t('resources.title', 'Resources'),
        }} 
      />
      <Stack.Screen 
        name="tools/index" 
        options={{ 
          title: 'Tools',
        }} 
      />
      <Stack.Screen 
        name="tools/translator" 
        options={{ 
          title: 'Translator',
        }} 
      />
      <Stack.Screen 
        name="tools/notes" 
        options={{ 
          title: 'Notes',
        }} 
      />
      <Stack.Screen 
        name="category/[slug]" 
        options={{ 
          title: 'Category',
        }} 
      />
      <Stack.Screen 
        name="[id]" 
        options={{ 
          title: 'Resource Details',
        }} 
      />
    </Stack>
  );
}