/**
 * Client-side only dynamic import helper for offlineStorage
 * This prevents SSR/build-time errors from Dexie/IndexedDB
 */
export async function getOfflineStorage() {
  if (typeof window === 'undefined') {
    throw new Error('offlineStorage can only be used in the browser');
  }
  
  const { offlineStorage } = await import('./offlineStorage');
  return offlineStorage;
}

/**
 * Synchronous getter that returns a promise-based API
 * Use this in hooks and components
 */
export const offlineStorage = {
  async savePendingReport(...args: Parameters<Awaited<ReturnType<typeof getOfflineStorage>>['savePendingReport']>) {
    const storage = await getOfflineStorage();
    return storage.savePendingReport(...args);
  },
  async getPendingReports() {
    const storage = await getOfflineStorage();
    return storage.getPendingReports();
  },
  async getPendingReport(...args: Parameters<Awaited<ReturnType<typeof getOfflineStorage>>['getPendingReport']>) {
    const storage = await getOfflineStorage();
    return storage.getPendingReport(...args);
  },
  async updateSyncStatus(...args: Parameters<Awaited<ReturnType<typeof getOfflineStorage>>['updateSyncStatus']>) {
    const storage = await getOfflineStorage();
    return storage.updateSyncStatus(...args);
  },
  async updatePendingReport(...args: Parameters<Awaited<ReturnType<typeof getOfflineStorage>>['updatePendingReport']>) {
    const storage = await getOfflineStorage();
    return storage.updatePendingReport(...args);
  },
  async deletePendingReport(...args: Parameters<Awaited<ReturnType<typeof getOfflineStorage>>['deletePendingReport']>) {
    const storage = await getOfflineStorage();
    return storage.deletePendingReport(...args);
  },
  async getPendingCount() {
    const storage = await getOfflineStorage();
    return storage.getPendingCount();
  },
  async clearSyncedReports() {
    const storage = await getOfflineStorage();
    return storage.clearSyncedReports();
  },
  async clearAllPendingReports() {
    const storage = await getOfflineStorage();
    return storage.clearAllPendingReports();
  },
  async getPendingReportsByStatus(...args: Parameters<Awaited<ReturnType<typeof getOfflineStorage>>['getPendingReportsByStatus']>) {
    const storage = await getOfflineStorage();
    return storage.getPendingReportsByStatus(...args);
  },
  async getPendingReportsRaw() {
    const storage = await getOfflineStorage();
    return storage.getPendingReportsRaw();
  },
};

