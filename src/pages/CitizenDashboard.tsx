
import { useUser, UserButton } from "@clerk/clerk-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, MapPin, Camera, MessageSquare, ThumbsUp, BarChart3 } from "lucide-react";
import CitiznLogo from "@/components/CitiznLogo";
import IssueCard from "@/components/IssueCard";
import { mockIssues } from "@/lib/mockData";

const CitizenDashboard = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<"dashboard" | "report" | "map">("dashboard");
  const [myReports] = useState(mockIssues.slice(0, 3));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <CitiznLogo size="md" />
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome back, {user?.firstName}</span>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10"
                  }
                }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Citizen Dashboard</h1>
          <p className="text-gray-600">Track your reports and make a difference in your community</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
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
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
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
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
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
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Community Impact</p>
                  <p className="text-2xl font-bold text-blue-600">47</p>
                </div>
                <ThumbsUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 bg-white/70 backdrop-blur-sm border-0 group">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Plus className="h-6 w-6 text-blue-600" />
                </div>
                <span>Report New Issue</span>
              </CardTitle>
              <CardDescription>
                Found a pothole, broken streetlight, or other infrastructure problem? Report it here.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 bg-white/70 backdrop-blur-sm border-0 group">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg group-hover:bg-green-200 transition-colors">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <span>Explore Map</span>
              </CardTitle>
              <CardDescription>
                See all reported issues in your area on an interactive map.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 bg-white/70 backdrop-blur-sm border-0 group">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <div className="bg-purple-100 p-2 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <span>View Analytics</span>
              </CardTitle>
              <CardDescription>
                Track your community impact and contribution statistics.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* My Recent Reports */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
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
