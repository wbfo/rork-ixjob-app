import React, { memo, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Bell, User2, Settings, ArrowLeft, X as CloseIcon } from 'lucide-react-native';
import { colors, spacing } from '@/theme/tokens';
import { router } from 'expo-router';

interface AppTopBarProps {
  title?: string;
  onPressBell?: () => void;
  onPressProfile?: () => void;
  onPressSettings?: () => void;
  onPressBack?: () => void;
}

function AppTopBar({ title, onPressBell, onPressProfile, onPressSettings, onPressBack }: AppTopBarProps) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const top = Math.max(insets.top, Platform.OS === 'android' ? 8 : 12);
  
  // Determine what to show based on current route and navigation state
  const canGoBack = navigation?.canGoBack?.() ?? false;
  const currentRoute = navigation?.getState?.()?.routes?.at?.(-1)?.name ?? '';
  const showSettings = currentRoute === 'profile';
  const needsClose = !canGoBack && (currentRoute.includes('settings') || currentRoute.includes('notifications') || currentRoute.includes('profile') || currentRoute.includes('language'));

  // Use light content when header sits on blue gradient backgrounds
  const onBlue = currentRoute === 'community';
  const titleColor = onBlue ? colors.textOnBlue : colors.text;
  const iconBg = onBlue ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.04)';
  const iconColor = onBlue ? colors.textOnBlue : colors.text;
  const headerBg = onBlue ? 'transparent' : colors.surface;

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
    if (canGoBack) {
      navigation.goBack();
    } else {
      router.replace('/(tabs)/dashboard');
    }
  }, [onPressBack, canGoBack, navigation]);
  
  const handleClose = useCallback(() => {
    router.replace('/(tabs)/dashboard');
  }, []);

  const tapCount = useRef<number>(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogoTap = () => {
    // Secret: 7 taps within 2 seconds
    tapCount.current += 1;
    if (tapTimer.current) clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => { tapCount.current = 0; }, 2000);
    if (tapCount.current >= 7) {
      tapCount.current = 0;
      if (__DEV__ || (process.env.EXPO_PUBLIC_APP_ENV !== 'production')) {
        router.push('/dev/tools');
        return;
      }
    }
    handleClose();
  };

  return (
    <View style={[styles.wrap, { paddingTop: top, backgroundColor: headerBg }]} testID="app-top-bar">
      <TouchableOpacity accessibilityLabel="Go home" onPress={handleLogoTap} hitSlop={12} style={styles.logoBtn} testID="header-logo">
        <Image
          source={require('../assets/images/adaptive-icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </TouchableOpacity>
      {canGoBack ? (
        <TouchableOpacity accessibilityLabel="Go back" onPress={handleBack} hitSlop={12} style={[styles.leftBtn, styles.leftBtnShift, { backgroundColor: iconBg }]} testID="header-back">
          <ArrowLeft size={20} color={iconColor} />
        </TouchableOpacity>
      ) : needsClose ? (
        <TouchableOpacity accessibilityLabel="Close" onPress={handleClose} hitSlop={12} style={[styles.leftBtn, styles.leftBtnShift, { backgroundColor: iconBg }]} testID="header-close">
          <CloseIcon size={20} color={iconColor} />
        </TouchableOpacity>
      ) : null}
      <Text accessibilityRole="header" style={[styles.title, { color: titleColor }]} numberOfLines={1} testID="app-header-title">
        {title ?? ''}
      </Text>
      <View style={styles.actions}>
        <TouchableOpacity accessibilityLabel="Notifications" onPress={handleBell} hitSlop={12} style={[styles.iconBtn, { backgroundColor: iconBg }]} testID="header-bell">
          <Bell size={20} color={iconColor} />
        </TouchableOpacity>
        {showSettings ? (
          <TouchableOpacity accessibilityLabel="Settings" onPress={handleSettings} hitSlop={12} style={[styles.iconBtn, { backgroundColor: iconBg }]} testID="header-settings">
            <Settings size={20} color={iconColor} />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity accessibilityLabel="Profile" onPress={handleProfile} hitSlop={12} style={[styles.iconBtn, { backgroundColor: iconBg }]} testID="header-profile">
          <User2 size={20} color={iconColor} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Fallback mapping if a screen forgets to set a title
const mapRouteToTitle = (name: string) => {
  const pretty = name.split('/').pop()?.replace(/[-_]/g, ' ') ?? 'ixJOB';
  return pretty.charAt(0).toUpperCase() + pretty.slice(1);
};

export default memo(AppTopBar, (prevProps, nextProps) => {
  return prevProps.title === nextProps.title &&
         prevProps.onPressBell === nextProps.onPressBell &&
         prevProps.onPressProfile === nextProps.onPressProfile &&
         prevProps.onPressSettings === nextProps.onPressSettings &&
         prevProps.onPressBack === nextProps.onPressBack;
});
export { mapRouteToTitle };

const styles = StyleSheet.create({
  wrap: { backgroundColor: colors.surface, borderBottomWidth: 0, paddingHorizontal: 16, paddingBottom: 12, flexDirection: 'row', alignItems: 'center' },
  title: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700' as const, color: colors.text },
  actions: { position: 'absolute', right: 12, bottom: 12, flexDirection: 'row', gap: spacing.xs },
  iconBtn: { padding: 6, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.04)' },
  leftBtn: { position: 'absolute', left: 12, bottom: 12, padding: 6, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.04)' },
  logoBtn: { position: 'absolute', left: 12, bottom: 8, padding: 2, borderRadius: 8 },
  logo: { width: 36, height: 36, borderRadius: 8 },
  leftBtnShift: { left: 52 },
});