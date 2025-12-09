/**
 * Reverse geocoding utility using Geoapify API
 * Converts coordinates to human-readable addresses
 */

// Geoapify API configuration
const GEOAPIFY_API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY || '';
const GEOAPIFY_BASE_URL = 'https://api.geoapify.com/v1/geocode/reverse';

// Validate API key on module load (only in production)
if (process.env.NODE_ENV === 'production' && !GEOAPIFY_API_KEY) {
  // API key validation - geocoding will fallback to coordinates if missing
}

// Global flag to prevent multiple simultaneous location requests
let isLocationRequestInProgress = false;

/**
 * Convert coordinates to human-readable address using Geoapify API
 */
export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<string> => {
  // Check if API key is missing
  if (!GEOAPIFY_API_KEY) {
    return `Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  }

  try {
    const response = await fetch(
      `${GEOAPIFY_BASE_URL}?lat=${latitude}&lon=${longitude}&apiKey=${GEOAPIFY_API_KEY}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Geoapify API error: ${response.status}`);
    }

    const data = await response.json();

    // Check if we have features and at least one result
    if (data.features && data.features.length > 0) {
      const firstFeature = data.features[0];

      // Use the formatted address from Geoapify
      if (firstFeature.properties?.formatted) {
        return firstFeature.properties.formatted;
      }
    }

    // Fallback to coordinates if no formatted address found
    return `Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  } catch (error) {
    // Fallback to coordinates on error
    return `Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  }
};

/**
 * Get current location with high accuracy
 */
export const getCurrentLocation = (): Promise<GeolocationCoordinates> => {
  return new Promise(async (resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    // Prevent multiple simultaneous requests
    if (isLocationRequestInProgress) {
      reject(new Error('Location request already in progress'));
      return;
    }

    isLocationRequestInProgress = true;
    let hasResolved = false;
    let watchId: number | null = null;

    const cleanup = () => {
      isLocationRequestInProgress = false;
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };

    // Try using watchPosition as a fallback - it's more reliable in some browsers
    const useWatchPosition = () => {
      watchId = navigator.geolocation.watchPosition(
        position => {
          if (!hasResolved) {
            hasResolved = true;
            cleanup();
            resolve(position.coords);
          }
        },
        error => {
          if (!hasResolved) {
            hasResolved = true;
            cleanup();
            reject(error);
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0,
        }
      );
    };

    // First try getCurrentPosition
    navigator.geolocation.getCurrentPosition(
      position => {
        if (!hasResolved) {
          hasResolved = true;
          cleanup();
          resolve(position.coords);
        }
      },
      error => {
        // If getCurrentPosition fails, try watchPosition as fallback
        if (!hasResolved) {
          useWatchPosition();
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );

    // Fallback timeout
    setTimeout(() => {
      if (!hasResolved) {
        hasResolved = true;
        cleanup();
        reject(new Error('Location request timed out'));
      }
    }, 25000);
  });
};

/**
 * Get location with address in one call
 */
export const getCurrentLocationWithAddress = async (): Promise<{
  coordinates: GeolocationCoordinates;
  address: string;
}> => {
  const coordinates = await getCurrentLocation();

  // Try to get address using Geoapify, but don't fail if geocoding doesn't work
  let address = `Location: ${coordinates.latitude.toFixed(4)}, ${coordinates.longitude.toFixed(4)}`;
  try {
    const geocodedAddress = await reverseGeocode(
      coordinates.latitude,
      coordinates.longitude
    );
    address = geocodedAddress;
  } catch (geocodingError) {
    // Silent fallback to coordinates
  }

  return {
    coordinates,
    address,
  };
};

// Helper function to geocode text location to coordinates (for offline users)
export const geocodeLocation = async (
  locationText: string
): Promise<{ lat: number; lng: number } | null> => {
  // Check if API key is missing
  if (!GEOAPIFY_API_KEY) {
    return null;
  }

  try {
    // Use Geoapify for forward geocoding as well
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(locationText)}&apiKey=${GEOAPIFY_API_KEY}&limit=1`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Geoapify forward geocoding API error: ${response.status}`
      );
    }

    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const firstFeature = data.features[0];
      const coordinates = firstFeature.geometry.coordinates;

      return {
        lat: coordinates[1], // Geoapify returns [lon, lat]
        lng: coordinates[0],
      };
    }

    return null;
  } catch (error) {
    return null;
  }
};

// Enhanced function to geocode address and get full location data
export const geocodeAddressToLocation = async (
  addressText: string
): Promise<{
  latitude: number;
  longitude: number;
  address: string;
  confidence?: number;
} | null> => {
  // Check if API key is missing
  if (!GEOAPIFY_API_KEY) {
    return null;
  }

  try {
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressText)}&apiKey=${GEOAPIFY_API_KEY}&limit=1`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Geoapify enhanced geocoding API error: ${response.status}`
      );
    }

    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const firstFeature = data.features[0];
      const coordinates = firstFeature.geometry.coordinates;
      const properties = firstFeature.properties;

      const result = {
        latitude: coordinates[1], // Geoapify returns [lon, lat]
        longitude: coordinates[0],
        address: properties?.formatted || addressText,
        confidence: properties?.rank?.confidence || 0,
      };

      return result;
    }

    return null;
  } catch (error) {
    return null;
  }
};
