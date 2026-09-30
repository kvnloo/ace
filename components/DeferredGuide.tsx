import React from 'react';
import { MessageSquare } from 'lucide-react';

const AIChat = React.lazy(() => import('./AIChat'));

const DeferredGuide: React.FC = () => {
  const [active, setActive] = React.useState(false);

  if (!active) {
    return (
      <button
        type="button"
        aria-label="Open ACE signal guide"
        className="ace-chat-button ace-chat-launcher"
        onClick={() => setActive(true)}
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    );
  }

  return (
    <React.Suspense
      fallback={
        <button type="button" aria-label="Loading ACE signal guide" className="ace-chat-button ace-chat-launcher" disabled>
          <MessageSquare className="w-6 h-6" />
        </button>
      }
    >
      <AIChat defaultOpen />
    </React.Suspense>
  );
};

export default DeferredGuide;
