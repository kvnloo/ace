/**
 * ThreeSceneWrapper Component
 *
 * Wraps ThreeScene with error handling and fallback UI.
 * Gracefully degrades to minimal building mesh if assets fail to load.
 */

import React, { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import ThreeScene from './ThreeScene';
import ErrorBoundary from './ErrorBoundary';
import FallbackUI from './FallbackUI';
import { FeatureData } from '../types';

interface ThreeSceneWrapperProps {
  onFeatureSelect?: (feature: FeatureData | null) => void;
}

/**
 * Wrapper component for ThreeScene with error handling and fallback
 * Fixed: Removed loading context dependency that was blocking rendering
 *
 * @param onFeatureSelect - Callback when a feature is selected in the scene
 */
const ThreeSceneWrapper: React.FC<ThreeSceneWrapperProps> = ({ onFeatureSelect }) => {
  const [localError, setLocalError] = useState<Error | null>(null);
  const [showFallback, setShowFallback] = useState(false);

  const handleRetry = useCallback(() => {
    console.log('🔄 Retrying 3D scene...');
    setLocalError(null);
    setShowFallback(false);
    // Force reload the page to retry
    window.location.reload();
  }, []);

  const handleSceneError = useCallback((error: Error) => {
    console.error('❌ ThreeScene error caught:', error);
    setLocalError(error);
    setShowFallback(true);
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Main ThreeScene with Error Boundary */}
      <ErrorBoundary onError={handleSceneError}>
        <ThreeScene onFeatureSelect={onFeatureSelect} />
      </ErrorBoundary>

      {/* Fallback UI Overlay - only show on actual error */}
      <AnimatePresence>
        {showFallback && localError && (
          <FallbackUI
            error={localError}
            onRetry={handleRetry}
            showBuilding={true}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThreeSceneWrapper;
