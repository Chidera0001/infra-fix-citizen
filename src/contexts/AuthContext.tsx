import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { clearProfileCache } from '@/lib/supabase-api';
import { handleAuthError, logAuthError } from '@/utils/authErrorHandler';

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Clear profile cache when user signs out
      if (!session?.user) {
        clearProfileCache();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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
      const { error } = await supabase.auth.signInWithPassword({
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

      return { error };
    } catch (error) {
      logAuthError(error as AuthError, 'signIn', 'catch block');
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
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/citizen`,
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
      const errorInfo = handleAuthError(error as AuthError, 'signInWithGoogle');
      const friendlyError = new Error(errorInfo.userMessage) as AuthError;
      friendlyError.code = 'network_error';
      return { error: friendlyError };
    }
  };

  const signOut = async () => {
    if (!isOnline) {
      // Handle offline sign out by clearing local state
      setUser(null);
      setSession(null);
      clearProfileCache(); // Clear cache on offline sign out too
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.signOut();

      // Handle errors using the error handler
      if (error) {
        logAuthError(error, 'signOut');
        const errorInfo = handleAuthError(error, 'signOut');

        // Always clear local state for sign out, regardless of error
        if (errorInfo.shouldClearLocalState) {
          setUser(null);
          setSession(null);
          clearProfileCache();
        }

        return { error: null }; // Don't return the error for sign out
      }

      return { error };
    } catch (error) {
      logAuthError(error as AuthError, 'signOut', 'catch block');
      const errorInfo = handleAuthError(error as AuthError, 'signOut');

      // Always clear local state for sign out, regardless of error
      setUser(null);
      setSession(null);
      clearProfileCache();

      return { error: null }; // Don't return the error for sign out
    }
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
