import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Plus } from 'lucide-react';
import { useIssues } from '@/hooks/use-issues';
import { L, MAP_CONFIG } from '@/components/maps/maps';
import {
  groupIssuesByLocation,
  createMarkerIcon,
  addMarkerInteractions,
} from '@/components/maps/map-helpers';

const CitizenMap = () => {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const { data: issues = [], isLoading } = useIssues({ limit: 100 });

  // Use ref to store navigate function to prevent map re-initialization
  const navigateRef = useRef(navigate);

  // Update navigate ref when it changes
  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

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

    // Add click listener to report new issues using ref
    map.on('click', (e: L.LeafletMouseEvent) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      navigateRef.current(`/report-now?lat=${lat}&lng=${lng}`);
    });

    // Cleanup function
    return () => {
      // Clear markers
      markersRef.current.forEach(marker => {
        if (mapInstance.current) {
          mapInstance.current.removeLayer(marker);
        }
      });
      markersRef.current = [];

      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Add markers when issues change
  useEffect(() => {
    if (!mapInstance.current || isLoading) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      if (mapInstance.current) {
        mapInstance.current.removeLayer(marker);
      }
    });
    markersRef.current = [];

    // Use requestAnimationFrame for better performance and to avoid race conditions
    const rafId = requestAnimationFrame(() => {
      if (!mapInstance.current || issues.length === 0) return;

      // Group issues by location for citizen view
      const groupedIssues = groupIssuesByLocation(issues);

      if (groupedIssues.length === 0) {
        return;
      }

      groupedIssues.forEach(
        ({
          lat,
          lng,
          issues: locationIssues,
          totalCount,
          resolvedCount,
          inProgressCount,
          openCount,
          status,
          category,
        }) => {
          // Validate coordinates
          if (
            lat === undefined ||
            lng === undefined ||
            isNaN(lat) ||
            isNaN(lng)
          ) {
            return;
          }

          try {
            // Create marker icon with category (no count badge for citizens)
            const markerIcon = createMarkerIcon(
              status,
              totalCount,
              category,
              false
            );
            const marker = L.marker([lat, lng], { icon: markerIcon }).addTo(
              mapInstance.current!
            );

            // Add interactions (citizens don't see hover details)
            addMarkerInteractions(
              marker,
              totalCount,
              resolvedCount,
              inProgressCount,
              openCount,
              locationIssues,
              false
            );

            markersRef.current.push(marker);
          } catch (error) {
            console.error('Error creating marker:', error);
          }
        }
      );
    });

    return () => cancelAnimationFrame(rafId);
  }, [issues, isLoading]);

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50'>
      {/* Header */}
      <header className='border-b border-white/20 bg-white/80 shadow-lg backdrop-blur-sm'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between py-4'>
            <div className='flex items-center space-x-4'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => navigate('/citizen-dashboard')}
                className='text-gray-600 hover:text-gray-900'
              >
                <ArrowLeft className='mr-2 h-4 w-4' />
                Back to Dashboard
              </Button>

              <div>
                <h1 className='text-xl font-bold text-gray-900 sm:text-2xl'>
                  Community Map
                </h1>
                <p className='text-sm text-gray-600'>
                  Click anywhere on the map to report a new issue at that
                  location
                </p>
              </div>
            </div>

            <div className='flex items-center space-x-3'>
              <Button
                onClick={() => navigate('/report-issue')}
                className='bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg hover:from-green-700 hover:to-green-600'
              >
                <Plus className='mr-2 h-4 w-4' />
                Report Issue
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-4'>
          {/* Map */}
          <div className='lg:col-span-3'>
            <Card className='h-[600px] border-0 bg-white/80 shadow-xl backdrop-blur-sm'>
              <CardContent className='h-full p-0'>
                <div ref={mapRef} className='h-full w-full rounded-lg' />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className='space-y-4'>
            <Card className='border-0 bg-white/80 shadow-xl backdrop-blur-sm'>
              <CardHeader>
                <CardTitle className='text-lg'>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <Button
                  onClick={() => navigate('/report-issue')}
                  className='w-full bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-700 hover:to-green-600'
                >
                  <Plus className='mr-2 h-4 w-4' />
                  Report New Issue
                </Button>

                <Button
                  variant='outline'
                  onClick={() => navigate('/citizen-dashboard')}
                  className='w-full'
                >
                  <MapPin className='mr-2 h-4 w-4' />
                  View Dashboard
                </Button>
              </CardContent>
            </Card>

            <Card className='border-0 bg-white/80 shadow-xl backdrop-blur-sm'>
              <CardHeader>
                <CardTitle className='text-lg'>Map Instructions</CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div className='space-y-2 text-sm text-gray-600'>
                  <p>
                    • Click anywhere on the map to report an issue at that
                    location
                  </p>
                  <p>• Use zoom controls to navigate to specific areas</p>
                  <p>• Drag to pan around the map</p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Issues */}
            <Card className='border-0 bg-white/80 shadow-xl backdrop-blur-sm'>
              <CardHeader>
                <CardTitle className='text-lg'>Recent Issues</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {isLoading ? (
                  <div className='py-4 text-center text-gray-500'>
                    Loading issues...
                  </div>
                ) : issues.length === 0 ? (
                  <div className='py-4 text-center text-gray-500'>
                    No issues found
                  </div>
                ) : (
                  issues.slice(0, 5).map(issue => (
                    <div
                      key={issue.id}
                      className='border-b pb-3 last:border-b-0'
                    >
                      <div className='mb-2 flex items-start justify-between'>
                        <h4 className='text-sm font-medium'>{issue.title}</h4>
                        <Badge
                          variant={
                            issue.status === 'open'
                              ? 'destructive'
                              : issue.status === 'in-progress'
                                ? 'default'
                                : 'secondary'
                          }
                        >
                          {issue.status}
                        </Badge>
                      </div>
                      <p className='mb-2 text-xs text-gray-600'>
                        {issue.location}
                      </p>
                      <div className='flex items-center justify-between'>
                        <span className='text-xs text-gray-500'>
                          {issue.category}
                        </span>
                        <span className='text-xs text-gray-500'>
                          {issue.date}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenMap;
