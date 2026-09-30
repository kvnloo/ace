import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AceExperienceProvider } from './components/experience/AceExperienceProvider';
import './styles/tailwind.css';
import './styles/ace.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AceExperienceProvider>
      <App />
    </AceExperienceProvider>
  </React.StrictMode>
);
