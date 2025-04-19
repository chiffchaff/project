import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Edit, Settings } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import PropertyCard from '@/components/PropertyCard';

type Property = Database['public']['Tables']['properties']['Row'] & {
  amenities: Database['public']['Tables']['property_amenities']['Row'][];
};

export default function PropertyDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPropertyDetails();
  }, [id]);

  const fetchPropertyDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (propertyError) throw propertyError;

      const { data: amenities, error: amenitiesError } = await supabase
        .from('property_amenities')
        .select('*')
        .eq('property_id', id);

      if (amenitiesError) throw amenitiesError;

      setProperty({
        ...propertyData,
        amenities: amenities || [],
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (error || !property) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error || 'Property not found'}
        </Text>
        <Pressable style={styles.retryButton} onPress={fetchPropertyDetails}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <PropertyCard property={property} showActions={false} />
      </View>

      <View style={styles.actions}>
        <Pressable 
          style={styles.actionButton}
          onPress={() => router.push(`/property/edit/${property.id}`)}
        >
          <Edit size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Edit Property</Text>
        </Pressable>

        <Pressable 
          style={[styles.actionButton, styles.actionButtonSecondary]}
          onPress={() => router.push(`/property/amenities/${property.id}`)}
        >
          <Settings size={20} color="#2563eb" />
          <Text style={styles.actionButtonTextSecondary}>Manage Amenities</Text>
        </Pressable>
      </View>

      {property.amenities.length > 0 && (
        <View style={styles.amenitiesSection}>
          <Text style={styles.sectionTitle}>Monthly Charges</Text>
          {property.amenities.map((amenity) => (
            <View key={amenity.id} style={styles.chargeItem}>
              <Text style={styles.chargeName}>{amenity.name}</Text>
              <Text style={styles.chargeAmount}>
                {amenity.included 
                  ? amenity.monthly_charge > 0 
                    ? `₹${amenity.monthly_charge}`
                    : 'Included in Rent'
                  : 'Not Included'}
              </Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.photosSection}>
        <Text style={styles.sectionTitle}>Property Photos</Text>
        <ScrollView horizontal style={styles.photosList}>
          {property.photos.map((photo, index) => (
            <Image
              key={index}
              source={{ uri: photo }}
              style={styles.photo}
            />
          ))}
        </ScrollView>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 8,
  },
  actionButtonSecondary: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#2563eb',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  actionButtonTextSecondary: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '500',
  },
  amenitiesSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  chargeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  chargeName: {
    fontSize: 16,
    color: '#1e293b',
  },
  chargeAmount: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2563eb',
  },
  photosSection: {
    padding: 20,
  },
  photosList: {
    flexDirection: 'row',
  },
  photo: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginRight: 12,
  },
});