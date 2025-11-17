import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThumbsUp, MapPin, Calendar } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToggleUpvote } from '@/hooks/use-issues';
import { useCurrentProfile } from '@/hooks/use-profile';
import { triggerConfetti } from '@/utils/confetti';
import { format } from 'date-fns';

interface DuplicateIssue {
  issue_id: string;
  title: string;
  description: string;
  address: string;
  image_urls: string[];
  upvotes: number;
  distance_meters: number;
  reporter_id: string;
  reporter_name: string;
  created_at: string;
}

interface DuplicateIssueDialogProps {
  open: boolean;
  onClose: () => void;
  duplicateIssue: DuplicateIssue | null;
}

export function DuplicateIssueDialog({
  open,
  onClose,
  duplicateIssue,
}: DuplicateIssueDialogProps) {
  const [isUpvoting, setIsUpvoting] = useState(false);
  const toggleUpvote = useToggleUpvote();
  const navigate = useNavigate();
  const { data: currentProfile } = useCurrentProfile();

  if (!duplicateIssue) return null;

  // Check if the current user is the reporter of the duplicate issue
  const isOwnReport = currentProfile?.id === duplicateIssue.reporter_id;

  const handleUpvote = async () => {
    if (!duplicateIssue?.issue_id) return;

    setIsUpvoting(true);
    try {
      await toggleUpvote.mutateAsync(duplicateIssue.issue_id);
      triggerConfetti();
      
      // Wait a moment for confetti animation
      setTimeout(() => {
        onClose();
        navigate('/citizen?tab=community');
      }, 1000);
    } catch (error) {
      console.error('Error upvoting:', error);
      setIsUpvoting(false);
    }
  };

  const imageUrl =
    duplicateIssue.image_urls && duplicateIssue.image_urls.length > 0
      ? duplicateIssue.image_urls[0]
      : null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-green-700">
            {isOwnReport ? 'You Already Reported This Issue' : 'Issue Already Reported'}
          </DialogTitle>
          <DialogDescription>
            {isOwnReport
              ? 'You have already submitted a report for this issue at this location. Please check your reports or the community page to view it.'
              : 'Someone has already reported a similar issue in this area. You can upvote it to show it affects you too!'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Issue Image */}
          {imageUrl && (
            <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100">
              <img
                src={imageUrl}
                alt={duplicateIssue.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Issue Details */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-gray-900">
              {duplicateIssue.title}
            </h3>

            <p className="text-gray-700">{duplicateIssue.description}</p>

            {/* Metadata */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{duplicateIssue.address}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {format(new Date(duplicateIssue.created_at), 'MMM dd, yyyy')}
                </span>
              </div>
            </div>

            {/* Distance Badge */}
            <Badge variant="secondary" className="text-xs">
              {duplicateIssue.distance_meters < 1000
                ? `${Math.round(duplicateIssue.distance_meters)}m away`
                : `${(duplicateIssue.distance_meters / 1000).toFixed(1)}km away`}
            </Badge>

            {/* Upvotes Display */}
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <ThumbsUp className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-gray-900">
                {duplicateIssue.upvotes}
              </span>
              <span className="text-gray-600">
                {duplicateIssue.upvotes === 1 ? 'person' : 'people'} affected
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {isOwnReport ? (
              // If it's user's own report, show only View and Close buttons
              <>
                <Button
                  onClick={() => {
                    onClose();
                    navigate('/citizen?tab=reports');
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  size="lg"
                >
                  View My Reports
                </Button>
                <Button
                  onClick={onClose}
                  variant="outline"
                  size="lg"
                  className="flex-1"
                >
                  Close
                </Button>
              </>
            ) : (
              // If it's someone else's report, show Upvote and Cancel buttons
              <>
                <Button
                  onClick={handleUpvote}
                  disabled={isUpvoting}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  size="lg"
                >
                  <ThumbsUp className="h-5 w-5 mr-2" />
                  {isUpvoting ? 'Upvoting...' : 'Upvote This Issue'}
                </Button>
                <Button
                  onClick={onClose}
                  variant="outline"
                  size="lg"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

