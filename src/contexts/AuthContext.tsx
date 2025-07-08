import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userProfile: any | null;
  loading: boolean;
  profileComplete: boolean;
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
  const [profileComplete, setProfileComplete] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // Helper function to check if profile is complete
  const checkProfileCompletion = () => {
    if (!userProfile) return false;
    
    // Check if required fields are filled
    const requiredFields = ['name', 'phone', 'user_sports_skills'];
    const basicFieldsComplete = requiredFields.filter(field => field !== 'user_sports_skills').every(field => 
      userProfile[field] && userProfile[field].toString().trim() !== ''
    );
    
    // Don't require sports and skills for profile completion
    // This allows users to access their account even without selecting sports
    return basicFieldsComplete;
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
      const provider = user.app_metadata?.provider || 'email';
      console.log('Handling user profile creation for:', user.email, 'Provider:', provider);
      
      console.log('Creating user profile for:', user.email);
      console.log('User metadata:', user.user_metadata);
      console.log('App metadata:', user.app_metadata);
      
      // Use the v3 function for better Google OAuth support
      let { data: existingProfile, error: fetchError } = await supabase
        .rpc('check_and_fix_user_profile_v4', {
          p_auth_id: user.id.toString(),
          p_email: user.email,
          p_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
          p_phone: user.user_metadata?.phone || ''
        });

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error checking existing user:', fetchError);
        return null;
      }

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
    
    // Set session and user state immediately to ensure UI updates
    if (session) {
      console.log('Setting session and user state with session ID:', session.user.id);
      setSession(session);
      setUser(session.user);
    } else {
      console.log('Clearing session and user state');
      setSession(null);
      setUser(null);
    }
    
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
      console.log('Auth user metadata:', JSON.stringify(session.user.user_metadata));
      
      // For Google sign-ins, make an extra attempt to create the profile
      if (session.user.app_metadata?.provider === 'google') {
        console.log('Google sign-in detected, ensuring profile exists');
        try {
          const { data, error } = await supabase.rpc('check_and_fix_user_profile_v3', {
            p_auth_id: session.user.id.toString(),
            p_email: session.user.email || null,
            p_name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || null,
            p_phone: null
          });
          
          if (error) {
            console.error('Error in Google profile creation:', error);
          } else if (data) {
            console.log('Google profile creation result:', data);
          }
        } catch (err) {
          console.error('Exception in Google profile creation:', err);
        }
      }
    }
    
    if (event === 'SIGNED_OUT') {
      // Clear all auth state
      setSession(null);
      setUser(null);
      setUserProfile(null);
      // Clear any stored redirect paths
      localStorage.removeItem('redirectAfterLogin');
      setLoading(false);
      console.log('Sign out complete, state cleared');
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
        
        // Check if profile is complete
        const isComplete = profile.name && profile.phone && 
                          profile.name.trim() !== '' && profile.phone.trim() !== '' &&
                          profile.user_sports_skills && 
                          Array.isArray(profile.user_sports_skills) && 
                          profile.user_sports_skills.length > 0;
        
        setProfileComplete(isComplete);
      } else {
        console.error('Failed to create or retrieve user profile');
      }

      // Handle redirect only for explicit sign-in events (not initial session)
      if (event === 'SIGNED_IN') {
        // For Google sign-ins, redirect to the profile completion page if needed
        const isGoogleUser = session.user.app_metadata?.provider === 'google';
        const isProfileIncomplete = !profile || 
                                   !profile.phone || 
                                   profile.phone === '' || 
                                   profile.phone.trim() === '';
        
        if (isGoogleUser && isProfileIncomplete) {
          console.log('Google user needs to complete profile, redirecting to signup redirect page');
          // Store the current path for redirect after profile completion
          if (location.pathname !== '/login' && location.pathname !== '/signup' && 
              location.pathname !== '/google-signup-redirect') {
            localStorage.setItem('redirectAfterLogin', location.pathname + location.search);
          }
          setTimeout(() => {
            window.location.replace('/google-signup-redirect');
          }, 100);
          return;
        }
        
        // Check for redirect after login
        const redirectPath = localStorage.getItem('redirectAfterLogin') || '/my-account/teams';
        console.log('SIGNED_IN event detected, redirecting to:', redirectPath);
        if (redirectPath && redirectPath !== '/google-signup-redirect') {
          localStorage.removeItem('redirectAfterLogin');
          // Use setTimeout to ensure the state is fully updated before redirecting
          setTimeout(() => {
            console.log('Executing redirect to:', redirectPath);
            window.location.replace(redirectPath);
          }, 500); // Increased timeout to ensure state is fully updated
          return;
        }
        
        // Check if this is a first-time sign in or incomplete profile
        else if (profile) {
          const isProfileComplete = profile.name && profile.phone && profile.name.trim() !== '' && profile.phone.trim() !== '';
          if (!isProfileComplete) {
            // Redirect to account page for profile completion
            window.location.replace('/my-account/profile?complete=true');
          } else if (profile.user_sports_skills && 
                    Array.isArray(profile.user_sports_skills) && 
                    profile.user_sports_skills.length > 0) {
            // Redirect to teams page by default
            window.location.replace('/my-account/teams');
          } else {
            // Redirect to profile page to encourage adding sports preferences
            window.location.replace('/my-account/profile');
          }
          return;
        } else {
          // Fallback redirect to teams page
          window.location.replace('/my-account/teams');
          return;
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

    console.log('AuthProvider mounted, initializing auth state');

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('AuthProvider: Getting initial session');
        // Keep loading true until we've processed everything
        setLoading(true);
       
        const { data, error } = await supabase.auth.getSession();
        const session = data?.session;
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            console.log('No initial session found or error occurred');
            setLoading(false);
            setInitializing(false);
          }
          return;
        }
        
        if (mounted) {
          console.log('Initial session found:', session ? `yes, user ID: ${session.user.id}` : 'no');
          
          if (session?.user) {
            // For Google users, ensure profile exists
            if (session.user.app_metadata?.provider === 'google') {
              console.log('Initial Google session detected, ensuring profile exists for user:', session.user.id);
              try {
                const { data, error } = await supabase.rpc('check_and_fix_user_profile_v4', {
                  p_auth_id: session.user.id.toString(),
                  p_email: session.user.email || null,
                  p_name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || null,
                  p_phone: null
                });
                
                if (error) {
                  console.error('Error in initial Google profile creation:', error);
                } else {
                  console.log('Initial Google profile creation result:', data);
                }
              } catch (err) {
                console.error('Exception in initial Google profile creation:', err);
              }
            }
          }
          
          await handleAuthStateChange('INITIAL_SESSION', session);
        }
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
        console.log('Auth state change event:', event);
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
      console.log('Attempting to sign in with email:', email);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('Sign in error:', error.message);
        setLoading(false);
        return { error };
      }

      console.log('Sign in successful, user ID:', data.user?.id);
      
      // Don't set loading to false here - let the auth state change handler do it
      // The redirect will happen in the auth state change handler
      console.log('Waiting for auth state change event...');
      
      // Force a state update to trigger UI refresh
      setUser(data.user);
      setSession(data.session);
      
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
      console.log('Google sign-in: storing redirect path:', currentPath);
      if (currentPath !== '/login' && currentPath !== '/signup' && currentPath !== '/google-signup-redirect') {
        console.log('Storing redirect path:', currentPath);
        localStorage.setItem('redirectAfterLogin', currentPath);
      }
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/google-signup-redirect`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (data) {
        console.log('Google sign-in initiated successfully');
        if (data.url) {
          console.log('Redirect URL:', data.url);
          // Redirect to Google OAuth page
          window.location.href = data.url;
        }
      }
      
      return { error };
    } catch (error) {
      console.error('Error in signInWithGoogle:', error);
      setLoading(false);
      return { error: error as AuthError };
    }
  };

  // Legacy Google sign-in method (kept for backward compatibility)
  const _signInWithGoogle = async () => {
    try {
      setLoading(true);
      
      // Store the current URL for redirect after login
      const currentPath = window.location.pathname;
      console.log('Google sign-in: storing redirect path:', currentPath);
      if (currentPath !== '/login' && currentPath !== '/signup' && currentPath !== '/google-signup-redirect') {
        console.log('Storing redirect path:', currentPath);
        localStorage.setItem('redirectAfterLogin', currentPath);
      }
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Redirect to the Google signup redirect page to complete profile
          redirectTo: `${window.location.origin}/google-signup-redirect`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (data) {
        console.log('Google sign-in initiated successfully');
        if (data.url) {
          console.log('Redirect URL:', data.url);
        }
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
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B20000]"></div>
        <p className="mt-4 text-[#6F6F6F]">Initializing authentication...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      userProfile,
      loading,
      profileComplete,
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
  
  // Log auth state when hook is used (helps with debugging)
  if (process.env.NODE_ENV === 'development') {
    console.log('useAuth hook called, auth state:', {
      isAuthenticated: !!context.user,
      userId: context.user?.id,
      profileId: context.userProfile?.id,
      profileComplete: context.profileComplete,
      loading: context.loading
    });
  }
  
  return context;
};