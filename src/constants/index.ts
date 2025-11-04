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
    value: 'pothole',
    label: 'Pothole',
    icon: 'construction',
    color: '#ef4444',
  },
  {
    value: 'street_lighting',
    label: 'Street Lighting',
    icon: 'lightbulb',
    color: '#f59e0b',
  },
  {
    value: 'water_supply',
    label: 'Water Supply',
    icon: 'droplets',
    color: '#3b82f6',
  },
  {
    value: 'traffic_signal',
    label: 'Traffic Signal',
    icon: 'traffic-light',
    color: '#10b981',
  },
  { value: 'drainage', label: 'Drainage', icon: 'waves', color: '#6366f1' },
  {
    value: 'sidewalk',
    label: 'Sidewalk',
    icon: 'footprints',
    color: '#8b5cf6',
  },
  { value: 'other', label: 'Other', icon: 'alert-triangle', color: '#6b7280' },
  // Climate-focused categories
  { value: 'flooding', label: 'Flooding', icon: 'cloud-rain', color: '#22c55e' },
  { value: 'erosion', label: 'Erosion', icon: 'mountain', color: '#16a34a' },
  { value: 'urban_heat', label: 'Urban Heat', icon: 'thermometer-sun', color: '#15803d' },
  { value: 'storm_damage', label: 'Storm Damage', icon: 'wind', color: '#14532d' },
  { value: 'green_infrastructure', label: 'Green Infrastructure', icon: 'tree-pine', color: '#22c55e' },
  { value: 'water_contamination', label: 'Water Contamination', icon: 'flask-conical', color: '#10b981' },
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
