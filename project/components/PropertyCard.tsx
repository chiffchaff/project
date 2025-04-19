import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { MapPin, IndianRupee, Users, Wifi, Droplets, Zap, Building2 } from 'lucide-react-native';
import { Database } from '@/types/supabase';

type Property = Database['public']['Tables']['properties']['Row'] & {
  amenities: Database['public']['Tables']['property_amenities']['Row'][];
};

interface PropertyCardProps {
  property: Property;
  onPress?: () => void;
  showAmenities?: boolean;
  showActions?: boolean;
}

export default function PropertyCard({
  property,
  onPress,
  showAmenities = true,
  showActions = true,
}: PropertyCardProps) {
  const getAmenityIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'water':
        return <Droplets size={16} color="#64748b" />;
      case 'electricity':
        return <Zap size={16} color="#64748b" />;
      case 'wifi':
        return <Wifi size={16} color="#64748b" />;
      default:
        return <Building2 size={16} color="#64748b" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
    >
      {property.photos && property.photos.length > 0 && (
        <Image source={{ uri: property.photos[0] }} style={styles.image} />
      )}
      
      <View style={styles.content}>
        <Text style={styles.name}>{property.name}</Text>
        <Text style={styles.type}>{property.type}</Text>

        <View style={styles.locationContainer}>
          <MapPin size={16} color="#64748b" />
          <Text style={styles.locationText}>{property.location}</Text>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <IndianRupee size={16} color="#2563eb" />
            <Text style={styles.detailText}>
              {formatCurrency(property.rent)}/month
            </Text>
          </View>
          <Text style={styles.dueDate}>
            Due: {property.due_date}th of every month
          </Text>
        </View>

        {showAmenities && property.amenities && property.amenities.length > 0 && (
          <View style={styles.amenitiesContainer}>
            <Text style={styles.amenitiesTitle}>Included Amenities:</Text>
            <View style={styles.amenitiesList}>
              {property.amenities.map((amenity) => (
                amenity.included && (
                  <View key={amenity.id} style={styles.amenityItem}>
                    {getAmenityIcon(amenity.name)}
                    <Text style={styles.amenityText}>
                      {amenity.name}
                      {amenity.monthly_charge > 0 && ` (${formatCurrency(amenity.monthly_charge)}/mo)`}
                    </Text>
                  </View>
                )
              ))}
            </View>
          </View>
        )}

        {showActions && (
          <View style={styles.actionsContainer}>
            <Pressable style={styles.actionButton}>
              <Text style={styles.actionButtonText}>View Details</Text>
            </Pressable>
            <Pressable style={[styles.actionButton, styles.actionButtonSecondary]}>
              <Text style={styles.actionButtonTextSecondary}>Update</Text>
            </Pressable>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  type: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  locationText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 6,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  dueDate: {
    fontSize: 14,
    color: '#64748b',
  },
  amenitiesContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
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
    gap: 8,
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
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  actionButtonSecondary: {
    backgroundColor: '#f1f5f9',
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
});