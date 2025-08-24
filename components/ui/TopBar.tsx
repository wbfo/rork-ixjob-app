import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { User, Bell } from 'lucide-react-native';
import { colors, spacing, fontSizes, fontWeights } from '@/theme/tokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TopBarProps {
  title?: string;
  showProfile?: boolean;
  showNotifications?: boolean;
  notificationCount?: number;
}

export function TopBar({ 
  title, 
  showProfile = true, 
  showNotifications = true, 
  notificationCount = 0 
}: TopBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          {title && (
            <Text style={styles.title} testID="top-bar-title">{title}</Text>
          )}
        </View>
        
        <View style={styles.rightSection}>
          {showNotifications && (
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => router.push('/notifications')}
              testID="notifications-button"
            >
              <Bell size={24} color={colors.text} />
              {notificationCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {notificationCount > 99 ? '99+' : notificationCount.toString()}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
          
          {showProfile && (
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={() => router.push('/profile')}
              testID="profile-avatar"
            >
              <View style={styles.avatar}>
                <User size={20} color={colors.primary} />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    shadowColor: colors.cardShadow,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 56,
  },
  leftSection: {
    flex: 1,
  },
  title: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.text,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconButton: {
    padding: spacing.xs,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: fontWeights.bold,
    color: colors.textInverse,
  },
  profileButton: {
    padding: spacing.xs,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
});