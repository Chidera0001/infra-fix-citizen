'use client';

import { ArrowLeft, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface OfflineHeaderProps {
  title?: string;
  showOfflineIndicator?: boolean;
}

export function OfflineHeader({ title, showOfflineIndicator = true }: OfflineHeaderProps) {
  const router = useRouter();

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between relative">
          {/* Back Button - Left */}
          <Button variant="ghost" size="sm" onClick={() => router.push('/')} className="flex-shrink-0">
            <ArrowLeft className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Back to Home</span>
          </Button>
          
          {/* Logo - Center */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <img 
              src="/Assets/logo/Citizn-full-logo.png" 
              alt="Citizn Logo" 
              className="h-8 sm:h-12 w-auto"
            />
          </div>
          
          {/* Offline Mode Indicator - Right */}
          {showOfflineIndicator && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <WifiOff className="h-4 w-4 text-orange-500" />
              <span className="hidden sm:inline text-sm text-orange-600 font-medium">Offline Mode</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
