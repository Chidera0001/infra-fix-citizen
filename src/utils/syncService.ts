import { offlineStorage } from '@/utils/offlineStorage.client';
import type { PendingReport, SyncResult } from '@/types/offline';
import {
  prepareReportForSync,
  verifyReportForSync,
  geocodeIssueData,
  createIssueForSync,
  createSyncErrorResult,
} from './syncHelpers';

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

  private async handleSyncFailure(
    report: PendingReport,
    error: string
  ): Promise<void> {
    // syncAttempts was already incremented when we set status to 'syncing'
    // So we need to get the current value
    const currentReport = await offlineStorage.getPendingReport(report.id);
    const syncAttempts =
      currentReport?.syncAttempts || report.syncAttempts || 0;

    if (syncAttempts < 3) {
      // Attempts 1-2: Set to pending (will retry)
      await offlineStorage.updateSyncStatus(report.id, 'pending', error);
    } else {
      // Attempt 3: Set to failed, then delete automatically
      await offlineStorage.updateSyncStatus(report.id, 'failed', error);
      await offlineStorage.deletePendingReport(report.id);
    }
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
          (report.syncAttempts || 0) < 3 // Max 3 retry attempts (1-2 pending, 3 failed then delete)
      );

      // Process reports sequentially to avoid conflicts
      for (const report of reportsToSync) {
        try {
          await offlineStorage.updateSyncStatus(report.id, 'syncing');

          // Prepare report: convert photos, map category, validate
          const { photos, mappedIssueData, validation } =
            await prepareReportForSync(report);

          if (!validation.isValid) {
            await this.handleSyncFailure(
              report,
              validation.error || 'Validation failed'
            );

            const result: SyncResult = {
              success: false,
              error: validation.error,
              reportId: String(report.id),
            };

            results.push(result);
            this.notifyListeners(result);
            continue;
          }

          // AI Verification: Verify image and description match category
          if (photos.length > 0 && photos[0]) {
            const verification = await verifyReportForSync(
              photos[0],
              mappedIssueData.category,
              mappedIssueData.description
            );

            if (!verification.success) {
              await this.handleSyncFailure(
                report,
                verification.errorMessage || 'AI verification failed'
              );

              const result: SyncResult = {
                success: false,
                error: verification.errorMessage,
                reportId: String(report.id),
              };

              results.push(result);
              this.notifyListeners(result);
              continue;
            }
          }

          // Geocode address to get accurate coordinates
          await geocodeIssueData(mappedIssueData);

          // Create issue (handles user linking internally)
          await createIssueForSync(mappedIssueData, report, photos, userId);

          // Mark as synced and remove from local storage
          await offlineStorage.deletePendingReport(report.id);

          const syncResult: SyncResult = {
            success: true,
            reportId: String(report.id),
          };

          results.push(syncResult);
          this.notifyListeners(syncResult);
        } catch (error) {
          const result = createSyncErrorResult(report.id, error);
          await this.handleSyncFailure(report, result.error || 'Unknown error');

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

      // Prepare report: convert photos, map category, validate
      const { photos, mappedIssueData, validation } =
        await prepareReportForSync(report);

      if (!validation.isValid) {
        await this.handleSyncFailure(
          report,
          validation.error || 'Validation failed'
        );

        const result: SyncResult = {
          success: false,
          error: validation.error,
          reportId: String(report.id),
        };

        this.notifyListeners(result);
        return result;
      }

      // AI Verification: Verify image and description match category
      if (photos.length > 0 && photos[0]) {
        const verification = await verifyReportForSync(
          photos[0],
          mappedIssueData.category,
          mappedIssueData.description
        );

        if (!verification.success) {
          await this.handleSyncFailure(
            report,
            verification.errorMessage || 'AI verification failed'
          );

          const result: SyncResult = {
            success: false,
            error: verification.errorMessage,
            reportId: String(report.id),
          };

          this.notifyListeners(result);
          return result;
        }
      }

      // Geocode address and create issue
      await geocodeIssueData(mappedIssueData);
      await createIssueForSync(mappedIssueData, report, photos);

      // Mark as synced and remove from local storage
      await offlineStorage.deletePendingReport(report.id);

      const result: SyncResult = {
        success: true,
        reportId: String(report.id),
      };

      this.notifyListeners(result);
      return result;
    } catch (error) {
      const result = createSyncErrorResult(report.id, error);
      await this.handleSyncFailure(report, result.error || 'Unknown error');

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
