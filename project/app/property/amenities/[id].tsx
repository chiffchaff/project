import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useProperties } from '@/hooks/useProperties';
import { supabase } from '@/lib/supabase';

const defaultAmenities = [
  { name: 'Water', included: false, monthly_charge: 0 },
  { name: 'Electricity', included: false, monthly_charge: 0 },
  { name: 'WiFi', included: false, monthly_charge: 0 },
  { name: 'Security', included: false, monthly_charge: 0 },
  { name: 'Parking', included: false, monthly_charge: 0 },
  { name: 'Maintenance', included: false, monthly_charge: 0 },
];

export default function ManageAmenities() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { updateAmenities } = useProperties();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [amenities, setAmenities] = useState(defaultAmenities);

  useEffect(() => {
    fetchCurrentAmenities();
  }, [id]);

  const fetchCurrentAmenities = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: amenitiesError } = await supabase
        .from('property_amenities')
        .select('*')
        .eq('property_id', id);

      if (amenitiesError) throw amenitiesError;

      if (data && data.length > 0) {
        // Map existing amenities while preserving the default list
        const updatedAmenities = defaultAmenities.map(defaultAmenity => {
          const existingAmenity = data.find(a => a.name === defaultAmenity.name);
          return existingAmenity 
            ? { 
                name: existingAmenity.name, 
                included: existingAmenity.included, 
                monthly_charge: existingAmenity.monthly_charge 
              }
            : defaultAmenity;
        });
        setAmenities(updatedAmenities);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAmenityToggle = (index: number, included: boolean) => {
    setAmenities(amenities.map((amenity, i) => 
      i === index ? { ...amenity, included } : amenity
    ));
  };

  const handleChargeChange = (index: number, charge: string) => {
    setAmenities(amenities.map((amenity, i) => 
      i === index ? { ...amenity, monthly_charge: parseInt(charge) || 0 } : amenity
    ));
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError(null);

      await updateAmenities(id as string, amenities);
      router.back();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.description}>
          Select the amenities included with this property and set their monthly charges.
          Leave the charge as 0 if it's included in the rent.
        </Text>

        {amenities.map((amenity, index) => (
          <View key={index} style={styles.amenityItem}>
            <View style={styles.amenityHeader}>
              <Pressable
                style={[styles.checkbox, amenity.included && styles.checkboxChecked]}
                onPress={() => handleAmenityToggle(index, !amenity.included)}
              />
              <Text style={styles.amenityName}>{amenity.name}</Text>
            </View>

            {amenity.included && (
              <View style={styles.chargeContainer}>
                <Text style={styles.chargeLabel}>Monthly Charge (₹)</Text>
                <TextInput
                  style={styles.chargeInput}
                  placeholder="0 = Included in Rent"
                  keyboardType="numeric"
                  value={amenity.monthly_charge.toString()}
                  onChangeText={(value) => handleChargeChange(index, value)}
                />
              </View>
            )}
          </View>
        ))}

        <Pressable 
          style={[styles.submitButton, saving && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={saving}
        >
          <Text style={styles.submitButtonText}>
            {saving ? 'Updating Amenities...' : 'Update Amenities'}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
  },
  description: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 24,
    lineHeight: 24,
  },
  errorContainer: {
    margin: 20,
    padding: 16,
    backgroundColor: '#fee2e2',
    borderRadius: 8,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
  },
  amenityItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  amenityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  amenityName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
  },
  chargeContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  chargeLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  chargeInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1e293b',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  submitButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});