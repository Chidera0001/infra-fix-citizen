import React from 'react';

interface Problem {
  id: number;
  title: string;
  description: string;
  image: string;
  impacts: string[];
}

interface ProblemCardProps {
  problem: Problem;
  variant: 'desktop' | 'mobile' | 'tablet' | 'medium';
}

const ProblemCard: React.FC<ProblemCardProps> = ({ problem, variant }) => {
  const getCardClasses = () => {
    switch (variant) {
      case 'desktop':
        return 'group relative h-[500px] overflow-hidden rounded-3xl shadow-2xl';
      case 'mobile':
        return 'group relative h-[350px] overflow-hidden rounded-2xl shadow-xl';
      case 'tablet':
        return 'group relative h-[320px] overflow-hidden rounded-2xl shadow-xl';
      case 'medium':
        return 'group relative h-[300px] overflow-hidden rounded-2xl shadow-xl';
      default:
        return 'group relative h-[500px] overflow-hidden rounded-3xl shadow-2xl';
    }
  };

  const getImageClasses = () => {
    switch (variant) {
      case 'desktop':
        return 'h-full w-full object-cover transition-transform duration-700 group-hover:scale-105';
      case 'mobile':
      case 'tablet':
      case 'medium':
        return 'h-full w-full object-cover';
      default:
        return 'h-full w-full object-cover transition-transform duration-700 group-hover:scale-105';
    }
  };

  const getGradientClasses = () => {
    switch (variant) {
      case 'desktop':
        return 'absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/20';
      case 'mobile':
        return 'absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30';
      case 'tablet':
      case 'medium':
        return 'absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/20';
      default:
        return 'absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/20';
    }
  };

  const getContentClasses = () => {
    switch (variant) {
      case 'desktop':
        return 'relative flex h-full flex-col justify-end p-6';
      case 'mobile':
        return 'relative flex h-full flex-col justify-end p-6';
      case 'tablet':
        return 'relative flex h-full flex-col justify-end p-5';
      case 'medium':
        return 'relative flex h-full flex-col justify-end p-4';
      default:
        return 'relative flex h-full flex-col justify-end p-6';
    }
  };

  const getTitleClasses = () => {
    switch (variant) {
      case 'desktop':
        return 'mb-3 text-xl font-bold leading-tight text-white';
      case 'mobile':
        return 'mb-3 text-lg font-bold leading-tight text-white';
      case 'tablet':
        return 'mb-3 text-base font-bold leading-tight text-white';
      case 'medium':
        return 'mb-2 text-sm font-bold leading-tight text-white';
      default:
        return 'mb-3 text-xl font-bold leading-tight text-white';
    }
  };

  const getDescriptionClasses = () => {
    switch (variant) {
      case 'desktop':
        return 'mb-4 line-clamp-3 text-sm leading-relaxed text-white/90';
      case 'mobile':
        return 'mb-4 line-clamp-3 text-sm leading-relaxed text-white/90';
      case 'tablet':
        return 'mb-4 line-clamp-2 text-sm leading-relaxed text-white/90';
      case 'medium':
        return 'mb-3 line-clamp-2 text-xs leading-relaxed text-white/90';
      default:
        return 'mb-4 line-clamp-3 text-sm leading-relaxed text-white/90';
    }
  };

  const getImpactsContainerClasses = () => {
    switch (variant) {
      case 'desktop':
        return 'space-y-2';
      case 'mobile':
        return 'space-y-2';
      case 'tablet':
        return 'space-y-1.5';
      case 'medium':
        return 'space-y-1';
      default:
        return 'space-y-2';
    }
  };

  const getImpactItemClasses = () => {
    switch (variant) {
      case 'desktop':
        return 'flex items-center space-x-2 rounded-lg border border-white/20 bg-white/10 p-2 backdrop-blur-sm';
      case 'mobile':
        return 'flex items-center space-x-3 rounded-lg border border-white/20 bg-white/10 p-2 backdrop-blur-sm';
      case 'tablet':
        return 'flex items-center space-x-2 rounded-lg border border-white/20 bg-white/10 p-2 backdrop-blur-sm';
      case 'medium':
        return 'flex items-center space-x-2 rounded-lg border border-white/20 bg-white/10 p-1.5 backdrop-blur-sm';
      default:
        return 'flex items-center space-x-2 rounded-lg border border-white/20 bg-white/10 p-2 backdrop-blur-sm';
    }
  };

  const getDotClasses = () => {
    switch (variant) {
      case 'desktop':
        return 'h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-400';
      case 'mobile':
        return 'h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-400';
      case 'tablet':
        return 'h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-400';
      case 'medium':
        return 'h-1 w-1 flex-shrink-0 rounded-full bg-green-400';
      default:
        return 'h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-400';
    }
  };

  const getImpactsToShow = () => {
    switch (variant) {
      case 'desktop':
        return problem.impacts.slice(0, 2);
      case 'mobile':
        return problem.impacts;
      case 'tablet':
        return problem.impacts.slice(0, 2);
      case 'medium':
        return problem.impacts.slice(0, 1);
      default:
        return problem.impacts.slice(0, 2);
    }
  };

  return (
    <div className={getCardClasses()}>
      {/* Background Image */}
      <div className='absolute inset-0'>
        <img
          src={problem.image}
          alt={problem.title}
          className={getImageClasses()}
        />
        <div className={getGradientClasses()}></div>
        <div className='absolute inset-0 bg-gradient-to-br from-green-600/20 to-transparent'></div>
      </div>

      {/* Content */}
      <div className={getContentClasses()}>
        {/* Title */}
        <h3 className={getTitleClasses()}>{problem.title}</h3>

        {/* Description */}
        <p className={getDescriptionClasses()}>{problem.description}</p>

        {/* Impact Points */}
        <div className={getImpactsContainerClasses()}>
          {getImpactsToShow().map((impact, impactIndex) => (
            <div key={impactIndex} className={getImpactItemClasses()}>
              <div className={getDotClasses()}></div>
              <span className='text-xs font-medium text-white/90'>
                {impact}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProblemCard;
