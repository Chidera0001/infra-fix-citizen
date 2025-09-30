// Map-related types

export interface MapProps {
  address?: string;
  lat?: number;
  lng?: number;
  zoom?: number;
  className?: string;
}

export interface MapFilters {
  status?: string;
  category?: string;
  severity?: string;
  radius?: number;
}

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description?: string;
  type: 'issue' | 'location' | 'user';
  color?: string;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}
