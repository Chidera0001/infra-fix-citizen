// Issue-related types

export type IssueStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type IssueCategory =
  | 'bad_roads'
  | 'broken_streetlights'
  | 'dump_sites'
  | 'floods'
  | 'water_supply_issues'
  | 'bad_traffic_signals'
  | 'poor_drainages'
  | 'erosion_sites'
  | 'collapsed_bridges'
  | 'open_manholes'
  | 'unsafe_crossings'
  | 'construction_debris';
export type IssueSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface IssueFilters {
  status?: IssueStatus;
  category?: IssueCategory;
  severity?: IssueSeverity;
  lat?: number;
  lng?: number;
  radius?: number;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface IssueComment {
  id: string;
  issue_id: string;
  user_id: string;
  comment: string;
  is_official: boolean;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    full_name: string;
    email: string;
  };
}

export interface IssueUpdate {
  id: string;
  issue_id: string;
  user_id: string;
  old_status: IssueStatus | null;
  new_status: IssueStatus;
  comment: string | null;
  created_at: string;
}

export interface IssueStatistics {
  total_issues: number;
  open_issues: number;
  in_progress_issues: number;
  resolved_issues: number;
  closed_issues: number;
  by_category: Record<IssueCategory, { count: number; percentage: number }>;
  by_severity: Record<IssueSeverity, { count: number; percentage: number }>;
  recent_activity: Array<{
    date: string;
    count: number;
  }>;
}
