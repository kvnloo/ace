import React, { Suspense, useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { hasWebGLSupport, getWebGLErrorMessage, checkWebGLSupport } from '../utils/webglCheck';
import type { FeatureData } from '../types';

/**
 * SafeThreeScene - Production-Ready 3D Scene Wrapper
 *
 * Provides comprehensive error handling for Three.js scenes:
 * - WebGL capability detection before initialization
 * - Error boundary for runtime 3D errors
 * - Suspense boundary for code-splitting
 * - Graceful degradation with informative fallbacks
 * - Loading states with progress indication
 *
 * Architecture:
 * 1. WebGL Check → prevents initialization on unsupported browsers
 * 2. Error Boundary → catches and displays 3D rendering errors
 * 3. Suspense → handles async component loading
 * 4. Scene Component → actual Three.js rendering
 */

interface SafeThreeSceneProps {
  onFeatureSelect: (feature: FeatureData) => void;
  fallbackMessage?: string;
  showWebGLDetails?: boolean;
}

// Lazy load the actual ThreeScene component for better bundle splitting
const ThreeScene = React.lazy(() =>
  import('./ThreeScene')
    .catch((error) => {
      console.error('Failed to load ThreeScene:', error);
      // Return a minimal component that shows the error
      return {
        default: () => (
          <div className="flex items-center justify-center h-full bg-slate-900 text-white p-8">
            <div className="max-w-md text-center">
              <h3 className="text-xl font-bold mb-4">Scene Loading Error</h3>
              <p className="text-slate-300 mb-4">
                The 3D visualization component could not be loaded.
              </p>
              <details className="text-left text-sm bg-slate-800 p-4 rounded">
                <summary className="cursor-pointer font-mono">Technical Details</summary>
                <pre className="mt-2 text-xs overflow-auto">{error.message}</pre>
              </details>
            </div>
          </div>
        )
      };
    })
);

/**
 * Loading Fallback - Shown while ThreeScene is loading
 * Popup/Modal style overlay
 */
const LoadingFallback: React.FC<{ progress?: number }> = ({ progress }) => (
  <div className="w-full h-full relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    {/* Backdrop with blur */}
    <div className="absolute inset-0 backdrop-blur-sm bg-black/40 z-40"></div>

    {/* Centered Modal Card */}
    <div className="absolute inset-0 flex items-center justify-center z-50">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all">
        {/* Animated loader */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-slate-700/30 rounded-full"></div>
          <div
            className="absolute inset-0 border-4 border-tennis-yellow rounded-full animate-spin"
            style={{
              borderTopColor: 'transparent',
              borderRightColor: 'transparent',
            }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-tennis-yellow rounded-full animate-pulse"></div>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-white mb-2 text-center">
          Loading 3D Visualization
        </h3>

        <p className="text-slate-400 mb-6 text-center text-sm">
          Initializing WebGL and rendering engine...
        </p>

        {progress !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Loading assets</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-tennis-yellow to-yellow-300 h-full transition-all duration-300 rounded-full shadow-lg"
                style={{
                  width: `${progress}%`,
                  boxShadow: '0 0 10px rgba(223, 255, 79, 0.5)'
                }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

/**
 * WebGL Not Supported Fallback
 */
const WebGLNotSupported: React.FC<{ showDetails?: boolean }> = ({ showDetails = false }) => {
  const capabilities = checkWebGLSupport();

  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-900 p-8">
      <div className="max-w-2xl text-center">
        <div className="mb-6">
          <svg
            className="w-24 h-24 mx-auto text-yellow-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h2 className="text-3xl font-bold text-white mb-4">
          3D Visualization Unavailable
        </h2>

        <p className="text-xl text-slate-300 mb-6">
          {getWebGLErrorMessage()}
        </p>

        <div className="bg-slate-800 rounded-lg p-6 text-left">
          <h3 className="text-lg font-semibold text-white mb-3">
            Recommended Solutions:
          </h3>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-start">
              <span className="text-tennis-yellow mr-2">•</span>
              <span>Update your browser to the latest version</span>
            </li>
            <li className="flex items-start">
              <span className="text-tennis-yellow mr-2">•</span>
              <span>Enable hardware acceleration in browser settings</span>
            </li>
            <li className="flex items-start">
              <span className="text-tennis-yellow mr-2">•</span>
              <span>Update your graphics drivers</span>
            </li>
            <li className="flex items-start">
              <span className="text-tennis-yellow mr-2">•</span>
              <span>Try a different browser (Chrome, Firefox, Edge)</span>
            </li>
          </ul>
        </div>

        {showDetails && (
          <details className="mt-6 text-left bg-slate-800 rounded-lg p-4">
            <summary className="cursor-pointer font-semibold text-white mb-2">
              Technical Details
            </summary>
            <div className="text-sm text-slate-400 font-mono space-y-1">
              <div>WebGL Supported: {capabilities.supported ? 'Yes' : 'No'}</div>
              <div>WebGL Version: {capabilities.version || 'N/A'}</div>
              <div>Renderer: {capabilities.renderer || 'Unknown'}</div>
              <div>Vendor: {capabilities.vendor || 'Unknown'}</div>
              <div>Max Texture Size: {capabilities.maxTextureSize || 'N/A'}</div>
              {capabilities.error && (
                <div className="text-red-400 mt-2">Error: {capabilities.error}</div>
              )}
            </div>
          </details>
        )}
      </div>
    </div>
  );
};

/**
 * Error Fallback - Shown when 3D scene crashes
 */
interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => (
  <div className="w-full h-full flex items-center justify-center bg-slate-900 p-8">
    <div className="max-w-2xl">
      <div className="bg-red-900/20 border-2 border-red-500 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-red-400 mb-4">
          3D Scene Error
        </h2>

        <p className="text-slate-300 mb-4">
          An error occurred while rendering the 3D visualization. This might be due to:
        </p>

        <ul className="list-disc list-inside text-slate-400 mb-6 space-y-1">
          <li>Graphics driver issues</li>
          <li>Insufficient GPU memory</li>
          <li>Browser compatibility problems</li>
          <li>Complex scene rendering errors</li>
        </ul>

        <details className="mb-6 bg-slate-800 rounded p-4">
          <summary className="cursor-pointer font-semibold text-white mb-2">
            Error Details
          </summary>
          <pre className="text-xs text-red-300 overflow-auto">
            {error.message}
            {error.stack && `\n\n${error.stack}`}
          </pre>
        </details>

        <button
          onClick={resetErrorBoundary}
          className="bg-tennis-yellow text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  </div>
);

/**
 * Main SafeThreeScene Component
 */
const SafeThreeScene: React.FC<SafeThreeSceneProps> = ({
  onFeatureSelect,
  fallbackMessage,
  showWebGLDetails = process.env.NODE_ENV === 'development'
}) => {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // Check WebGL support on mount
    const supported = hasWebGLSupport();
    setWebglSupported(supported);

    // Simulate loading progress for better UX
    if (supported) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90; // Stop at 90%, component load completes to 100%
          }
          return prev + 10;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, []);

  // Show loading while checking WebGL
  if (webglSupported === null) {
    return <LoadingFallback progress={0} />;
  }

  // Show WebGL not supported message
  if (!webglSupported) {
    return <WebGLNotSupported showDetails={showWebGLDetails} />;
  }

  // Render with full error handling
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
      onError={(error, errorInfo) => {
        console.error('3D Scene Error:', error);
        console.error('Error Info:', errorInfo);
      }}
    >
      <Suspense fallback={<LoadingFallback progress={loadingProgress} />}>
        <ThreeScene onFeatureSelect={onFeatureSelect} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default SafeThreeScene;
