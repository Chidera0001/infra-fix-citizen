'use client';

import dynamic from 'next/dynamic';

const InteractiveMap = dynamic(() => import('./InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className='flex h-full items-center justify-center'>
      <div className='text-gray-500'>Loading map...</div>
    </div>
  ),
});

export default InteractiveMap;
