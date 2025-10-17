import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  Clock, 
  RefreshCw, 
  XCircle, 
  CheckCircle, 
  Trash2,
  MapPin,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { usePendingReports, useSyncSingleReport } from '@/hooks/use-issues';
import { offlineStorage } from '@/utils/offlineStorage';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { PendingReport } from '@/types/offline';

interface PendingReportsListProps {
  className?: string;
}

export function PendingReportsList({ className }: PendingReportsListProps) {
  const { data: pendingReports = [], refetch } = usePendingReports();
  const syncSingleMutation = useSyncSingleReport();
  const { toast } = useToast();
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);

  const handleSyncSingle = async (reportId: string) => {
    syncSingleMutation.mutate(reportId);
  };

  const handleDelete = async (reportId: string) => {
    try {
      await offlineStorage.deletePendingReport(reportId);
      toast({
        title: 'Report Deleted',
        description: 'Pending report has been removed',
      });
      refetch();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete report',
        variant: 'destructive',
      });
    }
    setDeleteDialogOpen(null);
  };

  const getStatusIcon = (status: PendingReport['syncStatus']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-gray-500" />;
      case 'syncing':
        return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'synced':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: PendingReport['syncStatus']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-700">Pending</Badge>;
      case 'syncing':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700">Syncing</Badge>;
      case 'failed':
        return <Badge variant="destructive" className="bg-red-100 text-red-700">Failed</Badge>;
      case 'synced':
        return <Badge variant="secondary" className="bg-green-100 text-green-700">Synced</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (pendingReports.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">All Caught Up!</h3>
          <p className="text-gray-600">
            No pending reports. All your submissions have been synced.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Pending Reports ({pendingReports.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {pendingReports.map((report) => (
          <div
            key={report.id}
            className="border rounded-lg p-4 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">
                  {report.issueData.title}
                </h4>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {report.issueData.description}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                {getStatusIcon(report.syncStatus)}
                {getStatusBadge(report.syncStatus)}
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{report.issueData.address}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(report.createdAt)}</span>
              </div>
            </div>

            {report.syncStatus === 'failed' && report.syncError && (
              <div className="bg-red-50 border border-red-200 rounded p-2">
                <p className="text-xs text-red-700">
                  <strong>Error:</strong> {report.syncError}
                </p>
                <p className="text-xs text-red-600 mt-1">
                  Attempts: {report.syncAttempts}
                </p>
              </div>
            )}

            <div className="flex items-center gap-2">
              {report.syncStatus === 'pending' && (
                <Button
                  size="sm"
                  onClick={() => handleSyncSingle(report.id)}
                  disabled={syncSingleMutation.isPending}
                  className="h-8"
                >
                  <RefreshCw className={cn(
                    "h-3 w-3 mr-1",
                    syncSingleMutation.isPending && "animate-spin"
                  )} />
                  Sync Now
                </Button>
              )}
              
              {report.syncStatus === 'failed' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSyncSingle(report.id)}
                  disabled={syncSingleMutation.isPending}
                  className="h-8"
                >
                  <RefreshCw className={cn(
                    "h-3 w-3 mr-1",
                    syncSingleMutation.isPending && "animate-spin"
                  )} />
                  Retry
                </Button>
              )}

              <AlertDialog open={deleteDialogOpen === report.id} onOpenChange={(open) => 
                setDeleteDialogOpen(open ? report.id : null)
              }>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Pending Report?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the pending report "{report.issueData.title}". 
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(report.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
