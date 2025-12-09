'use client';

import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { ReportGridCard } from '@/components/citizen/MyReports/ReportGridCard';
import { issuesApi, type Issue } from '@/lib/supabase-api';
import { useQuery } from '@tanstack/react-query';
import FadeInWhenVisible from '@/components/shared/FadeInWhenVisible';

const RecentIssuesSection: React.FC = () => {
  const [scrollOffset, setScrollOffset] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isImmediate, setIsImmediate] = useState(false);

  // Fetch the last 10 issues
  const { data: issues = [], isLoading } = useQuery({
    queryKey: ['recent-issues'],
    queryFn: async () => {
      const allIssues = await issuesApi.getIssues({
        limit: 10,
        sortBy: 'created_at',
        sortOrder: 'DESC',
      });
      return allIssues as Issue[];
    },
    staleTime: 30000, // 30 seconds - refresh every 30 seconds for real-time feel
    refetchInterval: 30000, // Auto-refetch every 30 seconds
  });

  // Duplicate list to keep a seamless loop
  const infiniteIssues = issues.length > 0 ? [...issues, ...issues] : [];

  useEffect(() => {
    if (isPaused || issues.length === 0) return;

    const interval = setInterval(() => {
      setScrollOffset(prev => {
        const next = prev + 0.003;
        if (next >= issues.length) {
          setIsImmediate(true);
          return next - issues.length;
        }
        return next;
      });
    }, 16); // smooth, gentle drift

    return () => clearInterval(interval);
  }, [isPaused, issues.length]);

  useEffect(() => {
    if (!isImmediate) return;
    const id = requestAnimationFrame(() => setIsImmediate(false));
    return () => cancelAnimationFrame(id);
  }, [isImmediate]);

  const desktopTransform = `translateX(-${scrollOffset * 33.33}%)`;
  const mobileTransform = `translateX(-${scrollOffset * 100}%)`;

  const handlePause = () => setIsPaused(true);
  const handleResume = () => setIsPaused(false);

  if (isLoading) {
    return (
      <section className='py-16 sm:py-20 lg:py-32'>
        <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-green-200 border-t-green-600'></div>
            <p className='mt-4 text-gray-600'>Loading recent issues...</p>
          </div>
        </div>
      </section>
    );
  }

  if (issues.length === 0) {
    return null; // Don't show section if no issues
  }

  return (
    <section className='py-16 sm:py-20 lg:py-32'>
      <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Header Section */}
        <FadeInWhenVisible>
          <div className='mb-12 text-center sm:mb-16 lg:mb-20'>
            <Badge className='mb-6 gap-2 border-green-200 bg-green-100 px-4 py-2 text-sm font-medium text-green-700 sm:mb-8'>
              <div
                className="mask-[url('/Assets/icons/Alert-triangle.svg')] mask-no-repeat mask-center mask-contain h-4 w-4 bg-[#0A6E2A]"
                style={{
                  WebkitMask:
                    "url('/Assets/icons/Alert-triangle.svg') no-repeat center / contain",
                }}
              />
              Recent Issues
            </Badge>
            <h3 className='text-l mb-6 px-4 font-semibold text-gray-900 sm:mb-8 sm:text-2xl md:text-3xl lg:text-3xl'>
              Reports from other users
            </h3>
          </div>
        </FadeInWhenVisible>

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
              {infiniteIssues.map((issue, index) => (
                <div
                  key={`${issue.id}-${index}`}
                  className='w-1/3 flex-shrink-0 px-3'
                >
                  <ReportGridCard report={issue} hideStatus hideCategory />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Layout - Horizontal Carousel */}
        <div
          className='lg:hidden'
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
              {infiniteIssues.map((issue, index) => (
                <div
                  key={`${issue.id}-${index}`}
                  className='w-full flex-shrink-0 px-2 sm:w-80 sm:px-3'
                >
                  <ReportGridCard report={issue} hideStatus hideCategory />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecentIssuesSection;
