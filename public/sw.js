/* eslint-disable no-undef */
/**
 * Service Worker for Background Sync
 * Syncs pending offline reports when connection is restored
 */

const SYNC_TAG = 'sync-pending-reports';
const MAX_RETRY_ATTEMPTS = 3;

// Initialize Dexie in service worker
importScripts('https://cdn.jsdelivr.net/npm/dexie@4/dist/dexie.min.js');

class OfflineReportsDB extends Dexie {
  reports;

  constructor() {
    super('CitiznOfflineDB');
    this.version(1).stores({
      reports: '++id, syncStatus, createdAt, userId',
    });
  }
}

const db = new OfflineReportsDB();

// Store Supabase config received from main app
let supabaseConfig = null;

/**
 * Convert Blob[] back to File[] for API submission
 */
function blobsToFiles(blobs, photoNames = []) {
  if (!blobs || blobs.length === 0) return [];

  return blobs.map((blob, index) => {
    const name =
      photoNames && photoNames[index]
        ? photoNames[index]
        : `photo_${index}.jpg`;
    return new File([blob], name, { type: blob.type || 'image/jpeg' });
  });
}

/**
 * Upload photos to Supabase Storage
 */
async function uploadPhotos(photos, supabaseUrl, supabaseKey, authToken) {
  if (!photos || photos.length === 0) return [];

  const uploadedUrls = [];
  const bucket = 'issue-images';

  for (const photo of photos) {
    try {
      const fileExt = photo.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Upload to Supabase Storage using correct API format
      const uploadResponse = await fetch(
        `${supabaseUrl}/storage/v1/object/${bucket}/${fileName}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authToken}`,
            apikey: supabaseKey,
            'x-upsert': 'false',
          },
          body: photo,
        }
      );

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(
          `Upload failed: ${uploadResponse.status} - ${errorText}`
        );
      }

      // Get public URL
      const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${fileName}`;
      uploadedUrls.push(publicUrl);
    } catch (error) {
      throw error;
    }
  }

  return uploadedUrls;
}

/**
 * Submit a single report using Supabase REST API
 */
async function submitReport(report, supabaseUrl, supabaseKey, authToken) {
  try {
    // Map category to database enum
    const categoryMapping = {
      pothole: 'pothole',
      streetlight: 'street_lighting',
      'water-supply': 'water_supply',
      'traffic-light': 'traffic_signal',
      drainage: 'drainage',
      'road-damage': 'sidewalk',
      other: 'other',
    };

    const mappedCategory =
      categoryMapping[report.issueData.category] || 'other';

    // Convert Blob[] to File[]
    const photos = blobsToFiles(report.photos || [], report.photoNames || []);

    // Upload photos first
    let imageUrls = [];
    if (photos.length > 0 && authToken) {
      imageUrls = await uploadPhotos(
        photos,
        supabaseUrl,
        supabaseKey,
        authToken
      );
    }

    // Get user profile to get reporter_id
    // Query profiles table by user_id (Supabase Auth user ID)
    let reporterId = null;

    if (authToken && report.userId) {
      try {
        const profileResponse = await fetch(
          `${supabaseUrl}/rest/v1/profiles?user_id=eq.${report.userId}&select=id`,
          {
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${authToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (profileResponse.ok) {
          const profiles = await profileResponse.json();
          if (profiles && profiles.length > 0) {
            reporterId = profiles[0].id;
          }
        }
      } catch (error) {
        // If profile query fails, throw error
        // The profile might need to be created first
        throw new Error(
          'Failed to fetch user profile. Please ensure your profile exists.'
        );
      }
    }

    if (!reporterId) {
      throw new Error(
        `User profile not found for user_id: ${report.userId || 'undefined'}`
      );
    }

    // Submit issue
    const issueData = {
      title: report.issueData.title,
      description: report.issueData.description,
      category: mappedCategory,
      severity: report.issueData.severity,
      address: report.issueData.address,
      location_lat: report.issueData.location_lat,
      location_lng: report.issueData.location_lng,
      reporter_id: reporterId,
      image_urls: imageUrls,
    };

    const response = await fetch(`${supabaseUrl}/rest/v1/issues`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseKey,
        Authorization: `Bearer ${authToken}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify(issueData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

/**
 * Sync all pending reports from Dexie
 */
async function syncPendingReports() {
  try {
    // Check if app is active - if so, skip (Main App sync will handle it)
    // Service Worker sync should only run when app is closed/inactive
    const clients = await self.clients.matchAll({ includeUncontrolled: true });
    const hasActiveClients = clients.some(client => {
      // Client is considered active if it has focus or is visible
      return (
        client.focused ||
        (client.visibilityState && client.visibilityState === 'visible')
      );
    });

    // If app is active, skip - Main App sync will handle it
    // Only sync in background when app is closed/inactive
    if (hasActiveClients) {
      return { success: true, synced: 0, failed: 0, skipped: true };
    }

    if (!supabaseConfig) {
      // Request config from main app
      clients.forEach(client => {
        client.postMessage({ type: 'REQUEST_CONFIG' });
      });
      return { success: false, error: 'Configuration missing' };
    }

    // Get pending reports - filter out reports with >= 3 attempts
    const pendingReports = await db.reports
      .where('syncStatus')
      .anyOf(['pending', 'failed'])
      .filter(report => (report.syncAttempts || 0) < MAX_RETRY_ATTEMPTS)
      .toArray();

    if (pendingReports.length === 0) {
      return { success: true, synced: 0, failed: 0 };
    }

    const { url: supabaseUrl, key: supabaseKey, authToken } = supabaseConfig;

    let syncedCount = 0;
    let failedCount = 0;

    for (const report of pendingReports) {
      // Skip if exceeded max retries - delete permanently
      if (report.syncAttempts >= MAX_RETRY_ATTEMPTS) {
        await db.reports.delete(report.id);
        failedCount++;
        continue;
      }

      try {
        // Update to syncing
        await db.reports.update(report.id, {
          syncStatus: 'syncing',
          syncAttempts: (report.syncAttempts || 0) + 1,
          lastSyncAttempt: new Date().toISOString(),
        });

        // Submit report
        await submitReport(report, supabaseUrl, supabaseKey, authToken);

        // Success - delete from Dexie
        await db.reports.delete(report.id);
        syncedCount++;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';

        // Get current syncAttempts after increment
        const currentReport = await db.reports.get(report.id);
        const currentAttempts = currentReport?.syncAttempts || 0;

        if (currentAttempts >= MAX_RETRY_ATTEMPTS) {
          // Max retries reached - delete permanently
          await db.reports.delete(report.id);
        } else {
          // Still has retries left - mark as failed for retry
          await db.reports.update(report.id, {
            syncStatus: 'failed',
            syncError: errorMessage,
            lastSyncAttempt: new Date().toISOString(),
          });
        }

        failedCount++;
      }
    }

    // Notify clients (reuse clients from earlier check)
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETE',
        result: { success: true, synced: syncedCount, failed: failedCount },
      });
    });

    return { success: true, synced: syncedCount, failed: failedCount };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Background Sync event listener
 */
self.addEventListener('sync', event => {
  if (event.tag === SYNC_TAG) {
    event.waitUntil(syncPendingReports());
  }
});

/**
 * Handle messages from main app
 */
self.addEventListener('message', event => {
  if (event.data) {
    if (event.data.type === 'UPDATE_CONFIG') {
      // Store Supabase configuration
      supabaseConfig = event.data.config;
    } else if (event.data.type === 'SYNC_NOW') {
      // Trigger immediate sync
      syncPendingReports().then(result => {
        if (event.ports && event.ports[0]) {
          event.ports[0].postMessage({ success: true, result });
        }
      });
    }
  }
});

/**
 * Install event
 */
self.addEventListener('install', event => {
  self.skipWaiting();
});

/**
 * Activate event
 */
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});
