import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { CircleCheck as CheckCircle2 } from 'lucide-react-native';

export default function Agreement() {
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);

  const handleContinue = () => {
    if (accepted) {
      router.push('/onboarding/payment-setup');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.heading}>Rental Agreement</Text>
          <Text style={styles.date}>Date: {new Date().toLocaleDateString()}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Parties</Text>
            <Text style={styles.paragraph}>
              This Rental Agreement is made between Property Owner (Landlord) and Tenant for the rental property located at Green Valley Apartments, Harmu Housing Colony, Ranchi.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Term</Text>
            <Text style={styles.paragraph}>
              The lease term is for 11 months, beginning from the date of occupancy.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Rent and Deposits</Text>
            <Text style={styles.paragraph}>
              - Monthly Rent: ₹15,000{'\n'}
              - Security Deposit: ₹30,000{'\n'}
              - Rent Due Date: 5th of every month{'\n'}
              - Late Fee: ₹100 per day after due date
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Utilities and Services</Text>
            <Text style={styles.paragraph}>
              The following utilities are included in the rent:{'\n'}
              - Water Supply{'\n'}
              - Electricity (up to 200 units){'\n'}
              - Wi-Fi Internet
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Occupancy</Text>
            <Text style={styles.paragraph}>
              Maximum number of occupants: 4 persons{'\n'}
              All occupants must be registered with the property management.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Maintenance</Text>
            <Text style={styles.paragraph}>
              Tenant is responsible for routine maintenance and keeping the property clean. Major repairs will be handled by the landlord.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={styles.acceptanceButton}
          onPress={() => setAccepted(!accepted)}
        >
          <View style={[styles.checkbox, accepted && styles.checkboxChecked]}>
            {accepted && <CheckCircle2 size={20} color="#fff" />}
          </View>
          <Text style={styles.acceptanceText}>
            I have read and agree to the terms of the rental agreement
          </Text>
        </Pressable>

        <Pressable
          style={[styles.continueButton, !accepted && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!accepted}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 24,
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  acceptanceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  acceptanceText: {
    flex: 1,
    fontSize: 14,
    color: '#1e293b',
  },
  continueButton: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});