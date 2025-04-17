import { useEffect } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { Chrome as Home, Building2, Receipt, CircleUser as UserCircle2 } from 'lucide-react-native';
import { useAuthStore } from '@/store/auth';

export default function TabLayout() {
  const router = useRouter();
  const { token, isLoading, user } = useAuthStore(state => ({
    token: state.token,
    isLoading: state.isLoading,
    user: state.user
  }));
  const isOwner = user?.role === 'owner';

  useEffect(() => {
    if (!isLoading && !token) {
      router.replace('/auth');
    }
  }, [isLoading, token]);

  if (!token) return null;

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#e5e5e5',
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#64748b',
        headerShown: true,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      {isOwner && (
        <Tabs.Screen
          name="properties"
          options={{
            title: 'Properties',
            tabBarIcon: ({ color, size }) => <Building2 size={size} color={color} />,
          }}
        />
      )}
      <Tabs.Screen
        name="payments"
        options={{
          title: isOwner ? 'Collections' : 'Payments',
          tabBarIcon: ({ color, size }) => <Receipt size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <UserCircle2 size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}