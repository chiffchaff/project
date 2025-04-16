import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import * as validation from '@/utils/validation';
import { useAuthStore } from '@/store/auth';

export default function Login() {
  const signIn = useAuthStore(state => state.signIn);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'owner' | 'tenant' | null>(null);
  const [errors, setErrors] = useState({ 
    email: '', 
    password: '',
    role: '',
    form: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors = { email: '', password: '', role: '', form: '' };
    let isValid = true;

    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!validation.validateEmail(email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    if (!role) {
      newErrors.role = 'Please select your role';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    if (!role) return;

    try {
      setIsLoading(true);
      setErrors({ email: '', password: '', role: '', form: '' });
      await signIn(email, password, role);
      // Navigation will be handled by the root layout
    } catch (error: any) {
      const message = error?.message || 'Something went wrong. Please try again.';
      setErrors(prev => ({ ...prev, form: message }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.roleSelector}>
          <Text style={styles.label}>Login as:</Text>
          <View style={styles.roleButtons}>
            <Pressable
              style={[
                styles.roleButton,
                role === 'owner' && styles.roleButtonActive,
              ]}
              onPress={() => {
                setRole('owner');
                setErrors(prev => ({ ...prev, role: '' }));
              }}
            >
              <Text style={[
                styles.roleButtonText,
                role === 'owner' && styles.roleButtonTextActive
              ]}>Property Owner</Text>
            </Pressable>
            <Pressable
              style={[
                styles.roleButton,
                role === 'tenant' && styles.roleButtonActive,
              ]}
              onPress={() => {
                setRole('tenant');
                setErrors(prev => ({ ...prev, role: '' }));
              }}
            >
              <Text style={[
                styles.roleButtonText,
                role === 'tenant' && styles.roleButtonTextActive
              ]}>Tenant</Text>
            </Pressable>
          </View>
          {errors.role ? <Text style={styles.errorText}>{errors.role}</Text> : null}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, errors.email ? styles.inputError : null]}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setErrors(prev => ({ ...prev, email: '', form: '' }));
            }}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={[styles.input, errors.password ? styles.inputError : null]}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setErrors(prev => ({ ...prev, password: '', form: '' }));
            }}
            placeholder="Enter your password"
            secureTextEntry
            editable={!isLoading}
          />
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
        </View>

        <Pressable 
          style={styles.forgotPassword} 
          onPress={() => router.push('./forgot-password')}
          disabled={isLoading}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </Pressable>

        {errors.form ? (
          <Text style={[styles.errorText, styles.formError]}>{errors.form}</Text>
        ) : null}

        <Pressable 
          style={[styles.loginButton, isLoading ? styles.loginButtonDisabled : null]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.loginButtonText}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Text>
        </Pressable>

        <Pressable 
          style={styles.signupLink} 
          onPress={() => router.push('./signup')}
          disabled={isLoading}
        >
          <Text style={styles.signupText}>
            Don't have an account? <Text style={styles.signupLinkText}>Sign up</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  form: {
    gap: 20,
  },
  roleSelector: {
    marginBottom: 20,
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
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  roleButtonActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  roleButtonTextActive: {
    color: '#fff',
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    color: '#2563eb',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  signupLink: {
    alignItems: 'center',
    marginTop: 20,
  },
  signupText: {
    fontSize: 14,
    color: '#64748b',
  },
  signupLinkText: {
    color: '#2563eb',
    fontWeight: '500',
  },
  formError: {
    textAlign: 'center',
    marginTop: 12,
  },
});