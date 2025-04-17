import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '@/store/auth';
import LoadingScreen from '@/components/LoadingScreen';
import '../config/firebase'; // Ensure Firebase is initialized first

export default function RootLayout() {
  const isLoading = useAuthStore(state => state.isLoading);
  const loadStoredAuth = useAuthStore(state => state.loadStoredAuth);

  useEffect(() => {
    loadStoredAuth().catch(error => {
      console.error('Failed to load auth state:', error);
    });
  }, [loadStoredAuth]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Stack screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
