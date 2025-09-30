export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          clerk_user_id: string
          email: string
          full_name: string | null
          phone_number: string | null
          role: 'citizen' | 'admin' | 'moderator'
          location_lat: number | null
          location_lng: number | null
          address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          clerk_user_id: string
          email: string
          full_name?: string | null
          phone_number?: string | null
          role?: 'citizen' | 'admin' | 'moderator'
          location_lat?: number | null
          location_lng?: number | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          clerk_user_id?: string
          email?: string
          full_name?: string | null
          phone_number?: string | null
          role?: 'citizen' | 'admin' | 'moderator'
          location_lat?: number | null
          location_lng?: number | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon?: string | null
          color?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
          color?: string
          created_at?: string
        }
      }
      issues: {
        Row: {
          id: string
          title: string
          description: string
          category: 'pothole' | 'street_lighting' | 'water_supply' | 'traffic_signal' | 'drainage' | 'sidewalk' | 'other'
          status: 'open' | 'in_progress' | 'resolved' | 'closed'
          severity: 'low' | 'medium' | 'high' | 'critical'
          location_lat: number
          location_lng: number
          address: string | null
          image_urls: string[]
          reporter_id: string | null
          assigned_to: string | null
          upvotes: number
          created_at: string
          updated_at: string
          resolved_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description: string
          category: 'pothole' | 'street_lighting' | 'water_supply' | 'traffic_signal' | 'drainage' | 'sidewalk' | 'other'
          status?: 'open' | 'in_progress' | 'resolved' | 'closed'
          severity?: 'low' | 'medium' | 'high' | 'critical'
          location_lat: number
          location_lng: number
          address?: string | null
          image_urls?: string[]
          reporter_id?: string | null
          assigned_to?: string | null
          upvotes?: number
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category?: 'pothole' | 'street_lighting' | 'water_supply' | 'traffic_signal' | 'drainage' | 'sidewalk' | 'other'
          status?: 'open' | 'in_progress' | 'resolved' | 'closed'
          severity?: 'low' | 'medium' | 'high' | 'critical'
          location_lat?: number
          location_lng?: number
          address?: string | null
          image_urls?: string[]
          reporter_id?: string | null
          assigned_to?: string | null
          upvotes?: number
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
        }
      }
      issue_updates: {
        Row: {
          id: string
          issue_id: string
          user_id: string | null
          old_status: 'open' | 'in_progress' | 'resolved' | 'closed' | null
          new_status: 'open' | 'in_progress' | 'resolved' | 'closed'
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          issue_id: string
          user_id?: string | null
          old_status?: 'open' | 'in_progress' | 'resolved' | 'closed' | null
          new_status: 'open' | 'in_progress' | 'resolved' | 'closed'
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          issue_id?: string
          user_id?: string | null
          old_status?: 'open' | 'in_progress' | 'resolved' | 'closed' | null
          new_status?: 'open' | 'in_progress' | 'resolved' | 'closed'
          comment?: string | null
          created_at?: string
        }
      }
      issue_upvotes: {
        Row: {
          id: string
          issue_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          issue_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          issue_id?: string
          user_id?: string
          created_at?: string
        }
      }
      issue_comments: {
        Row: {
          id: string
          issue_id: string
          user_id: string | null
          comment: string
          is_official: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          issue_id: string
          user_id?: string | null
          comment: string
          is_official?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          issue_id?: string
          user_id?: string | null
          comment?: string
          is_official?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          issue_id: string
          title: string
          message: string
          type: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          issue_id: string
          title: string
          message: string
          type: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          issue_id?: string
          title?: string
          message?: string
          type?: string
          read?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_issues_with_filters: {
        Args: {
          p_status?: 'open' | 'in_progress' | 'resolved' | 'closed'
          p_category?: 'pothole' | 'street_lighting' | 'water_supply' | 'traffic_signal' | 'drainage' | 'sidewalk' | 'other'
          p_severity?: 'low' | 'medium' | 'high' | 'critical'
          p_lat?: number
          p_lng?: number
          p_radius_km?: number
          p_limit?: number
          p_offset?: number
          p_sort_by?: string
          p_sort_order?: string
        }
        Returns: {
          id: string
          title: string
          description: string
          category: 'pothole' | 'street_lighting' | 'water_supply' | 'traffic_signal' | 'drainage' | 'sidewalk' | 'other'
          status: 'open' | 'in_progress' | 'resolved' | 'closed'
          severity: 'low' | 'medium' | 'high' | 'critical'
          location_lat: number
          location_lng: number
          address: string | null
          image_urls: string[]
          upvotes: number
          created_at: string
          updated_at: string
          resolved_at: string | null
          reporter_name: string | null
          reporter_email: string | null
          distance_km: number | null
        }[]
      }
      get_issue_statistics: {
        Args: {
          p_lat?: number
          p_lng?: number
          p_radius_km?: number
        }
        Returns: Json
      }
      toggle_issue_upvote: {
        Args: {
          p_issue_id: string
        }
        Returns: Json
      }
    }
    Enums: {
      issue_status: 'open' | 'in_progress' | 'resolved' | 'closed'
      issue_category: 'pothole' | 'street_lighting' | 'water_supply' | 'traffic_signal' | 'drainage' | 'sidewalk' | 'other'
      issue_severity: 'low' | 'medium' | 'high' | 'critical'
      user_role: 'citizen' | 'admin' | 'moderator'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
