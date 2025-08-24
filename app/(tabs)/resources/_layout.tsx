import React from 'react';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function ResourcesLayout() {
  const { t } = useTranslation();
  
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Let the main app layout handle headers
        headerBackVisible: true,
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          title: t('nav.resources', 'Resources'),
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
        options={({ route }) => {
          const params = route.params as { slug?: string } | undefined;
          const slug = params?.slug;
          const categoryTitles: Record<string, string> = {
            gigs: 'Gig Economy',
            finance: 'Financial Services',
            banking: 'Banking Solutions',
            essentials: 'Essential Services',
            training: 'Training & Education',
            community: 'Community Resources',
          };
          return {
            title: slug ? (categoryTitles[slug] || 'Category') : 'Category',
          };
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