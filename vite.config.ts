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
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'favicon.svg',
        'placeholder.svg',
        'Assets/logo/Trademark.png',
      ],
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
      injectManifest: {
        globPatterns: [
          '**/*.{js,css,html,ico,png,svg,jpg,jpeg,gif,webp,woff,woff2,ttf,eot}',
        ],
        // Exclude manifest icons from glob-based precaching to avoid conflicts
        globIgnores: ['**/logo/Trademark.png'],
        // Don't add revision hashes to these files (they already have them or don't need them)
        dontCacheBustURLsMatching: /\/logo\/Trademark\.png$/,
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
      },
      devOptions: {
        enabled: true,
        type: 'module',
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
