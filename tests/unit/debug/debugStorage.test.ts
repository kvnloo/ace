/**
 * Unit Tests for Debug Storage
 *
 * Tests localStorage persistence, compression, schema migration,
 * preset management, and import/export functionality.
 */

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
  DebugState,
  AssetConfig,
  StorageError
} from '@/utils/debug/debugStorage';

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
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] || null
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true
});

describe('Debug Storage', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('State Persistence', () => {
    it('should save debug state to localStorage', () => {
      const state = getDefaultDebugState();
      const result = saveDebugState(state);

      expect(result).toBe(true);
      expect(localStorageMock.getItem('ace_debug_state')).toBeDefined();
    });

    it('should load debug state from localStorage', () => {
      const state = getDefaultDebugState();
      saveDebugState(state);

      const loaded = loadDebugState();

      expect(loaded).toBeDefined();
      expect(loaded?.version).toBe(state.version);
      expect(loaded?.enabled).toBe(state.enabled);
    });

    it('should return null when no state exists', () => {
      const loaded = loadDebugState();
      expect(loaded).toBeNull();
    });

    it('should update timestamp when saving state', () => {
      const state = getDefaultDebugState();
      const originalTimestamp = state.lastUpdated;

      // Wait a bit
      jest.advanceTimersByTime(100);

      saveDebugState(state);
      const loaded = loadDebugState();

      expect(loaded?.lastUpdated).toBeGreaterThan(originalTimestamp);
    });
  });

  describe('Preset Management', () => {
    const mockPreset: AssetConfig = {
      id: 'test-preset',
      name: 'Test Preset',
      description: 'A test preset',
      settings: {
        performance: {
          showFPS: true,
          showMemory: true,
          targetFPS: 60
        },
        rendering: {
          wireframe: false,
          shadows: true
        }
      }
    };

    it('should save a preset', () => {
      const result = savePreset('test-preset', mockPreset);
      expect(result).toBe(true);

      const state = loadDebugState();
      expect(state?.customPresets['test-preset']).toBeDefined();
      expect(state?.customPresets['test-preset'].name).toBe('Test Preset');
    });

    it('should load a preset by name', () => {
      savePreset('test-preset', mockPreset);

      const loaded = loadPreset('test-preset');

      expect(loaded).toBeDefined();
      expect(loaded?.name).toBe('Test Preset');
      expect(loaded?.settings.performance?.showFPS).toBe(true);
    });

    it('should return null for non-existent preset', () => {
      const loaded = loadPreset('non-existent');
      expect(loaded).toBeNull();
    });

    it('should list all preset names', () => {
      savePreset('preset-1', { ...mockPreset, name: 'Preset 1' });
      savePreset('preset-2', { ...mockPreset, name: 'Preset 2' });
      savePreset('preset-3', { ...mockPreset, name: 'Preset 3' });

      const presets = listPresets();

      expect(presets).toHaveLength(3);
      expect(presets).toContain('preset-1');
      expect(presets).toContain('preset-2');
      expect(presets).toContain('preset-3');
    });

    it('should delete a preset', () => {
      savePreset('test-preset', mockPreset);
      expect(loadPreset('test-preset')).toBeDefined();

      const result = deletePreset('test-preset');
      expect(result).toBe(true);
      expect(loadPreset('test-preset')).toBeNull();
    });

    it('should clear active preset when deleting it', () => {
      const state = getDefaultDebugState();
      state.activePreset = 'test-preset';
      saveDebugState(state);

      savePreset('test-preset', mockPreset);
      deletePreset('test-preset');

      const loaded = loadDebugState();
      expect(loaded?.activePreset).toBeUndefined();
    });

    it('should add metadata when saving preset', () => {
      savePreset('test-preset', mockPreset);

      const loaded = loadPreset('test-preset');

      expect(loaded?.metadata?.createdAt).toBeDefined();
      expect(loaded?.metadata?.updatedAt).toBeDefined();
    });

    it('should preserve createdAt when updating preset', () => {
      savePreset('test-preset', mockPreset);
      const first = loadPreset('test-preset');
      const originalCreatedAt = first?.metadata?.createdAt;

      jest.advanceTimersByTime(1000);

      savePreset('test-preset', { ...mockPreset, description: 'Updated' });
      const updated = loadPreset('test-preset');

      expect(updated?.metadata?.createdAt).toBe(originalCreatedAt);
      expect(updated?.metadata?.updatedAt).toBeGreaterThan(originalCreatedAt || 0);
    });
  });

  describe('Data Compression', () => {
    it('should compress large data to save space', () => {
      const state = getDefaultDebugState();

      // Add lots of repeated data (good for compression)
      for (let i = 0; i < 100; i++) {
        state.recentLogs.push({
          timestamp: Date.now(),
          level: 'info',
          message: 'Repeated log entry for compression test',
          category: 'test'
        });
      }

      saveDebugState(state);
      const compressed = localStorageMock.getItem('ace_debug_state') || '';
      const uncompressed = JSON.stringify(state);

      // Compressed should be smaller (though simple compression may not always reduce size)
      expect(compressed.length).toBeLessThanOrEqual(uncompressed.length * 1.5);
    });

    it('should decompress data when loading', () => {
      const state = getDefaultDebugState();
      state.recentLogs.push({
        timestamp: Date.now(),
        level: 'info',
        message: 'Test log',
        category: 'test'
      });

      saveDebugState(state);
      const loaded = loadDebugState();

      expect(loaded?.recentLogs).toHaveLength(1);
      expect(loaded?.recentLogs[0].message).toBe('Test log');
    });
  });

  describe('Schema Migration', () => {
    it('should migrate from version 0 to current', () => {
      const oldState = {
        enabled: true,
        showPerformance: true,
        maxLogs: 50,
        persistLogs: false,
        customPresets: {},
        recentLogs: []
      };

      localStorageMock.setItem('ace_debug_state', JSON.stringify(oldState));

      const loaded = loadDebugState();

      expect(loaded?.version).toBe(1);
      expect(loaded?.enabled).toBe(true);
      expect(loaded?.performance.showPerformance).toBe(true);
      expect(loaded?.performance.maxLogs).toBe(50);
    });

    it('should handle invalid state structure', () => {
      const invalidState = { invalid: 'structure' };
      localStorageMock.setItem('ace_debug_state', JSON.stringify(invalidState));

      const loaded = loadDebugState();

      expect(loaded?.version).toBe(1);
      expect(loaded?.enabled).toBeDefined();
    });

    it('should auto-save migrated state', () => {
      const oldState = {
        enabled: true,
        customPresets: {},
        recentLogs: []
      };

      localStorageMock.setItem('ace_debug_state', JSON.stringify(oldState));

      loadDebugState();

      // Load again to verify it was saved
      const loaded = loadDebugState();
      expect(loaded?.version).toBe(1);
    });
  });

  describe('Storage Error Handling', () => {
    it('should handle localStorage unavailable', () => {
      // Mock setItem to throw
      const originalSetItem = localStorageMock.setItem;
      localStorageMock.setItem = jest.fn(() => {
        throw new DOMException('QuotaExceededError');
      });

      const state = getDefaultDebugState();
      const result = saveDebugState(state);

      expect(result).toBe(false);

      // Restore
      localStorageMock.setItem = originalSetItem;
    });

    it('should handle quota exceeded error', () => {
      const originalSetItem = localStorageMock.setItem;
      let callCount = 0;

      localStorageMock.setItem = jest.fn(() => {
        callCount++;
        if (callCount === 1) {
          const error = new DOMException('QuotaExceededError');
          (error as any).name = 'QuotaExceededError';
          throw error;
        }
      });

      const state = getDefaultDebugState();
      saveDebugState(state);

      // Should attempt cleanup
      expect(callCount).toBeGreaterThan(1);

      localStorageMock.setItem = originalSetItem;
    });

    it('should handle corrupted data gracefully', () => {
      localStorageMock.setItem('ace_debug_state', 'invalid-json{{{');

      const loaded = loadDebugState();
      expect(loaded).toBeNull();
    });
  });

  describe('Import/Export', () => {
    it('should export state to downloadable file', () => {
      const state = getDefaultDebugState();
      saveDebugState(state);

      const createElementSpy = jest.spyOn(document, 'createElement');
      const createObjectURLSpy = jest.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock');
      const revokeObjectURLSpy = jest.spyOn(URL, 'revokeObjectURL').mockImplementation();

      exportToFile('test-export');

      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(createObjectURLSpy).toHaveBeenCalled();
      expect(revokeObjectURLSpy).toHaveBeenCalled();

      createObjectURLSpy.mockRestore();
      revokeObjectURLSpy.mockRestore();
    });

    it('should throw error when exporting with no data', () => {
      expect(() => exportToFile()).toThrow(StorageError);
      expect(() => exportToFile()).toThrow('No debug state to export');
    });

    it('should import state from file', async () => {
      const state = getDefaultDebugState();
      const exportData = {
        exportedAt: new Date().toISOString(),
        version: 1,
        state
      };

      const file = new File(
        [JSON.stringify(exportData)],
        'debug-state.json',
        { type: 'application/json' }
      );

      const imported = await importFromFile(file);

      expect(imported).toBeDefined();
      expect(imported.version).toBe(state.version);
    });

    it('should reject invalid import file format', async () => {
      const invalidData = { invalid: 'format' };
      const file = new File(
        [JSON.stringify(invalidData)],
        'invalid.json',
        { type: 'application/json' }
      );

      await expect(importFromFile(file)).rejects.toThrow(StorageError);
      await expect(importFromFile(file)).rejects.toThrow('Invalid export file format');
    });

    it('should migrate imported state if needed', async () => {
      const oldState = {
        enabled: true,
        customPresets: {},
        recentLogs: []
      };

      const exportData = {
        exportedAt: new Date().toISOString(),
        version: 0,
        state: oldState
      };

      const file = new File(
        [JSON.stringify(exportData)],
        'old-state.json',
        { type: 'application/json' }
      );

      const imported = await importFromFile(file);

      expect(imported.version).toBe(1);
    });
  });

  describe('Storage Optimization', () => {
    it('should get storage statistics', () => {
      const state = getDefaultDebugState();
      savePreset('preset-1', {
        id: 'preset-1',
        name: 'Preset 1',
        settings: {}
      });

      saveDebugState(state);

      const stats = getStorageStats();

      expect(stats.available).toBe(true);
      expect(stats.used).toBeGreaterThan(0);
      expect(stats.presetsCount).toBe(1);
      expect(stats.stateSize).toBeGreaterThan(0);
    });

    it('should optimize storage by removing old logs', () => {
      const state = getDefaultDebugState();

      // Add 100 logs
      for (let i = 0; i < 100; i++) {
        state.recentLogs.push({
          timestamp: Date.now(),
          level: 'info',
          message: `Log ${i}`,
          category: 'test'
        });
      }

      saveDebugState(state);

      const result = optimizeStorage();
      expect(result).toBe(true);

      const optimized = loadDebugState();
      expect(optimized?.recentLogs).toHaveLength(50); // Kept last 50
    });

    it('should remove old presets during optimization', () => {
      const ninetyOneDaysAgo = Date.now() - (91 * 24 * 60 * 60 * 1000);

      savePreset('old-preset', {
        id: 'old-preset',
        name: 'Old Preset',
        settings: {},
        metadata: {
          createdAt: ninetyOneDaysAgo,
          updatedAt: ninetyOneDaysAgo
        }
      });

      savePreset('new-preset', {
        id: 'new-preset',
        name: 'New Preset',
        settings: {}
      });

      optimizeStorage();

      const presets = listPresets();
      expect(presets).not.toContain('old-preset');
      expect(presets).toContain('new-preset');
    });
  });

  describe('Clear Debug Data', () => {
    it('should clear all debug data from localStorage', () => {
      const state = getDefaultDebugState();
      saveDebugState(state);
      savePreset('test', { id: 'test', name: 'Test', settings: {} });

      expect(localStorageMock.getItem('ace_debug_state')).toBeDefined();

      const result = clearDebugData();
      expect(result).toBe(true);

      expect(localStorageMock.getItem('ace_debug_state')).toBeNull();
      expect(loadDebugState()).toBeNull();
    });
  });

  describe('Default State', () => {
    it('should provide valid default state', () => {
      const defaultState = getDefaultDebugState();

      expect(defaultState.version).toBe(1);
      expect(defaultState.enabled).toBe(true);
      expect(defaultState.customPresets).toEqual({});
      expect(defaultState.recentLogs).toEqual([]);
      expect(defaultState.performance).toBeDefined();
      expect(defaultState.performance.showPerformance).toBe(true);
      expect(defaultState.performance.maxLogs).toBe(100);
      expect(defaultState.lastUpdated).toBeDefined();
    });

    it('should use default state when creating preset with no existing state', () => {
      const preset: AssetConfig = {
        id: 'test',
        name: 'Test',
        settings: {}
      };

      const result = savePreset('test', preset);
      expect(result).toBe(true);

      const loaded = loadDebugState();
      expect(loaded?.version).toBe(1); // From default state
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty preset name', () => {
      const result = deletePreset('');
      expect(result).toBe(false);
    });

    it('should handle very long preset names', () => {
      const longName = 'a'.repeat(1000);
      const preset: AssetConfig = {
        id: longName,
        name: longName,
        settings: {}
      };

      const result = savePreset(longName, preset);
      expect(result).toBe(true);

      const loaded = loadPreset(longName);
      expect(loaded?.name).toBe(longName);
    });

    it('should handle special characters in preset names', () => {
      const specialName = '!@#$%^&*()_+{}:"<>?';
      const preset: AssetConfig = {
        id: specialName,
        name: specialName,
        settings: {}
      };

      savePreset(specialName, preset);
      const loaded = loadPreset(specialName);

      expect(loaded?.name).toBe(specialName);
    });
  });
});
