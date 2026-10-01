import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AceExperienceProvider } from './components/experience/AceExperienceProvider';
import './styles/tailwind.css';
import './styles/ace.css';
import './styles/flow-state.css';

type BootBoundaryState = { error: Error | null };

class BootBoundary extends React.Component<{ children: React.ReactNode }, BootBoundaryState> {
  state: BootBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): BootBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error('[ACE boot]', error);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <main className="ace-boot-error" role="alert">
        <p className="ace-kicker">ACE PREVIEW · RUNTIME RECOVERY</p>
        <h1>The interface hit a startup error.</h1>
        <p>{this.state.error.message}</p>
        <button type="button" className="ace-action-primary" onClick={() => window.location.reload()}>
          Reload preview
        </button>
      </main>
    );
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BootBoundary>
      <AceExperienceProvider>
        <App />
      </AceExperienceProvider>
    </BootBoundary>
  </React.StrictMode>
);
