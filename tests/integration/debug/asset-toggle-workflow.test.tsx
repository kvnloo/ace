/**
 * Integration Tests for Asset Toggle Workflow
 *
 * Tests the complete workflow of enabling/disabling assets including
 * dependency resolution, performance impact, and UI updates.
 */

import { assetRegistry } from '@/utils/debug/assetRegistry';
import { getPerformanceTracker } from '@/utils/debug/performanceTracker';
import { AssetDefinition } from '@/utils/debug/assetDefinitions';

describe('Asset Toggle Workflow Integration', () => {
  let tracker: ReturnType<typeof getPerformanceTracker>;

  beforeEach(() => {
    assetRegistry.clear();
    tracker = getPerformanceTracker();
    tracker.setBaseline({
      fps: 60,
      memory: 50,
      frameTime: 16.67,
      webglContextLost: false
    });
  });

  afterEach(() => {
    tracker.dispose();
    assetRegistry.clear();
  });

  describe('Simple Toggle Workflow', () => {
    it('should complete full enable workflow', () => {
      const asset: AssetDefinition = {
        id: 'grass-simple',
        name: 'Simple Grass',
        type: 'grass',
        performanceCost: 5,
        dependencies: [],
        defaultEnabled: false,
        description: 'Simple grass asset'
      };

      assetRegistry.register(asset);

      // Initial state
      expect(assetRegistry.isEnabled('grass-simple')).toBe(false);
      expect(assetRegistry.getTotalCost()).toBe(0);

      // Enable asset
      const success = assetRegistry.enable('grass-simple');
      expect(success).toBe(true);

      // Verify state
      expect(assetRegistry.isEnabled('grass-simple')).toBe(true);
      expect(assetRegistry.getTotalCost()).toBe(5);

      // Track performance impact
      tracker.updateAssetMetrics('grass-simple', 'Simple Grass', true);

      const report = tracker.generateReport();
      const assetMetrics = report.assets.find(a => a.id === 'grass-simple');
      expect(assetMetrics?.enabled).toBe(true);
    });

    it('should complete full disable workflow', () => {
      const asset: AssetDefinition = {
        id: 'grass-simple',
        name: 'Simple Grass',
        type: 'grass',
        performanceCost: 5,
        dependencies: [],
        defaultEnabled: true,
        description: 'Simple grass asset'
      };

      assetRegistry.register(asset);

      // Initial state (enabled)
      expect(assetRegistry.isEnabled('grass-simple')).toBe(true);
      expect(assetRegistry.getTotalCost()).toBe(5);

      // Disable asset
      assetRegistry.disable('grass-simple');

      // Verify state
      expect(assetRegistry.isEnabled('grass-simple')).toBe(false);
      expect(assetRegistry.getTotalCost()).toBe(0);

      // Track performance impact
      tracker.updateAssetMetrics('grass-simple', 'Simple Grass', false);

      const report = tracker.generateReport();
      const assetMetrics = report.assets.find(a => a.id === 'grass-simple');
      expect(assetMetrics?.enabled).toBe(false);
    });
  });

  describe('Dependency Resolution Workflow', () => {
    it('should enable asset with dependency chain', () => {
      const base: AssetDefinition = {
        id: 'grass-base',
        name: 'Grass Base',
        type: 'grass',
        performanceCost: 2,
        dependencies: [],
        defaultEnabled: false,
        description: 'Base grass layer'
      };

      const mid: AssetDefinition = {
        id: 'grass-mid',
        name: 'Grass Mid',
        type: 'grass',
        performanceCost: 3,
        dependencies: ['grass-base'],
        defaultEnabled: false,
        description: 'Mid grass layer'
      };

      const top: AssetDefinition = {
        id: 'grass-top',
        name: 'Grass Top',
        type: 'grass',
        performanceCost: 5,
        dependencies: ['grass-mid'],
        defaultEnabled: false,
        description: 'Top grass layer'
      };

      assetRegistry.register(base);
      assetRegistry.register(mid);
      assetRegistry.register(top);

      // Enable top-level asset
      const success = assetRegistry.enable('grass-top');
      expect(success).toBe(true);

      // All dependencies should be enabled
      expect(assetRegistry.isEnabled('grass-base')).toBe(true);
      expect(assetRegistry.isEnabled('grass-mid')).toBe(true);
      expect(assetRegistry.isEnabled('grass-top')).toBe(true);

      // Total cost should include all
      expect(assetRegistry.getTotalCost()).toBe(10); // 2 + 3 + 5
    });

    it('should disable asset with dependent chain', () => {
      const base: AssetDefinition = {
        id: 'grass-base',
        name: 'Grass Base',
        type: 'grass',
        performanceCost: 2,
        dependencies: [],
        defaultEnabled: true,
        description: 'Base'
      };

      const dependent1: AssetDefinition = {
        id: 'grass-dep1',
        name: 'Grass Dependent 1',
        type: 'grass',
        performanceCost: 3,
        dependencies: ['grass-base'],
        defaultEnabled: false,
        description: 'Dep 1'
      };

      const dependent2: AssetDefinition = {
        id: 'grass-dep2',
        name: 'Grass Dependent 2',
        type: 'grass',
        performanceCost: 4,
        dependencies: ['grass-base'],
        defaultEnabled: false,
        description: 'Dep 2'
      };

      assetRegistry.register(base);
      assetRegistry.register(dependent1);
      assetRegistry.register(dependent2);

      // Enable all
      assetRegistry.enable('grass-dep1');
      assetRegistry.enable('grass-dep2');

      expect(assetRegistry.getTotalCost()).toBe(9); // 2 + 3 + 4

      // Disable base
      assetRegistry.disable('grass-base');

      // All dependents should be disabled
      expect(assetRegistry.isEnabled('grass-base')).toBe(false);
      expect(assetRegistry.isEnabled('grass-dep1')).toBe(false);
      expect(assetRegistry.isEnabled('grass-dep2')).toBe(false);

      expect(assetRegistry.getTotalCost()).toBe(0);
    });
  });

  describe('Performance Impact Workflow', () => {
    it('should measure FPS delta when enabling expensive asset', async () => {
      const cheapAsset: AssetDefinition = {
        id: 'cheap',
        name: 'Cheap Asset',
        type: 'grass',
        performanceCost: 2,
        dependencies: [],
        defaultEnabled: true,
        description: 'Cheap'
      };

      const expensiveAsset: AssetDefinition = {
        id: 'expensive',
        name: 'Expensive Asset',
        type: 'characters',
        performanceCost: 20,
        dependencies: [],
        defaultEnabled: false,
        description: 'Expensive'
      };

      assetRegistry.register(cheapAsset);
      assetRegistry.register(expensiveAsset);

      // Set baseline with cheap asset only
      tracker.setBaseline({
        fps: 60,
        memory: 50,
        frameTime: 16.67,
        webglContextLost: false
      });

      tracker.updateAssetMetrics('cheap', 'Cheap Asset', true);

      // Enable expensive asset
      assetRegistry.enable('expensive');

      // Simulate performance drop
      const currentMetrics = {
        fps: 40,
        memory: 75,
        frameTime: 25,
        webglContextLost: false
      };

      const delta = tracker.compareToBaseline(currentMetrics);

      expect(delta.fpsDelta).toBe(-20);
      expect(delta.memoryDelta).toBe(25);
      expect(delta.impactScore).toBeLessThan(0); // Negative impact
    });

    it('should track render time when toggling assets', () => {
      const asset: AssetDefinition = {
        id: 'timed-asset',
        name: 'Timed Asset',
        type: 'grass',
        performanceCost: 5,
        dependencies: [],
        defaultEnabled: false,
        description: 'Timed'
      };

      assetRegistry.register(asset);

      // Enable and track render time
      tracker.startRenderTimer('timed-asset');
      assetRegistry.enable('timed-asset');

      // Simulate render
      jest.advanceTimersByTime(10);

      const renderTime = tracker.endRenderTimer('timed-asset');
      expect(renderTime).toBeGreaterThan(0);

      tracker.updateAssetMetrics('timed-asset', 'Timed Asset', true);

      const report = tracker.generateReport();
      const metrics = report.assets.find(a => a.id === 'timed-asset');
      expect(metrics?.renderTime).toBe(renderTime);
    });
  });

  describe('Batch Toggle Workflow', () => {
    it('should disable all assets and measure delta', () => {
      const assets: AssetDefinition[] = [
        {
          id: 'grass-1',
          name: 'Grass 1',
          type: 'grass',
          performanceCost: 3,
          dependencies: [],
          defaultEnabled: true,
          description: 'G1'
        },
        {
          id: 'grass-2',
          name: 'Grass 2',
          type: 'grass',
          performanceCost: 4,
          dependencies: [],
          defaultEnabled: true,
          description: 'G2'
        },
        {
          id: 'light-1',
          name: 'Light 1',
          type: 'lighting',
          performanceCost: 5,
          dependencies: [],
          defaultEnabled: true,
          description: 'L1'
        }
      ];

      assets.forEach(asset => assetRegistry.register(asset));

      const initialCost = assetRegistry.getTotalCost();
      expect(initialCost).toBe(12);

      // Disable all grass assets
      const grassAssets = assetRegistry.getByType('grass');
      grassAssets.forEach(asset => assetRegistry.disable(asset.id));

      const newCost = assetRegistry.getTotalCost();
      expect(newCost).toBe(5); // Only light-1

      const delta = initialCost - newCost;
      expect(delta).toBe(7); // 3 + 4
    });

    it('should enable all disabled assets', () => {
      const assets: AssetDefinition[] = [
        {
          id: 'asset-1',
          name: 'Asset 1',
          type: 'grass',
          performanceCost: 2,
          dependencies: [],
          defaultEnabled: false,
          description: 'A1'
        },
        {
          id: 'asset-2',
          name: 'Asset 2',
          type: 'lighting',
          performanceCost: 3,
          dependencies: [],
          defaultEnabled: false,
          description: 'A2'
        },
        {
          id: 'asset-3',
          name: 'Asset 3',
          type: 'characters',
          performanceCost: 5,
          dependencies: [],
          defaultEnabled: false,
          description: 'A3'
        }
      ];

      assets.forEach(asset => assetRegistry.register(asset));

      expect(assetRegistry.getTotalCost()).toBe(0);

      // Enable all
      const disabled = assetRegistry.getDisabled();
      disabled.forEach(asset => assetRegistry.enable(asset.id));

      expect(assetRegistry.getTotalCost()).toBe(10);
      expect(assetRegistry.getDisabled()).toHaveLength(0);
    });
  });

  describe('Circular Dependency Workflow', () => {
    it('should prevent enabling assets with circular dependencies', () => {
      const asset1: AssetDefinition = {
        id: 'circular-1',
        name: 'Circular 1',
        type: 'grass',
        performanceCost: 3,
        dependencies: ['circular-2'],
        defaultEnabled: false,
        description: 'C1'
      };

      const asset2: AssetDefinition = {
        id: 'circular-2',
        name: 'Circular 2',
        type: 'grass',
        performanceCost: 4,
        dependencies: ['circular-1'],
        defaultEnabled: false,
        description: 'C2'
      };

      assetRegistry.register(asset1);
      assetRegistry.register(asset2);

      const success = assetRegistry.enable('circular-1');
      expect(success).toBe(false); // Should fail

      expect(assetRegistry.isEnabled('circular-1')).toBe(false);
      expect(assetRegistry.isEnabled('circular-2')).toBe(false);
    });

    it('should detect and report circular dependencies', () => {
      const assets: AssetDefinition[] = [
        {
          id: 'a',
          name: 'A',
          type: 'grass',
          performanceCost: 1,
          dependencies: ['b'],
          defaultEnabled: false,
          description: 'A'
        },
        {
          id: 'b',
          name: 'B',
          type: 'grass',
          performanceCost: 1,
          dependencies: ['c'],
          defaultEnabled: false,
          description: 'B'
        },
        {
          id: 'c',
          name: 'C',
          type: 'grass',
          performanceCost: 1,
          dependencies: ['a'],
          defaultEnabled: false,
          description: 'C'
        }
      ];

      assets.forEach(asset => assetRegistry.register(asset));

      const cycles = assetRegistry.getCircularDependencies();
      expect(cycles.length).toBeGreaterThan(0);

      const success = assetRegistry.enable('a');
      expect(success).toBe(false);
    });
  });

  describe('Performance Budget Workflow', () => {
    it('should warn when approaching budget limit', () => {
      const assets: AssetDefinition[] = [
        {
          id: 'heavy-1',
          name: 'Heavy 1',
          type: 'characters',
          performanceCost: 40,
          dependencies: [],
          defaultEnabled: true,
          description: 'H1'
        },
        {
          id: 'heavy-2',
          name: 'Heavy 2',
          type: 'characters',
          performanceCost: 40,
          dependencies: [],
          defaultEnabled: false,
          description: 'H2'
        }
      ];

      assets.forEach(asset => assetRegistry.register(asset));

      const initialBudget = assetRegistry.getBudgetStatus(100);
      expect(initialBudget.status).toBe('ok');

      assetRegistry.enable('heavy-2');

      const newBudget = assetRegistry.getBudgetStatus(100);
      expect(newBudget.status).toBe('warning');
      expect(newBudget.percentage).toBeGreaterThan(75);
    });

    it('should show critical when budget exceeded', () => {
      const asset: AssetDefinition = {
        id: 'critical',
        name: 'Critical Asset',
        type: 'characters',
        performanceCost: 95,
        dependencies: [],
        defaultEnabled: false,
        description: 'Critical'
      };

      assetRegistry.register(asset);
      assetRegistry.enable('critical');

      const budget = assetRegistry.getBudgetStatus(100);
      expect(budget.status).toBe('critical');
      expect(budget.percentage).toBeGreaterThan(90);
    });
  });

  describe('Reset Workflow', () => {
    it('should reset all assets to default state', () => {
      const assets: AssetDefinition[] = [
        {
          id: 'default-on',
          name: 'Default On',
          type: 'grass',
          performanceCost: 3,
          dependencies: [],
          defaultEnabled: true,
          description: 'Default on'
        },
        {
          id: 'default-off',
          name: 'Default Off',
          type: 'lighting',
          performanceCost: 5,
          dependencies: [],
          defaultEnabled: false,
          description: 'Default off'
        }
      ];

      assets.forEach(asset => assetRegistry.register(asset));

      // Change states
      assetRegistry.disable('default-on');
      assetRegistry.enable('default-off');

      expect(assetRegistry.isEnabled('default-on')).toBe(false);
      expect(assetRegistry.isEnabled('default-off')).toBe(true);

      // Reset
      assetRegistry.reset();

      expect(assetRegistry.isEnabled('default-on')).toBe(true);
      expect(assetRegistry.isEnabled('default-off')).toBe(false);
    });
  });

  describe('Statistics Workflow', () => {
    it('should track comprehensive toggle statistics', () => {
      const assets: AssetDefinition[] = [
        {
          id: 'g1',
          name: 'G1',
          type: 'grass',
          performanceCost: 2,
          dependencies: [],
          defaultEnabled: true,
          description: 'G1'
        },
        {
          id: 'g2',
          name: 'G2',
          type: 'grass',
          performanceCost: 3,
          dependencies: [],
          defaultEnabled: false,
          description: 'G2'
        },
        {
          id: 'l1',
          name: 'L1',
          type: 'lighting',
          performanceCost: 4,
          dependencies: [],
          defaultEnabled: true,
          description: 'L1'
        }
      ];

      assets.forEach(asset => assetRegistry.register(asset));

      const stats = assetRegistry.getStats();

      expect(stats.total).toBe(3);
      expect(stats.enabled).toBe(2);
      expect(stats.disabled).toBe(1);
      expect(stats.byType['grass']).toBe(2);
      expect(stats.byType['lighting']).toBe(1);
      expect(stats.totalCost).toBe(6);
      expect(stats.averageCost).toBe(3);
    });
  });
});
