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

  // Get address from first issue that has one
  const address = issues && issues.length > 0 
    ? issues.find(issue => issue.address)?.address || 'Not specified'
    : 'Not specified';

  // Format issue details for tooltip
  const issueDetails = issues && issues.length > 0 ? issues.slice(0, 2).map(issue => {
    const statusColor = getMarkerColor(issue.status);
    const statusIcon = issue.status === 'resolved' ? '✓' : issue.status === 'in_progress' ? '⟳' : '○';
    return `
      <div style="margin-bottom: 6px; padding: 8px; background: #ffffff; border-radius: 6px; border-left: 3px solid ${statusColor}; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
        <div style="font-weight: 600; font-size: 12px; margin-bottom: 4px; color: #111827; line-height: 1.3; word-wrap: break-word; overflow-wrap: break-word;">${issue.title || 'Untitled Issue'}</div>
        <div style="font-size: 10px; color: #6b7280; margin-bottom: 4px; text-transform: capitalize;">${issue.category?.replace('_', ' ') || 'Unknown'}</div>
        <div style="font-size: 10px;">
          <span style="color: ${statusColor}; font-weight: 600;">${statusIcon} ${issue.status?.replace('_', ' ') || 'Unknown'}</span>
        </div>
      </div>
    `;
  }).join('') : '';

  const moreIssues = issues && issues.length > 2 ? `<div style="font-size: 10px; color: #6b7280; margin-top: 6px; text-align: center; padding: 4px; background: #f3f4f6; border-radius: 4px;">+${issues.length - 2} more issue${issues.length - 2 > 1 ? 's' : ''}</div>` : '';

  // Add tooltip for hover information (admin only)
  marker.bindTooltip(`
    <div style="font-size: 12px; text-align: left; padding: 0; width: 300px; max-width: 300px; background: white; border-radius: 10px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); overflow: hidden;">
      <div style="padding: 14px; background: #f0fdf4; border-bottom: 1px solid #bbf7d0;">
        <h4 style="margin: 0 0 10px 0; font-size: 15px; font-weight: 700; color: #166534; letter-spacing: -0.01em;">Location Details</h4>
        <div style="font-size: 12px; color: #15803d; font-weight: 500; line-height: 1.5; word-wrap: break-word; overflow-wrap: break-word; max-width: 100%; display: block; white-space: normal;">
          <span style="display: inline-block; margin-right: 6px;">📍</span>
          <span style="display: inline; word-break: break-word; overflow-wrap: anywhere;">${address}</span>
        </div>
      </div>
      ${issueDetails ? `
        <div style="padding: 12px; background: #ffffff;">
          ${issueDetails}
          ${moreIssues}
        </div>
      ` : ''}
      <div style="padding: 12px; background: #f9fafb; border-top: 1px solid #e5e7eb;">
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px; font-size: 11px;">
          <div style="font-weight: 600; color: #374151; white-space: nowrap;">Total: <span style="color: #111827;">${totalCount}</span></div>
          <div style="display: flex; gap: 10px; flex-wrap: nowrap;">
            <span style="color: #22c55e; font-weight: 600; white-space: nowrap;">✓ ${resolvedCount}</span>
            <span style="color: #f97316; font-weight: 600; white-space: nowrap;">⟳ ${inProgressCount}</span>
            <span style="color: #ef4444; font-weight: 600; white-space: nowrap;">○ ${openCount}</span>
          </div>
        </div>
      </div>
    </div>
  `, {
    permanent: false,
    direction: 'top',
    offset: [0, -10],
    opacity: 1,
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

