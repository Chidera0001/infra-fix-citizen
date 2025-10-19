import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Plus } from "lucide-react";
import { useIssues } from "@/hooks/use-issues";
import { L, MAP_CONFIG } from "@/components/maps";

const CitizenMap = () => {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const { data: issues = [], isLoading } = useIssues({ limit: 100 });

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView(MAP_CONFIG.defaultCenter, MAP_CONFIG.defaultZoom);
    
    // Add tile layer
    L.tileLayer(MAP_CONFIG.tileLayerUrl, MAP_CONFIG.tileLayerOptions).addTo(map);
    
    mapInstance.current = map;

    // Add click listener to report new issues
    map.on('click', (e: L.LeafletMouseEvent) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      navigate(`/report-now?lat=${lat}&lng=${lng}`);
    });

    // Cleanup function
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [navigate]);

    return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/citizen-dashboard')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Community Map
                </h1>
                <p className="text-sm text-gray-600">
                  Click anywhere on the map to report a new issue at that location
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                onClick={() => navigate('/report-issue')}
                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg"
              >
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
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => navigate('/report-issue')}
                  className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Report New Issue
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => navigate('/citizen-dashboard')}
                  className="w-full"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  View Dashboard
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg">Map Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-600 space-y-2">
                  <p>• Click anywhere on the map to report an issue at that location</p>
                  <p>• Use zoom controls to navigate to specific areas</p>
                  <p>• Drag to pan around the map</p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Issues */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg">Recent Issues</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="text-center text-gray-500 py-4">
                    Loading issues...
                  </div>
                ) : issues.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">
                    No issues found
                  </div>
                ) : (
                  issues.slice(0, 5).map((issue) => (
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