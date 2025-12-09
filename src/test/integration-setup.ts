import '@testing-library/jest-dom';
import { expect, afterEach, beforeAll, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

// Cleanup after each test case
afterEach(() => {
  cleanup();
});

// Integration test setup
beforeAll(() => {
  // Mock environment variables for integration tests
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test-project.supabase.co';
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

  // Mock navigator for geolocation tests
  Object.defineProperty(navigator, 'geolocation', {
    writable: true,
    value: {
      getCurrentPosition: vi.fn(),
      watchPosition: vi.fn(),
      clearWatch: vi.fn(),
    },
  });

  // Mock online status
  Object.defineProperty(navigator, 'onLine', {
    writable: true,
    value: true,
  });

  // Mock localStorage
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });

  // Mock sessionStorage
  const sessionStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };
  Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock,
  });

  // Mock IndexedDB for offline storage
  const mockIndexedDB = {
    open: vi.fn(() => ({
      result: {
        createObjectStore: vi.fn(),
        transaction: vi.fn(() => ({
          objectStore: vi.fn(() => ({
            add: vi.fn(),
            get: vi.fn(),
            getAll: vi.fn(),
            delete: vi.fn(),
          })),
        })),
      },
      onsuccess: null,
      onerror: null,
      onupgradeneeded: null,
    })),
  };
  Object.defineProperty(window, 'indexedDB', {
    value: mockIndexedDB,
  });

  // Mock GeolocationPositionError
  global.GeolocationPositionError =
    class GeolocationPositionError extends Error {
      static PERMISSION_DENIED = 1;
      static POSITION_UNAVAILABLE = 2;
      static TIMEOUT = 3;

      constructor(code: number, message: string) {
        super(message);
        this.name = 'GeolocationPositionError';
      }
    } as any;
});

afterAll(() => {
  // Clean up any global mocks
  vi.clearAllMocks();
});
