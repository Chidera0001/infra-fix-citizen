import { supabase } from '@/integrations/supabase/client';

/**
 * Register service worker and configure it with Supabase credentials
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    // Wait for service worker to be ready
    await navigator.serviceWorker.ready;

    // Send Supabase configuration to service worker
    await updateServiceWorkerConfig(registration);

    // Listen for service worker updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          // New service worker available - will activate on next page load
        });
      }
    });

    // Listen for messages from service worker
    navigator.serviceWorker.addEventListener('message', event => {
      if (event.data?.type === 'REQUEST_CONFIG') {
        // Service worker needs config, send it
        updateServiceWorkerConfig(registration);
      }
    });

    return registration;
  } catch (error) {
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
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const authToken = session?.access_token || null;

    if (!supabaseUrl || !supabaseKey) {
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
    // Silent failure - config update is non-critical
  }
}

/**
 * Register Background Sync for pending reports
 * Uses fast-path optimization and timeout for reliability
 */
export async function registerBackgroundSync(
  tag = 'sync-pending-reports'
): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  if (!('sync' in ServiceWorkerRegistration.prototype)) {
    return false;
  }

  try {
    // Synchronous check: if no controller exists, check if SW is registered
    // If no controller AND no registration (dev mode), skip immediately to avoid hangs
    if (!navigator.serviceWorker.controller) {
      // Quick async check with timeout - if no registration, bail out immediately
      // This handles dev mode where SW is never registered
      try {
        const existingRegistration = await Promise.race([
          navigator.serviceWorker.getRegistration(),
          new Promise<undefined>(resolve =>
            setTimeout(() => resolve(undefined), 300)
          ),
        ]);
        if (!existingRegistration) {
          // No SW registered (dev mode) - skip background sync
          return false;
        }
      } catch {
        // If getRegistration fails or times out, skip background sync
        return false;
      }
      // Registration exists but controller not active yet - fall through to slow path
    }

    // Fast path: check if service worker is already active (controller exists)
    if (navigator.serviceWorker.controller) {
      // SW is already active, try to get registration immediately
      const registration = await Promise.race([
        navigator.serviceWorker.ready,
        // Timeout after 1 second if SW isn't ready yet (should be instant if controller exists)
        new Promise<never>((_, reject) =>
          setTimeout(
            () => reject(new Error('Service worker ready timeout (fast path)')),
            1000
          )
        ),
      ]);

      try {
        // Check if already registered
        const tags = await (registration as any).sync.getTags();
        if (tags.includes(tag)) {
          return true; // Already registered
        }

        await (registration as any).sync.register(tag);
        return true;
      } catch (syncError) {
        // If sync registration fails, that's okay - we tried
        return false;
      }
    }

    // Slow path: SW might not be active yet (first load, offline mode, etc.)
    // Use longer timeout (2 seconds) but still bounded
    const registration = await Promise.race([
      navigator.serviceWorker.ready,
      new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error('Service worker ready timeout')),
          2000
        )
      ),
    ]);

    // Check if already registered
    const tags = await (registration as any).sync.getTags();
    if (tags.includes(tag)) {
      return true; // Already registered
    }

    await (registration as any).sync.register(tag);
    return true;
  } catch (error) {
    // Silent failure - background sync is optional, not critical for offline save
    // The report is already saved to IndexedDB, so we can proceed
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
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}
