import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { FooterSection } from '@/components/sections';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50'>
      {/* Navbar - Only show on non-home pages */}
      {!isHomePage && (
        <div className='px-4 pt-4 sm:px-6 sm:pt-8 lg:px-8'>
          <Navbar />
        </div>
      )}

      {/* Page Content */}
      <main>{children}</main>

      {/* Footer */}
      <FooterSection />
    </div>
  );
};

export default MainLayout;
