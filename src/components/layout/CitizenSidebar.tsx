import {
  Home,
  FileText,
  Map,
  LogOut,
  Menu,
  X,
  Camera,
  BarChart3,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import CitiznLogo from '@/components/CitiznLogo';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface CitizenSidebarProps {
  activeTab: string;
  onTabChange: (
    tab: 'dashboard' | 'reports' | 'map' | 'analytics' | 'community'
  ) => void;
}

export const CitizenSidebar = ({
  activeTab,
  onTabChange,
}: CitizenSidebarProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      // Sign out and wait for completion (includes cleanup delay)
      await signOut();
      // Wait a bit more to ensure user state is cleared and caches are cleared
      await new Promise(resolve => setTimeout(resolve, 100));
      // Navigate to home page after cleanup completes
      navigate('/');
    } catch (error) {
      console.warn('Sign out failed:', error);
      // Navigate to home page even if sign out fails
      navigate('/');
    }
  };

  const handleMenuItemClick = (tab: string) => {
    if (tab === 'report-now') {
      // Use window.location.href for full page reload to maintain user interaction context
      // This allows camera to auto-trigger on mobile
      window.location.href = '/report-now';
      setIsOpen(false);
    } else {
      onTabChange(
        tab as 'dashboard' | 'reports' | 'map' | 'analytics' | 'community'
      );
      setIsOpen(false);
    }
  };

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    {
      id: 'report-now',
      icon: Camera,
      label: 'Report Now',
      svgIcon: '/Assets/icons/camera.svg',
    },
    { id: 'reports', icon: FileText, label: 'My Reports' },
    { id: 'map', icon: Map, label: 'Map View' },
    {
      id: 'community',
      icon: Users,
      label: 'Community',
      svgIcon: '/Assets/icons/community icon.png',
    },
    {
      id: 'analytics',
      icon: BarChart3,
      label: 'Analytics',
      svgIcon: '/Assets/icons/Analytics.svg',
    },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='fixed right-4 top-4 z-50 rounded-lg border border-gray-200 bg-white p-2 shadow-lg lg:hidden'
      >
        {isOpen ? (
          <X className='h-6 w-6 text-black' />
        ) : (
          <Menu className='h-6 w-6 text-black' />
        )}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className='fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden'
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 z-40 flex h-screen w-64 transform flex-col border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out lg:sticky lg:z-auto ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} `}
      >
        {/* User Profile */}
        <div className='border-b border-gray-200 p-6'>
          <div className='flex items-center space-x-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-green-100'>
              <img
                src='/Assets/logo/Trademark.png'
                alt='Citizn Logo'
                className='h-6 w-auto'
              />
            </div>
            <div className='min-w-0 flex-1'>
              <p className='truncate text-base font-semibold text-gray-900'>
                {user?.user_metadata?.full_name || user?.email || 'User'}
              </p>
              <p className='truncate text-sm text-gray-600'>Citizen</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className='flex-1 space-y-1 overflow-y-hidden p-4'>
          {menuItems.map((item: any) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleMenuItemClick(item.id)}
                className={`flex w-full items-center space-x-3 rounded-lg px-4 py-3 transition-all duration-200 ${
                  isActive
                    ? 'bg-green-50 font-semibold text-green-700'
                    : 'text-black hover:bg-gray-50'
                }`}
              >
                {item.svgIcon ? (
                  item.svgIcon === '/Assets/icons/camera.svg' ? (
                    <svg
                      className={`h-5 w-5 ${isActive ? 'text-green-600' : 'text-gray-500'}`}
                      fill='currentColor'
                      viewBox='0 0 24 24'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path d='M4 4h7l2-2h1l2 2h7a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm8 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z' />
                    </svg>
                  ) : (
                    <img
                      src={item.svgIcon}
                      alt={item.label}
                      className={`h-5 w-5 ${isActive ? 'brightness-0 saturate-100' : 'opacity-60'}`}
                      style={
                        isActive
                          ? {
                              filter:
                                'invert(42%) sepia(93%) saturate(1352%) hue-rotate(87deg) brightness(119%) contrast(119%)',
                            }
                          : {}
                      }
                    />
                  )
                ) : (
                  <Icon
                    className={`h-5 w-5 ${isActive ? 'text-green-600' : 'text-gray-500'}`}
                  />
                )}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div
          className='space-y-2 border-t border-gray-200 p-4 pb-16'
          style={{
            paddingBottom:
              'max(4rem, calc(env(safe-area-inset-bottom) + 2rem))',
          }}
        >
          <Button
            variant='ghost'
            className='w-full justify-start text-red-600 hover:bg-red-50'
            onClick={handleSignOut}
          >
            <LogOut className='mr-3 h-5 w-5' />
            Sign Out
          </Button>
        </div>
      </div>
    </>
  );
};
