import React from 'react';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { 
  LayoutDashboard, 
  FileText, 
  Mic, 
  ClipboardList, 
  Users,
  BookOpen,
  Bell,
  User
} from 'lucide-react-native';
import { colors, spacing } from '@/theme/tokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TopBarActions = ({ showNotifications = false }: { showNotifications?: boolean }) => (
  <View style={styles.headerActions}>
    {showNotifications && (
      <TouchableOpacity 
        style={styles.iconButton}
        onPress={() => router.push('/notifications')}
        testID="notifications-button"
      >
        <Bell size={18} color={colors.text} />
      </TouchableOpacity>
    )}
    <TouchableOpacity 
      style={styles.profileButton}
      onPress={() => router.push('/profile')}
      testID="profile-avatar"
    >
      <View style={styles.avatar}>
        <User size={14} color={colors.primary} />
      </View>
    </TouchableOpacity>
  </View>
);

export default function TabLayout() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false, // IMPORTANT: header is owned by the root layout
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: 64 + Math.max(insets.bottom, 8),
          paddingBottom: Math.max(insets.bottom, 10),
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginBottom: 6,
        },
        sceneStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: t('nav.dashboard'),
          tabBarIcon: ({ color, size }) => (
            <LayoutDashboard size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="resume"
        options={{
          title: t('nav.resume'),
          tabBarIcon: ({ color, size }) => (
            <FileText size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="interview"
        options={{
          title: t('nav.interview'),
          tabBarIcon: ({ color, size }) => (
            <Mic size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tracker"
        options={{
          title: t('nav.jobs'),
          tabBarIcon: ({ color, size }) => (
            <ClipboardList size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="resources"
        options={{
          title: t('nav.resources'),
          tabBarIcon: ({ color, size }) => (
            <BookOpen size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          href: null, // Hide from tab bar but keep route accessible
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginRight: spacing.md,
  },
  iconButton: {
    padding: spacing.xs,
  },
  profileButton: {
    padding: spacing.xs,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
});