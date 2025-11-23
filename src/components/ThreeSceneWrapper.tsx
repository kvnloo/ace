/**
 * ThreeSceneWrapper Component
 *
 * Wraps ThreeScene with error handling and fallback UI.
 * Gracefully degrades to minimal building mesh if assets fail to load.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import ThreeScene from './ThreeScene';
import ErrorBoundary from './ErrorBoundary';
import FallbackUI from './FallbackUI';
import { useLoading } from './loading/LoadingProvider';
import { FeatureData } from '../types';

interface ThreeSceneWrapperProps {
  onFeatureSelect?: (feature: FeatureData | null) => void;
}

/**
 * Wrapper component for ThreeScene with error handling and fallback
 *
 * @param onFeatureSelect - Callback when a feature is selected in the scene
 */
const ThreeSceneWrapper: React.FC<ThreeSceneWrapperProps> = ({ onFeatureSelect }) => {
  const { error, fallbackMode, handleLoadingError, clearError } = useLoading();
  const [localError, setLocalError] = useState<Error | null>(null);
  const [showFallback, setShowFallback] = useState(false);

  // Monitor fallback mode from loading provider
  useEffect(() => {
    if (fallbackMode) {
      setShowFallback(true);
    }
  }, [fallbackMode]);

  // Monitor local error state
  useEffect(() => {
    if (localError) {
      setShowFallback(true);
      handleLoadingError(localError);
    }
  }, [localError, handleLoadingError]);

  const handleRetry = useCallback(() => {
    console.log('🔄 Retrying asset loading...');
    setLocalError(null);
    setShowFallback(false);
    clearError();
    // Force reload the page to retry
    window.location.reload();
  }, [clearError]);

  const handleSceneError = useCallback((error: Error) => {
    console.error('❌ ThreeScene error caught:', error);
    setLocalError(error);
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Main ThreeScene with Error Boundary */}
      <ErrorBoundary onError={handleSceneError}>
        <ThreeScene onFeatureSelect={onFeatureSelect} />
      </ErrorBoundary>

      {/* Fallback UI Overlay */}
      <AnimatePresence>
        {showFallback && (
          <FallbackUI
            error={error || localError || undefined}
            onRetry={handleRetry}
            showBuilding={true}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThreeSceneWrapper;
