// SVG Path data for lucide-react icons used in map markers
// These are extracted from lucide-react icon definitions for use in Leaflet markers

// SVG Path data extracted from lucide-react icons (viewBox: 0 0 24 24)
// These are the actual path elements from lucide-react icon components
export const CATEGORY_ICON_PATHS: Record<string, string> = {
  // Current categories
  pothole:
    'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
  street_lighting:
    'M15 14.5c.83-1 1.5-2.34 1.5-4A6.5 6.5 0 0 0 6 10c0 1.66.67 3 1.5 4M9 14h6M12 4v1m0 13v-1',
  water_supply: 'M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z',
  traffic_signal:
    'M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2 2v2a2 2 0 0 1 2 2 2 2 0 0 1 2 2v2a2 2 0 0 1-2 2',
  drainage: 'M2 12h20M2 12c0-3 3-9 10-9s10 6 10 9M2 12c0 3 3 9 10 9s10-6 10-9',
  sidewalk:
    'M16 4h2M12 4h2M8 4h2M12 20v-4M8 12v-2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M8 20v-8M16 20v-8',
  other: 'M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',

  // Climate-focused categories
  flooding:
    'M17 14a3 3 0 0 0-3 3h4a3 3 0 0 0 0-6zM2 19a2 2 0 1 0 4 0 2 2 0 1 0-4 0zm14-7a2 2 0 1 0-4 0 2 2 0 0 0 4 0zm-8 4a2 2 0 1 0-4 0 2 2 0 0 0 4 0z',
  erosion: 'M8 3l4 8 5-5 5 15H2L8 3z',
  urban_heat: 'M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z',
  storm_damage:
    'M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3M2 2l20 20M22 2l-3 3M3 3l18 18M14.8 9.8a3 3 0 1 0-4-4M2 22l7-7M17 2l2 2M2 17l2-2M22 17l-2-2M10 2l2 2M2 10l2-2',
  green_infrastructure:
    'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z',
  water_contamination:
    'M9 2v7.5a2.5 2.5 0 1 0 5 0V2M5.5 9.5L3 12l2.5 2.5M18.5 9.5L21 12l-2.5 2.5M12 12h7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h7',
};

/**
 * Get SVG path data for a category icon
 * @param category - The category ID
 * @returns SVG path string or default icon path
 */
export const getCategoryIconPath = (category: string): string => {
  return CATEGORY_ICON_PATHS[category] || CATEGORY_ICON_PATHS.other;
};
