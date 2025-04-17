import { useEffect, useCallback } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '@/store/auth';
import LoadingScreen from '@/components/LoadingScreen';

export default function RootLayout() {
  const token = useAuthStore(state => state.token);
  const isLoading = useAuthStore(state => state.isLoading);
  const loadStoredAuth = useAuthStore(state => state.loadStoredAuth);

  useEffect(() => {
    loadStoredAuth();
  }, [loadStoredAuth]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen 
          name="auth" 
          redirect={!!token} 
        />
        <Stack.Screen 
          name="(tabs)" 
          redirect={!token}
        />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
