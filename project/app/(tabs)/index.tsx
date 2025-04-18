import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { IndianRupee, ArrowUpRight, Users, Building } from 'lucide-react-native';

export default function Dashboard() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>नमस्ते, Rajesh</Text>
        <Text style={styles.location}>Ranchi, Jharkhand</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <IndianRupee size={20} color="#2563eb" />
            <Text style={styles.statTitle}>Total Collection</Text>
          </View>
          <Text style={styles.statAmount}>₹45,000</Text>
          <Text style={styles.statPeriod}>This Month</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <ArrowUpRight size={20} color="#16a34a" />
            <Text style={styles.statTitle}>Due Payments</Text>
          </View>
          <Text style={styles.statAmount}>₹12,000</Text>
          <Text style={styles.statPeriod}>5 Tenants</Text>
        </View>
      </View>

      <View style={styles.quickStats}>
        <View style={styles.quickStatCard}>
          <Users size={24} color="#2563eb" />
          <Text style={styles.quickStatNumber}>24</Text>
          <Text style={styles.quickStatLabel}>Total Tenants</Text>
        </View>
        <View style={styles.quickStatCard}>
          <Building size={24} color="#2563eb" />
          <Text style={styles.quickStatNumber}>8</Text>
          <Text style={styles.quickStatLabel}>Properties</Text>
        </View>
      </View>

      <View style={styles.recentActivity}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {[1, 2, 3].map((item) => (
          <Pressable key={item} style={styles.activityItem}>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Rent Collected</Text>
              <Text style={styles.activityAmount}>₹15,000</Text>
            </View>
            <Text style={styles.activityMeta}>Flat 301, Green Valley • 2 days ago</Text>
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1e293b',
  },
  location: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
  },
  statsContainer: {
    padding: 20,
    flexDirection: 'row',
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  statTitle: {
    fontSize: 14,
    color: '#64748b',
  },
  statAmount: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1e293b',
  },
  statPeriod: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  quickStats: {
    flexDirection: 'row',
    padding: 20,
    gap: 16,
  },
  quickStatCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  quickStatNumber: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 8,
  },
  quickStatLabel: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  recentActivity: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  activityItem: {
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
  activityContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
  },
  activityAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#16a34a',
  },
  activityMeta: {
    fontSize: 14,
    color: '#64748b',
  },
});