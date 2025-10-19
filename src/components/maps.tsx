
"use client";

import L from "leaflet";

// Map configuration for consistency across components
export const MAP_CONFIG = {
  defaultCenter: [6.5244, 3.3792] as [number, number], // Lagos, Nigeria [lat, lng]
  defaultZoom: 12,
  tileLayerUrl: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  tileLayerOptions: {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }
};

// Export Leaflet for other components to use
export { L };
