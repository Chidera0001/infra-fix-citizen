
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Camera, BarChart3, Users, CheckCircle, AlertTriangle, ArrowRight, Star, Shield, Clock } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
                <MapPin className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">InfraTrack</h1>
                <p className="text-sm text-gray-600 font-medium">Fixing cities, one report at a time</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="hidden sm:flex">
                <Star className="h-3 w-3 mr-1" />
                Trusted Platform
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 transform -skew-y-1"></div>
        <div className="max-w-7xl mx-auto text-center relative">
          <div className="mb-8">
            <Badge className="mb-6 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
              <Shield className="h-3 w-3 mr-1" />
              Secure & Reliable Platform
            </Badge>
            <h2 className="text-6xl font-bold text-gray-900 mb-8 tracking-tight leading-tight">
              Report Infrastructure Issues
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mt-2">
                Make Your City Better
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Join thousands of citizens helping improve urban infrastructure. Report issues, track progress, 
              and see real change happen in your community with our professional-grade platform.
            </p>
          </div>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-green-100 p-4 rounded-2xl">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-3">1,247</h3>
              <p className="text-gray-600 font-medium">Issues Resolved</p>
              <div className="mt-3 text-sm text-green-600 font-medium">+23% this month</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-blue-100 p-4 rounded-2xl">
                  <Users className="h-10 w-10 text-blue-600" />
                </div>
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-3">8,532</h3>
              <p className="text-gray-600 font-medium">Active Citizens</p>
              <div className="mt-3 text-sm text-blue-600 font-medium">Growing daily</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-orange-100 p-4 rounded-2xl">
                  <Clock className="h-10 w-10 text-orange-600" />
                </div>
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-3">2.4 hrs</h3>
              <p className="text-gray-600 font-medium">Avg Response Time</p>
              <div className="mt-3 text-sm text-orange-600 font-medium">Industry leading</div>
            </div>
          </div>

          {/* Enhanced User Type Selection */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
            <Card className="group hover:shadow-2xl transition-all duration-500 border-2 hover:border-blue-300 cursor-pointer transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm" onClick={() => setUserType("citizen")}>
              <CardHeader className="text-center pb-6">
                <div className="mx-auto bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-2xl w-20 h-20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Camera className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-3xl text-gray-900 mb-3">I'm a Citizen</CardTitle>
                <CardDescription className="text-gray-600 text-lg">
                  Report infrastructure issues in your community
                </CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <ul className="space-y-4 text-left mb-8">
                  <li className="flex items-center space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">Report issues with photos and location</span>
                  </li>
                  <li className="flex items-center space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">Track real-time resolution progress</span>
                  </li>
                  <li className="flex items-center space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">Engage with your community</span>
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" size="lg">
                  Start Reporting
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border-2 hover:border-green-300 cursor-pointer transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm" onClick={() => setUserType("admin")}>
              <CardHeader className="text-center pb-6">
                <div className="mx-auto bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-2xl w-20 h-20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <BarChart3 className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-3xl text-gray-900 mb-3">I'm an Administrator</CardTitle>
                <CardDescription className="text-gray-600 text-lg">
                  Manage and respond to citizen reports
                </CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <ul className="space-y-4 text-left mb-8">
                  <li className="flex items-center space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">Access comprehensive analytics dashboard</span>
                  </li>
                  <li className="flex items-center space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">Manage efficient issue resolution</span>
                  </li>
                  <li className="flex items-center space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">Coordinate with response teams</span>
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" size="lg">
                  Access Dashboard
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-24 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-indigo-50 text-indigo-700 border-indigo-200">
              How It Works
            </Badge>
            <h3 className="text-4xl font-bold text-gray-900 mb-6">Simple, Effective, Transparent</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our streamlined process ensures every infrastructure issue gets the attention it deserves
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Camera className="h-10 w-10 text-white" />
              </div>
              <div className="bg-blue-50 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h4 className="text-2xl font-semibold text-gray-900 mb-4">Report</h4>
              <p className="text-gray-600 leading-relaxed">
                Capture infrastructure issues with photos and precise location data using our intuitive mobile-first interface
              </p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <AlertTriangle className="h-10 w-10 text-white" />
              </div>
              <div className="bg-orange-50 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4">
                <span className="text-orange-600 font-bold">2</span>
              </div>
              <h4 className="text-2xl font-semibold text-gray-900 mb-4">Track</h4>
              <p className="text-gray-600 leading-relaxed">
                Monitor real-time progress with automated updates as authorities work to resolve reported issues
              </p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <div className="bg-green-50 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold">3</span>
              </div>
              <h4 className="text-2xl font-semibold text-gray-900 mb-4">Resolve</h4>
              <p className="text-gray-600 leading-relaxed">
                Receive instant notifications when issues are fixed and see tangible improvements in your community
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
                <MapPin className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold">InfraTrack</h1>
            </div>
            <p className="text-gray-400 mb-8 text-lg">Making cities better, one report at a time.</p>
            <div className="flex items-center justify-center space-x-8 mb-8">
              <Badge variant="secondary" className="bg-gray-800 text-gray-300 border-gray-700">
                <Shield className="h-4 w-4 mr-2" />
                Enterprise Security
              </Badge>
              <Badge variant="secondary" className="bg-gray-800 text-gray-300 border-gray-700">
                <Clock className="h-4 w-4 mr-2" />
                24/7 Monitoring
              </Badge>
              <Badge variant="secondary" className="bg-gray-800 text-gray-300 border-gray-700">
                <Users className="h-4 w-4 mr-2" />
                Community Driven
              </Badge>
            </div>
            <p className="text-gray-500">© 2024 InfraTrack. Building better communities together.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
