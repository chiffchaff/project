import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type Property = Database['public']['Tables']['properties']['Row'];
type PropertyAmenity = Database['public']['Tables']['property_amenities']['Row'];

export function useProperties() {
  const [properties, setProperties] = useState<(Property & { amenities: PropertyAmenity[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (propertiesError) throw propertiesError;

      const propertiesWithAmenities = await Promise.all(
        propertiesData.map(async (property) => {
          const { data: amenities, error: amenitiesError } = await supabase
            .from('property_amenities')
            .select('*')
            .eq('property_id', property.id);

          if (amenitiesError) throw amenitiesError;

          return {
            ...property,
            amenities: amenities || [],
          };
        })
      );

      setProperties(propertiesWithAmenities);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addProperty = async (
    property: Omit<Property, 'id' | 'created_at' | 'updated_at' | 'owner_id'> & {
      amenities: Omit<PropertyAmenity, 'id' | 'created_at' | 'updated_at' | 'property_id'>[];
    }
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Get current user's ID
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('No authenticated user found');

      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .insert({
          owner_id: user.id,
          name: property.name,
          location: property.location,
          type: property.type,
          rent: property.rent,
          due_date: property.due_date,
          photos: property.photos,
        })
        .select()
        .single();

      if (propertyError) throw propertyError;

      if (property.amenities.length > 0) {
        const amenitiesData = property.amenities.map(amenity => ({
          property_id: propertyData.id,
          name: amenity.name,
          included: amenity.included,
          monthly_charge: amenity.monthly_charge,
        }));

        const { error: amenitiesError } = await supabase
          .from('property_amenities')
          .insert(amenitiesData);

        if (amenitiesError) throw amenitiesError;
      }

      await fetchProperties();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProperty = async (
    propertyId: string,
    updates: Partial<Omit<Property, 'id' | 'created_at' | 'updated_at' | 'owner_id'>> & {
      amenities?: Omit<PropertyAmenity, 'id' | 'created_at' | 'updated_at' | 'property_id'>[];
    }
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Only include fields that are actually provided in the updates object
      const updateFields = Object.entries(updates).reduce((acc, [key, value]) => {
        if (value !== undefined && key !== 'amenities') {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);

      if (Object.keys(updateFields).length > 0) {
        const { error: propertyError } = await supabase
          .from('properties')
          .update(updateFields)
          .eq('id', propertyId);

        if (propertyError) throw propertyError;
      }

      if (updates.amenities) {
        // Delete existing amenities
        const { error: deleteError } = await supabase
          .from('property_amenities')
          .delete()
          .eq('property_id', propertyId);

        if (deleteError) throw deleteError;

        // Insert new amenities
        const amenitiesData = updates.amenities.map(amenity => ({
          property_id: propertyId,
          name: amenity.name,
          included: amenity.included,
          monthly_charge: amenity.monthly_charge,
        }));

        const { error: amenitiesError } = await supabase
          .from('property_amenities')
          .insert(amenitiesData);

        if (amenitiesError) throw amenitiesError;
      }

      await fetchProperties();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAmenities = async (
    propertyId: string,
    amenities: Omit<PropertyAmenity, 'id' | 'created_at' | 'updated_at' | 'property_id'>[]
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Delete existing amenities
      const { error: deleteError } = await supabase
        .from('property_amenities')
        .delete()
        .eq('property_id', propertyId);

      if (deleteError) throw deleteError;

      // Insert new amenities
      const amenitiesData = amenities.map(amenity => ({
        property_id: propertyId,
        name: amenity.name,
        included: amenity.included,
        monthly_charge: amenity.monthly_charge,
      }));

      const { error: amenitiesError } = await supabase
        .from('property_amenities')
        .insert(amenitiesData);

      if (amenitiesError) throw amenitiesError;

      await fetchProperties();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    properties,
    loading,
    error,
    refetch: fetchProperties,
    addProperty,
    updateProperty,
    updateAmenities,
  };
}