
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, MapPin, Plus } from "lucide-react";
import { useIssues } from "@/hooks/use-issues";
import CitiznLogo from "@/components/CitiznLogo";

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const CitizenMap = () => {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [apiKey, setApiKey] = useState("");
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const { data: issues = [], isLoading } = useIssues({ limit: 100 });

  useEffect(() => {
    if (apiKey && !isMapLoaded) {
      loadGoogleMaps();
    }
  }, [apiKey]);

  const loadGoogleMaps = () => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      initMap();
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
    script.async = true;
    script.defer = true;

    // Set up callback
    window.initMap = initMap;

    // Append script to head
    document.head.appendChild(script);
  };

  const initMap = () => {
    if (!mapRef.current) return;

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: { lat: 6.5244, lng: 3.3792 }, // Lagos, Nigeria
      zoom: 13,
      styles: [
        {
          featureType: "poi.business",
          stylers: [{ visibility: "off" }]
        }
      ]
    });

    setMap(mapInstance);
    setIsMapLoaded(true);

    // Add markers for existing issues
    issues.forEach((issue, index) => {
      const marker = new window.google.maps.Marker({
        position: {
          lat: 6.5244 + (Math.random() - 0.5) * 0.1,
          lng: 3.3792 + (Math.random() - 0.5) * 0.1
        },
        map: mapInstance,
        title: issue.title,
        icon: {
          url: getMarkerColor(issue.status),
          scaledSize: new window.google.maps.Size(30, 30)
        }
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 10px;">
            <h3 style="margin: 0 0 5px 0; font-size: 14px; font-weight: bold;">${issue.title}</h3>
            <p style="margin: 0 0 5px 0; font-size: 12px; color: #666;">${issue.description}</p>
            <p style="margin: 0; font-size: 11px; color: #999;">${issue.location}</p>
            <span style="display: inline-block; background: ${getStatusColor(issue.status)}; color: white; padding: 2px 6px; border-radius: 3px; font-size: 10px; margin-top: 5px;">${issue.status}</span>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstance, marker);
      });
    });

    // Add click listener to report new issues
    mapInstance.addListener('click', (event: any) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      
      if (window.confirm('Would you like to report an issue at this location?')) {
        // Store location and navigate to report form
        sessionStorage.setItem('reportLocation', JSON.stringify({ lat, lng }));
        navigate('/citizen/report');
      }
    });
  };

  const getMarkerColor = (status: string) => {
    switch (status) {
      case 'open': return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTUiIGN5PSIxNSIgcj0iMTUiIGZpbGw9IiNlZjQ0NDQiLz4KPC9zdmc+';
      case 'in-progress': return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTUiIGN5PSIxNSIgcj0iMTUiIGZpbGw9IiNmOTczMTYiLz4KPC9zdmc+';
      case 'resolved': return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTUiIGN5PSIxNSIgcj0iMTUiIGZpbGw9IiMyMmM1NWUiLz4KPC9zdmc+';
      default: return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTUiIGN5PSIxNSIgcj0iMTUiIGZpbGw9IiM2MzY2ZjEiLz4KPC9zdmc+';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return '#ef4444';
      case 'in-progress': return '#f97316';
      case 'resolved': return '#22c55e';
      default: return '#6366f1';
    }
  };

  if (!isMapLoaded && !apiKey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/citizen')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <CitiznLogo size="sm" />
            </div>
          </div>
        </header>

        <div className="max-w-md mx-auto pt-20">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle>Google Maps API Key Required</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                To use the interactive map feature, please enter your Google Maps API key.
              </p>
              <Input
                type="text"
                placeholder="Enter your Google Maps API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <Button 
                onClick={() => apiKey && loadGoogleMaps()} 
                disabled={!apiKey}
                className="w-full"
              >
                Load Map
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-xl font-normal text-gray-900">Issue Map</h1>
                <p className="text-sm text-gray-600">View and report issues by location</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={() => navigate('/citizen/report')}>
                <Plus className="h-4 w-4 mr-2" />
                Report Issue
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-0 h-full">
                <div ref={mapRef} className="w-full h-full rounded-lg" />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg">Nearby Issues</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {issues.slice(0, 6).map((issue) => (
                  <div key={issue.id} className="border-b pb-3 last:border-b-0">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{issue.title}</h4>
                      <Badge variant={
                        issue.status === "open" ? "destructive" :
                        issue.status === "in-progress" ? "default" : "secondary"
                      }>
                        {issue.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{issue.location}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{issue.category}</span>
                      <span className="text-xs text-gray-500">{issue.date}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Legend */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg">Map Legend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Open Issues</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">In Progress</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Resolved</span>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="bg-blue-50/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-4">
                <p className="text-sm text-blue-800">
                  💡 <strong>Tip:</strong> Click anywhere on the map to report a new issue at that location!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenMap;
