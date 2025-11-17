import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw, X } from 'lucide-react';

export function PWAUpdateNotification() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        // Check for updates every 60 seconds when the app is active
        const updateInterval = setInterval(() => {
          registration.update();
        }, 60000);

        // Listen for new service worker
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (
                newWorker.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                // New version available!
                setWaitingWorker(newWorker);
                setShowUpdate(true);
              }
            });
          }
        });

        // Also check if there's already a waiting worker
        if (registration.waiting) {
          setWaitingWorker(registration.waiting);
          setShowUpdate(true);
        }

        // Cleanup interval on unmount
        return () => clearInterval(updateInterval);
      });

      // Listen for controller change (new SW activated)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  }, []);

  const updateApp = () => {
    if (waitingWorker) {
      // Tell the waiting service worker to skip waiting and activate immediately
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      
      // The controllerchange event listener will handle the reload
      setShowUpdate(false);
    }
  };

  const dismissUpdate = () => {
    setShowUpdate(false);
    // Show again after 5 minutes if they dismiss
    setTimeout(() => {
      if (waitingWorker) {
        setShowUpdate(true);
      }
    }, 5 * 60 * 1000);
  };

  if (!showUpdate) return null;

  return (
    <Card className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-50 border-green-200 shadow-lg max-w-md w-full mx-4">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-green-100 rounded-full">
            <RefreshCw className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-green-800 mb-1">
              New Version Available! 🎉
            </h3>
            <p className="text-sm text-green-700 mb-3">
              We've made improvements to fix data loading issues and enhance your experience. Update now to get the latest version.
            </p>
            <div className="flex gap-2">
              <Button 
                onClick={updateApp}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Update Now
              </Button>
              <Button 
                onClick={dismissUpdate}
                variant="ghost"
                size="sm"
                className="text-green-700 hover:text-green-800"
              >
                Later
              </Button>
            </div>
          </div>
          <Button 
            onClick={dismissUpdate}
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-green-600 hover:text-green-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

