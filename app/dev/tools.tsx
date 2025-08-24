import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, Switch } from 'react-native';
import { Stack, router, useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, fontSizes, fontWeights, radius } from '@/theme/tokens';
import { Card } from '@/components/ui/Card';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useAuthContext } from '@/providers/AuthProvider';
import { healthApi } from '@/lib/api/health';
import { API_BASE } from '@/lib/api/config';
import { useLanguage } from '@/providers/LanguageProvider';
import { useNotifications } from '@/providers/NotificationsProvider';
import { trpc } from '@/lib/trpc';

const STORAGE_KEYS = {
  apiBaseOverride: 'dev_api_base_override',
  flags: 'feature_flags_overrides',
  logs: 'dev_logs_buffer',
  onboarding: 'onboarding_completed',
} as const;

function DevToolsContent() {
  const navigation = useNavigation();
  const { user, logout } = useAuthContext();
  const { currentLanguage, setLanguage } = useLanguage();
  const { token, isRegistered, registerForPush, refreshToken, removeToken } = useNotifications();

  const [pingMs, setPingMs] = useState<number | null>(null);
  const [pingError, setPingError] = useState<string | null>(null);
  const [apiBase, setApiBase] = useState<string>(API_BASE);
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [restStatus, setRestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [trpcStatus, setTrpcStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [trpcResponse, setTrpcResponse] = useState<string | null>(null);
  const [backendError, setBackendError] = useState<string | null>(null);

  useEffect(() => {
    navigation.setOptions({ headerTitle: 'Dev Tools', headerBackVisible: true } as any);
  }, [navigation]);

  useEffect(() => {
    (async () => {
      try {
        const storedFlags = await AsyncStorage.getItem(STORAGE_KEYS.flags);
        if (storedFlags) setFlags(JSON.parse(storedFlags));
        const override = await AsyncStorage.getItem(STORAGE_KEYS.apiBaseOverride);
        if (override) setApiBase(override);
      } catch (e) {
        console.warn('devtools.init.error', e);
      }
    })();
  }, []);

  const hiQuery = trpc.example.hi.useQuery({ name: 'tester' }, {
    enabled: false,
    retry: 1
  });

  const doPing = useCallback(async () => {
    setPingError(null);
    const start = Date.now();
    try {
      const res = await healthApi.ping(4000);
      setPingMs(Date.now() - start);
      Alert.alert('Ping', `OK • ${res.timestamp}`);
    } catch (e: unknown) {
      setPingMs(null);
      setPingError(String((e as Error).message ?? e));
      Alert.alert('Ping', 'Failed');
    }
  }, []);

  const checkRestEndpoint = useCallback(async () => {
    try {
      setRestStatus('loading');
      setBackendError(null);
      const response = await fetch(`${API_BASE}/api/ping`);
      if (response.ok) {
        const text = await response.text();
        console.log('REST API response:', text);
        if (text.trim().toLowerCase() === 'pong' || text.length > 0) {
          setRestStatus('success');
        } else {
          throw new Error('Unexpected response from /ping');
        }
      } else {
        throw new Error(`Status: ${response.status}`);
      }
    } catch (error) {
      setRestStatus('error');
      setBackendError(prev => `${prev ? prev + '\n\n' : ''}REST Error: ${error instanceof Error ? error.message : String(error)}`);
      console.error('REST API error:', error);
    }
  }, []);

  const checkTrpcEndpoint = useCallback(async () => {
    setTrpcStatus('loading');
    setBackendError(null);
    hiQuery.refetch();
  }, [hiQuery]);

  const retryBackendTests = useCallback(() => {
    setBackendError(null);
    setTrpcResponse(null);
    checkRestEndpoint();
    checkTrpcEndpoint();
  }, [checkRestEndpoint, checkTrpcEndpoint]);

  // Update tRPC status based on query state
  useEffect(() => {
    if (hiQuery.isSuccess) {
      setTrpcStatus('success');
      setTrpcResponse(JSON.stringify(hiQuery.data, null, 2));
    } else if (hiQuery.isError) {
      setTrpcStatus('error');
      setBackendError(prev => `${prev ? prev + '\n\n' : ''}tRPC Error: ${hiQuery.error?.message || 'Unknown error'}`);
    }
  }, [hiQuery.isSuccess, hiQuery.isError, hiQuery.data, hiQuery.error?.message]);

  const forceLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  const invalidateSession = useCallback(async () => {
    await AsyncStorage.multiRemove(['auth_token', 'refresh_token']);
    Alert.alert('Session', 'Tokens cleared');
  }, []);

  const toggleFlag = useCallback(async (key: string) => {
    const next = { ...flags, [key]: !flags[key] };
    setFlags(next);
    await AsyncStorage.setItem(STORAGE_KEYS.flags, JSON.stringify(next));
  }, [flags]);

  const clearCache = useCallback(async () => {
    await AsyncStorage.clear();
    Alert.alert('Cache', 'Cleared');
  }, []);

  const resetOnboarding = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEYS.onboarding);
    Alert.alert('Onboarding', 'Reset');
  }, []);

  const wipeLocalDb = useCallback(async () => {
    Alert.alert('Confirm', 'Wipe local DB?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Wipe', style: 'destructive', onPress: async () => {
        await AsyncStorage.clear();
        Alert.alert('Local DB', 'Wiped');
      }}
    ]);
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} testID="dev-tools">

      <Card style={styles.card}>
        <Text style={styles.h}>API & Auth</Text>
        <Text style={styles.kv}>Base: {apiBase}</Text>
        <Text style={styles.kv}>User: {user?.email ?? '—'} ({user?.id ?? '—'})</Text>
        <View style={styles.row}>
          <PrimaryButton title="Ping API" onPress={doPing} testID="btn-ping" />
          <View style={{ width: 8 }} />
          <PrimaryButton title="Invalidate session" onPress={invalidateSession} testID="btn-invalidate" />
        </View>
        <View style={styles.row}>
          <PrimaryButton title="Force logout" onPress={forceLogout} testID="btn-logout" />
        </View>
        {pingMs != null && <Text style={styles.kv}>Latency: {pingMs} ms</Text>}
        {pingError && <Text style={styles.err}>Ping error: {pingError}</Text>}
      </Card>

      <Card style={styles.card}>
        <Text style={styles.h}>Backend Connection Tests</Text>
        <View style={styles.backendTestRow}>
          <Text style={styles.kv}>REST API:</Text>
          <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(restStatus) }]} />
          <Text style={styles.kv}>{getStatusText(restStatus)}</Text>
        </View>
        <View style={styles.backendTestRow}>
          <Text style={styles.kv}>tRPC API:</Text>
          <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(trpcStatus) }]} />
          <Text style={styles.kv}>{getStatusText(trpcStatus)}</Text>
        </View>
        <View style={styles.row}>
          <PrimaryButton title="Test REST" onPress={checkRestEndpoint} testID="btn-test-rest" />
          <View style={{ width: 8 }} />
          <PrimaryButton title="Test tRPC" onPress={checkTrpcEndpoint} testID="btn-test-trpc" />
        </View>
        <View style={styles.row}>
          <PrimaryButton title="Retry All" onPress={retryBackendTests} testID="btn-retry-backend" />
        </View>
        {trpcResponse && (
          <View style={styles.responseContainer}>
            <Text style={styles.responseTitle}>tRPC Response:</Text>
            <Text style={styles.responseText}>{trpcResponse}</Text>
          </View>
        )}
        {backendError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Backend Errors:</Text>
            <Text style={styles.errorText}>{backendError}</Text>
          </View>
        )}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>API Base: {API_BASE}</Text>
          <Text style={styles.infoText}>tRPC Endpoint: {API_BASE}/api/trpc</Text>
          <Text style={styles.infoText}>REST Endpoint: {API_BASE}/api/ping</Text>
          <Text style={styles.infoText}>Platform: {Platform.OS}</Text>
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.h}>Environment</Text>
        <Text style={styles.kv}>APP_ENV: {String(process.env.EXPO_PUBLIC_APP_ENV ?? 'dev')}</Text>
        <Text style={styles.kv}>Platform: {Platform.OS}</Text>
        <Text style={styles.kv}>Build: {String((Platform as any).Version ?? '—')}</Text>
        <Text style={styles.kv}>Commit: {String((process as any).env?.EXPO_PUBLIC_GIT_SHA ?? '—')}</Text>
        <Text style={styles.kv}>Override Base URL</Text>
        <View style={styles.row}>
          <PrimaryButton title="Use LAN" onPress={async () => {
            const derived = API_BASE;
            setApiBase(derived);
            await AsyncStorage.setItem(STORAGE_KEYS.apiBaseOverride, derived);
            Alert.alert('API Base', 'LAN base applied. Restart app.');
          }} />
          <View style={{ width: 8 }} />
          <PrimaryButton title="Clear override" onPress={async () => {
            await AsyncStorage.removeItem(STORAGE_KEYS.apiBaseOverride);
            Alert.alert('API Base', 'Override cleared. Restart app.');
          }} />
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.h}>i18n</Text>
        <Text style={styles.kv}>Current: {currentLanguage}</Text>
        <View style={styles.row}>
          {(['en','es','zh','ar','pt']).map((lng) => (
            <TouchableOpacity key={lng} onPress={() => setLanguage(lng as any)} style={styles.pill} testID={`lng-${lng}`}>
              <Text style={styles.pillText}>{lng.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.h}>Permissions</Text>
        <View style={styles.row}>
          <PrimaryButton title="Request Push" onPress={registerForPush} />
          <View style={{ width: 8 }} />
          <PrimaryButton title="Refresh Token" onPress={refreshToken} />
        </View>
        <Text style={styles.kv}>Push supported: {String(Platform.OS !== 'web')}</Text>
        <Text style={styles.kv}>Registered: {String(isRegistered)}</Text>
        <Text style={styles.kv}>Token: {token ? token.slice(0, 12) + '…' : '—'}</Text>
        <View style={styles.row}>
          <PrimaryButton title="Remove Token" onPress={removeToken} />
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.h}>Feature Flags</Text>
        {Object.keys(flags).length === 0 ? (
          <Text style={styles.kv}>No overrides</Text>
        ) : (
          Object.keys(flags).map((k) => (
            <View key={k} style={styles.row}>
              <Text style={styles.kv}>{k}</Text>
              <Switch value={!!flags[k]} onValueChange={() => toggleFlag(k)} />
            </View>
          ))
        )}
      </Card>

      <Card style={styles.card}>
        <Text style={styles.h}>Cache / State</Text>
        <View style={styles.row}>
          <PrimaryButton title="Clear cache" onPress={clearCache} />
          <View style={{ width: 8 }} />
          <PrimaryButton title="Reset onboarding" onPress={resetOnboarding} />
        </View>
        <View style={styles.row}>
          <PrimaryButton title="Wipe local DB" onPress={wipeLocalDb} />
        </View>
      </Card>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

export default function DevToolsScreen() {
  // Production guard before any hooks
  if (!__DEV__ && process.env.EXPO_PUBLIC_APP_ENV === 'production') {
    router.replace('/');
    return null;
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: true }} />
      <DevToolsContent />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.lg },
  card: { padding: spacing.lg },
  h: { fontSize: fontSizes.lg, fontWeight: fontWeights.semibold, color: colors.text, marginBottom: spacing.sm },
  kv: { fontSize: fontSizes.sm, color: colors.textMuted, marginBottom: 6 },
  row: { flexDirection: 'row', alignItems: 'center' },
  pill: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.pill, backgroundColor: colors.primary + '20', marginRight: spacing.sm },
  pillText: { color: colors.primary, fontWeight: fontWeights.medium as any },
  err: { color: '#E53E3E', fontSize: fontSizes.sm, marginTop: spacing.xs },
  backendTestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 8,
  },
  responseContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#e6f7ff',
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#1890ff',
  },
  responseTitle: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    marginBottom: 8,
    color: '#0066cc',
  },
  responseText: {
    fontSize: fontSizes.xs,
    color: colors.text,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  errorContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#ffeeee',
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#ff3b30',
  },
  errorTitle: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    marginBottom: 8,
    color: '#cc0000',
  },
  errorText: {
    fontSize: fontSizes.xs,
    color: colors.text,
  },
  infoContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 6,
  },
  infoText: {
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    marginBottom: 4,
  },
});

const getStatusColor = (status: 'idle' | 'loading' | 'success' | 'error') => {
  switch (status) {
    case 'idle': return colors.textMuted;
    case 'loading': return '#f5a623';
    case 'success': return '#4cd964';
    case 'error': return '#ff3b30';
  }
};

const getStatusText = (status: 'idle' | 'loading' | 'success' | 'error') => {
  switch (status) {
    case 'idle': return 'Not tested';
    case 'loading': return 'Testing...';
    case 'success': return 'Connected';
    case 'error': return 'Failed';
  }
};
