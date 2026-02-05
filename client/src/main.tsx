import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";
import "./index.css";

const APP_VERSION = "2.1.0";

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  console.warn("Clerk publishable key not found - auth features disabled");
}

async function checkForUpdates() {
  try {
    const response = await fetch('/api/version?t=' + Date.now(), {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' }
    });
    if (response.ok) {
      const data = await response.json();
      const storedVersion = localStorage.getItem('app_version');
      if (storedVersion && storedVersion !== data.version) {
        localStorage.setItem('app_version', data.version);
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          await Promise.all(cacheNames.map(name => caches.delete(name)));
        }
        window.location.reload();
      } else if (!storedVersion) {
        localStorage.setItem('app_version', data.version);
      }
    }
  } catch (e) {
    console.log('Version check skipped');
  }
}

checkForUpdates();

setInterval(checkForUpdates, 30000);

createRoot(document.getElementById("root")!).render(
  CLERK_PUBLISHABLE_KEY ? (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  ) : (
    <App />
  )
);
