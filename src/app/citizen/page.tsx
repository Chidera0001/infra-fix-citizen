'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Dynamically import the citizen dashboard content to prevent SSR/build-time evaluation
// This ensures Dexie/IndexedDB code is only loaded in the browser
const CitizenDashboardPageContent = dynamic(
  () => import('./CitizenDashboardContent'),
  {
    ssr: false,
    loading: () => <LoadingSpinner text="Loading dashboard..." />,
  }
);

export default function CitizenDashboardPage() {
  return (
    <Suspense fallback={<LoadingSpinner text="Loading..." />}>
      <CitizenDashboardPageContent />
    </Suspense>
  );
}

