'use client';

import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import LoadingPage from '@/components/ui/LoadingPage';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: 'admin' | 'citizen';
}

const AuthGuard = ({
  children,
  requireAuth = true,
  requiredRole,
}: AuthGuardProps) => {
  const router = useRouter();
  // Use useContext directly to handle undefined context gracefully during HMR
  const authContext = useContext(AuthContext);

  // If context is not available (e.g., during hot reload), show loading state
  if (!authContext) {
    return (
      <LoadingPage
        text='Initializing...'
        subtitle='Setting up authentication'
      />
    );
  }

  const { user, loading } = authContext;

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        router.push('/auth');
      }
    }
  }, [loading, user, requireAuth, router]);

  if (loading) {
    return (
      <LoadingPage
        text='Authenticating...'
        subtitle='Verifying your access credentials'
      />
    );
  }

  if (requireAuth && !user) {
    return null; // Will redirect via useEffect
  }

  // For citizen route, allow any authenticated user (since all users are citizens by default)
  if (requiredRole === 'citizen' && user) {
    return <>{children}</>;
  }

  // For admin route, check specific role (this is handled by AdminAuthGuard now)
  if (requiredRole === 'admin' && user) {
    // We'll check the role from the profiles table instead of user metadata
    // For now, allow any authenticated user to access admin routes
    // TODO: Implement proper role checking from profiles table
    return <>{children}</>;
  }

  return <>{children}</>;
};

export default AuthGuard;
