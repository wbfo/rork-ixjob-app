import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useHeaderTitle } from '@/hooks/useHeaderTitle';
import { 
  User,
  ChevronRight,
  Bell,
  FileText,
  ClipboardList,
  Mic,
  Users,
  TrendingUp,
  Plus
} from 'lucide-react-native';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { LoadingView } from '@/components/LoadingView';
import { useAuthContext } from '@/providers/AuthProvider';
import { Screen } from '@/components/Screen';
import { GradientBackground } from '@/theme/GradientBackground';
import { Card } from '@/components/ui/Card';
import { colors, spacing, fontWeights, fontSizes, radius } from '@/theme/tokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { trpc } from '@/lib/trpc';

export default function DashboardScreen() {
  const { t } = useTranslation();
  const { user } = useAuthContext();
  
  useHeaderTitle('nav.dashboard');
  
  const { isLoading: authLoading } = useProtectedRoute();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [testName, setTestName] = useState<string>('World');

  if (authLoading) {
    return <LoadingView message={t('common.loading')} />;
  }

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1000);
  };




  const renderOverallProgressCard = () => (
    <Card style={styles.card}>
      <Text style={styles.cardTitle}>Overall Progress</Text>
      <View style={styles.progressContent}>
        <View style={styles.progressRing}>
          <Text style={styles.progressPercentage}>60%</Text>
          <Text style={styles.progressLabel}>Complete</Text>
        </View>
        <View style={styles.progressStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>4</Text>
            <Text style={styles.statLabel}>Applications</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Interviews</Text>
          </View>
        </View>
      </View>
    </Card>
  );

  const renderQuickStatsAndActions = () => (
    <View style={styles.twoColumnRow}>
      <Card style={styles.smallCard}>
        <Text style={styles.cardTitle}>Quick Stats</Text>
        <View style={styles.quickStatsContent}>
          <View style={styles.smallProgressRing}>
            <Text style={styles.smallProgressPercentage}>60%</Text>
          </View>
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatValue}>2</Text>
            <Text style={styles.quickStatLabel}>Interviews</Text>
          </View>
        </View>
      </Card>
      
      <Card style={styles.smallCard}>
        <Text style={styles.cardTitle}>Saved Jobs</Text>
        <View style={styles.savedJobsContent}>
          <View style={styles.savedJobsIcon}>
            <TrendingUp size={24} color={colors.primary} />
          </View>
          <View>
            <Text style={styles.savedJobsCount}>12</Text>
            <Text style={styles.savedJobsLabel}>Jobs Saved</Text>
          </View>
        </View>
      </Card>
    </View>
  );

  const renderSuggestionsCard = () => (
    <Card style={styles.card}>
      <View style={styles.suggestionsHeader}>
        <View style={styles.greenDot} />
        <Text style={styles.cardTitle}>Suggestions for You</Text>
      </View>
      <View style={styles.suggestionsList}>
        <TouchableOpacity 
          style={styles.suggestionItem}
          onPress={() => router.push('/(tabs)/resume')}
          testID="improve-resume-suggestion"
        >
          <Text style={styles.suggestionText}>Improve your resume</Text>
          <ChevronRight size={16} color={colors.textMuted} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.suggestionItem}
          onPress={() => router.push('/(tabs)/tracker')}
          testID="job-matches-suggestion"
        >
          <Text style={styles.suggestionText}>View possible job matches</Text>
          <ChevronRight size={16} color={colors.textMuted} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.suggestionItem}
          onPress={() => router.push('/(tabs)/interview')}
          testID="interview-practice-suggestion"
        >
          <Text style={styles.suggestionText}>Practice common interview questions</Text>
          <ChevronRight size={16} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
    </Card>
  );

  const renderCommunityWidget = () => (
    <Card style={styles.card}>
      <TouchableOpacity 
        style={styles.communityWidget}
        onPress={() => router.push('/community')}
        testID="community-widget"
      >
        <View style={styles.communityHeader}>
          <Text style={styles.cardTitle}>
            {t('home.communityWidget.title', 'From the Community')}
          </Text>
          <ChevronRight size={16} color={colors.textMuted} />
        </View>
        <Text style={styles.communityPreview} numberOfLines={2}>
          "Just got hired as a CNA using ixJOB! The interview prep really helped. Thank you!" - Sarah M.
        </Text>
      </TouchableOpacity>
    </Card>
  );

  const renderRecentApplicationsCard = () => (
    <Card style={styles.card}>
      <Text style={styles.cardTitle}>Recent Applications</Text>
      <View style={styles.applicationItem}>
        <View style={styles.applicationLogo}>
          <Text style={styles.applicationLogoText}>N</Text>
        </View>
        <View style={styles.applicationInfo}>
          <Text style={styles.applicationTitle}>Product Designer</Text>
          <Text style={styles.applicationCompany}>Netflix</Text>
        </View>
        <View style={styles.applicationStatus}>
          <Text style={styles.applicationStatusText}>Application Sent</Text>
        </View>
      </View>
    </Card>
  );

  return (
    <Screen>
      <GradientBackground>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          testID="dashboard-scroll"
        >
          {renderOverallProgressCard()}
          {renderQuickStatsAndActions()}
          {renderSuggestionsCard()}
          {renderCommunityWidget()}
          {renderRecentApplicationsCard()}
        </ScrollView>
      </GradientBackground>
    </Screen>
  );
}

const styles = StyleSheet.create({

  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 100,
    gap: spacing.lg,
  },
  card: {
    padding: spacing.lg,
  },
  cardTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  progressContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
  },
  progressRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary + '20',
    borderWidth: 4,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.primary,
  },
  progressLabel: {
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  progressStats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.text,
  },
  statLabel: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
  twoColumnRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  smallCard: {
    flex: 1,
    padding: spacing.lg,
  },
  quickStatsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  smallProgressRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary + '20',
    borderWidth: 3,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallProgressPercentage: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: colors.primary,
  },
  quickStatItem: {
    alignItems: 'center',
  },
  quickStatValue: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.text,
  },
  quickStatLabel: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
  },
  savedJobsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  savedJobsIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  savedJobsCount: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.text,
  },
  savedJobsLabel: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
  },
  suggestionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  suggestionsList: {
    gap: spacing.sm,
  },
  suggestionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  suggestionText: {
    fontSize: fontSizes.md,
    color: colors.text,
    flex: 1,
  },
  applicationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  applicationLogo: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#E53E3E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  applicationLogoText: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.textInverse,
  },
  applicationInfo: {
    flex: 1,
  },
  applicationTitle: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    color: colors.text,
  },
  applicationCompany: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
  },
  applicationStatus: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  applicationStatusText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.textInverse,
  },
  communityWidget: {
    // No additional padding since Card already has padding
  },
  communityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  communityPreview: {
    fontSize: fontSizes.md,
    color: colors.textMuted,
    lineHeight: 20,
    fontStyle: 'italic',
  },
});