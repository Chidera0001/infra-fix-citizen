import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

// Import the actual components and contexts (not mocked)
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase for integration tests (partial mock)
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
  },
}));

// Test component that uses authentication
const TestAuthComponent = () => {
  const { user, signUp, signIn, signOut } = useAuth();

  return (
    <div>
      <div data-testid='user-status'>
        {user ? `Logged in as: ${user.email}` : 'Not logged in'}
      </div>
      <button
        data-testid='signup-btn'
        onClick={() => signUp('test@example.com', 'password123', 'Test User')}
      >
        Sign Up
      </button>
      <button
        data-testid='signin-btn'
        onClick={() => signIn('test@example.com', 'password123')}
      >
        Sign In
      </button>
      <button data-testid='signout-btn' onClick={signOut}>
        Sign Out
      </button>
    </div>
  );
};

const createIntegrationWrapper = () => {
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

describe('Authentication Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mocks
    const mockSupabase = vi.mocked(supabase);
    (mockSupabase.auth.getSession as any).mockResolvedValue({
      data: { session: null },
      error: null,
    });
    (mockSupabase.auth.onAuthStateChange as any).mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
  });

  it('should complete sign up flow integration', async () => {
    const mockSupabase = vi.mocked(supabase);

    // Mock successful sign up
    (mockSupabase.auth.signUp as any).mockResolvedValue({
      data: {
        user: {
          id: '123',
          email: 'test@example.com',
          app_metadata: {},
          user_metadata: { full_name: 'Test User' },
          aud: 'authenticated',
          created_at: new Date().toISOString(),
          toJSON: vi.fn(),
        },
      },
      error: null,
    });

    render(<TestAuthComponent />, {
      wrapper: createIntegrationWrapper(),
    });

    // Initially not logged in
    expect(screen.getByTestId('user-status')).toHaveTextContent(
      'Not logged in'
    );

    // Click sign up button
    fireEvent.click(screen.getByTestId('signup-btn'));

    // Wait for sign up to complete
    await waitFor(() => {
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          data: {
            full_name: 'Test User',
          },
        },
      });
    });

    // Verify the sign up was called with correct parameters
    expect(mockSupabase.auth.signUp).toHaveBeenCalledTimes(1);
  });

  it('should complete sign in flow integration', async () => {
    const mockSupabase = vi.mocked(supabase);

    // Mock successful sign in
    (mockSupabase.auth.signInWithPassword as any).mockResolvedValue({
      data: {
        user: {
          id: '123',
          email: 'test@example.com',
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString(),
          toJSON: vi.fn(),
        },
        session: {
          access_token: 'mock-token',
          refresh_token: 'mock-refresh',
          expires_in: 3600,
          expires_at: Date.now() + 3600000,
          token_type: 'bearer',
          user: {
            id: '123',
            email: 'test@example.com',
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

    render(<TestAuthComponent />, {
      wrapper: createIntegrationWrapper(),
    });

    // Click sign in button
    fireEvent.click(screen.getByTestId('signin-btn'));

    // Wait for sign in to complete
    await waitFor(() => {
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    // Verify the sign in was called with correct parameters
    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledTimes(1);
  });

  it('should handle authentication errors gracefully', async () => {
    const mockSupabase = vi.mocked(supabase);

    // Mock sign up error
    (mockSupabase.auth.signUp as any).mockResolvedValue({
      data: { user: null },
      error: { message: 'Email already registered' },
    });

    render(<TestAuthComponent />, {
      wrapper: createIntegrationWrapper(),
    });

    // Click sign up button
    fireEvent.click(screen.getByTestId('signup-btn'));

    // Wait for error handling
    await waitFor(() => {
      expect(mockSupabase.auth.signUp).toHaveBeenCalledTimes(1);
    });

    // The component should still be functional despite the error
    expect(screen.getByTestId('user-status')).toBeInTheDocument();
  });

  it('should complete sign out flow integration', async () => {
    const mockSupabase = vi.mocked(supabase);

    // Mock successful sign out
    (mockSupabase.auth.signOut as any).mockResolvedValue({
      error: null,
    });

    render(<TestAuthComponent />, {
      wrapper: createIntegrationWrapper(),
    });

    // Click sign out button
    fireEvent.click(screen.getByTestId('signout-btn'));

    // Wait for sign out to complete
    await waitFor(() => {
      expect(mockSupabase.auth.signOut).toHaveBeenCalledTimes(1);
    });

    // Verify sign out was called
    expect(mockSupabase.auth.signOut).toHaveBeenCalledWith();
  });
});
