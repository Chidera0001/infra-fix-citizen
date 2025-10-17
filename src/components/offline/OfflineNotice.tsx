import { Card, CardContent } from '@/components/ui/card';
import { WifiOff } from 'lucide-react';

interface OfflineNoticeProps {
  message?: string;
  description?: string;
}

export function OfflineNotice({ 
  message = "You're currently offline",
  description = "Your report will be saved locally and submitted automatically when you're back online."
}: OfflineNoticeProps) {
  return (
    <Card className="mb-6 bg-orange-50 border-orange-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <WifiOff className="h-5 w-5 text-orange-600" />
          <div>
            <h3 className="font-semibold text-orange-800">{message}</h3>
            <p className="text-sm text-orange-700">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
