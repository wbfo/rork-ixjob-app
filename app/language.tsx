import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Dimensions, Platform } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/providers/LanguageProvider';
import i18n, { type SupportedLanguage } from '@/i18n';
import { LoadingView } from '@/components/LoadingView';
import { Screen } from '@/components/Screen';
import { Globe } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Dropdown } from '@/components/ui/Dropdown';
import { layout, colors } from '@/theme/tokens';
import { StatusBar } from 'expo-status-bar';

interface LanguageOption {
  code: SupportedLanguage;
  nativeName: string;
  flag: string;
}

const languageOptions: LanguageOption[] = [
  { code: 'en', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'zh', nativeName: '中文（简体）', flag: '🇨🇳' },
  { code: 'ar', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'pt', nativeName: 'Português (Brasil)', flag: '🇧🇷' },
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

  const screenHeight = Dimensions.get('window').height;
  const headerHeight = screenHeight * layout.headerRatio;

  return (
    <Screen gradientOverride={[colors.primaryLight, colors.blue600]}>
      <StatusBar style="light" />

      <View style={[styles.headerSection, { minHeight: headerHeight }]} testID="language-header">
        <Globe size={112} color={colors.textOnBlue} accessibilityLabel="Globe" />
        <Text style={styles.title} accessibilityRole="header">
          {t('onboarding.language.title','Choose Your Language')}
        </Text>
        <Text style={styles.subtitle} accessibilityHint={t('onboarding.language.subtitle','IxJOB adapts to you — pick the language you’re most comfortable with.')}>
          {t('onboarding.language.subtitle','IxJOB adapts to you — pick the language you’re most comfortable with.')}
        </Text>
      </View>

      <View style={styles.middleSection}>
        <Card>
          <Dropdown
            label={t('onboarding.language.title','Choose Your Language')}
            selectedValue={selectedLanguage}
            onValueChange={handleLanguageSelect}
            options={languageOptions}
            placeholder={t('onboarding.language.title','Choose Your Language')}
            testID="language-picker"
          />
        </Card>
      </View>

      <View style={styles.bottomSection}>
        <PrimaryButton
          title={t('common.continue','Continue')}
          onPress={handleContinue}
          disabled={!selectedLanguage || isLoading}
          testID="continue-button"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 16,
    color: colors.textOnBlue,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    color: colors.textOnBlueSecondary,
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  middleSection: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 24,
  },
  bottomSection: {
    paddingBottom: 32,
    alignItems: 'center',
    minHeight: 96,
    justifyContent: 'flex-end',
  },
});
