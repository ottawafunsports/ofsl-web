import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userProfile: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ 
    user: User | null; 
    error: AuthError | null; 
  }>;
  signOut: () => Promise<void>;
  checkProfileCompletion: () => boolean;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper function to check if profile is complete
  const checkProfileCompletion = () => {
    if (!userProfile) return false;
    
    // Check if required fields are filled
    const requiredFields = ['name', 'phone'];
    return requiredFields.every(field => 
      userProfile[field] && userProfile[field].toString().trim() !== ''
    );
  };

  // Function to fetch user profile
  const fetchUserProfile = async (authUser: User) => {
    try {
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', authUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return profile;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  // Function to refresh user profile
  const refreshUserProfile = async () => {
    if (user) {
      const profile = await fetchUserProfile(user);
      setUserProfile(profile);
    }
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Handle profile creation for existing session (page refresh scenarios)
        if (session?.user) {
          const profile = await handleUserProfileCreation(session.user);
          setUserProfile(profile);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.email);
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Handle different auth events
      switch (event) {
        case 'SIGNED_IN':
          if (session?.user) {
            const profile = await handleUserProfileCreation(session.user);
            setUserProfile(profile);
            
            // Check if this is a first-time sign in or incomplete profile
            if (profile) {
              const isProfileComplete = profile.name && profile.phone && 
                profile.name.trim() !== '' && profile.phone.trim() !== '';
              
              if (!isProfileComplete) {
                // Redirect to account page for profile completion
                window.location.href = '/my-account?complete=true';
              }
            }
          }
          break;
        case 'SIGNED_OUT':
          // Ensure state is properly cleared
          setSession(null);
          setUser(null);
          setUserProfile(null);
          break;
        case 'TOKEN_REFRESHED':
          // Session was refreshed, update state
          setSession(session);
          setUser(session?.user ?? null);
          if (session?.user) {
            const profile = await fetchUserProfile(session.user);
            setUserProfile(profile);
          }
          break;
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
        .select('*')
        .eq('auth_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        // Error other than "not found"
        console.error('Error checking existing user:', fetchError);
        return null;
      }

      if (!existingUser) {
        // User profile doesn't exist, create it
        const now = new Date().toISOString();
        const newProfile = {
          id: user.id,
          auth_id: user.id,
          name: user.user_metadata?.full_name || user.user_metadata?.name || '',
          phone: '', // Will be empty for Google sign-ups, user can update later
          email: user.email || '',
          date_created: now,
          date_modified: now,
          is_admin: false,
        };

        const { data: insertedUser, error: insertError } = await supabase
          .from('users')
          .insert(newProfile)
          .select()
          .single();

        if (insertError) {
          console.error('Error creating user profile:', insertError);
          return null;
        }

        return insertedUser;
      }

      return existingUser;
    } catch (error) {
      console.error('Error in handleUserProfileCreation:', error);
      return null;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      return { error };
    } catch (error) {
      console.error('Error in signIn:', error);
      return { error: error as AuthError };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`
        }
      });
      return { error };
    } catch (error) {
      console.error('Error in signInWithGoogle:', error);
      return { error: error as AuthError };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      return { user: data?.user || null, error };
    } catch (error) {
      console.error('Error in signUp:', error);
      return { user: null, error: error as AuthError };
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out user...');
      
      // Clear local state immediately
      setLoading(true);
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
        throw error;
      }
      
      // Ensure state is cleared
      setSession(null);
      setUser(null);
      setUserProfile(null);
      
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error in signOut:', error);
      // Even if there's an error, clear the local state
      setSession(null);
      setUser(null);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      userProfile, 
      loading, 
      signIn, 
      signInWithGoogle, 
      signUp, 
      signOut, 
      checkProfileCompletion,
      refreshUserProfile
    }}>
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