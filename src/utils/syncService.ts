import {
  offlineStorage,
  type PendingReport,
  type SyncResult,
} from '@/utils/offlineStorage';
import { issuesApi } from '@/lib/supabase-api';
import { supabase } from '@/integrations/supabase/client';
import { uploadIssueImages } from '@/lib/supabase-api';
import { geocodeAddressToLocation } from './geocoding';
import { blobsToFiles } from './dexieDb';

// Map offline form categories to database enum values
const categoryMapping: Record<string, string> = {
  pothole: 'pothole',
  streetlight: 'street_lighting',
  'water-supply': 'water_supply',
  'traffic-light': 'traffic_signal',
  drainage: 'drainage',
  'road-damage': 'sidewalk', // Map road damage to sidewalk for now
  other: 'other',
};

function mapCategoryToDatabase(category: string): string {
  return categoryMapping[category] || 'other';
}

function validateIssueData(issueData: any): {
  isValid: boolean;
  error?: string;
} {
  // Check title length (10-100 characters)
  if (
    !issueData.title ||
    issueData.title.length < 10 ||
    issueData.title.length > 100
  ) {
    return {
      isValid: false,
      error: `Title must be between 10 and 100 characters (current: ${issueData.title?.length || 0})`,
    };
  }

  // Check description length (20-1000 characters)
  if (
    !issueData.description ||
    issueData.description.length < 20 ||
    issueData.description.length > 1000
  ) {
    return {
      isValid: false,
      error: `Description must be between 20 and 1000 characters (current: ${issueData.description?.length || 0})`,
    };
  }

  return { isValid: true };
}

class SyncService {
  private isSyncing = false;
  private syncQueue: string[] = [];
  private listeners: Set<(result: SyncResult) => void> = new Set();

  addListener(listener: (result: SyncResult) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(result: SyncResult) {
    this.listeners.forEach(listener => listener(result));
  }

  async syncPendingReports(userId?: string): Promise<SyncResult[]> {
    if (this.isSyncing) {
      return [];
    }

    this.isSyncing = true;
    const results: SyncResult[] = [];

    try {
      const pendingReports = await offlineStorage.getPendingReports();

      const reportsToSync = pendingReports.filter(
        report =>
          (report.syncStatus === 'pending' || report.syncStatus === 'failed') &&
          (report.syncAttempts || 0) < 5 // Max 5 retry attempts
      );

      // Process reports sequentially to avoid conflicts
      for (const report of reportsToSync) {
        try {
          await offlineStorage.updateSyncStatus(report.id, 'syncing');

          // Convert stored photos back to File objects
          const photos = blobsToFiles(
            report.photos as Blob[],
            report.photoNames || []
          );

          // Map category to database enum value
          const mappedIssueData = {
            ...report.issueData,
            category: mapCategoryToDatabase(report.issueData.category),
          };

          // Validate issue data against database constraints
          const validation = validateIssueData(mappedIssueData);
          if (!validation.isValid) {
            await offlineStorage.updateSyncStatus(
              report.id,
              'failed',
              validation.error
            );

          const result: SyncResult = {
            success: false,
            error: validation.error,
            reportId: String(report.id),
          };

            results.push(result);
            this.notifyListeners(result);
            continue; // Skip to next report
          }

          // Geocode the address to get accurate coordinates (silent operation)
          if (mappedIssueData.address && mappedIssueData.address.trim()) {
            try {
              const geocodedLocation = await geocodeAddressToLocation(
                mappedIssueData.address.trim()
              );
              if (geocodedLocation) {
                mappedIssueData.location_lat = geocodedLocation.latitude;
                mappedIssueData.location_lng = geocodedLocation.longitude;
                // Only log in development - never log user locations in production
                if (import.meta.env.DEV) {
                  console.log('Offline report geocoded during sync:', {
                    address: mappedIssueData.address,
                    coordinates: [
                      geocodedLocation.latitude,
                      geocodedLocation.longitude,
                    ],
                  });
                }
              } else {
                // Silent failure - use existing coordinates
                if (import.meta.env.DEV) {
                  console.log(
                    'Geocoding failed for offline report address:',
                    mappedIssueData.address
                  );
                }
              }
            } catch (error) {
              // Only log errors, not user location data
              console.error('Geocoding error during sync:', error);
              // Continue with default coordinates (already set in offline flow)
            }
          }

          // Handle offline users - now they should have proper user IDs after linking
          let issueResult;
          if (report.userId === 'offline-user') {
            // This shouldn't happen anymore after user linking, but handle gracefully

            if (userId) {
              await offlineStorage.updatePendingReport(report.id, {
                ...report,
                userId: userId,
              });
              // Retry with the updated report
              issueResult = await issuesApi.createIssue(
                mappedIssueData,
                userId,
                photos
              );
            } else {
              throw new Error(
                'Offline report needs to be linked to a user before syncing'
              );
            }
          } else {
            // Use existing API for authenticated users (including previously offline users)
            issueResult = await issuesApi.createIssue(
              mappedIssueData,
              report.userId,
              photos
            );
          }

          // Mark as synced and remove from local storage
          await offlineStorage.deletePendingReport(report.id);

          const syncResult: SyncResult = {
            success: true,
            reportId: String(report.id),
          };

          results.push(syncResult);
          this.notifyListeners(syncResult);
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown sync error';

          await offlineStorage.updateSyncStatus(
            report.id,
            'failed',
            errorMessage
          );

          const result: SyncResult = {
            success: false,
            error: errorMessage,
            reportId: String(report.id),
          };

          results.push(result);
          this.notifyListeners(result);
        }
      }

      // Clean up any remaining synced reports
      await offlineStorage.clearSyncedReports();
    } catch (error) {
      console.error('Sync service error:', error);
    } finally {
      this.isSyncing = false;
    }

    return results;
  }

  async syncSingleReport(reportId: number | string): Promise<SyncResult> {
    const report = await offlineStorage.getPendingReport(reportId);
    if (!report) {
      return {
        success: false,
        error: 'Report not found',
        reportId: String(reportId),
      };
    }

    try {
      await offlineStorage.updateSyncStatus(report.id, 'syncing');

      // Convert stored photos back to File objects
      const photos = blobsToFiles(
        report.photos as Blob[],
        report.photoNames || []
      );

      // Map category to database enum value
      const mappedIssueData = {
        ...report.issueData,
        category: mapCategoryToDatabase(report.issueData.category),
      };

      // Validate issue data against database constraints
      const validation = validateIssueData(mappedIssueData);
      if (!validation.isValid) {
        await offlineStorage.updateSyncStatus(
          report.id,
          'failed',
          validation.error
        );

        const result: SyncResult = {
          success: false,
          error: validation.error,
          reportId: String(report.id),
        };

        this.notifyListeners(result);
        return result;
      }

      // Use existing API to create issue
      await issuesApi.createIssue(mappedIssueData, report.userId, photos);

      // Mark as synced and remove from local storage
      await offlineStorage.deletePendingReport(report.id);

      const result: SyncResult = {
        success: true,
        reportId: String(report.id),
      };

      this.notifyListeners(result);
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown sync error';

      // Check if we should retry
      const syncAttempts = (report.syncAttempts || 0) + 1;
      const maxRetries = 5;
      
      if (syncAttempts < maxRetries) {
        // Will retry later via background sync
        await offlineStorage.updateSyncStatus(report.id, 'pending', errorMessage);
      } else {
        // Max retries exceeded, mark as failed
        await offlineStorage.updateSyncStatus(report.id, 'failed', errorMessage);
      }

      const result: SyncResult = {
        success: false,
        error: errorMessage,
        reportId: String(report.id),
      };

      this.notifyListeners(result);
      return result;
    }
  }

  async retryFailedReports(): Promise<SyncResult[]> {
    const failedReports = await offlineStorage.getPendingReports();
    const reportsToRetry = failedReports.filter(
      report => report.syncStatus === 'failed'
    );

    const results: SyncResult[] = [];

    for (const report of reportsToRetry) {
      const result = await this.syncSingleReport(report.id);
      results.push(result);
    }

    return results;
  }

  getPendingCount(): Promise<number> {
    return offlineStorage.getPendingCount();
  }

  getPendingReports(): Promise<PendingReport[]> {
    return offlineStorage.getPendingReports();
  }

  isCurrentlySyncing(): boolean {
    return this.isSyncing;
  }
}

export const syncService = new SyncService();
