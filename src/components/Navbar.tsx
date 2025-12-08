import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentPath = location.pathname;
  const isHome = currentPath === '/';

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className='relative z-50 mb-[4rem] w-full'>
      <div className='mx-auto max-w-7xl px-4 py-0 sm:px-6 lg:px-8'>
        {/* Semi-transparent dark background with backdrop blur */}
        <div className='rounded-2xl bg-white/70 shadow-2xl backdrop-blur-md'>
          <div className='px-4 py-3 sm:px-6'>
            <div className='flex items-center justify-between'>
              {/* Logo */}
              <img
                src='/Assets/logo/Citizn-full-logo.png'
                alt='Citizn Logo'
                className='h-[4rem] w-auto cursor-pointer'
                onClick={() => navigate('/')}
              />

              {/* Desktop Navigation Links and Auth Buttons */}
              <div className='hidden items-center space-x-4 md:flex'>
                {/* Navigation Links */}
                <div className='flex items-center space-x-3'>
                  {!isHome && (
                    <Button
                      onClick={() => navigate('/')}
                      className='border-0 bg-gradient-to-r from-green-600 to-green-700 px-4 py-2 font-semibold text-white shadow-lg transition-all duration-300 hover:from-green-700 hover:to-green-800 hover:shadow-xl'
                      size='sm'
                    >
                      Home
                    </Button>
                  )}
                  {currentPath !== '/about' && (
                    <Button
                      onClick={() => navigate('/about')}
                      className='border-0 bg-gradient-to-r from-green-600 to-green-700 px-4 py-2 font-semibold text-white shadow-lg transition-all duration-300 hover:from-green-700 hover:to-green-800 hover:shadow-xl'
                      size='sm'
                    >
                      About Us
                    </Button>
                  )}
                  {currentPath !== '/api' && (
                    <Button
                      onClick={() => navigate('/api')}
                      className='border-0 bg-gradient-to-r from-green-600 to-green-700 px-4 py-2 font-semibold text-white shadow-lg transition-all duration-300 hover:from-green-700 hover:to-green-800 hover:shadow-xl'
                      size='sm'
                    >
                      API
                    </Button>
                  )}
                </div>
                {user ? (
                  <div className='flex items-center space-x-3'>
                    <Button
                      onClick={() => navigate('/citizen')}
                      className='border-0 bg-gradient-to-r from-green-600 to-green-700 px-4 py-2 font-semibold text-white shadow-lg transition-all duration-300 hover:from-green-700 hover:to-green-800 hover:shadow-xl'
                      size='sm'
                    >
                      Dashboard
                    </Button>
                  </div>
                ) : (
                  <div className='flex items-center space-x-3'>
                    <Button
                      onClick={() => navigate('/auth?mode=signup')}
                      className='border-0 bg-gradient-to-r from-green-600 to-green-700 px-4 py-2 font-semibold text-white shadow-lg transition-all duration-300 hover:from-green-700 hover:to-green-800 hover:shadow-xl'
                      size='sm'
                    >
                      Get Started
                    </Button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className='p-2 text-green-700 transition-colors duration-200 hover:text-green-500 md:hidden'
              >
                {isMobileMenuOpen ? (
                  <X className='h-6 w-6' />
                ) : (
                  <Menu className='h-6 w-6' />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay & Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
              className='fixed inset-0 z-[60] bg-black/50 md:hidden'
            />

            {/* Side Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className='fixed inset-y-0 right-0 z-[70] w-[60%] max-w-sm bg-white shadow-2xl md:hidden'
            >
              <div className='flex h-full flex-col p-6'>
                {/* Header with Close Button */}
                <div className='mb-8 flex items-center justify-end'>
                  <button
                    onClick={closeMobileMenu}
                    className='rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                  >
                    <X className='h-6 w-6' />
                  </button>
                </div>

                {/* Navigation Links List */}
                <div className='flex flex-1 flex-col space-y-6'>
                  {!isHome && (
                    <div className='border-b border-gray-100 pb-4'>
                      <button
                        onClick={() => {
                          navigate('/');
                          closeMobileMenu();
                        }}
                        className='flex w-full items-center justify-between text-lg font-medium text-gray-900'
                      >
                        Home
                      </button>
                    </div>
                  )}

                  {currentPath !== '/about' && (
                    <div className='border-b border-gray-100 pb-4'>
                      <button
                        onClick={() => {
                          navigate('/about');
                          closeMobileMenu();
                        }}
                        className='flex w-full items-center justify-between text-lg font-medium text-gray-900'
                      >
                        About Us
                      </button>
                    </div>
                  )}

                  {currentPath !== '/api' && (
                    <div className='border-b border-gray-100 pb-4'>
                      <button
                        onClick={() => {
                          navigate('/api');
                          closeMobileMenu();
                        }}
                        className='flex w-full items-center justify-between text-lg font-medium text-gray-900'
                      >
                        API
                      </button>
                    </div>
                  )}
                </div>

                {/* Footer Action Button */}
                <div className='mt-auto pt-8'>
                  {user ? (
                    <div className='flex flex-col space-y-4'>
                      <span className='text-sm font-medium text-gray-500'>
                        Logged in as{' '}
                        {user?.user_metadata?.full_name || user?.email}
                      </span>
                      <Button
                        onClick={() => {
                          navigate('/citizen');
                          closeMobileMenu();
                        }}
                        className='w-full rounded-xl bg-green-600 py-6 text-lg font-bold text-white shadow-lg hover:bg-green-700'
                      >
                        Dashboard
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => {
                        navigate('/auth?mode=signup');
                        closeMobileMenu();
                      }}
                      className='w-full rounded-xl bg-green-600 py-6 text-lg font-bold text-white shadow-lg hover:bg-green-700'
                    >
                      Get Started
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
