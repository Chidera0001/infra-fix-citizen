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

// System test setup - Production-like environment
beforeAll(() => {
  // Set up production-like environment variables
  process.env.NODE_ENV = 'production';
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://your-production-project.supabase.co';
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'your-production-anon-key';

  // Mock production APIs and services
  Object.defineProperty(navigator, 'geolocation', {
    writable: true,
    value: {
      getCurrentPosition: vi.fn((success, error) => {
        // Simulate real geolocation with slight delay
        setTimeout(() => {
          success({
            coords: {
              latitude: 6.5244,
              longitude: 3.3792,
              accuracy: 10,
              altitude: null,
              altitudeAccuracy: null,
              heading: null,
              speed: null,
            },
            timestamp: Date.now(),
          });
        }, 100);
      }),
      watchPosition: vi.fn(),
      clearWatch: vi.fn(),
    },
  });

  // Mock online status for system tests
  Object.defineProperty(navigator, 'onLine', {
    writable: true,
    value: true,
  });

  // Mock production localStorage
  const localStorageMock = {
    getItem: vi.fn(key => {
      const mockData = {
        'offline-reports': '[]',
        'user-preferences': '{"theme":"light","notifications":true}',
        'app-state': '{"lastSync":1640995200000}',
      };
      return mockData[key] || null;
    }),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });

  // Mock production sessionStorage
  const sessionStorageMock = {
    getItem: vi.fn(key => {
      const mockData = {
        'current-session': '{"userId":"user123","sessionId":"session456"}',
        'form-data': '{"step":1,"data":{}}',
      };
      return mockData[key] || null;
    }),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };
  Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock,
  });

  // Mock production IndexedDB
  const mockIndexedDB = {
    open: vi.fn((name, version) => ({
      result: {
        createObjectStore: vi.fn(),
        transaction: vi.fn(() => ({
          objectStore: vi.fn(() => ({
            add: vi.fn().mockResolvedValue('key123'),
            get: vi
              .fn()
              .mockResolvedValue({ id: 'test-id', data: 'test-data' }),
            getAll: vi.fn().mockResolvedValue([{ id: '1' }, { id: '2' }]),
            delete: vi.fn().mockResolvedValue(undefined),
            count: vi.fn().mockResolvedValue(2),
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

  // Mock production GeolocationPositionError
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

  // Mock production performance API
  Object.defineProperty(window, 'performance', {
    writable: true,
    value: {
      now: vi.fn(() => Date.now()),
      mark: vi.fn(),
      measure: vi.fn(),
      getEntriesByType: vi.fn(() => []),
      getEntriesByName: vi.fn(() => []),
    },
  });

  // Mock production network information
  Object.defineProperty(navigator, 'connection', {
    writable: true,
    value: {
      effectiveType: '4g',
      downlink: 10,
      rtt: 50,
      saveData: false,
    },
  });
});

afterAll(() => {
  // Clean up any global mocks
  vi.clearAllMocks();
});
