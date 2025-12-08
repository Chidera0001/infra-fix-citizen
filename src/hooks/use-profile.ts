import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import {
  profileApi,
  type Profile,
  type ProfileUpdate,
} from '@/lib/supabase-api';
import { useToast } from '@/hooks/use-toast';

// Query keys
export const profileKeys = {
  all: ['profiles'] as const,
  current: () => [...profileKeys.all, 'current'] as const,
  detail: (userId: string) => [...profileKeys.all, 'detail', userId] as const,
};

// Hook to get current user profile
export function useCurrentProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: [...profileKeys.current(), user?.id],
    queryFn: async () => {
      if (!user) return null;

      let profile = await profileApi.getProfile(user.id);

      // Create profile if it doesn't exist
      if (!profile && user) {
        profile = await profileApi.createOrUpdateProfile(user.id, {
          email: user.email || '',
          full_name: user.user_metadata?.full_name || 'User',
          user_nickname: user.user_metadata?.user_nickname || null,
        });
      }

      // If profile exists but is incomplete, update it
      if (profile && (!profile.email || profile.full_name === 'User')) {
        try {
          profile = await profileApi.updateProfile(user.id, {
            email: user.email || '',
            full_name: user.user_metadata?.full_name || 'User',
            user_nickname:
              user.user_metadata?.user_nickname ||
              profile.user_nickname ||
              null,
          });
        } catch (error) {
          // Failed to update profile
        }
      }

      return profile;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes - profile data doesn't change frequently
  });
}

// Hook to get a specific profile
export function useProfile(userId: string) {
  return useQuery({
    queryKey: profileKeys.detail(userId),
    queryFn: () => profileApi.getProfile(userId),
    enabled: !!userId,
  });
}

// Hook to update current user profile
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (updates: ProfileUpdate) => {
      if (!user) throw new Error('User not authenticated');
      return profileApi.updateProfile(user.id, updates);
    },
    onSuccess: data => {
      queryClient.setQueryData(profileKeys.current(), data);
      if (user) {
        queryClient.setQueryData(profileKeys.detail(user.id), data);
      }
      // Invalidate leaderboard queries to refresh nickname display
      queryClient.invalidateQueries({ queryKey: ['leaderboard-profiles'] });
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
      });
    },
    onError: error => {
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
      // Update profile error
    },
  });
}

// Hook to get all profiles (admin only)
export function useAllProfiles() {
  const { data: currentProfile } = useCurrentProfile();

  return useQuery({
    queryKey: [...profileKeys.all, 'list'],
    queryFn: profileApi.getAllProfiles,
    enabled:
      currentProfile?.role === 'admin' || currentProfile?.role === 'moderator',
  });
}

// Hook to check if current user is admin
export function useIsAdmin() {
  const { data: profile } = useCurrentProfile();
  return profile?.role === 'admin' || profile?.role === 'moderator';
}
