'use client';

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search, AlertTriangle } from "lucide-react";

export default function NotFound() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // 404 Error: User attempted to access non-existent route
  }, [pathname]);

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
      <div className="text-center max-w-lg mx-auto px-6">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative">
            {/* Large 404 */}
            <div className="text-8xl sm:text-9xl font-bold text-green-600 opacity-20 mb-4">
              404
            </div>
            
            {/* Icon overlay */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Page Not Found
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Oops! The page you're looking for doesn't exist.
            </p>
            <p className="text-sm text-gray-500">
              The page <code className="bg-gray-100 px-2 py-1 rounded text-xs">{pathname}</code> could not be found.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleGoBack}
              variant="outline"
              className="flex items-center gap-2 border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
            
            <Button
              onClick={handleGoHome}
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </div>

          {/* Help Text */}
          <div className="pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-3">
              Need help finding what you're looking for?
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm">
              <button
                onClick={() => router.push('/')}
                className="text-green-600 hover:text-green-700 underline"
              >
                Browse our homepage
              </button>
              <span className="hidden sm:inline text-gray-300">•</span>
              <button
                onClick={() => router.push('/auth')}
                className="text-green-600 hover:text-green-700 underline"
              >
                Sign in to your account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

