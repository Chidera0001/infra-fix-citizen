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
      'Major roads across Nigeria suffer from severe potholes, broken surfaces, and inadequate maintenance, causing vehicle damage, accidents, and traffic congestion that affects daily commutes and economic activities.',
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
      'Non-functional street lights create safety hazards and security concerns in Nigerian communities, leading to increased crime rates, limited nighttime activities, and pedestrian safety issues that affect the overall quality of life.',
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
      'Inadequate drainage infrastructure leads to flooding during rainy seasons, property damage, and health risks from stagnant water, affecting the quality of life in many Nigerian communities.',
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
      'Inconsistent water supply and poor water infrastructure affect millions of Nigerians, leading to water scarcity, health risks, and economic challenges that impact daily life and business operations.',
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
      'Malfunctioning traffic lights and poor traffic management systems cause confusion, accidents, and traffic congestion, creating dangerous conditions for motorists and pedestrians across Nigerian cities.',
    image: '/Assets/Images/Traffic-light.webp',
    impacts: [
      'Increased traffic accidents',
      'Traffic congestion and delays',
      'Pedestrian safety concerns',
    ],
  },
];

const ProblemsCards: React.FC = () => {
  const [activeCard, setActiveCard] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Create duplicated array for infinite loop (duplicate all cards)
  const infiniteProblems = [...problems, ...problems];

  const nextCard = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveCard(prev => prev + 1);
  };

  const prevCard = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveCard(prev => prev - 1);
  };

  // Handle infinite loop transitions
  useEffect(() => {
    if (!isTransitioning) return;

    const timer = setTimeout(() => {
      if (activeCard >= problems.length) {
        // Reset to beginning without transition
        setActiveCard(activeCard - problems.length);
      } else if (activeCard < 0) {
        // Reset to end without transition
        setActiveCard(activeCard + problems.length);
      }
      setIsTransitioning(false);
    }, 700); // Match transition duration

    return () => clearTimeout(timer);
  }, [activeCard, isTransitioning]);

  // Calculate transform for desktop (3 cards at a time)
  const getDesktopTransform = () => {
    return `translateX(-${activeCard * 33.33}%)`;
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || isTransitioning) return;

    const interval = setInterval(() => {
      nextCard();
    }, 4000); // Change card every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, isTransitioning]);

  // Pause auto-play on user interaction
  const handleUserInteraction = () => {
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds of no interaction
    setTimeout(() => setIsAutoPlaying(true), 10000);
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
            The Problems We Face
          </Badge>
          <h3 className='text-l mb-6 px-4 font-semibold text-gray-900 sm:mb-8 sm:text-2xl md:text-3xl lg:text-3xl'>
            Infrastructure Issues Affecting Nigerian Communities
          </h3>
        </div>

        {/* Desktop Layout - 3 Cards at a Time */}
        <div className='hidden lg:block'>
          <div className='relative overflow-hidden'>
            <div
              className={`flex ${isTransitioning ? 'transition-transform duration-700 ease-in-out' : ''}`}
              style={{ transform: getDesktopTransform() }}
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

          {/* Desktop Navigation Controls */}
          <div className='mt-8 flex justify-center space-x-4'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => {
                prevCard();
                handleUserInteraction();
              }}
              className='border-gray-200 bg-white/80 backdrop-blur-sm hover:border-green-300 hover:bg-white'
            >
              <ChevronLeft className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => {
                nextCard();
                handleUserInteraction();
              }}
              className='border-gray-200 bg-white/80 backdrop-blur-sm hover:border-green-300 hover:bg-white'
            >
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>
        </div>

        {/* Mobile/Tablet Layout - Responsive Grid */}
        <div className='lg:hidden'>
          {/* Mobile - Horizontal Carousel */}
          <div className='sm:hidden'>
            <div className='relative overflow-hidden'>
              <div
                className='flex transition-transform duration-500 ease-in-out'
                style={{ transform: `translateX(-${activeCard * 100}%)` }}
              >
                {problems.map((problem, index) => (
                  <div key={problem.id} className='w-full flex-shrink-0 px-2'>
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
                onClick={() => {
                  prevCard();
                  handleUserInteraction();
                }}
                className='border-gray-200 bg-white/80 backdrop-blur-sm hover:border-green-300 hover:bg-white'
              >
                <ChevronLeft className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => {
                  nextCard();
                  handleUserInteraction();
                }}
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
