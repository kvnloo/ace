import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { DebugProvider } from './contexts/DebugContext';
import { LoadingProvider } from './components/loading/LoadingProvider';
import { AssetRegistry } from './utils/debug/assetRegistry';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Get singleton asset registry instance
const assetRegistry = AssetRegistry.getInstance();

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <DebugProvider>
      <LoadingProvider registry={assetRegistry} autoStart={true}>
        <App />
      </LoadingProvider>
    </DebugProvider>
  </React.StrictMode>
);