import type { PendingReport } from '@/types/offline';

export type SyncResult = {
  success: boolean;
  error?: string;
  reportId: string;
};
import { blobsToFiles } from './fileHelpers';
import { verifyOfflineReport } from './offlineReportVerification';
import { geocodeAddressToLocation } from './geocoding';
import { issuesApi } from '@/lib/supabase-api';
import { offlineStorage } from './offlineStorage.client';

// Map offline form categories to database enum values
const categoryMapping: Record<string, string> = {
  // New category set
  bad_roads: 'bad_roads',
  broken_streetlights: 'broken_streetlights',
  dump_sites: 'dump_sites',
  floods: 'floods',
  water_supply_issues: 'water_supply_issues',
  bad_traffic_signals: 'bad_traffic_signals',
  poor_drainages: 'poor_drainages',
  erosion_sites: 'erosion_sites',
  collapsed_bridges: 'collapsed_bridges',
  open_manholes: 'open_manholes',
  unsafe_crossings: 'unsafe_crossings',
  construction_debris: 'construction_debris',

  // Legacy web/offline category values
  pothole: 'bad_roads',
  'road-damage': 'bad_roads',
  streetlight: 'broken_streetlights',
  street_lighting: 'broken_streetlights',
  'water-supply': 'water_supply_issues',
  water_supply: 'water_supply_issues',
  traffic_signal: 'bad_traffic_signals',
  'traffic-light': 'bad_traffic_signals',
  drainage: 'poor_drainages',
  drainage_systems: 'poor_drainages',
  sidewalk: 'unsafe_crossings',
  road_infrastructure: 'bad_roads',
  water_systems: 'water_supply_issues',
  traffic_management: 'bad_traffic_signals',
  public_facilities: 'construction_debris',
  other: 'construction_debris',
};

function mapCategoryToDatabase(category: string): string {
  return categoryMapping[category] || 'construction_debris';
}

function validateIssueData(issueData: any): {
  isValid: boolean;
  error?: string;
} {
  if (
    !issueData.title ||
    issueData.title.length < 10 ||
    issueData.title.length > 100
  ) {
    return {
      isValid: false,
      error: `Title must be between 10 and 100 characters (current: ${issueData.title?.length || 0})`,
    };
  }

  if (
    !issueData.description ||
    issueData.description.length < 20 ||
    issueData.description.length > 1000
  ) {
    return {
      isValid: false,
      error: `Description must be between 20 and 1000 characters (current: ${issueData.description?.length || 0})`,
    };
  }

  return { isValid: true };
}

/**
 * Prepare report data for syncing: convert photos, map category, validate
 */
export async function prepareReportForSync(
  report: PendingReport
): Promise<{
  photos: File[];
  mappedIssueData: any;
  validation: { isValid: boolean; error?: string };
}> {
  const photos = blobsToFiles(
    report.photos as Blob[],
    report.photoNames || []
  );

  const mappedIssueData = {
    ...report.issueData,
    category: mapCategoryToDatabase(report.issueData.category),
  };

  const validation = validateIssueData(mappedIssueData);

  return { photos, mappedIssueData, validation };
}

/**
 * Verify offline report with AI before syncing
 */
export async function verifyReportForSync(
  photo: File,
  category: string,
  description: string
): Promise<{ success: boolean; errorMessage?: string }> {
  const verification = await verifyOfflineReport(photo, category, description);
  
  return {
    success: verification.success,
    errorMessage: verification.errorMessage,
  };
}

/**
 * Geocode address and update issue data coordinates
 */
export async function geocodeIssueData(
  issueData: any
): Promise<void> {
  if (issueData.address && issueData.address.trim()) {
    try {
      const geocodedLocation = await geocodeAddressToLocation(
        issueData.address.trim()
      );
      if (geocodedLocation) {
        issueData.location_lat = geocodedLocation.latitude;
        issueData.location_lng = geocodedLocation.longitude;
      }
    } catch (error) {
      // Silent failure - use existing coordinates
    }
  }
}

/**
 * Create issue and handle user linking
 */
export async function createIssueForSync(
  issueData: any,
  report: PendingReport,
  photos: File[],
  userId?: string
): Promise<void> {
  if (report.userId === 'offline-user') {
    if (userId) {
      await offlineStorage.updatePendingReport(report.id, {
        ...report,
        userId: userId,
      });
      await issuesApi.createIssue(issueData, userId, photos);
    } else {
      throw new Error(
        'Offline report needs to be linked to a user before syncing'
      );
    }
  } else {
    await issuesApi.createIssue(issueData, report.userId, photos);
  }
}

/**
 * Handle sync error and update report status
 */
export function createSyncErrorResult(
  reportId: string | number,
  error: unknown
): SyncResult {
  const errorMessage =
    error instanceof Error ? error.message : 'Unknown sync error';
  
  return {
    success: false,
    error: errorMessage,
    reportId: String(reportId),
  };
}

