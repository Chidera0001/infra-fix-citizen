'use client';

import dynamic from 'next/dynamic';

const IssueMap = dynamic(() => import('./IssueMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <div className="text-gray-500">Loading map...</div>
    </div>
  ),
});

export default IssueMap;

