import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { User, Session, AuthError, AuthApiError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { clearProfileCache } from '@/lib/supabase-api';
import { handleAuthError, logAuthError } from '@/utils/authErrorHandler';
import { offlineStorage } from '@/utils/offlineStorage';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isOfflineMode: boolean;
  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ error: AuthError | null }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  enableOfflineMode: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // Use navigator.onLine as fallback to avoid hook dependency issues
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const isInvalidRefreshError = useCallback((error: unknown) => {
    if (!error) return false;
    const message =
      (error as AuthApiError)?.message?.toLowerCase() ||
      (error as Error)?.message?.toLowerCase() ||
      '';
    const status = (error as AuthApiError)?.status;
    const code = (error as AuthError)?.code || '';

    return (
      message.includes('invalid refresh token') ||
      message.includes('refresh token not found') ||
      code === 'refresh_token_not_found' ||
      status === 400
    );
  }, []);

  const clearInvalidSession = useCallback(async (context: string) => {
    console.warn(
      `[Auth] Clearing invalid session (${context}) - forcing fresh sign in`
    );
    setSession(null);
    setUser(null);
    setLoading(false);
    clearProfileCache();

    try {
      // Sign out to clear Supabase-managed storage (localStorage)
      await supabase.auth.signOut();
    } catch (signOutError) {
      console.warn(
        'Failed to sign out while clearing invalid session',
        signOutError
      );
    }

    if (typeof window !== 'undefined') {
      try {
        Object.keys(window.localStorage)
          .filter(key => key.startsWith('sb-') || key.includes('supabase'))
          .forEach(key => window.localStorage.removeItem(key));
      } catch (storageError) {
        console.warn(
          'Failed to clear Supabase entries from localStorage',
          storageError
        );
      }
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:signout'));
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    // Get initial session with timeout and error handling
    const initializeAuth = async () => {
      try {
        // Try to get session with retry logic for mobile
        let attempts = 0;
        const maxAttempts = 3;
        let result: {
          data: { session: Session | null };
          error: AuthError | null;
        } | null = null;

        while (attempts < maxAttempts && !result) {
          attempts++;

          try {
            const sessionPromise = supabase.auth.getSession();
            const timeoutPromise = new Promise<never>((_, reject) => {
              timeoutId = setTimeout(() => {
                reject(new Error('Session check timeout'));
              }, 15000); // 15 second timeout per attempt
            });

            result = (await Promise.race([sessionPromise, timeoutPromise])) as {
              data: { session: Session | null };
              error: AuthError | null;
            };

            // Clear timeout if successful
            if (timeoutId) clearTimeout(timeoutId);
          } catch (attemptError) {
            console.warn(`Auth attempt ${attempts} failed:`, attemptError);
            if (timeoutId) clearTimeout(timeoutId);

            // If not last attempt, wait before retry
            if (attempts < maxAttempts) {
              await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second between retries
            } else {
              // Last attempt failed, throw error
              throw attemptError;
            }
          }
        }

        if (isMounted && result) {
          const {
            data: { session },
            error,
          } = result;
          if (error) {
            console.error('Failed to get session:', error);
            if (isInvalidRefreshError(error)) {
              await clearInvalidSession('initial getSession');
              return;
            }
            // Still set loading to false even on error
            setSession(null);
            setUser(null);
            setLoading(false);
          } else {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (isMounted) {
          if (isInvalidRefreshError(error)) {
            await clearInvalidSession('initialization catch');
          } else {
            // Always set loading to false, even on error
            setSession(null);
            setUser(null);
            setLoading(false);
          }
        }
      } finally {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes with proper event handling
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (isMounted) {
        // Handle different auth events
        if (
          event === 'SIGNED_OUT' ||
          (!session?.user && event === 'TOKEN_REFRESHED')
        ) {
          // Clear profile cache when user signs out
          // Note: auth:signout event is dispatched from signOut() function
          // to avoid duplicate events and ensure proper cleanup order
          clearProfileCache();
        }

        if (!session?.user && event === 'TOKEN_REFRESHED') {
          // Supabase may emit TOKEN_REFRESHED with null session when refresh fails
          await clearInvalidSession('token refresh');
          return;
        }

        // Handle email confirmation - auto-login after verification
        if (event === 'SIGNED_IN' && session?.user) {
          // Invalidate all queries to force fresh data fetch on sign in
          if (typeof window !== 'undefined') {
            window.dispatchEvent(
              new CustomEvent('auth:signin', {
                detail: { userId: session.user.id },
              })
            );
          }

          // Check if user just verified their email (email_confirmed_at is recent)
          const emailConfirmedAt = session.user.email_confirmed_at;
          if (emailConfirmedAt) {
            const confirmedTime = new Date(emailConfirmedAt).getTime();
            const now = Date.now();
            // If email was confirmed in the last 5 minutes, it's a fresh verification
            if (now - confirmedTime < 5 * 60 * 1000) {
              // Dispatch event to redirect to dashboard
              if (typeof window !== 'undefined') {
                window.dispatchEvent(
                  new CustomEvent('auth:verified', {
                    detail: { user: session.user },
                  })
                );
              }
            }
          }
        }

        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      subscription.unsubscribe();
    };
  }, [clearInvalidSession, isInvalidRefreshError]);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle PWA resume from background (fixes mobile data loading issue)
  useEffect(() => {
    const handleVisibilityChange = async () => {
      // Only refresh when PWA becomes visible (user switches back)
      if (!document.hidden) {
        try {
          // Get fresh session without timeout - direct call
          const {
            data: { session },
            error,
          } = await supabase.auth.getSession();

          if (error) {
            console.warn('Session refresh on resume failed:', error);
            // Handle invalid session same as existing code
            if (isInvalidRefreshError(error)) {
              await clearInvalidSession('visibility change');
            }
          } else if (session) {
            // Session valid - update state
            setSession(session);
            setUser(session.user);
          }
        } catch (error) {
          console.warn('Error refreshing session on resume:', error);
          // Silent fail - don't disrupt user experience
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isInvalidRefreshError, clearInvalidSession]);

  // Handle offline mode
  useEffect(() => {
    if (!isOnline && !user) {
      // If offline and no user, enable offline mode
      setIsOfflineMode(true);
    } else if (isOnline && isOfflineMode) {
      // If back online, disable offline mode
      setIsOfflineMode(false);
    }
  }, [isOnline, user, isOfflineMode]);

  const enableOfflineMode = () => {
    setIsOfflineMode(true);
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    if (!isOnline) {
      const error = new Error('Cannot sign up while offline') as AuthError;
      error.code = 'offline_error';
      return { error };
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          // Redirect to confirmation page after email verification
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      });

      // Handle errors using the error handler
      if (error) {
        logAuthError(error, 'signUp');
        const errorInfo = handleAuthError(error, 'signUp');
        const friendlyError = new Error(errorInfo.userMessage) as AuthError;
        friendlyError.code = error.code || 'signup_error';
        return { error: friendlyError };
      }

      return { error };
    } catch (error) {
      logAuthError(error as AuthError, 'signUp', 'catch block');
      if (isInvalidRefreshError(error)) {
        await clearInvalidSession('signUp catch');
      }
      const errorInfo = handleAuthError(error as AuthError, 'signUp');
      const friendlyError = new Error(errorInfo.userMessage) as AuthError;
      friendlyError.code = 'network_error';
      return { error: friendlyError };
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isOnline) {
      const error = new Error('Cannot sign in while offline') as AuthError;
      error.code = 'offline_error';
      return { error };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // Handle errors using the error handler
      if (error) {
        logAuthError(error, 'signIn');
        const errorInfo = handleAuthError(error, 'signIn');
        const friendlyError = new Error(errorInfo.userMessage) as AuthError;
        friendlyError.code = error.code || 'signin_error';
        return { error: friendlyError };
      }

      // Wait for onAuthStateChange to fire and update user state
      // This ensures the user state is set before navigation happens
      if (data.session?.user) {
        let retries = 0;
        const maxRetries = 30; // 30 retries × 100ms = 3 seconds max
        while (retries < maxRetries) {
          try {
            // Check if user state has been updated by onAuthStateChange
            const currentSession = await supabase.auth.getSession();
            if (
              currentSession.data.session?.user?.id === data.session.user.id
            ) {
              // Wait a bit more to ensure onAuthStateChange has fired and state is updated
              await new Promise(resolve => setTimeout(resolve, 100));
              break;
            }
          } catch (pollError) {
            if (isInvalidRefreshError(pollError)) {
              await clearInvalidSession('post-login polling');
            }
            break;
          }
          await new Promise(resolve => setTimeout(resolve, 100));
          retries++;
        }
      }

      return { error };
    } catch (error) {
      logAuthError(error as AuthError, 'signIn', 'catch block');
      if (isInvalidRefreshError(error)) {
        await clearInvalidSession('signIn catch');
      }
      const errorInfo = handleAuthError(error as AuthError, 'signIn');
      const friendlyError = new Error(errorInfo.userMessage) as AuthError;
      friendlyError.code = 'network_error';
      return { error: friendlyError };
    }
  };

  const signInWithGoogle = async () => {
    if (!isOnline) {
      const error = new Error(
        'Cannot sign in with Google while offline'
      ) as AuthError;
      error.code = 'offline_error';
      return { error };
    }

    try {
      // Google OAuth sign-in with proper redirect URL
      // This must match the URL configured in Supabase Dashboard > Authentication > URL Configuration
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          // Use PKCE flow for better security (already configured in client)
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      // Handle errors using the error handler
      if (error) {
        logAuthError(error, 'signInWithGoogle');
        const errorInfo = handleAuthError(error, 'signInWithGoogle');
        const friendlyError = new Error(errorInfo.userMessage) as AuthError;
        friendlyError.code = error.code || 'google_signin_error';
        return { error: friendlyError };
      }

      return { error };
    } catch (error) {
      logAuthError(error as AuthError, 'signInWithGoogle', 'catch block');
      if (isInvalidRefreshError(error)) {
        await clearInvalidSession('signInWithGoogle catch');
      }
      const errorInfo = handleAuthError(error as AuthError, 'signInWithGoogle');
      const friendlyError = new Error(errorInfo.userMessage) as AuthError;
      friendlyError.code = 'network_error';
      return { error: friendlyError };
    }
  };

  const signOut = async () => {
    // Always clear local state immediately for consistent behavior
    setUser(null);
    setSession(null);
    clearProfileCache();

    // Always call supabase.auth.signOut() to clear Supabase session storage
    // This ensures localStorage is cleared even when offline
    try {
      await supabase.auth.signOut();
    } catch (error) {
      // Ignore errors from signOut when offline - we still want to clear local state
      if (isOnline) {
        logAuthError(error as AuthError, 'signOut');
      }
    }

    // Clear offline reports from IndexedDB to prevent data leakage between users
    try {
      await offlineStorage.clearAllPendingReports();
    } catch (error) {
      // Log but don't fail sign out if clearing offline reports fails
      console.warn('Failed to clear offline reports on sign out:', error);
    }

    // Dispatch event to clear React Query cache
    // Wait a tick to ensure event listeners have processed
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:signout'));
      // Small delay to ensure React Query cache is cleared before function returns
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    return { error: null };
  };

  const value = {
    user,
    session,
    loading,
    isOfflineMode,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    enableOfflineMode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
