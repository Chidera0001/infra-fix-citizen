import { supabase } from '@/integrations/supabase/client';

/**
 * Register service worker and configure it with Supabase credentials
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service workers are not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    console.log('Service Worker registered:', registration.scope);

    // Wait for service worker to be ready
    await navigator.serviceWorker.ready;

    // Send Supabase configuration to service worker
    await updateServiceWorkerConfig(registration);

    // Listen for service worker updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('New service worker available');
          }
        });
      }
    });

    // Listen for messages from service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data?.type === 'REQUEST_CONFIG') {
        // Service worker needs config, send it
        updateServiceWorkerConfig(registration);
      } else if (event.data?.type === 'SYNC_COMPLETE') {
        console.log('Background sync completed:', event.data.result);
      }
    });

    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
}

/**
 * Update service worker with current Supabase configuration and auth token
 */
export async function updateServiceWorkerConfig(
  registration: ServiceWorkerRegistration
): Promise<void> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const authToken = session?.access_token || null;

    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase configuration missing');
      return;
    }

    if (registration.active) {
      registration.active.postMessage({
        type: 'UPDATE_CONFIG',
        config: {
          url: supabaseUrl,
          key: supabaseKey,
          authToken,
        },
      });
    } else if (registration.installing) {
      registration.installing.addEventListener('statechange', () => {
        if (registration.installing?.state === 'activated') {
          registration.installing.postMessage({
            type: 'UPDATE_CONFIG',
            config: {
              url: supabaseUrl,
              key: supabaseKey,
              authToken,
            },
          });
        }
      });
    }
  } catch (error) {
    console.error('Failed to update service worker config:', error);
  }
}

/**
 * Register Background Sync for pending reports
 */
export async function registerBackgroundSync(tag = 'sync-pending-reports'): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  if (!('sync' in ServiceWorkerRegistration.prototype)) {
    console.warn('Background Sync API is not supported');
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    
    // Check if already registered
    const tags = await (registration as any).sync.getTags();
    if (tags.includes(tag)) {
      return true; // Already registered
    }

    await (registration as any).sync.register(tag);
    console.log('Background Sync registered:', tag);
    return true;
  } catch (error) {
    console.error('Failed to register Background Sync:', error);
    return false;
  }
}

/**
 * Unregister service worker (for development/testing)
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.unregister();
      console.log('Service Worker unregistered');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to unregister service worker:', error);
    return false;
  }
}

