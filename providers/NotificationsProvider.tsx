import { useCallback, useEffect, useMemo, useState } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import { Platform } from 'react-native';

import Constants from 'expo-constants';

const isExpoGo = (Constants?.appOwnership ?? undefined) === 'expo';
const isPushSupported = Platform.OS !== 'web' && !isExpoGo;

export type NotifCategory = 'job' | 'resume' | 'interview' | 'community' | 'system';
export type NotifChannel = 'push' | 'inapp';

export interface NotifPrefPerCategory {
  push: boolean;
  inapp: boolean;
  dailyCap: number;
}

export interface NotificationPreferences {
  categories: Record<NotifCategory, NotifPrefPerCategory>;
  quietHours: { start: string; end: string };
}

export interface InAppNotification {
  id: string;
  title: string;
  body: string;
  category: NotifCategory;
  createdAt: string;
  read: boolean;
}

export interface NotificationsContextValue {
  token: string | null;
  isRegistered: boolean;
  preferences: NotificationPreferences;
  inapp: InAppNotification[];
  requestPermissions: () => Promise<boolean>;
  registerForPush: () => Promise<void>;
  refreshToken: () => Promise<void>;
  removeToken: () => Promise<void>;
  setPreferences: (p: NotificationPreferences) => void;
  enqueueInApp: (n: InAppNotification) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
}

export const [NotificationsProvider, useNotifications] = createContextHook<NotificationsContextValue>(() => {
  const [token, setToken] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [inapp, setInapp] = useState<InAppNotification[]>([]);
  const [preferences, setPreferencesState] = useState<NotificationPreferences>({
    categories: {
      job: { push: true, inapp: true, dailyCap: 5 },
      resume: { push: true, inapp: true, dailyCap: 5 },
      interview: { push: true, inapp: true, dailyCap: 5 },
      community: { push: true, inapp: true, dailyCap: 10 },
      system: { push: true, inapp: true, dailyCap: 3 },
    },
    quietHours: { start: '21:00', end: '08:00' },
  });

  const setPreferences = useCallback((p: NotificationPreferences) => setPreferencesState(p), []);

  const requestPermissions = useCallback(async () => {
    try {
      if (!isPushSupported) {
        console.warn('Push notifications are not available in Expo Go. Use a development build.');
        return false;
      }
      const Notifications = await import('expo-notifications');
      const { status } = await Notifications.requestPermissionsAsync();
      console.log('notif_permission_status', status);
      const granted = status === 'granted';
      console.log(granted ? 'notif_permission_granted' : 'notif_permission_denied');
      return granted;
    } catch (e) {
      console.error('notifications.requestPermissions.error', e);
      return false;
    }
  }, []);

  const registerForPush = useCallback(async () => {
    try {
      if (!isPushSupported) {
        console.warn('registerForPush skipped: Not supported in Expo Go.');
        setToken(null);
        setIsRegistered(false);
        return;
      }
      const granted = await requestPermissions();
      if (!granted) return;
      const Notifications = await import('expo-notifications');
      const projectId: string | undefined = (Constants?.expoConfig as any)?.extra?.eas?.projectId ?? (Constants as any)?.easConfig?.projectId;
      if (!projectId) {
        console.warn('notifications.projectId.missing: Add extra.eas.projectId to app.json to fetch Expo push token.');
      }
      const tokenRes = await Notifications.getExpoPushTokenAsync(projectId ? { projectId } : undefined);
      const value = tokenRes?.data ?? null;
      console.log('notif_token_registered', value);
      setToken(value);
      setIsRegistered(!!value);
      // TODO: send to backend when available
    } catch (e) {
      console.error('notifications.register.error', e);
    }
  }, [requestPermissions]);

  const refreshToken = useCallback(async () => {
    await registerForPush();
  }, [registerForPush]);

  useEffect(() => {
    if (isPushSupported) {
      registerForPush().catch((e) => console.warn('notifications.autoRegister.error', e));
    }
  }, [registerForPush]);

  const removeToken = useCallback(async () => {
    try {
      setToken(null);
      setIsRegistered(false);
      // TODO: inform backend to remove token
    } catch (e) {
      console.error('notifications.removeToken.error', e);
    }
  }, []);

  const enqueueInApp = useCallback((n: InAppNotification) => {
    setInapp(prev => [n, ...prev]);
  }, []);

  const markRead = useCallback((id: string) => {
    setInapp(prev => prev.map(x => (x.id === id ? { ...x, read: true } : x)));
  }, []);

  const markAllRead = useCallback(() => {
    setInapp(prev => prev.map(x => ({ ...x, read: true })));
  }, []);

  useEffect(() => {
    let sub: { remove: () => void } | null = null;
    if (isPushSupported) {
      import('expo-notifications')
        .then(async (Notifications) => {
          Notifications.setNotificationHandler({
            handleNotification: async () => ({
              shouldShowAlert: true,
              shouldPlaySound: false,
              shouldSetBadge: false,
              // iOS web types in SDK 53 include these fields
              shouldShowBanner: true,
              shouldShowList: true,
            }),
          });
          if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
              name: 'Default',
              importance: Notifications.AndroidImportance.DEFAULT,
            }).catch((e: unknown) => console.warn('notifications.channel.error', e));
          }
          sub = Notifications.addNotificationResponseReceivedListener((res) => {
            console.log('notif_opened', res);
          });
        })
        .catch((e) => console.warn('notifications.listener.init.error', e));
    }
    return () => {
      if (sub) sub.remove();
    };
  }, []);

  const value = useMemo<NotificationsContextValue>(() => ({
    token,
    isRegistered,
    preferences,
    inapp,
    requestPermissions,
    registerForPush,
    refreshToken,
    removeToken,
    setPreferences,
    enqueueInApp,
    markRead,
    markAllRead,
  }), [enqueueInApp, inapp, isRegistered, markAllRead, markRead, preferences, registerForPush, removeToken, requestPermissions, setPreferences, token, refreshToken]);

  return value;
});

export function useInAppNotifications() {
  const { inapp } = useNotifications();
  return inapp;
}