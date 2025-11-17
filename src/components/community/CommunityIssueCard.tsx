import { useState, useRef } from 'react';
import { ThumbsUp, MapPin, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToggleUpvoteWithOptimistic } from '@/hooks/use-community';
import { triggerConfettiFromElement } from '@/utils/confetti';
import { format } from 'date-fns';
import { ISSUE_CATEGORIES } from '@/constants';

interface CommunityIssueCardProps {
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
    user_has_upvoted: boolean;
    reporter_name?: string;
  };
}

export function CommunityIssueCard({ issue }: CommunityIssueCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const toggleUpvote = useToggleUpvoteWithOptimistic();

  const handleUpvote = async () => {
    if (isAnimating) return;

    setIsAnimating(true);
    try {
      await toggleUpvote.mutateAsync(issue.id);
      
      // Trigger confetti from button
      if (buttonRef.current && !issue.user_has_upvoted) {
        triggerConfettiFromElement(buttonRef.current);
      }

      setTimeout(() => setIsAnimating(false), 1000);
    } catch (error) {
      setIsAnimating(false);
    }
  };

  const categoryInfo = ISSUE_CATEGORIES.find(cat => cat.value === issue.category);
  const imageUrl = issue.image_urls && issue.image_urls.length > 0 
    ? issue.image_urls[0] 
    : null;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col h-full">
      {/* Image */}
      {imageUrl && (
        <div className="w-full h-48 bg-gray-100">
          <img
            src={imageUrl}
            alt={issue.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <CardContent className="p-4 space-y-3 flex flex-col flex-1">
        {/* Category Badge */}
        {categoryInfo && (
          <Badge
            style={{ backgroundColor: categoryInfo.color }}
            className="text-white text-xs w-fit"
          >
            {categoryInfo.label}
          </Badge>
        )}

        {/* Title */}
        <h3 className="font-semibold text-gray-900 line-clamp-2">
          {issue.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2">
          {issue.description}
        </p>

        {/* Location and Date */}
        <div className="flex flex-col gap-2 text-xs text-gray-500 flex-1">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{issue.address}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{format(new Date(issue.created_at), 'MMM dd, yyyy')}</span>
            </div>
            <span className="font-medium">
              {issue.distance_km.toFixed(1)} km away
            </span>
          </div>
        </div>

        {/* Upvote Button - Always at bottom */}
        <div className="pt-2 border-t mt-auto">
          <Button
            ref={buttonRef}
            onClick={handleUpvote}
            disabled={isAnimating}
            variant={issue.user_has_upvoted ? 'default' : 'outline'}
            className={`w-full ${
              issue.user_has_upvoted
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'border-green-600 text-green-600 hover:bg-green-50'
            }`}
            size="sm"
          >
            <ThumbsUp
              className={`h-4 w-4 mr-2 ${
                issue.user_has_upvoted ? 'fill-current' : ''
              }`}
            />
            <span className="font-semibold">{issue.upvotes}</span>
            <span className="ml-1">
              {issue.user_has_upvoted ? 'Upvoted' : 'Upvote'}
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

