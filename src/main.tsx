
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.tsx'
import './index.css'

// TODO: Replace with your actual Clerk publishable key from dashboard
const PUBLISHABLE_KEY = "pk_test_REPLACE_WITH_YOUR_ACTUAL_PUBLISHABLE_KEY"

if (!PUBLISHABLE_KEY || PUBLISHABLE_KEY.includes("REPLACE")) {
  throw new Error("Missing Clerk Publishable Key - Please get your publishable key from https://dashboard.clerk.com/last-active?path=api-keys")
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <App />
  </ClerkProvider>
);
