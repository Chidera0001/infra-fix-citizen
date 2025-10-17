import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Clock, 
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useOnlineStatus } from '@/hooks/use-online-status';
import { usePendingReports, useSyncPendingReports } from '@/hooks/use-issues';
import { cn } from '@/lib/utils';

interface OfflineIndicatorProps {
  className?: string;
}

export function OfflineIndicator({ className }: OfflineIndicatorProps) {
  const { isOnline, isChecking } = useOnlineStatus();
  const { data: pendingReports = [] } = usePendingReports();
  const syncMutation = useSyncPendingReports();
  
  const pendingCount = pendingReports.filter(report => 
    report.syncStatus === 'pending' || report.syncStatus === 'failed'
  ).length;

  const handleSync = () => {
    syncMutation.mutate();
  };

  if (isOnline && pendingCount === 0) {
    return null; // Don't show indicator when online with no pending reports
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-8 px-2 gap-2 border-0 bg-transparent hover:bg-gray-100",
            !isOnline && "text-orange-600 hover:text-orange-700",
            isOnline && pendingCount > 0 && "text-blue-600 hover:text-blue-700",
            className
          )}
        >
          {isChecking ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : isOnline ? (
            <Wifi className="h-4 w-4" />
          ) : (
            <WifiOff className="h-4 w-4" />
          )}
          
          <Badge 
            variant={!isOnline ? "destructive" : "secondary"}
            className={cn(
              "h-5 px-1.5 text-xs",
              !isOnline && "bg-orange-100 text-orange-700 border-orange-200",
              isOnline && pendingCount > 0 && "bg-blue-100 text-blue-700 border-blue-200"
            )}
          >
            {!isOnline ? "Offline" : `${pendingCount} pending`}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-64">
        <div className="px-2 py-1.5">
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Wifi className="h-4 w-4 text-green-600" />
            ) : (
              <WifiOff className="h-4 w-4 text-orange-600" />
            )}
            <span className="text-sm font-medium">
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            {isOnline 
              ? pendingCount > 0 
                ? `${pendingCount} report(s) pending sync`
                : "All reports synced"
              : "Reports will sync when online"
            }
          </p>
        </div>
        
        {pendingCount > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5">
              <div className="text-xs font-medium text-gray-700 mb-2">
                Pending Reports:
              </div>
              <div className="space-y-1">
                {pendingReports
                  .filter(report => report.syncStatus !== 'synced')
                  .slice(0, 3)
                  .map((report) => (
                    <div key={report.id} className="flex items-center gap-2 text-xs">
                      {report.syncStatus === 'pending' && (
                        <Clock className="h-3 w-3 text-gray-500" />
                      )}
                      {report.syncStatus === 'syncing' && (
                        <RefreshCw className="h-3 w-3 animate-spin text-blue-500" />
                      )}
                      {report.syncStatus === 'failed' && (
                        <XCircle className="h-3 w-3 text-red-500" />
                      )}
                      <span className="truncate flex-1">{report.issueData.title}</span>
                    </div>
                  ))}
                {pendingCount > 3 && (
                  <div className="text-xs text-gray-500">
                    +{pendingCount - 3} more...
                  </div>
                )}
              </div>
            </div>
          </>
        )}
        
        {isOnline && pendingCount > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleSync}
              disabled={syncMutation.isPending}
              className="cursor-pointer"
            >
              <RefreshCw className={cn(
                "h-4 w-4 mr-2",
                syncMutation.isPending && "animate-spin"
              )} />
              {syncMutation.isPending ? "Syncing..." : "Sync Now"}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
