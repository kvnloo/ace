/**
 * DebugPanel Usage Example
 *
 * This file demonstrates how to integrate the DebugPanel into your 3D application.
 */

import React, { useState } from 'react';
import DebugPanel from './DebugPanel';
import type { Asset3D } from './types';

/**
 * Example: Basic DebugPanel integration
 */
export const BasicDebugPanelExample: React.FC = () => {
  // Define your 3D assets with performance metadata
  const [assets, setAssets] = useState<Asset3D[]>([
    {
      id: 'lighting',
      name: 'Scene Lighting',
      enabled: true,
      performanceCost: 'low',
      dependencies: [],
      renderTime: 1.2,
      memoryUsage: 2.5
    },
    {
      id: 'environment',
      name: 'Environment Map',
      enabled: true,
      performanceCost: 'medium',
      dependencies: ['lighting'],
      renderTime: 3.5,
      memoryUsage: 15.2
    },
    {
      id: 'characters',
      name: 'Character Models',
      enabled: true,
      performanceCost: 'high',
      dependencies: ['lighting', 'environment'],
      renderTime: 8.2,
      memoryUsage: 45.6
    },
    {
      id: 'particles',
      name: 'Particle Effects',
      enabled: false,
      performanceCost: 'high',
      dependencies: ['lighting'],
      renderTime: 12.5,
      memoryUsage: 25.3
    },
    {
      id: 'post-processing',
      name: 'Post Processing',
      enabled: true,
      performanceCost: 'medium',
      dependencies: [],
      renderTime: 4.1,
      memoryUsage: 8.7
    }
  ]);

  // Handle asset toggle
  const handleAssetToggle = (assetId: string, enabled: boolean) => {
    console.log(`Asset ${assetId} ${enabled ? 'enabled' : 'disabled'}`);

    // Update asset state
    setAssets(prev =>
      prev.map(asset =>
        asset.id === assetId ? { ...asset, enabled } : asset
      )
    );

    // Here you would typically:
    // 1. Update your 3D scene to enable/disable the asset
    // 2. Update rendering pipeline
    // 3. Recalculate performance metrics
  };

  // Handle preset application
  const handlePresetApply = (presetId: string) => {
    console.log(`Applying preset: ${presetId}`);

    // Custom logic for different presets
    switch (presetId) {
      case 'baseline':
        // Disable all assets for baseline measurement
        setAssets(prev => prev.map(a => ({ ...a, enabled: false })));
        break;

      case 'production':
        // Enable recommended production assets
        setAssets(prev =>
          prev.map(a => ({
            ...a,
            enabled: !['particles'].includes(a.id)
          }))
        );
        break;

      case 'performance-test':
        // Enable everything for stress testing
        setAssets(prev => prev.map(a => ({ ...a, enabled: true })));
        break;
    }
  };

  return (
    <div className="relative w-full h-screen bg-slate-950">
      {/* Your 3D Scene Here */}
      <div className="absolute inset-0">
        {/* Example: Three.js canvas, R3F, etc. */}
        <div className="flex items-center justify-center h-full text-white">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">3D Scene</h1>
            <p className="text-slate-400">
              Press the debug icon (bottom-right) or Ctrl+Shift+D to open the debug panel
            </p>
          </div>
        </div>
      </div>

      {/* Debug Panel Overlay */}
      <DebugPanel
        assets={assets}
        onAssetToggle={handleAssetToggle}
        onPresetApply={handlePresetApply}
      />
    </div>
  );
};

/**
 * Example: Integration with React Three Fiber
 */
export const R3FDebugPanelExample: React.FC = () => {
  const [debugAssets, setDebugAssets] = useState<Asset3D[]>([
    {
      id: 'directional-light',
      name: 'Directional Light',
      enabled: true,
      performanceCost: 'low',
      dependencies: []
    },
    {
      id: 'ambient-light',
      name: 'Ambient Light',
      enabled: true,
      performanceCost: 'low',
      dependencies: []
    },
    {
      id: 'shadows',
      name: 'Shadow Mapping',
      enabled: true,
      performanceCost: 'high',
      dependencies: ['directional-light']
    },
    {
      id: 'reflections',
      name: 'Real-time Reflections',
      enabled: false,
      performanceCost: 'high',
      dependencies: ['ambient-light']
    }
  ]);

  return (
    <div className="w-full h-screen">
      {/* Canvas with conditional rendering based on debugAssets */}
      {/*
      <Canvas>
        {debugAssets.find(a => a.id === 'directional-light')?.enabled && (
          <directionalLight position={[10, 10, 5]} />
        )}
        {debugAssets.find(a => a.id === 'ambient-light')?.enabled && (
          <ambientLight intensity={0.5} />
        )}
        {debugAssets.find(a => a.id === 'shadows')?.enabled && (
          <meshStandardMaterial shadowMap={true} />
        )}
      </Canvas>
      */}

      <DebugPanel
        assets={debugAssets}
        onAssetToggle={(id, enabled) => {
          setDebugAssets(prev =>
            prev.map(a => (a.id === id ? { ...a, enabled } : a))
          );
        }}
      />
    </div>
  );
};

/**
 * Example: Custom preset with specific asset configurations
 */
export const CustomPresetExample: React.FC = () => {
  const assets: Asset3D[] = [
    {
      id: 'grass',
      name: 'Grass Simulation',
      enabled: false,
      performanceCost: 'high',
      dependencies: ['lighting']
    },
    {
      id: 'water',
      name: 'Water Shader',
      enabled: false,
      performanceCost: 'high',
      dependencies: ['lighting', 'reflections']
    },
    {
      id: 'lighting',
      name: 'Dynamic Lighting',
      enabled: true,
      performanceCost: 'medium',
      dependencies: []
    },
    {
      id: 'reflections',
      name: 'Screen-Space Reflections',
      enabled: false,
      performanceCost: 'medium',
      dependencies: ['lighting']
    }
  ];

  // Custom preset handler
  const handleCustomPreset = (presetId: string) => {
    if (presetId === 'outdoor-scene') {
      // Enable grass, water, and lighting but not reflections
      return {
        grass: true,
        water: true,
        lighting: true,
        reflections: false
      };
    }
    if (presetId === 'performance-mode') {
      // Only basic lighting
      return {
        grass: false,
        water: false,
        lighting: true,
        reflections: false
      };
    }
  };

  return (
    <DebugPanel
      assets={assets}
      onPresetApply={handleCustomPreset}
    />
  );
};

export default BasicDebugPanelExample;
