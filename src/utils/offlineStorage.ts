import type { PendingReport, OfflineStorageConfig } from '@/types/offline';

const CONFIG: OfflineStorageConfig = {
  dbName: 'CitiznOfflineDB',
  version: 1,
  storeName: 'pendingReports'
};

class OfflineStorage {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(CONFIG.dbName, CONFIG.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(CONFIG.storeName)) {
          const store = db.createObjectStore(CONFIG.storeName, { keyPath: 'id' });
          store.createIndex('syncStatus', 'syncStatus', { unique: false });
          store.createIndex('createdAt', 'createdAt', { unique: false });
        }
      };
    });
  }

  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.init();
    }
    return this.db!;
  }

  async savePendingReport(report: Omit<PendingReport, 'id' | 'createdAt' | 'syncStatus' | 'syncAttempts'>): Promise<string> {
    const db = await this.ensureDB();
    const id = `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const pendingReport: PendingReport = {
      ...report,
      id,
      createdAt: new Date().toISOString(),
      syncStatus: 'pending',
      syncAttempts: 0
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([CONFIG.storeName], 'readwrite');
      const store = transaction.objectStore(CONFIG.storeName);
      const request = store.add(pendingReport);

      request.onsuccess = () => {
        resolve(id);
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async getPendingReports(): Promise<PendingReport[]> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([CONFIG.storeName], 'readonly');
      const store = transaction.objectStore(CONFIG.storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async getPendingReport(id: string): Promise<PendingReport | null> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([CONFIG.storeName], 'readonly');
      const store = transaction.objectStore(CONFIG.storeName);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async updateSyncStatus(id: string, status: PendingReport['syncStatus'], error?: string): Promise<void> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([CONFIG.storeName], 'readwrite');
      const store = transaction.objectStore(CONFIG.storeName);
      
      const getRequest = store.get(id);
      getRequest.onsuccess = () => {
        const report = getRequest.result;
        if (report) {
          report.syncStatus = status;
          report.lastSyncAttempt = new Date().toISOString();
          if (error) {
            report.syncError = error;
          }
          if (status === 'syncing') {
            report.syncAttempts += 1;
          }

          const putRequest = store.put(report);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          reject(new Error('Report not found'));
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async updatePendingReport(id: string, updates: Partial<PendingReport>): Promise<void> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([CONFIG.storeName], 'readwrite');
      const store = transaction.objectStore(CONFIG.storeName);
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const report = getRequest.result;
        if (report) {
          const updatedReport = { ...report, ...updates };
          const putRequest = store.put(updatedReport);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          reject(new Error('Report not found'));
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async deletePendingReport(id: string): Promise<void> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([CONFIG.storeName], 'readwrite');
      const store = transaction.objectStore(CONFIG.storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getPendingCount(): Promise<number> {
    const reports = await this.getPendingReports();
    return reports.filter(report => report.syncStatus !== 'synced').length;
  }

  async clearSyncedReports(): Promise<void> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([CONFIG.storeName], 'readwrite');
      const store = transaction.objectStore(CONFIG.storeName);
      const index = store.index('syncStatus');
      const request = index.openCursor(IDBKeyRange.only('synced'));

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async clearAllPendingReports(): Promise<void> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([CONFIG.storeName], 'readwrite');
      const store = transaction.objectStore(CONFIG.storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const offlineStorage = new OfflineStorage();
