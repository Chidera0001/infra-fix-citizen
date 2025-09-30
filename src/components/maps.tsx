
"use client";

import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

// Export the API key for other components to use
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;


// Map configuration for consistency across components
export const MAP_CONFIG = {
	defaultCenter: { lat: 6.5244, lng: 3.3792 }, // Lagos, Nigeria
	defaultZoom: 12,
	styles: [
		{
			featureType: "poi",
			elementType: "labels",
			stylers: [{ visibility: "off" }],
		},
	],
};

interface MapProps {
  address: string;
}

function Map() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
        version: "weekly",
      });

      const { Map } = await loader.importLibrary("maps");

      // init marker
      const { Marker } = (await loader.importLibrary(
        "marker",
      )) as google.maps.MarkerLibrary;

      const position = MAP_CONFIG.defaultCenter;

      // map options
      const mapOptions: google.maps.MapOptions = {
        center: position,
        zoom: MAP_CONFIG.defaultZoom,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: MAP_CONFIG.styles,
      };

      // set up the map
      const map = new Map(mapRef.current as HTMLDivElement, mapOptions);

      // putting up the marker
      const marker = new Marker({
        map: map,
        position: position,
      });
    };
    initMap();
  }, []);

  return <div style={{ height: "600px" }} ref={mapRef} />;
}

export default Map;
