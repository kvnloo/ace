/**
 * Unit Tests for DebugContext
 *
 * Tests React context for debug asset management including
 * registration, toggling, dependencies, and performance cost tracking.
 */

import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { DebugProvider, useDebug, DebugAsset } from '@/contexts/DebugContext';

describe('DebugContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <DebugProvider>{children}</DebugProvider>
  );

  describe('Provider and Hook', () => {
    it('should throw error when useDebug is used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        renderHook(() => useDebug());
      }).toThrow('useDebug must be used within DebugProvider');

      consoleSpy.mockRestore();
    });

    it('should provide debug context when used within provider', () => {
      const { result } = renderHook(() => useDebug(), { wrapper });

      expect(result.current).toBeDefined();
      expect(result.current.assets).toBeDefined();
      expect(result.current.registerAsset).toBeDefined();
      expect(result.current.toggleAsset).toBeDefined();
    });
  });

  describe('Asset Registration', () => {
    it('should register a new asset', () => {
      const { result } = renderHook(() => useDebug(), { wrapper });

      const asset: DebugAsset = {
        id: 'test-asset',
        name: 'Test Asset',
        type: 'grass',
        enabled: true,
        performanceCost: 5,
        dependencies: []
      };

      act(() => {
        result.current.registerAsset(asset);
      });

      expect(result.current.assets.get('test-asset')).toBeDefined();
      expect(result.current.assets.get('test-asset')?.name).toBe('Test Asset');
    });

    it('should register multiple assets', () => {
      const { result } = renderHook(() => useDebug(), { wrapper });

      const assets: DebugAsset[] = [
        {
          id: 'asset-1',
          name: 'Asset 1',
          type: 'grass',
          enabled: true,
          performanceCost: 3,
          dependencies: []
        },
        {
          id: 'asset-2',
          name: 'Asset 2',
          type: 'lighting',
          enabled: false,
          performanceCost: 2,
          dependencies: []
        },
        {
          id: 'asset-3',
          name: 'Asset 3',
          type: 'characters',
          enabled: true,
          performanceCost: 7,
          dependencies: []
        }
      ];

      act(() => {
        assets.forEach(asset => result.current.registerAsset(asset));
      });

      expect(result.current.assets.size).toBe(3);
    });

    it('should update existing asset when re-registering', () => {
      const { result } = renderHook(() => useDebug(), { wrapper });

      const asset: DebugAsset = {
        id: 'test-asset',
        name: 'Test Asset',
        type: 'grass',
        enabled: true,
        performanceCost: 5,
        dependencies: []
      };

      act(() => {
        result.current.registerAsset(asset);
      });

      const updatedAsset: DebugAsset = {
        ...asset,
        name: 'Updated Asset',
        performanceCost: 10
      };

      act(() => {
        result.current.registerAsset(updatedAsset);
      });

      expect(result.current.assets.get('test-asset')?.name).toBe('Updated Asset');
      expect(result.current.assets.get('test-asset')?.performanceCost).toBe(10);
    });
  });

  describe('Toggle Assets', () => {
    it('should toggle asset enabled state', () => {
      const { result } = renderHook(() => useDebug(), { wrapper });

      const asset: DebugAsset = {
        id: 'test-asset',
        name: 'Test Asset',
        type: 'grass',
        enabled: true,
        performanceCost: 5,
        dependencies: []
      };

      act(() => {
        result.current.registerAsset(asset);
      });

      expect(result.current.isAssetEnabled('test-asset')).toBe(true);

      act(() => {
        result.current.toggleAsset('test-asset');
      });

      expect(result.current.isAssetEnabled('test-asset')).toBe(false);

      act(() => {
        result.current.toggleAsset('test-asset');
      });

      expect(result.current.isAssetEnabled('test-asset')).toBe(true);
    });

    it('should handle toggling non-existent asset', () => {
      const { result } = renderHook(() => useDebug(), { wrapper });

      // Should not throw
      act(() => {
        result.current.toggleAsset('non-existent');
      });

      expect(result.current.assets.get('non-existent')).toBeUndefined();
    });
  });

  describe('Asset Enabled Check', () => {
    it('should return true for unregistered assets', () => {
      const { result } = renderHook(() => useDebug(), { wrapper });

      // Default to enabled if not registered
      expect(result.current.isAssetEnabled('non-existent')).toBe(true);
    });

    it('should return correct enabled state for registered assets', () => {
      const { result } = renderHook(() => useDebug(), { wrapper });

      const enabledAsset: DebugAsset = {
        id: 'enabled',
        name: 'Enabled Asset',
        type: 'grass',
        enabled: true,
        performanceCost: 5,
        dependencies: []
      };

      const disabledAsset: DebugAsset = {
        id: 'disabled',
        name: 'Disabled Asset',
        type: 'lighting',
        enabled: false,
        performanceCost: 3,
        dependencies: []
      };

      act(() => {
        result.current.registerAsset(enabledAsset);
        result.current.registerAsset(disabledAsset);
      });

      expect(result.current.isAssetEnabled('enabled')).toBe(true);
      expect(result.current.isAssetEnabled('disabled')).toBe(false);
    });
  });

  describe('Dependency Management', () => {
    it('should respect asset dependencies', () => {
      const { result } = renderHook(() => useDebug(), { wrapper });

      const baseAsset: DebugAsset = {
        id: 'base',
        name: 'Base Asset',
        type: 'grass',
        enabled: true,
        performanceCost: 2,
        dependencies: []
      };

      const dependentAsset: DebugAsset = {
        id: 'dependent',
        name: 'Dependent Asset',
        type: 'grass',
        enabled: true,
        performanceCost: 3,
        dependencies: ['base']
      };

      act(() => {
        result.current.registerAsset(baseAsset);
        result.current.registerAsset(dependentAsset);
      });

      expect(result.current.isAssetEnabled('dependent')).toBe(true);

      // Disable base asset
      act(() => {
        result.current.toggleAsset('base');
      });

      // Dependent should be disabled even if its own enabled flag is true
      expect(result.current.isAssetEnabled('dependent')).toBe(false);
    });

    it('should handle nested dependencies', () => {
      const { result } = renderHook(() => useDebug(), { wrapper });

      const assets: DebugAsset[] = [
        {
          id: 'level-1',
          name: 'Level 1',
          type: 'grass',
          enabled: true,
          performanceCost: 1,
          dependencies: []
        },
        {
          id: 'level-2',
          name: 'Level 2',
          type: 'grass',
          enabled: true,
          performanceCost: 2,
          dependencies: ['level-1']
        },
        {
          id: 'level-3',
          name: 'Level 3',
          type: 'grass',
          enabled: true,
          performanceCost: 3,
          dependencies: ['level-2']
        }
      ];

      act(() => {
        assets.forEach(asset => result.current.registerAsset(asset));
      });

      expect(result.current.isAssetEnabled('level-3')).toBe(true);

      // Disable level-1
      act(() => {
        result.current.toggleAsset('level-1');
      });

      // All dependent levels should be disabled
      expect(result.current.isAssetEnabled('level-2')).toBe(false);
      expect(result.current.isAssetEnabled('level-3')).toBe(false);
    });

    it('should handle multiple dependencies', () => {
      const { result } = renderHook(() => useDebug(), { wrapper });

      const assets: DebugAsset[] = [
        {
          id: 'dep-1',
          name: 'Dependency 1',
          type: 'grass',
          enabled: true,
          performanceCost: 1,
          dependencies: []
        },
        {
          id: 'dep-2',
          name: 'Dependency 2',
          type: 'lighting',
          enabled: true,
          performanceCost: 2,
          dependencies: []
        },
        {
          id: 'dependent',
          name: 'Dependent',
          type: 'characters',
          enabled: true,
          performanceCost: 5,
          dependencies: ['dep-1', 'dep-2']
        }
      ];

      act(() => {
        assets.forEach(asset => result.current.registerAsset(asset));
      });

      expect(result.current.isAssetEnabled('dependent')).toBe(true);

      // Disable one dependency
      act(() => {
        result.current.toggleAsset('dep-1');
      });

      // Dependent should be disabled if ANY dependency is disabled
      expect(result.current.isAssetEnabled('dependent')).toBe(false);
    });
  });

  describe('Performance Cost Tracking', () => {
    it('should calculate total performance cost of enabled assets', () => {
      const { result } = renderHook(() => useDebug(), { wrapper });

      const assets: DebugAsset[] = [
        {
          id: 'asset-1',
          name: 'Asset 1',
          type: 'grass',
          enabled: true,
          performanceCost: 5,
          dependencies: []
        },
        {
          id: 'asset-2',
          name: 'Asset 2',
          type: 'lighting',
          enabled: true,
          performanceCost: 3,
          dependencies: []
        },
        {
          id: 'asset-3',
          name: 'Asset 3',
          type: 'characters',
          enabled: false,
          performanceCost: 10,
          dependencies: []
        }
      ];

      act(() => {
        assets.forEach(asset => result.current.registerAsset(asset));
      });

      const totalCost = result.current.getPerformanceCost();
      expect(totalCost).toBe(8); // 5 + 3 (asset-3 is disabled)
    });

    it('should update performance cost when toggling assets', () => {
      const { result } = renderHook(() => useDebug(), { wrapper });

      const asset: DebugAsset = {
        id: 'expensive',
        name: 'Expensive Asset',
        type: 'characters',
        enabled: false,
        performanceCost: 15,
        dependencies: []
      };

      act(() => {
        result.current.registerAsset(asset);
      });

      const initialCost = result.current.getPerformanceCost();
      expect(initialCost).toBe(0);

      act(() => {
        result.current.toggleAsset('expensive');
      });

      const newCost = result.current.getPerformanceCost();
      expect(newCost).toBe(15);
    });

    it('should not count disabled dependencies in performance cost', () => {
      const { result } = renderHook(() => useDebug(), { wrapper });

      const assets: DebugAsset[] = [
        {
          id: 'base',
          name: 'Base',
          type: 'grass',
          enabled: false,
          performanceCost: 5,
          dependencies: []
        },
        {
          id: 'dependent',
          name: 'Dependent',
          type: 'grass',
          enabled: true,
          performanceCost: 10,
          dependencies: ['base']
        }
      ];

      act(() => {
        assets.forEach(asset => result.current.registerAsset(asset));
      });

      // Dependent is disabled because base is disabled
      const cost = result.current.getPerformanceCost();
      expect(cost).toBe(0);
    });
  });

  describe('Bulk Operations', () => {
    beforeEach(() => {
      // This will be used in wrapper
    });

    it('should enable all assets', () => {
      const { result } = renderHook(() => useDebug(), { wrapper });

      const assets: DebugAsset[] = [
        {
          id: 'asset-1',
          name: 'Asset 1',
          type: 'grass',
          enabled: false,
          performanceCost: 1,
          dependencies: []
        },
        {
          id: 'asset-2',
          name: 'Asset 2',
          type: 'lighting',
          enabled: false,
          performanceCost: 2,
          dependencies: []
        }
      ];

      act(() => {
        assets.forEach(asset => result.current.registerAsset(asset));
      });

      act(() => {
        result.current.setAllAssets(true);
      });

      expect(result.current.assets.get('asset-1')?.enabled).toBe(true);
      expect(result.current.assets.get('asset-2')?.enabled).toBe(true);
    });

    it('should disable all assets', () => {
      const { result } = renderHook(() => useDebug(), { wrapper });

      const assets: DebugAsset[] = [
        {
          id: 'asset-1',
          name: 'Asset 1',
          type: 'grass',
          enabled: true,
          performanceCost: 1,
          dependencies: []
        },
        {
          id: 'asset-2',
          name: 'Asset 2',
          type: 'lighting',
          enabled: true,
          performanceCost: 2,
          dependencies: []
        }
      ];

      act(() => {
        assets.forEach(asset => result.current.registerAsset(asset));
      });

      act(() => {
        result.current.setAllAssets(false);
      });

      expect(result.current.assets.get('asset-1')?.enabled).toBe(false);
      expect(result.current.assets.get('asset-2')?.enabled).toBe(false);
    });

    it('should enable assets by type', () => {
      const { result } = renderHook(() => useDebug(), { wrapper });

      const assets: DebugAsset[] = [
        {
          id: 'grass-1',
          name: 'Grass 1',
          type: 'grass',
          enabled: false,
          performanceCost: 1,
          dependencies: []
        },
        {
          id: 'grass-2',
          name: 'Grass 2',
          type: 'grass',
          enabled: false,
          performanceCost: 2,
          dependencies: []
        },
        {
          id: 'light-1',
          name: 'Light 1',
          type: 'lighting',
          enabled: false,
          performanceCost: 3,
          dependencies: []
        }
      ];

      act(() => {
        assets.forEach(asset => result.current.registerAsset(asset));
      });

      act(() => {
        result.current.setAssetsByType('grass', true);
      });

      expect(result.current.assets.get('grass-1')?.enabled).toBe(true);
      expect(result.current.assets.get('grass-2')?.enabled).toBe(true);
      expect(result.current.assets.get('light-1')?.enabled).toBe(false);
    });

    it('should disable assets by type', () => {
      const { result } = renderHook(() => useDebug(), { wrapper });

      const assets: DebugAsset[] = [
        {
          id: 'grass-1',
          name: 'Grass 1',
          type: 'grass',
          enabled: true,
          performanceCost: 1,
          dependencies: []
        },
        {
          id: 'light-1',
          name: 'Light 1',
          type: 'lighting',
          enabled: true,
          performanceCost: 2,
          dependencies: []
        }
      ];

      act(() => {
        assets.forEach(asset => result.current.registerAsset(asset));
      });

      act(() => {
        result.current.setAssetsByType('grass', false);
      });

      expect(result.current.assets.get('grass-1')?.enabled).toBe(false);
      expect(result.current.assets.get('light-1')?.enabled).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle circular dependencies gracefully', () => {
      const { result } = renderHook(() => useDebug(), { wrapper });

      const assets: DebugAsset[] = [
        {
          id: 'asset-1',
          name: 'Asset 1',
          type: 'grass',
          enabled: true,
          performanceCost: 1,
          dependencies: ['asset-2']
        },
        {
          id: 'asset-2',
          name: 'Asset 2',
          type: 'grass',
          enabled: true,
          performanceCost: 2,
          dependencies: ['asset-1']
        }
      ];

      // Should not throw or cause infinite loop
      act(() => {
        assets.forEach(asset => result.current.registerAsset(asset));
      });

      // The implementation should handle this gracefully
      const enabled = result.current.isAssetEnabled('asset-1');
      expect(typeof enabled).toBe('boolean');
    });

    it('should handle empty asset map', () => {
      const { result } = renderHook(() => useDebug(), { wrapper });

      expect(result.current.getPerformanceCost()).toBe(0);
    });

    it('should handle asset with zero performance cost', () => {
      const { result } = renderHook(() => useDebug(), { wrapper });

      const asset: DebugAsset = {
        id: 'zero-cost',
        name: 'Zero Cost',
        type: 'other',
        enabled: true,
        performanceCost: 0,
        dependencies: []
      };

      act(() => {
        result.current.registerAsset(asset);
      });

      expect(result.current.getPerformanceCost()).toBe(0);
    });
  });
});
