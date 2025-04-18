import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerShadowVisible: false,
        headerTitleStyle: {
          color: '#1e293b',
          fontSize: 18,
          fontWeight: '600',
        },
        headerTintColor: '#64748b',
      }}
    >
      <Stack.Screen
        name="property-selection"
        options={{
          title: 'Select Property',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="agreement"
        options={{
          title: 'Rental Agreement',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="payment-setup"
        options={{
          title: 'Payment Setup',
          headerBackTitle: 'Back',
        }}
      />
    </Stack>
  );
}