
import { useUser, UserButton } from "@clerk/clerk-react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Users, Clock, CheckCircle, AlertTriangle, TrendingUp } from "lucide-react";
import CitiznLogo from "@/components/CitiznLogo";
import IssueCard from "@/components/IssueCard";
import { mockIssues } from "@/lib/mockData";

const AdminDashboard = () => {
  const { user } = useUser();
  const [recentIssues] = useState(mockIssues.slice(0, 5));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <CitiznLogo size="md" />
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                Administrator
              </Badge>
              <span className="text-sm text-gray-600">Welcome, {user?.firstName}</span>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Administrative Dashboard</h1>
          <p className="text-gray-600">Monitor and manage community reports across your jurisdiction</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Reports</p>
                  <p className="text-3xl font-bold text-gray-900">847</p>
                  <p className="text-sm text-green-600">+12% this month</p>
                </div>
                <BarChart3 className="h-10 w-10 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Resolved</p>
                  <p className="text-3xl font-bold text-green-600">623</p>
                  <p className="text-sm text-green-600">73.6% success rate</p>
                </div>
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-3xl font-bold text-orange-600">156</p>
                  <p className="text-sm text-orange-600">Needs attention</p>
                </div>
                <Clock className="h-10 w-10 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Citizens</p>
                  <p className="text-3xl font-bold text-purple-600">2,341</p>
                  <p className="text-sm text-purple-600">+8% growth</p>
                </div>
                <Users className="h-10 w-10 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Priority Alerts */}
        <Card className="mb-8 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span>Priority Issues Requiring Attention</span>
            </CardTitle>
            <CardDescription>High-priority reports that need immediate response</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-2">High Priority</h4>
                <p className="text-2xl font-bold text-red-600">23</p>
                <p className="text-sm text-red-600">Critical infrastructure</p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-semibold text-orange-800 mb-2">Medium Priority</h4>
                <p className="text-2xl font-bold text-orange-600">67</p>
                <p className="text-sm text-orange-600">Standard maintenance</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">Low Priority</h4>
                <p className="text-2xl font-bold text-yellow-600">66</p>
                <p className="text-sm text-yellow-600">Minor improvements</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>Latest citizen reports requiring review and action</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentIssues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} showActions={true} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
