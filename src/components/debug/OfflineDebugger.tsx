import { useOnlineStatus } from '@/hooks/use-online-status';
import { usePendingReports, useSyncPendingReports, useDeletePendingReport } from '@/hooks/use-issues';
import { useOfflineUserManager } from '@/hooks/use-offline-user-manager';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Trash2, RefreshCw } from 'lucide-react';

export function OfflineDebugger() {
  const { isOnline, isChecking, connectionQuality } = useOnlineStatus();
  const { data: pendingReports = [] } = usePendingReports();
  const { hasOfflineReports, pendingReportsCount, isLinking } = useOfflineUserManager();
  const { user } = useAuth();
  const syncMutation = useSyncPendingReports();
  const deleteMutation = useDeletePendingReport();

  const handleManualSync = () => {
    // console.log('🔄 MANUAL SYNC: Triggering manual sync...');
    syncMutation.mutate();
  };

  const handleDeleteReport = (reportId: string) => {
    // console.log('🗑️ DELETE: Deleting report:', reportId);
    deleteMutation.mutate(reportId);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black bg-opacity-80 text-white p-4 rounded-lg shadow-lg text-xs font-mono max-w-sm">
      <h3 className="font-bold mb-2 text-sm">🔍 Offline Debug</h3>
      
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Online:</span>
          <span className={isOnline ? 'text-green-400' : 'text-red-400'}>
            {isOnline ? '✅' : '❌'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Checking:</span>
          <span className={isChecking ? 'text-yellow-400' : 'text-gray-400'}>
            {isChecking ? '🔄' : '⏸️'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Quality:</span>
          <span className={
            connectionQuality === 'good' ? 'text-green-400' : 
            connectionQuality === 'poor' ? 'text-yellow-400' : 'text-red-400'
          }>
            {connectionQuality}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>User:</span>
          <span className={user ? 'text-green-400' : 'text-red-400'}>
            {user ? '✅' : '❌'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>User ID:</span>
          <span className="text-gray-300 truncate">
            {user?.id?.slice(0, 8) || 'N/A'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Pending Reports:</span>
          <span className="text-blue-400">
            {pendingReports.length}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Offline Reports:</span>
          <span className="text-orange-400">
            {pendingReportsCount}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Has Offline:</span>
          <span className={hasOfflineReports ? 'text-orange-400' : 'text-gray-400'}>
            {hasOfflineReports ? '✅' : '❌'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Linking:</span>
          <span className={isLinking ? 'text-yellow-400' : 'text-gray-400'}>
            {isLinking ? '🔄' : '⏸️'}
          </span>
        </div>
      </div>
      
      {pendingReports.length > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-600">
          <div className="text-xs text-gray-300 mb-2">
            Reports ({pendingReports.length}):
          </div>
          
          {/* Individual Reports */}
          <div className="space-y-1 mb-2 max-h-32 overflow-y-auto">
            {pendingReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between bg-gray-800 p-1 rounded text-xs">
                <div className="flex-1 min-w-0">
                  <div className="truncate">
                    {report.id.slice(0, 8)}: {report.issueData?.title?.slice(0, 15) || 'No title'}...
                  </div>
                  <div className="text-gray-400">
                    Status: <span className={
                      report.syncStatus === 'pending' ? 'text-yellow-400' :
                      report.syncStatus === 'failed' ? 'text-red-400' :
                      report.syncStatus === 'syncing' ? 'text-blue-400' : 'text-green-400'
                    }>
                      {report.syncStatus}
                    </span>
                  </div>
                  {report.syncError && (
                    <div className="text-red-400 text-xs truncate" title={report.syncError}>
                      Error: {report.syncError.slice(0, 20)}...
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => handleDeleteReport(report.id)}
                  disabled={deleteMutation.isPending}
                  className="ml-1 p-1 h-6 w-6 bg-red-600 hover:bg-red-700"
                  size="sm"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          
          <Button 
            onClick={handleManualSync}
            disabled={syncMutation.isPending}
            className="w-full text-xs py-1 px-2 bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
            {syncMutation.isPending ? 'Syncing...' : 'Manual Sync'}
          </Button>
        </div>
      )}
    </div>
  );
}
