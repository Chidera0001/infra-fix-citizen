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
		// Try different exifr options for better mobile compatibility
		// Include more EXIF data to increase chances of finding GPS
		const options = {
			gps: true,
			exif: false,
			ifd0: false,
			translateKeys: false,
			reviveValues: true,
			sanitize: true,
			mergeOutput: false,
		};

		// First try with specific GPS extraction
		let gps = await exifr.gps(file, options);
		
		// If that fails, try parsing all EXIF data
		if (!gps || (!gps.latitude && !gps.longitude)) {
			const allExif = await exifr.parse(file, {
				gps: true,
				translateKeys: false,
			});
			
			if (allExif?.latitude && allExif?.longitude) {
				gps = {
					latitude: allExif.latitude,
					longitude: allExif.longitude,
				};
			} else if (allExif?.GPS) {
				// Try accessing GPS data from different structures
				const gpsData = allExif.GPS;
				if (gpsData.GPSLatitude && gpsData.GPSLongitude) {
					const latRef = gpsData.GPSLatitudeRef || 'N';
					const lonRef = gpsData.GPSLongitudeRef || 'E';
					
					let lat = Array.isArray(gpsData.GPSLatitude) 
						? gpsData.GPSLatitude[0] + gpsData.GPSLatitude[1]/60 + (gpsData.GPSLatitude[2] || 0)/3600
						: gpsData.GPSLatitude;
					let lon = Array.isArray(gpsData.GPSLongitude)
						? gpsData.GPSLongitude[0] + gpsData.GPSLongitude[1]/60 + (gpsData.GPSLongitude[2] || 0)/3600
						: gpsData.GPSLongitude;
					
					if (latRef === 'S') lat = -lat;
					if (lonRef === 'W') lon = -lon;
					
					gps = { latitude: lat, longitude: lon };
				}
			}
		}
		
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
		console.error('Error extracting GPS from image:', error, {
			fileName: file.name,
			fileSize: file.size,
			fileType: file.type
		});
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
		console.error('Error getting location from photo:', error, {
			fileName: file.name,
			fileSize: file.size,
			fileType: file.type
		});
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

