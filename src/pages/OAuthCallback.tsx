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

        // If the user context already has a user, we can finish immediately
        if (user) {
          setStatus('success');
          navigate('/citizen', { replace: true });
          return;
        }

        let session = null;

        // First check for the new PKCE auth code in the query string
        const searchParams = new URLSearchParams(window.location.search);
        const authCode = searchParams.get('code');

        if (authCode) {
          const { data, error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(authCode);

          if (exchangeError) {
            // If the code was already exchanged (e.g., Supabase handled it automatically),
            // fall through to the session polling instead of failing immediately.
            console.warn('OAuth exchange warning:', exchangeError);
          } else if (data.session?.user) {
            session = data.session;
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

        // Try to get existing session (Supabase may have already processed the URL)
        if (!session) {
          const { data: immediateSession } = await supabase.auth.getSession();
          if (immediateSession.session?.user) {
            session = immediateSession.session;
          }
        }

        // Fast session establishment with optimized retry logic
        // Reduced wait time: 200ms intervals for 3 seconds max
        let retries = 0;
        const maxRetries = 15; // 15 retries × 200ms = 3 seconds max

        while (!session && retries < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 200)); // Faster checks
          const { data } = await supabase.auth.getSession();
          session = data.session;
          retries++;
        }

        if (session?.user || user) {
          setStatus('success');
          await new Promise(resolve => setTimeout(resolve, 300));
          navigate('/citizen', { replace: true });
          return;
        }

        // If we get here and there were no tokens or code, it might be a direct navigation.
        if (!authCode && !accessToken && !refreshToken) {
          console.warn('No OAuth parameters found, returning to sign-in.');
        } else {
          console.error('Session timeout after', maxRetries, 'retries');
        }

        setStatus('error');
        setErrorMessage('Authentication timeout. Please try signing in again.');
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
  }, [navigate, loading, hasProcessed, user]);

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
              try {
                await supabase.auth.signOut();
              } catch (err) {
                console.error('Error signing out after OAuth failure', err);
              } finally {
                // Use full page navigation to guarantee redirect works even if React Router state is stale
                window.location.href = '/auth?mode=signin';
              }
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
