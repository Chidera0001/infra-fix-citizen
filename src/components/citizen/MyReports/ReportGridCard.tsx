import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  MoreHorizontal,
  Calendar,
  MapPin,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  Image,
  Clock,
} from 'lucide-react';
import type { Issue } from '@/lib/supabase-api';
import { formatDistanceToNow } from 'date-fns';

interface ReportGridCardProps {
  report: Issue;
  hideStatus?: boolean;
  hideCategory?: boolean;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'open':
      return <AlertCircle className='h-4 w-4 text-red-500' />;
    case 'in_progress':
      return <Clock className='h-4 w-4 text-yellow-500' />;
    case 'resolved':
      return <CheckCircle className='h-4 w-4 text-green-500' />;
    default:
      return <XCircle className='h-4 w-4 text-gray-500' />;
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const ReportGridCard = ({
  report,
  hideStatus = false,
  hideCategory = false,
}: ReportGridCardProps) => {
  const imageUrl = report.image_urls?.[0];
  const hasImages = report.image_urls && report.image_urls.length > 0;

  // Get upvote count - check both 'upvotes' and 'upvotes_count' fields
  const upvoteCount =
    (report as any).upvotes || (report as any).upvotes_count || 0;

  return (
    <Card className='flex h-full flex-col border border-gray-200 transition-all duration-200 hover:border-green-300 hover:shadow-lg'>
      <div className='relative h-48 w-full overflow-hidden rounded-t-lg bg-gray-100'>
        {hasImages ? (
          <img
            src={imageUrl}
            alt={report.title}
            className='h-full w-full object-cover'
          />
        ) : (
          <div className='flex h-full w-full items-center justify-center text-gray-400'>
            <Image className='h-16 w-16' />
          </div>
        )}
        {!hideStatus && (
          <div className='absolute left-2 top-2 flex items-center gap-2'>
            {getStatusIcon(report.status)}
            <Badge
              variant='outline'
              className={`${getSeverityColor(report.severity)} text-xs font-medium`}
            >
              {report.severity}
            </Badge>
          </div>
        )}
        {/* Upvote Count Badge - Top Right */}
        <Badge className='absolute right-2 top-2 z-10 border border-gray-200 bg-white/90 px-2 py-1 text-xs font-medium text-gray-700 shadow-sm backdrop-blur-sm'>
          {upvoteCount} {upvoteCount === 1 ? 'upvote' : 'upvotes'}
        </Badge>
        {report.image_urls && report.image_urls.length > 1 && (
          <Badge className='absolute bottom-2 right-2 z-10 bg-black/50 text-xs text-white'>
            +{report.image_urls.length - 1} more
          </Badge>
        )}
      </div>
      <CardContent className='flex flex-1 flex-col p-4'>
        <h3 className='mb-2 line-clamp-2 text-base font-semibold text-gray-900'>
          {report.title}
        </h3>
        <p className='mb-3 line-clamp-3 flex-1 text-sm text-gray-600'>
          {report.description}
        </p>

        <div className='mb-3 flex items-center gap-2 text-xs text-gray-500'>
          <MapPin className='h-3 w-3 flex-shrink-0' />
          <span className='truncate'>{report.address}</span>
        </div>
        <div className='mb-4 flex items-center gap-2 text-xs text-gray-500'>
          <Calendar className='h-3 w-3 flex-shrink-0' />
          <span className='whitespace-nowrap'>
            {formatDistanceToNow(new Date(report.created_at), {
              addSuffix: true,
            })}
          </span>
          {!hideCategory && (
            <Badge
              variant='outline'
              className='ml-auto w-fit flex-shrink-0 text-xs'
            >
              {report.category.replace('_', ' ')}
            </Badge>
          )}
        </div>

        {!hideStatus && (
          <div className='mt-2 flex items-center gap-2'>
            <Badge
              variant='outline'
              className={`flex-1 justify-center border-green-300 text-green-700 ${getSeverityColor(report.status)}`}
            >
              {report.status.replace('-', ' ')}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
