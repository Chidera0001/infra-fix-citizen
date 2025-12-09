/** @type {import('next').NextConfig} */
import withPWAInit from '@ducanh2912/next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: false, // Disable auto-registration in dev to prevent 404 errors
  scope: '/',
  sw: 'service-worker.js',
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [], // Add domains for external images if needed
  },
};

export default withPWA(nextConfig);
