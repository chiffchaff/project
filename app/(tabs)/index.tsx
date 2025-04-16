import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { IndianRupee, ArrowUpRight, Users, Building } from 'lucide-react-native';
import { useAuthStore } from '@/store/auth';

export default function Dashboard() {
  const { user } = useAuthStore();
  const isOwner = user?.role === 'owner';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>नमस्ते, {user?.name}</Text>
        <Text style={styles.role}>{isOwner ? 'Property Owner' : 'Tenant'}</Text>
      </View>

      {isOwner ? (
        <>
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
        </>
      ) : (
        <View style={styles.tenantDashboard}>
          <View style={styles.tenantCard}>
            <Text style={styles.tenantCardTitle}>Current Rent</Text>
            <Text style={styles.tenantCardAmount}>₹15,000</Text>
            <Text style={styles.tenantCardDueDate}>Due on 1st May 2024</Text>
          </View>
          
          <View style={styles.tenantCard}>
            <Text style={styles.tenantCardTitle}>Property</Text>
            <Text style={styles.tenantPropertyName}>Green Valley Apartments</Text>
            <Text style={styles.tenantPropertyAddress}>Flat 301, Harmu Housing Colony</Text>
          </View>
        </View>
      )}

      <View style={styles.recentActivity}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {[1, 2, 3].map((item) => (
          <Pressable key={item} style={styles.activityItem}>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>
                {isOwner ? 'Rent Collected' : 'Rent Paid'}
              </Text>
              <Text style={styles.activityAmount}>₹15,000</Text>
            </View>
            <Text style={styles.activityMeta}>
              {isOwner ? 'Flat 301, Green Valley • 2 days ago' : '1st March 2024'}
            </Text>
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
  role: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
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
  tenantDashboard: {
    padding: 20,
    gap: 16,
  },
  tenantCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tenantCardTitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  tenantCardAmount: {
    fontSize: 32,
    fontWeight: '600',
    color: '#1e293b',
  },
  tenantCardDueDate: {
    fontSize: 14,
    color: '#ef4444',
    marginTop: 4,
  },
  tenantPropertyName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  tenantPropertyAddress: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
});