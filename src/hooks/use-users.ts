import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, type Profile } from '@/lib/supabase-api';
import { useToast } from './use-toast';

// Query keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: UserFilters) => [...userKeys.lists(), filters] as const,
  detail: (userId: string) => [...userKeys.all, 'detail', userId] as const,
};

// Types
export interface UserFilters {
  search?: string;
  role?: string;
  is_active?: boolean;
  limit?: number;
  offset?: number;
}

export interface UserUpdate {
  full_name?: string;
  email?: string;
  role?: string;
  is_active?: boolean;
}

// Hook to get all users with filters
export function useUsers(filters: UserFilters = {}) {
  return useQuery({
    queryKey: userKeys.list(filters),
    queryFn: () => adminApi.getAllUsers(filters),
    staleTime: 30000, // 30 seconds
  });
}

// Hook to update user profile
export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ userId, updates }: { userId: string; updates: UserUpdate }) =>
      adminApi.updateUserProfile(userId, updates),
    onSuccess: (data, variables) => {
      // Invalidate all user lists
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      // Update specific user detail
      queryClient.setQueryData(userKeys.detail(variables.userId), data);
      
      toast({
        title: "User Updated",
        description: "User profile has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update user. Please try again.",
        variant: "destructive",
      });
      // Update user error
    },
  });
}

// Hook to delete user
export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (userId: string) => adminApi.deleteUser(userId),
    onSuccess: () => {
      // Invalidate all user lists
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      
      toast({
        title: "User Deleted",
        description: "User has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
      // Delete user error
    },
  });
}

// Hook to get user statistics
export function useUserStats() {
  return useQuery({
    queryKey: [...userKeys.all, 'stats'],
    queryFn: async () => {
      const [allUsers, activeUsers, adminUsers] = await Promise.all([
        adminApi.getAllUsers({ limit: 1000 }), // Get all users for stats
        adminApi.getAllUsers({ is_active: true, limit: 1000 }),
        adminApi.getAllUsers({ role: 'admin', limit: 1000 }),
      ]);

      return {
        total: allUsers.length,
        active: activeUsers.length,
        admins: adminUsers.length,
        inactive: allUsers.length - activeUsers.length,
      };
    },
    staleTime: 60000, // 1 minute
  });
}
