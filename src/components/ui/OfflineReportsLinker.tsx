import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, WifiOff, CheckCircle, Loader2 } from 'lucide-react';
import { useOfflineUserManager } from '@/hooks/use-offline-user-manager';
import { useToast } from '@/hooks/use-toast';

export function OfflineReportsLinker() {
  const { hasOfflineReports, pendingReportsCount, isLinking } = useOfflineUserManager();
  const { toast } = useToast();
  const [showNotification, setShowNotification] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Show notification when offline reports are detected
  useEffect(() => {
    if (hasOfflineReports && !isCompleted) {
      setShowNotification(true);
    }
  }, [hasOfflineReports, isCompleted]);

  // Auto-hide notification after linking is complete
  useEffect(() => {
    if (!isLinking && hasOfflineReports === false && showNotification) {
      setIsCompleted(true);
      toast({
        title: 'Reports Synced Successfully',
        description: `${pendingReportsCount} offline reports have been synced to your account.`,
      });
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setShowNotification(false);
        setIsCompleted(false);
      }, 3000);
    }
  }, [isLinking, hasOfflineReports, showNotification, pendingReportsCount, toast]);

  if (!showNotification) {
    return null;
  }

  return (
    <Card className="mb-6 bg-blue-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isLinking ? (
              <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
            ) : isCompleted ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <WifiOff className="h-5 w-5 text-blue-600" />
            )}
            <div>
              <h3 className="font-semibold text-blue-800">
                {isLinking ? 'Syncing Offline Reports...' : 
                 isCompleted ? 'Reports Synced Successfully!' : 
                 'Offline Reports Detected'}
              </h3>
              <p className="text-sm text-blue-700">
                {isLinking ? 'Please wait while we sync your offline reports.' :
                 isCompleted ? 'Your reports are now available in your dashboard.' :
                 `Found ${pendingReportsCount} report${pendingReportsCount !== 1 ? 's' : ''} saved offline. Syncing automatically...`}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
