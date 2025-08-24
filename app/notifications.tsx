import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { Bell, CheckCheck, Trash2 } from 'lucide-react-native';
import { colors, fontSizes, fontWeights, spacing } from '@/theme/tokens';
import { Card } from '@/components/ui/Card';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { LoadingView } from '@/components/LoadingView';
import { useHeaderTitle } from '@/hooks/useHeaderTitle';

export type NotificationCategory = 'job' | 'resume' | 'interview' | 'community' | 'system';
export type NotificationChannel = 'push' | 'inapp';

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  category: NotificationCategory;
  channel: NotificationChannel;
  createdAt: string;
  read: boolean;
  ctaLabel?: string;
  ctaRoute?: string;
}

export default function NotificationsCenterScreen() {
  useHeaderTitle('nav.notifications');
  const { isLoading } = useProtectedRoute();
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState<AppNotification[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const mock: AppNotification[] = [
        { id: '1', title: 'Application due soon', body: 'Finish your CNA application today.', category: 'job', channel: 'inapp', createdAt: new Date().toISOString(), read: false, ctaLabel: 'Open Tracker', ctaRoute: '/(tabs)/tracker' },
        { id: '2', title: 'Your post got 3 new comments', body: 'Tap to view the conversation.', category: 'community', channel: 'inapp', createdAt: new Date().toISOString(), read: false, ctaLabel: 'Open Feed', ctaRoute: '/(tabs)/community' },
      ];
      setItems(mock);
    } catch (e) {
      console.error('notifications.load.error', e);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const onMarkAll = useCallback(() => {
    setItems(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const renderItem = useCallback(({ item }: { item: AppNotification }) => {
    return (
      <Card style={styles.card} testID={`notif-${item.id}`}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={`${item.title}. ${item.body}`}
          activeOpacity={0.8}
          onPress={() => {
            console.log('notif.open', item.id, item.ctaRoute);
            if (item.ctaRoute) {
              router.push(item.ctaRoute as any);
            }
          }}
          style={styles.row}
        >
          <View style={[styles.iconDot, item.read ? styles.iconDotRead : styles.iconDotUnread]} />
          <View style={styles.texts}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.body}>{item.body}</Text>
          </View>
          {item.ctaLabel ? (
            <Text style={styles.cta}>{item.ctaLabel}</Text>
          ) : null}
        </TouchableOpacity>
      </Card>
    );
  }, []);

  const empty = useMemo(
    () => (
      <View style={styles.empty}>
        <Bell size={28} color={colors.textMuted} />
        <Text style={styles.emptyTitle}>No notifications</Text>
        <Text style={styles.emptyBody}>You&apos;re all caught up.</Text>
      </View>
    ),
    []
  );

  if (isLoading) {
    return <LoadingView message="Loading notifications..." />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        ListEmptyComponent={empty}
        contentContainerStyle={items.length === 0 ? styles.listEmpty : styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} tintColor={colors.primary} />}
        testID="notif-list"
      />

      <View style={[styles.footer, { paddingBottom: insets.bottom + 24 }]}>
        <TouchableOpacity accessibilityRole="button" onPress={onMarkAll} style={styles.markAllBtn} testID="notif-mark-all">
          <CheckCheck size={16} color={colors.primary} />
          <Text style={styles.markAllBtnText}>Mark all read</Text>
        </TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" onPress={() => setItems([])} style={styles.clearBtn} testID="notif-clear">
          <Trash2 size={16} color={colors.error} />
          <Text style={styles.clearBtnText}>Clear all</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background 
  },
  list: { 
    padding: spacing.lg 
  },
  listEmpty: { 
    padding: spacing.lg, 
    flexGrow: 1, 
    justifyContent: 'center' 
  },
  card: { 
    marginBottom: spacing.md 
  },
  row: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: spacing.md 
  },
  iconDot: { 
    width: 10, 
    height: 10, 
    borderRadius: 5, 
    marginRight: spacing.md 
  },
  iconDotUnread: { 
    backgroundColor: colors.primary 
  },
  iconDotRead: { 
    backgroundColor: colors.border 
  },
  texts: { 
    flex: 1 
  },
  title: { 
    fontSize: fontSizes.md, 
    fontWeight: fontWeights.semibold, 
    color: colors.text 
  },
  body: { 
    fontSize: fontSizes.sm, 
    color: colors.textMuted, 
    marginTop: 2 
  },
  cta: { 
    color: colors.primary, 
    fontSize: fontSizes.sm, 
    fontWeight: fontWeights.semibold 
  },
  empty: { 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  emptyTitle: { 
    marginTop: spacing.sm, 
    fontSize: fontSizes.md, 
    color: colors.text 
  },
  emptyBody: { 
    marginTop: 2, 
    fontSize: fontSizes.sm, 
    color: colors.textMuted 
  },
  footer: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.lg, 
    borderTopWidth: 1, 
    borderTopColor: colors.border 
  },
  markAllBtn: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  markAllBtnText: { 
    color: colors.primary, 
    marginLeft: spacing.xs 
  },
  clearBtn: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  clearBtnText: { 
    color: colors.error, 
    marginLeft: spacing.xs 
  },
});