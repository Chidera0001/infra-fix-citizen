import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'Loading...', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        {/* Outer ring */}
        <div className={`${sizeClasses[size]} rounded-full border-4 border-green-100`}></div>
        {/* Spinning ring */}
        <div className={`${sizeClasses[size]} rounded-full border-4 border-transparent border-t-green-600 border-r-green-600 animate-spin absolute top-0 left-0`}></div>
        {/* Inner dot */}
        <div className={`${sizeClasses[size]} rounded-full bg-green-600 animate-pulse absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`} style={{ width: '25%', height: '25%' }}></div>
      </div>
      {text && (
        <p className="mt-4 text-green-600 font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
