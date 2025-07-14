import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ComingSoonPage } from '../screens/ComingSoonPage';

interface AdminOnlyRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function AdminOnlyRoute({ children, fallback }: AdminOnlyRouteProps) {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B20000]"></div>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If logged in but not admin, show coming soon page
  if (!userProfile?.is_admin) {
    return fallback || <ComingSoonPage />;
  }

  // Admin user - show the content
  return <>{children}</>;
}