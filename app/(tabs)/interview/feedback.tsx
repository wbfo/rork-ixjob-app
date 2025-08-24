import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import { Mic, Send, Brain, Lightbulb } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/ui/Card';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { EmptyView } from '@/components/EmptyView';
import { useHeaderTitle } from '@/hooks/useHeaderTitle';
import { colors, spacing, fontSizes, fontWeights, radius } from '@/theme/tokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AIFeedbackScreen() {
  const { t } = useTranslation();
  useHeaderTitle('nav:aiFeedback');
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const [text, setText] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  // Pre-populate with question if coming from question bank
  React.useEffect(() => {
    if (params.question && typeof params.question === 'string') {
      setText(`Question: ${params.question}\n\nMy Answer: `);
    }
  }, [params.question]);

  const getFeedback = async () => {
    if (!text.trim()) {
      Alert.alert('Missing Answer', 'Please provide your interview answer to get feedback.');
      return;
    }

    setIsLoading(true);
    console.log('[AIFeedback] Getting feedback for:', text.substring(0, 100) + '...');
    
    try {
      // Simulate API call to AI feedback service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock feedback response
      const mockFeedback = `## Feedback Analysis\n\n**Strengths:**\n• Clear communication style\n• Good use of specific examples\n• Confident tone\n\n**Areas for Improvement:**\n• Consider using the STAR method (Situation, Task, Action, Result)\n• Add more quantifiable achievements\n• Practice maintaining eye contact\n\n**Overall Score: 7.5/10**\n\nYour answer demonstrates good understanding of the question. To improve, focus on structuring your response more clearly and providing specific metrics where possible.`;
      
      setFeedback(mockFeedback);
    } catch (error) {
      console.error('[AIFeedback] Error getting feedback:', error);
      Alert.alert('Error', 'Failed to get feedback. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const recordAudio = async () => {
    console.log('[AIFeedback] Starting voice input');
    
    if (Platform.OS === 'web') {
      Alert.alert('Voice Input', 'Voice recording is not available on web. Please use the text input instead.');
      return;
    }
    
    // Placeholder for voice recording functionality
    Alert.alert(
      'Voice Input',
      'This feature will allow you to speak your answer and convert it to text for analysis.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Start Recording', onPress: () => {
          setIsRecording(true);
          setTimeout(() => {
            setIsRecording(false);
            setText(prev => prev + '\n\n[Voice input: This is a sample transcription of your spoken answer. The actual feature will convert your speech to text for analysis.]');
          }, 3000);
        }}
      ]
    );
  };

  const renderFeedback = () => {
    if (!feedback) return null;
    
    // Simple markdown-like rendering
    const lines = feedback.split('\n');
    return (
      <View style={styles.feedbackContent}>
        {lines.map((line, index) => {
          if (line.startsWith('## ')) {
            return <Text key={index} style={styles.feedbackTitle}>{line.replace('## ', '')}</Text>;
          }
          if (line.startsWith('**') && line.endsWith('**')) {
            return <Text key={index} style={styles.feedbackSubtitle}>{line.replace(/\*\*/g, '')}</Text>;
          }
          if (line.startsWith('• ')) {
            return (
              <View key={index} style={styles.bulletPoint}>
                <View style={styles.bullet} />
                <Text style={styles.bulletText}>{line.replace('• ', '')}</Text>
              </View>
            );
          }
          if (line.trim()) {
            return <Text key={index} style={styles.feedbackText}>{line}</Text>;
          }
          return <View key={index} style={styles.spacer} />;
        })}
      </View>
    );
  };

  return (
    <Screen>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Card style={styles.inputCard}>
            <Text style={styles.cardTitle}>{t('interview:pasteAnswer')}</Text>
            
            <View style={styles.inputSection}>
              <TextInput
                style={styles.textInput}
                value={text}
                onChangeText={setText}
                placeholder={t('interview:answerPlaceholder')}
                placeholderTextColor={colors.textMuted}
                multiline
                textAlignVertical="top"
                testID="answer-input"
              />
              
              <View style={styles.inputActions}>
                <TouchableOpacity 
                  style={styles.micButton}
                  onPress={recordAudio}
                  disabled={isRecording}
                >
                  <Mic 
                    size={20} 
                    color={isRecording ? '#EF4444' : colors.primary} 
                  />
                  {isRecording && <View style={styles.recordingIndicator} />}
                </TouchableOpacity>
                
                <PrimaryButton
                  title={t('interview:getFeedback')}
                  onPress={getFeedback}
                  disabled={!text.trim() || isLoading}
                  leftIcon={<Brain size={18} color={colors.textOnBlue} />}
                  style={styles.feedbackButton}
                  testID="get-feedback-button"
                />
              </View>
            </View>
          </Card>

          <Card style={styles.resultsCard}>
            <Text style={styles.cardTitle}>{t('interview:feedback')}</Text>
            {isLoading ? (
              <View style={styles.loadingState}>
                <Brain size={32} color={colors.primary} />
                <Text style={styles.loadingText}>Analyzing your answer...</Text>
              </View>
            ) : feedback ? (
              renderFeedback()
            ) : (
              <EmptyView
                title={t('interview:noFeedbackYet')}
                message="Type or speak your interview answer above to get personalized AI feedback"
                testID="feedback-empty-state"
              />
            )}
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  inputCard: {
    marginBottom: spacing.lg,
  },
  resultsCard: {
    marginBottom: spacing.lg,
  },
  cardTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  inputSection: {
    gap: spacing.md,
  },
  textInput: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: fontSizes.md,
    color: colors.text,
    minHeight: 120,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  micButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  recordingIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#EF4444',
  },
  feedbackButton: {
    flex: 1,
  },
  loadingState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.md,
  },
  loadingText: {
    fontSize: fontSizes.md,
    color: colors.textMuted,
  },
  feedbackContent: {
    gap: spacing.sm,
  },
  feedbackTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  feedbackSubtitle: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: colors.text,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  feedbackText: {
    fontSize: fontSizes.sm,
    color: colors.text,
    lineHeight: 20,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginLeft: spacing.sm,
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginTop: 8,
  },
  bulletText: {
    flex: 1,
    fontSize: fontSizes.sm,
    color: colors.text,
    lineHeight: 20,
  },
  spacer: {
    height: spacing.xs,
  },
});