import L from "leaflet";
import type { Issue } from "@/lib/supabase-api";
import { getCategoryIconPath } from "@/utils/iconPaths";

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
  
  return Array.from(grouped.entries()).map(([coordinates, issues]) => {
    // Get the most prominent issue (by severity) to determine category and status
    const mostProminent = issues.reduce((prev, current) => {
      const severityOrder = { 'low': 1, 'medium': 2, 'high': 3, 'critical': 4 };
      const prevSeverity = severityOrder[prev.severity as keyof typeof severityOrder] || 0;
      const currentSeverity = severityOrder[current.severity as keyof typeof severityOrder] || 0;
      return currentSeverity > prevSeverity ? current : prev;
    });
    
    return {
      coordinates,
      lat: parseFloat(coordinates.split(',')[0]),
      lng: parseFloat(coordinates.split(',')[1]),
      issues,
      totalCount: issues.length,
      resolvedCount: issues.filter(i => i.status === 'resolved').length,
      inProgressCount: issues.filter(i => i.status === 'in_progress').length,
      openCount: issues.filter(i => i.status === 'open').length,
      status: mostProminent.status,
      category: mostProminent.category || 'other'
    };
  });
};

// Helper function to create marker icon with category-specific icon image
export const createMarkerIcon = (status: string, totalCount: number, category?: string, showCount: boolean = true) => {
  const categoryIconPath = category ? getCategoryIconPath(category) : '';
  const markerColor = getMarkerColor(status);
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        position: relative;
        width: 40px;
        height: 40px;
        cursor: pointer;
        pointer-events: auto;
      ">
        <!-- Category Icon Image (no background) -->
        <img 
          src="${categoryIconPath || '/Assets/icons/Alert-triangle.svg'}" 
          alt="${category || 'issue'}"
          style="
            width: 40px;
            height: 40px;
            object-fit: contain;
            pointer-events: none;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
          "
          onerror="this.src='/Assets/icons/Alert-triangle.svg'"
        />
        <!-- Issue Count Badge (only for admin or when showCount is true) -->
        ${showCount && totalCount > 1 ? `
          <div style="
            position: absolute;
            top: -6px;
            right: -6px;
            background-color: ${markerColor};
            color: white;
            border: 2px solid white;
            border-radius: 50%;
            min-width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 10px;
            padding: 0 4px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
            pointer-events: none;
            z-index: 10;
          ">
            ${totalCount}
          </div>
        ` : ''}
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });
};

// Helper function to add marker popup and tooltip for admin view
export const addMarkerInteractions = (
  marker: L.Marker, 
  totalCount: number, 
  resolvedCount: number, 
  inProgressCount: number, 
  openCount: number,
  issues?: Issue[],
  isAdmin: boolean = true
) => {
  if (!isAdmin) {
    // Citizens don't see hover details
    return;
  }

  // Format issue details for tooltip
  const issueDetails = issues && issues.length > 0 ? issues.slice(0, 3).map(issue => {
    const statusColor = getMarkerColor(issue.status);
    return `
      <div style="margin-bottom: 6px; padding-bottom: 6px; border-bottom: 1px solid #e5e7eb;">
        <div style="font-weight: bold; font-size: 11px; margin-bottom: 2px;">${issue.title || 'Untitled Issue'}</div>
        <div style="font-size: 10px; color: #666; margin-bottom: 2px;">${issue.category?.replace('_', ' ') || 'Unknown'}</div>
        <div style="font-size: 10px;">
          <span style="color: ${statusColor}; font-weight: bold;">${issue.status?.replace('_', ' ') || 'Unknown'}</span>
        </div>
      </div>
    `;
  }).join('') : '';

  const moreIssues = issues && issues.length > 3 ? `<div style="font-size: 10px; color: #666; margin-top: 4px;">+${issues.length - 3} more issues</div>` : '';

  // Add tooltip for hover information (admin only)
  marker.bindTooltip(`
    <div style="font-size: 12px; text-align: left; padding: 8px; max-width: 200px;">
      <h4 style="margin: 0 0 8px 0; font-size: 13px; font-weight: bold; border-bottom: 2px solid #e5e7eb; padding-bottom: 4px;">Location Details</h4>
      ${issueDetails}
      ${moreIssues}
      <div style="margin-top: 8px; padding-top: 6px; border-top: 1px solid #e5e7eb; font-size: 11px;">
        <div style="margin-bottom: 2px;"><strong>Total:</strong> ${totalCount}</div>
        <div style="margin-bottom: 2px;"><span style="color: #22c55e;">✓ Resolved:</span> ${resolvedCount}</div>
        <div style="margin-bottom: 2px;"><span style="color: #f97316;">⟳ In Progress:</span> ${inProgressCount}</div>
        <div><span style="color: #ef4444;">○ Open:</span> ${openCount}</div>
      </div>
    </div>
  `, {
    permanent: false,
    direction: 'top',
    offset: [0, -10],
    opacity: 0.98,
    className: 'custom-tooltip'
  });

  // Add popup for click events (admin only)
  marker.bindPopup(`
    <div style="padding: 12px; min-width: 250px; max-width: 300px;">
      <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: bold; border-bottom: 2px solid #e5e7eb; padding-bottom: 6px;">Location Statistics</h4>
      <div style="font-size: 12px; margin-bottom: 12px;">
        <div style="margin-bottom: 4px;"><strong>Total Issues:</strong> ${totalCount}</div>
        <div style="margin-bottom: 4px;"><span style="color: #22c55e;">Resolved:</span> ${resolvedCount}</div>
        <div style="margin-bottom: 4px;"><span style="color: #f97316;">In Progress:</span> ${inProgressCount}</div>
        <div><span style="color: #ef4444;">Open:</span> ${openCount}</div>
      </div>
      ${issues && issues.length > 0 ? `
        <div style="border-top: 1px solid #e5e7eb; padding-top: 8px;">
          <div style="font-size: 11px; font-weight: bold; margin-bottom: 6px;">Issues at this location:</div>
          ${issues.slice(0, 5).map(issue => {
            const statusColor = getMarkerColor(issue.status);
            return `
              <div style="margin-bottom: 6px; padding: 6px; background: #f9fafb; border-radius: 4px;">
                <div style="font-weight: bold; font-size: 11px; margin-bottom: 2px;">${issue.title || 'Untitled'}</div>
                <div style="font-size: 10px; color: #666;">${issue.category?.replace('_', ' ') || 'Unknown'} • <span style="color: ${statusColor};">${issue.status?.replace('_', ' ') || 'Unknown'}</span></div>
              </div>
            `;
          }).join('')}
          ${issues.length > 5 ? `<div style="font-size: 10px; color: #666; margin-top: 4px;">+${issues.length - 5} more issues</div>` : ''}
        </div>
      ` : ''}
    </div>
  `, {
    closeButton: true,
    autoClose: false,
    closeOnClick: true,
    autoPan: false,
    keepInView: false
  });
};

