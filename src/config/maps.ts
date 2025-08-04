// Google Maps API Configuration
const apiKey = "AIzaSyBzm6lpRbkn46PI8kNY3oL_RapAa_Psn18";
console.log("API Key being used:", apiKey);
export const GOOGLE_MAPS_API_KEY = apiKey;

// Map configuration
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
