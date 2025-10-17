"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ZoomIn, ZoomOut } from "lucide-react";
import { GOOGLE_MAPS_API_KEY, MAP_CONFIG } from "@/components/maps";

interface Issue {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  status: string;
  date: string;
  latitude: number;
  longitude: number;
  severity: number; // 1-5 scale for heat map intensity
}

interface InteractiveMapProps {
  issues?: Issue[];
  isAdmin?: boolean;
  onLocationSelect?: (coordinates: { lat: number; lng: number }) => void;
  onIssueClick?: (issue: Issue) => void;
  className?: string;
  showLocationSelector?: boolean;
  selectedLocation?: { lat: number; lng: number } | null;
}

// Helper function to get heat map colors based on severity
const getHeatColor = (severity: number): string => {
  if (severity >= 4) return "#ef4444"; // Red for high severity
  if (severity >= 3) return "#f97316"; // Orange for medium-high
  if (severity >= 2) return "#eab308"; // Yellow for medium
  return "#22c55e"; // Green for low severity
};

// Helper function to get marker color based on status
const getMarkerColor = (status: string): string => {
  switch (status) {
    case "open":
      return "#ef4444"; // Red
    case "in_progress":
      return "#f97316"; // Orange
    case "resolved":
      return "#22c55e"; // Green
    default:
      return "#6b7280"; // Gray
  }
};

function InteractiveMap({
  issues = [],
  isAdmin = false,
  onLocationSelect,
  onIssueClick,
  className = "h-[600px]",
  showLocationSelector = false,
  selectedLocation = null,
}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const circlesRef = useRef<google.maps.Circle[]>([]);
  const [mapSelectedLocation, setMapSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current) return;

      const loader = new Loader({
        apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
        version: "weekly",
        libraries: ["places"],
      });

      try {
        await loader.load();
        const { Map } = await loader.importLibrary("maps");

        // Create map instance
        mapInstance.current = new Map(mapRef.current, {
          center: MAP_CONFIG.defaultCenter,
          zoom: MAP_CONFIG.defaultZoom,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          styles: MAP_CONFIG.styles,
          // Disable default controls to prevent overlapping
          zoomControl: false,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: false,
        });

        // Add click listener for location selection
        if (onLocationSelect) {
          mapInstance.current.addListener("click", (event: google.maps.MapMouseEvent) => {
            if (event.latLng) {
              const lat = event.latLng.lat();
              const lng = event.latLng.lng();
              const coordinates = { lat, lng };
              onLocationSelect(coordinates);
              setMapSelectedLocation(coordinates);
            }
          });
        }

      } catch (error) {
        // Error loading Google Maps
      }
    };

    initMap();

    // Cleanup
    return () => {
      if (mapInstance.current) {
        markersRef.current.forEach((marker) => marker.setMap(null));
        circlesRef.current.forEach((circle) => circle.setMap(null));
        markersRef.current = [];
        circlesRef.current = [];
        mapInstance.current = null;
      }
    };
  }, [onLocationSelect]);

  // Add markers and heat map
  useEffect(() => {
    if (!mapInstance.current) return;

    // Clear existing markers and circles
    markersRef.current.forEach((marker) => marker.setMap(null));
    circlesRef.current.forEach((circle) => circle.setMap(null));
    markersRef.current = [];
    circlesRef.current = [];

    const addIssueMarkers = async () => {
      const { Marker } = (await new Loader({
        apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
        version: "weekly",
      }).importLibrary("marker")) as google.maps.MarkerLibrary;

      if (isAdmin) {
        // Add heat map circles for admin view
        issues.forEach((issue) => {
          const circle = new google.maps.Circle({
            strokeColor: getHeatColor(issue.severity),
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: getHeatColor(issue.severity),
            fillOpacity: 0.35,
            map: mapInstance.current,
            center: { lat: issue.latitude, lng: issue.longitude },
            radius: 100,
          });

          // Add click listener to circle
          circle.addListener("click", () => {
            const infoWindow = new google.maps.InfoWindow({
              content: `
                <div class="p-2">
                  <h3 class="font-normal">${issue.title}</h3>
                  <p class="text-sm text-gray-600">${issue.category}</p>
                  <p class="text-sm text-gray-600">Status: ${issue.status}</p>
                  <p class="text-sm text-gray-600">Severity: ${issue.severity}/5</p>
                </div>
              `,
            });
            infoWindow.setPosition({
              lat: issue.latitude,
              lng: issue.longitude,
            });
            infoWindow.open(mapInstance.current);
          });

          circlesRef.current.push(circle);
        });
      } else {
        // Add individual markers for citizen view
        issues.forEach((issue) => {
          const marker = new Marker({
            position: { lat: issue.latitude, lng: issue.longitude },
            map: mapInstance.current,
          });

          // Create custom marker icon
          const markerIcon = {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: getMarkerColor(issue.status),
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
          };

          marker.setIcon(markerIcon);

          // Add click listener to marker
          marker.addListener("click", () => {
            const infoWindow = new google.maps.InfoWindow({
              content: `
                <div class="p-2 min-w-[200px]">
                  <h3 class="font-normal text-sm mb-1">${issue.title}</h3>
                  <p class="text-xs text-gray-600 mb-2">${issue.description}</p>
                  <div class="flex items-center justify-between">
                    <span class="text-xs bg-gray-100 px-2 py-1 rounded">${issue.category}</span>
                    <span class="text-xs ${
                      issue.status === "open"
                        ? "bg-red-100 text-red-700"
                        : issue.status === "in_progress"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-green-100 text-green-700"
                    } px-2 py-1 rounded">${issue.status}</span>
                  </div>
                  <p class="text-xs text-gray-500 mt-2">${issue.date}</p>
                </div>
              `,
            });
            infoWindow.open(mapInstance.current, marker);

            if (onIssueClick) {
              onIssueClick(issue);
            }
          });

          markersRef.current.push(marker);
        });
      }

      // Add selected location marker
      if (selectedLocation) {
        const selectedMarker = new Marker({
          position: {
            lat: selectedLocation.lat,
            lng: selectedLocation.lng,
          },
          map: mapInstance.current,
        });

        const selectedIcon = {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: "#3b82f6",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 3,
        };

        selectedMarker.setIcon(selectedIcon);

        // Add info window for selected location
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div class="p-2">
              <h3 class="font-normal text-sm">Selected Location</h3>
              <p class="text-xs text-gray-600">
                Lat: ${selectedLocation.lat.toFixed(4)}, Lng: ${selectedLocation.lng.toFixed(4)}
              </p>
              <button class="mt-2 w-full bg-blue-500 text-white text-xs px-3 py-1 rounded hover:bg-blue-600">
                Report Issue Here
              </button>
            </div>
          `,
        });
        infoWindow.open(mapInstance.current, selectedMarker);

        markersRef.current.push(selectedMarker);
      }
    };

    addIssueMarkers();
  }, [issues, isAdmin, selectedLocation, onIssueClick]);

  const handleZoomIn = () => {
    if (mapInstance.current) {
      mapInstance.current.setZoom((mapInstance.current.getZoom() || 12) + 1);
    }
  };

  const handleZoomOut = () => {
    if (mapInstance.current) {
      mapInstance.current.setZoom((mapInstance.current.getZoom() || 12) - 1);
    }
  };

  return (
    <div className={`relative ${className}`} style={{ width: "100%", height: "100%" }}>
      <div
        ref={mapRef}
        className="w-full h-full rounded-none"
        style={{
          width: "100%",
          height: "100%",
          minHeight: "400px",
          zIndex: 1,
          position: "relative",
        }}
      />

      {/* Map Controls Overlay */}
      <div className="absolute top-4 right-4 space-y-6 z-20">
        <Button
          size="sm"
          variant="secondary"
          className="bg-white/95 backdrop-blur-sm shadow-lg border border-gray-200 hover:bg-white"
          onClick={handleZoomIn}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="bg-white/95 backdrop-blur-sm shadow-lg border border-gray-200 hover:bg-white"
          onClick={handleZoomOut}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-20">
        <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Legend</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {isAdmin ? (
                // Admin heat map legend
                <>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-xs">High Severity</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-xs">Medium-High</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-xs">Medium</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-xs">Low Severity</span>
                  </div>
                </>
              ) : (
                // Citizen marker legend
                <>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-xs">Open Issues</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-xs">In Progress</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-xs">Resolved</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default InteractiveMap;
