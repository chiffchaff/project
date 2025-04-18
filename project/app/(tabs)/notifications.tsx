import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Bell, CircleCheck as CheckCircle2, CircleAlert as AlertCircle, Clock } from 'lucide-react-native';

export default function Notifications() {
  const notifications = [
    {
      id: 1,
      title: 'Rent Payment Received',
      message: 'Amit Kumar has paid rent for Green Valley, Flat 301',
      type: 'success',
      time: '2 hours ago',
    },
    {
      id: 2,
      title: 'Rent Due Reminder',
      message: 'Rent payment for Sunrise Residency, Flat 202 is due in 3 days',
      type: 'warning',
      time: '5 hours ago',
    },
    {
      id: 3,
      title: 'New Tenant Application',
      message: 'Priya Singh has applied for Green Valley, Flat 404',
      type: 'info',
      time: '1 day ago',
    },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={24} color="#16a34a" />;
      case 'warning':
        return <AlertCircle size={24} color="#eab308" />;
      case 'info':
        return <Clock size={24} color="#2563eb" />;
      default:
        return <Bell size={24} color="#64748b" />;
    }
  };

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'success':
        return styles.successBg;
      case 'warning':
        return styles.warningBg;
      case 'info':
        return styles.infoBg;
      default:
        return {};
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        <Pressable style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear All</Text>
        </Pressable>
      </View>

      <View style={styles.notificationList}>
        {notifications.map((notification) => (
          <Pressable key={notification.id} style={styles.notificationCard}>
            <View style={[styles.iconContainer, getNotificationStyle(notification.type)]}>
              {getNotificationIcon(notification.type)}
            </View>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>{notification.title}</Text>
              <Text style={styles.notificationMessage}>{notification.message}</Text>
              <Text style={styles.notificationTime}>{notification.time}</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1e293b',
  },
  clearButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  clearButtonText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
  },
  notificationList: {
    padding: 20,
  },
  notificationCard: {
    flexDirection: 'row',
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
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  successBg: {
    backgroundColor: '#dcfce7',
  },
  warningBg: {
    backgroundColor: '#fef9c3',
  },
  infoBg: {
    backgroundColor: '#dbeafe',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: '#94a3b8',
  },
});