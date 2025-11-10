import React, { useState, useEffect } from 'react';
import { AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ProblemCard from './ProblemCard';

interface Problem {
  id: number;
  title: string;
  description: string;
  image: string;
  impacts: string[];
}

const problems: Problem[] = [
  {
    id: 1,
    title: 'Broken Roads & Potholes',
    description:
      'Severe potholes wreck suspensions, slow traffic, and raise crash risks.',
    image: '/Assets/Images/Bad-road.jpg',
    impacts: [
      'Vehicle damage and increased repair costs',
      'Traffic congestion and longer commute times',
      'Safety risks for motorists and pedestrians',
    ],
  },
  {
    id: 2,
    title: 'Broken Street Lights',
    description:
      'Dark streets invite crime, keep shops closed, and make night walks unsafe.',
    image: '/Assets/Images/Street-light.jpg',
    impacts: [
      'Increased crime rates in dark areas',
      'Limited nighttime business activities',
      'Pedestrian safety concerns',
    ],
  },
  {
    id: 3,
    title: 'Poor Drainage Systems',
    description:
      'Blocked drains turn every rainstorm into floods and mosquito hotspots.',
    image: '/Assets/Images/Drainnage.jpg',
    impacts: [
      'Flooding during rainy seasons',
      'Health risks from stagnant water',
      'Property damage and economic losses',
    ],
  },
  {
    id: 4,
    title: 'Water Supply Issues',
    description:
      'Burst pipes leave families hauling scarce, often unsafe, water.',
    image: '/Assets/Images/water-supply.webp',
    impacts: [
      'Water scarcity and rationing',
      'Health risks from contaminated water',
      'Economic impact on businesses',
    ],
  },
  {
    id: 5,
    title: 'Traffic Signal Problems',
    description:
      'Dead lights create chaotic junctions, more crashes, and longer jams.',
    image: '/Assets/Images/Traffic-light.webp',
    impacts: [
      'Increased traffic accidents',
      'Traffic congestion and delays',
      'Pedestrian safety concerns',
    ],
  },
  {
    id: 6,
    title: 'Illegal Dump Sites',
    description:
      'Piles of waste beside homes breed disease and choke storm drains.',
    image: '/Assets/Images/Dumpsite.webp',
    impacts: [
      'Air and groundwater contamination',
      'Clogged drains that worsen flooding',
      'Health risks from pests and disease',
    ],
  },
  {
    id: 7,
    title: 'Recurring Flooding',
    description:
      'Seasonal floods shut roads, soak homes, and leave unsafe standing water.',
    image: '/Assets/Images/flood.webp',
    impacts: [
      'Road closures and stalled transport',
      'Costly damage to homes and shops',
      'Increased risk of waterborne illness',
    ],
  },
  {
    id: 8,
    title: 'Severe Erosion Sites',
    description:
      'Gullies eat away roads and farmlands, threatening nearby houses.',
    image: '/Assets/Images/Erosion.jpg',
    impacts: [
      'Loss of roads and farmland',
      'Structural danger to nearby homes',
      'Higher repair costs for communities',
    ],
  },
  {
    id: 9,
    title: 'Collapsed Bridges & Culverts',
    description:
      'Collapsed bridges cut off communities and delay emergency access.',
    image: '/Assets/Images/Collapsed bridges.webp',
    impacts: [
      'Communities cut off from essential services',
      'Dangerous crossings for commuters',
      'Delays for emergency response teams',
    ],
  },
  {
    id: 10,
    title: 'Open Manholes & Drains',
    description:
      'Missing covers injure walkers, damage cars, and make school routes risky.',
    image: '/Assets/Images/manhole.jpg',
    impacts: [
      'Serious falls and injuries to pedestrians',
      'Vehicle damage and traffic slowdowns',
      'Unsafe routes for school children',
    ],
  },
  {
    id: 11,
    title: 'Unsafe Pedestrian Crossings',
    description:
      'Faded crossings force pedestrians to sprint across speeding traffic.',
    image: '/Assets/Images/Zebra crossing.jpg',
    impacts: [
      'Higher pedestrian accident rates',
      'Reduced confidence in walking routes',
      'Limited access for children and seniors',
    ],
  },
  {
    id: 12,
    title: 'Construction Debris Piles',
    description:
      'Abandoned rubble blocks lanes, hides drains, and trips passers-by.',
    image: '/Assets/Images/construction debris.jpeg',
    impacts: [
      'Obstructed lanes and sidewalks',
      'Injuries from exposed sharp materials',
      'Storm drains blocked by loose debris',
    ],
  },
];

const ProblemsCards: React.FC = () => {
  const [scrollOffset, setScrollOffset] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isImmediate, setIsImmediate] = useState(false);

  // Duplicate list to keep a seamless loop
  const infiniteProblems = [...problems, ...problems];

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setScrollOffset(prev => {
        const next = prev + 0.003;
        if (next >= problems.length) {
          setIsImmediate(true);
          return next - problems.length;
        }
        return next;
      });
    }, 16); // smooth, gentle drift

    return () => clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    if (!isImmediate) return;
    const id = requestAnimationFrame(() => setIsImmediate(false));
    return () => cancelAnimationFrame(id);
  }, [isImmediate]);

  const desktopTransform = `translateX(-${scrollOffset * 33.33}%)`;
  const mobileTransform = `translateX(-${scrollOffset * 100}%)`;

  const handlePause = () => setIsPaused(true);
  const handleResume = () => setIsPaused(false);

  const handleManualStep = (direction: number) => {
    setScrollOffset(prev => {
      let next = prev + direction;
      if (next < 0) {
        next += problems.length;
        setIsImmediate(true);
      } else if (next >= problems.length) {
        next -= problems.length;
        setIsImmediate(true);
      }
      return next;
    });

    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 4000);
  };

  return (
    <section className='py-16 sm:py-20 lg:py-32'>
      <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Header Section */}
        <div className='mb-12 text-center sm:mb-16 lg:mb-20'>
          <Badge className='mb-6 gap-2 border-green-200 bg-green-100 px-4 py-2 text-sm font-medium text-green-700 sm:mb-8'>
            <div
              className="mask-[url('/Assets/icons/Alert-triangle.svg')] mask-no-repeat mask-center mask-contain h-4 w-4 bg-[#0A6E2A]"
              style={{
                WebkitMask:
                  "url('/Assets/icons/Alert-triangle.svg') no-repeat center / contain",
              }}
            />
            The Problem
          </Badge>
          <h3 className='text-l mb-6 px-4 font-semibold text-gray-900 sm:mb-8 sm:text-2xl md:text-3xl lg:text-3xl'>
            Issues You Can Report
          </h3>
        </div>

        {/* Desktop Layout - 3 Cards at a Time */}
        <div
          className='hidden lg:block'
          onMouseEnter={handlePause}
          onMouseLeave={handleResume}
        >
          <div className='relative overflow-hidden'>
            <div
              className={`flex transition-transform ease-linear ${
                isImmediate ? 'duration-0' : 'duration-[160ms]'
              }`}
              style={{ transform: desktopTransform }}
            >
              {infiniteProblems.map((problem, index) => (
                <div
                  key={`${problem.id}-${index}`}
                  className='w-1/3 flex-shrink-0 px-3'
                >
                  <ProblemCard problem={problem} variant='desktop' />
                </div>
              ))}
            </div>
          </div>

          {/* Desktop manual controls */}
          <div className='mt-8 flex justify-center space-x-4'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handleManualStep(-1)}
              className='border-gray-200 bg-white/80 backdrop-blur-sm hover:border-green-300 hover:bg-white'
            >
              <ChevronLeft className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handleManualStep(1)}
              className='border-gray-200 bg-white/80 backdrop-blur-sm hover:border-green-300 hover:bg-white'
            >
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>
        </div>

        {/* Mobile/Tablet Layout - Responsive Grid */}
        <div className='lg:hidden'>
          {/* Mobile - Horizontal Carousel */}
          <div
            className='sm:hidden'
            onMouseEnter={handlePause}
            onMouseLeave={handleResume}
          >
            <div className='relative overflow-hidden'>
              <div
                className={`flex transition-transform ease-linear ${
                  isImmediate ? 'duration-0' : 'duration-[160ms]'
                }`}
                style={{ transform: mobileTransform }}
              >
                {infiniteProblems.map((problem, index) => (
                  <div
                    key={`${problem.id}-${index}`}
                    className='w-full flex-shrink-0 px-2'
                  >
                    <ProblemCard problem={problem} variant='mobile' />
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Navigation Controls */}
            <div className='mt-6 flex justify-center space-x-4'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => handleManualStep(-1)}
                className='border-gray-200 bg-white/80 backdrop-blur-sm hover:border-green-300 hover:bg-white'
              >
                <ChevronLeft className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => handleManualStep(1)}
                className='border-gray-200 bg-white/80 backdrop-blur-sm hover:border-green-300 hover:bg-white'
              >
                <ChevronRight className='h-4 w-4' />
              </Button>
            </div>
          </div>

          {/* Tablet - 3 columns */}
          <div className='hidden grid-cols-3 gap-6 sm:grid md:hidden'>
            {problems.map((problem, index) => (
              <ProblemCard
                key={problem.id}
                problem={problem}
                variant='tablet'
              />
            ))}
          </div>

          {/* Medium screens - 4 columns */}
          <div className='hidden grid-cols-4 gap-4 md:grid lg:hidden'>
            {problems.map((problem, index) => (
              <ProblemCard
                key={problem.id}
                problem={problem}
                variant='medium'
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemsCards;
