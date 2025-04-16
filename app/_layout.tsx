import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen 
          name="auth" 
          options={{ 
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false,
            // Prevent going back to auth screens
            gestureEnabled: false,
          }} 
        />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
