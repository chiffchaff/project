import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { Settings, Bell, CircleHelp as HelpCircle, LogOut } from 'lucide-react-native';

export default function Profile() {
  const menuItems = [
    {
      id: 'settings',
      icon: Settings,
      title: 'Settings',
      subtitle: 'App preferences and account settings',
    },
    {
      id: 'notifications',
      icon: Bell,
      title: 'Notifications',
      subtitle: 'Manage your notification preferences',
    },
    {
      id: 'help',
      icon: HelpCircle,
      title: 'Help & Support',
      subtitle: 'Get help with your account',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400' }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>Rajesh Kumar</Text>
        <Text style={styles.email}>rajesh.kumar@example.com</Text>
      </View>

      <View style={styles.menuSection}>
        {menuItems.map((item) => (
          <Pressable key={item.id} style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <item.icon size={24} color="#64748b" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.logoutButton}>
        <LogOut size={20} color="#dc2626" />
        <Text style={styles.logoutText}>Log Out</Text>
      </Pressable>

      <Text style={styles.version}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#64748b',
  },
  menuSection: {
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fee2e2',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#dc2626',
  },
  version: {
    textAlign: 'center',
    fontSize: 14,
    color: '#64748b',
    marginTop: 20,
    marginBottom: 32,
  },
});