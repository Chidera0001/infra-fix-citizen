import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { uploadIssueImages } from '@/utils/imageUpload';

/**
 * Ensure a valid session exists before making API calls
 * This prevents 401 "Missing authorization header" errors
 */
async function ensureSession(): Promise<void> {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    // If no session, try to refresh it
    const {
      data: { session: refreshedSession },
      error: refreshError,
    } = await supabase.auth.refreshSession();

    if (refreshError || !refreshedSession) {
      throw new Error('Authentication required. Please sign in again.');
    }
  }
}

type Tables = Database['public']['Tables'];
type Issue = Tables['issues']['Row'];
type IssueInsert = Tables['issues']['Insert'];
type IssueUpdate = Tables['issues']['Update'];
type Profile = Tables['profiles']['Row'];
type ProfileInsert = Tables['profiles']['Insert'];
type ProfileUpdate = Tables['profiles']['Update'];
type Category = Tables['categories']['Row'];
type Notification = Tables['notifications']['Row'];

// Profile API
export const profileApi = {
  async createOrUpdateProfile(
    userId: string,
    userData: Partial<ProfileInsert>
  ) {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        user_id: userId,
        ...userData,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
    return data;
  },

  async updateProfile(userId: string, updates: ProfileUpdate) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAllProfiles() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },
};

// Categories API
export const categoriesApi = {
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  },
};

// Issues API
export const issuesApi = {
  async createIssue(issueData: IssueInsert, userId?: string, photos?: File[], isAnonymous?: boolean) {
    let profile: Profile | null = null;

    // For anonymous reports, skip authentication checks
    if (!isAnonymous) {
      // Ensure we have a valid session before making API calls
      await ensureSession();

      // First, get or create the user's profile
      profile = await getCurrentUserProfile(userId);
      if (!profile) {
        throw new Error(
          'User profile not found. Please ensure you are logged in.'
        );
      }
    }

    // Upload images if provided
    // Note: Image uploads may require storage policies to allow anonymous uploads
    let imageUrls: string[] = [];
    if (photos && photos.length > 0) {
      try {
        imageUrls = await uploadIssueImages(photos);
      } catch (error) {
        console.error('Error uploading images:', error);
        // Throw error to prevent issue creation if image upload fails
        throw new Error(
          `Failed to upload images: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }

    // Add the reporter_id and image_urls to the issue data
    const issueDataWithReporter = {
      ...issueData,
      reporter_id: isAnonymous ? null : profile?.id || null,
      image_urls: imageUrls.length > 0 ? imageUrls : issueData.image_urls || [],
    };

    const { data, error } = await supabase
      .from('issues')
      .insert(issueDataWithReporter)
      .select('*')
      .single();

    if (error) throw error;

    // Get the reporter profile separately (only if not anonymous)
    if (data && data.reporter_id && profile) {
      const { data: reporterProfile } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('id', data.reporter_id)
        .single();

      return {
        ...data,
        profiles: reporterProfile,
      };
    }

    // For anonymous reports, return data without profile
    return data;
  },

  async getIssues(filters?: {
    status?: string;
    category?: string;
    severity?: string;
    lat?: number;
    lng?: number;
    radius?: number;
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: string;
  }) {
    // First, try a simple query without the join to see if the basic table works
    let query = supabase.from('issues').select('*');

    // Apply filters
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.severity) {
      query = query.eq('severity', filters.severity);
    }

    // Apply sorting
    const sortBy = filters?.sortBy || 'created_at';
    const sortOrder =
      filters?.sortOrder === 'ASC' ? { ascending: true } : { ascending: false };
    query = query.order(sortBy, sortOrder);

    // Apply pagination
    const limit = filters?.limit || 20;
    const offset = filters?.offset || 0;
    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) throw error;

    // If we have data, try to get the profiles separately and merge them
    if (data && data.length > 0) {
      const reporterIds = [...new Set(data.map(issue => issue.reporter_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', reporterIds);

      // Merge profiles with issues
      const profilesMap = new Map(profiles?.map(p => [p.id, p]) || []);
      return data.map(issue => ({
        ...issue,
        profiles: profilesMap.get(issue.reporter_id) || null,
      }));
    }

    return data;
  },

  async getIssueById(id: string) {
    const { data, error } = await supabase
      .from('issues')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (data) {
      // Get reporter profile
      const { data: reporterProfile } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('id', data.reporter_id)
        .single();

      // Get comments with user profiles
      const { data: comments } = await supabase
        .from('issue_comments')
        .select('*')
        .eq('issue_id', id)
        .order('created_at', { ascending: true });

      // Get comment user profiles
      let commentsWithProfiles = [];
      if (comments && comments.length > 0) {
        const commentUserIds = [...new Set(comments.map(c => c.user_id))];
        const { data: commentProfiles } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', commentUserIds);

        const profilesMap = new Map(commentProfiles?.map(p => [p.id, p]) || []);
        commentsWithProfiles = comments.map(comment => ({
          ...comment,
          profiles: profilesMap.get(comment.user_id) || null,
        }));
      }

      // Get updates with user profiles
      const { data: updates } = await supabase
        .from('issue_updates')
        .select('*')
        .eq('issue_id', id)
        .order('created_at', { ascending: true });

      // Get update user profiles
      let updatesWithProfiles = [];
      if (updates && updates.length > 0) {
        const updateUserIds = [...new Set(updates.map(u => u.user_id))];
        const { data: updateProfiles } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', updateUserIds);

        const profilesMap = new Map(updateProfiles?.map(p => [p.id, p]) || []);
        updatesWithProfiles = updates.map(update => ({
          ...update,
          profiles: profilesMap.get(update.user_id) || null,
        }));
      }

      return {
        ...data,
        profiles: reporterProfile,
        issue_comments: commentsWithProfiles,
        issue_updates: updatesWithProfiles,
      };
    }

    return data;
  },

  async updateIssue(id: string, updates: IssueUpdate) {
    // Clean up undefined values before sending to Supabase
    const cleanedUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );

    const { data, error } = await supabase
      .from('issues')
      .update(cleanedUpdates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('🔴 supabase-api - Update error:', {
        error,
        errorMessage: error.message,
        errorDetails: error.details,
        errorHint: error.hint,
        errorCode: error.code,
      });
      throw error;
    }

    // Get the reporter profile separately
    if (data) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('id', data.reporter_id)
        .single();

      return {
        ...data,
        profiles: profile,
      };
    }

    return data;
  },

  async deleteIssue(id: string) {
    const { error } = await supabase.from('issues').delete().eq('id', id);

    if (error) throw error;
  },

  async toggleUpvote(issueId: string) {
    const { data, error } = await supabase.rpc('toggle_issue_upvote', {
      p_issue_id: issueId,
    });

    if (error) throw error;
    return data;
  },

  async getIssueStatistics(lat?: number, lng?: number, radius?: number) {
    const { data, error } = await supabase.rpc('get_issue_statistics', {
      p_lat: lat,
      p_lng: lng,
      p_radius_km: radius,
    });

    if (error) throw error;
    return data;
  },

  async checkDuplicateIssue(
    category: string,
    lat: number,
    lng: number,
    address: string
  ) {
    const { data, error } = await supabase.rpc('check_duplicate_issue', {
      p_category: category,
      p_lat: lat,
      p_lng: lng,
      p_address: address,
    });

    if (error) throw error;
    return data && data.length > 0 ? data[0] : null;
  },

  async getCommunityIssues(
    lat: number,
    lng: number,
    radiusKm: number = 5,
    category?: string,
    status?: string,
    sortBy: string = 'upvotes',
    limit: number = 50,
    offset: number = 0,
    excludeOwnIssues: boolean = true
  ) {
    const { data, error } = await supabase.rpc('get_community_issues', {
      p_lat: lat,
      p_lng: lng,
      p_radius_km: radiusKm,
      p_category: category || null,
      p_status: status || null,
      p_sort_by: sortBy,
      p_limit: limit,
      p_offset: offset,
      p_exclude_own_issues: excludeOwnIssues,
    });

    if (error) throw error;
    return data || [];
  },
};

// Comments API
export const commentsApi = {
  async createComment(
    issueId: string,
    comment: string,
    isOfficial = false,
    userId?: string
  ) {
    // Get current user profile first
    const profile = await getCurrentUserProfile(userId);
    if (!profile) throw new Error('User profile not found');

    const { data, error } = await supabase
      .from('issue_comments')
      .insert({
        issue_id: issueId,
        user_id: profile.id,
        comment,
        is_official: isOfficial,
      })
      .select('*')
      .single();

    if (error) throw error;

    // Get the user profile separately
    if (data) {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('id', data.user_id)
        .single();

      return {
        ...data,
        profiles: userProfile,
      };
    }

    return data;
  },

  async getComments(issueId: string) {
    const { data, error } = await supabase
      .from('issue_comments')
      .select('*')
      .eq('issue_id', issueId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Get user profiles separately
    if (data && data.length > 0) {
      const userIds = [...new Set(data.map(comment => comment.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', userIds);

      const profilesMap = new Map(profiles?.map(p => [p.id, p]) || []);
      return data.map(comment => ({
        ...comment,
        profiles: profilesMap.get(comment.user_id) || null,
      }));
    }

    return data;
  },

  async updateComment(commentId: string, comment: string) {
    const { data, error } = await supabase
      .from('issue_comments')
      .update({ comment })
      .eq('id', commentId)
      .select('*')
      .single();

    if (error) throw error;

    // Get the user profile separately
    if (data) {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('id', data.user_id)
        .single();

      return {
        ...data,
        profiles: userProfile,
      };
    }

    return data;
  },

  async deleteComment(commentId: string) {
    const { error } = await supabase
      .from('issue_comments')
      .delete()
      .eq('id', commentId);

    if (error) throw error;
  },
};

// Profile cache to avoid repeated database calls
const profileCache = new Map<string, { profile: Profile; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Function to clear profile cache (useful for sign out, auth changes, etc.)
export function clearProfileCache(userId?: string): void {
  if (userId) {
    profileCache.delete(userId);
  } else {
    profileCache.clear();
  }
}

// Helper function to get current user profile
export async function getCurrentUserProfile(
  userId?: string
): Promise<Profile | null> {
  // If no userId provided, we can't proceed
  if (!userId) {
    throw new Error('User ID is required');
  }

  // Skip cache for offline-user placeholder - this ensures proper profile creation
  if (userId === 'offline-user') {
    throw new Error('Cannot create profile for offline-user placeholder');
  }

  // Check cache first (only for real user IDs)
  const cached = profileCache.get(userId);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.profile;
  }

  // First, try to get existing profile
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  // If profile exists, cache and return it
  if (data) {
    profileCache.set(userId, { profile: data, timestamp: Date.now() });
    return data;
  }

  // Only get auth user data if profile doesn't exist
  // This is important for offline users coming online for the first time
  const { data: authUser } = await supabase.auth.getUser();
  const userData = authUser.user;

  if (!userData) {
    throw new Error('User not authenticated');
  }

  // Verify the auth user ID matches the requested userId
  if (userData.id !== userId) {
    throw new Error('User ID mismatch - authentication required');
  }

  const { data: newProfile, error: createError } = await supabase
    .from('profiles')
    .insert({
      user_id: userId,
      email: userData?.email || '',
      full_name: userData?.user_metadata?.full_name || 'User',
      user_nickname: userData?.user_metadata?.user_nickname || null,
      role: 'citizen',
      is_active: true,
    })
    .select('*')
    .single();

  if (createError) {
    throw createError;
  }

  // Cache the new profile
  profileCache.set(userId, { profile: newProfile, timestamp: Date.now() });
  return newProfile;
}

// Function to update profile with Supabase user data
export async function updateProfileWithUserData(userId: string, userData: any) {
  const { data: updatedProfile, error } = await supabase
    .from('profiles')
    .update({
      email: userData.email || '',
      full_name:
        userData.user_metadata?.full_name || userData.full_name || 'User',
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return updatedProfile;
}

// Real-time subscriptions
export const subscriptions = {
  subscribeToIssues(callback: (payload: any) => void) {
    return supabase
      .channel('issues-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'issues' },
        callback
      )
      .subscribe();
  },

  subscribeToIssueUpdates(issueId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`issue-${issueId}-updates`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'issue_updates',
          filter: `issue_id=eq.${issueId}`,
        },
        callback
      )
      .subscribe();
  },

  subscribeToComments(issueId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`issue-${issueId}-comments`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'issue_comments',
          filter: `issue_id=eq.${issueId}`,
        },
        callback
      )
      .subscribe();
  },

  subscribeToNotifications(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`user-${userId}-notifications`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  },
};

// Notifications API
export const notificationsApi = {
  async getNotifications(userId?: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId || (await supabase.auth.getUser()).data.user?.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('🔔 Error fetching notifications:', error);
      throw error;
    }
    return data;
  },

  async markAsRead(notificationIds: string[]) {
    const { error } = await supabase.rpc('mark_notifications_as_read', {
      notification_ids: notificationIds,
    });

    if (error) throw error;
  },

  async markAllAsRead() {
    const { error } = await supabase.rpc('mark_all_notifications_as_read');

    if (error) throw error;
  },

  async getUnreadCount(userId?: string) {
    if (!userId) return 0;

    // Count unread notifications directly using the provided userId
    const { data, error } = await supabase
      .from('notifications')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) {
      console.error('🔔 Error fetching unread count:', error);
      throw error;
    }

    return data?.length || 0;
  },

  async deleteNotification(notificationId: string) {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) throw error;
  },
};

// Admin API
export const adminApi = {
  async getAllUsers(filters?: {
    role?: string;
    is_active?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    let query = supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply role filter only if provided
    if (filters?.role) {
      query = query.eq('role', filters.role);
    }

    // Apply active status filter only if provided
    if (filters?.is_active !== undefined) {
      query = query.eq('is_active', filters.is_active);
    }

    // Apply search filter if provided
    if (filters?.search) {
      query = query.or(
        `full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
      );
    }

    // Apply pagination
    const offset = filters?.offset || 0;
    const limit = filters?.limit || 20;
    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) throw error;
    return data;
  },

  async updateUserProfile(
    userId: string,
    updates: Partial<ProfileUpdate> & { role?: string; is_active?: boolean }
  ) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteUser(userId: string) {
    const { error } = await supabase.from('profiles').delete().eq('id', userId);

    if (error) throw error;
  },

  async bulkUpdateIssues(issueIds: string[], updates: IssueUpdate) {
    const { data, error } = await supabase
      .from('issues')
      .update(updates)
      .in('id', issueIds)
      .select();

    if (error) throw error;
    return {
      updated_count: data.length,
      issues: data,
    };
  },

  async assignIssue(
    issueId: string,
    assignedTo: string,
    priority?: string,
    dueDate?: string
  ) {
    const { data, error } = await supabase
      .from('issues')
      .update({
        assigned_to: assignedTo,
        priority: priority || 'medium',
        due_date: dueDate,
      })
      .eq('id', issueId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getDashboardAnalytics(period: string = '30d', area?: string) {
    // This would typically call a database function for complex analytics
    const { data, error } = await supabase.rpc(
      'get_admin_dashboard_analytics',
      {
        p_period: period,
        p_area: area,
      }
    );

    if (error) throw error;
    return data;
  },

  async generateReport(
    reportType: string,
    startDate?: string,
    endDate?: string,
    format: string = 'json'
  ) {
    const { data, error } = await supabase.rpc('generate_admin_report', {
      p_report_type: reportType,
      p_start_date: startDate,
      p_end_date: endDate,
      p_format: format,
    });

    if (error) throw error;
    return data;
  },

  // Get area-based statistics by grouping issues by location
  async getAreaStatistics() {
    const { data, error } = await supabase
      .from('issues')
      .select('address, status')
      .not('address', 'is', null);

    if (error) throw error;

    if (!data || data.length === 0) {
      return [];
    }

    // Group by location (city/area) - extract city name from full address
    const areaStats = data.reduce((acc: any, issue: any) => {
      const fullAddress = issue.address || 'Unknown Location';

      // Extract city name from address (try to get the first meaningful part)
      let location = fullAddress;
      if (fullAddress.includes(',')) {
        // Take the first part before the first comma
        location = fullAddress.split(',')[0].trim();
      } else if (fullAddress.includes(' ')) {
        // If no comma, take the first two words
        const parts = fullAddress.split(' ');
        location = parts.slice(0, 2).join(' ');
      }

      // Clean up location name
      location = location.replace(/^\d+\s*/, ''); // Remove leading numbers
      location =
        location.charAt(0).toUpperCase() + location.slice(1).toLowerCase();

      if (!acc[location]) {
        acc[location] = { name: location, reports: 0, resolved: 0, pending: 0 };
      }
      acc[location].reports++;
      if (issue.status === 'resolved' || issue.status === 'closed') {
        acc[location].resolved++;
      } else {
        acc[location].pending++;
      }
      return acc;
    }, {});

    // Convert to array and sort by reports
    const sortedAreas = Object.values(areaStats)
      .sort((a: any, b: any) => b.reports - a.reports)
      .slice(0, 6); // Top 6 areas for better display

    // If we have no real data, return some sample data for demonstration
    if (sortedAreas.length === 0) {
      return [
        { name: 'Downtown Area', reports: 12, resolved: 8, pending: 4 },
        { name: 'Residential Zone', reports: 9, resolved: 6, pending: 3 },
        { name: 'Commercial District', reports: 7, resolved: 4, pending: 3 },
        { name: 'Industrial Area', reports: 5, resolved: 3, pending: 2 },
        { name: 'Suburban Zone', reports: 4, resolved: 2, pending: 2 },
        { name: 'Park District', reports: 3, resolved: 2, pending: 1 },
      ];
    }

    return sortedAreas;
  },

  // Get weekly trends from the last 7 days
  async getWeeklyTrends() {
    // Get the start of today (00:00:00) and go back 7 days to include today
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6); // -6 to include today (7 days total)
    sevenDaysAgo.setHours(0, 0, 0, 0); // Start of day

    const { data, error } = await supabase
      .from('issues')
      .select('created_at, resolved_at, status')
      .gte('created_at', sevenDaysAgo.toISOString())
      .lte('created_at', today.toISOString());

    if (error) throw error;

    // Group by day of week
    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const trends: any = {};

    // Initialize all days
    daysOfWeek.forEach(day => {
      trends[day] = { day: day.substring(0, 3), reports: 0, resolved: 0 }; // Use 3-letter format for chart
    });

    // Count issues by day
    if (data && data.length > 0) {
      data.forEach((issue: any) => {
        const issueDate = new Date(issue.created_at);
        const dayName = daysOfWeek[issueDate.getDay()];
        trends[dayName].reports++;

        // Check if issue was resolved on the same day it was created
        if (issue.status === 'resolved' || issue.status === 'closed') {
          trends[dayName].resolved++;
        } else if (issue.resolved_at) {
          const resolvedDate = new Date(issue.resolved_at);
          const resolvedDayName = daysOfWeek[resolvedDate.getDay()];
          trends[resolvedDayName].resolved++;
        }
      });
    }

    // Return in chronological order (7 days ago to today)
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dayName = daysOfWeek[date.getDay()];
      result.push(trends[dayName]);
    }

    return result;
  },

  // Get performance metrics
  async getPerformanceMetrics() {
    // Get all issues with timestamps
    const { data: allIssues, error: issuesError } = await supabase
      .from('issues')
      .select('created_at, resolved_at, status, updated_at');

    if (issuesError) throw issuesError;

    // Calculate average response time (time to first update)
    const issuesWithUpdates = allIssues.filter(
      issue => issue.updated_at && issue.updated_at !== issue.created_at
    );
    const avgResponseTime =
      issuesWithUpdates.length > 0
        ? issuesWithUpdates.reduce((sum, issue) => {
            const responseTime =
              new Date(issue.updated_at).getTime() -
              new Date(issue.created_at).getTime();
            return sum + responseTime;
          }, 0) /
          issuesWithUpdates.length /
          (1000 * 60 * 60) // Convert to hours
        : 0;

    // Calculate resolution rate
    const resolvedCount = allIssues.filter(
      issue => issue.status === 'resolved' || issue.status === 'closed'
    ).length;
    const resolutionRate =
      allIssues.length > 0 ? (resolvedCount / allIssues.length) * 100 : 0;

    // Calculate completion rate (in progress + resolved)
    const inProgressCount = allIssues.filter(
      issue => issue.status === 'in_progress'
    ).length;
    const completionRate =
      allIssues.length > 0
        ? ((inProgressCount + resolvedCount) / allIssues.length) * 100
        : 0;

    // Get upvotes data for satisfaction proxy (mock for now, can be enhanced)
    const { data: upvotesData, error: upvotesError } = await supabase
      .from('issue_upvotes')
      .select('issue_id');

    const totalUpvotes = upvotesData?.length || 0;
    const userSatisfaction =
      allIssues.length > 0
        ? Math.min(100, (totalUpvotes / allIssues.length) * 20) // Scale upvotes to satisfaction
        : 0;

    return {
      avgResponseTime: Math.round(avgResponseTime * 10) / 10, // Round to 1 decimal
      resolutionRate: Math.round(resolutionRate),
      userSatisfaction: Math.round(userSatisfaction),
      completionRate: Math.round(completionRate),
      totalCompleted: inProgressCount + resolvedCount,
      totalIssues: allIssues.length,
    };
  },

  // Get trend comparison (current vs previous period)
  async getTrendComparison(days: number = 30) {
    const now = new Date();
    const currentPeriodStart = new Date(
      now.getTime() - days * 24 * 60 * 60 * 1000
    );
    const previousPeriodStart = new Date(
      now.getTime() - 2 * days * 24 * 60 * 60 * 1000
    );

    // Get current period issues
    const { data: currentIssues, error: currentError } = await supabase
      .from('issues')
      .select('id, status, resolved_at')
      .gte('created_at', currentPeriodStart.toISOString());

    if (currentError) throw currentError;

    // Get previous period issues
    const { data: previousIssues, error: previousError } = await supabase
      .from('issues')
      .select('id, status, resolved_at')
      .gte('created_at', previousPeriodStart.toISOString())
      .lt('created_at', currentPeriodStart.toISOString());

    if (previousError) throw previousError;

    // Calculate percentage changes
    const currentTotal = currentIssues.length;
    const previousTotal = previousIssues.length;
    const issuesChange =
      previousTotal > 0
        ? ((currentTotal - previousTotal) / previousTotal) * 100
        : 0;

    const currentResolved = currentIssues.filter(
      i => i.status === 'resolved' || i.status === 'closed'
    ).length;
    const previousResolved = previousIssues.filter(
      i => i.status === 'resolved' || i.status === 'closed'
    ).length;
    const resolutionChange =
      previousResolved > 0
        ? ((currentResolved - previousResolved) / previousResolved) * 100
        : 0;

    // Calculate average resolution time change
    const currentResolvedWithTime = currentIssues.filter(i => i.resolved_at);
    const previousResolvedWithTime = previousIssues.filter(i => i.resolved_at);

    const currentAvgTime =
      currentResolvedWithTime.length > 0
        ? currentResolvedWithTime.reduce((sum, issue) => {
            return (
              sum +
              (new Date(issue.resolved_at!).getTime() - new Date().getTime())
            );
          }, 0) / currentResolvedWithTime.length
        : 0;

    const previousAvgTime =
      previousResolvedWithTime.length > 0
        ? previousResolvedWithTime.reduce((sum, issue) => {
            return (
              sum +
              (new Date(issue.resolved_at!).getTime() - new Date().getTime())
            );
          }, 0) / previousResolvedWithTime.length
        : 0;

    const responseTimeChange =
      previousAvgTime > 0
        ? ((currentAvgTime - previousAvgTime) / previousAvgTime) * 100
        : 0;

    return {
      issuesChange: Math.round(issuesChange * 10) / 10,
      resolutionChange: Math.round(resolutionChange * 10) / 10,
      responseTimeChange: Math.round(responseTimeChange * 10) / 10,
      satisfactionChange: Math.round((Math.random() - 0.5) * 20 * 10) / 10, // TODO: Calculate from real feedback
    };
  },

  async getSystemHealth() {
    // This would typically check various system metrics
    const { data, error } = await supabase.rpc('get_system_health');

    if (error) throw error;
    return data;
  },

  async triggerMaintenance(operation: string, dryRun: boolean = false) {
    const { data, error } = await supabase.rpc('trigger_maintenance', {
      p_operation: operation,
      p_dry_run: dryRun,
    });

    if (error) throw error;
    return data;
  },

  // Get response time analysis by category
  async getResponseTimeByCategory() {
    const { data, error } = await supabase
      .from('issues')
      .select('category, created_at, updated_at')
      .not('category', 'is', null);

    if (error) throw error;

    // Group by category and calculate average response time
    const categoryStats = data.reduce((acc: any, issue: any) => {
      const category = issue.category || 'Other';
      if (!acc[category]) {
        acc[category] = { category, totalTime: 0, count: 0 };
      }

      if (issue.updated_at && issue.updated_at !== issue.created_at) {
        const responseTime =
          new Date(issue.updated_at).getTime() -
          new Date(issue.created_at).getTime();
        acc[category].totalTime += responseTime;
        acc[category].count++;
      }

      return acc;
    }, {});

    // Calculate averages and convert to hours
    return Object.values(categoryStats).map((stat: any) => ({
      category: stat.category,
      time:
        stat.count > 0
          ? Math.round((stat.totalTime / stat.count / (1000 * 60 * 60)) * 10) /
            10
          : 0,
    }));
  },

  // Get monthly resolution rate trends
  async getMonthlyResolutionTrends() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const { data, error } = await supabase
      .from('issues')
      .select('created_at, resolved_at, status')
      .gte('created_at', sixMonthsAgo.toISOString());

    if (error) throw error;

    // Group by month
    const monthlyStats: any = {};
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    data.forEach((issue: any) => {
      const date = new Date(issue.created_at);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      const monthName = monthNames[date.getMonth()];

      if (!monthlyStats[monthKey]) {
        monthlyStats[monthKey] = { month: monthName, total: 0, resolved: 0 };
      }

      monthlyStats[monthKey].total++;
      if (issue.status === 'resolved' || issue.status === 'closed') {
        monthlyStats[monthKey].resolved++;
      }
    });

    // Calculate rates and return last 6 months
    return Object.values(monthlyStats)
      .map((stat: any) => ({
        month: stat.month,
        rate:
          stat.total > 0 ? Math.round((stat.resolved / stat.total) * 100) : 0,
      }))
      .slice(-6); // Last 6 months
  },

  // Get issue volume by severity
  async getIssueVolumeBySeverity() {
    const { data, error } = await supabase
      .from('issues')
      .select('severity')
      .not('severity', 'is', null);

    if (error) throw error;

    // Count by severity
    const severityCounts = data.reduce((acc: any, issue: any) => {
      const severity = issue.severity || 'medium';
      acc[severity] = (acc[severity] || 0) + 1;
      return acc;
    }, {});

    // Map to chart data with colors
    const severityMap: any = {
      critical: { name: 'Critical', color: '#ef4444' },
      high: { name: 'High', color: '#f59e0b' },
      medium: { name: 'Medium', color: '#10b981' },
      low: { name: 'Low', color: '#6b7280' },
    };

    return Object.entries(severityCounts).map(([severity, count]) => ({
      name: severityMap[severity]?.name || severity,
      value: count,
      color: severityMap[severity]?.color || '#6b7280',
    }));
  },

  // Get unique locations from issues
  async getUniqueLocations() {
    const { data, error } = await supabase
      .from('issues')
      .select('address')
      .not('address', 'is', null);

    if (error) throw error;

    if (!data || data.length === 0) {
      return [];
    }

    // Extract unique location names (city/area from full address)
    const locations = new Set();

    data.forEach((issue: any) => {
      const fullAddress = issue.address || '';

      // Extract city name from address (try to get the first meaningful part)
      let location = fullAddress;
      if (fullAddress.includes(',')) {
        // Take the first part before the first comma
        location = fullAddress.split(',')[0].trim();
      } else if (fullAddress.includes(' ')) {
        // If no comma, take the first two words
        const parts = fullAddress.split(' ');
        location = parts.slice(0, 2).join(' ');
      }

      // Clean up location name
      location = location.replace(/^\d+\s*/, ''); // Remove leading numbers
      location =
        location.charAt(0).toUpperCase() + location.slice(1).toLowerCase();

      if (location && location !== 'Unknown') {
        locations.add(location);
      }
    });

    // Convert to array and sort alphabetically
    return Array.from(locations).sort();
  },

  // Get user satisfaction breakdown
  async getUserSatisfactionBreakdown() {
    // Get upvotes data as proxy for satisfaction
    const { data: upvotesData, error: upvotesError } = await supabase
      .from('issue_upvotes')
      .select('issue_id');

    if (upvotesError) throw upvotesError;

    // Get total issues
    const { data: issuesData, error: issuesError } = await supabase
      .from('issues')
      .select('id');

    if (issuesError) throw issuesError;

    const totalIssues = issuesData.length;
    const totalUpvotes = upvotesData.length;

    // Calculate satisfaction based on upvote ratio
    const satisfactionRatio = totalIssues > 0 ? totalUpvotes / totalIssues : 0;

    // Simulate satisfaction breakdown based on upvote ratio
    const excellent = Math.round(satisfactionRatio * 35);
    const good = Math.round(satisfactionRatio * 45);
    const average = Math.round(satisfactionRatio * 15);
    const poor = Math.round(satisfactionRatio * 5);

    const overallRating =
      totalIssues > 0 ? Math.min(5, 3 + satisfactionRatio * 2) : 0;

    return {
      overallRating: Math.round(overallRating * 10) / 10,
      breakdown: [
        { label: 'Excellent', percentage: excellent, color: '#10b981' },
        { label: 'Good', percentage: good, color: '#10b981' },
        { label: 'Average', percentage: average, color: '#f59e0b' },
        { label: 'Poor', percentage: poor, color: '#ef4444' },
      ],
    };
  },
};

// Export types for use in components
export type {
  Issue,
  IssueInsert,
  IssueUpdate,
  Profile,
  ProfileInsert,
  ProfileUpdate,
  Category,
  Notification,
};
