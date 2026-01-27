import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const APP_VERSION = "2.1.0";

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

createRoot(document.getElementById("root")!).render(<App />);
