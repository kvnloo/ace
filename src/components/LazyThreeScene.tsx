import React, { useEffect, useState, useRef } from 'react';
import { useLoading } from './LoadingProvider';
import LoadingProgress from './LoadingProgress';
import PersistentThreeScene from './PersistentThreeScene';
import type { FeatureData } from '../types';

interface LazyThreeSceneProps {
  onFeatureSelect: (feature: FeatureData) => void;
}

const LazyThreeScene: React.FC<LazyThreeSceneProps> = ({ onFeatureSelect }) => {
  const { registerAsset, startLoading, markAssetLoaded, updateAssetProgress, totalCount } = useLoading();
  const [loadingComplete, setLoadingComplete] = useState(false);
  const assetsRegistered = useRef(false);

  useEffect(() => {
    // Register all assets that will be loaded
    if (assetsRegistered.current) return;
    assetsRegistered.current = true;

    // High priority assets (critical for initial render)
    registerAsset({ id: 'grass-texture-base', name: 'Grass Base Texture', type: 'texture', priority: 'high' });
    registerAsset({ id: 'grass-texture-normal', name: 'Grass Normal Map', type: 'texture', priority: 'high' });
    registerAsset({ id: 'clay-texture-base', name: 'Clay Court Texture', type: 'texture', priority: 'high' });
    registerAsset({ id: 'court-models', name: 'Court Geometries', type: 'model', priority: 'high' });
    registerAsset({ id: 'environment-map', name: 'Environment Lighting', type: 'environment', priority: 'high' });

    // Medium priority assets (important features)
    registerAsset({ id: 'wood-texture', name: 'Wood Court Texture', type: 'texture', priority: 'medium' });
    registerAsset({ id: 'concrete-texture', name: 'Concrete Texture', type: 'texture', priority: 'medium' });
    registerAsset({ id: 'building-models', name: 'Building Structures', type: 'model', priority: 'medium' });
    registerAsset({ id: 'locker-room-model', name: 'Locker Room Interior', type: 'model', priority: 'medium' });
    registerAsset({ id: 'reception-model', name: 'Reception Area', type: 'model', priority: 'medium' });
    registerAsset({ id: 'bms-model', name: 'BMS Control Room', type: 'model', priority: 'medium' });

    // Low priority assets (enhancements)
    registerAsset({ id: 'parking-lot-model', name: 'Parking Lot', type: 'model', priority: 'low' });
    registerAsset({ id: 'robotic-grass-system', name: 'Robotic Grass System', type: 'model', priority: 'low' });
    registerAsset({ id: 'transport-pods', name: 'Transport Pods', type: 'model', priority: 'low' });
    registerAsset({ id: 'hydroponics-system', name: 'Hydroponics System', type: 'model', priority: 'low' });
    registerAsset({ id: 'mechanical-rooms', name: 'Mechanical Rooms', type: 'model', priority: 'low' });

    // Start loading after registration
    startLoading();

    // Simulate progressive loading with realistic timing
    const loadAssets = async () => {
      const assetIds = [
        'grass-texture-base',
        'grass-texture-normal',
        'clay-texture-base',
        'court-models',
        'environment-map',
        'wood-texture',
        'concrete-texture',
        'building-models',
        'locker-room-model',
        'reception-model',
        'bms-model',
        'parking-lot-model',
        'robotic-grass-system',
        'transport-pods',
        'hydroponics-system',
        'mechanical-rooms',
      ];

      for (const assetId of assetIds) {
        // Simulate progressive loading
        const loadTime = Math.random() * 300 + 100; // 100-400ms per asset
        const steps = 10;

        for (let i = 0; i <= steps; i++) {
          await new Promise(resolve => setTimeout(resolve, loadTime / steps));
          updateAssetProgress(assetId, (i / steps) * 100);
        }

        markAssetLoaded(assetId);
      }
    };

    loadAssets();
  }, [registerAsset, startLoading, markAssetLoaded, updateAssetProgress]);

  const handleLoadingComplete = () => {
    setLoadingComplete(true);
  };

  return (
    <>
      {!loadingComplete && totalCount > 0 && (
        <LoadingProgress onComplete={handleLoadingComplete} />
      )}

      {/* Keep scene mounted to prevent canvas blanking */}
      <div style={{ display: loadingComplete ? 'block' : 'none' }}>
        <PersistentThreeScene onFeatureSelect={onFeatureSelect} />
      </div>
    </>
  );
};

export default LazyThreeScene;
