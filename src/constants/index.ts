// Application constants

export const APP_CONFIG = {
  name: 'Infrastructure Fix Citizen',
  version: '1.0.0',
  description: 'Report and track infrastructure issues in Nigeria',
  author: 'Your Team Name',
  repository: 'https://github.com/your-username/infra-fix-citizen',
} as const;

export const API_ENDPOINTS = {
  issues: '/api/issues',
  profiles: '/api/profiles',
  categories: '/api/categories',
  comments: '/api/comments',
  notifications: '/api/notifications',
} as const;

export const ROUTES = {
  home: '/',
  auth: '/auth',
  citizen: '/citizen',
  adminLogin: '/admin-login',
  admin: '/admin-citizn',
  apiDocs: '/api-docs',
  notFound: '*',
} as const;

export const ISSUE_CATEGORIES = [
  {
    value: 'bad_roads',
    label: 'Bad Roads',
    icon: 'construction',
    color: '#ef4444',
  },
  {
    value: 'broken_streetlights',
    label: 'Broken Streetlights',
    icon: 'lightbulb',
    color: '#f59e0b',
  },
  {
    value: 'dump_sites',
    label: 'Dump Sites',
    icon: 'trash-2',
    color: '#22c55e',
  },
  {
    value: 'floods',
    label: 'Floods',
    icon: 'waves',
    color: '#0ea5e9',
  },
  {
    value: 'water_supply_issues',
    label: 'Water Supply Issues',
    icon: 'droplets',
    color: '#3b82f6',
  },
  {
    value: 'bad_traffic_signals',
    label: 'Bad Traffic Signals',
    icon: 'traffic-cone',
    color: '#f97316',
  },
  {
    value: 'poor_drainages',
    label: 'Poor Drainages',
    icon: 'waves',
    color: '#6366f1',
  },
  {
    value: 'erosion_sites',
    label: 'Erosion Sites',
    icon: 'mountain',
    color: '#7c3aed',
  },
  {
    value: 'collapsed_bridges',
    label: 'Collapsed Bridges',
    icon: 'bridge',
    color: '#f59e0b',
  },
  {
    value: 'open_manholes',
    label: 'Open Manholes',
    icon: 'circle-dot',
    color: '#a855f7',
  },
  {
    value: 'unsafe_crossings',
    label: 'Unsafe Crossings',
    icon: 'footprints',
    color: '#14b8a6',
  },
  {
    value: 'construction_debris',
    label: 'Construction Debris',
    icon: 'dump-truck',
    color: '#64748b',
  },
] as const;

export const ISSUE_STATUSES = [
  { value: 'open', label: 'Open', color: '#ef4444' },
  { value: 'in_progress', label: 'In Progress', color: '#f59e0b' },
  { value: 'resolved', label: 'Resolved', color: '#10b981' },
  { value: 'closed', label: 'Closed', color: '#6b7280' },
] as const;

export const ISSUE_SEVERITIES = [
  { value: 'low', label: 'Low', color: '#10b981' },
  { value: 'medium', label: 'Medium', color: '#f59e0b' },
  { value: 'high', label: 'High', color: '#ef4444' },
  { value: 'critical', label: 'Critical', color: '#dc2626' },
] as const;

export const USER_ROLES = [
  { value: 'citizen', label: 'Citizen' },
  { value: 'admin', label: 'Administrator' },
  { value: 'moderator', label: 'Moderator' },
] as const;

export const PAGINATION = {
  defaultLimit: 20,
  maxLimit: 100,
  defaultPage: 1,
} as const;

export const MAP_CONFIG = {
  defaultZoom: 12,
  maxZoom: 18,
  minZoom: 8,
  defaultRadius: 10, // km
  maxRadius: 50, // km
} as const;

export const VALIDATION = {
  minTitleLength: 10,
  maxTitleLength: 100,
  minDescriptionLength: 20,
  maxDescriptionLength: 1000,
  maxImageSize: 4 * 1024 * 1024, // 4MB per image - increased from 2MB
  maxImagesPerReport: 5, // Maximum 5 images per report
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
} as const;

export const STORAGE = {
  keys: {
    authToken: 'auth_token',
    userProfile: 'user_profile',
    preferences: 'user_preferences',
    theme: 'app_theme',
  },
} as const;

export const THEMES = {
  light: 'light',
  dark: 'dark',
  system: 'system',
} as const;
