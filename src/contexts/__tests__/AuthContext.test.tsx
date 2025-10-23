import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '../AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase
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

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock navigator.onLine
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true,
    });
  });

  it('should provide initial state', () => {
    const mockSupabase = vi.mocked(supabase);
    (mockSupabase.auth.getSession as any).mockResolvedValue({
      data: { session: null },
      error: null,
    });
    (mockSupabase.auth.onAuthStateChange as any).mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    expect(result.current.user).toBeNull();
    expect(result.current.session).toBeNull();
    expect(result.current.loading).toBe(true);
    expect(result.current.isOfflineMode).toBe(false);
    expect(typeof result.current.signUp).toBe('function');
    expect(typeof result.current.signIn).toBe('function');
    expect(typeof result.current.signInWithGoogle).toBe('function');
    expect(typeof result.current.signOut).toBe('function');
    expect(typeof result.current.enableOfflineMode).toBe('function');
  });

  it('should handle successful sign up', async () => {
    const mockSupabase = vi.mocked(supabase);
    (mockSupabase.auth.getSession as any).mockResolvedValue({
      data: { session: null },
      error: null,
    });
    (mockSupabase.auth.onAuthStateChange as any).mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
    (mockSupabase.auth.signUp as any).mockResolvedValue({
      data: { user: { id: '123', email: 'test@example.com' } },
      error: null,
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      const response = await result.current.signUp(
        'test@example.com',
        'password123',
        'Test User'
      );
      expect(response.error).toBeNull();
    });

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

  it('should handle sign up error', async () => {
    const mockSupabase = vi.mocked(supabase);
    (mockSupabase.auth.getSession as any).mockResolvedValue({
      data: { session: null },
      error: null,
    });
    (mockSupabase.auth.onAuthStateChange as any).mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });

    const mockError = new Error('Sign up failed');
    (mockSupabase.auth.signUp as any).mockResolvedValue({
      data: { user: null },
      error: mockError as any,
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      const response = await result.current.signUp(
        'test@example.com',
        'password123',
        'Test User'
      );
      expect(response.error).toBe(mockError);
    });
  });

  it('should handle successful sign in', async () => {
    const mockSupabase = vi.mocked(supabase);
    (mockSupabase.auth.getSession as any).mockResolvedValue({
      data: { session: null },
      error: null,
    });
    (mockSupabase.auth.onAuthStateChange as any).mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
    (mockSupabase.auth.signInWithPassword as any).mockResolvedValue({
      data: { user: { id: '123', email: 'test@example.com' } },
      error: null,
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      const response = await result.current.signIn(
        'test@example.com',
        'password123'
      );
      expect(response.error).toBeNull();
    });

    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('should handle Google sign in', async () => {
    const mockSupabase = vi.mocked(supabase);
    (mockSupabase.auth.getSession as any).mockResolvedValue({
      data: { session: null },
      error: null,
    });
    (mockSupabase.auth.onAuthStateChange as any).mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
    (mockSupabase.auth.signInWithOAuth as any).mockResolvedValue({
      data: { provider: 'google', url: 'https://google.com' },
      error: null,
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      const response = await result.current.signInWithGoogle();
      expect(response.error).toBeNull();
    });

    expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/citizen`,
      },
    });
  });

  it('should handle sign out', async () => {
    const mockSupabase = vi.mocked(supabase);
    (mockSupabase.auth.getSession as any).mockResolvedValue({
      data: { session: null },
      error: null,
    });
    (mockSupabase.auth.onAuthStateChange as any).mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
    (mockSupabase.auth.signOut as any).mockResolvedValue({
      error: null,
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      const response = await result.current.signOut();
      expect(response.error).toBeNull();
    });

    expect(mockSupabase.auth.signOut).toHaveBeenCalled();
  });

  it('should handle offline mode', () => {
    const mockSupabase = vi.mocked(supabase);
    (mockSupabase.auth.getSession as any).mockResolvedValue({
      data: { session: null },
      error: null,
    });
    (mockSupabase.auth.onAuthStateChange as any).mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });

    // Set offline
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false,
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.enableOfflineMode();
    });

    expect(result.current.isOfflineMode).toBe(true);
  });

  it('should prevent sign up when offline', async () => {
    const mockSupabase = vi.mocked(supabase);
    (mockSupabase.auth.getSession as any).mockResolvedValue({
      data: { session: null },
      error: null,
    });
    (mockSupabase.auth.onAuthStateChange as any).mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });

    // Set offline
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false,
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      const response = await result.current.signUp(
        'test@example.com',
        'password123',
        'Test User'
      );
      expect(response.error).toBeDefined();
      expect(response.error?.code).toBe('offline_error');
    });

    expect(mockSupabase.auth.signUp).not.toHaveBeenCalled();
  });

  it('should prevent sign in when offline', async () => {
    const mockSupabase = vi.mocked(supabase);
    (mockSupabase.auth.getSession as any).mockResolvedValue({
      data: { session: null },
      error: null,
    });
    (mockSupabase.auth.onAuthStateChange as any).mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });

    // Set offline
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false,
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      const response = await result.current.signIn(
        'test@example.com',
        'password123'
      );
      expect(response.error).toBeDefined();
      expect(response.error?.code).toBe('offline_error');
    });

    expect(mockSupabase.auth.signInWithPassword).not.toHaveBeenCalled();
  });

  it('should handle offline sign out', async () => {
    const mockSupabase = vi.mocked(supabase);
    (mockSupabase.auth.getSession as any).mockResolvedValue({
      data: { session: null },
      error: null,
    });
    (mockSupabase.auth.onAuthStateChange as any).mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });

    // Set offline
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false,
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      const response = await result.current.signOut();
      expect(response.error).toBeNull();
    });

    expect(mockSupabase.auth.signOut).not.toHaveBeenCalled();
  });

  it('should throw error when used outside provider', () => {
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within an AuthProvider');
  });
});
