
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Camera, BarChart3, Users, CheckCircle, AlertTriangle } from "lucide-react";
import CitizenDashboard from "@/components/CitizenDashboard";
import AdminDashboard from "@/components/AdminDashboard";

const Index = () => {
  const [userType, setUserType] = useState<"citizen" | "admin" | null>(null);

  if (userType === "citizen") {
    return <CitizenDashboard onBack={() => setUserType(null)} />;
  }

  if (userType === "admin") {
    return <AdminDashboard onBack={() => setUserType(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">InfraTrack</h1>
                <p className="text-sm text-gray-600">Fixing cities, one report at a time</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Report Infrastructure Issues
            <span className="block text-blue-600 mt-2">Make Your City Better</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Join thousands of citizens helping improve urban infrastructure. Report issues, track progress, 
            and see real change happen in your community.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">1,247</h3>
              <p className="text-gray-600">Issues Resolved</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">8,532</h3>
              <p className="text-gray-600">Active Citizens</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-orange-100 p-3 rounded-full">
                  <AlertTriangle className="h-8 w-8 text-orange-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">342</h3>
              <p className="text-gray-600">In Progress</p>
            </div>
          </div>

          {/* User Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-300 cursor-pointer" onClick={() => setUserType("citizen")}>
              <CardHeader className="text-center pb-4">
                <div className="mx-auto bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <Camera className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl text-gray-900">I'm a Citizen</CardTitle>
                <CardDescription className="text-gray-600">
                  Report infrastructure issues in your community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-left mb-6">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Report issues with photos</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Track resolution progress</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Engage with community</span>
                  </li>
                </ul>
                <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                  Start Reporting
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-green-300 cursor-pointer" onClick={() => setUserType("admin")}>
              <CardHeader className="text-center pb-4">
                <div className="mx-auto bg-green-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <BarChart3 className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-gray-900">I'm an Administrator</CardTitle>
                <CardDescription className="text-gray-600">
                  Manage and respond to citizen reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-left mb-6">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">View comprehensive analytics</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Manage issue resolution</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Coordinate with teams</span>
                  </li>
                </ul>
                <Button className="w-full bg-green-600 hover:bg-green-700" size="lg">
                  Access Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">How InfraTrack Works</h3>
            <p className="text-xl text-gray-600">Simple, effective, and transparent infrastructure reporting</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Camera className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">1. Report</h4>
              <p className="text-gray-600">Take a photo of the infrastructure issue and add location details</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">2. Track</h4>
              <p className="text-gray-600">Monitor the progress as authorities work to resolve the issue</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">3. Resolve</h4>
              <p className="text-gray-600">Get notified when the issue is fixed and see the improvement</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold">InfraTrack</h1>
          </div>
          <p className="text-gray-400 mb-8">Making cities better, one report at a time.</p>
          <p className="text-gray-500">© 2024 InfraTrack. Building better communities together.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
