import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, trpcClient } from "@/lib/trpc";
import { Stack, usePathname, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider, useAuthContext } from "@/providers/AuthProvider";
import { LanguageProvider } from "@/providers/LanguageProvider";
import { DashboardLayoutProvider } from "@/state/useDashboardLayout";
import { GradientBackground } from "@/theme/GradientBackground";
import { colors } from '@/theme/tokens';
import '@/i18n';
import { NotificationsProvider } from "@/providers/NotificationsProvider";
import AppTopBar from "@/components/AppTopBar";
import { FloatingChatBubble } from "@/components/FloatingChatBubble";
import { ChatContent } from "@/components/ChatContent";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const mapRouteToTitle = (name: string) => {
  // Handle specific route mappings
  const routeMap: Record<string, string> = {
    'dashboard': 'Dashboard',
    'resume': 'Resume',
    'interview': 'Interview',
    'tracker': 'Jobs',
    'resources': 'Resources',
    'community': 'Community',
    'profile': 'Profile',
    'settings': 'Settings',
    'notifications': 'Notifications',
    'dev': 'Dev Tools',
  };
  
  // Extract the main route name
  const routeName = name.includes('(tabs)') 
    ? name.split('/(tabs)/')[1]?.split('/')[0] || name.split('/').pop()
    : name.split('/').pop();
    
  if (routeName && routeMap[routeName]) {
    return routeMap[routeName];
  }
  
  // Fallback to pretty formatting
  const pretty = routeName?.replace(/[-_]/g, ' ') ?? 'ixJOB';
  return pretty
    .split(' ')
    .map(w => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');
};

function RootLayoutNav() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuthContext();
  const hideChat = pathname === '/welcome' || pathname === '/' || pathname === '/language' || pathname.startsWith('/(auth)');

  useEffect(() => {
    if (isAuthenticated) {
      if (pathname === '/' || pathname.startsWith('/(auth)') || pathname === '/welcome' || pathname === '/language' || pathname === '/index') {
        router.replace('/(tabs)/dashboard');
      }
    } else {
      if (pathname.startsWith('/(tabs)') || pathname === '/profile' || pathname === '/settings' || pathname === '/notifications') {
        router.replace('/welcome');
      }
    }
  }, [isAuthenticated, pathname]);

  return (
    <GradientBackground>
      {isAuthenticated ? (
        <Stack
          screenOptions={{
            headerShown: true,
            headerBackVisible: true,
            header: ({ options, route, navigation }) => (
              <AppTopBar
                title={typeof options.title === 'string' ? options.title : mapRouteToTitle(route.name)}
                onPressBell={() => navigation.navigate('notifications' as never)}
                onPressProfile={() => navigation.navigate('profile' as never)}
              />
            ),
            freezeOnBlur: false,
            headerTransparent: false,
            contentStyle: { backgroundColor: 'transparent' },
            headerTintColor: colors.text,
            gestureEnabled: true,
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: true }} />
          <Stack.Screen name="resume" options={{ headerShown: true }} />
          <Stack.Screen
            name="settings"
            options={{
              headerShown: true,
              gestureEnabled: true,
            }}
          />
          <Stack.Screen name="profile" options={{ headerShown: true }} />
          <Stack.Screen name="notifications" options={{ headerShown: true }} />
          <Stack.Screen name="community" options={{ headerShown: true }} />
          <Stack.Screen name="dev" options={{ headerShown: true }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      ) : (
        <Stack
          screenOptions={{
            headerShown: true,
            headerBackVisible: true,
            header: ({ options, route, navigation }) => (
              <AppTopBar
                title={typeof options.title === 'string' ? options.title : mapRouteToTitle(route.name)}
                onPressBell={() => navigation.navigate('notifications' as never)}
                onPressProfile={() => navigation.navigate('profile' as never)}
              />
            ),
            freezeOnBlur: false,
            headerTransparent: false,
            contentStyle: { backgroundColor: 'transparent' },
            headerTintColor: colors.text,
            gestureEnabled: true,
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="language" options={{ headerShown: false }} />
          <Stack.Screen name="welcome" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      )}
      {!hideChat && (
        <FloatingChatBubble>
          <ChatContent />
        </FloatingChatBubble>
      )}
    </GradientBackground>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
        <AuthProvider>
          <DashboardLayoutProvider>
            <NotificationsProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <RootLayoutNav />
              </GestureHandlerRootView>
            </NotificationsProvider>
          </DashboardLayoutProvider>
        </AuthProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}