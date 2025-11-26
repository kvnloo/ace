import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * Debug asset configuration for conditional rendering
 */
export interface DebugAsset {
  /** Unique asset identifier */
  id: string;

  /** Human-readable asset name */
  name: string;

  /** Asset category for grouping */
  type: 'grass' | 'lighting' | 'characters' | 'buildings' | 'environment' | 'effects' | 'other';

  /** Whether asset is enabled (rendered) */
  enabled: boolean;

  /** Performance cost estimate (1-10, higher = more expensive) */
  performanceCost: number;

  /** Asset dependencies (must be enabled for this to work) */
  dependencies: string[];
}

/**
 * Debug context value interface
 */
interface DebugContextValue {
  /** All registered debug assets */
  assets: Map<string, DebugAsset>;

  /** Register a new debug asset */
  registerAsset: (asset: DebugAsset) => void;

  /** Toggle asset enabled state */
  toggleAsset: (id: string) => void;

  /** Check if asset is enabled */
  isAssetEnabled: (id: string) => boolean;

  /** Get total performance cost of enabled assets */
  getPerformanceCost: () => number;

  /** Enable/disable all assets */
  setAllAssets: (enabled: boolean) => void;

  /** Enable/disable assets by type */
  setAssetsByType: (type: DebugAsset['type'], enabled: boolean) => void;
}

// Export the context type for use in other components
export type DebugContext = DebugContextValue;

const DebugContextInternal = createContext<DebugContextValue | null>(null);

/**
 * Hook to access debug context
 */
export const useDebug = () => {
  const context = useContext(DebugContextInternal);
  if (!context) {
    throw new Error('useDebug must be used within DebugProvider');
  }
  return context;
};

/**
 * Debug provider component
 *
 * Manages debug asset registration and conditional rendering for performance optimization
 */
export const DebugProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<Map<string, DebugAsset>>(new Map());

  /**
   * Register a debug asset for conditional rendering
   */
  const registerAsset = useCallback((asset: DebugAsset) => {
    setAssets(prev => {
      const next = new Map(prev);
      next.set(asset.id, asset);
      return next;
    });
  }, []);

  /**
   * Toggle asset enabled state
   */
  const toggleAsset = useCallback((id: string) => {
    setAssets(prev => {
      const next = new Map(prev);
      const asset = next.get(id);
      if (asset) {
        next.set(id, { ...asset, enabled: !asset.enabled });
      }
      return next;
    });
  }, []);

  /**
   * Check if asset is enabled
   */
  const isAssetEnabled = useCallback((id: string): boolean => {
    const asset = assets.get(id);
    if (!asset) return true; // Default to enabled if not registered

    // Check dependencies
    for (const depId of asset.dependencies) {
      if (!isAssetEnabled(depId)) {
        return false;
      }
    }

    return asset.enabled;
  }, [assets]);

  /**
   * Get total performance cost of enabled assets
   */
  const getPerformanceCost = useCallback((): number => {
    let totalCost = 0;
    assets.forEach(asset => {
      if (isAssetEnabled(asset.id)) {
        totalCost += asset.performanceCost;
      }
    });
    return totalCost;
  }, [assets, isAssetEnabled]);

  /**
   * Enable/disable all assets
   */
  const setAllAssets = useCallback((enabled: boolean) => {
    setAssets(prev => {
      const next = new Map(prev);
      next.forEach((asset, id) => {
        next.set(id, { ...asset, enabled });
      });
      return next;
    });
  }, []);

  /**
   * Enable/disable assets by type
   */
  const setAssetsByType = useCallback((type: DebugAsset['type'], enabled: boolean) => {
    setAssets(prev => {
      const next = new Map(prev);
      next.forEach((asset, id) => {
        if (asset.type === type) {
          next.set(id, { ...asset, enabled });
        }
      });
      return next;
    });
  }, []);

  const value: DebugContextValue = {
    assets,
    registerAsset,
    toggleAsset,
    isAssetEnabled,
    getPerformanceCost,
    setAllAssets,
    setAssetsByType
  };

  return (
    <DebugContextInternal.Provider value={value}>
      {children}
    </DebugContextInternal.Provider>
  );
};
