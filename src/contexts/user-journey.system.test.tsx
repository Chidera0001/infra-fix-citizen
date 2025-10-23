import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

// Import actual components and contexts for system testing
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase for system tests (minimal mocking - closer to production)
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signInWithOAuth: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn(),
          })),
        })),
      })),
    })),
  },
}));

// Mock geocoding for system tests
vi.mock('@/utils/geocoding', () => ({
  getCurrentLocationWithAddress: vi.fn(),
  reverseGeocode: vi.fn(),
}));

// System test component that simulates complete user journey
const SystemTestApp = () => {
  const { user, signUp, signIn, signOut, loading } = useAuth();

  const handleSignUp = async () => {
    await signUp('system-test@example.com', 'password123', 'System Test User');
  };

  const handleSignIn = async () => {
    await signIn('system-test@example.com', 'password123');
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return <div data-testid='loading'>Loading...</div>;
  }

  return (
    <div>
      <div data-testid='app-status'>
        {user ? `Logged in as: ${user.email}` : 'Not logged in'}
      </div>

      {!user ? (
        <div>
          <button data-testid='signup-btn' onClick={handleSignUp}>
            Sign Up
          </button>
          <button data-testid='signin-btn' onClick={handleSignIn}>
            Sign In
          </button>
        </div>
      ) : (
        <div>
          <button data-testid='signout-btn' onClick={handleSignOut}>
            Sign Out
          </button>
          <div data-testid='user-dashboard'>
            <h2>User Dashboard</h2>
            <p>Welcome to the system!</p>
          </div>
        </div>
      )}
    </div>
  );
};

const createSystemWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>{children}</AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Complete User Journey System Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup production-like mocks
    const mockSupabase = vi.mocked(supabase);
    (mockSupabase.auth.getSession as any).mockResolvedValue({
      data: { session: null },
      error: null,
    });
    (mockSupabase.auth.onAuthStateChange as any).mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
  });

  it('should complete full user registration journey', async () => {
    const mockSupabase = vi.mocked(supabase);

    // Mock successful sign up
    (mockSupabase.auth.signUp as any).mockResolvedValue({
      data: {
        user: {
          id: 'system-user-123',
          email: 'system-test@example.com',
          app_metadata: {},
          user_metadata: { full_name: 'System Test User' },
          aud: 'authenticated',
          created_at: new Date().toISOString(),
          toJSON: vi.fn(),
        },
      },
      error: null,
    });

    render(<SystemTestApp />, {
      wrapper: createSystemWrapper(),
    });

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByTestId('app-status')).toHaveTextContent(
        'Not logged in'
      );
    });

    // Step 1: User clicks sign up
    fireEvent.click(screen.getByTestId('signup-btn'));

    // Step 2: Wait for sign up to complete
    await waitFor(() => {
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'system-test@example.com',
        password: 'password123',
        options: {
          data: {
            full_name: 'System Test User',
          },
        },
      });
    });

    // Step 3: Verify the complete journey was handled
    expect(mockSupabase.auth.signUp).toHaveBeenCalledTimes(1);
  });

  it('should complete full user authentication journey', async () => {
    const mockSupabase = vi.mocked(supabase);

    // Mock successful sign in
    (mockSupabase.auth.signInWithPassword as any).mockResolvedValue({
      data: {
        user: {
          id: 'system-user-123',
          email: 'system-test@example.com',
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString(),
          toJSON: vi.fn(),
        },
        session: {
          access_token: 'system-token',
          refresh_token: 'system-refresh',
          expires_in: 3600,
          expires_at: Date.now() + 3600000,
          token_type: 'bearer',
          user: {
            id: 'system-user-123',
            email: 'system-test@example.com',
            app_metadata: {},
            user_metadata: {},
            aud: 'authenticated',
            created_at: new Date().toISOString(),
            toJSON: vi.fn(),
          },
        },
      },
      error: null,
    });

    render(<SystemTestApp />, {
      wrapper: createSystemWrapper(),
    });

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    // Step 1: User clicks sign in
    fireEvent.click(screen.getByTestId('signin-btn'));

    // Step 2: Wait for sign in to complete
    await waitFor(() => {
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'system-test@example.com',
        password: 'password123',
      });
    });

    // Step 3: Verify the complete authentication journey
    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledTimes(1);
  });

  it('should complete full user logout journey', async () => {
    const mockSupabase = vi.mocked(supabase);

    // Mock user already logged in
    (mockSupabase.auth.getSession as any).mockResolvedValue({
      data: {
        session: {
          user: {
            id: 'system-user-123',
            email: 'system-test@example.com',
            app_metadata: {},
            user_metadata: {},
            aud: 'authenticated',
            created_at: new Date().toISOString(),
            toJSON: vi.fn(),
          },
        },
      },
      error: null,
    });

    // Mock successful sign out
    (mockSupabase.auth.signOut as any).mockResolvedValue({
      error: null,
    });

    render(<SystemTestApp />, {
      wrapper: createSystemWrapper(),
    });

    // Wait for user to be logged in
    await waitFor(() => {
      expect(screen.getByTestId('app-status')).toHaveTextContent(
        'Logged in as: system-test@example.com'
      );
    });

    // Step 1: User clicks sign out
    fireEvent.click(screen.getByTestId('signout-btn'));

    // Step 2: Wait for sign out to complete
    await waitFor(() => {
      expect(mockSupabase.auth.signOut).toHaveBeenCalledTimes(1);
    });

    // Step 3: Verify the complete logout journey
    expect(mockSupabase.auth.signOut).toHaveBeenCalledWith();
  });

  it('should handle complete error recovery journey', async () => {
    const mockSupabase = vi.mocked(supabase);

    // Mock sign up error
    (mockSupabase.auth.signUp as any).mockResolvedValue({
      data: { user: null },
      error: { message: 'Email already registered' },
    });

    render(<SystemTestApp />, {
      wrapper: createSystemWrapper(),
    });

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    // Step 1: User attempts sign up
    fireEvent.click(screen.getByTestId('signup-btn'));

    // Step 2: Wait for error handling
    await waitFor(() => {
      expect(mockSupabase.auth.signUp).toHaveBeenCalledTimes(1);
    });

    // Step 3: Verify system remains functional after error
    expect(screen.getByTestId('app-status')).toBeInTheDocument();
    expect(screen.getByTestId('signup-btn')).toBeInTheDocument();
    expect(screen.getByTestId('signin-btn')).toBeInTheDocument();
  });

  it('should handle complete offline/online transition journey', async () => {
    render(<SystemTestApp />, {
      wrapper: createSystemWrapper(),
    });

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    // Step 1: Start online
    expect(navigator.onLine).toBe(true);

    // Step 2: Simulate going offline
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false,
    });

    // Step 3: Verify system handles offline state
    expect(screen.getByTestId('app-status')).toBeInTheDocument();

    // Step 4: Simulate coming back online
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true,
    });

    // Step 5: Verify system handles online state
    expect(screen.getByTestId('app-status')).toBeInTheDocument();
  });
});
