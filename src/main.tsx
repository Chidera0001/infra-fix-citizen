import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerServiceWorker, updateServiceWorkerConfig } from './utils/serviceWorkerRegistration';
import { supabase } from './integrations/supabase/client';

// Register service worker for Background Sync (offline-first capabilities)
if ('serviceWorker' in navigator) {
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
}

createRoot(document.getElementById('root')!).render(<App />);
