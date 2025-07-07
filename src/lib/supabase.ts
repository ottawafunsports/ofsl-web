import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Get the Supabase URL from environment variables
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
    storage: {
      getItem: (key) => {
        const value = localStorage.getItem(key);
        console.log('Auth storage getItem:', key, value ? 'exists' : 'missing');
        return value;
      },
      setItem: (key, value) => {
        console.log('Auth storage setItem:', key);
        localStorage.setItem(key, value);
      },
      removeItem: (key) => {
        console.log('Auth storage removeItem:', key);
        localStorage.removeItem(key);
      }
    },
    debug: true
  }
});

// Set up auth state change handler for debugging
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Supabase auth event:', event, session?.user?.id);
  console.log('Auth provider:', session?.user?.app_metadata?.provider);
  
  // Log detailed information for Google sign-ins
  if (session?.user?.app_metadata?.provider === 'google') {
    console.log('Google sign-in detected:', {
      id: session.user.id,
      email: session.user.email,
      metadata: session.user.user_metadata
    });
  }
  
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
      id: session.user.id || 'unknown',
      email: session.user.email || 'unknown',
      provider: session.user.app_metadata?.provider || 'unknown',
      metadata: session.user.user_metadata
    });
    
    // Call the function to check and fix user profile if needed
    if (session.user.id) {
      setTimeout(async () => {
        try {
          // Use RPC to check and fix user profile
          const { data, error } = await supabase.rpc('check_and_fix_user_profile', {
            p_auth_id: session.user.id,
            p_email: session.user.email,
            p_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
            p_phone: session.user.user_metadata?.phone
          });
          
          if (error) {
            console.error('Error checking/fixing user profile:', error);
          } else if (data) {
            console.log('User profile was created or fixed');
          }
        } catch (err) {
          console.error('Error in profile check:', err);
        }
      }, 1000); // Delay slightly to ensure auth is fully processed
    }
  }
});