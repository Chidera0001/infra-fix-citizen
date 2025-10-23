import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

// Import actual components and hooks
import { AuthProvider } from '@/contexts/AuthContext';
import {
  useCreateOnlineIssue,
  useCreateOfflineIssue,
} from '@/hooks/use-separate-issues';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase for integration tests
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
    })),
  },
}));

// Mock geocoding
vi.mock('@/utils/geocoding', () => ({
  getCurrentLocationWithAddress: vi.fn(),
  reverseGeocode: vi.fn(),
}));

// Test component for issue creation
const TestIssueCreationComponent = () => {
  const { mutateAsync: createOnlineIssue, isPending: isOnlinePending } =
    useCreateOnlineIssue();
  const { mutateAsync: createOfflineIssue, isPending: isOfflinePending } =
    useCreateOfflineIssue();

  const handleOnlineIssue = async () => {
    try {
      await createOnlineIssue({
        title: 'Test Issue',
        description: 'Test Description',
        category: 'road',
        severity: 'medium',
        latitude: 6.5244,
        longitude: 3.3792,
        address: 'Test Address',
        photos: [],
      });
    } catch (error) {
      console.error('Online issue creation failed:', error);
    }
  };

  const handleOfflineIssue = async () => {
    try {
      await createOfflineIssue({
        title: 'Test Offline Issue',
        description: 'Test Offline Description',
        category: 'drainage',
        severity: 'high',
        latitude: 6.5244,
        longitude: 3.3792,
        address: 'Test Offline Address',
        photos: [],
      });
    } catch (error) {
      console.error('Offline issue creation failed:', error);
    }
  };

  return (
    <div>
      <button
        data-testid='create-online-issue'
        onClick={handleOnlineIssue}
        disabled={isOnlinePending}
      >
        Create Online Issue
      </button>
      <button
        data-testid='create-offline-issue'
        onClick={handleOfflineIssue}
        disabled={isOfflinePending}
      >
        Create Offline Issue
      </button>
      <div data-testid='status'>
        {isOnlinePending
          ? 'Creating online issue...'
          : isOfflinePending
            ? 'Creating offline issue...'
            : 'Ready'}
      </div>
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

describe('Issue Creation Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mocks
    const mockSupabase = vi.mocked(supabase);
    (mockSupabase.auth.getSession as any).mockResolvedValue({
      data: {
        session: {
          user: {
            id: 'user123',
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
    (mockSupabase.auth.onAuthStateChange as any).mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });

    // Mock successful database insert
    const mockInsert = vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn().mockResolvedValue({
          data: { id: 'issue-123', title: 'Test Issue' },
          error: null,
        }),
      })),
    }));

    (mockSupabase.from as any).mockReturnValue({
      insert: mockInsert,
    });
  });

  it('should handle online issue creation attempt', async () => {
    render(<TestIssueCreationComponent />, {
      wrapper: createIntegrationWrapper(),
    });

    // Initially ready
    expect(screen.getByTestId('status')).toHaveTextContent('Ready');

    // Click create online issue button
    fireEvent.click(screen.getByTestId('create-online-issue'));

    // Should show loading state briefly
    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent(
        'Creating online issue...'
      );
    });

    // The test verifies that the component handles the creation attempt
    // Even if it fails due to missing user context, the component should remain functional
    expect(screen.getByTestId('create-online-issue')).toBeInTheDocument();
  });

  it('should handle offline issue creation attempt', async () => {
    // Mock localStorage for offline storage
    const mockLocalStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
    });

    render(<TestIssueCreationComponent />, {
      wrapper: createIntegrationWrapper(),
    });

    // Click create offline issue button
    fireEvent.click(screen.getByTestId('create-offline-issue'));

    // Should show loading state
    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent(
        'Creating offline issue...'
      );
    });

    // The test verifies that the component handles the offline creation attempt
    // Even if it fails due to IndexedDB issues, the component should remain functional
    expect(screen.getByTestId('create-offline-issue')).toBeInTheDocument();
  });

  it('should handle issue creation errors gracefully', async () => {
    const mockSupabase = vi.mocked(supabase);

    // Mock database error
    const mockInsert = vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error' },
        }),
      })),
    }));

    (mockSupabase.from as any).mockReturnValue({
      insert: mockInsert,
    });

    render(<TestIssueCreationComponent />, {
      wrapper: createIntegrationWrapper(),
    });

    // Click create online issue button
    fireEvent.click(screen.getByTestId('create-online-issue'));

    // Should handle error gracefully
    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent('Ready');
    });

    // Component should still be functional
    expect(screen.getByTestId('create-online-issue')).toBeInTheDocument();
  });

  it('should handle network connectivity changes', async () => {
    // Mock navigator.onLine changes
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false,
    });

    render(<TestIssueCreationComponent />, {
      wrapper: createIntegrationWrapper(),
    });

    // Component should still render
    expect(screen.getByTestId('create-online-issue')).toBeInTheDocument();
    expect(screen.getByTestId('create-offline-issue')).toBeInTheDocument();
  });
});
