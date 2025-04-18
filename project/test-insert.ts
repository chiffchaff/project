import { createClient } from '@supabase/supabase-js';
import type { Database } from './types/supabase';
import { v4 as uuidv4 } from 'uuid';

const supabaseUrl = 'https://lmqznhejaygahqrajrsv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtcXpuaGVqYXlnYWhxcmFqcnN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5MDY5NjEsImV4cCI6MjA2MDQ4Mjk2MX0.m6AQYCPOdU4tuiVXrGz_7j_cqRr_FlK2Ef71J_4MPq8';

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

async function testInsert() {
  try {
    // Generate unique test email and proper UUID
    const testEmail = `writetochethana@gmail.com`;
    const testPassword = 'Test@123456';
    const userId = uuidv4(); // Generate a proper UUID

    console.log('Creating new test user with email:', testEmail);

    //Step 1: Sign up new user with properly formatted UUID
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          id: userId, // Use the generated UUID
          full_name: 'Test User',
          phone: '1234567890',
          role: 'owner'
        }
      }
    });

    if (signUpError) {
      console.error('Sign up error:', signUpError);
      throw signUpError;
    }

    if (!signUpData.user) {
      throw new Error('No user returned from signup');
    }

    const actualUserId = signUpData.user.id; // Get the actual UUID from Supabase
    console.log('User created successfully:', actualUserId);

    // Wait a moment for the user to be fully created
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 2: Sign in with new user
    console.log('Attempting to sign in with new user');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });

    if (signInError) {
      console.error('Sign in error:', signInError);
      throw signInError;
    }

    if (!signInData.user) {
      throw new Error('No user returned from sign in');
    }

    console.log('Successfully signed in');

    // Step 3: Create profile with proper UUID
    const profileData: Database['public']['Tables']['profiles']['Insert'] = {
      id: actualUserId, // Use the actual UUID from auth
      email: testEmail,
      full_name: 'Test User',
      phone: '9886104430',
      role: 'tenant',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('Attempting to create profile:', profileData);

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .upsert(profileData)
      .select()
      .single();

    if (profileError) {
      console.error('Profile creation error:', profileError);
      throw profileError;
    }

    console.log('Profile created successfully:', profile);

  } catch (err) {
    console.error('Test failed:', err);
    process.exit(1);
  }
}

testInsert();
