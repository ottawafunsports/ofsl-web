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
    flowType: 'pkce'
  }
});

// Set up auth state change handler for debugging
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Supabase auth event:', event, session?.user?.id);
  
  // Handle session refresh failures
  if (event === 'TOKEN_REFRESHED' && !session) {
    console.warn('Token refresh failed, user will need to sign in again');
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