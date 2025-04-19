import { Stack } from 'expo-router';

export default function PropertyLayout() {
  return (
    <Stack
      screenOptions={{
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
        name="[id]"
        options={{
          title: 'Property Details',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="add"
        options={{
          title: 'Add Property',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="edit/[id]"
        options={{
          title: 'Edit Property',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="amenities/[id]"
        options={{
          title: 'Manage Amenities',
          headerBackTitle: 'Back',
        }}
      />
    </Stack>
  );
}