import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { IndianRupee, CircleCheck as CheckCircle2, Circle as XCircle, Clock } from 'lucide-react-native';

export default function Payments() {
  const payments = [
    {
      id: 1,
      tenant: 'Amit Kumar',
      property: 'Green Valley, Flat 301',
      amount: '₹15,000',
      status: 'paid',
      date: '15 Mar 2024',
    },
    {
      id: 2,
      tenant: 'Priya Singh',
      property: 'Sunrise Residency, Flat 202',
      amount: '₹12,000',
      status: 'pending',
      date: 'Due: 20 Mar 2024',
    },
    {
      id: 3,
      tenant: 'Rahul Sharma',
      property: 'Green Valley, Flat 404',
      amount: '₹18,000',
      status: 'overdue',
      date: 'Due: 10 Mar 2024',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle2 size={20} color="#16a34a" />;
      case 'pending':
        return <Clock size={20} color="#eab308" />;
      case 'overdue':
        return <XCircle size={20} color="#dc2626" />;
      default:
        return null;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'paid':
        return styles.statusPaid;
      case 'pending':
        return styles.statusPending;
      case 'overdue':
        return styles.statusOverdue;
      default:
        return {};
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Rent Payments</Text>
        <Pressable style={styles.addButton}>
          <Text style={styles.addButtonText}>Record Payment</Text>
        </Pressable>
      </View>

      <View style={styles.summary}>
        <View style={styles.summaryCard}>
          <IndianRupee size={20} color="#2563eb" />
          <Text style={styles.summaryAmount}>₹45,000</Text>
          <Text style={styles.summaryLabel}>Collected this month</Text>
        </View>
        <View style={styles.summaryCard}>
          <IndianRupee size={20} color="#dc2626" />
          <Text style={styles.summaryAmount}>₹30,000</Text>
          <Text style={styles.summaryLabel}>Pending collection</Text>
        </View>
      </View>

      <View style={styles.paymentsContainer}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {payments.map((payment) => (
          <Pressable key={payment.id} style={styles.paymentCard}>
            <View style={styles.paymentHeader}>
              <View style={styles.tenantInfo}>
                <Text style={styles.tenantName}>{payment.tenant}</Text>
                <Text style={styles.propertyName}>{payment.property}</Text>
              </View>
              <Text style={styles.paymentAmount}>{payment.amount}</Text>
            </View>
            <View style={styles.paymentFooter}>
              <View style={[styles.statusBadge, getStatusStyle(payment.status)]}>
                {getStatusIcon(payment.status)}
                <Text style={[styles.statusText, getStatusStyle(payment.status)]}>
                  {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                </Text>
              </View>
              <Text style={styles.paymentDate}>{payment.date}</Text>
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
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1e293b',
  },
  addButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  summary: {
    padding: 20,
    flexDirection: 'row',
    gap: 16,
  },
  summaryCard: {
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
  summaryAmount: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  paymentsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  paymentCard: {
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
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tenantInfo: {
    flex: 1,
  },
  tenantName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
  },
  propertyName: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  paymentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusPaid: {
    backgroundColor: '#dcfce7',
    color: '#16a34a',
  },
  statusPending: {
    backgroundColor: '#fef9c3',
    color: '#eab308',
  },
  statusOverdue: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
  },
  paymentDate: {
    fontSize: 14,
    color: '#64748b',
  },
});