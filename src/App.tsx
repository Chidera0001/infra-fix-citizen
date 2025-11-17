import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import AuthGuard from './components/auth/AuthGuard';
import AdminAuthGuard from './components/admin/AdminAuthGuard';
import { PWAUpdatePrompt } from '@/components/PWAUpdatePrompt';
import { PWAUpdateNotification } from '@/components/PWAUpdateNotification';
import Index from './pages/Index';
import Auth from './pages/Auth';
import EmailConfirm from './pages/EmailConfirm';
import OAuthCallback from './pages/OAuthCallback';
import AdminLogin from './pages/AdminLogin';
import CitizenDashboard from './pages/CitizenDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ApiDocs from './pages/ApiDocs';
import NotFound from './pages/NotFound';
import ReportNow from './pages/ReportNow';
import OfflineReportIssue from './pages/OfflineReportIssue';
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <QueryCacheClearer />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path='/auth' element={<Auth />} />
            <Route path='/auth/confirm' element={<EmailConfirm />} />
            <Route path='/auth/callback' element={<OAuthCallback />} />
            <Route path='/admin-login' element={<AdminLogin />} />
            <Route path='/' element={<Index />} />
            <Route path='/offline-report' element={<OfflineReportIssue />} />
            <Route
              path='/citizen'
              element={
                <AuthGuard requiredRole='citizen'>
                  <CitizenDashboard />
                </AuthGuard>
              }
            />
            <Route
              path='/report-now'
              element={
                <AuthGuard requiredRole='citizen'>
                  <ReportNow />
                </AuthGuard>
              }
            />
            <Route
              path='/admin-citizn'
              element={
                <AdminAuthGuard>
                  <AdminDashboard />
                </AdminAuthGuard>
              }
            />
            <Route path='/api-docs' element={<ApiDocs />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <PWAUpdatePrompt />
        <PWAUpdateNotification />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
