import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: '::',
    port: 3000,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'favicon.svg', 'placeholder.svg'],
      manifest: {
        name: 'Citizn - Infrastructure Issue Management',
        short_name: 'Citizn',
        description:
          'Empowering Nigerian citizens to build better communities through infrastructure issue reporting and management.',
        theme_color: '#10b981',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/Assets/logo/Trademark.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/Assets/logo/Trademark.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        globPatterns: [
          '**/*.{js,css,html,ico,png,svg,jpg,jpeg,gif,webp,woff,woff2,ttf,eot}',
        ],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/_/, /\/[^/?]+\.[^/]+$/],
        // Prevent caching of API calls - this fixes the PWA data issue
        runtimeCaching: [
          {
            // Only block Supabase API calls from caching
            urlPattern: ({ url }) => {
              return url.hostname.includes('supabase.co');
            },
            handler: 'NetworkOnly',
          },
          {
            // Cache Google Fonts and other CDN resources for offline use
            urlPattern: ({ url }) => {
              return url.origin.includes('googleapis.com') || 
                     url.origin.includes('gstatic.com') ||
                     url.origin.includes('unpkg.com') ||
                     url.origin.includes('jsdelivr.net');
            },
            handler: 'CacheFirst',
            options: {
              cacheName: 'cdn-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  publicDir: 'public',
  build: {
    assetsDir: 'Assets', // Use capital A to match public folder structure
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
  },
}));
