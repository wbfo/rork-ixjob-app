import Constants from 'expo-constants';
import { Platform } from 'react-native';

const DEFAULT_PORT = 3001 as const;

function getDebuggerHost(): string | null {
  const anyConstants: any = Constants as any;
  const host: string | undefined =
    anyConstants?.expoGoConfig?.debuggerHost ||
    anyConstants?.expoConfig?.hostUri ||
    anyConstants?.manifest2?.extra?.expoClient?.hostUri ||
    anyConstants?.manifest?.debuggerHost;
  return host ?? null;
}

function resolveLanBase(): string | null {
  const host = getDebuggerHost();
  if (!host) return null;
  const hostPart = host.split(':')[0];
  if (!hostPart || hostPart === 'localhost' || hostPart === '127.0.0.1') return null;
  return `http://${hostPart}:${DEFAULT_PORT}`;
}

function sanitizeEnvBaseForPlatform(envBase: string | undefined | null): string | null {
  if (!envBase) return null;
  if (Platform.OS === 'web') return envBase;
  try {
    const url = new URL(envBase);
    const isLocalhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
    if (isLocalhost) {
      const lan = resolveLanBase();
      if (lan) return lan;
    }
    return envBase;
  } catch (_e) {
    return envBase;
  }
}

const getApiBase = (): string => {
  const rawEnv = (Constants.expoConfig as any)?.extra?.EXPO_PUBLIC_API_BASE || process.env.EXPO_PUBLIC_API_BASE;
  const envApiBase = sanitizeEnvBaseForPlatform(typeof rawEnv === 'string' ? rawEnv : null);

  if (envApiBase) return envApiBase;

  if (__DEV__) {
    if (Platform.OS === 'web') {
      return `http://localhost:${DEFAULT_PORT}`;
    }
    const lan = resolveLanBase();
    if (lan) return lan;
    return `http://localhost:${DEFAULT_PORT}`;
  }

  throw new Error('EXPO_PUBLIC_API_BASE environment variable is required');
};

export const API_BASE = getApiBase();

export const API_ENDPOINTS = {
  health: '/health',
  ready: '/ready',
  ping: '/ping',
  login: '/api/auth/login',
  signup: '/api/auth/signup',
  logout: '/api/auth/logout',
  refresh: '/api/auth/refresh',
  profile: '/api/user/profile',
  resumes: '/api/resumes',
  jobs: '/api/jobs',
  interviews: '/api/interviews',
  notes: '/api/notes',
  resources: '/api/resources',
  chat: '/api/ai/chat',
  generateImage: '/api/ai/image',
  transcribe: '/api/ai/transcribe',
} as const;

export const createApiUrl = (endpoint: string): string => `${API_BASE}${endpoint}`;

if (__DEV__) {
  const rawEnv = (Constants.expoConfig as any)?.extra?.EXPO_PUBLIC_API_BASE || process.env.EXPO_PUBLIC_API_BASE;
  console.log('🔗 API Configuration:');
  console.log(`   Base URL: ${API_BASE}`);
  console.log(`   Platform: ${Platform.OS}`);
  console.log(`   Environment: ${__DEV__ ? 'development' : 'production'}`);
  if (!rawEnv && Platform.OS !== 'web') {
    console.warn('⚠️  EXPO_PUBLIC_API_BASE not set - derived LAN IP. If this is wrong, set app/.env EXPO_PUBLIC_API_BASE=http://YOUR_COMPUTER_IP:3001');
  }
}