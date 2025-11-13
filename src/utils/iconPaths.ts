// Icon file paths for category icons used in map markers
// These map category IDs to PNG icon files in /public/Assets/icons

export const CATEGORY_ICON_PATHS: Record<string, string> = {
  bad_roads: '/Assets/icons/Bad_road.png',
  broken_streetlights: '/Assets/icons/Broken_Streetlight.png',
  dump_sites: '/Assets/icons/Dump_Sites.png',
  floods: '/Assets/icons/flood.png',
  water_supply_issues: '/Assets/icons/water_supply_issues.png',
  bad_traffic_signals: '/Assets/icons/Bad_Traffic_Signals.png',
  poor_drainages: '/Assets/icons/Poor_drainages.png',
  erosion_sites: '/Assets/icons/Erosion_Sites.png',
  collapsed_bridges: '/Assets/icons/Collapsed_Bridges.png',
  open_manholes: '/Assets/icons/Open_Manholes.png',
  unsafe_crossings: '/Assets/icons/Unsafe_Crossings.png',
  construction_debris: '/Assets/icons/Construction_Debris.png',
  // Fallback icon
  other: '/Assets/icons/Alert-triangle.svg',
};

/**
 * Get icon file path for a category
 * @param category - The category ID
 * @returns Icon file path string or default icon path
 */
export const getCategoryIconPath = (category: string): string => {
  return CATEGORY_ICON_PATHS[category] || CATEGORY_ICON_PATHS.other;
};
