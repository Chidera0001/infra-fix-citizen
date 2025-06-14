
import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: 'admin' | 'citizen';
}

const AuthGuard = ({ children, requireAuth = true, requiredRole }: AuthGuardProps) => {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If authentication is required and user is not signed in, redirect to auth
  if (requireAuth && !isSignedIn) {
    return <Navigate to="/auth" replace />;
  }

  // Check admin role requirements
  if (requiredRole === 'admin' && user) {
    const userRole = user.publicMetadata?.role as string;
    if (userRole !== 'admin') {
      // Non-admin trying to access admin area, redirect to landing page
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default AuthGuard;
