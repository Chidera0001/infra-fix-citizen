import L from "leaflet";
import type { Issue } from "@/lib/supabase-api";

// Helper function to get marker color based on status
export const getMarkerColor = (status: string): string => {
  switch (status) {
    case 'resolved':
      return "#22c55e"; // Green
    case 'in_progress':
      return "#f97316"; // Orange
    case 'open':
      return "#ef4444"; // Red
    default:
      return "#6b7280"; // Gray
  }
};

// Helper function to group issues by exact coordinates
export const groupIssuesByLocation = (issues: Issue[]) => {
  const grouped = new Map<string, Issue[]>();
  
  // Only use issues that have actual coordinates from the database
  const validIssues = issues.filter(issue => 
    issue.location_lat !== undefined && 
    issue.location_lng !== undefined && 
    !isNaN(issue.location_lat) && 
    !isNaN(issue.location_lng) &&
    issue.location_lat !== null && 
    issue.location_lng !== null
  );
  
  for (const issue of validIssues) {
    const lat = issue.location_lat;
    const lng = issue.location_lng;
    
    const key = `${lat},${lng}`;
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(issue);
  }
  
  return Array.from(grouped.entries()).map(([coordinates, issues]) => ({
    coordinates,
    lat: parseFloat(coordinates.split(',')[0]),
    lng: parseFloat(coordinates.split(',')[1]),
    issues,
    totalCount: issues.length,
    resolvedCount: issues.filter(i => i.status === 'resolved').length,
    inProgressCount: issues.filter(i => i.status === 'in_progress').length,
    openCount: issues.filter(i => i.status === 'open').length,
    status: issues.reduce((prev, current) => {
      const severityOrder = { 'low': 1, 'medium': 2, 'high': 3, 'critical': 4 };
      const prevSeverity = severityOrder[prev.severity as keyof typeof severityOrder] || 0;
      const currentSeverity = severityOrder[current.severity as keyof typeof severityOrder] || 0;
      return currentSeverity > prevSeverity ? current : prev;
    }).status
  }));
};

// Helper function to create marker icon
export const createMarkerIcon = (status: string, totalCount: number) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        position: relative;
        width: 40px;
        height: 50px;
        cursor: pointer;
        pointer-events: auto;
      ">
        <!-- Map Pin Icon -->
        <svg width="40" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
          pointer-events: none;
        ">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" 
                fill="${getMarkerColor(status)}" 
                stroke="white" 
                stroke-width="2"/>
          <circle cx="12" cy="9" r="3" fill="white"/>
        </svg>
        <!-- Issue Count Badge -->
        <div style="
          position: absolute;
          top: 8px;
          left: 50%;
          transform: translateX(-50%);
          background-color: white;
          color: ${getMarkerColor(status)};
          border: 2px solid ${getMarkerColor(status)};
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 10px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.2);
          pointer-events: none;
        ">
          ${totalCount}
        </div>
      </div>
    `,
    iconSize: [40, 50],
    iconAnchor: [20, 50]
  });
};

// Helper function to add marker popup and tooltip
export const addMarkerInteractions = (marker: L.Marker, totalCount: number, resolvedCount: number, inProgressCount: number, openCount: number) => {
  // Add tooltip for hover information
  marker.bindTooltip(`
    <div style="font-size: 12px; text-align: center; padding: 4px;">
      <h4 style="margin: 0 0 6px 0; font-size: 13px; font-weight: bold;">Location Statistics</h4>
      <div style="font-size: 11px;">
        <div style="margin-bottom: 3px;"><strong>Total Issues:</strong> ${totalCount}</div>
        <div style="margin-bottom: 3px;"><span style="color: #22c55e;">Resolved:</span> ${resolvedCount}</div>
        <div style="margin-bottom: 3px;"><span style="color: #f97316;">In Progress:</span> ${inProgressCount}</div>
        <div><span style="color: #ef4444;">Open:</span> ${openCount}</div>
      </div>
    </div>
  `, {
    permanent: false,
    direction: 'top',
    offset: [0, -10],
    opacity: 0.95,
    className: 'custom-tooltip'
  });

  // Add popup for click events
  marker.bindPopup(`
    <div style="padding: 8px; min-width: 150px;">
      <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">Location Statistics</h4>
      <div style="font-size: 12px;">
        <div style="margin-bottom: 4px;"><strong>Total Issues:</strong> ${totalCount}</div>
        <div style="margin-bottom: 4px;"><span style="color: #22c55e;">Resolved:</span> ${resolvedCount}</div>
        <div style="margin-bottom: 4px;"><span style="color: #f97316;">In Progress:</span> ${inProgressCount}</div>
        <div><span style="color: #ef4444;">Open:</span> ${openCount}</div>
      </div>
      <div style="margin-top: 8px; font-size: 10px; color: #666; text-align: center;">
        Click to close
      </div>
    </div>
  `, {
    closeButton: true,
    autoClose: false,
    closeOnClick: true,
    autoPan: false,
    keepInView: false
  });
};

