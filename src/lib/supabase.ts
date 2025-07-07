import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    debug: true // Enable debug mode to see more detailed auth logs
  }
});

// Set up auth state change handler for debugging
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Supabase auth event:', event, session?.user?.id);
  
  // Log additional information for debugging
  if (event === 'SIGNED_IN' && session?.user) {
    console.log('User signed in successfully:', {
      id: session.user.id,
      email: session.user.email,
      provider: session.user.app_metadata.provider,
      metadata: session.user.user_metadata
    });
  }
  
  // Handle session refresh failures
  if (event === 'TOKEN_REFRESHED' && !session) {
    console.warn('Token refresh failed, user will need to sign in again');
  }

  // Log password reset events
  if (event === 'PASSWORD_RECOVERY') {
    console.log('Password recovery initiated');
  }
  
  // Log additional information for sign-in events
  if (event === 'SIGNED_IN' && session?.user) {
    console.log('User signed in successfully:', {
      id: session.user.id,
      email: session.user.email,
      provider: session.user.app_metadata.provider
    });
  }
});