import { Stack } from 'expo-router';
import Colors from '@/constants/colors';

export default function ResumeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="create" options={{ headerShown: false }} />
      <Stack.Screen name="[resumeId]/edit" options={{ headerShown: false }} />
    </Stack>
  );
}