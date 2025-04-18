import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { CreditCard, IndianRupee, QrCode } from 'lucide-react-native';

export default function PaymentSetup() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'bank' | null>(null);

  const handleComplete = () => {
    if (paymentMethod) {
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.description}>
          Set up your preferred payment method for hassle-free rent payments. Your payment information is securely encrypted.
        </Text>

        <View style={styles.paymentMethods}>
          <Pressable
            style={[styles.methodCard, paymentMethod === 'upi' && styles.methodCardSelected]}
            onPress={() => setPaymentMethod('upi')}
          >
            <View style={styles.methodIcon}>
              <QrCode size={24} color="#2563eb" />
            </View>
            <View style={styles.methodInfo}>
              <Text style={styles.methodTitle}>UPI Payment</Text>
              <Text style={styles.methodDescription}>Pay using any UPI app</Text>
            </View>
          </Pressable>

          <Pressable
            style={[styles.methodCard, paymentMethod === 'bank' && styles.methodCardSelected]}
            onPress={() => setPaymentMethod('bank')}
          >
            <View style={styles.methodIcon}>
              <CreditCard size={24} color="#2563eb" />
            </View>
            <View style={styles.methodInfo}>
              <Text style={styles.methodTitle}>Bank Account</Text>
              <Text style={styles.methodDescription}>Direct bank transfer</Text>
            </View>
          </Pressable>
        </View>

        {paymentMethod === 'upi' && (
          <View style={styles.formSection}>
            <Text style={styles.formTitle}>UPI Details</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>UPI ID</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your UPI ID"
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
          </View>
        )}

        {paymentMethod === 'bank' && (
          <View style={styles.formSection}>
            <Text style={styles.formTitle}>Bank Account Details</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Account Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter account number"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>IFSC Code</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter IFSC code"
                autoCapitalize="characters"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Account Holder Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter account holder name"
              />
            </View>
          </View>
        )}

        <View style={styles.rentSummary}>
          <Text style={styles.summaryTitle}>Payment Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Monthly Rent</Text>
            <Text style={styles.summaryValue}>₹15,000</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Due Date</Text>
            <Text style={styles.summaryValue}>5th of every month</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>First Payment</Text>
            <Text style={styles.summaryValue}>₹45,000</Text>
          </View>
          <Text style={styles.summaryNote}>
            Includes first month's rent (₹15,000) and security deposit (₹30,000)
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.completeButton, !paymentMethod && styles.completeButtonDisabled]}
          onPress={handleComplete}
          disabled={!paymentMethod}
        >
          <IndianRupee size={20} color="#fff" />
          <Text style={styles.completeButtonText}>Complete Setup</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  description: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 24,
    lineHeight: 24,
  },
  paymentMethods: {
    gap: 16,
    marginBottom: 24,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  methodCardSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#f8fafc',
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 14,
    color: '#64748b',
  },
  formSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1e293b',
  },
  rentSummary: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  summaryNote: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 8,
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  completeButton: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  completeButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});