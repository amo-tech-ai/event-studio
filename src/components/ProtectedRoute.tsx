/**
 * Protected Route Component
 *
 * Restricts access to authenticated users only. Redirects to login page
 * if user is not authenticated, preserving the intended destination.
 *
 * DEVELOPMENT MODE: Set VITE_DISABLE_AUTH=true to bypass authentication
 */

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export function ProtectedRoute() {
  const { session, loading } = useAuth();
  const location = useLocation();

  // DEVELOPMENT MODE: Bypass authentication if disabled
  const authDisabled = import.meta.env.VITE_DISABLE_AUTH === 'true';

  if (authDisabled) {
    console.warn('⚠️ Authentication is DISABLED for development');
    return <Outlet />;
  }

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  // Save the attempted location to redirect back after login
  if (!session) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected content
  return <Outlet />;
}
