/**
 * Debug utilities index
 */

// Performance Tracking
export {
  PerformanceTracker,
  getPerformanceTracker,
  disposePerformanceTracker,
  type PerformanceMetrics,
  type PerformanceDelta,
  type AssetPerformanceMetrics,
  type PerformanceReport
} from './performanceTracker';

// Asset Registry
export {
  AssetRegistry,
  assetRegistry,
  type AssetDefinition,
  type AssetType,
  type RegisteredAsset
} from './assetRegistry';

// Asset Definitions
export {
  ASSET_DEFINITIONS,
  getAssetDefinition,
  getAssetsByType,
  calculateTotalCost
} from './assetDefinitions';

// Debug Storage
export {
  saveDebugState,
  loadDebugState,
  savePreset,
  loadPreset,
  listPresets,
  deletePreset,
  clearDebugData,
  exportToFile,
  importFromFile,
  getDefaultDebugState,
  getStorageStats,
  optimizeStorage,
  StorageError,
  type DebugState,
  type AssetConfig,
} from './debugStorage';

/**
 * Quick access debug utilities
 */
export const debug = {
  /** Asset registry instance */
  assets: () => import('./assetRegistry').then(m => m.assetRegistry),

  /** Get current asset stats */
  stats: async () => {
    const { assetRegistry } = await import('./assetRegistry');
    return assetRegistry.getStats();
  },

  /** Get performance budget status */
  budget: async () => {
    const { assetRegistry } = await import('./assetRegistry');
    return assetRegistry.getBudgetStatus();
  },

  /** Export full registry state */
  export: async () => {
    const { assetRegistry } = await import('./assetRegistry');
    return assetRegistry.export();
  },

  /** List all enabled assets */
  enabled: async () => {
    const { assetRegistry } = await import('./assetRegistry');
    return assetRegistry.getEnabled().map(a => a.id);
  },

  /** List all disabled assets */
  disabled: async () => {
    const { assetRegistry } = await import('./assetRegistry');
    return assetRegistry.getDisabled().map(a => a.id);
  },

  /** Check for circular dependencies */
  validateCircular: async () => {
    const { assetRegistry } = await import('./assetRegistry');
    const cycles = assetRegistry.getCircularDependencies();
    if (cycles.length > 0) {
      console.error('[Debug] Circular dependencies found:', cycles);
      return false;
    }
    console.log('[Debug] No circular dependencies');
    return true;
  },

  /** Storage utilities */
  storage: {
    /** Save current debug state */
    save: async (state: any) => {
      const { saveDebugState } = await import('./debugStorage');
      return saveDebugState(state);
    },

    /** Load saved debug state */
    load: async () => {
      const { loadDebugState } = await import('./debugStorage');
      return loadDebugState();
    },

    /** Get storage statistics */
    stats: async () => {
      const { getStorageStats } = await import('./debugStorage');
      return getStorageStats();
    },

    /** List all presets */
    presets: async () => {
      const { listPresets } = await import('./debugStorage');
      return listPresets();
    },

    /** Export to file */
    export: async (filename?: string) => {
      const { exportToFile } = await import('./debugStorage');
      return exportToFile(filename);
    },

    /** Clear all debug data */
    clear: async () => {
      const { clearDebugData } = await import('./debugStorage');
      return clearDebugData();
    },

    /** Optimize storage */
    optimize: async () => {
      const { optimizeStorage } = await import('./debugStorage');
      return optimizeStorage();
    }
  }
};

/**
 * Expose debug utilities to window
 */
if (typeof window !== 'undefined') {
  (window as any).debug = debug;
  console.log('[Debug] Utilities available at window.debug');
}
