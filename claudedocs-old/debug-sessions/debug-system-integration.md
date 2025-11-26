# Debug System Integration - Developer Guide

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Registering Assets](#registering-assets)
3. [Performance Tracking](#performance-tracking)
4. [Integration Patterns](#integration-patterns)
5. [API Reference](#api-reference)
6. [Best Practices](#best-practices)
7. [Extension Points](#extension-points)

## Architecture Overview

### System Components

The debug system consists of four main modules:

```
┌────────────────────────────────────────────────┐
│           Debug System Architecture            │
├────────────────────────────────────────────────┤
│                                                │
│  ┌──────────────┐      ┌──────────────────┐   │
│  │ AssetRegistry│◄─────┤ AssetDefinitions │   │
│  └──────┬───────┘      └──────────────────┘   │
│         │                                      │
│         │ manages                              │
│         ▼                                      │
│  ┌──────────────────────┐                     │
│  │ PerformanceTracker   │                     │
│  │ - FPS monitoring     │                     │
│  │ - Memory tracking    │                     │
│  │ - Render timing      │                     │
│  └──────────┬───────────┘                     │
│             │                                  │
│             │ provides data to                 │
│             ▼                                  │
│  ┌──────────────────────┐                     │
│  │ DebugPanel (UI)      │                     │
│  │ - AssetToggle        │                     │
│  │ - PerformanceChart   │                     │
│  │ - PresetSelector     │                     │
│  └──────────────────────┘                     │
│                                                │
│  ┌──────────────────────┐                     │
│  │ DebugStorage         │                     │
│  │ - localStorage       │                     │
│  │ - Import/Export      │                     │
│  └──────────────────────┘                     │
└────────────────────────────────────────────────┘
```

### Module Responsibilities

| Module | Purpose | Key Functions |
|--------|---------|---------------|
| **AssetDefinitions** | Asset catalog and metadata | Define all available assets |
| **AssetRegistry** | Runtime asset state management | Enable/disable, dependency tracking |
| **PerformanceTracker** | Real-time metrics collection | FPS, memory, render time tracking |
| **DebugStorage** | Persistence layer | Save/load presets and configs |
| **DebugPanel** | User interface | Visual controls and monitoring |
| **PerformanceComparison** | Automated testing | Systematic performance analysis |

## Registering Assets

### Asset Definition Structure

```typescript
import { AssetDefinition } from '@/utils/debug/assetDefinitions';

const myAsset: AssetDefinition = {
  // Required fields
  id: 'my-custom-asset',           // Unique identifier
  name: 'My Custom Asset',         // Display name
  type: 'effects',                 // Category (see types below)
  description: 'Description',      // Short description
  performanceCost: 5,              // 1-10 scale
  dependencies: [],                // Array of asset IDs
  defaultEnabled: true,            // Default state

  // Optional fields
  componentPath: 'components/MyAsset',  // React component path
  metadata: {
    polyCount: 5000,               // Polygon count
    textureResolution: 2048,       // Texture size
    hasPhysics: true,              // Physics enabled
    hasAnimation: false            // Animation enabled
  }
};
```

### Asset Types

```typescript
type AssetType =
  | 'court'      // Tennis courts and court elements
  | 'grass'      // Grass and vegetation
  | 'lighting'   // Lighting and shadows
  | 'weather'    // Weather effects
  | 'effects'    // Visual effects
  | 'ui'         // UI overlays
  | 'building'   // Buildings and structures
  | 'character'  // Characters and NPCs
  | 'physics';   // Physics simulation
```

### Registering an Asset

#### Method 1: Add to Asset Definitions

Edit `/src/utils/debug/assetDefinitions.ts`:

```typescript
export const ASSET_DEFINITIONS: AssetDefinition[] = [
  // ... existing assets ...

  {
    id: 'my-new-effect',
    name: 'My New Effect',
    type: 'effects',
    description: 'Cool visual effect',
    performanceCost: 6,
    dependencies: ['post-processing'], // Requires post-processing
    defaultEnabled: false,
    componentPath: 'components/MyNewEffect',
    metadata: {
      effectType: 'particle',
      maxParticles: 1000
    }
  }
];
```

#### Method 2: Dynamic Registration

```typescript
import { assetRegistry } from '@/utils/debug/assetRegistry';

// Register at runtime
assetRegistry.register({
  id: 'runtime-asset',
  name: 'Runtime Asset',
  type: 'effects',
  description: 'Dynamically registered asset',
  performanceCost: 4,
  dependencies: [],
  defaultEnabled: true
});

// Later: unregister if needed
assetRegistry.unregister('runtime-asset');
```

### Managing Dependencies

Assets can depend on other assets. The registry automatically handles cascading enable/disable:

```typescript
// Example: Grass Growth depends on Grass Blades and Mowers
{
  id: 'growth-visualization',
  dependencies: ['grass-blades', 'robotic-mowers'],
  // ...
}

// When enabled:
assetRegistry.enable('growth-visualization');
// → Auto-enables 'grass-blades' and 'robotic-mowers'

// When disabled:
assetRegistry.disable('grass-blades');
// → Auto-disables 'growth-visualization' (and other dependents)
```

### Preventing Circular Dependencies

The registry detects and prevents circular dependencies:

```typescript
// This will be rejected:
{
  id: 'asset-a',
  dependencies: ['asset-b']
}
{
  id: 'asset-b',
  dependencies: ['asset-a']  // ❌ Circular!
}

// Check for circular dependencies
const cycles = assetRegistry.getCircularDependencies();
if (cycles.length > 0) {
  console.error('Circular dependencies detected:', cycles);
}

// Validate before enabling
const canEnable = assetRegistry.enable('asset-id');
if (!canEnable) {
  console.error('Failed to enable - circular dependency detected');
}
```

## Performance Tracking

### Tracking Asset Performance

```typescript
import { getPerformanceTracker } from '@/utils/debug/performanceTracker';

const tracker = getPerformanceTracker();

// 1. Set baseline (before enabling any assets)
tracker.setBaseline();

// 2. Track asset rendering
function renderMyAsset() {
  tracker.startRenderTimer('my-asset-id');

  // ... render code ...

  tracker.endRenderTimer('my-asset-id');
}

// 3. Track memory impact
const beforeMemory = tracker.getMemoryUsage();
enableAsset('my-asset-id');
const afterMemory = tracker.getMemoryUsage();
const memoryDelta = afterMemory - beforeMemory;

// 4. Update asset metrics
tracker.updateAssetMetrics('my-asset-id', 'My Asset', true);

// 5. Generate report
const report = tracker.generateReport();
console.log(report.recommendations);
```

### Real-time FPS Tracking

```typescript
// Get current FPS
const currentFPS = tracker.trackFPS();

// Get average FPS over last 5 seconds
const avgFPS = tracker.getAverageFPS(5);

// Get current metrics
const metrics = tracker.getCurrentMetrics();
console.log({
  fps: metrics.fps,
  memory: metrics.memory,
  frameTime: metrics.frameTime,
  webglContextLost: metrics.webglContextLost
});
```

### Performance Comparison

```typescript
// Compare current state to baseline
const current = tracker.getCurrentMetrics();
const delta = tracker.compareToBaseline(current);

console.log({
  fpsDelta: delta.fpsDelta,             // -5.2 FPS
  fpsChangePercent: delta.fpsChangePercent, // -8.7%
  impactScore: delta.impactScore        // -15 (negative is bad)
});

// Impact score interpretation:
// -100 to -50: Severe performance impact
// -50 to -20:  Significant impact
// -20 to -5:   Moderate impact
// -5 to 5:     Minimal impact
// 5 to 100:    Performance improvement
```

### Memory Tracking

```typescript
// Track memory usage
const memory = tracker.getMemoryUsage(); // in MB

// Track memory delta for specific asset
tracker.trackMemoryDelta('asset-id'); // First call: baseline
// ... enable asset ...
const delta = tracker.trackMemoryDelta('asset-id'); // Returns delta
```

### Exporting Performance Data

```typescript
// Export as JSON
const json = tracker.exportReport();

// Download report
tracker.downloadReport(); // Auto-downloads JSON file

// Generate full report
const report = tracker.generateReport();
console.log({
  baseline: report.baseline,
  current: report.current,
  assets: report.assets,
  recommendations: report.recommendations,
  system: report.system
});
```

## Integration Patterns

### Pattern 1: React Component Integration

```typescript
import { FC, useEffect, useState } from 'react';
import { assetRegistry } from '@/utils/debug/assetRegistry';
import { getPerformanceTracker } from '@/utils/debug/performanceTracker';

export const MyAsset: FC = () => {
  const [enabled, setEnabled] = useState(false);
  const tracker = getPerformanceTracker();

  useEffect(() => {
    // Register asset on mount
    assetRegistry.register({
      id: 'my-asset',
      name: 'My Asset',
      type: 'effects',
      description: 'My custom asset',
      performanceCost: 5,
      dependencies: [],
      defaultEnabled: false
    });

    // Check if should be enabled
    setEnabled(assetRegistry.isEnabled('my-asset'));

    // Listen for state changes
    const checkState = () => {
      setEnabled(assetRegistry.isEnabled('my-asset'));
    };

    // Poll or use event system
    const interval = setInterval(checkState, 100);

    return () => {
      clearInterval(interval);
      assetRegistry.unregister('my-asset');
    };
  }, []);

  useEffect(() => {
    if (enabled) {
      // Start performance tracking
      tracker.startRenderTimer('my-asset');
    }
  }, [enabled]);

  if (!enabled) return null;

  return (
    <group>
      {/* Your 3D content */}
    </group>
  );
};
```

### Pattern 2: Three.js Integration

```typescript
import * as THREE from 'three';
import { assetRegistry } from '@/utils/debug/assetRegistry';
import { getPerformanceTracker } from '@/utils/debug/performanceTracker';

class MyAssetManager {
  private mesh: THREE.Mesh | null = null;
  private tracker = getPerformanceTracker();

  constructor() {
    // Register asset
    assetRegistry.register({
      id: 'threejs-asset',
      name: 'ThreeJS Asset',
      type: 'effects',
      description: 'Custom Three.js asset',
      performanceCost: 6,
      dependencies: [],
      defaultEnabled: true
    });
  }

  public update(scene: THREE.Scene) {
    const isEnabled = assetRegistry.isEnabled('threejs-asset');

    if (isEnabled && !this.mesh) {
      this.enable(scene);
    } else if (!isEnabled && this.mesh) {
      this.disable(scene);
    }

    // Track render time if enabled
    if (this.mesh && isEnabled) {
      this.tracker.startRenderTimer('threejs-asset');
      // ... render logic ...
      this.tracker.endRenderTimer('threejs-asset');
    }
  }

  private enable(scene: THREE.Scene) {
    // Create mesh
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: 0x00ff00 })
    );

    scene.add(this.mesh);

    // Track memory impact
    this.tracker.trackMemoryDelta('threejs-asset');
  }

  private disable(scene: THREE.Scene) {
    if (this.mesh) {
      scene.remove(this.mesh);
      this.mesh.geometry.dispose();
      (this.mesh.material as THREE.Material).dispose();
      this.mesh = null;

      // Track memory freed
      this.tracker.trackMemoryDelta('threejs-asset');
    }
  }

  public dispose(scene: THREE.Scene) {
    this.disable(scene);
    assetRegistry.unregister('threejs-asset');
  }
}
```

### Pattern 3: Performance Testing Integration

```typescript
import { PerformanceTestRunner } from '@/utils/debug/performanceComparison';
import { assetRegistry } from '@/utils/debug/assetRegistry';

class CustomTestRunner extends PerformanceTestRunner {
  // Override to use actual asset list
  protected getAvailableAssets(): string[] {
    return assetRegistry.getAll().map(asset => asset.id);
  }

  // Override to use actual enable logic
  protected async enableAsset(id: string): Promise<void> {
    assetRegistry.enable(id);
    // Wait for asset to fully load
    await this.waitForAssetLoad(id);
  }

  // Override to use actual disable logic
  protected async disableAsset(id: string): Promise<void> {
    assetRegistry.disable(id);
    await this.waitForAssetUnload(id);
  }

  private async waitForAssetLoad(id: string): Promise<void> {
    // Custom loading detection logic
    return new Promise(resolve => {
      setTimeout(resolve, 500);
    });
  }

  private async waitForAssetUnload(id: string): Promise<void> {
    // Custom unloading detection logic
    return new Promise(resolve => {
      setTimeout(resolve, 200);
    });
  }
}

// Run custom tests
const runner = new CustomTestRunner({
  stabilizationTime: 4000,
  measurementFrames: 120,
  measurementPasses: 5
});

const report = await runner.runFullTestSuite();
```

### Pattern 4: Storage Integration

```typescript
import {
  saveDebugState,
  loadDebugState,
  savePreset,
  loadPreset,
  optimizeStorage
} from '@/utils/debug/debugStorage';

class DebugManager {
  public async init() {
    // Load saved state
    const state = loadDebugState();

    if (state) {
      // Restore asset states
      state.customPresets.forEach(preset => {
        // Apply preset configuration
        this.applyPreset(preset);
      });

      // Restore active preset
      if (state.activePreset) {
        const preset = loadPreset(state.activePreset);
        if (preset) {
          this.applyPreset(preset);
        }
      }
    }

    // Optimize storage periodically
    setInterval(() => {
      optimizeStorage();
    }, 24 * 60 * 60 * 1000); // Daily
  }

  public saveCurrentConfiguration(name: string) {
    const config = this.getCurrentConfig();

    savePreset(name, {
      id: `preset-${Date.now()}`,
      name,
      description: 'User-created preset',
      settings: config,
      metadata: {
        createdAt: Date.now(),
        author: 'user'
      }
    });
  }

  private getCurrentConfig() {
    // Get current asset states
    const enabled = assetRegistry.getEnabled();
    const disabled = assetRegistry.getDisabled();

    return {
      performance: {
        showFPS: true,
        targetFPS: 60
      },
      assets: {
        enabled: enabled.map(a => a.id),
        disabled: disabled.map(a => a.id)
      }
    };
  }

  private applyPreset(preset: any) {
    // Apply preset configuration
    if (preset.settings?.assets) {
      // Enable specified assets
      preset.settings.assets.enabled?.forEach((id: string) => {
        assetRegistry.enable(id);
      });

      // Disable specified assets
      preset.settings.assets.disabled?.forEach((id: string) => {
        assetRegistry.disable(id);
      });
    }
  }
}
```

## API Reference

### AssetRegistry API

```typescript
class AssetRegistry {
  // Registration
  register(asset: AssetDefinition): void
  unregister(id: string): void

  // Retrieval
  get(id: string): RegisteredAsset | undefined
  getAll(): RegisteredAsset[]
  getByType(type: AssetType): RegisteredAsset[]
  getEnabled(): RegisteredAsset[]
  getDisabled(): RegisteredAsset[]

  // State Management
  isEnabled(id: string): boolean
  enable(id: string): boolean
  disable(id: string): void
  toggle(id: string): boolean
  reset(): void
  clear(): void

  // Dependencies
  getDependencies(id: string): RegisteredAsset[]
  getDependents(id: string): RegisteredAsset[]
  getDependencyTree(id: string): string[]
  validateDependencies(id: string): boolean
  getCircularDependencies(): string[][]

  // Performance
  getTotalCost(): number
  getCostByType(): Record<AssetType, number>
  getBudgetStatus(maxBudget?: number): BudgetStatus

  // Statistics
  getStats(): AssetStats
  export(): ExportedState
}
```

### PerformanceTracker API

```typescript
class PerformanceTracker {
  // FPS Tracking
  trackFPS(): number
  getAverageFPS(duration?: number): number

  // Memory Tracking
  getMemoryUsage(): number
  trackMemoryDelta(assetId: string): number

  // Render Timing
  startRenderTimer(assetId: string): void
  endRenderTimer(assetId: string): number

  // Baseline
  setBaseline(metrics?: PerformanceMetrics): void
  compareToBaseline(current: PerformanceMetrics): PerformanceDelta

  // Metrics
  getCurrentMetrics(): PerformanceMetrics
  updateAssetMetrics(assetId: string, name: string, enabled: boolean): void

  // Reporting
  generateReport(): PerformanceReport
  exportReport(): string
  downloadReport(): void

  // Cleanup
  dispose(): void
}
```

### Debug Storage API

```typescript
// State Management
function saveDebugState(state: DebugState): boolean
function loadDebugState(): DebugState | null
function getDefaultDebugState(): DebugState

// Preset Management
function savePreset(name: string, config: AssetConfig): boolean
function loadPreset(name: string): AssetConfig | null
function listPresets(): string[]
function deletePreset(name: string): boolean

// Import/Export
function exportToFile(filename?: string): void
function importFromFile(file: File): Promise<DebugState>

// Storage Management
function clearDebugData(): boolean
function optimizeStorage(): boolean
function getStorageStats(): StorageStats
```

### PerformanceComparison API

```typescript
class PerformanceTestRunner {
  constructor(options?: TestOptions)

  // Test Execution
  runBaseline(): Promise<PerformanceMetrics>
  runIndividualAssetTests(): Promise<Map<string, PerformanceMetrics>>
  runCombinationTests(combinations: string[][]): Promise<PerformanceMetrics[]>
  runFullTestSuite(): Promise<PerformanceTestReport>

  // Overridable Methods (for integration)
  protected getAvailableAssets(): string[]
  protected enableAsset(name: string): Promise<void>
  protected disableAsset(name: string): Promise<void>
}

// Utility Functions
function generateComparisonTable(report: PerformanceTestReport): string
function exportReportJSON(report: PerformanceTestReport): string
function saveReportToStorage(report: PerformanceTestReport, key?: string): void
function loadReportFromStorage(key?: string): PerformanceTestReport | null
```

## Best Practices

### 1. Asset Registration

```typescript
// ✅ Good: Register on component mount
useEffect(() => {
  assetRegistry.register({
    id: 'my-asset',
    // ... definition
  });

  return () => {
    assetRegistry.unregister('my-asset');
  };
}, []);

// ❌ Bad: Register on every render
assetRegistry.register({ id: 'my-asset' }); // Called repeatedly!
```

### 2. Performance Tracking

```typescript
// ✅ Good: Track render time properly
function render() {
  tracker.startRenderTimer('asset-id');
  try {
    // Render logic
  } finally {
    tracker.endRenderTimer('asset-id'); // Always end timer
  }
}

// ❌ Bad: Missing end timer
function render() {
  tracker.startRenderTimer('asset-id');
  // Render logic
  // Timer never ended!
}
```

### 3. Memory Management

```typescript
// ✅ Good: Dispose resources
function cleanup() {
  if (mesh) {
    scene.remove(mesh);
    mesh.geometry.dispose();
    (mesh.material as Material).dispose();
    mesh = null;
  }
  tracker.trackMemoryDelta('asset-id');
}

// ❌ Bad: Memory leak
function cleanup() {
  scene.remove(mesh); // Geometry and material not disposed!
}
```

### 4. Dependency Management

```typescript
// ✅ Good: Declare dependencies
{
  id: 'advanced-effect',
  dependencies: ['post-processing', 'lighting'],
  // Auto-enables dependencies
}

// ❌ Bad: Manual dependency management
if (assetRegistry.isEnabled('advanced-effect')) {
  // Manually enable post-processing - error-prone!
  assetRegistry.enable('post-processing');
}
```

### 5. Error Handling

```typescript
// ✅ Good: Handle failures
const success = assetRegistry.enable('asset-id');
if (!success) {
  console.error('Failed to enable asset - check for circular dependencies');
  return;
}

// ❌ Bad: Assume success
assetRegistry.enable('asset-id');
// Continue without checking if it worked
```

### 6. Performance Testing

```typescript
// ✅ Good: Adequate stabilization time
const runner = new PerformanceTestRunner({
  stabilizationTime: 3000,  // Give scene time to settle
  measurementFrames: 60,    // Measure enough frames
  measurementPasses: 3      // Multiple passes for accuracy
});

// ❌ Bad: Rushed testing
const runner = new PerformanceTestRunner({
  stabilizationTime: 100,   // Too short!
  measurementFrames: 10,    // Too few frames!
  measurementPasses: 1      // No validation!
});
```

## Extension Points

### Custom Asset Types

```typescript
// Extend asset types
type CustomAssetType = AssetType | 'audio' | 'network' | 'ai';

interface CustomAssetDefinition extends AssetDefinition {
  type: CustomAssetType;
  customMetadata?: {
    audioChannels?: number;
    networkBandwidth?: number;
    aiModelSize?: number;
  };
}
```

### Custom Performance Metrics

```typescript
// Extend performance metrics
interface ExtendedPerformanceMetrics extends PerformanceMetrics {
  networkLatency?: number;
  gpuUtilization?: number;
  drawCalls?: number;
}

class ExtendedPerformanceTracker extends PerformanceTracker {
  getExtendedMetrics(): ExtendedPerformanceMetrics {
    const base = this.getCurrentMetrics();
    return {
      ...base,
      networkLatency: this.measureNetworkLatency(),
      gpuUtilization: this.measureGPUUtilization(),
      drawCalls: this.countDrawCalls()
    };
  }
}
```

### Custom Test Runners

```typescript
// Create specialized test runners
class GPUTestRunner extends PerformanceTestRunner {
  async runGPUStressTest(): Promise<GPUTestReport> {
    // Custom GPU-focused testing
    const baseline = await this.runBaseline();

    // Test with increasing triangle counts
    const results = [];
    for (let triangles = 10000; triangles <= 1000000; triangles *= 2) {
      this.setTriangleCount(triangles);
      await this.waitForStabilization();
      const metrics = await this.measurePerformance(`${triangles} triangles`);
      results.push({ triangles, metrics });
    }

    return {
      baseline,
      results,
      recommendations: this.generateGPURecommendations(results)
    };
  }
}
```

### Custom Storage Backends

```typescript
// Implement custom storage
class CloudDebugStorage {
  async saveToCloud(state: DebugState): Promise<void> {
    const response = await fetch('/api/debug/save', {
      method: 'POST',
      body: JSON.stringify(state)
    });

    if (!response.ok) {
      throw new Error('Failed to save to cloud');
    }
  }

  async loadFromCloud(): Promise<DebugState | null> {
    const response = await fetch('/api/debug/load');
    return response.ok ? await response.json() : null;
  }
}
```

---

## See Also

- [User Guide](./performance-debug-guide.md) - End-user documentation
- [Troubleshooting Guide](./performance-troubleshooting.md) - Common issues and solutions
- [Quick Reference](./debug-quick-reference.md) - Shortcuts and presets
