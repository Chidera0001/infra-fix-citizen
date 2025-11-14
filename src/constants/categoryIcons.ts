// Category Icon Mapping for lucide-react icons
// Maps issue categories to their corresponding icon component names

import {
  Construction,
  Lightbulb,
  Droplets,
  CircleDot,
  Waves,
  Footprints,
  AlertTriangle,
  CloudRain,
  Mountain,
  ThermometerSun,
  Wind,
  TreePine,
  FlaskConical,
  type LucideIcon,
} from 'lucide-react';

export type CategoryIconMap = {
  [key: string]: LucideIcon;
};

/**
 * Mapping of category IDs to lucide-react icon components
 * Used for displaying category-specific icons in map markers and UI
 */
export const CATEGORY_ICONS: CategoryIconMap = {
  // Current categories
  pothole: Construction,
  street_lighting: Lightbulb,
  water_supply: Droplets,
  traffic_signal: CircleDot,
  drainage: Waves,
  sidewalk: Footprints,
  other: AlertTriangle,
  
  // Climate-focused categories
  flooding: CloudRain,
  erosion: Mountain,
  urban_heat: ThermometerSun,
  storm_damage: Wind,
  green_infrastructure: TreePine,
  water_contamination: FlaskConical,
};

/**
 * Get the icon component for a given category
 * @param category - The category ID
 * @returns The icon component or a default AlertTriangle icon
 */
export const getCategoryIcon = (category: string): LucideIcon => {
  return CATEGORY_ICONS[category] || AlertTriangle;
};

/**
 * Get the icon name (for database storage or API responses)
 * @param category - The category ID
 * @returns The icon name as a string
 */
export const getCategoryIconName = (category: string): string => {
  const iconMap: { [key: string]: string } = {
    pothole: 'construction',
    street_lighting: 'lightbulb',
    water_supply: 'droplets',
    traffic_signal: 'circle-dot',
    drainage: 'waves',
    sidewalk: 'footprints',
    other: 'alert-triangle',
    flooding: 'cloud-rain',
    erosion: 'mountain',
    urban_heat: 'thermometer-sun',
    storm_damage: 'wind',
    green_infrastructure: 'tree-pine',
    water_contamination: 'flask-conical',
  };
  return iconMap[category] || 'alert-triangle';
};

