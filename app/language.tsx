import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/providers/LanguageProvider';
import i18n, { type SupportedLanguage } from '@/i18n';
import { LoadingView } from '@/components/LoadingView';
import { Screen } from '@/components/Screen';
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
  const { t } = useTranslation();
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
    <Screen gradientOverride={[colors.primaryLight, colors.blue600]}>
      <StatusBar style="light" />

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
                  <Text style={styles.languageText}>
                    {option.nativeName}
                  </Text>
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
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  cardContainer: {
    width: '100%',
    maxWidth: 400,
  },
  languageCard: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  cardHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.textMuted,
    borderRadius: 2,
    marginBottom: spacing.lg,
  },
  cardTitle: {
    fontSize: 24,
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
    marginBottom: spacing.xl,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
  },
  radioContainer: {
    marginRight: spacing.md,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: colors.primary,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
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