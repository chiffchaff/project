import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { MapPin, BedDouble, Bath, Users } from 'lucide-react-native';

export default function Properties() {
  const properties = [
    {
      id: 1,
      name: 'Green Valley Apartments',
      address: 'Harmu Housing Colony, Ranchi',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400',
      units: 4,
      occupancy: '75%',
      totalRent: '₹60,000',
    },
    {
      id: 2,
      name: 'Sunrise Residency',
      address: 'Kanke Road, Ranchi',
      image: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=400',
      units: 6,
      occupancy: '100%',
      totalRent: '₹90,000',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Properties</Text>
        <Pressable style={styles.addButton}>
          <Text style={styles.addButtonText}>Add Property</Text>
        </Pressable>
      </View>

      {properties.map((property) => (
        <Pressable key={property.id} style={styles.propertyCard}>
          <Image source={{ uri: property.image }} style={styles.propertyImage} />
          <View style={styles.propertyContent}>
            <Text style={styles.propertyName}>{property.name}</Text>
            <View style={styles.locationContainer}>
              <MapPin size={16} color="#64748b" />
              <Text style={styles.locationText}>{property.address}</Text>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <BedDouble size={16} color="#64748b" />
                <Text style={styles.statText}>{property.units} Units</Text>
              </View>
              <View style={styles.statItem}>
                <Users size={16} color="#64748b" />
                <Text style={styles.statText}>{property.occupancy}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.rentAmount}>{property.totalRent}</Text>
                <Text style={styles.rentPeriod}>/month</Text>
              </View>
            </View>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1e293b',
  },
  addButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  propertyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
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
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  locationText: {
    fontSize: 14,
    color: '#64748b',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: '#64748b',
  },
  rentAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
  },
  rentPeriod: {
    fontSize: 12,
    color: '#64748b',
  },
});