import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Platform, Linking } from 'react-native';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useHeaderTitle } from '@/hooks/useHeaderTitle';
import { 
  User, 
  CreditCard, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  FileDown,
  FileJson,
  Languages as LanguagesIcon,
  ShoppingCart,
  Trash2,
  Lock,
  Globe,
  Camera,
  Mic2,
  BellRing,
  Bug,
  ClipboardList,
  Users,
} from 'lucide-react-native';
import { ROUTES } from '@/constants/routes';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { useAuthContext } from '@/providers/AuthProvider';
import { LoadingView } from '@/components/LoadingView';
import { Card } from '@/components/ui/Card';
import { colors, spacing, fontSizes, fontWeights } from '@/theme/tokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function RowItem({ icon: Icon, label, helper, onPress, danger }: { icon: any; label: string; helper?: string; onPress: () => void; danger?: boolean }) {
  return (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} accessibilityRole="button">
      <View style={styles.settingLeft}>
        <Icon size={22} color={danger ? colors.error : colors.textMuted} />
        <View>
          <Text style={[styles.settingLabel, danger ? { color: colors.error } : null]}>{label}</Text>
          {helper ? <Text style={styles.settingHint}>{helper}</Text> : null}
        </View>
      </View>
      <ChevronRight size={20} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

function RowSwitch({ icon: Icon, label, value, onValueChange }: { icon: any; label: string; value: boolean; onValueChange: (v: boolean) => void }) {
  return (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <Icon size={22} color={colors.textMuted} />
        <Text style={styles.settingLabel}>{label}</Text>
      </View>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

export default function SettingsScreen() {
  useHeaderTitle('nav.settings');
  const { isLoading } = useProtectedRoute();
  const { user, logout } = useAuthContext();
  const insets = useSafeAreaInsets();

  const [twoFA, setTwoFA] = useState<boolean>(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState<boolean>(true);
  const [crashEnabled, setCrashEnabled] = useState<boolean>(true);
  const [resumeNotifications, setResumeNotifications] = useState<boolean>(true);
  const [jobNotifications, setJobNotifications] = useState<boolean>(true);
  const [communityNotifications, setCommunityNotifications] = useState<boolean>(true);
  const version = useMemo(() => Constants.expoConfig?.version ?? '1.0.0', []);

  useEffect(() => {
    const load = async () => {
      try {
        const [a, c, t, r, j, comm] = await Promise.all([
          AsyncStorage.getItem('analytics_enabled'),
          AsyncStorage.getItem('crash_enabled'),
          AsyncStorage.getItem('twofa_enabled'),
          AsyncStorage.getItem('resume_notifications'),
          AsyncStorage.getItem('job_notifications'),
          AsyncStorage.getItem('community_notifications'),
        ]);
        setAnalyticsEnabled(a ? a === 'true' : true);
        setCrashEnabled(c ? c === 'true' : true);
        setTwoFA(t ? t === 'true' : false);
        setResumeNotifications(r ? r === 'true' : true);
        setJobNotifications(j ? j === 'true' : true);
        setCommunityNotifications(comm ? comm === 'true' : true);
      } catch (e) {
        console.warn('Settings load failed', e);
      }
    };
    load();
  }, []);

  if (isLoading) {
    return <LoadingView message="Loading settings..." />;
  }

  const handleLogout = async () => {
    await logout();
    router.replace(ROUTES.WELCOME);
  };

  const confirmDelete = () => {
    Alert.alert('Delete Account', 'This will permanently delete your local data and sign you out immediately.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            await AsyncStorage.clear();
            console.log('analytics: account_deleted');
          } catch (e) {
            console.error('Delete failed', e);
          } finally {
            await handleLogout();
          }
        }
      }
    ]);
  };

  const restorePurchases = async () => {
    console.log('analytics: restore_purchases_tapped');
    Alert.alert('Restore Purchases', 'No purchases to restore in Expo Go.');
  };

  const openUrl = async (url: string) => {
    try {
      if (Platform.OS === 'web') {
        window.open(url, '_blank');
      } else {
        await WebBrowser.openBrowserAsync(url);
      }
    } catch (e) {
      console.warn('Open URL failed', e);
    }
  };

  const openAppSettings = async () => {
    try {
      if (Platform.OS === 'ios') {
        await Linking.openURL('app-settings:');
      } else if (Platform.OS === 'android') {
        await Linking.openSettings();
      } else {
        console.log('Open settings not supported on web');
      }
    } catch (e) {
      console.warn('Open settings failed', e);
    }
  };

  const setAndPersist = async (key: string, value: boolean) => {
    try {
      await AsyncStorage.setItem(key, String(value));
      if (key === 'analytics_enabled') setAnalyticsEnabled(value);
      if (key === 'crash_enabled') setCrashEnabled(value);
      if (key === 'twofa_enabled') setTwoFA(value);
      if (key === 'resume_notifications') setResumeNotifications(value);
      if (key === 'job_notifications') setJobNotifications(value);
      if (key === 'community_notifications') setCommunityNotifications(value);
    } catch (e) {
      console.warn('Persist setting failed', e);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
      >
        <Card style={styles.profileSection}>
          <View style={styles.profileAvatar}>
            <User size={40} color={colors.textOnBlue} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name || 'User'}</Text>
            <Text style={styles.profileEmail}>{user?.email || 'user@example.com'}</Text>
          </View>
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <Card padding="sm">
            <RowSwitch icon={FileDown} label="Resume Updates" value={resumeNotifications} onValueChange={(v) => setAndPersist('resume_notifications', v)} />
            <RowSwitch icon={ClipboardList} label="Job Reminders" value={jobNotifications} onValueChange={(v) => setAndPersist('job_notifications', v)} />
            <RowSwitch icon={Users} label="Community Alerts" value={communityNotifications} onValueChange={(v) => setAndPersist('community_notifications', v)} />
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <Card padding="sm">
            <RowItem icon={User} label="Edit Profile" onPress={() => router.push('/profile')} />
            <RowItem icon={Lock} label="Change Password" onPress={() => Alert.alert('Change Password', 'Password change flow coming soon.')} />
            <RowSwitch icon={Shield} label="Two-Factor Authentication" value={twoFA} onValueChange={(v) => setAndPersist('twofa_enabled', v)} />
            <RowItem icon={Trash2} label="Delete/Deactivate Account" onPress={confirmDelete} danger />
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Data</Text>
          <Card padding="sm">
            <RowItem icon={Shield} label="Privacy Policy" onPress={() => openUrl('https://example.com/privacy')} />
            <RowItem icon={Shield} label="Terms of Service" onPress={() => openUrl('https://example.com/terms')} />
            <RowItem icon={FileJson} label="Data Export (JSON)" onPress={() => router.push('/(tabs)/resources')} />
            <RowItem icon={FileDown} label="Data Deletion (Self-serve)" onPress={confirmDelete} />
            <RowSwitch icon={Bell} label="Marketing Consent" value={analyticsEnabled} onValueChange={(v) => setAndPersist('analytics_enabled', v)} />
            <RowSwitch icon={Bug} label="Analytics / Crash Reporting" value={crashEnabled} onValueChange={(v) => setAndPersist('crash_enabled', v)} />
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Permissions</Text>
          <Card padding="sm">
            <RowItem icon={Globe} label="Location" helper="Used for market suggestions (foreground only)." onPress={openAppSettings} />
            <RowItem icon={Camera} label="Camera / Photos" helper="For headshots and OCR." onPress={openAppSettings} />
            <RowItem icon={Mic2} label="Microphone" helper="Voice to résumé features." onPress={openAppSettings} />
            <RowItem icon={BellRing} label="Notifications" helper="Interview reminders and updates." onPress={openAppSettings} />
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subscriptions & Purchases</Text>
          <Card padding="sm">
            <RowItem icon={CreditCard} label="Manage Plan" onPress={() => Alert.alert('Manage Plan', 'Subscription management coming soon.')} />
            <RowItem icon={ShoppingCart} label="Restore Purchases" onPress={restorePurchases} />
            <RowItem icon={HelpCircle} label="Billing Support" onPress={() => openUrl('https://example.com/billing-support')} />
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Localization</Text>
          <Card padding="sm">
            <RowItem icon={LanguagesIcon} label="Language" onPress={() => router.push('/language')} />
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal & Contact</Text>
          <Card padding="sm">
            <RowItem icon={HelpCircle} label="Contact Support" onPress={() => openUrl('mailto:support@example.com')} />
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Shield size={22} color={colors.textMuted} />
                <Text style={styles.settingLabel}>Open Source Licenses</Text>
              </View>
              <ChevronRight size={20} color={colors.textMuted} />
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaText}>App Version</Text>
              <Text style={styles.metaText}>{version}</Text>
            </View>
          </Card>
        </View>

        <Card>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} testID="logoutButton" accessibilityRole="button">
            <LogOut size={22} color={colors.error} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.xl,
    marginBottom: spacing.sm,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  profileName: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    color: colors.text,
  },
  profileEmail: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
    marginTop: 4,
  },
  section: {
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.textMuted,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  settingLabel: {
    fontSize: fontSizes.md,
    color: colors.text,
    fontWeight: fontWeights.medium,
  },
  settingHint: {
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  metaText: {
    color: colors.textMuted,
    fontSize: fontSizes.sm,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: spacing.md,
  },
  logoutText: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: colors.error,
  },
});