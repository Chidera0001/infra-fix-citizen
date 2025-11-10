import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingPage from '@/components/ui/LoadingPage';
import { supabase } from '@/integrations/supabase/client';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>(
    'processing'
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasProcessed, setHasProcessed] = useState(false);

  useEffect(() => {
    // Safeguard 1: Prevent double processing
    if (hasProcessed) return;

    const handleOAuthCallback = async () => {
      try {
        setHasProcessed(true);

        // First check for the new PKCE auth code in the query string
        const searchParams = new URLSearchParams(window.location.search);
        const authCode = searchParams.get('code');

        if (authCode) {
          const { data, error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(authCode);

          if (exchangeError) {
            console.error('OAuth exchange error:', exchangeError);
            setStatus('error');
            setErrorMessage(
              'Authentication failed. Please try signing in again.'
            );
            return;
          }

          if (data.session?.user) {
            setStatus('success');
            await new Promise(resolve => setTimeout(resolve, 300));
            navigate('/citizen', { replace: true });
            return;
          }
        }

        // Fallback: Check if there's a session token in the URL hash (legacy flow)
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1)
        );
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const error = hashParams.get('error');
        const errorDescription = hashParams.get('error_description');

        // Handle OAuth errors immediately
        if (error) {
          console.error('OAuth error:', error, errorDescription);
          setStatus('error');
          setErrorMessage(
            errorDescription || 'Authentication failed. Please try again.'
          );
          return;
        }

        // If no tokens in URL, this might be a direct navigation - redirect to auth
        if (!accessToken && !refreshToken) {
          console.warn('No OAuth tokens found in URL');
          setStatus('error');
          setErrorMessage(
            'Invalid authentication callback. Please try signing in again.'
          );
          return;
        }

        // Fast session establishment with optimized retry logic
        // Reduced wait time: 200ms intervals for 3 seconds max
        let retries = 0;
        const maxRetries = 15; // 15 retries × 200ms = 3 seconds max
        let session = null;

        // Try to get session immediately first (often already available)
        const { data: immediateSession } = await supabase.auth.getSession();
        if (immediateSession.session?.user) {
          session = immediateSession.session;
        }

        // Only retry if session not immediately available
        while (!session && retries < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 200)); // Faster checks
          const { data } = await supabase.auth.getSession();
          session = data.session;
          retries++;

          // Extra safety: break if max retries reached
          if (retries >= maxRetries) break;
        }

        if (session?.user) {
          setStatus('success');
          // Minimal delay for state propagation
          await new Promise(resolve => setTimeout(resolve, 300));
          // Navigate immediately to dashboard
          navigate('/citizen', { replace: true });
        } else {
          // Session failed to establish within timeout
          console.error('Session timeout after', retries, 'retries');
          setStatus('error');
          setErrorMessage(
            'Authentication timeout. Please try signing in again.'
          );
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    };

    // Only run if not already loading
    if (!loading) {
      handleOAuthCallback();
    }
  }, [navigate, loading, hasProcessed]);

  if (loading || status === 'processing') {
    return (
      <LoadingPage
        text='Completing Sign In...'
        subtitle='Please wait while we finish setting up your account'
      />
    );
  }

  if (status === 'success') {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50'>
        <div className='mx-auto max-w-md px-6 text-center'>
          <div className='mb-8'>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-green-600 to-green-700 shadow-lg'>
              <svg
                className='h-8 w-8 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M5 13l4 4L19 7'
                />
              </svg>
            </div>
            <h1 className='mb-2 text-2xl font-bold text-gray-900'>
              Sign In Successful!
            </h1>
            <p className='text-sm text-gray-600'>
              Redirecting you to your dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50'>
      <div className='mx-auto max-w-md px-6 text-center'>
        <div className='mb-8'>
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100'>
            <svg
              className='h-8 w-8 text-red-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </div>
          <h1 className='mb-2 text-2xl font-bold text-gray-900'>
            Authentication Failed
          </h1>
          <p className='mb-6 text-sm text-gray-600'>{errorMessage}</p>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate('/auth');
            }}
            className='rounded-lg bg-green-600 px-6 py-2 text-white transition-colors hover:bg-green-700'
          >
            Go to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default OAuthCallback;
