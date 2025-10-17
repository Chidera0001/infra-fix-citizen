import React from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface LoadingPageProps {
  text?: string;
  subtitle?: string;
}

const LoadingPage: React.FC<LoadingPageProps> = ({ 
  text = 'Loading Citizn...', 
  subtitle = 'Please wait while we prepare everything for you' 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
      <div className="text-center max-w-md mx-auto px-6">
        {/* Logo/Brand */}
        <div className="mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
            <img 
              src="/Assets/logo/Trademark.png" 
              alt="Citizn Logo" 
              className="h-8 w-auto brightness-0 invert"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Citizn</h1>
          <p className="text-gray-600 text-sm">Infrastructure Issue Management</p>
        </div>

        {/* Custom Loading Spinner */}
        <LoadingSpinner size="lg" text="" />

        {/* Loading Text */}
        <div className="mt-8 space-y-2">
          <h2 className="text-lg font-semibold text-gray-800">{text}</h2>
          <p className="text-gray-500 text-sm">{subtitle}</p>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center space-x-2 mt-6">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
