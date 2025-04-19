import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Image } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Building2, ChevronLeft, Upload, Plus, Minus, Camera } from 'lucide-react-native';
import { useAuth } from '@/contexts/auth';
import * as ImagePicker from 'expo-image-picker';

type UserRole = 'owner' | 'tenant';

interface Amenity {
  id: string;
  name: string;
  included: boolean;
  monthlyCharge?: number;
}

interface PropertyListing {
  id: string;
  name: string;
  location: string;
  type: string;
  rent: number;
  dueDate: number;
  amenities: Amenity[];
  photos: string[];
}

const defaultAmenities: Amenity[] = [
  { id: '1', name: 'Water', included: false, monthlyCharge: 0 },
  { id: '2', name: 'Electricity', included: false, monthlyCharge: 0 },
  { id: '3', name: 'WiFi', included: false, monthlyCharge: 0 },
  { id: '4', name: 'Security', included: false, monthlyCharge: 0 },
  { id: '5', name: 'Parking', included: false, monthlyCharge: 0 },
];

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

  const [properties, setProperties] = useState<PropertyListing[]>([{
    id: '1',
    name: '',
    location: '',
    type: '',
    rent: 0,
    dueDate: 5,
    amenities: [...defaultAmenities],
    photos: [],
  }]);

  const handleAddProperty = () => {
    setProperties([...properties, {
      id: Date.now().toString(),
      name: '',
      location: '',
      type: '',
      rent: 0,
      dueDate: 5,
      amenities: [...defaultAmenities],
      photos: [],
    }]);
  };

  const handleRemoveProperty = (propertyId: string) => {
    setProperties(properties.filter(p => p.id !== propertyId));
  };

  const handlePropertyChange = (propertyId: string, field: keyof PropertyListing, value: any) => {
    setProperties(properties.map(property => {
      if (property.id === propertyId) {
        return { ...property, [field]: value };
      }
      return property;
    }));
  };

  const handleAmenityToggle = (propertyId: string, amenityId: string, included: boolean) => {
    setProperties(properties.map(property => {
      if (property.id === propertyId) {
        return {
          ...property,
          amenities: property.amenities.map(amenity => 
            amenity.id === amenityId ? { ...amenity, included } : amenity
          ),
        };
      }
      return property;
    }));
  };

  const handleAmenityChargeChange = (propertyId: string, amenityId: string, charge: number) => {
    setProperties(properties.map(property => {
      if (property.id === propertyId) {
        return {
          ...property,
          amenities: property.amenities.map(amenity => 
            amenity.id === amenityId ? { ...amenity, monthlyCharge: charge } : amenity
          ),
        };
      }
      return property;
    }));
  };

  const handleAddPhotos = async (propertyId: string) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        setProperties(properties.map(property => {
          if (property.id === propertyId) {
            return {
              ...property,
              photos: [...property.photos, ...result.assets.map(asset => asset.uri)],
            };
          }
          return property;
        }));
      }
    } catch (err) {
      console.error('Error picking images:', err);
    }
  };

  const handleRemovePhoto = (propertyId: string, photoUri: string) => {
    setProperties(properties.map(property => {
      if (property.id === propertyId) {
        return {
          ...property,
          photos: property.photos.filter(uri => uri !== photoUri),
        };
      }
      return property;
    }));
  };

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

      if (role === 'owner') {
        if (!address) {
          throw new Error('Address is required for property owners');
        }

        // Validate property data
        if (properties.length > 0) {
          for (const property of properties) {
            if (!property.name || !property.location || !property.type || !property.rent) {
              throw new Error('Please fill in all property details');
            }

            if (property.rent <= 0) {
              throw new Error('Rent amount must be greater than 0');
            }

            if (property.dueDate < 1 || property.dueDate > 31) {
              throw new Error('Due date must be between 1 and 31');
            }
          }
        }
      }

      if (!acceptedTerms) {
        throw new Error('Please accept the terms and conditions');
      }

      // Register user with properties if owner
      const result = await signUp(email, password, {
        full_name: fullName,
        phone,
        role,
        ...(role === 'owner' && properties.length > 0 ? {
          properties: properties.map(property => ({
            name: property.name,
            location: property.location,
            type: property.type,
            rent: property.rent,
            dueDate: property.dueDate,
            photos: property.photos,
            amenities: property.amenities
              .filter(amenity => amenity.included)
              .map(amenity => ({
                name: amenity.name,
                included: amenity.included,
                monthlyCharge: amenity.monthlyCharge || 0,
              })),
          })),
        } : {}),
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

            <View style={styles.propertySection}>
              <Text style={styles.label}>Property Listings</Text>
              {properties.map(property => (
                <View key={property.id} style={styles.propertyCard}>
                  <TextInput
                    style={styles.input}
                    placeholder="Property Name"
                    value={property.name}
                    onChangeText={value => handlePropertyChange(property.id, 'name', value)}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Location"
                    value={property.location}
                    onChangeText={value => handlePropertyChange(property.id, 'location', value)}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Type (e.g., Apartment, Villa)"
                    value={property.type}
                    onChangeText={value => handlePropertyChange(property.id, 'type', value)}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Rent Amount"
                    keyboardType="numeric"
                    value={property.rent.toString()}
                    onChangeText={value => handlePropertyChange(property.id, 'rent', parseInt(value))}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Due Date (e.g., 5th)"
                    keyboardType="numeric"
                    value={property.dueDate.toString()}
                    onChangeText={value => handlePropertyChange(property.id, 'dueDate', parseInt(value))}
                  />
                  <View style={styles.amenitiesSection}>
                    <Text style={styles.label}>Amenities</Text>
                    {property.amenities.map(amenity => (
                      <View key={amenity.id} style={styles.amenityItem}>
                        <Pressable
                          style={[styles.checkbox, amenity.included && styles.checkboxChecked]}
                          onPress={() => handleAmenityToggle(property.id, amenity.id, !amenity.included)}
                        />
                        <Text style={styles.checkboxLabel}>{amenity.name}</Text>
                        {amenity.included && (
                          <TextInput
                            style={styles.input}
                            placeholder="Monthly Charge"
                            keyboardType="numeric"
                            value={amenity.monthlyCharge?.toString() || ''}
                            onChangeText={value => handleAmenityChargeChange(property.id, amenity.id, parseInt(value))}
                          />
                        )}
                      </View>
                    ))}
                  </View>
                  <View style={styles.photosSection}>
                    <Text style={styles.label}>Photos</Text>
                    <Pressable style={styles.uploadButton} onPress={() => handleAddPhotos(property.id)}>
                      <Camera size={20} color="#2563eb" />
                      <Text style={styles.uploadButtonText}>Add Photos</Text>
                    </Pressable>
                    <ScrollView horizontal>
                      {property.photos.map(photoUri => (
                        <View key={photoUri} style={styles.photoItem}>
                          <Image source={{ uri: photoUri }} style={styles.photo} />
                          <Pressable onPress={() => handleRemovePhoto(property.id, photoUri)}>
                            <Minus size={20} color="#dc2626" />
                          </Pressable>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                  <Pressable style={styles.removeButton} onPress={() => handleRemoveProperty(property.id)}>
                    <Minus size={20} color="#dc2626" />
                    <Text style={styles.removeButtonText}>Remove Property</Text>
                  </Pressable>
                </View>
              ))}
              <Pressable style={styles.addButton} onPress={handleAddProperty}>
                <Plus size={20} color="#2563eb" />
                <Text style={styles.addButtonText}>Add Property</Text>
              </Pressable>
            </View>
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
  propertySection: {
    marginBottom: 24,
  },
  propertyCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  amenitiesSection: {
    marginTop: 16,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  photosSection: {
    marginTop: 16,
  },
  photoItem: {
    marginRight: 8,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  removeButtonText: {
    color: '#dc2626',
    fontSize: 16,
    marginLeft: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  addButtonText: {
    color: '#2563eb',
    fontSize: 16,
    marginLeft: 8,
  },
});