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
  const [initializing, setInitializing] = useState(true);

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

  // Helper function to create user profile if it doesn't exist
  const handleUserProfileCreation = async (user: User) => {
    try {
      console.log('Handling user profile creation for:', user.email, 'Provider:', user.app_metadata.provider);
      
      console.log('Creating user profile for:', user.email);
      console.log('User metadata:', user.user_metadata);
      console.log('App metadata:', user.app_metadata);
      
      // First check if user profile already exists
      let { data: existingProfile, error: fetchError } = await supabase
        .rpc('check_and_fix_user_profile_v2', {
          p_auth_id: user.id,
          p_email: user.email,
          p_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
          p_phone: user.user_metadata?.phone || ''
        });

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error checking existing user:', fetchError);
        return null;
      }

      if (!existingProfile) {
        console.log('No profile found by auth_id, checking by email');
        
        // Try to find by email as fallback
        const { data: emailProfile, error: emailError } = await supabase
          .from('users')
          .select('*')
          .eq('email', user.email)
          .maybeSingle();
        
        if (emailProfile) {
          console.log('Found existing profile by email, updating auth_id');
          
          // Update the existing profile with the auth_id
          const { data: updatedProfile, error: updateError } = await supabase
            .from('users')
            .update({ auth_id: user.id })
            .eq('id', emailProfile.id)
            .select()
            .single();
            
          if (updateError) {
            console.error('Error updating existing profile with auth_id:', updateError);
          } else {
            return updatedProfile;
          }
        }
        
        // If we get here, we need to create a new profile
        console.log('Creating new user profile for:', user.email);
        
        // Get provider from app_metadata
        const provider = user.app_metadata?.provider || 'email';
        console.log('Auth provider:', provider);
        
        const now = new Date().toISOString();
        const newProfile = {
          id: user.id,
          auth_id: user.id,
          name: user.user_metadata?.full_name || user.user_metadata?.name || user.user_metadata?.user_name || '',
          phone: provider === 'google' ? '' : (user.user_metadata?.phone || ''), // Will be empty for Google sign-ups
          email: user.email || '',
          date_created: now,
          date_modified: now,
          is_admin: false,
      // After attempting to fix the profile, fetch the current profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', user.id)
        .single();
      
      if (profileError) {
        console.error('Error fetching user profile after fix attempt:', profileError);
        return null;
      }
      
      console.log('Existing profile found');

      return profile;
    } catch (error) {
      console.error('Error in handleUserProfileCreation:', error);
      return null;
    }
  };

  // Handle auth state changes
  const handleAuthStateChange = async (event: string, session: Session | null) => {
    console.log('Auth state change:', event, session?.user?.email);
    
    // Add more detailed logging for debugging
    if (session?.user) {
      console.log('User ID:', session.user.id);
      console.log('User email:', session.user.email);
      console.log('User metadata:', JSON.stringify(session.user.user_metadata));
    }
    console.log('Auth event details:', event, 'Time:', new Date().toISOString());
    
    if (session?.user) {
      console.log('Auth provider:', session.user.app_metadata?.provider);
      console.log('Auth metadata:', session.user.app_metadata);
      console.log('Auth user metadata:', session.user.user_metadata);
    }
    
    setSession(session);
    setUser(session?.user ?? null);

    if (event === 'SIGNED_OUT') {
      // Clear all auth state
      setSession(null);
      setUser(null);
      setUserProfile(null);
      // Clear any stored redirect paths
      localStorage.removeItem('redirectAfterLogin');
     localStorage.removeItem('authRedirectPath');
      setLoading(false);
      return;
    }

    // Handle password recovery event
    if (event === 'PASSWORD_RECOVERY') {
      console.log('Password recovery event detected');
      // Don't redirect, let the ResetPasswordPage component handle this
      setLoading(false);
      return;
    }

    if (session?.user) {
      // Handle user profile for any signed-in user
      const profile = await handleUserProfileCreation(session.user);
      console.log('User profile after creation/update:', profile ? 'exists' : 'missing');
      
      if (profile) {
        console.log('User profile after creation:', profile);
        setUserProfile(profile);
      } else {
        console.error('Failed to create or retrieve user profile');
      }

      // Handle redirect only for explicit sign-in events (not initial session)
      if (event === 'SIGNED_IN') {
        // Check for redirect after login
        const redirectPath = localStorage.getItem('redirectAfterLogin') || localStorage.getItem('authRedirectPath') || '/my-account/teams';
        if (redirectPath) {
          localStorage.removeItem('redirectAfterLogin');
         localStorage.removeItem('authRedirectPath');
          // Use setTimeout to ensure the state is fully updated before redirecting
          setTimeout(() => {
            window.location.href = redirectPath;
          }, 100);
          return;
        }
        
        // Check if this is a first-time sign in or incomplete profile
        else if (profile) {
          const isProfileComplete = profile.name && profile.phone && 
            profile.name.trim() !== '' && profile.phone.trim() !== '';
          
          if (!isProfileComplete) {
            // Redirect to account page for profile completion
            window.location.href = '/my-account/profile?complete=true';
          } else {
            // Redirect to teams page by default
            window.location.href = '/my-account/teams';
          }
        } else {
          // Fallback redirect to teams page
          window.location.href = '/my-account/teams';
        }
      }
    }

    // Only set loading to false after initial setup is complete
    if (initializing) {
      setInitializing(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        // Keep loading true until we've processed everything
        setLoading(true);
       // Store the current URL before signing out
       const currentPath = window.location.pathname;
       
       
       console.log('Sign in response:', data?.user?.id, error?.message);
       
       // Store the current path for potential redirect after session recovery
       if (window.location.pathname.startsWith('/my-account')) {
         localStorage.setItem('authRedirectPath', window.location.pathname + window.location.search);
       }
        console.log('Getting initial session');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setLoading(false);
            setInitializing(false);
          }
          return;
        }
       localStorage.removeItem('authRedirectPath');
        
        if (mounted) {
          console.log('Initial session found:', session ? 'yes' : 'no', session?.user?.id);
          await handleAuthStateChange('INITIAL_SESSION', session);
       window.location.href = '/';
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        if (mounted) {
          setLoading(false);
          setInitializing(false);
        }
      }
    };

    getInitialSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted && !initializing) {
        await handleAuthStateChange(event, session);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        setLoading(false);
        return { error };
      }
      
      // Don't set loading to false here - let the auth state change handler do it
      return { error: null };
    } catch (error) {
      console.error('Error in signIn:', error);
      setLoading(false);
      return { error: error as AuthError };
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      
      // Store the current URL for redirect after login
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/signup') {
        localStorage.setItem('redirectAfterLogin', currentPath);
      }
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Use the current origin for the redirect URL
          redirectTo: `${window.location.origin}/my-account/profile`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      if (data) {
        console.log('Google sign-in initiated successfully');
      }
      
      return { error };
    } catch (error) {
      console.error('Error in signInWithGoogle:', error);
      setLoading(false);
      return { error: error as AuthError };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Store the current URL for redirect after signup
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/signup') {
        localStorage.setItem('redirectAfterLogin', currentPath);
      }
      
      const { data, error } = await supabase.auth.signUp({
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/my-account/profile`
        }
      });
      
      return { user: data?.user || null, error };
    } catch (error) {
      console.error('Error in signUp:', error);
      return { user: null, error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out user...');
      
      // Set loading state
      setLoading(true);
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
        throw error;
      }
      
      // Clear local storage items
      localStorage.removeItem('redirectAfterLogin');
      
      console.log('User signed out successfully');
      
      // Force page reload to ensure clean state
      window.location.href = '/';
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

  // Don't render children until we've checked for an initial session
  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B20000]"></div>
      </div>
    );
  }

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