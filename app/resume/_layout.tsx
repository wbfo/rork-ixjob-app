import { Stack } from 'expo-router';

export default function ResumeLayout() {
  return (
    <Stack screenOptions={{ headerBackTitle: 'Back' }}>
      <Stack.Screen name="ai-start" options={{ headerShown: true }} />
    </Stack>
  );
}