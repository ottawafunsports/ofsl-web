import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  requireCompleteProfile?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false, requireCompleteProfile = true }: ProtectedRouteProps) {
  const { user, userProfile, loading, profileComplete, refreshUserProfile } = useAuth();
  const [fixingProfile, setFixingProfile] = useState(false);
  const [profileFixed, setProfileFixed] = useState(false);
  const location = useLocation();
  
  // Debug logging
  useEffect(() => {
    console.log('ProtectedRoute rendered with auth state:', {
      isAuthenticated: !!user,
      hasProfile: !!userProfile,
      isProfileComplete: profileComplete,
      isLoading: loading,
      path: location.pathname
    });
  }, [user, userProfile, loading, location]);

  useEffect(() => {
    // Store the attempted location for redirect after login
    if (!user && !loading) {
      // Only store non-login/signup paths
      if (location.pathname !== '/login' && location.pathname !== '/signup') {
        const redirectPath = location.pathname + location.search;
        console.log('ProtectedRoute: Storing redirect path:', redirectPath);
        localStorage.setItem('redirectAfterLogin', redirectPath);
      }
    }
    
    // If user exists but profile is missing, try to fix it
    if (user && !userProfile && !loading && !fixingProfile) {
      console.log('User exists but profile is missing, attempting to fix');
      console.log('User ID:', user.id);
      console.log('User email:', user.email);
      
      // Determine if this is a Google user
      const isGoogleUser = user.app_metadata?.provider === 'google';
      console.log('Is Google user:', isGoogleUser);
      console.log('User metadata:', JSON.stringify(user.user_metadata));
      
      const fixUserProfile = async (retryCount = 0) => {
        try {
          console.log(`Attempting to fix missing user profile (attempt ${retryCount + 1}), user ID: ${user.id}`);
          console.log(`Attempting to fix missing user profile (attempt ${retryCount + 1}) for:`, user.id);
          
          // Use the enhanced v3 function for better Google OAuth support
          const { data, error } = await supabase.rpc('check_and_fix_user_profile_v4', {
            p_auth_id: user.id,
            p_email: user.email || '',
            p_name: user.user_metadata?.name || user.user_metadata?.full_name || '',
            p_phone: user.user_metadata?.phone || ''
          });
          
          if (error) {
            console.error(`Error fixing user profile (attempt ${retryCount + 1}):`, error);
            
            // Retry up to 3 times with exponential backoff for Google users
            if (isGoogleUser && retryCount < 3) {
              const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
              console.log(`Retrying in ${delay}ms...`);
              setTimeout(() => fixUserProfile(retryCount + 1), delay);
            }
          } else if (data) {
            console.log(`User profile was created or fixed (attempt ${retryCount + 1}), refreshing profile`);
            // Refresh the user profile
            await refreshUserProfile();
          }
        } catch (err) {
          console.error(`Error in fixUserProfile (attempt ${retryCount + 1}):`, err);
          
          // Retry for Google users
          if (isGoogleUser && retryCount < 3) {
            const delay = Math.pow(2, retryCount) * 1000;
            console.log(`Retrying after error in ${delay}ms...`);
            setTimeout(() => fixUserProfile(retryCount + 1), delay);
          }
        }
      };
      
      fixUserProfile();
    }
  }, [user, loading, location]);
  
  // Attempt to fix missing user profile if user is authenticated but profile is missing
  useEffect(() => {
    const attemptProfileFix = async () => {
      if (user && !userProfile && !loading && !fixingProfile && !profileFixed) {
        try {
          console.log('Attempting to fix missing user profile with RPC for:', user.id);
          console.log('User metadata:', JSON.stringify(user.user_metadata));
          console.log('App metadata:', JSON.stringify(user.app_metadata));
          setFixingProfile(true);
          
          // Call the RPC function to fix the user profile
          const { data, error } = await supabase.rpc('check_and_fix_user_profile_v4', {
            p_auth_id: user.id.toString(),
            p_email: user.email || null,
            p_name: user.user_metadata?.name || user.user_metadata?.full_name || null,
            p_phone: user.user_metadata?.phone || null
          });
          
          if (error) {
            console.error('Error fixing user profile:', error);
          } else {
            console.log('Profile fix attempt result:', data);
            // Force a page reload to get the updated profile
            console.log('Reloading page to refresh user profile');
            setTimeout(() => window.location.reload(), 500);
          }
        } catch (err) {
          console.error('Error in profile fix attempt:', err);
        } finally {
          setFixingProfile(false);
          setProfileFixed(true);
        }
      }
    };
    
    attemptProfileFix();
  }, [user, userProfile, loading, fixingProfile, profileFixed]);

  if (loading || fixingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B20000] mb-4"></div>
          <p className="text-[#6F6F6F] mb-2">{fixingProfile ? 'Fixing user profile...' : 'Loading...'}</p>
          <p className="text-sm text-[#6F6F6F] max-w-md">
            {fixingProfile ? 'This may take a moment while we set up your account.' : 'Please wait while we load your account information.'}
          </p>
        </div>
      </div>
    );
  }

  // Handle case where user is logged in but profile is missing or incomplete
  if (user && (!userProfile || (requireCompleteProfile && !profileComplete)) && !loading) {
    console.warn('User is logged in but profile is missing, redirecting to login. User ID:', user.id);
    console.log('Auth provider:', user.app_metadata?.provider);
    
    // Store the current path for redirect after login
    localStorage.setItem('redirectAfterLogin', location.pathname + location.search);
    
    // Force a reload to clear any stale auth state
    setTimeout(() => {
      window.location.replace('/login');
    }, 500);
    
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div className="flex flex-col items-center max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B20000] mb-6"></div>
          <h2 className="text-xl font-bold text-[#6F6F6F] mb-3">Profile Setup Required</h2>
          <p className="text-[#6F6F6F] mb-4 max-w-sm">
            {!userProfile 
              ? "We need to complete your profile setup." 
              : "Your profile is incomplete. Please add your sports interests and skill levels."}
          </p>
          <Button
            onClick={() => window.location.replace(
              user.app_metadata?.provider === 'google' 
                ? '/google-signup-redirect' 
                : '/my-account/profile?complete=true'
            )}
            className="bg-[#B20000] hover:bg-[#8A0000] text-white rounded-[10px] px-6 py-2"
          >
            Complete Profile Setup
          </Button>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requireAdmin && !userProfile?.is_admin) {
    // Redirect to profile page if user is not an admin
    return <Navigate to="/my-account/profile" replace />;
  }

  return <>{children}</>;
}