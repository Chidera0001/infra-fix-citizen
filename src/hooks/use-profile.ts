import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-react';
import { profileApi, type Profile, type ProfileUpdate } from '@/lib/supabase-api';
import { useToast } from '@/hooks/use-toast';

// Query keys
export const profileKeys = {
  all: ['profiles'] as const,
  current: () => [...profileKeys.all, 'current'] as const,
  detail: (clerkUserId: string) => [...profileKeys.all, 'detail', clerkUserId] as const,
};

// Hook to get current user profile
export function useCurrentProfile() {
  const { user, isLoaded } = useUser();

  return useQuery({
    queryKey: profileKeys.current(),
    queryFn: async () => {
      if (!user) return null;
      
      let profile = await profileApi.getProfile(user.id);
      
      // Create profile if it doesn't exist
      if (!profile && user) {
        profile = await profileApi.createOrUpdateProfile(user.id, {
          email: user.emailAddresses[0]?.emailAddress || '',
          full_name: user.fullName,
        });
      }
      
      return profile;
    },
    enabled: isLoaded && !!user,
  });
}

// Hook to get a specific profile
export function useProfile(clerkUserId: string) {
  return useQuery({
    queryKey: profileKeys.detail(clerkUserId),
    queryFn: () => profileApi.getProfile(clerkUserId),
    enabled: !!clerkUserId,
  });
}

// Hook to update current user profile
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useUser();

  return useMutation({
    mutationFn: (updates: ProfileUpdate) => {
      if (!user) throw new Error('User not authenticated');
      return profileApi.updateProfile(user.id, updates);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(profileKeys.current(), data);
      if (user) {
        queryClient.setQueryData(profileKeys.detail(user.id), data);
      }
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
      console.error('Update profile error:', error);
    },
  });
}

// Hook to get all profiles (admin only)
export function useAllProfiles() {
  const { data: currentProfile } = useCurrentProfile();

  return useQuery({
    queryKey: [...profileKeys.all, 'list'],
    queryFn: profileApi.getAllProfiles,
    enabled: currentProfile?.role === 'admin' || currentProfile?.role === 'moderator',
  });
}

// Hook to check if current user is admin
export function useIsAdmin() {
  const { data: profile } = useCurrentProfile();
  return profile?.role === 'admin' || profile?.role === 'moderator';
}
