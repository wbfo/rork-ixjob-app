import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Plus } from 'lucide-react-native';
import { colors, spacing, fontSizes, fontWeights } from '@/theme/tokens';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { LoadingView } from '@/components/LoadingView';
import { EmptyView } from '@/components/EmptyView';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Card } from '@/components/ui/Card';
import { useHeaderTitle } from '@/hooks/useHeaderTitle';

import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GradientBackground } from '@/theme/GradientBackground';

export default function ResumeScreen() {
  useHeaderTitle('nav.resume');
  const { isLoading } = useProtectedRoute();
  const [resumes, setResumes] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const insets = useSafeAreaInsets();

  const onRefresh = useCallback(async () => {
    console.log('[Resume] Pull to refresh');
    setRefreshing(true);
    try {
      // Simulate data refresh
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Here you would typically refetch resumes from API
    } catch (error) {
      console.log('[Resume] Refresh failed:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  console.log('Resume screen loaded, resumes count:', resumes.length);

  if (isLoading) {
    return <LoadingView message="Loading resumes..." />;
  }

  function handleCreateResume() {
    console.log('Create Resume button pressed - navigating to /(tabs)/resume/create');
    router.push('/(tabs)/resume/create');
  }

  if (resumes.length === 0) {
    return (
      <>
        <GradientBackground>
          <EmptyView
            title="No resumes yet"
            message="Create your first ATS-optimized resume to get started"
            actionLabel="Create Résumé"
            onAction={handleCreateResume}
          />
        </GradientBackground>
      </>
    );
  }

  return (
    <>
      <GradientBackground>
        <ScrollView 
          contentInsetAdjustmentBehavior="automatic" 
          contentContainerStyle={{ paddingTop: 12, paddingBottom: Math.max(24, insets.bottom + 24) }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        >
          <View style={styles.content}>
            <View style={styles.actionSection}>
              <Text style={styles.subtitle}>Build polished, ATS-friendly résumés that stand out to recruiters.</Text>
              <View style={styles.buttonWrapper}>
                <PrimaryButton
                  title="Create Résumé"
                  onPress={handleCreateResume}
                  leftIcon={<Plus size={18} color="#FFFFFF" />}
                  testID="create-resume-button"
                />
              </View>
            </View>

            <View style={styles.resumeList}>
              <Card>
                <Text style={styles.listTitle}>Recent</Text>
              </Card>
            </View>
          </View>
        </ScrollView>
      </GradientBackground>
      
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
  },
  actionSection: {
    marginBottom: spacing.xl,
  },
  subtitle: {
    color: colors.textMutedOnBlue,
    fontSize: fontSizes.md,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  buttonWrapper: {
    alignSelf: 'flex-start',
  },
  resumeList: {
    marginTop: spacing.md,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: fontWeights.semibold,
    color: colors.text,
  },
});