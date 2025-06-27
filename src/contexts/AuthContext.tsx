import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ 
    user: User | null; 
    error: AuthError | null; 
  }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get session from storage and set user if exists
    const setData = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error(error);
      }
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    // Set data initially
    setData();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Handle Google sign-in profile creation
      if (session?.user && _event === 'SIGNED_IN') {
        await handleUserProfileCreation(session.user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Helper function to create user profile if it doesn't exist
  const handleUserProfileCreation = async (user: User) => {
    try {
      // Check if user profile already exists
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        // Error other than "not found"
        console.error('Error checking existing user:', fetchError);
        return;
      }

      if (!existingUser) {
        // User profile doesn't exist, create it
        const now = new Date().toISOString();
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            auth_id: user.id,
            name: user.user_metadata?.full_name || user.user_metadata?.name || '',
            phone: '', // Will be empty for Google sign-ups, user can update later
            email: user.email || '',
            date_created: now,
            date_modified: now,
            is_admin: false,
          });

        if (insertError) {
          console.error('Error creating user profile:', insertError);
        }
      }
    } catch (error) {
      console.error('Error in handleUserProfileCreation:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}`
      }
    });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    return { user: data?.user || null, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signIn, signInWithGoogle, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};