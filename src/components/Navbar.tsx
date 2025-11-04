import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { UserPlus, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    try {
      // Sign out and wait for completion
      await signOut();
      // Navigate to home page after sign out completes
      navigate('/');
      // Close mobile menu if open
      closeMobileMenu();
    } catch (error) {
      console.warn('Sign out failed:', error);
      // Navigate to home page even if sign out fails
      navigate('/');
      closeMobileMenu();
    }
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
                className='h-[4rem] w-auto'
              />

              {/* Desktop Auth Buttons */}
              <div className='hidden items-center space-x-4 md:flex'>
                {user ? (
                  <div className='flex items-center space-x-3'>
                    {/* <span className="text-sm text-white font-medium">
											Welcome, {user?.user_metadata?.full_name || user?.email}
										</span> */}
                    <Button
                      onClick={() => navigate('/citizen')}
                      className='border-0 bg-gradient-to-r from-green-600 to-green-700 px-4 py-2 font-semibold text-white shadow-lg transition-all duration-300 hover:from-green-700 hover:to-green-800 hover:shadow-xl'
                      size='sm'
                    >
                      Dashboard
                    </Button>
                    <Button
                      onClick={handleSignOut}
                      variant='outline'
                      size='sm'
                      className='border-0 bg-gradient-to-r from-green-600 to-green-700 px-4 py-2 font-semibold text-white shadow-lg transition-all duration-300 hover:from-green-700 hover:to-green-800 hover:text-white hover:shadow-xl'
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className='flex items-center space-x-3'>
                    <Button
                      onClick={() => navigate('/auth')}
                      variant='outline'
                      size='sm'
                      className='border-0 bg-gradient-to-r from-green-600 to-green-700 px-4 py-2 font-semibold text-white shadow-lg transition-all duration-300 hover:from-green-700 hover:to-green-800 hover:text-white hover:shadow-xl'
                    >
                      Sign In
                    </Button>
                    <Button
                      onClick={() => navigate('/auth?mode=signup')}
                      className='bg-gradient-to-r from-green-600 to-green-700 font-semibold text-white shadow-lg backdrop-blur-sm hover:from-green-700 hover:to-green-800'
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

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className='mt-4 pt-4 md:hidden'>
                <div className='flex flex-col space-y-4'>
                  {/* Mobile Auth Buttons */}
                  <div className='flex flex-col space-y-3 pt-4'>
                    {user ? (
                      <>
                        <span className='text-sm font-medium text-green-700'>
                          Welcome,{' '}
                          {user?.user_metadata?.full_name || user?.email}
                        </span>
                        <Button
                          onClick={() => {
                            navigate('/citizen');
                            closeMobileMenu();
                          }}
                          className='w-full border-0 bg-gradient-to-r from-green-600 to-green-700 font-semibold text-white shadow-lg transition-all duration-300 hover:from-green-700 hover:to-green-800 hover:shadow-xl'
                          size='sm'
                        >
                          Dashboard
                        </Button>
                        <Button
                          onClick={() => {
                            handleSignOut();
                            closeMobileMenu();
                          }}
                          variant='outline'
                          size='sm'
                          className='w-full border-0 bg-gradient-to-r from-green-600 to-green-700 font-semibold text-white shadow-lg transition-all duration-300 hover:from-green-700 hover:to-green-800 hover:text-white hover:shadow-xl'
                        >
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => {
                            navigate('/auth');
                            closeMobileMenu();
                          }}
                          variant='outline'
                          size='sm'
                          className='w-full bg-gradient-to-r from-green-600 to-green-700 font-semibold text-white shadow-lg backdrop-blur-sm hover:from-green-700 hover:to-green-800 hover:text-white'
                        >
                          Sign In
                        </Button>
                        <Button
                          onClick={() => {
                            navigate('/auth?mode=signup');
                            closeMobileMenu();
                          }}
                          className='w-full bg-gradient-to-r from-green-600 to-green-700 font-semibold text-white shadow-lg backdrop-blur-sm hover:from-green-700 hover:to-green-800'
                          size='sm'
                        >
                          Get Started
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
