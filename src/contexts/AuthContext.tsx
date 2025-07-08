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
      

      return profile;
    } catch (error) {
      console.error('Error in handleUserProfileCreation:', error);
      return null;
    }
  };

  // Handle auth state changes
  const handleAuthStateChange = async (event: string, session: Session | null) => {
    
    // Store the current path for potential redirect after profile completion
    const currentPath = window.location.pathname;
    
    // Set session and user state immediately to ensure UI updates
    if (session) {
      setSession(session);
      setUser(session.user);
    } else {
      setSession(null);
      setUser(null);
    }
    
    if (session?.user) {
      // For Google sign-ins, make an extra attempt to create the profile
      if (session.user.app_metadata?.provider === 'google') {
        try {
          const { data, error } = await supabase.rpc('check_and_fix_user_profile_v3', {
            p_auth_id: session.user.id.toString(),
            p_email: session.user.email || null,
            p_name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || null,
            p_phone: null
          });
          
          if (error) {
            console.error('Error in Google profile creation:', error);
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
      return;
    }

    // Handle password recovery event
    if (event === 'PASSWORD_RECOVERY') {
      // Don't redirect, let the ResetPasswordPage component handle this
      setLoading(false);
      return;
    }

    if (session?.user) {
      // Handle user profile for any signed-in user
      const profile = await handleUserProfileCreation(session.user);
      if (profile) {
        setUserProfile(profile);
        
        // Check if profile is complete - basic info and sports/skills
        const hasBasicInfo = profile.name && profile.phone && 
                            profile.name.trim() !== '' && profile.phone.trim() !== '';
        const hasSportsSkills = profile.user_sports_skills && 
                               Array.isArray(profile.user_sports_skills) && 
                               profile.user_sports_skills.length > 0;
        
        const isComplete = hasBasicInfo && hasSportsSkills;
        
        setProfileComplete(isComplete);
        
        // For Google users with incomplete profiles, force redirect to profile completion
        if (session.user.app_metadata?.provider === 'google' && !isComplete) {
          // Don't redirect if already on the redirect page to avoid loops
          if (currentPath !== '/google-signup-redirect' && currentPath !== '/complete-profile') {
            console.log('Google user with incomplete profile detected, redirecting to profile completion');
            localStorage.setItem('redirectAfterLogin', currentPath);
            window.location.replace('/google-signup-redirect');
            return;
          }
        }
      } else {
        console.error('Failed to create or retrieve user profile');
      }

      // Handle redirect only for explicit sign-in events (not initial session)
      if (event === 'SIGNED_IN') {
        // For Google sign-ins, redirect to the profile completion page if needed
        // Only handle redirects if the profile is complete or this is not a Google user
        if (profileComplete || session.user.app_metadata?.provider !== 'google') {
          // Check for redirect after login
          const redirectPath = localStorage.getItem('redirectAfterLogin') || '/my-account/teams';
          if (redirectPath && redirectPath !== '/google-signup-redirect' && redirectPath !== '/complete-profile') {
            localStorage.removeItem('redirectAfterLogin');
            // Use setTimeout to ensure the state is fully updated before redirecting
            setTimeout(() => {
              window.location.replace(redirectPath);
            }, 500); // Increased timeout to ensure state is fully updated
            return;
          }
          
          // Default redirect to teams page
          else {
            window.location.replace('/my-account/teams');
            return;
          }
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
       
        const { data, error } = await supabase.auth.getSession();
        const session = data?.session;
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setLoading(false);
            setInitializing(false);
          }
          return;
        }
        
        if (mounted) {
          
          if (session?.user) {
            // For Google users, ensure profile exists
            if (session.user.app_metadata?.provider === 'google') {
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
        console.error('Sign in error:', error.message);
        setLoading(false);
        return { error };
      }

      // Don't set loading to false here - let the auth state change handler do it
      // The redirect will happen in the auth state change handler
      
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
      if (currentPath !== '/login' && currentPath !== '/signup' && currentPath !== '/google-signup-redirect') {
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
        if (data.url) {
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
      if (currentPath !== '/login' && currentPath !== '/signup' && currentPath !== '/google-signup-redirect') {
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
        if (data.url) {
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
  
  return context;
};
