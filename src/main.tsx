
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.tsx'
import './index.css'

const PUBLISHABLE_KEY = "pk_test_a25vd2luZy1tb2NjYXNpbi0zNy5jbGVyay5hY2NvdW50cy5kZXYk"

if (!PUBLISHABLE_KEY || PUBLISHABLE_KEY.includes("REPLACE")) {
  throw new Error("Missing Clerk Publishable Key - Please get your publishable key from https://dashboard.clerk.com/last-active?path=api-keys")
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <App />
  </ClerkProvider>
);
