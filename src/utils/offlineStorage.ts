import type { PendingReport } from '@/types/offline';
import { dexieDb, filesToBlobs, blobsToFiles } from './dexieDb';

/**
 * OfflineStorage using Dexie.js for offline-first capabilities
 * Provides auto-increment IDs and simplified database operations
 */
class OfflineStorage {
  async savePendingReport(
    report: Omit<PendingReport, 'id' | 'createdAt' | 'syncStatus' | 'syncAttempts'>
  ): Promise<string | number> {
    // Convert File[] to Blob[] for storage
    const photoBlobs = await filesToBlobs(report.photos);
    const photoNames = report.photos.map(f => f.name);

    const pendingReport = {
      ...report,
      photos: photoBlobs,
      photoNames,
      createdAt: new Date().toISOString(),
      syncStatus: 'pending' as const,
      syncAttempts: 0,
    };

    // Dexie auto-increments the ID
    const id = await dexieDb.reports.add(pendingReport);
    return id;
  }

  async getPendingReports(): Promise<PendingReport[]> {
    const reports = await dexieDb.reports.toArray();
    
    // Convert Blob[] back to File[] for compatibility
    return reports.map(report => ({
      ...report,
      id: report.id as number,
      photos: blobsToFiles(report.photos as Blob[], report.photoNames) as File[],
    }));
  }

  async getPendingReport(id: number | string): Promise<PendingReport | null> {
    const report = await dexieDb.reports.get(Number(id));
    if (!report) return null;

    return {
      ...report,
      id: report.id as number,
      photos: blobsToFiles(report.photos as Blob[], report.photoNames) as File[],
    };
  }

  async updateSyncStatus(
    id: number | string,
    status: PendingReport['syncStatus'],
    error?: string
  ): Promise<void> {
    const report = await dexieDb.reports.get(Number(id));
    if (!report) {
      throw new Error('Report not found');
    }

    const updates: Partial<PendingReport> = {
      syncStatus: status,
      lastSyncAttempt: new Date().toISOString(),
    };

    if (error) {
      updates.syncError = error;
    }

    if (status === 'syncing') {
      updates.syncAttempts = (report.syncAttempts || 0) + 1;
    }

    await dexieDb.reports.update(Number(id), updates);
  }

  async updatePendingReport(id: number | string, updates: Partial<PendingReport>): Promise<void> {
    const report = await dexieDb.reports.get(Number(id));
    if (!report) {
      throw new Error('Report not found');
    }

    // If photos are being updated, convert File[] to Blob[]
    if (updates.photos && updates.photos.length > 0 && updates.photos[0] instanceof File) {
      const photoBlobs = await filesToBlobs(updates.photos as File[]);
      const photoNames = (updates.photos as File[]).map(f => f.name);
      updates.photos = photoBlobs;
      updates.photoNames = photoNames;
    }

    await dexieDb.reports.update(Number(id), updates);
  }

  async deletePendingReport(id: number | string): Promise<void> {
    await dexieDb.reports.delete(Number(id));
  }

  async getPendingCount(): Promise<number> {
    const count = await dexieDb.reports
      .where('syncStatus')
      .anyOf(['pending', 'failed', 'syncing'])
      .count();
    return count;
  }

  async clearSyncedReports(): Promise<void> {
    await dexieDb.reports.where('syncStatus').equals('synced').delete();
  }

  async clearAllPendingReports(): Promise<void> {
    await dexieDb.reports.clear();
  }

  // Additional Dexie-specific methods
  async getPendingReportsByStatus(status: PendingReport['syncStatus']): Promise<PendingReport[]> {
    const reports = await dexieDb.reports.where('syncStatus').equals(status).toArray();
    return reports.map(report => ({
      ...report,
      id: report.id as number,
      photos: blobsToFiles(report.photos as Blob[], report.photoNames) as File[],
    }));
  }

  async getPendingReportsRaw(): Promise<Omit<PendingReport, 'photos'> & { photos: Blob[] }[]> {
    return dexieDb.reports.toArray();
  }
}

export const offlineStorage = new OfflineStorage();
