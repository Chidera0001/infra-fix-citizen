import { useState, useEffect, useCallback, useRef } from 'react';

interface OnlineStatus {
  isOnline: boolean;
  isChecking: boolean;
  lastChecked?: Date;
  connectionQuality?: 'good' | 'poor' | 'offline';
}

export function useOnlineStatus() {
  const [status, setStatus] = useState<OnlineStatus>({
    isOnline: navigator.onLine, // Start with navigator.onLine state
    isChecking: false,
    connectionQuality: navigator.onLine ? 'good' : 'offline'
  });

  const hasCheckedRef = useRef(false); // Track if we've already checked on this page load
  const TIMEOUT_DURATION = 5000; // 5 seconds timeout

  const checkConnection = useCallback(async (): Promise<boolean> => {
    // Only check once per page load
    if (hasCheckedRef.current) {
      return status.isOnline;
    }

    hasCheckedRef.current = true;
    setStatus(prev => ({ ...prev, isChecking: true }));

    try {
      // Use only reliable endpoints that support CORS
      const endpoints = [
        'https://httpbin.org/status/200',
        'https://jsonplaceholder.typicode.com/posts/1'
      ];

      let isOnline = false;
      let connectionQuality: 'good' | 'poor' | 'offline' = 'offline';

      // Try each endpoint until one succeeds
      for (const endpoint of endpoints) {
        try {
          const startTime = Date.now();
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION);

          const response = await fetch(endpoint, {
            method: 'GET',
            cache: 'no-cache',
            mode: 'cors',
            signal: controller.signal
          });

          clearTimeout(timeoutId);
          const responseTime = Date.now() - startTime;
          
          // More strict checking - response must be ok and have content
          if (response.ok && response.status >= 200 && response.status < 300) {
            isOnline = true;
            connectionQuality = responseTime < 2000 ? 'good' : 'poor';
            break;
          }
        } catch (error) {
          // Continue to next endpoint silently
          continue;
        }
      }

      // Only consider online if navigator.onLine AND fetch succeeded
      const finalOnlineStatus = navigator.onLine && isOnline;
      
      setStatus({
        isOnline: finalOnlineStatus,
        isChecking: false,
        lastChecked: new Date(),
        connectionQuality: finalOnlineStatus ? connectionQuality : 'offline'
      });

      return finalOnlineStatus;
    } catch (error) {
      // If all fetches fail, we're definitely offline
      setStatus({
        isOnline: false,
        isChecking: false,
        lastChecked: new Date(),
        connectionQuality: 'offline'
      });

      return false;
    }
  }, [status.isOnline]);

  useEffect(() => {
    const handleOnline = () => {
      setStatus(prev => ({ 
        ...prev, 
        isOnline: true,
        connectionQuality: 'good'
      }));
    };

    const handleOffline = () => {
      setStatus(prev => ({ 
        ...prev, 
        isOnline: false,
        connectionQuality: 'offline'
      }));
    };

    // Listen to browser online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial connection check only if navigator says we're online AND we haven't checked yet
    if (navigator.onLine && !hasCheckedRef.current) {
      checkConnection();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkConnection]);

  return {
    isOnline: status.isOnline,
    isChecking: status.isChecking,
    lastChecked: status.lastChecked,
    connectionQuality: status.connectionQuality,
    checkConnection
  };
}