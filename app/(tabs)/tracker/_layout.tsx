import { Stack } from 'expo-router';
import Colors from '@/constants/colors';

export default function TrackerLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="new" options={{ headerShown: false }} />
      <Stack.Screen name="[jobId]" options={{ headerShown: false }} />
    </Stack>
  );
}