import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { Video, Upload, Camera, Lightbulb } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/ui/Card';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useHeaderTitle } from '@/hooks/useHeaderTitle';
import { colors, spacing, fontSizes, fontWeights, radius } from '@/theme/tokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function VideoPracticeScreen() {
  const { t } = useTranslation();
  useHeaderTitle('nav:videoPractice');
  const insets = useSafeAreaInsets();
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const requestCameraAndMic = async () => {
    console.log('[VideoPractice] Requesting camera and microphone permissions');
    
    if (Platform.OS === 'web') {
      Alert.alert('Camera Access', 'Camera recording is not available on web. Please use the mobile app for video practice.');
      return;
    }
    
    // For now, show placeholder functionality
    Alert.alert(
      'Video Recording',
      'This feature will allow you to record practice interviews and get feedback on your body language and speaking confidence.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Start Recording', onPress: () => {
          setIsRecording(true);
          setTimeout(() => {
            setIsRecording(false);
            Alert.alert('Recording Complete', 'Your practice session has been saved. Analysis coming soon!');
          }, 3000);
        }}
      ]
    );
  };

  const importVideo = () => {
    console.log('[VideoPractice] Importing video clip');
    Alert.alert(
      'Import Video',
      'Select a video file from your device to analyze your interview performance.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Choose File', onPress: () => {
          Alert.alert('Coming Soon', 'Video import functionality will be available in the next update.');
        }}
      ]
    );
  };

  const tips = [
    t('interview:tipLighting'),
    t('interview:tipBackground'),
    t('interview:tipTiming'),
    'Maintain eye contact with the camera',
    'Practice your posture and hand gestures',
    'Speak clearly and at a moderate pace'
  ];

  return (
    <Screen>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.recordingCard}>
          <Text style={styles.cardTitle}>{t('interview:recordAndReview')}</Text>
          
          <View style={styles.recordingSection}>
            {isRecording ? (
              <View style={styles.recordingIndicator}>
                <View style={styles.recordingDot} />
                <Text style={styles.recordingText}>Recording in progress...</Text>
              </View>
            ) : (
              <View style={styles.recordingControls}>
                <PrimaryButton
                  title={t('interview:startRecording')}
                  onPress={requestCameraAndMic}
                  leftIcon={<Camera size={18} color={colors.textOnBlue} />}
                  style={styles.recordButton}
                  testID="start-recording-button"
                />
                
                <PrimaryButton
                  title={t('interview:uploadClip')}
                  onPress={importVideo}
                  variant="secondary"
                  leftIcon={<Upload size={18} color={colors.primary} />}
                  style={styles.uploadButton}
                  testID="upload-video-button"
                />
              </View>
            )}
          </View>
          
          <Text style={styles.noteText}>{t('interview:videoNote')}</Text>
        </Card>

        <Card style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Lightbulb size={20} color={colors.primary} />
            <Text style={styles.cardTitle}>{t('interview:tips')}</Text>
          </View>
          
          <View style={styles.tipsList}>
            {tips.map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <View style={styles.tipBullet} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Card style={styles.featuresCard}>
          <Text style={styles.cardTitle}>Coming Soon</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Video size={16} color={colors.textMuted} />
              <Text style={styles.featureText}>AI-powered body language analysis</Text>
            </View>
            <View style={styles.featureItem}>
              <Camera size={16} color={colors.textMuted} />
              <Text style={styles.featureText}>Speaking pace and clarity feedback</Text>
            </View>
            <View style={styles.featureItem}>
              <Lightbulb size={16} color={colors.textMuted} />
              <Text style={styles.featureText}>Personalized improvement suggestions</Text>
            </View>
          </View>
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
  recordingCard: {
    marginBottom: spacing.lg,
  },
  tipsCard: {
    marginBottom: spacing.lg,
  },
  featuresCard: {
    marginBottom: spacing.lg,
  },
  cardTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  recordingSection: {
    marginBottom: spacing.lg,
  },
  recordingControls: {
    gap: spacing.md,
  },
  recordButton: {
    marginBottom: spacing.sm,
  },
  uploadButton: {
    // No additional styles needed
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#EF4444',
  },
  recordingText: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    color: colors.text,
  },
  noteText: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  tipsList: {
    gap: spacing.md,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 8,
  },
  tipText: {
    flex: 1,
    fontSize: fontSizes.sm,
    color: colors.text,
    lineHeight: 20,
  },
  featuresList: {
    gap: spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  featureText: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
    lineHeight: 20,
  },
});