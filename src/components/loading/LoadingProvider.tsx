/**
 * Loading Provider Component
 *
 * React context provider for managing asset loading state across the application.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AssetRegistry } from '../../utils/debug/assetRegistry';
import { AssetLoader } from '../../services/loading/AssetLoader';
import { DebugContext } from '../../contexts/DebugContext';
import { LoadingState, LoadingProgress } from '../../services/loading/types';

interface LoadingAsset {
  id: string;
  name: string;
  category: string;
  loaded: boolean;
  error: boolean;
  progress: number;
}

interface LoadingContextValue {
  assets: LoadingAsset[];
  overallProgress: number;
  loadedCount: number;
  totalCount: number;
  isLoading: boolean;
  fps: number;
  currentPhase: string;
  startLoading: () => Promise<void>;
  cancelLoading: () => void;
  reportProgress: (loaded: number, total: number, currentAsset?: string) => void;
}

const LoadingContext = createContext<LoadingContextValue | null>(null);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return context;
};

interface LoadingProviderProps {
  children: ReactNode;
  registry: AssetRegistry;
  debugContext?: DebugContext;
  autoStart?: boolean;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({
  children,
  registry,
  debugContext,
  autoStart = true,
}) => {
  const [assets, setAssets] = useState<LoadingAsset[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [loadedCount, setLoadedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [fps, setFps] = useState(60);
  const [currentPhase, setCurrentPhase] = useState('Essential');
  const [loader, setLoader] = useState<AssetLoader | null>(null);

  // Define updateFromProgress before useEffect to avoid hoisting issues
  const updateFromProgress = useCallback((progress: LoadingProgress) => {
    // Update overall progress
    setOverallProgress(progress.totalProgress);
    setIsLoading(progress.state === LoadingState.LOADING);

    // Update individual asset states using functional update to avoid stale closure
    setAssets(prevAssets => {
      const updatedAssets = prevAssets.map(asset => {
        const assetProgress = progress.assets.get(asset.id);
        if (!assetProgress) return asset;

        return {
          ...asset,
          loaded: assetProgress.status === 'loaded',
          error: assetProgress.status === 'failed',
          progress: assetProgress.status === 'loaded' ? 100 :
                   assetProgress.status === 'loading' ? 50 :
                   assetProgress.status === 'failed' ? 0 : 0,
        };
      });

      // Update loaded count based on updated assets
      const loaded = updatedAssets.filter(a => a.loaded).length;
      setLoadedCount(loaded);

      return updatedAssets;
    });
  }, []);

  useEffect(() => {
    // Initialize AssetLoader
    const assetLoader = new AssetLoader(
      registry,
      debugContext || ({
        enableAsset: () => {},
        disableAsset: () => {},
      } as any),
      {
        onProgress: (progress: LoadingProgress) => {
          updateFromProgress(progress);
          // Update current phase based on actual progress percentage
          const percentage = progress.totalProgress;
          if (percentage < 25) {
            setCurrentPhase('Essential');
          } else if (percentage < 50) {
            setCurrentPhase('Core');
          } else if (percentage < 75) {
            setCurrentPhase('Visual');
          } else {
            setCurrentPhase('Enhanced');
          }
        },
        onPhaseComplete: (result) => {
          console.log(`Phase ${result.phase} complete:`, result);
          // Update phase name based on completed phase
          const phaseNames: Record<string, string> = {
            'essential': 'Core',
            'core': 'Visual',
            'visual': 'Enhanced',
            'enhanced': 'Enhanced'
          };
          const nextPhase = phaseNames[result.phase] || 'Enhanced';
          setCurrentPhase(nextPhase);
        },
      }
    );

    setLoader(assetLoader);

    // Initialize asset list from registry
    const registryAssets = registry.getAll();
    const initialAssets: LoadingAsset[] = registryAssets.map(asset => ({
      id: asset.id,
      name: asset.name,
      category: asset.type, // Use 'type' field from AssetDefinition
      loaded: false,
      error: false,
      progress: 0,
    }));

    setAssets(initialAssets);
    setTotalCount(initialAssets.length);

    // Auto-start loading if enabled
    if (autoStart) {
      setTimeout(() => {
        startLoading(assetLoader);
      }, 100);
    }
  }, [registry, debugContext, autoStart, updateFromProgress]);

  const startLoading = async (loaderInstance?: AssetLoader) => {
    const activeLoader = loaderInstance || loader;
    if (!activeLoader) {
      console.error('AssetLoader not initialized');
      return;
    }

    setIsLoading(true);

    try {
      const result = await activeLoader.start();
      console.log('Loading complete:', result);
      setIsLoading(false);
    } catch (error) {
      console.error('Loading failed:', error);
      setIsLoading(false);
    }
  };

  const cancelLoading = () => {
    if (loader) {
      loader.cancel();
      setIsLoading(false);
    }
  };

  const reportProgress = useCallback((loaded: number, total: number, currentAsset?: string) => {
    // Update overall progress based on loaded/total ratio
    const progress = total > 0 ? Math.round((loaded / total) * 100) : 0;
    setOverallProgress(progress);
    setLoadedCount(loaded);
    setTotalCount(total);

    // If currentAsset is provided, mark matching assets as loaded
    if (currentAsset) {
      setAssets(prevAssets => {
        return prevAssets.map(asset => {
          // Check if asset URL/path matches the current asset being loaded
          if (asset.id === currentAsset || asset.name === currentAsset) {
            return {
              ...asset,
              loaded: true,
              progress: 100,
            };
          }
          return asset;
        });
      });
    }
  }, []);

  const value: LoadingContextValue = {
    assets,
    overallProgress,
    loadedCount,
    totalCount,
    isLoading,
    fps,
    currentPhase,
    startLoading: () => startLoading(),
    cancelLoading,
    reportProgress,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};
