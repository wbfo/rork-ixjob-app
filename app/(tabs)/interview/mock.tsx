import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Play, Clock, User, Briefcase } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/ui/Card';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

import { EmptyView } from '@/components/EmptyView';
import { useHeaderTitle } from '@/hooks/useHeaderTitle';
import { colors, spacing, fontSizes, fontWeights, radius } from '@/theme/tokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface MockSession {
  id: string;
  industry: string;
  role: string;
  duration: number;
  score?: number;
  date: string;
}

const industries = [
  { label: 'Technology', value: 'tech' },
  { label: 'Finance', value: 'finance' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'Marketing', value: 'marketing' },
  { label: 'Sales', value: 'sales' },
];

const roles = [
  { label: 'Software Engineer', value: 'swe' },
  { label: 'Product Manager', value: 'pm' },
  { label: 'Data Analyst', value: 'analyst' },
  { label: 'Marketing Manager', value: 'marketing' },
  { label: 'Sales Representative', value: 'sales' },
];

const mockSessions: MockSession[] = [
  { id: '1', industry: 'Technology', role: 'Software Engineer', duration: 25, score: 85, date: '2024-01-15' },
  { id: '2', industry: 'Finance', role: 'Data Analyst', duration: 30, score: 78, date: '2024-01-10' },
];

export default function MockInterviewScreen() {
  const { t } = useTranslation();
  useHeaderTitle('nav:mockInterview');
  const insets = useSafeAreaInsets();
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [interviewMode, setInterviewMode] = useState<'text' | 'audio'>('text');
  const [sessions] = useState<MockSession[]>(mockSessions);

  const startSession = () => {
    if (!selectedIndustry || !selectedRole) {
      Alert.alert('Missing Information', 'Please select both industry and role to start the interview.');
      return;
    }
    
    console.log('[MockInterview] Starting session:', { selectedIndustry, selectedRole, interviewMode });
    
    // For now, navigate to feedback screen as placeholder
    router.push({
      pathname: '/(tabs)/interview/feedback',
      params: { 
        industry: selectedIndustry, 
        role: selectedRole, 
        mode: interviewMode 
      }
    });
  };

  const renderSession = (session: MockSession) => (
    <TouchableOpacity 
      key={session.id} 
      style={styles.sessionItem}
      onPress={() => {
        console.log('[MockInterview] Viewing session:', session.id);
        router.push({
          pathname: '/(tabs)/interview/feedback',
          params: { sessionId: session.id }
        });
      }}
    >
      <Card style={styles.sessionCard}>
        <View style={styles.sessionHeader}>
          <View style={styles.sessionInfo}>
            <Text style={styles.sessionRole}>{session.role}</Text>
            <Text style={styles.sessionIndustry}>{session.industry}</Text>
          </View>
          {session.score && (
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>{session.score}%</Text>
            </View>
          )}
        </View>
        <View style={styles.sessionMeta}>
          <View style={styles.metaItem}>
            <Clock size={14} color={colors.textMuted} />
            <Text style={styles.metaText}>{session.duration} min</Text>
          </View>
          <Text style={styles.dateText}>{new Date(session.date).toLocaleDateString()}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <Screen>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.setupCard}>
          <Text style={styles.cardTitle}>{t('interview:startMock')}</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>{t('interview:industry')}</Text>
            <TouchableOpacity 
              style={styles.selectButton}
              onPress={() => Alert.alert('Industry Selection', 'Select: ' + industries.map(i => i.label).join(', '), industries.map(i => ({ text: i.label, onPress: () => setSelectedIndustry(i.value) })))}
            >
              <Text style={[styles.selectText, selectedIndustry && styles.selectTextSelected]}>
                {selectedIndustry ? industries.find(i => i.value === selectedIndustry)?.label : 'Select industry'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>{t('interview:role')}</Text>
            <TouchableOpacity 
              style={styles.selectButton}
              onPress={() => Alert.alert('Role Selection', 'Select: ' + roles.map(r => r.label).join(', '), roles.map(r => ({ text: r.label, onPress: () => setSelectedRole(r.value) })))}
            >
              <Text style={[styles.selectText, selectedRole && styles.selectTextSelected]}>
                {selectedRole ? roles.find(r => r.value === selectedRole)?.label : 'Select role'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Interview Mode</Text>
            <View style={styles.modeSelector}>
              <TouchableOpacity
                style={[styles.modeButton, interviewMode === 'text' && styles.modeButtonActive]}
                onPress={() => setInterviewMode('text')}
              >
                <Text style={[styles.modeButtonText, interviewMode === 'text' && styles.modeButtonTextActive]}>
                  {t('common:text')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modeButton, interviewMode === 'audio' && styles.modeButtonActive]}
                onPress={() => setInterviewMode('audio')}
              >
                <Text style={[styles.modeButtonText, interviewMode === 'audio' && styles.modeButtonTextActive]}>
                  {t('common:audio')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <PrimaryButton
            title={t('interview:start')}
            onPress={startSession}
            leftIcon={<Play size={18} color={colors.textOnBlue} />}
            testID="start-interview-button"
          />
        </Card>

        <Card style={styles.sessionsCard}>
          <Text style={styles.cardTitle}>{t('interview:recentSessions')}</Text>
          {sessions.length > 0 ? (
            <View style={styles.sessionsList}>
              {sessions.map(renderSession)}
            </View>
          ) : (
            <EmptyView
              title={t('common:noneYet')}
              message="Complete your first mock interview to see results here"
              testID="sessions-empty-state"
            />
          )}
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  setupCard: {
    marginBottom: spacing.lg,
  },
  sessionsCard: {
    marginBottom: spacing.lg,
  },
  cardTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  formGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  modeSelector: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: 4,
  },
  modeButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: colors.primary,
  },
  modeButtonText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.textMuted,
  },
  modeButtonTextActive: {
    color: colors.textOnBlue,
  },
  sessionsList: {
    gap: spacing.md,
  },
  sessionItem: {
    // No additional styles needed
  },
  sessionCard: {
    padding: spacing.md,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionRole: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    color: colors.text,
    marginBottom: 2,
  },
  sessionIndustry: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
  },
  scoreContainer: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  scoreText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
    color: colors.textOnBlue,
  },
  sessionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: fontSizes.xs,
    color: colors.textMuted,
  },
  dateText: {
    fontSize: fontSizes.xs,
    color: colors.textMuted,
  },
  selectButton: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectText: {
    fontSize: fontSizes.md,
    color: colors.textMuted,
  },
  selectTextSelected: {
    color: colors.text,
  },
});