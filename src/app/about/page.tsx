'use client';

import { useEffect } from 'react';
import ProblemsCards from '@/components/shared/ProblemsCarousel';
import SolutionSection from '@/components/sections/SolutionSection';
import AboutUsSection from '@/components/sections/AboutUsSection';
import ProblemStatementSection from '@/components/sections/ProblemStatementSection';
import SDGSection from '@/components/sections/SDGSection';
import FadeInWhenVisible from '@/components/shared/FadeInWhenVisible';
import MainLayout from '@/components/layouts/MainLayout';

export default function AboutPage() {
  useEffect(() => {
    document.title = 'About - Citizn';
  }, []);

  return (
    <MainLayout>
      {/* About Us Section */}
      <AboutUsSection />

      {/* Problem Statement Section */}
      <ProblemStatementSection />

      {/* Problems Cards Section */}
      <section id='problems' className='pt-0'>
        <FadeInWhenVisible>
          <ProblemsCards />
        </FadeInWhenVisible>
      </section>

      {/* Solution Section */}
      <section id='solution'>
        <FadeInWhenVisible>
          <SolutionSection />
        </FadeInWhenVisible>
      </section>

      {/* SDG Section */}
      <SDGSection />
    </MainLayout>
  );
}

