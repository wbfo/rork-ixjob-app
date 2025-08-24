import React from 'react';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function ResourcesLayout() {
  const { t } = useTranslation();
  
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackVisible: true,
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
          title: t('resources.tools', 'Tools'),
        }} 
      />
      <Stack.Screen 
        name="tools/translator" 
        options={{ 
          title: t('resources.translator', 'Translator'),
        }} 
      />
      <Stack.Screen 
        name="tools/notes" 
        options={{ 
          title: t('resources.notes', 'Notes'),
        }} 
      />
      <Stack.Screen 
        name="category/[slug]" 
        options={{ 
          title: t('resources.category', 'Category'),
        }} 
      />
      <Stack.Screen 
        name="[id]" 
        options={{ 
          title: t('resources.details', 'Resource Details'),
        }} 
      />
    </Stack>
  );
}