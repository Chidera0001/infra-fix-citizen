import type { Table } from 'dexie';
import type { PendingReport } from '@/types/offline';

type OfflineReportsDB = {
  reports: Table<Omit<PendingReport, 'id'> & { id?: number }, number>;
};

// Lazy initialization to avoid window access during SSR
let _dexieDb: OfflineReportsDB | null = null;

async function getDexieDb(): Promise<OfflineReportsDB> {
  if (typeof window === 'undefined') {
    throw new Error('Dexie can only be used in the browser');
  }
  if (!_dexieDb) {
    // Dynamically import Dexie only when needed
    const Dexie = (await import('dexie')).default;

    class OfflineReportsDB extends Dexie {
      reports!: Table<Omit<PendingReport, 'id'> & { id?: number }, number>;

      constructor() {
        super('CitiznOfflineDB');

        this.version(1).stores({
          reports: '++id, syncStatus, createdAt, userId',
        });
      }
    }

    _dexieDb = new OfflineReportsDB() as OfflineReportsDB;
  }
  return _dexieDb;
}

// Export a function that returns the database
export async function getDb(): Promise<OfflineReportsDB> {
  return getDexieDb();
}

// Re-export file helpers for backward compatibility
export { filesToBlobs, blobsToFiles } from './fileHelpers';
