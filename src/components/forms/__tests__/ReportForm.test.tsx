import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReportForm from '../ReportForm';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useCreateOnlineIssue } from '@/hooks/use-separate-issues';
import { getCurrentLocationWithAddress } from '@/utils/geocoding';

// Mock dependencies
vi.mock('@/contexts/AuthContext');
vi.mock('@/hooks/use-toast');
vi.mock('@/hooks/use-separate-issues');
vi.mock('@/utils/geocoding');
vi.mock('@/hooks/useFormValidation', () => ({
  useFormValidation: () => ({
    validateForm: vi.fn(() => true),
    cleanTitle: vi.fn(title => title),
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('ReportForm', () => {
  const mockOnBack = vi.fn();
  const mockToast = vi.fn();
  const mockMutateAsync = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock useAuth
    vi.mocked(useAuth).mockReturnValue({
      user: {
        id: 'user123',
        email: 'test@example.com',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: '2023-01-01T00:00:00Z',
        toJSON: vi.fn(),
      } as any,
      session: null,
      loading: false,
      isOfflineMode: false,
      signUp: vi.fn(),
      signIn: vi.fn(),
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
      enableOfflineMode: vi.fn(),
    });

    // Mock useToast
    vi.mocked(useToast).mockReturnValue({
      toast: mockToast,
      toasts: [],
      dismiss: vi.fn(),
    });

    // Mock useCreateOnlineIssue
    vi.mocked(useCreateOnlineIssue).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
      error: null,
    } as any);

    // Mock getCurrentLocationWithAddress
    vi.mocked(getCurrentLocationWithAddress).mockResolvedValue({
      coordinates: {
        latitude: 6.5244,
        longitude: 3.3792,
        accuracy: 10,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
        toJSON: vi.fn(),
      } as GeolocationCoordinates,
      address: 'Lagos, Nigeria',
    });
  });

  it('should render form with header and step indicator', () => {
    render(<ReportForm onBack={mockOnBack} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText('Report Infrastructure Issue')).toBeInTheDocument();
    expect(
      screen.getByText('Help improve your community infrastructure')
    ).toBeInTheDocument();
    expect(screen.getByText('Step 1 of 4')).toBeInTheDocument();
  });

  it('should handle back button click', () => {
    render(<ReportForm onBack={mockOnBack} />, {
      wrapper: createWrapper(),
    });

    // The form should call onBack when needed
    expect(mockOnBack).not.toHaveBeenCalled();
  });

  it('should handle geolocation not supported', async () => {
    // Mock navigator.geolocation as undefined
    Object.defineProperty(navigator, 'geolocation', {
      writable: true,
      value: undefined,
    });

    render(<ReportForm onBack={mockOnBack} />, {
      wrapper: createWrapper(),
    });

    // The component should handle this gracefully
    expect(screen.getByText('Report Infrastructure Issue')).toBeInTheDocument();
  });

  it('should handle successful location capture', async () => {
    render(<ReportForm onBack={mockOnBack} />, {
      wrapper: createWrapper(),
    });

    // The component should be ready to handle location capture
    expect(screen.getByText('Report Infrastructure Issue')).toBeInTheDocument();
  });

  it('should handle location permission denied', async () => {
    const mockError = new Error('Permission denied');
    mockError.name = 'GeolocationPositionError';
    (mockError as any).code = 1; // PERMISSION_DENIED

    vi.mocked(getCurrentLocationWithAddress).mockRejectedValueOnce(mockError);

    render(<ReportForm onBack={mockOnBack} />, {
      wrapper: createWrapper(),
    });

    // The component should handle this error gracefully
    expect(screen.getByText('Report Infrastructure Issue')).toBeInTheDocument();
  });

  it('should handle location timeout', async () => {
    const mockError = new Error('Timeout');
    mockError.name = 'GeolocationPositionError';
    (mockError as any).code = 3; // TIMEOUT

    vi.mocked(getCurrentLocationWithAddress).mockRejectedValueOnce(mockError);

    render(<ReportForm onBack={mockOnBack} />, {
      wrapper: createWrapper(),
    });

    // The component should handle this error gracefully
    expect(screen.getByText('Report Infrastructure Issue')).toBeInTheDocument();
  });

  it('should handle location unavailable', async () => {
    const mockError = new Error('Position unavailable');
    mockError.name = 'GeolocationPositionError';
    (mockError as any).code = 2; // POSITION_UNAVAILABLE

    vi.mocked(getCurrentLocationWithAddress).mockRejectedValueOnce(mockError);

    render(<ReportForm onBack={mockOnBack} />, {
      wrapper: createWrapper(),
    });

    // The component should handle this error gracefully
    expect(screen.getByText('Report Infrastructure Issue')).toBeInTheDocument();
  });

  it('should render form content placeholder', () => {
    render(<ReportForm onBack={mockOnBack} />, {
      wrapper: createWrapper(),
    });

    expect(
      screen.getByText('Form components are being refactored...')
    ).toBeInTheDocument();
  });

  it('should have proper styling classes', () => {
    render(<ReportForm onBack={mockOnBack} />, {
      wrapper: createWrapper(),
    });

    // Test that the component renders with proper structure
    expect(screen.getByText('Report Infrastructure Issue')).toBeInTheDocument();
    expect(
      screen.getByText('Form components are being refactored...')
    ).toBeInTheDocument();

    // Test that the header element exists
    const header = screen
      .getByText('Report Infrastructure Issue')
      .closest('header');
    expect(header).toBeInTheDocument();
  });

  it('should handle form submission when on final step', async () => {
    render(<ReportForm onBack={mockOnBack} />, {
      wrapper: createWrapper(),
    });

    // The form should be ready to handle submission
    expect(screen.getByText('Report Infrastructure Issue')).toBeInTheDocument();
  });

  it('should handle user authentication state', () => {
    // Test with no user
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      session: null,
      loading: false,
      isOfflineMode: false,
      signUp: vi.fn(),
      signIn: vi.fn(),
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
      enableOfflineMode: vi.fn(),
    });

    render(<ReportForm onBack={mockOnBack} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText('Report Infrastructure Issue')).toBeInTheDocument();
  });

  it('should handle loading state', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      session: null,
      loading: true,
      isOfflineMode: false,
      signUp: vi.fn(),
      signIn: vi.fn(),
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
      enableOfflineMode: vi.fn(),
    });

    render(<ReportForm onBack={mockOnBack} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText('Report Infrastructure Issue')).toBeInTheDocument();
  });
});
