import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useOnlineStatus } from '@/hooks/use-online-status';
import { usePendingReports } from '@/hooks/use-issues';
import { offlineStorage } from '@/utils/offlineStorage';

interface OfflineUserManager {
  hasOfflineReports: boolean;
  pendingReportsCount: number;
  isLinking: boolean;
}

export function useOfflineUserManager(): OfflineUserManager {
  const { user, isOfflineMode } = useAuth();
  const { isOnline } = useOnlineStatus();
  const { data: pendingReports = [] } = usePendingReports();
  const [isLinking, setIsLinking] = useState(false);
  const hasLinkedRef = useRef(false); // Track if we've already linked reports in this session

  // Memoize the offline reports check to prevent infinite loops
  const hasOfflineReports = useMemo(() => {
    // Check for reports that need linking (either offline-user or reports with real user IDs)
    return pendingReports.some(report => {
      if (!isOnline || !user) return false;
      
      // Reports with offline-user placeholder
      if (report.userId === 'offline-user') return true;
      
      // Reports with real user IDs that need conversion (contain user ID pattern)
      if (report.userId && report.userId !== 'offline-user' && report.userId.includes(user.id.substring(0, 8))) {
        return true;
      }
      
      return false;
    });
  }, [pendingReports, isOnline, user]);
  
  const pendingReportsCount = useMemo(() => {
    return pendingReports.filter(report => {
      // Reports with offline-user placeholder
      if (report.userId === 'offline-user') return true;
      
      // Reports with real user IDs that need conversion
      if (report.userId && report.userId !== 'offline-user' && user && report.userId.includes(user.id.substring(0, 8))) {
        return true;
      }
      
      return false;
    }).length;
  }, [pendingReports, user]);

  const linkOfflineReportsToUser = useCallback(async () => {
    if (!user || !isOnline) {
      return;
    }

    setIsLinking(true);
    
    try {
      // Get all offline reports
      const offlineReports = await offlineStorage.getPendingReports();
      
      // First, convert any reports with real user IDs to "offline-user" for proper linking
      const reportsWithRealUserIds = offlineReports.filter(report => 
        report.userId && report.userId !== 'offline-user' && report.userId.includes(user.id.substring(0, 8))
      );
      
      if (reportsWithRealUserIds.length > 0) {
        for (const report of reportsWithRealUserIds) {
          await offlineStorage.updatePendingReport(report.id, {
            ...report,
            userId: 'offline-user'
          });
        }
      }
      
      // Now get reports that need linking (should include the converted ones)
      const userOfflineReports = offlineReports.filter(report => 
        report.userId === 'offline-user'
      );

      if (userOfflineReports.length === 0) {
        hasLinkedRef.current = true;
        return;
      }

      // Update each offline report with the authenticated user's ID
      for (const report of userOfflineReports) {
        await offlineStorage.updatePendingReport(report.id, {
          ...report,
          userId: user.id
        });
      }
      
      hasLinkedRef.current = true; // Mark as linked to prevent re-running
    } catch (error) {
      // Error linking reports
    } finally {
      setIsLinking(false);
    }
  }, [user, isOnline]);

  // Reset linking flag when user changes
  useEffect(() => {
    hasLinkedRef.current = false;
  }, [user?.id]);

  // Auto-link offline reports when user comes online - completely automatic
  useEffect(() => {
    // Only run if we haven't already linked reports in this session
    if (isOnline && user && hasOfflineReports && !isLinking && !hasLinkedRef.current) {
      // Automatically link reports without user interaction
      linkOfflineReportsToUser();
    }
  }, [isOnline, user?.id, hasOfflineReports, isLinking, linkOfflineReportsToUser]);

  return {
    hasOfflineReports,
    pendingReportsCount,
    isLinking
  };
}
