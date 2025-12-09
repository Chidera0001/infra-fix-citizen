'use client';

import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { PWAUpdatePrompt } from '@/components/PWAUpdatePrompt';
import { PWAUpdateNotification } from '@/components/PWAUpdateNotification';
import { useEffect } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - data considered fresh for 5 minutes
      refetchOnWindowFocus: false, // Don't refetch on window focus to reduce unnecessary API calls
      refetchOnReconnect: true, // Still refetch on reconnect (good for offline support)
      refetchOnMount: true, // Refetch on mount to ensure fresh data
      retry: 1, // Only retry once on failure
    },
  },
});

// Component to clear query cache on sign out and invalidate on sign in
const QueryCacheClearer = () => {
  useEffect(() => {
    const handleSignOut = () => {
      queryClient.clear();
    };

    const handleSignIn = () => {
      // Invalidate all queries to force refetch on sign in
      queryClient.invalidateQueries();
    };

    window.addEventListener('auth:signout', handleSignOut);
    window.addEventListener('auth:signin', handleSignIn);

    return () => {
      window.removeEventListener('auth:signout', handleSignOut);
      window.removeEventListener('auth:signin', handleSignIn);
    };
  }, []);

  return null;
};

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <QueryCacheClearer />
          <Toaster />
          <Sonner />
          {children}
          <PWAUpdatePrompt />
          <PWAUpdateNotification />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

