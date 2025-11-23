/**
 * AssetRegistry - Centralized tracking system for all 3D assets
 *
 * Provides:
 * - Asset registration and management
 * - Dependency tracking and validation
 * - Performance cost estimation
 * - Enable/disable state management
 * - Circular dependency detection
 *
 * @example
 * ```typescript
 * import { assetRegistry } from '@/utils/debug/assetRegistry';
 *
 * // Check if asset is enabled
 * if (assetRegistry.isEnabled('grass-blades')) {
 *   // Render grass
 * }
 *
 * // Enable asset with dependencies
 * assetRegistry.enable('robotic-mowers'); // Auto-enables 'grass-blades'
 *
 * // Get performance cost
 * const cost = assetRegistry.getTotalCost();
 * console.log(`Current scene cost: ${cost}/100`);
 * ```
 */

import {
  AssetDefinition,
  AssetType,
  ASSET_DEFINITIONS,
  getAssetDefinition as getDefinition,
  calculateTotalCost
} from './assetDefinitions';

/**
 * Registered asset with runtime state
 */
export interface RegisteredAsset extends AssetDefinition {
  /** Current enabled state */
  enabled: boolean;

  /** Timestamp when asset was registered */
  registeredAt: number;

  /** Timestamp when asset was last toggled */
  lastToggled?: number;
}

/**
 * Asset Registry Class
 *
 * Thread-safe singleton for managing all 3D assets in the scene
 */
export class AssetRegistry {
  private assets: Map<string, RegisteredAsset>;
  private static instance: AssetRegistry;

  private constructor() {
    this.assets = new Map();
    this.initializeAssets();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): AssetRegistry {
    if (!AssetRegistry.instance) {
      AssetRegistry.instance = new AssetRegistry();
    }
    return AssetRegistry.instance;
  }

  /**
   * Initialize registry with all known assets
   */
  private initializeAssets(): void {
    const now = Date.now();

    ASSET_DEFINITIONS.forEach(definition => {
      this.assets.set(definition.id, {
        ...definition,
        enabled: definition.defaultEnabled,
        registeredAt: now
      });
    });

    console.log(
      `[AssetRegistry] Initialized with ${this.assets.size} assets`
    );
  }

  /**
   * Register a new asset or update existing one
   */
  public register(asset: AssetDefinition): void {
    const existing = this.assets.get(asset.id);

    this.assets.set(asset.id, {
      ...asset,
      enabled: existing?.enabled ?? asset.defaultEnabled,
      registeredAt: existing?.registeredAt ?? Date.now(),
      lastToggled: existing?.lastToggled
    });

    console.log(`[AssetRegistry] Registered asset: ${asset.id}`);
  }

  /**
   * Unregister an asset
   */
  public unregister(id: string): void {
    if (this.assets.delete(id)) {
      console.log(`[AssetRegistry] Unregistered asset: ${id}`);
    }
  }

  /**
   * Get asset by ID
   */
  public get(id: string): RegisteredAsset | undefined {
    return this.assets.get(id);
  }

  /**
   * Get all registered assets
   */
  public getAll(): RegisteredAsset[] {
    return Array.from(this.assets.values());
  }

  /**
   * Get all assets of a specific type
   */
  public getByType(type: AssetType): RegisteredAsset[] {
    return this.getAll().filter(asset => asset.type === type);
  }

  /**
   * Get all enabled assets
   */
  public getEnabled(): RegisteredAsset[] {
    return this.getAll().filter(asset => asset.enabled);
  }

  /**
   * Get all disabled assets
   */
  public getDisabled(): RegisteredAsset[] {
    return this.getAll().filter(asset => !asset.enabled);
  }

  /**
   * Check if asset is enabled
   */
  public isEnabled(id: string): boolean {
    return this.assets.get(id)?.enabled ?? false;
  }

  /**
   * Enable an asset and all its dependencies
   *
   * @returns true if successfully enabled, false if circular dependency detected
   */
  public enable(id: string): boolean {
    const asset = this.assets.get(id);
    if (!asset) {
      console.warn(`[AssetRegistry] Asset not found: ${id}`);
      return false;
    }

    // Check for circular dependencies before enabling
    const circular = this.findCircularDependencies(id);
    if (circular.length > 0) {
      console.error(
        `[AssetRegistry] Circular dependency detected for ${id}:`,
        circular
      );
      return false;
    }

    // Enable dependencies first
    for (const depId of asset.dependencies) {
      if (!this.isEnabled(depId)) {
        console.log(
          `[AssetRegistry] Auto-enabling dependency: ${depId} for ${id}`
        );
        this.enable(depId);
      }
    }

    // Enable the asset
    asset.enabled = true;
    asset.lastToggled = Date.now();

    console.log(`[AssetRegistry] Enabled: ${id}`);
    return true;
  }

  /**
   * Disable an asset and all its dependents
   */
  public disable(id: string): void {
    const asset = this.assets.get(id);
    if (!asset) {
      console.warn(`[AssetRegistry] Asset not found: ${id}`);
      return;
    }

    // Disable dependents first
    const dependents = this.getDependents(id);
    for (const dependent of dependents) {
      if (this.isEnabled(dependent.id)) {
        console.log(
          `[AssetRegistry] Auto-disabling dependent: ${dependent.id} of ${id}`
        );
        this.disable(dependent.id);
      }
    }

    // Disable the asset
    asset.enabled = false;
    asset.lastToggled = Date.now();

    console.log(`[AssetRegistry] Disabled: ${id}`);
  }

  /**
   * Toggle asset enabled state
   */
  public toggle(id: string): boolean {
    if (this.isEnabled(id)) {
      this.disable(id);
      return false;
    } else {
      return this.enable(id);
    }
  }

  /**
   * Get all direct dependencies of an asset
   */
  public getDependencies(id: string): RegisteredAsset[] {
    const asset = this.assets.get(id);
    if (!asset) return [];

    return asset.dependencies
      .map(depId => this.assets.get(depId))
      .filter((dep): dep is RegisteredAsset => dep !== undefined);
  }

  /**
   * Get all assets that depend on this asset
   */
  public getDependents(id: string): RegisteredAsset[] {
    return this.getAll().filter(asset => asset.dependencies.includes(id));
  }

  /**
   * Get complete dependency tree for an asset
   */
  public getDependencyTree(id: string, visited = new Set<string>()): string[] {
    if (visited.has(id)) return [];
    visited.add(id);

    const asset = this.assets.get(id);
    if (!asset) return [];

    const tree: string[] = [];

    for (const depId of asset.dependencies) {
      tree.push(depId);
      tree.push(...this.getDependencyTree(depId, visited));
    }

    return tree;
  }

  /**
   * Validate all dependencies exist
   */
  public validateDependencies(id: string): boolean {
    const asset = this.assets.get(id);
    if (!asset) return false;

    for (const depId of asset.dependencies) {
      if (!this.assets.has(depId)) {
        console.error(
          `[AssetRegistry] Missing dependency: ${depId} for ${id}`
        );
        return false;
      }
    }

    return true;
  }

  /**
   * Find circular dependencies starting from an asset
   */
  private findCircularDependencies(
    id: string,
    visited = new Set<string>(),
    path: string[] = []
  ): string[][] {
    if (visited.has(id)) {
      const cycleStart = path.indexOf(id);
      if (cycleStart !== -1) {
        return [[...path.slice(cycleStart), id]];
      }
      return [];
    }

    const asset = this.assets.get(id);
    if (!asset) return [];

    visited.add(id);
    path.push(id);

    const cycles: string[][] = [];

    for (const depId of asset.dependencies) {
      const depCycles = this.findCircularDependencies(depId, visited, path);
      cycles.push(...depCycles);
    }

    path.pop();
    visited.delete(id);

    return cycles;
  }

  /**
   * Get all circular dependencies in the entire registry
   */
  public getCircularDependencies(): string[][] {
    const allCycles: string[][] = [];
    const processedCycles = new Set<string>();

    for (const asset of this.assets.values()) {
      const cycles = this.findCircularDependencies(asset.id);

      for (const cycle of cycles) {
        // Create a normalized representation to avoid duplicates
        const normalized = [...cycle].sort().join('->');

        if (!processedCycles.has(normalized)) {
          processedCycles.add(normalized);
          allCycles.push(cycle);
        }
      }
    }

    return allCycles;
  }

  /**
   * Get total performance cost of enabled assets
   */
  public getTotalCost(): number {
    return this.getEnabled().reduce(
      (total, asset) => total + asset.performanceCost,
      0
    );
  }

  /**
   * Get performance cost breakdown by type
   */
  public getCostByType(): Record<AssetType, number> {
    const costs: Partial<Record<AssetType, number>> = {};

    for (const asset of this.getEnabled()) {
      costs[asset.type] = (costs[asset.type] || 0) + asset.performanceCost;
    }

    return costs as Record<AssetType, number>;
  }

  /**
   * Get performance budget status
   *
   * @param maxBudget - Maximum allowed performance cost (default: 100)
   * @returns Budget utilization percentage
   */
  public getBudgetStatus(maxBudget = 100): {
    current: number;
    max: number;
    percentage: number;
    remaining: number;
    status: 'ok' | 'warning' | 'critical';
  } {
    const current = this.getTotalCost();
    const percentage = (current / maxBudget) * 100;

    let status: 'ok' | 'warning' | 'critical' = 'ok';
    if (percentage >= 90) status = 'critical';
    else if (percentage >= 75) status = 'warning';

    return {
      current,
      max: maxBudget,
      percentage,
      remaining: maxBudget - current,
      status
    };
  }

  /**
   * Get asset statistics
   */
  public getStats(): {
    total: number;
    enabled: number;
    disabled: number;
    byType: Record<AssetType, number>;
    totalCost: number;
    averageCost: number;
  } {
    const all = this.getAll();
    const enabled = this.getEnabled();

    const byType: Partial<Record<AssetType, number>> = {};
    for (const asset of all) {
      byType[asset.type] = (byType[asset.type] || 0) + 1;
    }

    return {
      total: all.length,
      enabled: enabled.length,
      disabled: all.length - enabled.length,
      byType: byType as Record<AssetType, number>,
      totalCost: this.getTotalCost(),
      averageCost:
        enabled.length > 0
          ? this.getTotalCost() / enabled.length
          : 0
    };
  }

  /**
   * Export current registry state
   */
  public export(): {
    timestamp: number;
    assets: RegisteredAsset[];
    stats: ReturnType<typeof this.getStats>;
    budget: ReturnType<typeof this.getBudgetStatus>;
  } {
    return {
      timestamp: Date.now(),
      assets: this.getAll(),
      stats: this.getStats(),
      budget: this.getBudgetStatus()
    };
  }

  /**
   * Reset all assets to default enabled state
   */
  public reset(): void {
    for (const asset of this.assets.values()) {
      const definition = getDefinition(asset.id);
      if (definition) {
        asset.enabled = definition.defaultEnabled;
        asset.lastToggled = Date.now();
      }
    }

    console.log('[AssetRegistry] Reset to default state');
  }

  /**
   * Clear all assets (use with caution!)
   */
  public clear(): void {
    this.assets.clear();
    console.log('[AssetRegistry] Cleared all assets');
  }
}

/**
 * Global singleton instance
 */
export const assetRegistry = AssetRegistry.getInstance();

/**
 * Expose registry to window for debugging
 */
if (typeof window !== 'undefined') {
  (window as any).assetRegistry = assetRegistry;
  console.log('[AssetRegistry] Available at window.assetRegistry');
}

// Export types
export type { AssetDefinition, AssetType, RegisteredAsset };
