import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { useUser } from '@clerk/clerk-react';

type Tables = Database['public']['Tables'];
type Issue = Tables['issues']['Row'];
type IssueInsert = Tables['issues']['Insert'];
type IssueUpdate = Tables['issues']['Update'];
type Profile = Tables['profiles']['Row'];
type ProfileInsert = Tables['profiles']['Insert'];
type ProfileUpdate = Tables['profiles']['Update'];
type Category = Tables['categories']['Row'];

// Profile API
export const profileApi = {
  async createOrUpdateProfile(clerkUserId: string, userData: Partial<ProfileInsert>) {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        clerk_user_id: clerkUserId,
        ...userData,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getProfile(clerkUserId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('clerk_user_id', clerkUserId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
    return data;
  },

  async updateProfile(clerkUserId: string, updates: ProfileUpdate) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('clerk_user_id', clerkUserId)
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
  }
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
  }
};

// Issues API
export const issuesApi = {
  async createIssue(issueData: IssueInsert) {
    const { data, error } = await supabase
      .from('issues')
      .insert(issueData)
      .select(`
        *,
        profiles!reporter_id (
          id,
          full_name,
          email
        )
      `)
      .single();
    
    if (error) throw error;
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
    const { data, error } = await supabase.rpc('get_issues_with_filters', {
      p_status: filters?.status as any,
      p_category: filters?.category as any,
      p_severity: filters?.severity as any,
      p_lat: filters?.lat,
      p_lng: filters?.lng,
      p_radius_km: filters?.radius,
      p_limit: filters?.limit || 20,
      p_offset: filters?.offset || 0,
      p_sort_by: filters?.sortBy || 'created_at',
      p_sort_order: filters?.sortOrder || 'DESC'
    });
    
    if (error) throw error;
    return data;
  },

  async getIssueById(id: string) {
    const { data, error } = await supabase
      .from('issues')
      .select(`
        *,
        profiles!reporter_id (
          id,
          full_name,
          email
        ),
        issue_comments (
          *,
          profiles!user_id (
            id,
            full_name,
            email
          )
        ),
        issue_updates (
          *,
          profiles!user_id (
            id,
            full_name,
            email
          )
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateIssue(id: string, updates: IssueUpdate) {
    const { data, error } = await supabase
      .from('issues')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        profiles!reporter_id (
          id,
          full_name,
          email
        )
      `)
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteIssue(id: string) {
    const { error } = await supabase
      .from('issues')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async toggleUpvote(issueId: string) {
    const { data, error } = await supabase.rpc('toggle_issue_upvote', {
      p_issue_id: issueId
    });
    
    if (error) throw error;
    return data;
  },

  async getIssueStatistics(lat?: number, lng?: number, radius?: number) {
    const { data, error } = await supabase.rpc('get_issue_statistics', {
      p_lat: lat,
      p_lng: lng,
      p_radius_km: radius
    });
    
    if (error) throw error;
    return data;
  }
};

// Comments API
export const commentsApi = {
  async createComment(issueId: string, comment: string, isOfficial = false) {
    // Get current user profile first
    const profile = await getCurrentUserProfile();
    if (!profile) throw new Error('User profile not found');

    const { data, error } = await supabase
      .from('issue_comments')
      .insert({
        issue_id: issueId,
        user_id: profile.id,
        comment,
        is_official: isOfficial
      })
      .select(`
        *,
        profiles!user_id (
          id,
          full_name,
          email
        )
      `)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getComments(issueId: string) {
    const { data, error } = await supabase
      .from('issue_comments')
      .select(`
        *,
        profiles!user_id (
          id,
          full_name,
          email
        )
      `)
      .eq('issue_id', issueId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async updateComment(commentId: string, comment: string) {
    const { data, error } = await supabase
      .from('issue_comments')
      .update({ comment })
      .eq('id', commentId)
      .select(`
        *,
        profiles!user_id (
          id,
          full_name,
          email
        )
      `)
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteComment(commentId: string) {
    const { error } = await supabase
      .from('issue_comments')
      .delete()
      .eq('id', commentId);
    
    if (error) throw error;
  }
};

// Notifications API
export const notificationsApi = {
  async getNotifications() {
    const profile = await getCurrentUserProfile();
    if (!profile) throw new Error('User profile not found');

    const { data, error } = await supabase
      .from('notifications')
      .select(`
        *,
        issues (
          id,
          title
        )
      `)
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async markAsRead(notificationId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);
    
    if (error) throw error;
  },

  async markAllAsRead() {
    const profile = await getCurrentUserProfile();
    if (!profile) throw new Error('User profile not found');

    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', profile.id)
      .eq('read', false);
    
    if (error) throw error;
  }
};

// Helper function to get current user profile
export async function getCurrentUserProfile(): Promise<Profile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('clerk_user_id', user.id)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

// Real-time subscriptions
export const subscriptions = {
  subscribeToIssues(callback: (payload: any) => void) {
    return supabase
      .channel('issues-channel')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'issues' }, 
        callback
      )
      .subscribe();
  },

  subscribeToIssueUpdates(issueId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`issue-${issueId}-updates`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'issue_updates',
          filter: `issue_id=eq.${issueId}`
        }, 
        callback
      )
      .subscribe();
  },

  subscribeToComments(issueId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`issue-${issueId}-comments`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'issue_comments',
          filter: `issue_id=eq.${issueId}`
        }, 
        callback
      )
      .subscribe();
  },

  subscribeToNotifications(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`user-${userId}-notifications`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        }, 
        callback
      )
      .subscribe();
  }
};

// Admin API
export const adminApi = {
  async getAllUsers(filters?: {
    role?: string;
    limit?: number;
    offset?: number;
  }) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', filters?.role || undefined)
      .order('created_at', { ascending: false })
      .range(filters?.offset || 0, (filters?.offset || 0) + (filters?.limit || 20) - 1);
    
    if (error) throw error;
    return data;
  },

  async updateUserProfile(userId: string, updates: Partial<ProfileUpdate> & { role?: string; is_active?: boolean }) {
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
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);
    
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
      issues: data
    };
  },

  async assignIssue(issueId: string, assignedTo: string, priority?: string, dueDate?: string) {
    const { data, error } = await supabase
      .from('issues')
      .update({
        assigned_to: assignedTo,
        priority: priority || 'medium',
        due_date: dueDate
      })
      .eq('id', issueId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getDashboardAnalytics(period: string = '30d', area?: string) {
    // This would typically call a database function for complex analytics
    const { data, error } = await supabase.rpc('get_admin_dashboard_analytics', {
      p_period: period,
      p_area: area
    });
    
    if (error) throw error;
    return data;
  },

  async generateReport(reportType: string, startDate?: string, endDate?: string, format: string = 'json') {
    const { data, error } = await supabase.rpc('generate_admin_report', {
      p_report_type: reportType,
      p_start_date: startDate,
      p_end_date: endDate,
      p_format: format
    });
    
    if (error) throw error;
    return data;
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
      p_dry_run: dryRun
    });
    
    if (error) throw error;
    return data;
  }
};

// Export types for use in components
export type { Issue, IssueInsert, IssueUpdate, Profile, ProfileInsert, ProfileUpdate, Category };
