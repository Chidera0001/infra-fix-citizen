
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BarChart3, TrendingUp, Users, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import CitiznLogo from "@/components/CitiznLogo";

const CitizenAnalytics = () => {
  const navigate = useNavigate();

  const monthlyReports = [
    { month: 'Jan', reports: 12, resolved: 8 },
    { month: 'Feb', reports: 19, resolved: 15 },
    { month: 'Mar', reports: 15, resolved: 12 },
    { month: 'Apr', reports: 25, resolved: 18 },
    { month: 'May', reports: 22, resolved: 20 },
    { month: 'Jun', reports: 30, resolved: 25 }
  ];

  const categoryData = [
    { name: 'Potholes', value: 35, color: '#ef4444' },
    { name: 'Streetlights', value: 25, color: '#f97316' },
    { name: 'Water Supply', value: 20, color: '#3b82f6' },
    { name: 'Drainage', value: 15, color: '#22c55e' },
    { name: 'Other', value: 5, color: '#8b5cf6' }
  ];

  const resolutionTime = [
    { week: 'Week 1', avgDays: 12 },
    { week: 'Week 2', avgDays: 10 },
    { week: 'Week 3', avgDays: 8 },
    { week: 'Week 4', avgDays: 9 },
    { week: 'Week 5', avgDays: 7 },
    { week: 'Week 6', avgDays: 6 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/citizen')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <CitiznLogo size="sm" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Community Analytics</h1>
              <p className="text-sm text-gray-600">Your impact on community improvement</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Reports</p>
                  <p className="text-2xl font-bold text-gray-900">123</p>
                  <p className="text-xs text-green-600">+12% this month</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Resolution Rate</p>
                  <p className="text-2xl font-bold text-green-600">85%</p>
                  <p className="text-xs text-green-600">+5% this month</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Community Impact</p>
                  <p className="text-2xl font-bold text-purple-600">47</p>
                  <p className="text-xs text-green-600">Issues helped resolve</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Resolution</p>
                  <p className="text-2xl font-bold text-orange-600">7.2</p>
                  <p className="text-xs text-gray-600">days</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Reports Chart */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle>Monthly Reports & Resolutions</CardTitle>
              <CardDescription>Track your reporting activity over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyReports}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="reports" fill="#3b82f6" name="Reports" />
                  <Bar dataKey="resolved" fill="#22c55e" name="Resolved" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Issue Categories */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle>Issues by Category</CardTitle>
              <CardDescription>Breakdown of reported issue types</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Resolution Time Trend */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl mb-8">
          <CardHeader>
            <CardTitle>Average Resolution Time Trend</CardTitle>
            <CardDescription>How quickly issues are being resolved over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={resolutionTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Line type="monotone" dataKey="avgDays" stroke="#f97316" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Personal Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">Your Rank</h3>
              <p className="text-3xl font-bold">#12</p>
              <p className="text-blue-100">Out of 1,247 active citizens</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">Streak</h3>
              <p className="text-3xl font-bold">15</p>
              <p className="text-green-100">Days of community engagement</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">Badge Level</h3>
              <p className="text-3xl font-bold">Gold</p>
              <p className="text-purple-100">Community Champion</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CitizenAnalytics;
