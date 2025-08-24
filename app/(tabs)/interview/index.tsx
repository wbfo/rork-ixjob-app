import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Mic, Video, FileText, Brain, ChevronRight } from 'lucide-react-native';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { LoadingView } from '@/components/LoadingView';
import { Card } from '@/components/ui/Card';
import { useHeaderTitleLiteral } from '@/hooks/useHeaderTitle';
import { colors, spacing, layout, fontSizes, fontWeights, radius, shadows } from '@/theme/tokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Translator } from '@/components/Translator';
import { useTranslation } from 'react-i18next';
import { GradientBackground } from '@/theme/GradientBackground';
import { router } from 'expo-router';

export default function InterviewScreen() {
  const { t } = useTranslation();
  useHeaderTitleLiteral('Interview Prep');
  const { isLoading } = useProtectedRoute();
  const insets = useSafeAreaInsets();

  if (isLoading) {
    return <LoadingView message="Loading interview prep..." />;
  }

  const bottomPadding = insets.bottom + 24;

  const prepOptions = [
    {
      title: 'Mock Interview',
      description: 'Practice live Q&A with AI and get instant feedback',
      icon: Mic,
      color: '#3B82F6',
      route: 'mock'
    },
    {
      title: 'Video Practice',
      description: 'Record answers and review your delivery and body language',
      icon: Video,
      color: '#10B981',
      route: 'video'
    },
    {
      title: 'Question Bank',
      description: 'Browse common questions by role and industry',
      icon: FileText,
      color: '#F59E0B',
      route: 'questions'
    },
    {
      title: 'AI Feedback',
      description: 'Get STAR coaching and phrasing improvements',
      icon: Brain,
      color: '#8B5CF6',
      route: 'feedback'
    },
  ];



  return (
    <>
      <GradientBackground>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{ paddingTop: 8, paddingBottom: bottomPadding, paddingHorizontal: 16 }}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={() => { console.log('[Interview] Pull to refresh'); }} tintColor={colors.primary} colors={[colors.primary]} />
          }
          testID="interview-scroll"
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.subtitle} testID="hero-subtitle">
                Practice with AI-powered tools and boost your confidence
              </Text>
            </View>

            <View style={styles.optionsContainer}>
              {prepOptions.map((option, index) => {
                const Icon = option.icon;
                return (
                  <TouchableOpacity 
                    key={index} 
                    onPress={() => router.push(`/(tabs)/interview/${option.route}`)} 
                    accessibilityRole="button"
                    style={styles.optionButton}
                  >
                    <Card style={styles.optionCard} testID={`prep-card-${index}`}>
                      <View style={styles.cardContent}>
                        <View style={[styles.iconContainer, { backgroundColor: `${option.color}15` }]}> 
                          <Icon size={24} color={option.color} />
                        </View>
                        <View style={styles.textContent}>
                          <Text style={styles.optionTitle}>{option.title}</Text>
                          <Text style={styles.optionDescription}>{option.description}</Text>
                        </View>
                        <ChevronRight size={20} color={colors.textMuted} />
                      </View>
                    </Card>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.tipsSection}>
              <Text style={styles.tipsTitle}>Quick Tips</Text>
              <Card style={styles.tipsCard} testID="quick-tips-card">
                <Text style={styles.tipText}>• Use the STAR method for behavioral questions</Text>
                <Text style={styles.tipText}>• Research the company's products, culture, and recent news</Text>
                <Text style={styles.tipText}>• Prepare 3–5 thoughtful questions for the interviewer</Text>
              </Card>
            </View>

            <View style={styles.translatorSection}>
              <Text style={styles.sectionTitle}>Translator</Text>
              <Translator sourceTag="interview_prep" />
            </View>
          </View>
        </ScrollView>
      </GradientBackground>

    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
  },
  header: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  subtitle: {
    fontSize: fontSizes.md,
    color: colors.textMutedOnBlue,
    lineHeight: 22,
    maxWidth: 360,
  },
  optionsContainer: {
    gap: 12,
    marginTop: 24,
  },
  optionButton: {
    width: '100%',
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    minHeight: 80,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
  tipsSection: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  tipsCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  tipText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.lg,
  },
  translatorSection: {
    paddingBottom: spacing.xl,
  },
});