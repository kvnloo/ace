/**
 * Unit Tests for AssetRegistry
 *
 * Tests asset registration, enable/disable, dependency management,
 * circular dependency detection, and performance cost calculations.
 */

import { AssetRegistry, RegisteredAsset } from '@/utils/debug/assetRegistry';
import { AssetDefinition, AssetType } from '@/utils/debug/assetDefinitions';

describe('AssetRegistry', () => {
  let registry: AssetRegistry;

  beforeEach(() => {
    // Create a fresh instance for each test
    registry = new AssetRegistry();
    registry.clear(); // Clear default assets
  });

  afterEach(() => {
    registry.clear();
  });

  describe('Asset Registration', () => {
    it('should register a new asset', () => {
      const asset: AssetDefinition = {
        id: 'test-asset',
        name: 'Test Asset',
        type: 'grass' as AssetType,
        performanceCost: 5,
        dependencies: [],
        defaultEnabled: true,
        description: 'Test asset for unit tests'
      };

      registry.register(asset);

      const registered = registry.get('test-asset');
      expect(registered).toBeDefined();
      expect(registered?.id).toBe('test-asset');
      expect(registered?.enabled).toBe(true);
      expect(registered?.registeredAt).toBeDefined();
    });

    it('should preserve enabled state when re-registering existing asset', () => {
      const asset: AssetDefinition = {
        id: 'test-asset',
        name: 'Test Asset',
        type: 'grass' as AssetType,
        performanceCost: 5,
        dependencies: [],
        defaultEnabled: true,
        description: 'Test'
      };

      registry.register(asset);
      registry.disable('test-asset');

      // Re-register with different default
      registry.register({ ...asset, defaultEnabled: false });

      const registered = registry.get('test-asset');
      expect(registered?.enabled).toBe(false); // Preserved from disable()
    });

    it('should unregister an asset', () => {
      const asset: AssetDefinition = {
        id: 'test-asset',
        name: 'Test Asset',
        type: 'grass' as AssetType,
        performanceCost: 5,
        dependencies: [],
        defaultEnabled: true,
        description: 'Test'
      };

      registry.register(asset);
      expect(registry.get('test-asset')).toBeDefined();

      registry.unregister('test-asset');
      expect(registry.get('test-asset')).toBeUndefined();
    });
  });

  describe('Asset Retrieval', () => {
    beforeEach(() => {
      const assets: AssetDefinition[] = [
        {
          id: 'grass-1',
          name: 'Grass 1',
          type: 'grass' as AssetType,
          performanceCost: 5,
          dependencies: [],
          defaultEnabled: true,
          description: 'Grass asset 1'
        },
        {
          id: 'grass-2',
          name: 'Grass 2',
          type: 'grass' as AssetType,
          performanceCost: 3,
          dependencies: [],
          defaultEnabled: false,
          description: 'Grass asset 2'
        },
        {
          id: 'light-1',
          name: 'Light 1',
          type: 'lighting' as AssetType,
          performanceCost: 2,
          dependencies: [],
          defaultEnabled: true,
          description: 'Light asset 1'
        }
      ];

      assets.forEach(asset => registry.register(asset));
    });

    it('should get all registered assets', () => {
      const all = registry.getAll();
      expect(all).toHaveLength(3);
    });

    it('should get assets by type', () => {
      const grassAssets = registry.getByType('grass' as AssetType);
      expect(grassAssets).toHaveLength(2);
      expect(grassAssets.every(a => a.type === 'grass')).toBe(true);

      const lightAssets = registry.getByType('lighting' as AssetType);
      expect(lightAssets).toHaveLength(1);
    });

    it('should get enabled assets', () => {
      const enabled = registry.getEnabled();
      expect(enabled).toHaveLength(2); // grass-1 and light-1
      expect(enabled.every(a => a.enabled)).toBe(true);
    });

    it('should get disabled assets', () => {
      const disabled = registry.getDisabled();
      expect(disabled).toHaveLength(1); // grass-2
      expect(disabled.every(a => !a.enabled)).toBe(true);
    });
  });

  describe('Enable/Disable Assets', () => {
    it('should enable an asset', () => {
      const asset: AssetDefinition = {
        id: 'test-asset',
        name: 'Test Asset',
        type: 'grass' as AssetType,
        performanceCost: 5,
        dependencies: [],
        defaultEnabled: false,
        description: 'Test'
      };

      registry.register(asset);
      expect(registry.isEnabled('test-asset')).toBe(false);

      registry.enable('test-asset');
      expect(registry.isEnabled('test-asset')).toBe(true);

      const registered = registry.get('test-asset');
      expect(registered?.lastToggled).toBeDefined();
    });

    it('should disable an asset', () => {
      const asset: AssetDefinition = {
        id: 'test-asset',
        name: 'Test Asset',
        type: 'grass' as AssetType,
        performanceCost: 5,
        dependencies: [],
        defaultEnabled: true,
        description: 'Test'
      };

      registry.register(asset);
      expect(registry.isEnabled('test-asset')).toBe(true);

      registry.disable('test-asset');
      expect(registry.isEnabled('test-asset')).toBe(false);
    });

    it('should toggle asset state', () => {
      const asset: AssetDefinition = {
        id: 'test-asset',
        name: 'Test Asset',
        type: 'grass' as AssetType,
        performanceCost: 5,
        dependencies: [],
        defaultEnabled: true,
        description: 'Test'
      };

      registry.register(asset);
      expect(registry.isEnabled('test-asset')).toBe(true);

      const result1 = registry.toggle('test-asset');
      expect(result1).toBe(false);
      expect(registry.isEnabled('test-asset')).toBe(false);

      const result2 = registry.toggle('test-asset');
      expect(result2).toBe(true);
      expect(registry.isEnabled('test-asset')).toBe(true);
    });
  });

  describe('Dependency Management', () => {
    beforeEach(() => {
      const assets: AssetDefinition[] = [
        {
          id: 'base',
          name: 'Base Asset',
          type: 'grass' as AssetType,
          performanceCost: 2,
          dependencies: [],
          defaultEnabled: false,
          description: 'Base asset'
        },
        {
          id: 'dependent',
          name: 'Dependent Asset',
          type: 'grass' as AssetType,
          performanceCost: 3,
          dependencies: ['base'],
          defaultEnabled: false,
          description: 'Depends on base'
        },
        {
          id: 'dependent-2',
          name: 'Dependent Asset 2',
          type: 'grass' as AssetType,
          performanceCost: 4,
          dependencies: ['dependent'],
          defaultEnabled: false,
          description: 'Depends on dependent'
        }
      ];

      assets.forEach(asset => registry.register(asset));
    });

    it('should auto-enable dependencies when enabling an asset', () => {
      expect(registry.isEnabled('base')).toBe(false);
      expect(registry.isEnabled('dependent')).toBe(false);

      registry.enable('dependent');

      expect(registry.isEnabled('base')).toBe(true); // Auto-enabled
      expect(registry.isEnabled('dependent')).toBe(true);
    });

    it('should auto-enable nested dependencies', () => {
      expect(registry.isEnabled('base')).toBe(false);
      expect(registry.isEnabled('dependent')).toBe(false);
      expect(registry.isEnabled('dependent-2')).toBe(false);

      registry.enable('dependent-2');

      expect(registry.isEnabled('base')).toBe(true); // Auto-enabled
      expect(registry.isEnabled('dependent')).toBe(true); // Auto-enabled
      expect(registry.isEnabled('dependent-2')).toBe(true);
    });

    it('should auto-disable dependents when disabling an asset', () => {
      // Enable all first
      registry.enable('dependent-2'); // Enables all three

      expect(registry.isEnabled('base')).toBe(true);
      expect(registry.isEnabled('dependent')).toBe(true);
      expect(registry.isEnabled('dependent-2')).toBe(true);

      // Disable base
      registry.disable('base');

      expect(registry.isEnabled('base')).toBe(false);
      expect(registry.isEnabled('dependent')).toBe(false); // Auto-disabled
      expect(registry.isEnabled('dependent-2')).toBe(false); // Auto-disabled
    });

    it('should get dependencies of an asset', () => {
      const deps = registry.getDependencies('dependent');
      expect(deps).toHaveLength(1);
      expect(deps[0].id).toBe('base');
    });

    it('should get dependents of an asset', () => {
      const dependents = registry.getDependents('base');
      expect(dependents).toHaveLength(1);
      expect(dependents[0].id).toBe('dependent');
    });

    it('should get complete dependency tree', () => {
      const tree = registry.getDependencyTree('dependent-2');
      expect(tree).toContain('dependent');
      expect(tree).toContain('base');
    });

    it('should validate all dependencies exist', () => {
      expect(registry.validateDependencies('dependent')).toBe(true);

      // Add asset with non-existent dependency
      registry.register({
        id: 'invalid',
        name: 'Invalid Asset',
        type: 'grass' as AssetType,
        performanceCost: 1,
        dependencies: ['non-existent'],
        defaultEnabled: false,
        description: 'Invalid'
      });

      expect(registry.validateDependencies('invalid')).toBe(false);
    });
  });

  describe('Circular Dependency Detection', () => {
    it('should detect direct circular dependency', () => {
      const asset1: AssetDefinition = {
        id: 'asset-1',
        name: 'Asset 1',
        type: 'grass' as AssetType,
        performanceCost: 1,
        dependencies: ['asset-2'],
        defaultEnabled: false,
        description: 'Asset 1'
      };

      const asset2: AssetDefinition = {
        id: 'asset-2',
        name: 'Asset 2',
        type: 'grass' as AssetType,
        performanceCost: 1,
        dependencies: ['asset-1'],
        defaultEnabled: false,
        description: 'Asset 2'
      };

      registry.register(asset1);
      registry.register(asset2);

      const cycles = registry.getCircularDependencies();
      expect(cycles.length).toBeGreaterThan(0);

      // Should fail to enable due to circular dependency
      const result = registry.enable('asset-1');
      expect(result).toBe(false);
    });

    it('should detect indirect circular dependency', () => {
      const assets: AssetDefinition[] = [
        {
          id: 'a',
          name: 'Asset A',
          type: 'grass' as AssetType,
          performanceCost: 1,
          dependencies: ['b'],
          defaultEnabled: false,
          description: 'A'
        },
        {
          id: 'b',
          name: 'Asset B',
          type: 'grass' as AssetType,
          performanceCost: 1,
          dependencies: ['c'],
          defaultEnabled: false,
          description: 'B'
        },
        {
          id: 'c',
          name: 'Asset C',
          type: 'grass' as AssetType,
          performanceCost: 1,
          dependencies: ['a'],
          defaultEnabled: false,
          description: 'C'
        }
      ];

      assets.forEach(asset => registry.register(asset));

      const cycles = registry.getCircularDependencies();
      expect(cycles.length).toBeGreaterThan(0);
    });

    it('should allow valid dependency chains', () => {
      const assets: AssetDefinition[] = [
        {
          id: 'a',
          name: 'Asset A',
          type: 'grass' as AssetType,
          performanceCost: 1,
          dependencies: [],
          defaultEnabled: false,
          description: 'A'
        },
        {
          id: 'b',
          name: 'Asset B',
          type: 'grass' as AssetType,
          performanceCost: 1,
          dependencies: ['a'],
          defaultEnabled: false,
          description: 'B'
        },
        {
          id: 'c',
          name: 'Asset C',
          type: 'grass' as AssetType,
          performanceCost: 1,
          dependencies: ['b'],
          defaultEnabled: false,
          description: 'C'
        }
      ];

      assets.forEach(asset => registry.register(asset));

      const cycles = registry.getCircularDependencies();
      expect(cycles).toHaveLength(0);

      const result = registry.enable('c');
      expect(result).toBe(true);
      expect(registry.isEnabled('a')).toBe(true);
      expect(registry.isEnabled('b')).toBe(true);
      expect(registry.isEnabled('c')).toBe(true);
    });
  });

  describe('Performance Cost Calculations', () => {
    beforeEach(() => {
      const assets: AssetDefinition[] = [
        {
          id: 'cheap',
          name: 'Cheap Asset',
          type: 'grass' as AssetType,
          performanceCost: 2,
          dependencies: [],
          defaultEnabled: true,
          description: 'Cheap'
        },
        {
          id: 'medium',
          name: 'Medium Asset',
          type: 'lighting' as AssetType,
          performanceCost: 5,
          dependencies: [],
          defaultEnabled: true,
          description: 'Medium'
        },
        {
          id: 'expensive',
          name: 'Expensive Asset',
          type: 'characters' as AssetType,
          performanceCost: 10,
          dependencies: [],
          defaultEnabled: false,
          description: 'Expensive'
        }
      ];

      assets.forEach(asset => registry.register(asset));
    });

    it('should calculate total performance cost of enabled assets', () => {
      const cost = registry.getTotalCost();
      expect(cost).toBe(7); // cheap (2) + medium (5)
    });

    it('should update total cost when enabling assets', () => {
      const initialCost = registry.getTotalCost();
      expect(initialCost).toBe(7);

      registry.enable('expensive');
      const newCost = registry.getTotalCost();
      expect(newCost).toBe(17); // 7 + 10
    });

    it('should get cost breakdown by type', () => {
      const breakdown = registry.getCostByType();
      expect(breakdown['grass']).toBe(2);
      expect(breakdown['lighting']).toBe(5);
      expect(breakdown['characters']).toBeUndefined(); // Not enabled
    });

    it('should get budget status', () => {
      const status = registry.getBudgetStatus(100);
      expect(status.current).toBe(7);
      expect(status.max).toBe(100);
      expect(status.percentage).toBe(7);
      expect(status.remaining).toBe(93);
      expect(status.status).toBe('ok');
    });

    it('should warn when budget exceeds threshold', () => {
      registry.enable('expensive');

      const warningStatus = registry.getBudgetStatus(20);
      expect(warningStatus.percentage).toBeGreaterThan(75);
      expect(warningStatus.status).toBe('warning');

      const criticalStatus = registry.getBudgetStatus(18);
      expect(criticalStatus.percentage).toBeGreaterThan(90);
      expect(criticalStatus.status).toBe('critical');
    });
  });

  describe('Asset Statistics', () => {
    beforeEach(() => {
      const assets: AssetDefinition[] = [
        {
          id: 'g1',
          name: 'Grass 1',
          type: 'grass' as AssetType,
          performanceCost: 3,
          dependencies: [],
          defaultEnabled: true,
          description: 'G1'
        },
        {
          id: 'g2',
          name: 'Grass 2',
          type: 'grass' as AssetType,
          performanceCost: 4,
          dependencies: [],
          defaultEnabled: false,
          description: 'G2'
        },
        {
          id: 'l1',
          name: 'Light 1',
          type: 'lighting' as AssetType,
          performanceCost: 2,
          dependencies: [],
          defaultEnabled: true,
          description: 'L1'
        }
      ];

      assets.forEach(asset => registry.register(asset));
    });

    it('should get comprehensive statistics', () => {
      const stats = registry.getStats();

      expect(stats.total).toBe(3);
      expect(stats.enabled).toBe(2);
      expect(stats.disabled).toBe(1);
      expect(stats.byType['grass']).toBe(2);
      expect(stats.byType['lighting']).toBe(1);
      expect(stats.totalCost).toBe(5); // g1 (3) + l1 (2)
      expect(stats.averageCost).toBe(2.5); // 5 / 2
    });
  });

  describe('Export and Reset', () => {
    beforeEach(() => {
      registry.register({
        id: 'test',
        name: 'Test',
        type: 'grass' as AssetType,
        performanceCost: 5,
        dependencies: [],
        defaultEnabled: true,
        description: 'Test'
      });
    });

    it('should export registry state', () => {
      const exported = registry.export();

      expect(exported.timestamp).toBeDefined();
      expect(exported.assets).toHaveLength(1);
      expect(exported.stats).toBeDefined();
      expect(exported.budget).toBeDefined();
    });

    it('should reset to default state', () => {
      registry.disable('test');
      expect(registry.isEnabled('test')).toBe(false);

      registry.reset();
      expect(registry.isEnabled('test')).toBe(true); // Back to defaultEnabled
    });

    it('should clear all assets', () => {
      expect(registry.getAll()).toHaveLength(1);

      registry.clear();
      expect(registry.getAll()).toHaveLength(0);
    });
  });
});
