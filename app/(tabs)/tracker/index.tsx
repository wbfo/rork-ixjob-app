import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Plus, Briefcase, Clock, CheckCircle, XCircle } from 'lucide-react-native';
import { ROUTES } from '@/constants/routes';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { LoadingView } from '@/components/LoadingView';
import { EmptyView } from '@/components/EmptyView';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/ui/Card';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useHeaderTitle } from '@/hooks/useHeaderTitle';

import { colors, spacing, fontSizes, fontWeights } from '@/theme/tokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GradientBackground } from '@/theme/GradientBackground';

export default function TrackerScreen() {
  useHeaderTitle('nav.jobs');
  const { isLoading } = useProtectedRoute();
  const [applications, setApplications] = useState<any[]>([]);
  const insets = useSafeAreaInsets();

  if (isLoading) {
    return <LoadingView message="Loading applications..." />;
  }

  const bottomPadding = Math.max(24, insets.bottom + 24);

  if (applications.length === 0) {
    return (
      <>
        <GradientBackground>
          <EmptyView
            title="No applications yet"
            message="Start tracking your job applications to stay organized"
            actionLabel="Add Application"
            onAction={() => router.push('/tracker/new')}
          />
        </GradientBackground>
      </>
    );
  }

  return (
    <>
      <GradientBackground>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{ paddingTop: 12, paddingBottom: bottomPadding }}
        >
          <View style={styles.content}>
            <View style={styles.actionSection}>
              <Text style={styles.subtitle}>Track every application and stay on top of your job hunt.</Text>
              <View style={styles.buttonWrapper}>
                <PrimaryButton
                  title="Add Application"
                  onPress={() => router.push('/tracker/new')}
                  leftIcon={<Plus size={18} color="#FFFFFF" />}
                  testID="add-application-button"
                />
              </View>
            </View>

            <View style={styles.stats}>
              <Card style={styles.statItem}>
                <Briefcase size={20} color={colors.primary} />
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>Applied</Text>
              </Card>
              <Card style={styles.statItem}>
                <Clock size={20} color={colors.warning} />
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>In Progress</Text>
              </Card>
              <Card style={styles.statItem}>
                <CheckCircle size={20} color={colors.success} />
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>Offers</Text>
              </Card>
              <Card style={styles.statItem}>
                <XCircle size={20} color={colors.error} />
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>Rejected</Text>
              </Card>
            </View>

            <View style={styles.applicationsList}>
              {/* Application items would go here */}
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
  stats: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
  applicationsList: {
    marginTop: spacing.md,
  },
});