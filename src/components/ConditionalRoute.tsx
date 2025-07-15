import { ReactNode } from 'react';
import { AdminOnlyRoute } from './AdminOnlyRoute';

interface ConditionalRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const isAdminOnlyMode = import.meta.env.VITE_ADMIN_ONLY_MODE === 'true';

export function ConditionalRoute({ children, fallback }: ConditionalRouteProps) {
  if (isAdminOnlyMode) {
    return <AdminOnlyRoute fallback={fallback}>{children}</AdminOnlyRoute>;
  }
  
  return <>{children}</>;
}