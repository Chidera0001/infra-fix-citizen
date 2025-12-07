import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCurrentProfile, useUpdateProfile } from '@/hooks/use-profile';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const NICKNAME_DISMISSED_KEY = 'nickname-prompt-dismissed';
const DISMISS_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export function NicknamePrompt() {
  const { data: profile } = useCurrentProfile();
  const updateProfileMutation = useUpdateProfile();
  const { toast } = useToast();
  const [showPrompt, setShowPrompt] = useState(false);
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;

    // Check if user has a nickname
    const hasNickname =
      profile.user_nickname && profile.user_nickname.trim().length > 0;

    if (hasNickname) {
      setShowPrompt(false);
      return;
    }

    // Check if prompt was recently dismissed
    const dismissedTime = localStorage.getItem(NICKNAME_DISMISSED_KEY);
    if (dismissedTime) {
      const timeSinceDismiss = Date.now() - parseInt(dismissedTime, 10);
      if (timeSinceDismiss < DISMISS_DURATION) {
        setShowPrompt(false);
        return;
      }
    }

    // Show prompt if no nickname
    setShowPrompt(true);
  }, [profile]);

  const handleSave = async () => {
    setError(null);

    const trimmedNickname = nickname.trim();

    // Validation
    if (!trimmedNickname) {
      setError('Nickname cannot be empty');
      return;
    }

    if (
      trimmedNickname.toLowerCase() === profile?.full_name?.trim().toLowerCase()
    ) {
      setError('Nickname must be different from your real name');
      return;
    }

    if (trimmedNickname.length > 50) {
      setError('Nickname must be 50 characters or less');
      return;
    }

    // Check if nickname already exists (case-insensitive, excluding current user)
    try {
      const { data: existingProfiles, error: checkError } = await supabase
        .from('profiles')
        .select('id, user_nickname')
        .ilike('user_nickname', trimmedNickname);

      if (checkError) {
        throw checkError;
      }

      // Check if any other user (not the current user) has this nickname
      const isTakenByOtherUser = existingProfiles?.some(
        p =>
          p.id !== profile?.id &&
          p.user_nickname?.trim().toLowerCase() ===
            trimmedNickname.toLowerCase()
      );

      if (isTakenByOtherUser) {
        setError('This nickname is already taken by another user');
        return;
      }

      // If user already has this nickname, allow them to keep it
      const isCurrentUserNickname =
        profile?.user_nickname &&
        profile.user_nickname.trim().toLowerCase() ===
          trimmedNickname.toLowerCase();

      if (isCurrentUserNickname) {
        // User is keeping their existing nickname, proceed
      }

      // Save the nickname
      updateProfileMutation.mutate(
        { user_nickname: trimmedNickname },
        {
          onSuccess: () => {
            setShowPrompt(false);
            toast({
              title: 'Nickname saved!',
              description: 'Your nickname will appear on the leaderboard.',
            });
          },
          onError: () => {
            setError('Failed to save nickname. Please try again.');
          },
        }
      );
    } catch (error) {
      setError('Failed to check nickname availability. Please try again.');
      console.error('Error checking nickname:', error);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem(NICKNAME_DISMISSED_KEY, Date.now().toString());
    setShowPrompt(false);
  };

  if (!showPrompt || !profile) return null;

  return (
    <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
      <DialogContent
        className='w-[90vw] max-w-[425px] rounded-md p-4 sm:w-full sm:max-w-[425px] sm:p-6'
        style={{
          left: '50%',
          transform: 'translateX(-50%) translateY(-50%)',
          marginLeft: 0,
          marginRight: 0,
        }}
      >
        <DialogHeader>
          <DialogTitle className='text-lg sm:text-xl'>
            Add Your Nickname
          </DialogTitle>
          <DialogDescription className='text-sm'>
            {' '}
            This helps maintain privacy while making the leaderboard more
            engaging!
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4 py-2 sm:py-4'>
          <div className='space-y-2'>
            <Label htmlFor='nickname' className='text-sm font-medium'>
              Nickname
            </Label>
            <Input
              id='nickname'
              value={nickname}
              onChange={e => {
                setNickname(e.target.value);
                setError(null);
              }}
              placeholder='e.g., CityHero, RoadWarrior'
              className='rounded-xl border-green-300 text-base focus:border-green-500 focus:ring-green-500 sm:text-sm'
              disabled={updateProfileMutation.isPending}
            />
            {error && <p className='text-sm text-red-500'>{error}</p>}
            <p className='text-xs text-gray-500'>
              This will be shown on the leaderboard instead of your real name
            </p>
          </div>
          <div className='flex flex-col-reverse justify-end gap-2 sm:flex-row sm:gap-2'>
            <Button
              variant='outline'
              onClick={handleDismiss}
              disabled={updateProfileMutation.isPending}
              className='w-full sm:w-auto'
            >
              Later
            </Button>
            <Button
              onClick={handleSave}
              disabled={updateProfileMutation.isPending || !nickname.trim()}
              className='w-full bg-green-600 hover:bg-green-700 sm:w-auto'
            >
              {updateProfileMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
