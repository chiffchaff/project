import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Camera, Plus, Minus } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useProperties } from '@/hooks/useProperties';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type Property = Database['public']['Tables']['properties']['Row'];

export default function EditProperty() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { updateProperty } = useProperties();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [rent, setRent] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    fetchPropertyDetails();
  }, [id]);

  const fetchPropertyDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: propertyError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (propertyError) throw propertyError;
      if (!data) throw new Error('Property not found');

      setName(data.name);
      setLocation(data.location);
      setType(data.type);
      setRent(data.rent.toString());
      setDueDate(data.due_date.toString());
      setPhotos(data.photos || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPhotos = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        setPhotos([...photos, ...result.assets.map(asset => asset.uri)]);
      }
    } catch (err) {
      console.error('Error picking images:', err);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError(null);

      // Validate required fields
      if (!name || !location || !type || !rent || !dueDate) {
        throw new Error('Please fill in all required fields');
      }

      const rentAmount = parseInt(rent);
      const dueDateNum = parseInt(dueDate);

      if (isNaN(rentAmount) || rentAmount <= 0) {
        throw new Error('Please enter a valid rent amount');
      }

      if (isNaN(dueDateNum) || dueDateNum < 1 || dueDateNum > 31) {
        throw new Error('Please enter a valid due date (1-31)');
      }

      await updateProperty(id as string, {
        name,
        location,
        type,
        rent: rentAmount,
        due_date: dueDateNum,
        photos,
      });

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

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Property Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Green Valley Apartments"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter complete address"
            multiline
            numberOfLines={3}
            value={location}
            onChangeText={setLocation}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Property Type</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Apartment, Villa, House"
            value={type}
            onChangeText={setType}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Monthly Rent</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount in ₹"
            keyboardType="numeric"
            value={rent}
            onChangeText={setRent}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Rent Due Date</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter day of month (1-31)"
            keyboardType="numeric"
            value={dueDate}
            onChangeText={setDueDate}
          />
        </View>

        <View style={styles.photosSection}>
          <Text style={styles.sectionTitle}>Property Photos</Text>
          <Pressable style={styles.addButton} onPress={handleAddPhotos}>
            <Camera size={20} color="#2563eb" />
            <Text style={styles.addButtonText}>Add Photos</Text>
          </Pressable>
          <ScrollView horizontal style={styles.photosList}>
            {photos.map((photo, index) => (
              <View key={index} style={styles.photoItem}>
                <Image source={{ uri: photo }} style={styles.photo} />
                <Pressable 
                  style={styles.removeButton} 
                  onPress={() => handleRemovePhoto(index)}
                >
                  <Minus size={16} color="#dc2626" />
                </Pressable>
              </View>
            ))}
          </ScrollView>
        </View>

        <Pressable
          style={[styles.submitButton, saving && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={saving}
        >
          <Text style={styles.submitButtonText}>
            {saving ? 'Updating Property...' : 'Update Property'}
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
  form: {
    padding: 20,
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
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1e293b',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  photosSection: {
    marginBottom: 24,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#2563eb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  addButtonText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '500',
  },
  photosList: {
    flexDirection: 'row',
  },
  photoItem: {
    marginRight: 12,
    position: 'relative',
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#fee2e2',
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
});