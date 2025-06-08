
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Filter } from "lucide-react";
import { mockIssues } from "@/lib/mockData";

interface IssueMapProps {
  onBack: () => void;
}

const IssueMap = ({ onBack }: IssueMapProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center space-x-3">
                <div className="bg-green-600 p-2 rounded-lg">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Issue Map</h1>
                  <p className="text-sm text-gray-600">View all reported issues by location</p>
                </div>
              </div>
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map Placeholder */}
          <div className="lg:col-span-3">
            <Card className="h-[600px]">
              <CardContent className="p-0 h-full">
                <div className="bg-gray-100 h-full rounded-lg flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100"></div>
                  
                  {/* Simulated map markers */}
                  <div className="absolute top-20 left-32 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-red-500 w-4 h-4 rounded-full border-2 border-white shadow-lg"></div>
                    <div className="text-xs mt-1 bg-white px-2 py-1 rounded shadow">Pothole</div>
                  </div>
                  
                  <div className="absolute top-40 right-20 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-orange-500 w-4 h-4 rounded-full border-2 border-white shadow-lg"></div>
                    <div className="text-xs mt-1 bg-white px-2 py-1 rounded shadow">Streetlight</div>
                  </div>
                  
                  <div className="absolute bottom-32 left-20 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-blue-500 w-4 h-4 rounded-full border-2 border-white shadow-lg"></div>
                    <div className="text-xs mt-1 bg-white px-2 py-1 rounded shadow">Water Supply</div>
                  </div>
                  
                  <div className="absolute bottom-20 right-32 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-green-500 w-4 h-4 rounded-full border-2 border-white shadow-lg"></div>
                    <div className="text-xs mt-1 bg-white px-2 py-1 rounded shadow">Resolved</div>
                  </div>
                  
                  <div className="text-center z-10">
                    <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Interactive Map View</h3>
                    <p className="text-gray-600 max-w-md">
                      This would show an interactive map with all reported issues marked by location.
                      Each marker would be color-coded by status and clickable for details.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Issue List Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Nearby Issues</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockIssues.slice(0, 6).map((issue) => (
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
            <Card>
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
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Water Issues</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueMap;
