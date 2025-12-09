import {
  HeroSection,
  FeaturesSection,
  UpvoteSection,
  LeaderboardSection,
  RecentIssuesSection,
} from '@/components/sections';
import MainLayout from '@/components/layouts/MainLayout';

export const metadata = {
  title: 'Citizn',
};

export default function HomePage() {
  return (
    <MainLayout>
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
    </MainLayout>
  );
}

