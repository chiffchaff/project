import { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '@/store/auth';
import LoadingScreen from '@/components/LoadingScreen';

export default function RootLayout() {
  const { token, isLoading, error, loadStoredAuth } = useAuthStore();

  useEffect(() => {
    loadStoredAuth();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      // Redirect based on auth state
      if (!token) {
        router.replace('/auth');
      } else {
        router.replace('/(tabs)');
      }
    }
  }, [isLoading, token]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
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
