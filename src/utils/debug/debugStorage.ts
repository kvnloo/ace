/**
 * Debug Storage Utility
 *
 * Provides localStorage persistence for debug settings with:
 * - Data compression to reduce storage usage
 * - Schema versioning and migration
 * - Robust error handling
 * - Import/export functionality
 */

import { LogEntry } from '../../types/debug';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Asset configuration for debug presets
 */
export interface AssetConfig {
  id: string;
  name: string;
  description?: string;
  settings: {
    performance?: {
      showFPS?: boolean;
      showMemory?: boolean;
      showFrameTime?: boolean;
      targetFPS?: number;
    };
    logging?: {
      maxLogs?: number;
      persistLogs?: boolean;
      logLevels?: Array<'error' | 'warn' | 'info' | 'debug'>;
    };
    rendering?: {
      wireframe?: boolean;
      helpers?: boolean;
      stats?: boolean;
      shadows?: boolean;
      antialias?: boolean;
    };
    camera?: {
      fov?: number;
      near?: number;
      far?: number;
      position?: [number, number, number];
    };
  };
  metadata?: {
    createdAt?: number;
    updatedAt?: number;
    author?: string;
    tags?: string[];
  };
}

/**
 * Complete debug state
 */
export interface DebugState {
  version: number;
  enabled: boolean;
  activePreset?: string;
  customPresets: Record<string, AssetConfig>;
  recentLogs: LogEntry[];
  performance: {
    showPerformance: boolean;
    maxLogs: number;
    persistLogs: boolean;
  };
  lastUpdated: number;
}

// ============================================================================
// Constants
// ============================================================================

const STORAGE_KEYS = {
  DEBUG_STATE: 'ace_debug_state',
  PRESETS: 'ace_debug_presets',
  LOGS: 'ace_debug_logs',
} as const;

const CURRENT_VERSION = 1;
const COMPRESSION_THRESHOLD = 1024; // Compress if > 1KB

// ============================================================================
// Compression Utilities
// ============================================================================

/**
 * Simple LZ-based compression for JSON data
 * Uses browser's native TextEncoder/TextDecoder with basic compression
 */
function compressData(data: string): string {
  if (data.length < COMPRESSION_THRESHOLD) {
    return data; // Don't compress small data
  }

  try {
    // Simple run-length encoding for repeated patterns
    const compressed = data.replace(/(.)\1{2,}/g, (match, char) => {
      return `${char}*${match.length}*`;
    });

    // Base64 encode to ensure safe storage
    return btoa(compressed);
  } catch (error) {
    console.warn('Compression failed, using raw data:', error);
    return data;
  }
}

/**
 * Decompress data
 */
function decompressData(data: string): string {
  try {
    // Try to decode base64
    const decoded = atob(data);

    // Expand run-length encoded patterns
    const decompressed = decoded.replace(/(.)\*(\d+)\*/g, (match, char, count) => {
      return char.repeat(parseInt(count, 10));
    });

    return decompressed;
  } catch (error) {
    // If decompression fails, assume it's raw data
    return data;
  }
}

// ============================================================================
// Storage Error Handling
// ============================================================================

class StorageError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'StorageError';
  }
}

/**
 * Check if localStorage is available and has space
 */
function checkStorageAvailability(): { available: boolean; error?: string } {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return { available: true };
  } catch (error) {
    if (error instanceof DOMException) {
      if (error.name === 'QuotaExceededError') {
        return {
          available: false,
          error: 'Storage quota exceeded. Please free up space.'
        };
      }
      if (error.name === 'SecurityError') {
        return {
          available: false,
          error: 'localStorage is disabled in private browsing mode.'
        };
      }
    }
    return {
      available: false,
      error: 'localStorage is not available.'
    };
  }
}

/**
 * Safely get item from localStorage with error handling
 */
function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`Failed to get item "${key}" from localStorage:`, error);
    return null;
  }
}

/**
 * Safely set item to localStorage with error handling
 */
function safeSetItem(key: string, value: string): boolean {
  const check = checkStorageAvailability();
  if (!check.available) {
    console.error(check.error);
    return false;
  }

  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.error('Storage quota exceeded. Attempting cleanup...');

      // Try to clean up old data
      try {
        const state = loadDebugState();
        if (state) {
          // Keep only recent logs
          state.recentLogs = state.recentLogs.slice(0, 50);
          const serialized = JSON.stringify(state);
          const compressed = compressData(serialized);
          localStorage.setItem(key, compressed);
          return true;
        }
      } catch (cleanupError) {
        console.error('Cleanup failed:', cleanupError);
      }
    }
    console.error(`Failed to set item "${key}" to localStorage:`, error);
    return false;
  }
}

// ============================================================================
// Schema Versioning & Migration
// ============================================================================

/**
 * Migrate debug state from older versions
 */
function migrateDebugState(oldState: any): DebugState {
  // Version 0 -> Version 1
  if (!oldState.version || oldState.version === 0) {
    return {
      version: CURRENT_VERSION,
      enabled: oldState.enabled ?? true,
      activePreset: oldState.activePreset,
      customPresets: oldState.customPresets ?? {},
      recentLogs: oldState.recentLogs ?? [],
      performance: {
        showPerformance: oldState.showPerformance ?? true,
        maxLogs: oldState.maxLogs ?? 100,
        persistLogs: oldState.persistLogs ?? true,
      },
      lastUpdated: Date.now(),
    };
  }

  // Already current version
  return oldState as DebugState;
}

/**
 * Validate debug state structure
 */
function validateDebugState(state: any): state is DebugState {
  return (
    typeof state === 'object' &&
    typeof state.version === 'number' &&
    typeof state.enabled === 'boolean' &&
    typeof state.customPresets === 'object' &&
    Array.isArray(state.recentLogs) &&
    typeof state.performance === 'object' &&
    typeof state.lastUpdated === 'number'
  );
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Save complete debug state to localStorage
 */
export function saveDebugState(state: DebugState): boolean {
  try {
    const stateWithTimestamp = {
      ...state,
      version: CURRENT_VERSION,
      lastUpdated: Date.now(),
    };

    const serialized = JSON.stringify(stateWithTimestamp);
    const compressed = compressData(serialized);

    return safeSetItem(STORAGE_KEYS.DEBUG_STATE, compressed);
  } catch (error) {
    console.error('Failed to save debug state:', error);
    return false;
  }
}

/**
 * Load debug state from localStorage
 */
export function loadDebugState(): DebugState | null {
  try {
    const compressed = safeGetItem(STORAGE_KEYS.DEBUG_STATE);
    if (!compressed) {
      return null;
    }

    const decompressed = decompressData(compressed);
    const parsed = JSON.parse(decompressed);

    // Validate structure
    if (!validateDebugState(parsed)) {
      console.warn('Invalid debug state structure, migrating...');
      return migrateDebugState(parsed);
    }

    // Migrate if needed
    if (parsed.version < CURRENT_VERSION) {
      const migrated = migrateDebugState(parsed);
      saveDebugState(migrated); // Save migrated version
      return migrated;
    }

    return parsed;
  } catch (error) {
    console.error('Failed to load debug state:', error);
    return null;
  }
}

/**
 * Save a custom preset
 */
export function savePreset(name: string, config: AssetConfig): boolean {
  try {
    const state = loadDebugState() || getDefaultDebugState();

    const preset: AssetConfig = {
      ...config,
      id: config.id || `preset_${Date.now()}`,
      name,
      metadata: {
        ...config.metadata,
        updatedAt: Date.now(),
        createdAt: config.metadata?.createdAt || Date.now(),
      },
    };

    state.customPresets[name] = preset;
    state.lastUpdated = Date.now();

    return saveDebugState(state);
  } catch (error) {
    console.error('Failed to save preset:', error);
    return false;
  }
}

/**
 * Load a preset by name
 */
export function loadPreset(name: string): AssetConfig | null {
  try {
    const state = loadDebugState();
    if (!state) {
      return null;
    }

    return state.customPresets[name] || null;
  } catch (error) {
    console.error('Failed to load preset:', error);
    return null;
  }
}

/**
 * List all custom preset names
 */
export function listPresets(): string[] {
  try {
    const state = loadDebugState();
    if (!state) {
      return [];
    }

    return Object.keys(state.customPresets);
  } catch (error) {
    console.error('Failed to list presets:', error);
    return [];
  }
}

/**
 * Delete a preset by name
 */
export function deletePreset(name: string): boolean {
  try {
    const state = loadDebugState();
    if (!state) {
      return false;
    }

    if (state.customPresets[name]) {
      delete state.customPresets[name];
      state.lastUpdated = Date.now();

      // If this was the active preset, clear it
      if (state.activePreset === name) {
        state.activePreset = undefined;
      }

      return saveDebugState(state);
    }

    return false;
  } catch (error) {
    console.error('Failed to delete preset:', error);
    return false;
  }
}

/**
 * Clear all debug data from localStorage
 */
export function clearDebugData(): boolean {
  try {
    localStorage.removeItem(STORAGE_KEYS.DEBUG_STATE);
    localStorage.removeItem(STORAGE_KEYS.PRESETS);
    localStorage.removeItem(STORAGE_KEYS.LOGS);
    return true;
  } catch (error) {
    console.error('Failed to clear debug data:', error);
    return false;
  }
}

/**
 * Export debug state to downloadable JSON file
 */
export function exportToFile(filename: string = 'debug-state'): void {
  try {
    const state = loadDebugState();
    if (!state) {
      throw new StorageError('No debug state to export', 'NO_DATA');
    }

    const exportData = {
      exportedAt: new Date().toISOString(),
      version: CURRENT_VERSION,
      state,
    };

    const blob = new Blob(
      [JSON.stringify(exportData, null, 2)],
      { type: 'application/json' }
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export debug state:', error);
    throw error;
  }
}

/**
 * Import debug state from JSON file
 */
export async function importFromFile(file: File): Promise<DebugState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        // Validate export format
        if (!parsed.state || !parsed.version) {
          throw new StorageError(
            'Invalid export file format',
            'INVALID_FORMAT'
          );
        }

        // Migrate if needed
        let state = parsed.state;
        if (parsed.version < CURRENT_VERSION) {
          state = migrateDebugState(state);
        }

        // Validate structure
        if (!validateDebugState(state)) {
          throw new StorageError(
            'Invalid debug state structure in file',
            'INVALID_STATE'
          );
        }

        // Save imported state
        const success = saveDebugState(state);
        if (!success) {
          throw new StorageError(
            'Failed to save imported state',
            'SAVE_FAILED'
          );
        }

        resolve(state);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new StorageError('Failed to read file', 'READ_ERROR'));
    };

    reader.readAsText(file);
  });
}

/**
 * Get default debug state
 */
export function getDefaultDebugState(): DebugState {
  return {
    version: CURRENT_VERSION,
    enabled: true,
    customPresets: {},
    recentLogs: [],
    performance: {
      showPerformance: true,
      maxLogs: 100,
      persistLogs: true,
    },
    lastUpdated: Date.now(),
  };
}

/**
 * Get storage usage statistics
 */
export function getStorageStats(): {
  used: number;
  available: boolean;
  quotaExceeded: boolean;
  stateSize: number;
  presetsCount: number;
  logsCount: number;
} {
  const check = checkStorageAvailability();
  const state = loadDebugState();

  let stateSize = 0;
  if (state) {
    const serialized = JSON.stringify(state);
    stateSize = new Blob([serialized]).size;
  }

  return {
    used: stateSize,
    available: check.available,
    quotaExceeded: check.error?.includes('quota') || false,
    stateSize,
    presetsCount: state ? Object.keys(state.customPresets).length : 0,
    logsCount: state ? state.recentLogs.length : 0,
  };
}

/**
 * Optimize storage by removing old logs and compressing data
 */
export function optimizeStorage(): boolean {
  try {
    const state = loadDebugState();
    if (!state) {
      return false;
    }

    // Keep only last 50 logs
    state.recentLogs = state.recentLogs.slice(0, 50);

    // Remove old presets (older than 90 days)
    const ninetyDaysAgo = Date.now() - (90 * 24 * 60 * 60 * 1000);
    Object.keys(state.customPresets).forEach(name => {
      const preset = state.customPresets[name];
      if (preset.metadata?.updatedAt && preset.metadata.updatedAt < ninetyDaysAgo) {
        delete state.customPresets[name];
      }
    });

    state.lastUpdated = Date.now();

    return saveDebugState(state);
  } catch (error) {
    console.error('Failed to optimize storage:', error);
    return false;
  }
}

// Export error class for external error handling
export { StorageError };
