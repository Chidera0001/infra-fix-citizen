
import React from 'react';

interface CitiznLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon';
  className?: string;
}

const CitiznLogo = ({ size = 'md', variant = 'full', className = '' }: CitiznLogoProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  const LogoIcon = () => (
    <div className={`${sizeClasses[size]} relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-xl shadow-lg flex items-center justify-center ${className}`}>
      {/* Geometric design representing community/connection */}
      <div className="relative">
        {/* Central hexagon */}
        <div className="w-5 h-5 bg-white rounded-sm transform rotate-45 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        {/* Connecting dots */}
        <div className="w-1.5 h-1.5 bg-white/80 rounded-full absolute -top-1 left-1/2 -translate-x-1/2"></div>
        <div className="w-1.5 h-1.5 bg-white/80 rounded-full absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
        <div className="w-1.5 h-1.5 bg-white/80 rounded-full absolute top-1/2 -left-1 -translate-y-1/2"></div>
        <div className="w-1.5 h-1.5 bg-white/80 rounded-full absolute top-1/2 -right-1 -translate-y-1/2"></div>
      </div>
    </div>
  );

  if (variant === 'icon') {
    return <LogoIcon />;
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <LogoIcon />
      <span className={`font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent ${textSizes[size]} tracking-tight`}>
        Citizn
      </span>
    </div>
  );
};

export default CitiznLogo;
