import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import {
  useCreateOnlineIssue,
  useCreateOfflineIssue,
} from '../use-separate-issues';
import { issuesApi } from '@/lib/supabase-api';
import { offlineStorage } from '@/utils/offlineStorage';
import { useToast } from '../use-toast';

// Mock dependencies
vi.mock('@/lib/supabase-api');
vi.mock('@/utils/offlineStorage');
vi.mock('../use-toast');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useCreateOnlineIssue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create online issue successfully', async () => {
    const mockIssuesApi = vi.mocked(issuesApi);
    const mockToast = vi.mocked(useToast);

    mockIssuesApi.createIssue.mockResolvedValue({ id: '123' });
    mockToast.mockReturnValue({
      toast: vi.fn(),
      toasts: [],
      dismiss: vi.fn(),
    });

    const { result } = renderHook(() => useCreateOnlineIssue(), {
      wrapper: createWrapper(),
    });

    const issueData = {
      title: 'Test Issue',
      description: 'Test Description',
      category: 'pothole' as const,
      severity: 'medium' as const,
      address: 'Test Address',
      location_lat: 6.5244,
      location_lng: 3.3792,
    };

    await act(async () => {
      await result.current.mutateAsync({
        issueData,
        userId: 'user123',
        photos: [],
      });
    });

    expect(mockIssuesApi.createIssue).toHaveBeenCalledWith(
      issueData,
      'user123',
      []
    );
  });

  it('should handle creation error', async () => {
    const mockIssuesApi = vi.mocked(issuesApi);
    const mockToast = vi.mocked(useToast);
    const mockToastFn = vi.fn();

    mockIssuesApi.createIssue.mockRejectedValue(new Error('API Error'));
    mockToast.mockReturnValue({
      toast: mockToastFn,
      toasts: [],
      dismiss: vi.fn(),
    });

    const { result } = renderHook(() => useCreateOnlineIssue(), {
      wrapper: createWrapper(),
    });

    const issueData = {
      title: 'Test Issue',
      description: 'Test Description',
      category: 'pothole' as const,
      severity: 'medium' as const,
      address: 'Test Address',
      location_lat: 6.5244,
      location_lng: 3.3792,
    };

    await act(async () => {
      try {
        await result.current.mutateAsync({
          issueData,
          userId: 'user123',
          photos: [],
        });
      } catch (error) {
        // Expected to throw
      }
    });

    expect(mockToastFn).toHaveBeenCalledWith({
      title: 'Error',
      description: 'API Error',
      variant: 'destructive',
    });
  });
});

describe('useCreateOfflineIssue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create offline issue successfully', async () => {
    const mockOfflineStorage = vi.mocked(offlineStorage);
    const mockToast = vi.mocked(useToast);
    const mockToastFn = vi.fn();

    mockOfflineStorage.savePendingReport.mockResolvedValue('offline123');
    mockToast.mockReturnValue({
      toast: mockToastFn,
      toasts: [],
      dismiss: vi.fn(),
    });

    const { result } = renderHook(() => useCreateOfflineIssue(), {
      wrapper: createWrapper(),
    });

    const issueData = {
      title: 'Test Issue',
      description: 'Test Description',
      category: 'pothole' as const,
      severity: 'medium' as const,
      address: 'Test Address',
      location_lat: 6.5244,
      location_lng: 3.3792,
    };

    await act(async () => {
      const response = await result.current.mutateAsync({
        issueData,
        userId: 'user123',
        photos: [],
      });

      expect(response).toEqual({ id: 'offline123', offline: true });
    });

    expect(mockOfflineStorage.savePendingReport).toHaveBeenCalledWith({
      issueData,
      userId: 'user123',
      photos: [],
    });

    expect(mockToastFn).toHaveBeenCalledWith({
      title: 'Report Saved Offline',
      description: "Your report will be submitted when you're back online",
    });
  });

  it('should handle offline creation error', async () => {
    const mockOfflineStorage = vi.mocked(offlineStorage);
    const mockToast = vi.mocked(useToast);
    const mockToastFn = vi.fn();

    mockOfflineStorage.savePendingReport.mockRejectedValue(
      new Error('Storage Error')
    );
    mockToast.mockReturnValue({
      toast: mockToastFn,
      toasts: [],
      dismiss: vi.fn(),
    });

    const { result } = renderHook(() => useCreateOfflineIssue(), {
      wrapper: createWrapper(),
    });

    const issueData = {
      title: 'Test Issue',
      description: 'Test Description',
      category: 'pothole' as const,
      severity: 'medium' as const,
      address: 'Test Address',
      location_lat: 6.5244,
      location_lng: 3.3792,
    };

    await act(async () => {
      try {
        await result.current.mutateAsync({
          issueData,
          userId: 'user123',
          photos: [],
        });
      } catch (error) {
        // Expected to throw
      }
    });

    expect(mockToastFn).toHaveBeenCalledWith({
      title: 'Error',
      description: 'Storage Error',
      variant: 'destructive',
    });
  });

  it('should handle photos in offline issue', async () => {
    const mockOfflineStorage = vi.mocked(offlineStorage);
    const mockToast = vi.mocked(useToast);

    mockOfflineStorage.savePendingReport.mockResolvedValue('offline123');
    mockToast.mockReturnValue({
      toast: vi.fn(),
      toasts: [],
      dismiss: vi.fn(),
    });

    const { result } = renderHook(() => useCreateOfflineIssue(), {
      wrapper: createWrapper(),
    });

    const mockPhotos = [
      new File(['photo1'], 'photo1.jpg', { type: 'image/jpeg' }),
      new File(['photo2'], 'photo2.jpg', { type: 'image/jpeg' }),
    ];

    const issueData = {
      title: 'Test Issue',
      description: 'Test Description',
      category: 'pothole' as const,
      severity: 'medium' as const,
      address: 'Test Address',
      location_lat: 6.5244,
      location_lng: 3.3792,
    };

    await act(async () => {
      await result.current.mutateAsync({
        issueData,
        userId: 'user123',
        photos: mockPhotos,
      });
    });

    expect(mockOfflineStorage.savePendingReport).toHaveBeenCalledWith({
      issueData,
      userId: 'user123',
      photos: mockPhotos,
    });
  });
});
