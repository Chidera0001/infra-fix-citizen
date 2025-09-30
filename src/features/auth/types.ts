// Authentication-related types

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
  role: 'citizen' | 'admin' | 'moderator';
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
}

export type UserRole = 'citizen' | 'admin' | 'moderator';
