import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '@/store/auth';

export default function AuthLayout() {
  const router = useRouter();
  const segments = useSegments();
  const token = useAuthStore(state => state.token);
  const isLoading = useAuthStore(state => state.isLoading);

  useEffect(() => {
    if (!isLoading && token) {
      router.replace('/(tabs)');
    }
  }, [isLoading, token]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    />
  );
}