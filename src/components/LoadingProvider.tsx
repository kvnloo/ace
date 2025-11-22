import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

export type AssetPriority = 'high' | 'medium' | 'low';

export interface AssetItem {
  id: string;
  name: string;
  type: 'texture' | 'model' | 'environment' | 'data';
  priority: AssetPriority;
  loaded: boolean;
  progress: number;
  error?: string;
}

interface LoadingContextValue {
  assets: AssetItem[];
  registerAsset: (asset: Omit<AssetItem, 'loaded' | 'progress'>) => void;
  updateAssetProgress: (id: string, progress: number) => void;
  markAssetLoaded: (id: string) => void;
  markAssetError: (id: string, error: string) => void;
  isLoading: boolean;
  overallProgress: number;
  loadedCount: number;
  totalCount: number;
  startLoading: () => void;
  finishLoading: () => void;
}

const LoadingContext = createContext<LoadingContextValue | null>(null);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return context;
};

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<AssetItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const registrationLocked = useRef(false);

  const registerAsset = useCallback((asset: Omit<AssetItem, 'loaded' | 'progress'>) => {
    if (registrationLocked.current) {
      console.warn('Asset registration locked after loading started:', asset.id);
      return;
    }

    setAssets(prev => {
      // Don't register duplicates
      if (prev.find(a => a.id === asset.id)) {
        return prev;
      }

      const newAsset: AssetItem = {
        ...asset,
        loaded: false,
        progress: 0,
      };

      // Insert by priority (high > medium > low)
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const insertIndex = prev.findIndex(
        a => priorityOrder[a.priority] > priorityOrder[newAsset.priority]
      );

      if (insertIndex === -1) {
        return [...prev, newAsset];
      }

      return [
        ...prev.slice(0, insertIndex),
        newAsset,
        ...prev.slice(insertIndex),
      ];
    });
  }, []);

  const updateAssetProgress = useCallback((id: string, progress: number) => {
    setAssets(prev =>
      prev.map(asset =>
        asset.id === id ? { ...asset, progress: Math.min(100, Math.max(0, progress)) } : asset
      )
    );
  }, []);

  const markAssetLoaded = useCallback((id: string) => {
    setAssets(prev =>
      prev.map(asset =>
        asset.id === id ? { ...asset, loaded: true, progress: 100 } : asset
      )
    );
  }, []);

  const markAssetError = useCallback((id: string, error: string) => {
    setAssets(prev =>
      prev.map(asset =>
        asset.id === id ? { ...asset, error, loaded: true, progress: 100 } : asset
      )
    );
  }, []);

  const startLoading = useCallback(() => {
    setIsLoading(true);
    registrationLocked.current = true;
  }, []);

  const finishLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Calculate overall progress
  const overallProgress = assets.length > 0
    ? assets.reduce((sum, asset) => sum + asset.progress, 0) / assets.length
    : 0;

  const loadedCount = assets.filter(a => a.loaded).length;
  const totalCount = assets.length;

  const value: LoadingContextValue = {
    assets,
    registerAsset,
    updateAssetProgress,
    markAssetLoaded,
    markAssetError,
    isLoading,
    overallProgress,
    loadedCount,
    totalCount,
    startLoading,
    finishLoading,
  };

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
};
