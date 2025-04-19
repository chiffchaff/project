import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Building2, ChevronLeft, Upload } from 'lucide-react-native';
import { useAuth } from '@/contexts/auth';

type UserRole = 'owner' | 'tenant';

export default function Register() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [role, setRole] = useState<UserRole>('owner');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [occupants, setOccupants] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    try {
      setError(null);
      setLoading(true);

      // Validate email format
      if (!validateEmail(email)) {
        throw new Error('Please enter a valid email address (e.g., user@example.com)');
      }

      // Validate required fields
      if (!fullName || !email || !phone || !password) {
        throw new Error('Please fill in all required fields');
      }

      if (role === 'tenant' && !aadhaar) {
        throw new Error('Aadhaar number is required for tenants');
      }

      if (role === 'owner' && !address) {
        throw new Error('Address is required for property owners');
      }

      if (!acceptedTerms) {
        throw new Error('Please accept the terms and conditions');
      }

      // Register user
      const result = await signUp(email, password, {
        full_name: fullName,
        phone,
        role,
      });

      if (result.requiresEmailVerification) {
        setEmailVerificationSent(true);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (emailVerificationSent) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Building2 size={48} color="#2563eb" />
          <Text style={styles.title}>Verify Your Email</Text>
          <Text style={styles.subtitle}>
            We've sent a verification link to {email}. Please check your inbox and verify your email address to continue.
          </Text>
        </View>
        <Link href="/auth/login" asChild>
          <Pressable style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Return to Login</Text>
          </Pressable>
        </Link>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Link href="/auth/login" asChild>
        <Pressable style={styles.backButton}>
          <ChevronLeft size={24} color="#64748b" />
          <Text style={styles.backButtonText}>Back to Login</Text>
        </Pressable>
      </Link>

      <View style={styles.header}>
        <Building2 size={48} color="#2563eb" />
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join us to start managing your properties</Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.roleSelection}>
        <Text style={styles.label}>I am a:</Text>
        <View style={styles.roleButtons}>
          <Pressable
            style={[styles.roleButton, role === 'owner' && styles.roleButtonActive]}
            onPress={() => setRole('owner')}
          >
            <Text style={[styles.roleButtonText, role === 'owner' && styles.roleButtonTextActive]}>
              Property Owner
            </Text>
          </Pressable>
          <Pressable
            style={[styles.roleButton, role === 'tenant' && styles.roleButtonActive]}
            onPress={() => setRole('tenant')}
          >
            <Text style={[styles.roleButtonText, role === 'tenant' && styles.roleButtonTextActive]}>
              Tenant
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            autoComplete="name"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email address"
            keyboardType="email-address"
            autoComplete="email"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="+91 Enter your phone number"
            keyboardType="phone-pad"
            autoComplete="tel"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Create a strong password"
            secureTextEntry
            autoComplete="new-password"
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {role === 'owner' && (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter your complete address in Ranchi"
                multiline
                numberOfLines={3}
                value={address}
                onChangeText={setAddress}
              />
            </View>

            <Pressable style={styles.uploadButton}>
              <Upload size={20} color="#2563eb" />
              <Text style={styles.uploadButtonText}>Upload ID Proof (Optional)</Text>
            </Pressable>
          </>
        )}

        {role === 'tenant' && (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Aadhaar Number</Text>
              <TextInput
                style={styles.input}
                placeholder="XXXX-XXXX-XXXX"
                keyboardType="numeric"
                maxLength={12}
                value={aadhaar}
                onChangeText={setAadhaar}
              />
              <Text style={styles.helperText}>
                Your Aadhaar number will be securely verified through DigiLocker
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Number of Occupants</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter number of people"
                keyboardType="numeric"
                value={occupants}
                onChangeText={setOccupants}
              />
            </View>
          </>
        )}

        <Pressable
          style={styles.termsCheckbox}
          onPress={() => setAcceptedTerms(!acceptedTerms)}
        >
          <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]} />
          <Text style={styles.checkboxLabel}>
            I agree to the Terms of Service and Privacy Policy
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.submitButton,
            (loading || !acceptedTerms) && styles.submitButtonDisabled,
          ]}
          onPress={handleRegister}
          disabled={loading || !acceptedTerms}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#64748b',
    marginLeft: 8,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
  },
  roleSelection: {
    marginBottom: 24,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  roleButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  roleButtonActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  roleButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748b',
  },
  roleButtonTextActive: {
    color: '#fff',
  },
  form: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  helperText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  uploadButtonText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '500',
  },
  termsCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    color: '#64748b',
  },
  submitButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});