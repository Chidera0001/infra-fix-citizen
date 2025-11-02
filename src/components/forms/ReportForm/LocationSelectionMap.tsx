import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { reverseGeocode } from '@/utils/geocoding';
import { L, MAP_CONFIG } from '@/components/maps/maps';

interface LocationSelectionMapProps {
  onLocationSelected: (
    coordinates: { lat: number; lng: number },
    address: string
  ) => void;
  initialLocation?: { lat: number; lng: number };
}

const LocationSelectionMap = ({
  onLocationSelected,
  initialLocation = { lat: 6.5244, lng: 3.3792 }, // Default Lagos coordinates
}: LocationSelectionMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [isGettingAddress, setIsGettingAddress] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Set initial location if provided
    if (initialLocation) {
      setSelectedLocation(initialLocation);
    }
  }, [initialLocation]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView(
      MAP_CONFIG.defaultCenter,
      MAP_CONFIG.defaultZoom
    );

    // Add tile layer
    L.tileLayer(MAP_CONFIG.tileLayerUrl, MAP_CONFIG.tileLayerOptions).addTo(
      map
    );

    mapInstance.current = map;

    // Add click listener for location selection
    map.on('click', async (e: L.LeafletMouseEvent) => {
      const coordinates = {
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      };

      setSelectedLocation(coordinates);
      setIsGettingAddress(true);

      // Remove existing marker
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
      }

      // Add new marker
      const selectedIcon = L.divIcon({
        className: 'selected-marker',
        html: `
					<div style="
						background-color: #3b82f6;
						width: 20px;
						height: 20px;
						border-radius: 50%;
						border: 3px solid white;
						box-shadow: 0 2px 4px rgba(0,0,0,0.3);
					"></div>
				`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      markerRef.current = L.marker([coordinates.lat, coordinates.lng], {
        icon: selectedIcon,
      }).addTo(map);

      try {
        const address = await reverseGeocode(coordinates.lat, coordinates.lng);
        setSelectedAddress(address);

        toast({
          title: 'Location selected',
          description: `Found: ${address}`,
        });
      } catch (error) {
        setSelectedAddress(
          `${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}`
        );
        toast({
          title: 'Location selected',
          description: 'Address lookup failed, using coordinates',
          variant: 'destructive',
        });
      } finally {
        setIsGettingAddress(false);
      }
    });

    // Cleanup function
    return () => {
      if (mapInstance.current) {
        if (markerRef.current) {
          mapInstance.current.removeLayer(markerRef.current);
        }
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      onLocationSelected(selectedLocation, selectedAddress);
    }
  };

  return (
    <div className='flex h-screen w-full flex-col bg-gray-50'>
      {/* Header */}
      <header className='flex-shrink-0 border-b bg-white shadow-sm'>
        <div className='px-4 py-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-xl font-semibold text-gray-900'>
                Select Location on Map
              </h1>
              <p className='text-sm text-gray-600'>
                Click anywhere on the map to select the issue location
              </p>
            </div>

            {selectedLocation && (
              <Button
                onClick={handleConfirmLocation}
                className='bg-green-600 text-white hover:bg-green-700'
              >
                <Check className='mr-2 h-4 w-4' />
                Confirm Location
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Map Container */}
      <div className='relative w-full flex-1'>
        <div
          ref={mapRef}
          className='h-full w-full'
          style={{
            width: '100%',
            height: '100%',
            minHeight: '400px',
          }}
        />

        {/* Location Info Overlay */}
        {selectedLocation && (
          <div className='absolute left-4 top-4 z-10 max-w-sm rounded-lg bg-white p-4 shadow-lg'>
            <div className='flex items-start space-x-3'>
              <div className='flex-shrink-0'>
                <MapPin className='h-5 w-5 text-green-600' />
              </div>
              <div className='min-w-0 flex-1'>
                <h3 className='text-sm font-medium text-gray-900'>
                  Selected Location
                </h3>
                <p className='mt-1 text-sm text-gray-600'>
                  {isGettingAddress ? (
                    <span className='text-blue-600'>Getting address...</span>
                  ) : (
                    selectedAddress ||
                    `${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`
                  )}
                </p>
                <p className='mt-1 text-xs text-gray-500'>
                  Lat: {selectedLocation.lat.toFixed(6)}, Lng:{' '}
                  {selectedLocation.lng.toFixed(6)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationSelectionMap;
