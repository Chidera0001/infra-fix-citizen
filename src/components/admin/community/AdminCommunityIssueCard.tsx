import { ThumbsUp, MapPin, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ISSUE_CATEGORIES } from '@/constants';

interface AdminCommunityIssueCardProps {
  issue: {
    id: string;
    title: string;
    description: string;
    category: string;
    address: string;
    image_urls: string[];
    upvotes: number;
    distance_km: number;
    created_at: string;
    reporter_name?: string;
  };
}

export function AdminCommunityIssueCard({
  issue,
}: AdminCommunityIssueCardProps) {
  const categoryInfo = ISSUE_CATEGORIES.find(
    cat => cat.value === issue.category
  );
  const imageUrl =
    issue.image_urls && issue.image_urls.length > 0
      ? issue.image_urls[0]
      : null;

  return (
    <Card className='flex h-full flex-col overflow-hidden transition-shadow duration-200 hover:shadow-lg'>
      {/* Image */}
      {imageUrl && (
        <div className='h-48 w-full bg-gray-100'>
          <img
            src={imageUrl}
            alt={issue.title}
            className='h-full w-full object-cover'
          />
        </div>
      )}

      <CardContent className='flex flex-1 flex-col space-y-3 p-4'>
        {/* Category Badge */}
        {categoryInfo && (
          <Badge
            style={{ backgroundColor: categoryInfo.color }}
            className='w-fit text-xs text-white'
          >
            {categoryInfo.label}
          </Badge>
        )}

        {/* Title */}
        <h3 className='line-clamp-2 font-semibold text-gray-900'>
          {issue.title}
        </h3>

        {/* Description */}
        <p className='line-clamp-2 text-sm text-gray-600'>
          {issue.description}
        </p>

        {/* Location and Date */}
        <div className='flex flex-1 flex-col gap-2 text-xs text-gray-500'>
          <div className='flex items-center gap-1'>
            <MapPin className='h-3 w-3' />
            <span className='truncate'>{issue.address}</span>
          </div>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-1'>
              <Calendar className='h-3 w-3' />
              <span>{format(new Date(issue.created_at), 'MMM dd, yyyy')}</span>
            </div>
            <span className='font-medium'>
              {issue.distance_km.toFixed(1)} km away
            </span>
          </div>
        </div>

        {/* Upvotes Display - Always at bottom (Read-only for admin) */}
        <div className='mt-auto border-t pt-2'>
          <div className='flex items-center justify-center gap-2 rounded-lg bg-green-50 p-3'>
            <ThumbsUp className='h-5 w-5 fill-current text-green-600' />
            <span className='text-lg font-bold text-gray-900'>
              {issue.upvotes}
            </span>
            <span className='text-sm text-gray-600'>
              {issue.upvotes === 1 ? 'upvote' : 'upvotes'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
