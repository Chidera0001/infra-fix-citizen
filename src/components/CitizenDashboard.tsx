
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, MapPin, Camera, MessageSquare, ThumbsUp } from "lucide-react";
import ReportForm from "@/components/ReportForm";
import IssueMap from "@/components/IssueMap";
import IssueCard from "@/components/IssueCard";
import { mockIssues } from "@/lib/mockData";

interface CitizenDashboardProps {
  onBack: () => void;
}

const CitizenDashboard = ({ onBack }: CitizenDashboardProps) => {
  const [activeTab, setActiveTab] = useState<"dashboard" | "report" | "map">("dashboard");
  const [myReports] = useState(mockIssues.slice(0, 3));

  if (activeTab === "report") {
    return <ReportForm onBack={() => setActiveTab("dashboard")} />;
  }

  if (activeTab === "map") {
    return <IssueMap onBack={() => setActiveTab("dashboard")} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Citizen Dashboard</h1>
                  <p className="text-sm text-gray-600">Welcome back, John!</p>
                </div>
              </div>
            </div>
            <Button onClick={() => setActiveTab("report")} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Report Issue
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">My Reports</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
                <Camera className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">8</p>
                </div>
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-green-600 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-orange-600">3</p>
                </div>
                <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-orange-600 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Upvotes</p>
                  <p className="text-2xl font-bold text-blue-600">47</p>
                </div>
                <ThumbsUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab("report")}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Plus className="h-6 w-6 text-blue-600" />
                <span>Report New Issue</span>
              </CardTitle>
              <CardDescription>
                Found a pothole, broken streetlight, or other infrastructure problem? Report it here.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab("map")}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <MapPin className="h-6 w-6 text-green-600" />
                <span>View Map</span>
              </CardTitle>
              <CardDescription>
                See all reported issues in your area on an interactive map.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* My Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle>My Recent Reports</CardTitle>
            <CardDescription>Track the progress of your submitted issues</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myReports.map((issue) => (
                <IssueCard key={issue.id} issue={issue} showActions={false} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CitizenDashboard;
