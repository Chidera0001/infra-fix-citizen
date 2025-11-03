import { useState, useEffect, useRef } from 'react';
import { useOnlineStatus } from './use-online-status';
import { useSyncPendingReports, usePendingReports } from './use-issues';
import { syncService } from '@/utils/syncService';
import { useToast } from './use-toast';

export function useAutoSync() {
  const { isOnline } = useOnlineStatus();
  const syncMutation = useSyncPendingReports();
  const { data: pendingReports = [] } = usePendingReports();
  const { toast } = useToast();
  const hasAutoSyncedRef = useRef(false); // Track if we've already synced on this page load

  // Check if there are pending reports that need syncing
  const hasPendingReports = pendingReports.some(
    report => report.syncStatus === 'pending' || report.syncStatus === 'failed'
  );

  useEffect(() => {
    // Only auto-sync once per page load when online and has pending reports
    if (isOnline && hasPendingReports && !hasAutoSyncedRef.current) {
      hasAutoSyncedRef.current = true;
      syncMutation.mutate();
    }
  }, [isOnline, hasPendingReports, syncMutation]);

  // Listen to sync service events and show toast for auto-sync
  useEffect(() => {
    const unsubscribe = syncService.addListener(result => {
      if (result.success) {
        toast({
          title: '🔄 Auto-Sync Complete',
          description: 'Your offline report has been automatically synced!',
        });
      } else if (result.error) {
        // Show specific AI verification error message
        toast({
          title: '⚠️ Auto-Sync Failed',
          description: result.error,
          variant: 'destructive',
        });
      }
    });

    return unsubscribe;
  }, [toast]);
}
