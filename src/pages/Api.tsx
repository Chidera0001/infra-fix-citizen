import { useEffect } from 'react';

const Api = () => {
  useEffect(() => {
    document.title = 'API - Citizn';
  }, []);

  return (
    <div className='flex min-h-[calc(100vh-8rem)] items-center justify-center px-4'>
      <div className='text-center'>
        <h1 className='mb-4 text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl'>
          Coming Soon
        </h1>
        <p className='text-lg text-gray-600 sm:text-xl'>
          We're working on something amazing. Check back later!
        </p>
      </div>
    </div>
  );
};

export default Api;
