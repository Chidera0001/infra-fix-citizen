import { createRoot } from 'react-dom/client';
import { inject } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';
import App from './App.tsx';
import './index.css';
import {
  registerServiceWorker,
  updateServiceWorkerConfig,
} from './utils/serviceWorkerRegistration';
import { supabase } from './integrations/supabase/client';

// Initialize Vercel Web Analytics
inject();

// Initialize Vercel Speed Insights
injectSpeedInsights();

// Register service worker for Background Sync (offline-first capabilities)
const shouldRegisterServiceWorker =
  import.meta.env.PROD || import.meta.env.VITE_ENABLE_SW === 'true';

if (shouldRegisterServiceWorker && 'serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await registerServiceWorker();
      
      if (registration) {
        // Update config when auth state changes
        supabase.auth.onAuthStateChange(async () => {
          await updateServiceWorkerConfig(registration);
        });

        // Also update config periodically to refresh auth token
        setInterval(async () => {
          await updateServiceWorkerConfig(registration);
        }, 5 * 60 * 1000); // Every 5 minutes
      }
    } catch (error) {
      console.error('Failed to register service worker:', error);
    }
  });
} else {
  console.info(
    'Skipping service worker registration (development mode). Set VITE_ENABLE_SW=true to override.'
  );
}

createRoot(document.getElementById('root')!).render(<App />);
