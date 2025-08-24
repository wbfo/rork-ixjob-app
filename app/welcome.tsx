import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Platform, Image } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/constants/routes';
import { useAuthContext } from '@/providers/AuthProvider';
import { Screen } from '@/components/Screen';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { colors, spacing } from '@/theme/tokens';

export default function WelcomeScreen() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthContext();

  const changeLanguageHref = useMemo(() => {
    return isAuthenticated ? ROUTES.TABS.SETTINGS_LANGUAGE : ROUTES.LANGUAGE;
  }, [isAuthenticated]);

  const screenHeight = Dimensions.get('window').height;
  const headerHeight = screenHeight * 0.382;

  return (
    <Screen gradientOverride={[colors.blue600, colors.primaryDark]}>
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={[styles.headerSection, { minHeight: headerHeight }]} testID="welcome-header">
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1501706362039-c06b2d715385?w=256&h=256&fit=crop&auto=format' }}
              style={styles.avatar}
              accessibilityRole={Platform.OS === 'web' ? undefined : 'image'}
              accessibilityLabel={t('auth.welcome.avatarAlt', { defaultValue: 'Jobii the owl avatar' })}
              testID="welcome-avatar"
            />
            <Text style={styles.title} testID="welcome-title" accessibilityRole={Platform.OS === 'web' ? undefined : 'header'}>
              {t('auth.welcome.title', { defaultValue: 'Welcome to IxJOB' })}
            </Text>
            <Text style={styles.subtitle} testID="welcome-subtitle">
              {t('auth.welcome.subtitle', { defaultValue: 'Your AI job coach, ready to help you land your next role.' })}
            </Text>
          </View>

          <View style={styles.middleSection}>
            <View style={styles.buttonContainer}>
              <PrimaryButton
                testID="welcome-login"
                title={t('welcome.login', { defaultValue: 'Log in' })}
                onPress={() => router.push(ROUTES.AUTH.LOGIN)}
              />
              <TouchableOpacity
                testID="welcome-signup"
                style={styles.secondaryButton}
                onPress={() => router.push(ROUTES.AUTH.SIGNUP)}
                accessibilityRole="button"
                accessibilityLabel={t('welcome.signup', { defaultValue: 'Sign up' })}
              >
                <Text style={styles.secondaryButtonText}>{t('welcome.signup', { defaultValue: 'Sign up' })}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.bottomSection}>
            <TouchableOpacity
              testID="welcome-change-language"
              accessibilityRole="link"
              style={styles.changeLanguageLink}
              onPress={() => router.push(changeLanguageHref as any)}
            >
              <Text style={styles.changeLanguageText}>{t('welcome.changeLanguage', { defaultValue: 'Change language' })}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    maxWidth: 420,
    alignSelf: 'center',
    width: '100%'
  },
  headerSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xl,
  },
  middleSection: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: spacing.lg,
  },
  buttonContainer: {
    gap: spacing.md,
  },
  secondaryButton: {
    backgroundColor: colors.textOnBlue,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  bottomSection: {
    paddingBottom: spacing.xl,
    alignItems: 'center',
    minHeight: 64,
    justifyContent: 'flex-end',
  },
  changeLanguageLink: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeLanguageText: {
    color: colors.textOnBlueQuaternary,
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  headerText: {
    paddingTop: 0,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    marginBottom: spacing.md,
    backgroundColor: '#ffffff22',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textOnBlue,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textOnBlueTertiary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 340,
    paddingHorizontal: spacing.md,
  },
  glassmorphicContainer: {
  },
});