import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// PWA Registration - Only in production
if ('serviceWorker' in navigator) {
  // In development, unregister any existing service workers to prevent caching issues
  if (import.meta.env.DEV) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => {
        registration.unregister();
      });
    });
  } else {
    // Only register service worker in production
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then(() => {
          // Service worker registered successfully
        })
        .catch(() => {
          // Service worker registration failed
        });
    });
  }
}

createRoot(document.getElementById('root')!).render(<App />);
