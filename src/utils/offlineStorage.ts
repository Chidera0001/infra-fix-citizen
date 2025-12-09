import type { PendingReport } from '@/types/offline';
import { filesToBlobs, blobsToFiles } from './fileHelpers';

/**
 * Lazy getter for dexieDb to avoid SSR issues
 */
async function getDexieDb() {
  const { getDb } = await import('./dexieDb');
  return getDb();
}

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
    const db = await getDexieDb();
    const id = await db.reports.add(pendingReport);
    return id;
  }

  async getPendingReports(): Promise<PendingReport[]> {
    const db = await getDexieDb();
    const reports = await db.reports.toArray();
    
    // Convert Blob[] back to File[] for compatibility
    return reports.map(report => ({
      ...report,
      id: report.id as number,
      photos: blobsToFiles(report.photos as Blob[], report.photoNames) as File[],
    }));
  }

  async getPendingReport(id: number | string): Promise<PendingReport | null> {
    const db = await getDexieDb();
    const report = await db.reports.get(Number(id));
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
    const db = await getDexieDb();
    const report = await db.reports.get(Number(id));
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

    await db.reports.update(Number(id), updates);
  }

  async updatePendingReport(id: number | string, updates: Partial<PendingReport>): Promise<void> {
    const db = await getDexieDb();
    const report = await db.reports.get(Number(id));
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

    await db.reports.update(Number(id), updates);
  }

  async deletePendingReport(id: number | string): Promise<void> {
    const db = await getDexieDb();
    await db.reports.delete(Number(id));
  }

  async getPendingCount(): Promise<number> {
    const db = await getDexieDb();
    const count = await db.reports
      .where('syncStatus')
      .anyOf(['pending', 'failed', 'syncing'])
      .count();
    return count;
  }

  async clearSyncedReports(): Promise<void> {
    const db = await getDexieDb();
    await db.reports.where('syncStatus').equals('synced').delete();
  }

  async clearAllPendingReports(): Promise<void> {
    const db = await getDexieDb();
    await db.reports.clear();
  }

  // Additional Dexie-specific methods
  async getPendingReportsByStatus(status: PendingReport['syncStatus']): Promise<PendingReport[]> {
    const db = await getDexieDb();
    const reports = await db.reports.where('syncStatus').equals(status).toArray();
    return reports.map(report => ({
      ...report,
      id: report.id as number,
      photos: blobsToFiles(report.photos as Blob[], report.photoNames) as File[],
    }));
  }

  async getPendingReportsRaw(): Promise<Omit<PendingReport, 'photos'> & { photos: Blob[] }[]> {
    const db = await getDexieDb();
    return db.reports.toArray();
  }
}

export const offlineStorage = new OfflineStorage();
