export interface PendingReport {
  id?: number | string; // Can be number (auto-increment) or string (legacy)
  issueData: {
    title: string;
    description: string;
    category: string;
    severity: string;
    address: string;
    location_lat: number;
    location_lng: number;
  };
  photos: File[] | Blob[]; // Can be File[] or Blob[] (for Dexie storage)
  photoNames?: string[]; // Original file names for restoration
  userId?: string;
  createdAt: string;
  syncStatus: 'pending' | 'syncing' | 'failed' | 'synced';
  syncAttempts: number;
  lastSyncAttempt?: string;
  syncError?: string;
}

export interface OfflineStorageConfig {
  dbName: string;
  version: number;
  storeName: string;
}

export interface SyncResult {
  success: boolean;
  error?: string;
  reportId: string;
}
