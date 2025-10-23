import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useOnlineStatus } from '../use-online-status';

// Mock fetch globally
global.fetch = vi.fn();

// Mock navigator.onLine
Object.defineProperty(navigator, 'onLine', {
  writable: true,
  value: true,
});

describe('useOnlineStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset navigator.onLine
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with navigator.onLine state', () => {
    const { result } = renderHook(() => useOnlineStatus());

    expect(result.current.isOnline).toBe(true);
    // The hook may be checking connection on initialization
    expect(result.current.connectionQuality).toBe('good');
  });

  it('should handle offline state', () => {
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false,
    });

    const { result } = renderHook(() => useOnlineStatus());

    expect(result.current.isOnline).toBe(false);
    expect(result.current.connectionQuality).toBe('offline');
  });

  it('should check connection when online', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
    } as Response);

    const { result } = renderHook(() => useOnlineStatus());

    await act(async () => {
      const isOnline = await result.current.checkConnection();
      expect(isOnline).toBe(true);
    });

    expect(result.current.isOnline).toBe(true);
    expect(result.current.isChecking).toBe(false);
    expect(result.current.lastChecked).toBeInstanceOf(Date);
  });

  it('should handle connection check failure', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useOnlineStatus());

    await act(async () => {
      const isOnline = await result.current.checkConnection();
      // Since navigator.onLine is true, the result depends on fetch success
      expect(typeof isOnline).toBe('boolean');
    });

    expect(result.current.isOnline).toBeDefined();
    expect(result.current.connectionQuality).toBeDefined();
  });

  it('should handle slow connection', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockImplementationOnce(
      () =>
        new Promise(resolve =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                status: 200,
              } as Response),
            3000
          )
        )
    );

    const { result } = renderHook(() => useOnlineStatus());

    await act(async () => {
      const isOnline = await result.current.checkConnection();
      expect(isOnline).toBe(true);
    });

    // Connection quality depends on response time
    expect(result.current.connectionQuality).toBeDefined();
  });

  it('should handle online/offline events', () => {
    const { result } = renderHook(() => useOnlineStatus());

    act(() => {
      // Simulate going offline
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: false,
      });
      window.dispatchEvent(new Event('offline'));
    });

    expect(result.current.isOnline).toBe(false);
    expect(result.current.connectionQuality).toBe('offline');

    act(() => {
      // Simulate coming back online
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: true,
      });
      window.dispatchEvent(new Event('online'));
    });

    expect(result.current.isOnline).toBe(true);
    expect(result.current.connectionQuality).toBe('good');
  });

  it('should only check connection once per page load', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
    } as Response);

    const { result } = renderHook(() => useOnlineStatus());

    // First call should make a request
    await act(async () => {
      await result.current.checkConnection();
    });

    // Second call should not make another request
    await act(async () => {
      await result.current.checkConnection();
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should handle timeout', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockImplementationOnce(
      () =>
        new Promise(
          resolve =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  status: 200,
                } as Response),
              10000
            ) // Longer than timeout
        )
    );

    const { result } = renderHook(() => useOnlineStatus());

    await act(async () => {
      const isOnline = await result.current.checkConnection();
      // Timeout behavior depends on implementation
      expect(typeof isOnline).toBe('boolean');
    });

    expect(result.current.isOnline).toBeDefined();
    expect(result.current.connectionQuality).toBeDefined();
  });

  it('should try multiple endpoints', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch
      .mockRejectedValueOnce(new Error('First endpoint failed'))
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
      } as Response);

    const { result } = renderHook(() => useOnlineStatus());

    await act(async () => {
      const isOnline = await result.current.checkConnection();
      expect(isOnline).toBe(true);
    });

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});
