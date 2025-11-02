import Dexie, { type Table } from 'dexie';
import type { PendingReport } from '@/types/offline';

/**
 * Dexie database for offline report storage
 * Provides offline-first capabilities with auto-increment IDs
 */
class OfflineReportsDB extends Dexie {
  reports!: Table<Omit<PendingReport, 'id'> & { id?: number }, number>;

  constructor() {
    super('CitiznOfflineDB');

    this.version(1).stores({
      reports: '++id, syncStatus, createdAt, userId',
    });
  }
}

export const dexieDb = new OfflineReportsDB();

/**
 * Helper to convert File[] to Blob[] for storage
 */
export async function filesToBlobs(files: File[]): Promise<Blob[]> {
  return Promise.all(
    files.map(file =>
      file.arrayBuffer().then(buffer => new Blob([buffer], { type: file.type }))
    )
  );
}

/**
 * Helper to convert Blob[] back to File[]
 */
export function blobsToFiles(
  blobs: Blob[],
  originalNames: string[] = []
): File[] {
  return blobs.map((blob, index) => {
    const name = originalNames[index] || `photo_${index}.jpg`;
    return new File([blob], name, { type: blob.type || 'image/jpeg' });
  });
}
