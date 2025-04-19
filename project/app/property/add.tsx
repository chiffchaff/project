import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, Plus, Minus } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useProperties } from '@/hooks/useProperties';

const defaultAmenities = [
  { name: 'Water', included: false, monthly_charge: 0 },
  { name: 'Electricity', included: false, monthly_charge: 0 },
  { name: 'WiFi', included: false, monthly_charge: 0 },
  { name: 'Security', included: false, monthly_charge: 0 },
  { name: 'Parking', included: false, monthly_charge: 0 },
];

export default function AddProperty() {
  const router = useRouter();
  const { addProperty } = useProperties();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [rent, setRent] = useState('');
  const [dueDate, setDueDate] = useState('5');
  const [photos, setPhotos] = useState<string[]>([]);
  const [amenities, setAmenities] = useState(defaultAmenities);

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

  const handleAmenityToggle = (index: number, included: boolean) => {
    setAmenities(amenities.map((amenity, i) => 
      i === index ? { ...amenity, included } : amenity
    ));
  };

  const handleAmenityChargeChange = (index: number, charge: string) => {
    setAmenities(amenities.map((amenity, i) => 
      i === index ? { ...amenity, monthly_charge: parseInt(charge) || 0 } : amenity
    ));
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      setLoading(true);

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

      await addProperty({
        name,
        location,
        type,
        rent: rentAmount,
        due_date: dueDateNum,
        photos,
        amenities: amenities.filter(amenity => amenity.included),
      });

      router.back();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
                <Pressable style={styles.removeButton} onPress={() => handleRemovePhoto(index)}>
                  <Minus size={16} color="#dc2626" />
                </Pressable>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.amenitiesSection}>
          <Text style={styles.sectionTitle}>Amenities</Text>
          {amenities.map((amenity, index) => (
            <View key={index} style={styles.amenityItem}>
              <Pressable
                style={[styles.checkbox, amenity.included && styles.checkboxChecked]}
                onPress={() => handleAmenityToggle(index, !amenity.included)}
              />
              <Text style={styles.amenityName}>{amenity.name}</Text>
              {amenity.included && (
                <TextInput
                  style={[styles.input, styles.chargeInput]}
                  placeholder="Monthly Charge (₹)"
                  keyboardType="numeric"
                  value={amenity.monthly_charge.toString()}
                  onChangeText={(value) => handleAmenityChargeChange(index, value)}
                />
              )}
            </View>
          ))}
        </View>

        <Pressable
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Adding Property...' : 'Add Property'}
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
  amenitiesSection: {
    marginBottom: 24,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
  },
  chargeInput: {
    width: 150,
    marginLeft: 12,
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