import { Stack } from 'expo-router';

export default function InterviewLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen 
        name="mock" 
        options={{ 
          headerShown: true,
          gestureEnabled: true,
        }} 
      />
      <Stack.Screen 
        name="video" 
        options={{ 
          headerShown: true,
          gestureEnabled: true,
        }} 
      />
      <Stack.Screen 
        name="questions" 
        options={{ 
          headerShown: true,
          gestureEnabled: true,
        }} 
      />
      <Stack.Screen 
        name="feedback" 
        options={{ 
          headerShown: true,
          gestureEnabled: true,
        }} 
      />
      <Stack.Screen 
        name="general" 
        options={{ 
          headerShown: true,
          gestureEnabled: true,
        }} 
      />
    </Stack>
  );
}