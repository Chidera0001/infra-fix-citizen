// Global type definitions

// Re-export feature types
export type * from '@/features/auth/types';
export type * from '@/features/issues/types';
export type * from '@/features/maps/types';

// Common types
export interface ApiResponse<T> {
  data: T;
  error?: string;
  success: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
  total?: number;
}

export interface SortParams {
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
}

export interface FilterParams {
  [key: string]: any;
}

// UI Component types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

// Location types
export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Address {
  street?: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
}
