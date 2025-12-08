import { useEffect } from 'react';
import {
  HeroSection,
  FeaturesSection,
  UpvoteSection,
  LeaderboardSection,
  RecentIssuesSection,
} from '@/components/sections';

const Index = () => {
  useEffect(() => {
    document.title = 'Citizn';
  }, []);

  return (
    <>
      {/* Hero Section with video background and stats */}
      <HeroSection />

      {/* Features Section - How Citizn Works */}
      <FeaturesSection />

      {/* Upvote Section */}
      <UpvoteSection />

      {/* Leaderboard Section */}
      <LeaderboardSection />

      {/* Recent Issues Section */}
      <RecentIssuesSection />
    </>
  );
};

export default Index;
