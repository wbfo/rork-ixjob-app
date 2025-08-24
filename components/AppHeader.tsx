import React, { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, User2, Settings, ArrowLeft } from 'lucide-react-native';
import { colors, spacing } from '@/theme/tokens';
import { router } from 'expo-router';

interface AppHeaderProps {
  title?: string;
  onPressBell?: () => void;
  onPressProfile?: () => void;
  onPressSettings?: () => void;
  onPressBack?: () => void;
  showSettings?: boolean;
  showBack?: boolean;
  showLogo?: boolean;
}

function Header({ title, onPressBell, onPressProfile, onPressSettings, onPressBack, showSettings, showBack, showLogo = true }: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const top = Math.max(insets.top, Platform.OS === 'android' ? 8 : 12);

  const handleBell = useCallback(() => {
    if (onPressBell) {
      onPressBell();
      return;
    }
    router.push('/notifications' as const);
  }, [onPressBell]);

  const handleProfile = useCallback(() => {
    if (onPressProfile) {
      onPressProfile();
      return;
    }
    router.push('/profile' as const);
  }, [onPressProfile]);

  const handleSettings = useCallback(() => {
    if (onPressSettings) {
      onPressSettings();
      return;
    }
    router.push('/settings' as const);
  }, [onPressSettings]);

  const handleBack = useCallback(() => {
    if (onPressBack) {
      onPressBack();
      return;
    }
    router.back();
  }, [onPressBack]);

  const handleLogoPress = useCallback(() => {
    router.push('/' as const);
  }, []);

  return (
    <View style={[styles.wrap, { paddingTop: top }]} testID="app-header">
      <View style={styles.leftSection}>
        {showLogo && !showBack ? (
          <TouchableOpacity 
            accessibilityLabel="Go to homepage" 
            onPress={handleLogoPress} 
            hitSlop={12} 
            style={styles.logoBtn} 
            testID="header-logo"
          >
            <Image 
              source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/pp99fvmcyxt9vcyyuu0qo' }}
              style={styles.logo}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ) : showBack ? (
          <TouchableOpacity accessibilityLabel="Go back" onPress={handleBack} hitSlop={12} style={styles.leftBtn} testID="header-back">
            <ArrowLeft size={20} color={colors.text} />
          </TouchableOpacity>
        ) : null}
      </View>
      <Text accessibilityRole="header" style={[styles.title, showLogo && !showBack ? styles.titleWithLogo : null]} numberOfLines={1} testID="app-header-title">
        {title ?? ''}
      </Text>
      <View style={styles.actions}>
        <TouchableOpacity accessibilityLabel="Notifications" onPress={handleBell} hitSlop={12} style={styles.iconBtn} testID="header-bell">
          <Bell size={20} color={colors.text} />
        </TouchableOpacity>
        {showSettings ? (
          <TouchableOpacity accessibilityLabel="Settings" onPress={handleSettings} hitSlop={12} style={styles.iconBtn} testID="header-settings">
            <Settings size={20} color={colors.text} />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity accessibilityLabel={`Profile`} onPress={handleProfile} hitSlop={12} style={styles.iconBtn} testID="header-profile">
          <User2 size={20} color={colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default memo(Header);

const styles = StyleSheet.create({
  wrap: { backgroundColor: colors.surface, borderBottomWidth: 0, paddingHorizontal: 16, paddingBottom: 12, flexDirection: 'row', alignItems: 'center' },
  leftSection: { width: 120, justifyContent: 'flex-start' },
  title: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700' as const, color: colors.text },
  titleWithLogo: { marginLeft: -60 },
  actions: { position: 'absolute', right: 12, bottom: 12, flexDirection: 'row', gap: spacing.xs },
  iconBtn: { padding: 6, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.04)' },
  leftBtn: { padding: 6, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.04)' },
  logoBtn: { padding: 4 },
  logo: { width: 80, height: 32 },
});