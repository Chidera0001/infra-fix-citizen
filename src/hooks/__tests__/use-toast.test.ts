import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToast } from '../use-toast';

describe('useToast', () => {
  beforeEach(() => {
    // Clear any existing toasts
    vi.clearAllMocks();
  });

  it('should initialize with empty toasts array', () => {
    const { result } = renderHook(() => useToast());

    expect(result.current.toasts).toEqual([]);
    expect(typeof result.current.toast).toBe('function');
    expect(typeof result.current.dismiss).toBe('function');
  });

  it('should add a toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({
        title: 'Test Title',
        description: 'Test Description',
      });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].title).toBe('Test Title');
    expect(result.current.toasts[0].description).toBe('Test Description');
    expect(result.current.toasts[0].open).toBe(true);
    expect(result.current.toasts[0].id).toBeDefined();
  });

  it('should add multiple toasts', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({
        title: 'First Toast',
        description: 'First Description',
      });
      result.current.toast({
        title: 'Second Toast',
        description: 'Second Description',
      });
    });

    // Toast limit is 1, so only the most recent toast should be kept
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].title).toBe('Second Toast'); // Most recent first
  });

  it('should dismiss a specific toast', () => {
    const { result } = renderHook(() => useToast());

    let toastId: string;
    act(() => {
      const toast = result.current.toast({
        title: 'Test Toast',
        description: 'Test Description',
      });
      toastId = toast.id;
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].open).toBe(true);

    act(() => {
      result.current.dismiss(toastId);
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].open).toBe(false);
  });

  it('should dismiss all toasts', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({
        title: 'First Toast',
        description: 'First Description',
      });
      result.current.toast({
        title: 'Second Toast',
        description: 'Second Description',
      });
    });

    // Toast limit is 1, so only one toast exists
    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      result.current.dismiss();
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].open).toBe(false);
  });

  it('should handle toast with variant', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({
        title: 'Error Toast',
        description: 'Something went wrong',
        variant: 'destructive',
      });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].variant).toBe('destructive');
  });

  it('should handle toast with action', () => {
    const { result } = renderHook(() => useToast());

    const mockAction = {
      altText: 'Undo',
      onClick: vi.fn(),
    };

    act(() => {
      result.current.toast({
        title: 'Action Toast',
        description: 'With action button',
        action: mockAction as any,
      });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].action).toBe(mockAction);
  });

  it('should limit toast count', () => {
    const { result } = renderHook(() => useToast());

    // Add more toasts than the limit (TOAST_LIMIT = 1)
    act(() => {
      result.current.toast({
        title: 'First Toast',
        description: 'First Description',
      });
      result.current.toast({
        title: 'Second Toast',
        description: 'Second Description',
      });
      result.current.toast({
        title: 'Third Toast',
        description: 'Third Description',
      });
    });

    // Should only keep the most recent toast
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].title).toBe('Third Toast');
  });

  it('should return toast with update and dismiss methods', () => {
    const { result } = renderHook(() => useToast());

    let toastReturn: any;
    act(() => {
      toastReturn = result.current.toast({
        title: 'Test Toast',
        description: 'Test Description',
      });
    });

    expect(toastReturn).toHaveProperty('id');
    expect(toastReturn).toHaveProperty('dismiss');
    expect(toastReturn).toHaveProperty('update');
    expect(typeof toastReturn.dismiss).toBe('function');
    expect(typeof toastReturn.update).toBe('function');
  });

  it('should update toast', () => {
    const { result } = renderHook(() => useToast());

    let toastReturn: any;
    act(() => {
      toastReturn = result.current.toast({
        title: 'Original Title',
        description: 'Original Description',
      });
    });

    act(() => {
      toastReturn.update({
        title: 'Updated Title',
        description: 'Updated Description',
      });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].title).toBe('Updated Title');
    expect(result.current.toasts[0].description).toBe('Updated Description');
  });
});
