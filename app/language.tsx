import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

import { useLanguage } from '@/providers/LanguageProvider';
import i18n, { type SupportedLanguage } from '@/i18n';
import { LoadingView } from '@/components/LoadingView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/Card';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { colors, radius, spacing } from '@/theme/tokens';
import { StatusBar } from 'expo-status-bar';

interface LanguageOption {
  code: SupportedLanguage;
  nativeName: string;
  flag: string;
}

const languageOptions: LanguageOption[] = [
  { code: 'en', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'zh', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ar', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'pt', nativeName: 'Português', flag: '🇧🇷' },
];

export default function LanguageScreen() {
  // We don't use translation here as this is the language selection screen
  const { setLanguage } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLanguageSelect = (language: SupportedLanguage) => {
    console.log('Language selected:', language);
    setSelectedLanguage(language);
  };

  const handleContinue = async () => {
    if (!selectedLanguage) return;

    setIsLoading(true);
    try {
      await i18n.changeLanguage(selectedLanguage);
      await setLanguage(selectedLanguage);
      router.replace('/welcome');
    } catch (error) {
      console.error('Error setting language:', error);
      Alert.alert('Error', 'Failed to set language. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingView message="Setting up your language..." />;
  }

  return (
    <View style={styles.mainContainer}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
      <View style={styles.backgroundContainer}>
        <View style={styles.topSection} />
        <View style={styles.bottomSection} />
      </View>

      <View style={styles.container}>
        <View style={styles.cardContainer}>
          <Card style={styles.languageCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHandle} />
              <Text style={styles.cardTitle}>
                Welcome to ixJOB
              </Text>
              <Text style={styles.cardSubtitle}>
                Select your language
              </Text>
            </View>

            <View style={styles.languageList}>
              {languageOptions.map((option) => (
                <TouchableOpacity
                  key={option.code}
                  style={styles.languageOption}
                  onPress={() => handleLanguageSelect(option.code)}
                  testID={`language-option-${option.code}`}
                >
                  <View style={styles.radioContainer}>
                    <View style={[
                      styles.radioButton,
                      selectedLanguage === option.code && styles.radioButtonSelected
                    ]}>
                      {selectedLanguage === option.code && (
                        <View style={styles.radioButtonInner} />
                      )}
                    </View>
                  </View>
                  <View style={styles.languageTextContainer}>
                    <Text style={styles.languageFlag}>{option.flag}</Text>
                    <Text style={styles.languageText}>
                      {option.nativeName}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.buttonContainer}>
              <PrimaryButton
                title="Continue"
                onPress={handleContinue}
                disabled={!selectedLanguage || isLoading}
                testID="continue-button"
              />
            </View>
          </Card>
        </View>
      </View>
    </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    position: 'relative',
  },
  safeArea: {
    flex: 1,
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  topSection: {
    height: '50%',
    backgroundColor: colors.primaryLight,
  },
  bottomSection: {
    height: '50%',
    backgroundColor: colors.blue600,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  cardContainer: {
    width: '100%',
    maxWidth: 350,
  },
  languageCard: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    width: '85%',
    alignSelf: 'center',
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.textMuted,
    borderRadius: 2,
    marginBottom: spacing.lg,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  cardSubtitle: {
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
  },
  languageList: {
    marginBottom: spacing.md,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  radioContainer: {
    marginRight: spacing.md,
  },
  radioButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: colors.primary,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  languageTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageFlag: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  languageText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  buttonContainer: {
    marginTop: spacing.md,
  },
});