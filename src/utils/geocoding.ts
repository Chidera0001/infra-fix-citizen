/**
 * Reverse geocoding utility using OpenStreetMap Nominatim
 * Converts coordinates to human-readable addresses
 */

// Global flag to prevent multiple simultaneous location requests
let isLocationRequestInProgress = false;

/**
 * Convert coordinates to human-readable address using OpenStreetMap
 */
export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<string> => {
  // Try multiple geocoding services in order of preference
  const services = [
    // Service 1: OpenStreetMap with CORS proxy
    async () => {
      try {
        const proxyUrl = 'https://api.allorigins.win/raw?url=';
        const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&extratags=1&namedetails=1&accept-language=en`;
        
        const response = await fetch(proxyUrl + encodeURIComponent(nominatimUrl), {
          headers: {
            'User-Agent': 'Citizn-App/1.0'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.display_name) {
            // Check for street-level detail
            const streetName = data.name || data.address?.road || data.namedetails?.name;
            
            if (streetName) {
              return data.display_name;
            }
            
            // Build address from components if no street detail
            const addr = data.address;
            let detailedAddress = '';
            
            if (addr.house_number) detailedAddress += addr.house_number + ' ';
            if (addr.road) detailedAddress += addr.road + ', ';
            if (addr.suburb) detailedAddress += addr.suburb + ', ';
            if (addr.city_district) detailedAddress += addr.city_district + ', ';
            if (addr.city) detailedAddress += addr.city;
            
            if (detailedAddress.trim()) {
              return detailedAddress.trim().replace(/,\s*$/, '');
            }
            
            // Try Rwanda-specific field names
            let rwandaAddress = '';
            if (addr.village) rwandaAddress += addr.village + ', ';
            if (addr.county) rwandaAddress += addr.county + ', ';
            if (addr.state) rwandaAddress += addr.state;
            
            if (rwandaAddress.trim()) {
              return rwandaAddress.trim().replace(/,\s*$/, '');
            }
            
            // Final fallback - use display_name
            return data.display_name;
          }
        }
      } catch (error) {
        throw new Error('OpenStreetMap failed');
      }
    },
    
    // Service 2: BigDataCloud (free tier)
    async () => {
      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.localityInfo && data.localityInfo.administrative) {
            const admin = data.localityInfo.administrative;
            let address = '';
            
            if (data.locality) address += data.locality + ', ';
            if (admin[0]?.name) address += admin[0].name + ', ';
            if (admin[1]?.name) address += admin[1].name + ', ';
            if (admin[2]?.name) address += admin[2].name;
            
            return address.trim().replace(/,\s*$/, '');
          }
        }
      } catch (error) {
        throw new Error('BigDataCloud failed');
      }
    },
    
    // Service 3: Free IPGeolocation API
    async () => {
      try {
        const response = await fetch(
          `https://api.ipgeolocation.io/reverse-geocoding?lat=${latitude}&lon=${longitude}&apiKey=free`
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.address) {
            const addr = data.address;
            let address = '';
            
            if (addr.street_number) address += addr.street_number + ' ';
            if (addr.street) address += addr.street + ', ';
            if (addr.city) address += addr.city + ', ';
            if (addr.state) address += addr.state + ', ';
            if (addr.country) address += addr.country;
            
            return address.trim().replace(/,\s*$/, '');
          }
        }
      } catch (error) {
        throw new Error('IPGeolocation failed');
      }
    }
  ];

  // Try each service in order
  for (const service of services) {
    try {
      const result = await service();
      if (result && result.trim()) {
        return result;
      }
    } catch (error) {
      // Continue to next service
      continue;
    }
  }

  // Final fallback to formatted coordinates
  return `Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
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
        (position) => {
          if (!hasResolved) {
            hasResolved = true;
            cleanup();
            resolve(position.coords);
          }
        },
        (error) => {
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
      (position) => {
        if (!hasResolved) {
          hasResolved = true;
          cleanup();
          resolve(position.coords);
        }
      },
      (error) => {
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
  
  // Try to get address, but don't fail if geocoding doesn't work
  let address = `Location: ${coordinates.latitude.toFixed(4)}, ${coordinates.longitude.toFixed(4)}`;
  try {
    const geocodedAddress = await reverseGeocode(coordinates.latitude, coordinates.longitude);
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
export const geocodeLocation = async (locationText: string): Promise<{lat: number, lng: number} | null> => {
  try {
    // Use OpenStreetMap Nominatim for geocoding
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationText)}&limit=1&addressdetails=1&countrycodes=ng`,
      {
        headers: {
          'User-Agent': 'Citizn-App/1.0'
        }
      }
    );

    if (response.ok) {
      const data = await response.json();

      if (data && data.length > 0) {
        const result = {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
        return result;
      }
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};