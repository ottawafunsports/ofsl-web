import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, userProfile, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Store the attempted location for redirect after login
    if (!user && !loading) {
      localStorage.setItem('redirectAfterLogin', location.pathname + location.search);
    }
  }, [user, loading, location]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B20000]"></div>
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