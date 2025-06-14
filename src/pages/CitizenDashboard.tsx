
import { useUser, UserButton } from "@clerk/clerk-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, MapPin, Camera, MessageSquare, ThumbsUp, BarChart3, Heart, MessageCircle } from "lucide-react";
import CitiznLogo from "@/components/CitiznLogo";
import IssueCard from "@/components/IssueCard";
import { mockIssues } from "@/lib/mockData";

const CitizenDashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [myReports] = useState(mockIssues.slice(0, 3));

  const handleReportClick = () => {
    navigate('/citizen/report');
  };

  const handleMapClick = () => {
    navigate('/citizen/map');
  };

  const handleAnalyticsClick = () => {
    navigate('/citizen/analytics');
  };

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
          <Card 
            className="cursor-pointer hover:shadow-xl transition-all duration-300 bg-white/70 backdrop-blur-sm border-0 group"
            onClick={handleReportClick}
          >
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
          <Card 
            className="cursor-pointer hover:shadow-xl transition-all duration-300 bg-white/70 backdrop-blur-sm border-0 group"
            onClick={handleMapClick}
          >
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg group-hover:bg-green-200 transition-colors">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <span>Explore Map</span>
              </CardTitle>
              <CardDescription>
                See all reported issues in your area on an interactive map and report new ones.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card 
            className="cursor-pointer hover:shadow-xl transition-all duration-300 bg-white/70 backdrop-blur-sm border-0 group"
            onClick={handleAnalyticsClick}
          >
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
            <div className="space-y-6">
              {myReports.map((issue) => (
                <div key={issue.id} className="border rounded-lg p-6 bg-white/50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">{issue.title}</h3>
                      <p className="text-gray-600 mb-3">{issue.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {issue.location}
                        </span>
                        <span>{issue.date}</span>
                        <Badge variant={
                          issue.status === "open" ? "destructive" :
                          issue.status === "in-progress" ? "default" : "secondary"
                        }>
                          {issue.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {/* Like and Comment Section */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-6">
                      <button className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors">
                        <Heart className="h-5 w-5" />
                        <span className="text-sm">{issue.likes || 12}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
                        <MessageCircle className="h-5 w-5" />
                        <span className="text-sm">{issue.comments?.length || 3} comments</span>
                      </button>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CitizenDashboard;
