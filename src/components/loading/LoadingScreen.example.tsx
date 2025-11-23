/**
 * LoadingScreen Example
 * Demonstrates all features and states of the premium loading screen
 */

import React, { useState, useEffect } from 'react';
import { LoadingProvider, useLoading } from '../LoadingProvider';
import LoadingScreen from './LoadingScreen';

// Mock asset data for demonstration
const mockAssets = [
  { id: '1', name: 'Tennis Court Textures', type: 'texture' as const, priority: 'high' as const },
  { id: '2', name: '3D Models - Court', type: 'model' as const, priority: 'high' as const },
  { id: '3', name: 'Environment HDRI', type: 'environment' as const, priority: 'high' as const },
  { id: '4', name: 'Clay Court Shader', type: 'texture' as const, priority: 'medium' as const },
  { id: '5', name: 'Player Character Model', type: 'model' as const, priority: 'medium' as const },
  { id: '6', name: 'Equipment Models', type: 'model' as const, priority: 'medium' as const },
  { id: '7', name: 'Weather System Data', type: 'data' as const, priority: 'low' as const },
  { id: '8', name: 'Audio Assets', type: 'data' as const, priority: 'low' as const },
];

/**
 * Simulated Loading Demo
 */
function LoadingDemo() {
  const { registerAsset, updateAssetProgress, markAssetLoaded, startLoading, finishLoading } = useLoading();
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Register all assets
    mockAssets.forEach((asset) => {
      registerAsset(asset);
    });

    // Start loading simulation
    startLoading();

    // Simulate progressive loading
    const loadAssets = async () => {
      for (const asset of mockAssets) {
        // Simulate loading progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          updateAssetProgress(asset.id, progress);
        }

        // Mark as loaded
        markAssetLoaded(asset.id);
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      // Finish loading
      setTimeout(() => {
        finishLoading();
      }, 500);
    };

    loadAssets();
  }, []);

  if (isComplete) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            ✅ Loading Complete!
          </h1>
          <p className="text-gray-200 mb-8">
            The loading screen has finished successfully
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
          >
            Reload Demo
          </button>
        </div>
      </div>
    );
  }

  return (
    <LoadingScreen
      onComplete={() => setIsComplete(true)}
      minimumDisplayTime={2000}
      showFPSMonitor={true}
      qualityMode="auto"
    />
  );
}

/**
 * Example: Basic Usage
 */
export function BasicExample() {
  return (
    <LoadingProvider>
      <LoadingDemo />
    </LoadingProvider>
  );
}

/**
 * Example: High Performance Mode
 */
export function HighPerformanceExample() {
  return (
    <LoadingProvider>
      <LoadingScreen
        showFPSMonitor={true}
        qualityMode="high"
        minimumDisplayTime={1000}
      />
    </LoadingProvider>
  );
}

/**
 * Example: Reduced Motion (Accessibility)
 */
export function ReducedMotionExample() {
  return (
    <LoadingProvider>
      <LoadingScreen
        accessibility={{
          reducedMotion: true,
          highContrast: true,
          screenReaderAnnouncements: true,
        }}
      />
    </LoadingProvider>
  );
}

/**
 * Example: Custom Theme
 */
export function CustomThemeExample() {
  return (
    <LoadingProvider>
      <LoadingScreen
        theme={{
          primary: '#10b981',
          secondary: '#8b5cf6',
          accent: '#f59e0b',
          background: 'rgba(15, 23, 42, 0.9)',
        }}
      />
    </LoadingProvider>
  );
}

/**
 * Example: Minimal (No FPS Monitor)
 */
export function MinimalExample() {
  return (
    <LoadingProvider>
      <LoadingScreen
        showFPSMonitor={false}
        minimumDisplayTime={1500}
      />
    </LoadingProvider>
  );
}

/**
 * Main Example Component
 */
export default function LoadingScreenExamples() {
  const [activeExample, setActiveExample] = useState('basic');

  const examples = {
    basic: { component: BasicExample, label: 'Basic Usage' },
    highPerf: { component: HighPerformanceExample, label: 'High Performance' },
    reduced: { component: ReducedMotionExample, label: 'Reduced Motion' },
    theme: { component: CustomThemeExample, label: 'Custom Theme' },
    minimal: { component: MinimalExample, label: 'Minimal' },
  };

  const ActiveComponent = examples[activeExample as keyof typeof examples].component;

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Example Selector */}
      <div className="fixed top-0 left-0 right-0 bg-slate-800 border-b border-slate-700 z-50">
        <div className="container mx-auto px-4 py-4">
          <h2 className="text-white font-bold mb-3">Loading Screen Examples</h2>
          <div className="flex gap-2 flex-wrap">
            {Object.entries(examples).map(([key, { label }]) => (
              <button
                key={key}
                onClick={() => setActiveExample(key)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  activeExample === key
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-700 text-gray-100 hover:bg-slate-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Example */}
      <div className="pt-24">
        <ActiveComponent />
      </div>
    </div>
  );
}
