import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { initializeEnvironment } from './utils/env';
import { initializeAnalytics } from './utils/analytics';
import * as serviceWorkerRegistration from './utils/serviceWorkerRegistration';

// Initialize environment validation (runs first, before anything else)
// This will throw an error if required env variables are missing
initializeEnvironment();

// Initialize performance analytics (non-blocking)
initializeAnalytics();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// Register service worker for PWA functionality
serviceWorkerRegistration.register({
  onSuccess: () => {
    console.log('PWA: Content cached for offline use');
  },
  onUpdate: (registration) => {
    console.log('PWA: New version available! Refresh to update.');

    // Optional: Show update notification to user
    if (window.confirm('A new version is available! Reload to update?')) {
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    }
  },
  onError: (error) => {
    console.error('PWA: Service worker registration failed:', error);
  },
});
