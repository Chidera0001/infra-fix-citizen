import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingPage from '@/components/ui/LoadingPage';
import { supabase } from '@/integrations/supabase/client';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Check if there's a session token in the URL hash (OAuth callback)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const error = hashParams.get('error');
        const errorDescription = hashParams.get('error_description');

        if (error) {
          setStatus('error');
          setErrorMessage(errorDescription || 'OAuth authentication failed. Please try again.');
          return;
        }

        if (accessToken && refreshToken) {
          // Session tokens are in URL, Supabase will handle them automatically
          // Wait a moment for Supabase to process the session
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check if user is now authenticated
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
            setStatus('success');
            // Redirect to dashboard after a brief delay
            setTimeout(() => {
              navigate('/citizen', { replace: true });
            }, 500);
          } else {
            setStatus('error');
            setErrorMessage('Authentication failed. Please try again.');
          }
        } else {
          // No tokens in URL, check if user is already authenticated
          if (user) {
            setStatus('success');
            setTimeout(() => {
              navigate('/citizen', { replace: true });
            }, 500);
          } else {
            // Wait a bit more for session to establish
            await new Promise(resolve => setTimeout(resolve, 2000));
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session?.user) {
              setStatus('success');
              setTimeout(() => {
                navigate('/citizen', { replace: true });
              }, 500);
            } else {
              setStatus('error');
              setErrorMessage('OAuth callback failed. Please try signing in again.');
            }
          }
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setErrorMessage('An error occurred during authentication. Please try again.');
      }
    };

    // Only run if not already loading
    if (!loading) {
      handleOAuthCallback();
    }
  }, [navigate, user, loading]);

  if (loading || status === 'processing') {
    return (
      <LoadingPage
        text="Completing Sign In..."
        subtitle="Please wait while we finish setting up your account"
      />
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign In Successful!</h1>
            <p className="text-gray-600 text-sm">Redirecting you to your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-2xl flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Failed</h1>
          <p className="text-gray-600 text-sm mb-6">{errorMessage}</p>
          <button
            onClick={() => navigate('/auth')}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default OAuthCallback;

