import type { PendingReport, SyncResult } from '@/utils/offlineStorage';
import { blobsToFiles } from './dexieDb';
import { verifyOfflineReport } from './offlineReportVerification';
import { geocodeAddressToLocation } from './geocoding';
import { issuesApi } from '@/lib/supabase-api';
import { offlineStorage } from './offlineStorage';

// Map offline form categories to database enum values
const categoryMapping: Record<string, string> = {
  pothole: 'pothole',
  streetlight: 'street_lighting',
  'water-supply': 'water_supply',
  'traffic-light': 'traffic_signal',
  drainage: 'drainage',
  'road-damage': 'sidewalk',
  other: 'other',
};

function mapCategoryToDatabase(category: string): string {
  return categoryMapping[category] || 'other';
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

