import { ArrowLeft } from 'lucide-react';
import { useIssues } from '@/hooks/use-issues';
import InteractiveMap from './InteractiveMap.dynamic';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface IssueMapProps {
  onBack: () => void;
  isAdmin?: boolean;
  onLocationSelect?: (coordinates: { lat: number; lng: number }) => void;
}

const IssueMap = ({
  onBack,
  isAdmin = false,
  onLocationSelect,
}: IssueMapProps) => {
  const { data: issues = [], isLoading } = useIssues({ limit: 100 });

  return (
    <div className='flex h-screen w-full flex-col bg-gray-50'>
      {/* Full-Width Map */}
      <div className='w-full flex-1'>
        {isLoading ? (
          <div className='flex h-full items-center justify-center'>
            <LoadingSpinner text='Loading map...' />
          </div>
        ) : (
          <InteractiveMap
            issues={issues}
            isAdmin={isAdmin}
            onLocationSelect={onLocationSelect}
            className='h-full w-full'
          />
        )}
      </div>
    </div>
  );
};

export default IssueMap;
