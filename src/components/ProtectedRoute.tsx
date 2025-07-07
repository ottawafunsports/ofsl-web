import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; 
import { supabase } from '../lib/supabase';
import { supabase } from '../lib/supabase';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, userProfile, loading, refreshUserProfile } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Store the attempted location for redirect after login
    if (!user && !loading) {
      const redirectPath = location.pathname + location.search;
      console.log('Storing redirect path:', redirectPath);
      localStorage.setItem('redirectAfterLogin', redirectPath);
    }
    
    // If user exists but profile is missing, try to fix it
    if (user && !userProfile && !loading) {
      const fixUserProfile = async () => {
        try {
          console.log('Attempting to fix missing user profile for:', user.id);
          
          // Call the RPC function to check and fix the user profile
          const { data, error } = await supabase.rpc('check_and_fix_user_profile', {
            p_auth_id: user.id,
            p_email: user.email,
            p_name: user.user_metadata?.full_name || user.user_metadata?.name,
            p_phone: user.user_metadata?.phone
          });
          
          if (error) {
            console.error('Error fixing user profile:', error);
          } else if (data) {
            console.log('User profile was created or fixed, refreshing profile');
            // Refresh the user profile
            await refreshUserProfile();
          }
        } catch (err) {
          console.error('Error in fixUserProfile:', err);
        }
      };
      
      fixUserProfile();
      console.log('Storing redirect path:', redirectPath);
      localStorage.setItem('redirectAfterLogin', redirectPath);
    }
    
    // If user exists but profile is missing, try to fix it
    if (user && !userProfile && !loading) {
      const fixUserProfile = async () => {
        try {
          console.log('Attempting to fix missing user profile for:', user.id);
          
          // Call the RPC function to check and fix the user profile
          const { data, error } = await supabase.rpc('check_and_fix_user_profile', {
            p_auth_id: user.id,
            p_email: user.email,
            p_name: user.user_metadata?.full_name || user.user_metadata?.name,
            p_phone: user.user_metadata?.phone
          });
          
          if (error) {
            console.error('Error fixing user profile:', error);
          } else if (data) {
            console.log('User profile was created or fixed, refreshing profile');
            // Refresh the user profile
            await refreshUserProfile();
          }
        } catch (err) {
          console.error('Error in fixUserProfile:', err);
        }
      };
      
      fixUserProfile();
    }
  }, [user, loading, location]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B20000]">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  // Handle case where user is logged in but profile is missing
  if (user && !userProfile && !loading) {
    console.warn('User is logged in but profile is missing, redirecting to login', user.id);
    
    // Store the current path for redirect after login
    localStorage.setItem('redirectAfterLogin', location.pathname + location.search);
    
    // Force a reload to clear any stale auth state
    setTimeout(() => {
      window.location.href = '/login';
    }, 100);
    
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B20000]">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  // Handle case where user is logged in but profile is missing
  if (user && !userProfile && !loading) {
    console.warn('User is logged in but profile is missing, redirecting to login', user.id);
    
    // Store the current path for redirect after login
    localStorage.setItem('redirectAfterLogin', location.pathname + location.search);
    
    // Force a reload to clear any stale auth state
    setTimeout(() => {
      window.location.href = '/login';
    }, 100);
    
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B20000]"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !userProfile?.is_admin) {
    // Redirect to profile page if user is not an admin
    return <Navigate to="/my-account/profile" replace />;
  }

  return <>{children}</>;
}