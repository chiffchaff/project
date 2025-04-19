import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Database['public']['Tables']['profiles']['Row'] | null;
  loading: boolean;
  signUp: (email: string, password: string, data: { 
    full_name: string;
    phone: string;
    role: 'owner' | 'tenant';
    properties?: {
      name: string;
      location: string;
      type: string;
      rent: number;
      dueDate: number;
      photos: string[];
      amenities: {
        name: string;
        included: boolean;
        monthlyCharge: number;
      }[];
    }[];
  }) => Promise<{ requiresEmailVerification: boolean }>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Database['public']['Tables']['profiles']['Row'] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return;
    }

    setProfile(data);
    setLoading(false);
  }

  const signUp = async (email: string, password: string, data: {
    full_name: string;
    phone: string;
    role: 'owner' | 'tenant';
    properties?: {
      name: string;
      location: string;
      type: string;
      rent: number;
      dueDate: number;
      photos: string[];
      amenities: {
        name: string;
        included: boolean;
        monthlyCharge: number;
      }[];
    }[];
  }) => {
    try {
      setLoading(true);

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      // Step 1: Create auth user with email confirmation enabled
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/login`,
          data: {
            full_name: data.full_name,
            phone: data.phone,
            role: data.role,
          }
        }
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error('No user returned from signup');

      // Create profile
      const profileData: Database['public']['Tables']['profiles']['Insert'] = {
        id: authData.user.id,
        email,
        full_name: data.full_name,
        phone: data.phone,
        role: data.role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(profileData);

      if (profileError) {
        console.error('Profile creation error:', profileError);
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw profileError;
      }

      // If user is an owner and has properties, create them
      if (data.role === 'owner' && data.properties && data.properties.length > 0) {
        for (const property of data.properties) {
          // Create property
          const { data: propertyData, error: propertyError } = await supabase
            .from('properties')
            .insert({
              owner_id: authData.user.id,
              name: property.name,
              location: property.location,
              type: property.type,
              rent: property.rent,
              due_date: property.dueDate,
              photos: property.photos,
            })
            .select()
            .single();

          if (propertyError) {
            console.error('Property creation error:', propertyError);
            continue;
          }

          // Create amenities for the property
          if (propertyData && property.amenities.length > 0) {
            const amenitiesData = property.amenities.map(amenity => ({
              property_id: propertyData.id,
              name: amenity.name,
              included: amenity.included,
              monthly_charge: amenity.monthlyCharge,
            }));

            const { error: amenitiesError } = await supabase
              .from('property_amenities')
              .insert(amenitiesData);

            if (amenitiesError) {
              console.error('Amenities creation error:', amenitiesError);
            }
          }
        }
      }

      setLoading(false);
      return { requiresEmailVerification: true };

    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Please verify your email address before signing in');
        }
        throw error;
      }

      if (!data.user?.email_confirmed_at) {
        throw new Error('Please verify your email address before signing in');
      }

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        setProfile(profile);
        setSession(data.session);
        setUser(data.user);
      }
      
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{
      session,
      user,
      profile,
      loading,
      signUp,
      signIn,
      signOut,
      resetPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}