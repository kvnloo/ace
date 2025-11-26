/// <reference types="vitest/globals" />

/**
 * Debug Storage Tests
 *
 * Comprehensive tests for localStorage persistence functionality
 */

import { vi } from 'vitest';
import {
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
  type DebugState,
  type AssetConfig,
  StorageError,
} from '../debugStorage';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('debugStorage', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('saveDebugState & loadDebugState', () => {
    it('should save and load debug state', () => {
      const state: DebugState = {
        version: 1,
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

      const saved = saveDebugState(state);
      expect(saved).toBe(true);

      const loaded = loadDebugState();
      expect(loaded).not.toBeNull();
      expect(loaded?.version).toBe(1);
      expect(loaded?.enabled).toBe(true);
    });

    it('should return null when no state exists', () => {
      const loaded = loadDebugState();
      expect(loaded).toBeNull();
    });

    it('should handle corrupted data gracefully', () => {
      localStorage.setItem('ace_debug_state', 'invalid-json');
      const loaded = loadDebugState();
      expect(loaded).toBeNull();
    });

    it('should update lastUpdated timestamp on save', () => {
      const state = getDefaultDebugState();
      const beforeTimestamp = state.lastUpdated;

      // Wait a bit to ensure timestamp difference
      setTimeout(() => {
        saveDebugState(state);
        const loaded = loadDebugState();
        expect(loaded?.lastUpdated).toBeGreaterThan(beforeTimestamp);
      }, 10);
    });
  });

  describe('preset management', () => {
    const testPreset: AssetConfig = {
      id: 'test-preset',
      name: 'Test Preset',
      description: 'A test preset',
      settings: {
        performance: {
          showFPS: true,
          targetFPS: 60,
        },
        logging: {
          maxLogs: 200,
          persistLogs: true,
        },
      },
    };

    it('should save and load preset', () => {
      const saved = savePreset('test', testPreset);
      expect(saved).toBe(true);

      const loaded = loadPreset('test');
      expect(loaded).not.toBeNull();
      expect(loaded?.name).toBe('Test Preset');
      expect(loaded?.settings.performance?.showFPS).toBe(true);
    });

    it('should list all presets', () => {
      savePreset('preset1', { ...testPreset, name: 'Preset 1' });
      savePreset('preset2', { ...testPreset, name: 'Preset 2' });
      savePreset('preset3', { ...testPreset, name: 'Preset 3' });

      const presets = listPresets();
      expect(presets).toHaveLength(3);
      expect(presets).toContain('preset1');
      expect(presets).toContain('preset2');
      expect(presets).toContain('preset3');
    });

    it('should delete preset', () => {
      savePreset('test', testPreset);
      expect(listPresets()).toContain('test');

      const deleted = deletePreset('test');
      expect(deleted).toBe(true);
      expect(listPresets()).not.toContain('test');
    });

    it('should return null for non-existent preset', () => {
      const loaded = loadPreset('non-existent');
      expect(loaded).toBeNull();
    });

    it('should clear active preset when deleted', () => {
      const state = getDefaultDebugState();
      state.activePreset = 'test';
      saveDebugState(state);

      savePreset('test', testPreset);
      deletePreset('test');

      const loaded = loadDebugState();
      expect(loaded?.activePreset).toBeUndefined();
    });

    it('should update preset metadata on save', () => {
      savePreset('test', testPreset);
      const loaded = loadPreset('test');

      expect(loaded?.metadata?.createdAt).toBeDefined();
      expect(loaded?.metadata?.updatedAt).toBeDefined();
    });
  });

  describe('clearDebugData', () => {
    it('should clear all debug data', () => {
      const state = getDefaultDebugState();
      saveDebugState(state);
      savePreset('test', {
        id: 'test',
        name: 'Test',
        settings: {},
      });

      clearDebugData();

      expect(loadDebugState()).toBeNull();
      expect(listPresets()).toHaveLength(0);
    });
  });

  describe('compression', () => {
    it('should compress large data', () => {
      const state = getDefaultDebugState();

      // Add many logs to trigger compression
      state.recentLogs = Array.from({ length: 100 }, (_, i) => ({
        id: `log_${i}`,
        timestamp: Date.now(),
        level: 'info' as const,
        type: 'test',
        message: `Test message ${i}`.repeat(10), // Make it larger
      }));

      saveDebugState(state);

      const raw = localStorage.getItem('ace_debug_state');
      expect(raw).not.toBeNull();

      // Verify it can be loaded back
      const loaded = loadDebugState();
      expect(loaded?.recentLogs).toHaveLength(100);
    });
  });

  describe('versioning & migration', () => {
    it('should migrate from version 0 to version 1', () => {
      const oldState = {
        version: 0,
        enabled: true,
        customPresets: {},
        recentLogs: [],
        showPerformance: true,
        maxLogs: 50,
        persistLogs: true,
      };

      localStorage.setItem(
        'ace_debug_state',
        JSON.stringify(oldState)
      );

      const loaded = loadDebugState();
      expect(loaded?.version).toBe(1);
      expect(loaded?.performance).toBeDefined();
      expect(loaded?.performance.maxLogs).toBe(50);
    });

    it('should handle missing version field', () => {
      const oldState = {
        enabled: true,
        customPresets: {},
        recentLogs: [],
      };

      localStorage.setItem(
        'ace_debug_state',
        JSON.stringify(oldState)
      );

      const loaded = loadDebugState();
      expect(loaded?.version).toBe(1);
    });
  });

  describe('exportToFile', () => {
    it('should export debug state', () => {
      const state = getDefaultDebugState();
      saveDebugState(state);

      // Mock DOM methods
      const createElementSpy = vi.spyOn(document, 'createElement');
      const appendChildSpy = vi.spyOn(document.body, 'appendChild');
      const removeChildSpy = vi.spyOn(document.body, 'removeChild');

      exportToFile('test-export');

      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(appendChildSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();

      createElementSpy.mockRestore();
      appendChildSpy.mockRestore();
      removeChildSpy.mockRestore();
    });

    it('should throw error when no state exists', () => {
      expect(() => exportToFile('test')).toThrow(StorageError);
    });
  });

  describe('importFromFile', () => {
    it('should import valid export file', async () => {
      const state = getDefaultDebugState();
      const exportData = {
        exportedAt: new Date().toISOString(),
        version: 1,
        state,
      };

      const file = new File(
        [JSON.stringify(exportData)],
        'export.json',
        { type: 'application/json' }
      );

      const imported = await importFromFile(file);
      expect(imported.version).toBe(1);
      expect(imported.enabled).toBe(true);
    });

    it('should reject invalid file format', async () => {
      const file = new File(
        ['invalid json'],
        'invalid.json',
        { type: 'application/json' }
      );

      await expect(importFromFile(file)).rejects.toThrow();
    });

    it('should migrate old export files', async () => {
      const oldExport = {
        exportedAt: new Date().toISOString(),
        version: 0,
        state: {
          version: 0,
          enabled: true,
          customPresets: {},
          recentLogs: [],
          showPerformance: true,
          maxLogs: 50,
          persistLogs: true,
        },
      };

      const file = new File(
        [JSON.stringify(oldExport)],
        'old-export.json',
        { type: 'application/json' }
      );

      const imported = await importFromFile(file);
      expect(imported.version).toBe(1);
      expect(imported.performance).toBeDefined();
    });
  });

  describe('getDefaultDebugState', () => {
    it('should return valid default state', () => {
      const defaultState = getDefaultDebugState();

      expect(defaultState.version).toBe(1);
      expect(defaultState.enabled).toBe(true);
      expect(defaultState.customPresets).toEqual({});
      expect(defaultState.recentLogs).toEqual([]);
      expect(defaultState.performance).toBeDefined();
    });
  });

  describe('getStorageStats', () => {
    it('should return storage statistics', () => {
      const state = getDefaultDebugState();
      saveDebugState(state);
      savePreset('test', {
        id: 'test',
        name: 'Test',
        settings: {},
      });

      const stats = getStorageStats();

      expect(stats.available).toBe(true);
      expect(stats.stateSize).toBeGreaterThan(0);
      expect(stats.presetsCount).toBe(1);
      expect(stats.logsCount).toBe(0);
    });

    it('should handle missing state', () => {
      const stats = getStorageStats();

      expect(stats.stateSize).toBe(0);
      expect(stats.presetsCount).toBe(0);
      expect(stats.logsCount).toBe(0);
    });
  });

  describe('optimizeStorage', () => {
    it('should keep only last 50 logs', () => {
      const state = getDefaultDebugState();

      // Add 100 logs
      state.recentLogs = Array.from({ length: 100 }, (_, i) => ({
        id: `log_${i}`,
        timestamp: Date.now(),
        level: 'info' as const,
        type: 'test',
        message: `Test message ${i}`,
      }));

      saveDebugState(state);
      optimizeStorage();

      const loaded = loadDebugState();
      expect(loaded?.recentLogs).toHaveLength(50);
    });

    it('should remove old presets', () => {
      const state = getDefaultDebugState();

      // Add old preset (91 days old)
      const ninetyOneDaysAgo = Date.now() - (91 * 24 * 60 * 60 * 1000);
      state.customPresets['old'] = {
        id: 'old',
        name: 'Old Preset',
        settings: {},
        metadata: {
          createdAt: ninetyOneDaysAgo,
          updatedAt: ninetyOneDaysAgo,
        },
      };

      // Add recent preset
      state.customPresets['recent'] = {
        id: 'recent',
        name: 'Recent Preset',
        settings: {},
        metadata: {
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      };

      saveDebugState(state);
      optimizeStorage();

      const loaded = loadDebugState();
      expect(loaded?.customPresets['old']).toBeUndefined();
      expect(loaded?.customPresets['recent']).toBeDefined();
    });
  });

  describe('error handling', () => {
    it('should handle quota exceeded errors', () => {
      // Mock quota exceeded error
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        const error = new DOMException('QuotaExceededError');
        (error as any).name = 'QuotaExceededError';
        throw error;
      });

      const state = getDefaultDebugState();
      const result = saveDebugState(state);

      expect(result).toBe(false);

      localStorage.setItem = originalSetItem;
    });

    it('should handle security errors in private browsing', () => {
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = vi.fn(() => {
        const error = new DOMException('SecurityError');
        (error as any).name = 'SecurityError';
        throw error;
      });

      const result = loadDebugState();
      expect(result).toBeNull();

      localStorage.getItem = originalGetItem;
    });
  });
});
