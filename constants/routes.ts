export const ROUTES = {
  WELCOME: '/welcome',
  LANGUAGE: '/language',
  AUTH: {
    LOGIN: '/(auth)/login',
    SIGNUP: '/(auth)/signup',
    FORGOT: '/(auth)/forgot',
  },
  TABS: {
    DASHBOARD: '/(tabs)/dashboard',
    RESUME: '/(tabs)/resume',
    INTERVIEW: '/(tabs)/interview',
    TRACKER: '/(tabs)/tracker',
    CHAT: '/(tabs)/chat',
    SETTINGS: '/(tabs)/settings',
    SETTINGS_LANGUAGE: '/(tabs)/settings/language',
    SETTINGS_SUB: '/(tabs)/settings/subscription',
    SETTINGS_NOTIF: '/(tabs)/settings/notifications',
    SETTINGS_PROFILE: '/(tabs)/settings/profile',
  },
  RESOURCES: {
    HOME: '/(tabs)/resources',
    CATEGORY: (slug: string) => `/(tabs)/resources/category/${slug}`,
    DETAIL: (id: string) => `/(tabs)/resources/${id}`,
    TOOLS: '/(tabs)/resources/tools',
    TRANSLATOR: '/(tabs)/resources/tools/translator',
    NOTES: '/(tabs)/resources/tools/notes',
  },
} as const;

export type RouteKey = keyof typeof ROUTES | keyof typeof ROUTES.AUTH | keyof typeof ROUTES.TABS;