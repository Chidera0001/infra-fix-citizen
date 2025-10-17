/**
 * EXIF GPS Metadata Extraction Utility
 * Extracts location data from photo EXIF metadata
 */

import exifr from 'exifr';
import { reverseGeocode } from './geocoding';

export interface LocationData {
	latitude: number;
	longitude: number;
	address: string;
}

/**
 * Extract GPS coordinates from image EXIF metadata
 * @param file - Image file to extract GPS from
 * @returns GPS coordinates or null if not available
 */
export async function extractGPSFromImage(file: File): Promise<{ latitude: number; longitude: number } | null> {
	try {
		// Extract GPS data from EXIF metadata
		const gps = await exifr.gps(file);
		
		if (gps && typeof gps.latitude === 'number' && typeof gps.longitude === 'number') {
			// Validate coordinates are within valid ranges
			if (gps.latitude >= -90 && gps.latitude <= 90 && 
				gps.longitude >= -180 && gps.longitude <= 180) {
				return {
					latitude: gps.latitude,
					longitude: gps.longitude
				};
			}
		}
		
		return null;
	} catch (error) {
		console.error('Error extracting GPS from image:', error);
		return null;
	}
}

/**
 * Get complete location data from photo (GPS + reverse geocoded address)
 * @param file - Image file to extract location from
 * @returns Complete location data or null if GPS not available
 */
export async function getLocationFromPhoto(file: File): Promise<LocationData | null> {
	try {
		// Extract GPS coordinates
		const gps = await extractGPSFromImage(file);
		
		if (!gps) {
			return null;
		}
		
		// Reverse geocode to get human-readable address
		const address = await reverseGeocode(gps.latitude, gps.longitude);
		
		return {
			latitude: gps.latitude,
			longitude: gps.longitude,
			address
		};
	} catch (error) {
		console.error('Error getting location from photo:', error);
		return null;
	}
}

/**
 * Check if a file has GPS EXIF data without extracting it
 * Useful for quick validation
 */
export async function hasGPSData(file: File): Promise<boolean> {
	try {
		const gps = await exifr.gps(file);
		return !!(gps && gps.latitude && gps.longitude);
	} catch (error) {
		return false;
	}
}

