import { useEffect } from 'react';
import { Redirect, router } from 'expo-router';

export default function Auth() {
  useEffect(() => {
    // Navigate to login screen
    router.replace('/auth/login');
  }, []);

  return null;
}