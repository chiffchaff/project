import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, IndianRupee, Users, Wifi, Droplets, Zap } from 'lucide-react-native';

export default function PropertySelection() {
  const router = useRouter();
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);

  const properties = [
    {
      id: 1,
      name: 'Green Valley Apartments',
      type: '2 BHK Apartment',
      address: 'Harmu Housing Colony, Ranchi',
      rent: 15000,
      deposit: 30000,
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400',
      amenities: ['wifi', 'water', 'electricity'],
      maxOccupants: 4,
    },
    {
      id: 2,
      name: 'Sunrise Residency',
      type: '3 BHK Apartment',
      address: 'Kanke Road, Ranchi',
      rent: 20000,
      deposit: 40000,
      image: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=400',
      amenities: ['wifi', 'water', 'electricity'],
      maxOccupants: 6,
    },
  ];

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'wifi':
        return <Wifi size={16} color="#64748b" />;
      case 'water':
        return <Droplets size={16} color="#64748b" />;
      case 'electricity':
        return <Zap size={16} color="#64748b" />;
      default:
        return null;
    }
  };

  const handleContinue = () => {
    if (selectedProperty) {
      router.push('/onboarding/agreement');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.description}>
          Select a property to begin your rental journey. All properties are verified and ready for immediate occupancy.
        </Text>

        {properties.map((property) => (
          <Pressable
            key={property.id}
            style={[
              styles.propertyCard,
              selectedProperty === property.id && styles.selectedCard,
            ]}
            onPress={() => setSelectedProperty(property.id)}
          >
            <Image source={{ uri: property.image }} style={styles.propertyImage} />
            <View style={styles.propertyContent}>
              <Text style={styles.propertyName}>{property.name}</Text>
              <Text style={styles.propertyType}>{property.type}</Text>
              
              <View style={styles.locationContainer}>
                <MapPin size={16} color="#64748b" />
                <Text style={styles.locationText}>{property.address}</Text>
              </View>

              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <IndianRupee size={16} color="#2563eb" />
                  <Text style={styles.detailText}>₹{property.rent}/month</Text>
                </View>
                <View style={styles.detailItem}>
                  <Users size={16} color="#64748b" />
                  <Text style={styles.detailText}>Up to {property.maxOccupants} people</Text>
                </View>
              </View>

              <View style={styles.amenitiesContainer}>
                <Text style={styles.amenitiesTitle}>Included in Rent:</Text>
                <View style={styles.amenitiesList}>
                  {property.amenities.map((amenity) => (
                    <View key={amenity} style={styles.amenityItem}>
                      {getAmenityIcon(amenity)}
                      <Text style={styles.amenityText}>
                        {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.depositContainer}>
                <Text style={styles.depositLabel}>Security Deposit:</Text>
                <Text style={styles.depositAmount}>₹{property.deposit}</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.continueButton, !selectedProperty && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!selectedProperty}
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
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  description: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 20,
    lineHeight: 24,
  },
  propertyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#2563eb',
  },
  propertyImage: {
    width: '100%',
    height: 200,
  },
  propertyContent: {
    padding: 16,
  },
  propertyName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  propertyType: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  locationText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 6,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#1e293b',
  },
  amenitiesContainer: {
    marginBottom: 16,
  },
  amenitiesTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 8,
  },
  amenitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    gap: 6,
  },
  amenityText: {
    fontSize: 14,
    color: '#64748b',
  },
  depositContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
  },
  depositLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  depositAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
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