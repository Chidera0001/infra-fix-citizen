"use client";

import { useEffect, useRef, useState } from "react";
import { L, MAP_CONFIG } from "@/components/maps";
import { 
  groupIssuesByLocation, 
  createMarkerIcon, 
  addMarkerInteractions 
} from "@/components/map-helpers";
import type { Issue } from "@/lib/supabase-api";

interface InteractiveMapProps {
  issues?: Issue[];
  isAdmin?: boolean;
  onLocationSelect?: (coordinates: { lat: number; lng: number }) => void;
  onIssueClick?: (issue: Issue) => void;
  className?: string;
  showLocationSelector?: boolean;
  selectedLocation?: { lat: number; lng: number };
}

function InteractiveMap({
  issues = [],
  isAdmin = false,
  onLocationSelect,
  onIssueClick,
  className = "h-[600px]",
  showLocationSelector = false,
  selectedLocation
}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    // Create map instance
    mapInstance.current = L.map(mapRef.current, {
      center: MAP_CONFIG.defaultCenter,
      zoom: MAP_CONFIG.defaultZoom,
      zoomControl: true,
      attributionControl: true
    });

    // Add tile layer
    L.tileLayer(MAP_CONFIG.tileLayerUrl, MAP_CONFIG.tileLayerOptions).addTo(mapInstance.current);

    // Add click listener for citizen view
    if (!isAdmin && onLocationSelect) {
      mapInstance.current.on('click', (e) => {
        onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
      });
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [onLocationSelect, isAdmin]);

  // Add markers when issues change
  useEffect(() => {
    if (!mapInstance.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      if (mapInstance.current) {
        mapInstance.current.removeLayer(marker);
      }
    });
    markersRef.current = [];

    // Add a small delay to ensure map is fully rendered
    const timeoutId = setTimeout(() => {
      if (!mapInstance.current) return;

      if (isAdmin && issues.length > 0) {
        // Group issues by location - ONLY for admin view
        const groupedIssues = groupIssuesByLocation(issues);
        
        if (groupedIssues.length === 0) {
          return;
        }

        groupedIssues.forEach(({ lat, lng, issues: locationIssues, totalCount, resolvedCount, inProgressCount, openCount, status }) => {
          // Validate coordinates
          if (lat === undefined || lng === undefined || isNaN(lat) || isNaN(lng)) {
            return;
          }

          try {
            // Create marker icon
            const markerIcon = createMarkerIcon(status, totalCount);
            const marker = L.marker([lat, lng], { icon: markerIcon }).addTo(mapInstance.current!);

            // Add interactions
            addMarkerInteractions(marker, totalCount, resolvedCount, inProgressCount, openCount);

            // Handle marker click
            if (onIssueClick && locationIssues.length > 0) {
              marker.on('click', () => {
                onIssueClick(locationIssues[0]);
              });
            }

            markersRef.current.push(marker);
          } catch (error) {
            console.error('Error creating marker:', error);
          }
        });
      } else if (!isAdmin && showLocationSelector && selectedLocation) {
        // Show selected location marker for citizen view
        if (selectedLocation.lat !== undefined && selectedLocation.lng !== undefined && 
            !isNaN(selectedLocation.lat) && !isNaN(selectedLocation.lng)) {
          
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
            iconAnchor: [10, 10]
          });

          const selectedMarker = L.marker([selectedLocation.lat, selectedLocation.lng], { 
            icon: selectedIcon 
          }).addTo(mapInstance.current!);

          selectedMarker.bindPopup(`
            <div style="padding: 8px;">
              <h4 style="margin: 0 0 4px 0; font-size: 12px; font-weight: bold;">Selected Location</h4>
              <p style="margin: 0; font-size: 11px; color: #666;">
                Lat: ${selectedLocation.lat.toFixed(4)}, Lng: ${selectedLocation.lng.toFixed(4)}
              </p>
            </div>
          `).openPopup();

          markersRef.current.push(selectedMarker);
        }
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [issues, isAdmin, selectedLocation, showLocationSelector, onIssueClick]);

  return (
    <div className={`relative ${className}`} style={{ width: "100%", height: "100%" }}>
      <div
        ref={mapRef}
        className="w-full h-full"
        style={{
          zIndex: 1,
          position: "relative",
          minHeight: "300px"
        }}
      />
    </div>
  );
}

export default InteractiveMap;