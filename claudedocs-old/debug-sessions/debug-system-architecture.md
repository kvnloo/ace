# 3D Performance Debug System Architecture

**Version:** 1.0.0
**Last Updated:** 2025-11-22
**Status:** Design Phase
**Author:** System Architect Agent

## Executive Summary

This document defines the architecture for a comprehensive 3D asset debugging system designed to isolate and measure the performance impact of individual 3D components in the ACE Tennis Facility visualization. The system enables developers to systematically identify performance bottlenecks by toggling assets on/off and measuring their individual contributions to frame rate, memory usage, and render time.

### Key Capabilities

- **Granular Asset Control**: Toggle individual 3D assets (courts, grass, lighting, effects, facilities)
- **Real-time Performance Metrics**: Track FPS, memory usage, render time, triangle count
- **Preset Configurations**: Quick access to common debugging scenarios (All Off, Baseline, Single Asset)
- **Performance Comparison**: Side-by-side comparison of asset performance impact
- **Persistent Settings**: Save and restore debug configurations across sessions
- **Export Reports**: Generate detailed performance analysis reports

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Component Design](#component-design)
4. [Asset Registry System](#asset-registry-system)
5. [Debug Context Provider](#debug-context-provider)
6. [Debug UI Panel](#debug-ui-panel)
7. [Performance Tracking](#performance-tracking)
8. [Integration Strategy](#integration-strategy)
9. [Data Flow](#data-flow)
10. [File Structure](#file-structure)
11. [Migration Plan](#migration-plan)
12. [Performance Baseline Methodology](#performance-baseline-methodology)

---

## System Overview

### Architecture Goals

1. **Zero Performance Impact When Disabled**: Debug system adds no overhead to production builds
2. **Minimal Refactoring Required**: Integrate with existing components via wrapper pattern
3. **Developer-Friendly**: Intuitive UI, keyboard shortcuts, clear metrics
4. **Comprehensive Coverage**: Track all significant 3D assets in the scene
5. **Actionable Insights**: Clear correlation between assets and performance metrics

### Core Principles

- **Composition over Modification**: Wrap existing components, don't modify them
- **Opt-in Performance Tracking**: Assets only tracked when debug mode active
- **Immutable Asset Registry**: Asset definitions are static, state is dynamic
- **Single Source of Truth**: Debug context manages all debug-related state
- **Progressive Enhancement**: System works at multiple levels (disabled → basic → advanced)

---

## Architecture Diagram

### System Component Interaction

```
┌────────────────────────────────────────────────────────────────────────┐
│                          USER INTERFACE LAYER                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                      DebugPanel Component                        │  │
│  │  ┌────────────────┐  ┌──────────────────┐  ┌─────────────────┐  │  │
│  │  │ Asset Toggle   │  │ Performance      │  │ Preset Controls │  │  │
│  │  │ Controls       │  │ Metrics Display  │  │ (All On/Off)    │  │  │
│  │  │ - Checkboxes   │  │ - FPS Graph      │  │ - Baseline      │  │  │
│  │  │ - Categories   │  │ - Memory Usage   │  │ - Single Asset  │  │  │
│  │  │ - Search       │  │ - Render Time    │  │ - Export Report │  │  │
│  │  └────────────────┘  └──────────────────┘  └─────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                  ↕                                      │
│                    [Keyboard Shortcut: Ctrl+Shift+D]                   │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌────────────────────────────────────────────────────────────────────────┐
│                        STATE MANAGEMENT LAYER                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    DebugContext Provider                         │  │
│  │  ┌────────────────────────────────────────────────────────────┐  │  │
│  │  │ State Management                                           │  │  │
│  │  │ - assetRegistry: Map<AssetId, AssetDefinition>             │  │  │
│  │  │ - assetStates: Map<AssetId, AssetState>                    │  │  │
│  │  │ - performanceMetrics: PerformanceSnapshot[]                │  │  │
│  │  │ - debugEnabled: boolean                                    │  │  │
│  │  │ - activePreset: PresetId                                   │  │  │
│  │  └────────────────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────────────────┐  │  │
│  │  │ Actions                                                    │  │  │
│  │  │ - toggleAsset(id)                                          │  │  │
│  │  │ - toggleCategory(category)                                 │  │  │
│  │  │ - applyPreset(preset)                                      │  │  │
│  │  │ - recordMetrics(snapshot)                                  │  │  │
│  │  │ - exportReport()                                           │  │  │
│  │  └────────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                  ↕                                      │
│                        [localStorage persistence]                      │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌────────────────────────────────────────────────────────────────────────┐
│                        3D RENDERING LAYER                              │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                      ThreeScene Component                        │  │
│  │                                                                  │  │
│  │  [Reads debugContext.assetStates before rendering each asset]   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                  ↓                                      │
│  ┌─────────────┬──────────────┬─────────────┬──────────────────────┐  │
│  │ Court Assets│ Facility     │ Effects     │ Environment          │  │
│  ├─────────────┼──────────────┼─────────────┼──────────────────────┤  │
│  │ TennisCourt │ ReceptionArea│ Grass       │ Lighting (Ambient,   │  │
│  │ - Hard (6)  │ ParkingLot   │ ClayEffect  │  Directional, Spot)  │  │
│  │ - Clay (6)  │ LockerRooms  │ Weather     │ Sky/Environment      │  │
│  │ - Grass (6) │ BMSControl   │ Particles   │ Shadows              │  │
│  │ - Wood (6)  │ Mechanical   │             │ Post-processing      │  │
│  │ - Net       │ Hydroponics  │             │                      │  │
│  │ - Bleachers │ TransportPods│             │                      │  │
│  └─────────────┴──────────────┴─────────────┴──────────────────────┘  │
│                                  ↓                                      │
│              [Each asset wrapped in <ConditionalAsset>]                │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌────────────────────────────────────────────────────────────────────────┐
│                    PERFORMANCE MONITORING LAYER                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                  PerformanceTracker System                       │  │
│  │  ┌────────────────────────────────────────────────────────────┐  │  │
│  │  │ Metrics Collection (per frame)                             │  │  │
│  │  │ - FPS (via requestAnimationFrame)                          │  │  │
│  │  │ - Memory (performance.memory API)                          │  │  │
│  │  │ - Render Time (performance.mark/measure)                   │  │  │
│  │  │ - Triangle Count (THREE.WebGLRenderer.info)                │  │  │
│  │  │ - Draw Calls (renderer.info.render.calls)                  │  │  │
│  │  └────────────────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────────────────┐  │  │
│  │  │ Analysis                                                   │  │  │
│  │  │ - Baseline Performance (no assets)                         │  │  │
│  │  │ - Per-Asset Delta (asset impact)                           │  │  │
│  │  │ - Combined Load (multiple assets)                          │  │  │
│  │  │ - Trend Analysis (performance over time)                   │  │  │
│  │  └────────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Flow Sequence

```
User Action → Debug Context → Asset Registry → Render Decision
     ↓              ↓              ↓                 ↓
Toggle Asset → Update State → Check Enabled → Render/Skip
     ↓              ↓              ↓                 ↓
     └──────────────┴──────────────┴─────────────────┘
                    ↓
           Performance Tracker
                    ↓
           Metrics Dashboard
```

---

## Component Design

### 1. Asset Registry System

**Purpose**: Central database of all 3D assets in the scene with metadata for categorization and performance estimation.

**File**: `src/utils/debug/assetRegistry.ts`

#### Asset Definition Schema

```typescript
export interface AssetDefinition {
  id: string;                          // Unique identifier (e.g., "court-hard-1")
  name: string;                        // Human-readable name
  category: AssetCategory;             // Categorization for grouping
  component: string;                   // Component name (e.g., "TennisCourt")
  estimatedCost: PerformanceCost;      // Expected performance impact
  dependencies: string[];              // Other assets this depends on
  tags: string[];                      // Additional metadata (searchable)
  defaultEnabled: boolean;             // Initial state
}

export type AssetCategory =
  | 'court'           // Tennis courts and nets
  | 'facility'        // Buildings and rooms
  | 'vegetation'      // Grass, trees, plants
  | 'lighting'        // Lights and shadows
  | 'effects'         // Particle effects, weather
  | 'environment'     // Sky, ground plane, ambient
  | 'ui'              // 3D UI elements, annotations
  | 'infrastructure'; // Transport, mechanical systems

export interface PerformanceCost {
  triangles: number;      // Estimated polygon count
  drawCalls: number;      // Number of draw calls
  memoryMB: number;       // Approximate memory usage
  complexity: 'low' | 'medium' | 'high' | 'critical';
}
```

#### Asset Registry Implementation

```typescript
export class AssetRegistry {
  private assets: Map<string, AssetDefinition> = new Map();
  private categories: Map<AssetCategory, Set<string>> = new Map();

  register(asset: AssetDefinition): void {
    this.assets.set(asset.id, asset);

    if (!this.categories.has(asset.category)) {
      this.categories.set(asset.category, new Set());
    }
    this.categories.get(asset.category)!.add(asset.id);
  }

  get(id: string): AssetDefinition | undefined {
    return this.assets.get(id);
  }

  getByCategory(category: AssetCategory): AssetDefinition[] {
    const ids = this.categories.get(category) || new Set();
    return Array.from(ids).map(id => this.assets.get(id)!);
  }

  getAll(): AssetDefinition[] {
    return Array.from(this.assets.values());
  }

  search(query: string): AssetDefinition[] {
    const lowerQuery = query.toLowerCase();
    return this.getAll().filter(asset =>
      asset.name.toLowerCase().includes(lowerQuery) ||
      asset.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  // Get total estimated cost for a set of assets
  estimateCost(assetIds: string[]): PerformanceCost {
    return assetIds.reduce((total, id) => {
      const asset = this.assets.get(id);
      if (!asset) return total;

      return {
        triangles: total.triangles + asset.estimatedCost.triangles,
        drawCalls: total.drawCalls + asset.estimatedCost.drawCalls,
        memoryMB: total.memoryMB + asset.estimatedCost.memoryMB,
        complexity: this.maxComplexity(total.complexity, asset.estimatedCost.complexity)
      };
    }, { triangles: 0, drawCalls: 0, memoryMB: 0, complexity: 'low' as const });
  }

  private maxComplexity(a: string, b: string): 'low' | 'medium' | 'high' | 'critical' {
    const levels = ['low', 'medium', 'high', 'critical'];
    const maxLevel = Math.max(levels.indexOf(a), levels.indexOf(b));
    return levels[maxLevel] as any;
  }
}
```

#### Asset Registration (Pre-populated Registry)

```typescript
// src/utils/debug/assetDefinitions.ts
export const ASSET_DEFINITIONS: AssetDefinition[] = [
  // === COURTS ===
  {
    id: 'court-hard-1',
    name: 'Hard Court #1',
    category: 'court',
    component: 'TennisCourt',
    estimatedCost: { triangles: 2000, drawCalls: 5, memoryMB: 2, complexity: 'medium' },
    dependencies: ['net-hard-1'],
    tags: ['tennis', 'hard-court', 'ground-floor'],
    defaultEnabled: true
  },
  // ... (6 hard courts)

  {
    id: 'court-clay-1',
    name: 'Clay Court #1',
    category: 'court',
    component: 'TennisCourt',
    estimatedCost: { triangles: 3500, drawCalls: 8, memoryMB: 4, complexity: 'high' },
    dependencies: ['net-clay-1', 'effect-clay-1'],
    tags: ['tennis', 'clay-court', 'ground-floor', 'particle-effects'],
    defaultEnabled: true
  },
  // ... (6 clay courts)

  {
    id: 'court-grass-1',
    name: 'Grass Court #1',
    category: 'court',
    component: 'TennisCourt',
    estimatedCost: { triangles: 15000, drawCalls: 12, memoryMB: 8, complexity: 'critical' },
    dependencies: ['net-grass-1', 'vegetation-grass-1'],
    tags: ['tennis', 'grass-court', 'ground-floor', 'vegetation'],
    defaultEnabled: true
  },
  // ... (6 grass courts)

  // === VEGETATION ===
  {
    id: 'vegetation-grass-1',
    name: 'Grass Effect (Court #1)',
    category: 'vegetation',
    component: 'Grass',
    estimatedCost: { triangles: 12000, drawCalls: 8, memoryMB: 6, complexity: 'critical' },
    dependencies: [],
    tags: ['grass', 'vegetation', 'instanced-mesh'],
    defaultEnabled: true
  },

  {
    id: 'effect-clay-1',
    name: 'Clay Texture Effect (Court #1)',
    category: 'effects',
    component: 'ClayCourtEffect',
    estimatedCost: { triangles: 1000, drawCalls: 4, memoryMB: 3, complexity: 'medium' },
    dependencies: [],
    tags: ['clay', 'texture', 'shader'],
    defaultEnabled: true
  },

  // === FACILITIES ===
  {
    id: 'facility-reception',
    name: 'Reception Area',
    category: 'facility',
    component: 'ReceptionArea',
    estimatedCost: { triangles: 8000, drawCalls: 15, memoryMB: 10, complexity: 'high' },
    dependencies: [],
    tags: ['building', 'reception', 'interior'],
    defaultEnabled: true
  },

  {
    id: 'facility-parking',
    name: 'Parking Lot',
    category: 'facility',
    component: 'ParkingLot',
    estimatedCost: { triangles: 5000, drawCalls: 10, memoryMB: 6, complexity: 'medium' },
    dependencies: [],
    tags: ['exterior', 'parking', 'infrastructure'],
    defaultEnabled: true
  },

  {
    id: 'facility-lockers-ground',
    name: 'Locker Rooms (Ground)',
    category: 'facility',
    component: 'LockerRoom',
    estimatedCost: { triangles: 6000, drawCalls: 12, memoryMB: 8, complexity: 'high' },
    dependencies: [],
    tags: ['locker-room', 'interior', 'ground-floor'],
    defaultEnabled: true
  },

  {
    id: 'facility-bms',
    name: 'BMS Control Room',
    category: 'facility',
    component: 'BMSControlRoom',
    estimatedCost: { triangles: 7000, drawCalls: 18, memoryMB: 12, complexity: 'high' },
    dependencies: [],
    tags: ['control-room', 'mechanical', 'level-1'],
    defaultEnabled: true
  },

  {
    id: 'facility-mechanical',
    name: 'Mechanical Rooms',
    category: 'facility',
    component: 'MechanicalRooms',
    estimatedCost: { triangles: 10000, drawCalls: 20, memoryMB: 15, complexity: 'critical' },
    dependencies: [],
    tags: ['mechanical', 'infrastructure', 'level-1'],
    defaultEnabled: true
  },

  {
    id: 'facility-hydroponics-1',
    name: 'Hydroponics System #1',
    category: 'facility',
    component: 'HydroponicsSystem',
    estimatedCost: { triangles: 12000, drawCalls: 25, memoryMB: 18, complexity: 'critical' },
    dependencies: [],
    tags: ['hydroponics', 'vertical-farm', 'level-3'],
    defaultEnabled: true
  },
  // ... (4 hydroponics systems)

  {
    id: 'facility-grass-robotics',
    name: 'Robotic Grass System',
    category: 'infrastructure',
    component: 'RoboticGrassSystem',
    estimatedCost: { triangles: 15000, drawCalls: 30, memoryMB: 20, complexity: 'critical' },
    dependencies: [],
    tags: ['robotics', 'automation', 'level-3'],
    defaultEnabled: true
  },

  {
    id: 'facility-transport-pods',
    name: 'Transport Pods',
    category: 'infrastructure',
    component: 'TransportPods',
    estimatedCost: { triangles: 8000, drawCalls: 16, memoryMB: 10, complexity: 'high' },
    dependencies: [],
    tags: ['transport', 'pods', 'animation'],
    defaultEnabled: true
  },

  // === LIGHTING ===
  {
    id: 'lighting-ambient',
    name: 'Ambient Light',
    category: 'lighting',
    component: 'ambientLight',
    estimatedCost: { triangles: 0, drawCalls: 1, memoryMB: 0.1, complexity: 'low' },
    dependencies: [],
    tags: ['lighting', 'ambient'],
    defaultEnabled: true
  },

  {
    id: 'lighting-directional',
    name: 'Directional Light (Sun)',
    category: 'lighting',
    component: 'directionalLight',
    estimatedCost: { triangles: 0, drawCalls: 2, memoryMB: 0.5, complexity: 'medium' },
    dependencies: [],
    tags: ['lighting', 'sun', 'shadows'],
    defaultEnabled: true
  },

  {
    id: 'lighting-spots',
    name: 'Spot Lights (All)',
    category: 'lighting',
    component: 'spotLight',
    estimatedCost: { triangles: 0, drawCalls: 24, memoryMB: 2, complexity: 'high' },
    dependencies: [],
    tags: ['lighting', 'spot-lights', 'court-lighting'],
    defaultEnabled: true
  },

  // === ENVIRONMENT ===
  {
    id: 'env-sky',
    name: 'Sky / Environment',
    category: 'environment',
    component: 'Environment',
    estimatedCost: { triangles: 1000, drawCalls: 3, memoryMB: 5, complexity: 'medium' },
    dependencies: [],
    tags: ['sky', 'environment', 'hdri'],
    defaultEnabled: true
  },

  {
    id: 'env-ground',
    name: 'Ground Plane',
    category: 'environment',
    component: 'groundPlane',
    estimatedCost: { triangles: 2, drawCalls: 1, memoryMB: 0.5, complexity: 'low' },
    dependencies: [],
    tags: ['ground', 'plane', 'base'],
    defaultEnabled: true
  },

  {
    id: 'env-shadows',
    name: 'Contact Shadows',
    category: 'environment',
    component: 'ContactShadows',
    estimatedCost: { triangles: 0, drawCalls: 50, memoryMB: 3, complexity: 'high' },
    dependencies: ['lighting-directional'],
    tags: ['shadows', 'contact-shadows'],
    defaultEnabled: true
  },

  // === UI ELEMENTS ===
  {
    id: 'ui-grid',
    name: 'Debug Grid',
    category: 'ui',
    component: 'Grid',
    estimatedCost: { triangles: 100, drawCalls: 1, memoryMB: 0.2, complexity: 'low' },
    dependencies: [],
    tags: ['grid', 'debug', 'helpers'],
    defaultEnabled: false
  },

  {
    id: 'ui-annotations',
    name: 'Scene Annotations',
    category: 'ui',
    component: 'Html',
    estimatedCost: { triangles: 0, drawCalls: 20, memoryMB: 1, complexity: 'medium' },
    dependencies: [],
    tags: ['annotations', 'labels', 'measurements'],
    defaultEnabled: false
  }
];
```

---

### 2. Debug Context Provider

**Purpose**: React Context that manages global debug state, asset toggles, and performance metrics.

**File**: `src/contexts/DebugContext.tsx`

#### Context State Schema

```typescript
export interface AssetState {
  id: string;
  enabled: boolean;
  lastToggled: number;        // Timestamp
  performanceImpact?: PerformanceSnapshot;
}

export interface PerformanceSnapshot {
  timestamp: number;
  fps: number;
  memory: {
    used: number;             // MB
    total: number;            // MB
    percentage: number;
  };
  renderTime: number;         // ms per frame
  triangles: number;
  drawCalls: number;
  enabledAssets: string[];    // Asset IDs active during this snapshot
}

export interface DebugPreset {
  id: string;
  name: string;
  description: string;
  assetStates: Map<string, boolean>;
}

export interface DebugContextValue {
  // State
  debugEnabled: boolean;
  assetRegistry: AssetRegistry;
  assetStates: Map<string, AssetState>;
  performanceSnapshots: PerformanceSnapshot[];
  activePreset: string | null;

  // Asset Control
  toggleAsset: (id: string) => void;
  toggleCategory: (category: AssetCategory) => void;
  enableAsset: (id: string) => void;
  disableAsset: (id: string) => void;
  isAssetEnabled: (id: string) => boolean;

  // Preset Management
  applyPreset: (presetId: string) => void;
  savePreset: (name: string, description: string) => void;
  getPresets: () => DebugPreset[];

  // Performance Tracking
  recordSnapshot: (snapshot: PerformanceSnapshot) => void;
  getBaselineSnapshot: () => PerformanceSnapshot | null;
  getAssetImpact: (assetId: string) => PerformanceSnapshot | null;
  clearSnapshots: () => void;

  // Reports
  exportReport: () => string; // Returns JSON report

  // System Control
  toggleDebugMode: () => void;
  resetAll: () => void;
}
```

#### Context Provider Implementation

```typescript
export const DebugProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [debugEnabled, setDebugEnabled] = useState(() =>
    localStorage.getItem('debug-enabled') === 'true'
  );

  const [assetRegistry] = useState(() => {
    const registry = new AssetRegistry();
    ASSET_DEFINITIONS.forEach(asset => registry.register(asset));
    return registry;
  });

  const [assetStates, setAssetStates] = useState<Map<string, AssetState>>(() => {
    const saved = localStorage.getItem('debug-asset-states');
    if (saved) {
      return new Map(JSON.parse(saved));
    }

    // Initialize from registry defaults
    const states = new Map<string, AssetState>();
    assetRegistry.getAll().forEach(asset => {
      states.set(asset.id, {
        id: asset.id,
        enabled: asset.defaultEnabled,
        lastToggled: Date.now()
      });
    });
    return states;
  });

  const [performanceSnapshots, setPerformanceSnapshots] = useState<PerformanceSnapshot[]>([]);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem('debug-enabled', String(debugEnabled));
  }, [debugEnabled]);

  useEffect(() => {
    localStorage.setItem('debug-asset-states', JSON.stringify(Array.from(assetStates.entries())));
  }, [assetStates]);

  // Asset Control Actions
  const toggleAsset = useCallback((id: string) => {
    setAssetStates(prev => {
      const newStates = new Map(prev);
      const current = newStates.get(id);
      if (current) {
        newStates.set(id, {
          ...current,
          enabled: !current.enabled,
          lastToggled: Date.now()
        });
      }
      return newStates;
    });
    setActivePreset(null); // Clear preset when manually toggling
  }, []);

  const toggleCategory = useCallback((category: AssetCategory) => {
    const assets = assetRegistry.getByCategory(category);
    const allEnabled = assets.every(asset => assetStates.get(asset.id)?.enabled);

    setAssetStates(prev => {
      const newStates = new Map(prev);
      assets.forEach(asset => {
        const current = newStates.get(asset.id);
        if (current) {
          newStates.set(asset.id, {
            ...current,
            enabled: !allEnabled,
            lastToggled: Date.now()
          });
        }
      });
      return newStates;
    });
    setActivePreset(null);
  }, [assetRegistry, assetStates]);

  // Preset Management
  const applyPreset = useCallback((presetId: string) => {
    const preset = BUILTIN_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    setAssetStates(prev => {
      const newStates = new Map(prev);
      preset.assetStates.forEach((enabled, assetId) => {
        const current = newStates.get(assetId);
        if (current) {
          newStates.set(assetId, {
            ...current,
            enabled,
            lastToggled: Date.now()
          });
        }
      });
      return newStates;
    });
    setActivePreset(presetId);
  }, []);

  // Performance Tracking
  const recordSnapshot = useCallback((snapshot: PerformanceSnapshot) => {
    setPerformanceSnapshots(prev => [...prev, snapshot].slice(-100)); // Keep last 100
  }, []);

  const getBaselineSnapshot = useCallback(() => {
    return performanceSnapshots.find(s => s.enabledAssets.length === 0) || null;
  }, [performanceSnapshots]);

  const getAssetImpact = useCallback((assetId: string) => {
    return performanceSnapshots.find(s =>
      s.enabledAssets.length === 1 && s.enabledAssets[0] === assetId
    ) || null;
  }, [performanceSnapshots]);

  const value: DebugContextValue = {
    debugEnabled,
    assetRegistry,
    assetStates,
    performanceSnapshots,
    activePreset,
    toggleAsset,
    toggleCategory,
    enableAsset: (id) => { /* implementation */ },
    disableAsset: (id) => { /* implementation */ },
    isAssetEnabled: (id) => assetStates.get(id)?.enabled ?? false,
    applyPreset,
    savePreset: () => { /* implementation */ },
    getPresets: () => BUILTIN_PRESETS,
    recordSnapshot,
    getBaselineSnapshot,
    getAssetImpact,
    clearSnapshots: () => setPerformanceSnapshots([]),
    exportReport: () => { /* implementation */ },
    toggleDebugMode: () => setDebugEnabled(prev => !prev),
    resetAll: () => { /* implementation */ }
  };

  return (
    <DebugContext.Provider value={value}>
      {children}
    </DebugContext.Provider>
  );
};
```

#### Built-in Presets

```typescript
const BUILTIN_PRESETS: DebugPreset[] = [
  {
    id: 'all-off',
    name: 'All Off',
    description: 'Disable all assets for baseline performance',
    assetStates: new Map(
      ASSET_DEFINITIONS.map(asset => [asset.id, false])
    )
  },
  {
    id: 'all-on',
    name: 'All On',
    description: 'Enable all assets (default scene)',
    assetStates: new Map(
      ASSET_DEFINITIONS.map(asset => [asset.id, true])
    )
  },
  {
    id: 'baseline',
    name: 'Baseline (Env Only)',
    description: 'Only environment and lighting',
    assetStates: new Map(
      ASSET_DEFINITIONS.map(asset => [
        asset.id,
        ['environment', 'lighting'].includes(asset.category)
      ])
    )
  },
  {
    id: 'courts-only',
    name: 'Courts Only',
    description: 'Only tennis courts without facilities',
    assetStates: new Map(
      ASSET_DEFINITIONS.map(asset => [
        asset.id,
        asset.category === 'court' || asset.category === 'environment'
      ])
    )
  },
  {
    id: 'no-vegetation',
    name: 'No Vegetation',
    description: 'All assets except grass and plants',
    assetStates: new Map(
      ASSET_DEFINITIONS.map(asset => [
        asset.id,
        asset.category !== 'vegetation'
      ])
    )
  },
  {
    id: 'no-effects',
    name: 'No Effects',
    description: 'Disable particle effects and shaders',
    assetStates: new Map(
      ASSET_DEFINITIONS.map(asset => [
        asset.id,
        asset.category !== 'effects'
      ])
    )
  }
];
```

---

### 3. Debug UI Panel

**Purpose**: User interface for controlling debug system and viewing performance metrics.

**File**: `src/components/debug/DebugPanel.tsx`

#### UI Component Structure

```tsx
export const DebugPanel: React.FC = () => {
  const debug = useDebugContext();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'assets' | 'performance' | 'presets'>('assets');
  const [searchQuery, setSearchQuery] = useState('');

  // Keyboard shortcut: Ctrl+Shift+D
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (!debug.debugEnabled || !isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Debug (Ctrl+Shift+D)
      </button>
    );
  }

  const filteredAssets = searchQuery
    ? debug.assetRegistry.search(searchQuery)
    : debug.assetRegistry.getAll();

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-gray-900 text-white shadow-2xl z-50 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
        <h2 className="text-xl font-bold">3D Debug Panel</h2>
        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
          ✕
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        <Tab active={activeTab === 'assets'} onClick={() => setActiveTab('assets')}>
          Assets
        </Tab>
        <Tab active={activeTab === 'performance'} onClick={() => setActiveTab('performance')}>
          Performance
        </Tab>
        <Tab active={activeTab === 'presets'} onClick={() => setActiveTab('presets')}>
          Presets
        </Tab>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'assets' && (
          <AssetControls
            assets={filteredAssets}
            assetStates={debug.assetStates}
            onToggle={debug.toggleAsset}
            onCategoryToggle={debug.toggleCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}
        {activeTab === 'performance' && (
          <PerformanceMetrics
            snapshots={debug.performanceSnapshots}
            baseline={debug.getBaselineSnapshot()}
            assetRegistry={debug.assetRegistry}
          />
        )}
        {activeTab === 'presets' && (
          <PresetControls
            presets={debug.getPresets()}
            activePreset={debug.activePreset}
            onApply={debug.applyPreset}
            onExport={debug.exportReport}
          />
        )}
      </div>
    </div>
  );
};
```

#### Asset Controls Component

```tsx
const AssetControls: React.FC<{
  assets: AssetDefinition[];
  assetStates: Map<string, AssetState>;
  onToggle: (id: string) => void;
  onCategoryToggle: (category: AssetCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}> = ({ assets, assetStates, onToggle, onCategoryToggle, searchQuery, onSearchChange }) => {
  const groupedAssets = useMemo(() => {
    const groups = new Map<AssetCategory, AssetDefinition[]>();
    assets.forEach(asset => {
      if (!groups.has(asset.category)) {
        groups.set(asset.category, []);
      }
      groups.get(asset.category)!.push(asset);
    });
    return groups;
  }, [assets]);

  return (
    <div className="p-4 space-y-4">
      {/* Search */}
      <input
        type="text"
        placeholder="Search assets..."
        value={searchQuery}
        onChange={e => onSearchChange(e.target.value)}
        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded"
      />

      {/* Categories */}
      {Array.from(groupedAssets.entries()).map(([category, categoryAssets]) => {
        const allEnabled = categoryAssets.every(a => assetStates.get(a.id)?.enabled);
        const someEnabled = categoryAssets.some(a => assetStates.get(a.id)?.enabled);

        return (
          <div key={category} className="border border-gray-700 rounded">
            <button
              onClick={() => onCategoryToggle(category)}
              className="w-full p-3 bg-gray-800 hover:bg-gray-750 flex items-center justify-between"
            >
              <span className="font-semibold capitalize">{category}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">
                  {categoryAssets.filter(a => assetStates.get(a.id)?.enabled).length} / {categoryAssets.length}
                </span>
                <input
                  type="checkbox"
                  checked={allEnabled}
                  ref={input => {
                    if (input) input.indeterminate = someEnabled && !allEnabled;
                  }}
                  onChange={() => {}}
                  className="pointer-events-none"
                />
              </div>
            </button>

            <div className="p-2 space-y-1">
              {categoryAssets.map(asset => {
                const state = assetStates.get(asset.id);
                return (
                  <AssetToggle
                    key={asset.id}
                    asset={asset}
                    enabled={state?.enabled ?? false}
                    onToggle={() => onToggle(asset.id)}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
```

#### Performance Metrics Component

```tsx
const PerformanceMetrics: React.FC<{
  snapshots: PerformanceSnapshot[];
  baseline: PerformanceSnapshot | null;
  assetRegistry: AssetRegistry;
}> = ({ snapshots, baseline, assetRegistry }) => {
  const latestSnapshot = snapshots[snapshots.length - 1];

  const assetImpacts = useMemo(() => {
    if (!baseline || !latestSnapshot) return [];

    return assetRegistry.getAll().map(asset => {
      const impact = snapshots.find(s =>
        s.enabledAssets.length === 1 && s.enabledAssets[0] === asset.id
      );

      if (!impact) return null;

      return {
        asset,
        fpsDelta: baseline.fps - impact.fps,
        memoryDelta: impact.memory.used - baseline.memory.used,
        renderTimeDelta: impact.renderTime - baseline.renderTime
      };
    }).filter(Boolean);
  }, [snapshots, baseline, assetRegistry]);

  return (
    <div className="p-4 space-y-4">
      {/* Current Metrics */}
      {latestSnapshot && (
        <div className="bg-gray-800 rounded p-4">
          <h3 className="font-semibold mb-2">Current Performance</h3>
          <div className="grid grid-cols-2 gap-4">
            <Metric label="FPS" value={latestSnapshot.fps.toFixed(1)} />
            <Metric label="Memory" value={`${latestSnapshot.memory.used.toFixed(0)} MB`} />
            <Metric label="Render Time" value={`${latestSnapshot.renderTime.toFixed(2)} ms`} />
            <Metric label="Draw Calls" value={latestSnapshot.drawCalls} />
          </div>
        </div>
      )}

      {/* Baseline Comparison */}
      {baseline && latestSnapshot && (
        <div className="bg-gray-800 rounded p-4">
          <h3 className="font-semibold mb-2">vs Baseline</h3>
          <div className="space-y-2">
            <MetricDelta
              label="FPS"
              baseline={baseline.fps}
              current={latestSnapshot.fps}
              inverse
            />
            <MetricDelta
              label="Memory"
              baseline={baseline.memory.used}
              current={latestSnapshot.memory.used}
              unit="MB"
            />
          </div>
        </div>
      )}

      {/* Asset Impact Table */}
      {assetImpacts.length > 0 && (
        <div className="bg-gray-800 rounded p-4">
          <h3 className="font-semibold mb-2">Asset Performance Impact</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400">
                <th className="pb-2">Asset</th>
                <th className="pb-2">FPS</th>
                <th className="pb-2">Memory</th>
              </tr>
            </thead>
            <tbody>
              {assetImpacts
                .sort((a, b) => b.fpsDelta - a.fpsDelta)
                .slice(0, 10)
                .map(impact => (
                  <tr key={impact.asset.id} className="border-t border-gray-700">
                    <td className="py-1">{impact.asset.name}</td>
                    <td className={impact.fpsDelta > 5 ? 'text-red-400' : 'text-yellow-400'}>
                      -{impact.fpsDelta.toFixed(1)}
                    </td>
                    <td className="text-gray-300">
                      +{impact.memoryDelta.toFixed(1)} MB
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* FPS Graph */}
      <FPSGraph snapshots={snapshots.slice(-50)} />
    </div>
  );
};
```

---

### 4. Performance Tracking System

**Purpose**: Automated collection and analysis of performance metrics.

**File**: `src/utils/debug/performanceTracker.ts`

#### Performance Tracker Implementation

```typescript
export class PerformanceTracker {
  private frameCount = 0;
  private lastTime = performance.now();
  private fpsHistory: number[] = [];
  private rafId: number | null = null;
  private enabled = false;

  constructor(
    private onSnapshot: (snapshot: PerformanceSnapshot) => void,
    private getEnabledAssets: () => string[]
  ) {}

  start(): void {
    if (this.enabled) return;
    this.enabled = true;
    this.tick();
  }

  stop(): void {
    this.enabled = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private tick = (): void => {
    if (!this.enabled) return;

    const now = performance.now();
    const delta = now - this.lastTime;
    this.frameCount++;

    // Calculate FPS every second
    if (delta >= 1000) {
      const fps = (this.frameCount / delta) * 1000;
      this.fpsHistory.push(fps);

      // Collect snapshot every second
      const snapshot = this.collectSnapshot(fps);
      this.onSnapshot(snapshot);

      this.frameCount = 0;
      this.lastTime = now;
    }

    this.rafId = requestAnimationFrame(this.tick);
  };

  private collectSnapshot(fps: number): PerformanceSnapshot {
    const memory = this.getMemoryUsage();
    const renderTime = this.getRenderTime();
    const { triangles, drawCalls } = this.getRendererInfo();

    return {
      timestamp: Date.now(),
      fps,
      memory,
      renderTime,
      triangles,
      drawCalls,
      enabledAssets: this.getEnabledAssets()
    };
  }

  private getMemoryUsage(): { used: number; total: number; percentage: number } {
    if ('memory' in performance) {
      const mem = (performance as any).memory;
      const used = mem.usedJSHeapSize / (1024 * 1024);
      const total = mem.totalJSHeapSize / (1024 * 1024);
      return {
        used,
        total,
        percentage: (used / total) * 100
      };
    }
    return { used: 0, total: 0, percentage: 0 };
  }

  private getRenderTime(): number {
    const entries = performance.getEntriesByType('measure')
      .filter(e => e.name === 'three-render');

    if (entries.length > 0) {
      const latest = entries[entries.length - 1];
      return latest.duration;
    }
    return 0;
  }

  private getRendererInfo(): { triangles: number; drawCalls: number } {
    // This will be injected from ThreeScene via ref
    return window.__THREE_DEBUG_INFO__ || { triangles: 0, drawCalls: 0 };
  }
}
```

#### Integration with Three.js Renderer

```tsx
// In ThreeScene.tsx
const SceneMetrics: React.FC = () => {
  const { gl, scene } = useThree();
  const debug = useDebugContext();

  useFrame(() => {
    if (!debug.debugEnabled) return;

    // Mark start of render
    performance.mark('three-render-start');

    // Expose renderer info globally for performance tracker
    window.__THREE_DEBUG_INFO__ = {
      triangles: gl.info.render.triangles,
      drawCalls: gl.info.render.calls
    };

    // Mark end of render (actual render happens in useFrame)
    performance.mark('three-render-end');
    performance.measure('three-render', 'three-render-start', 'three-render-end');
  });

  return null;
};
```

---

## Integration Strategy

### Phase 1: Minimal Integration (Week 1)

**Goal**: Get basic asset toggling working without performance tracking.

**Steps**:
1. Create `DebugContext` with basic toggle functionality
2. Wrap `<App>` with `<DebugProvider>`
3. Create `<ConditionalAsset>` wrapper component
4. Manually wrap 2-3 test assets in ThreeScene.tsx
5. Create basic DebugPanel UI with checkboxes
6. Test toggle functionality

**Files Created**:
- `src/contexts/DebugContext.tsx` (basic version)
- `src/components/debug/DebugPanel.tsx` (basic UI)
- `src/components/debug/ConditionalAsset.tsx`
- `src/utils/debug/assetRegistry.ts`
- `src/types/debug.ts`

### Phase 2: Full Asset Coverage (Week 2)

**Goal**: Wrap all 3D assets with conditional rendering.

**Steps**:
1. Complete asset registry with all asset definitions
2. Systematically wrap all assets in ThreeScene.tsx
3. Implement category-based toggles
4. Add search functionality
5. Create all preset configurations
6. Test all toggles and presets

**Migration Pattern**:
```tsx
// Before:
<TennisCourt position={[0, 0, 0]} type="grass" />

// After:
<ConditionalAsset assetId="court-grass-1">
  <TennisCourt position={[0, 0, 0]} type="grass" />
</ConditionalAsset>
```

### Phase 3: Performance Tracking (Week 3)

**Goal**: Add automated performance measurement.

**Steps**:
1. Implement PerformanceTracker class
2. Integrate tracker with DebugContext
3. Add SceneMetrics component to Canvas
4. Create PerformanceMetrics UI component
5. Implement baseline measurement workflow
6. Add per-asset impact measurement
7. Create performance comparison tables

### Phase 4: Polish & Optimization (Week 4)

**Goal**: Refine UX and add advanced features.

**Steps**:
1. Add FPS graphs and visual metrics
2. Implement export/import of debug configurations
3. Add performance report generation
4. Optimize UI rendering (virtualization for long lists)
5. Add tooltips and help text
6. Create documentation and user guide
7. Performance audit of debug system itself

---

## Performance Baseline Methodology

### Baseline Measurement Process

**Step 1: Pure Baseline (No Assets)**
1. Apply "All Off" preset
2. Wait 5 seconds for stabilization
3. Record 10-second average of FPS, memory, render time
4. Save as `baseline-empty`

**Step 2: Environment Baseline**
1. Apply "Baseline (Env Only)" preset (lighting + environment)
2. Wait 5 seconds for stabilization
3. Record 10-second average
4. Save as `baseline-env`

**Step 3: Individual Asset Testing**
1. For each asset in registry:
   a. Start from Environment Baseline
   b. Enable ONLY the target asset
   c. Wait 3 seconds for stabilization
   d. Record 5-second average
   e. Calculate delta vs Environment Baseline
   f. Save impact data
   g. Disable asset

**Step 4: Category Testing**
1. For each category:
   a. Start from Environment Baseline
   b. Enable all assets in category
   c. Record metrics
   d. Calculate category impact

**Step 5: Full Scene Test**
1. Apply "All On" preset
2. Record metrics
3. Compare to sum of individual impacts (identify interaction effects)

### Performance Metrics to Track

**Core Metrics**:
- FPS (frames per second)
- Frame time (ms per frame)
- Memory usage (MB)
- Triangle count
- Draw calls

**Derived Metrics**:
- FPS delta from baseline
- Memory delta from baseline
- Performance cost per triangle
- Performance efficiency score

**Thresholds**:
```typescript
const PERFORMANCE_THRESHOLDS = {
  fps: {
    excellent: 60,
    good: 45,
    acceptable: 30,
    poor: 20,
    critical: 15
  },
  memory: {
    excellent: 100,   // MB
    good: 250,
    acceptable: 500,
    poor: 750,
    critical: 1000
  },
  renderTime: {
    excellent: 8,     // ms
    good: 16,
    acceptable: 33,   // 30 FPS target
    poor: 50,
    critical: 66
  }
};
```

---

## File Structure

```
src/
├── contexts/
│   └── DebugContext.tsx                  # Main debug state provider
│
├── components/
│   └── debug/
│       ├── DebugPanel.tsx                # Main debug UI panel
│       ├── AssetToggle.tsx               # Individual asset toggle component
│       ├── AssetControls.tsx             # Asset list and category controls
│       ├── PerformanceMetrics.tsx        # Performance metrics display
│       ├── PerformanceDelta.tsx          # Metric comparison component
│       ├── FPSGraph.tsx                  # FPS history graph
│       ├── PresetControls.tsx            # Preset selection UI
│       ├── ConditionalAsset.tsx          # Wrapper for conditional rendering
│       └── SceneMetrics.tsx              # Three.js metrics collector
│
├── utils/
│   └── debug/
│       ├── assetRegistry.ts              # Asset registry class
│       ├── assetDefinitions.ts           # Pre-populated asset data
│       ├── performanceTracker.ts         # Performance monitoring system
│       ├── debugStorage.ts               # localStorage utilities
│       ├── presets.ts                    # Built-in preset definitions
│       └── reportGenerator.ts            # Performance report export
│
├── types/
│   └── debug.ts                          # TypeScript type definitions
│
└── hooks/
    └── useDebugContext.ts                # Context consumer hook
```

---

## Migration Plan

### Current State Assessment

**ThreeScene.tsx Current Structure**:
- 24 Tennis Courts (6 of each type)
- 2 Locker Rooms
- 1 Reception Area
- 1 Parking Lot
- 1 BMS Control Room
- 1 Mechanical Rooms
- 4 Hydroponics Systems
- 1 Robotic Grass System
- 1 Transport Pods system
- Multiple lighting sources
- Environment components (sky, ground, shadows)
- Effects (grass, clay texture)

**Estimated Impact**: ~60-80 asset entries in registry

### Migration Steps (Detailed)

#### Step 1: Setup Infrastructure (Day 1-2)

```bash
# Create directory structure
mkdir -p src/contexts
mkdir -p src/components/debug
mkdir -p src/utils/debug
mkdir -p src/types

# Create files
touch src/contexts/DebugContext.tsx
touch src/components/debug/DebugPanel.tsx
touch src/components/debug/ConditionalAsset.tsx
touch src/utils/debug/assetRegistry.ts
touch src/utils/debug/assetDefinitions.ts
touch src/types/debug.ts
```

#### Step 2: Implement Core System (Day 3-4)

1. Write type definitions in `debug.ts`
2. Implement `AssetRegistry` class
3. Create initial asset definitions (subset)
4. Implement basic `DebugContext` (no performance tracking yet)
5. Create `ConditionalAsset` wrapper

#### Step 3: Create Basic UI (Day 5-6)

1. Implement `DebugPanel` shell with tabs
2. Create `AssetToggle` component
3. Wire up keyboard shortcut
4. Test with mock data

#### Step 4: First Integration Test (Day 7)

1. Wrap ThreeScene.tsx in DebugProvider
2. Wrap 3 test assets:
   - 1 Tennis Court
   - 1 Grass effect
   - 1 Facility (Reception)
3. Test toggle functionality
4. Verify no rendering issues

#### Step 5: Complete Asset Coverage (Day 8-12)

**Systematic Wrapping Strategy**:

```tsx
// Pattern for courts (24 total)
const courts = [
  // Hard courts
  { id: 'court-hard-1', position: [0, 0, 0], type: 'hard' as const },
  { id: 'court-hard-2', position: [15, 0, 0], type: 'hard' as const },
  // ... 4 more

  // Clay courts
  { id: 'court-clay-1', position: [0, 0, 25], type: 'clay' as const },
  // ... 5 more

  // Grass courts
  { id: 'court-grass-1', position: [0, 0, 50], type: 'grass' as const },
  // ... 5 more

  // Wood courts
  { id: 'court-wood-1', position: [0, 0, 75], type: 'wood' as const },
  // ... 5 more
];

return (
  <>
    {courts.map(court => (
      <ConditionalAsset key={court.id} assetId={court.id}>
        <TennisCourt position={court.position} type={court.type} />
      </ConditionalAsset>
    ))}
  </>
);
```

**Migration Checklist**:
- [ ] 24 Tennis Courts (all types)
- [ ] 24 Court Nets
- [ ] 6 Grass effects (for grass courts)
- [ ] 6 Clay effects (for clay courts)
- [ ] 48 Bleacher sections (2 per court)
- [ ] 2 Locker Rooms
- [ ] 1 Reception Area
- [ ] 1 Parking Lot
- [ ] 1 BMS Control Room
- [ ] 1 Mechanical Rooms
- [ ] 4 Hydroponics Systems
- [ ] 1 Robotic Grass System
- [ ] 1 Transport Pods
- [ ] Ambient Light
- [ ] Directional Light
- [ ] 24 Spot Lights (1 per court)
- [ ] Environment/Sky
- [ ] Ground Plane
- [ ] Contact Shadows
- [ ] Debug Grid (optional)
- [ ] Annotations (optional)

#### Step 6: Add Performance Tracking (Day 13-15)

1. Implement `PerformanceTracker` class
2. Create `SceneMetrics` component
3. Integrate tracker into DebugContext
4. Create `PerformanceMetrics` UI
5. Test metric collection accuracy

#### Step 7: Implement Presets (Day 16-17)

1. Define all built-in presets
2. Implement preset application logic
3. Create `PresetControls` UI
4. Add custom preset save/load
5. Test preset workflows

#### Step 8: Polish & Testing (Day 18-20)

1. Add FPS graph visualization
2. Implement export functionality
3. Add help tooltips
4. Performance test the debug system itself
5. Write user documentation
6. Final QA testing

### Rollback Plan

**If Issues Arise**:

1. **Rendering Issues**: Debug system can be disabled via toggle
2. **Performance Regression**: All wrapping is additive, no modifications to existing components
3. **Bugs in Debug System**: Debug system isolated in feature branch
4. **Complete Rollback**: Remove `<DebugProvider>`, remove `<ConditionalAsset>` wrappers

**Safety Measures**:
- Debug system disabled by default in production builds
- Feature flag: `process.env.NODE_ENV === 'development'`
- No modifications to core rendering logic
- All debug code tree-shakeable in production

---

## Acceptance Criteria

### Functional Requirements

✅ **Asset Control**:
- [ ] Can toggle individual assets on/off
- [ ] Can toggle entire categories
- [ ] Asset state persists across page reloads
- [ ] Changes reflect immediately in 3D scene

✅ **Performance Tracking**:
- [ ] FPS tracked and displayed in real-time
- [ ] Memory usage tracked
- [ ] Render time measured per frame
- [ ] Triangle count and draw calls tracked
- [ ] Baseline performance measured with no assets
- [ ] Per-asset performance impact calculated

✅ **UI/UX**:
- [ ] Debug panel accessible via Ctrl+Shift+D
- [ ] Panel can be collapsed/expanded
- [ ] Assets searchable by name/tag
- [ ] Categories visually grouped
- [ ] Performance metrics clearly visualized
- [ ] Preset buttons for quick configuration

✅ **Presets**:
- [ ] "All Off" preset works
- [ ] "All On" preset works
- [ ] "Baseline" preset works
- [ ] Custom presets can be saved
- [ ] Presets persist in localStorage

✅ **Reporting**:
- [ ] Can export performance report as JSON
- [ ] Report includes baseline and per-asset metrics
- [ ] Report human-readable and machine-parseable

### Performance Requirements

✅ **Debug System Overhead**:
- [ ] <1% FPS impact when disabled
- [ ] <5% FPS impact when enabled but not measuring
- [ ] <10% FPS impact during active measurement
- [ ] Debug UI renders at 60 FPS
- [ ] Asset list virtualized for >100 assets

### Integration Requirements

✅ **Codebase Integration**:
- [ ] No modifications to existing 3D component logic
- [ ] Wrapper pattern works with all component types
- [ ] Compatible with React 19 and Three.js
- [ ] TypeScript types fully defined
- [ ] No console errors or warnings

### Documentation Requirements

✅ **User Documentation**:
- [ ] README with usage instructions
- [ ] Architecture document (this file)
- [ ] Inline code comments
- [ ] Example workflows for common debugging tasks

---

## Future Enhancements (Post-MVP)

### Advanced Features

1. **Asset Dependency Visualization**
   - Graph view of asset dependencies
   - Highlight which assets depend on each other
   - Warn when disabling asset breaks dependencies

2. **Performance Profiles**
   - Save/load named performance profiles
   - Compare profiles side-by-side
   - Track performance changes over time

3. **Automated Performance Testing**
   - Regression detection
   - Performance budgets and alerts
   - CI/CD integration

4. **Enhanced Metrics**
   - GPU memory usage
   - Shader compilation time
   - Texture load time
   - Individual material performance

5. **Visual Debugging**
   - Wireframe mode toggle
   - Bounding box visualization
   - Frustum culling visualization
   - Overdraw detection

6. **Remote Debugging**
   - Share debug session URL
   - Real-time collaboration on debugging
   - Performance comparison across devices

### Optimization Ideas

1. **Smart Asset Loading**
   - Lazy load disabled assets
   - Preload based on enable probability
   - Progressive asset quality degradation

2. **Dynamic LOD Based on Performance**
   - Automatically reduce quality when FPS drops
   - User-configurable performance targets
   - Per-asset quality settings

3. **Performance Prediction**
   - ML model to predict asset impact
   - Suggest asset combinations within performance budget
   - Warn before enabling expensive assets

---

## Conclusion

This architecture provides a comprehensive, developer-friendly system for debugging 3D performance issues in the ACE Tennis Facility application. The design prioritizes:

- **Minimal disruption** to existing codebase
- **Zero performance cost** when disabled
- **Actionable insights** through clear metrics
- **Ease of use** via intuitive UI
- **Extensibility** for future enhancements

By following this architecture and migration plan, developers will be able to systematically identify performance bottlenecks, optimize asset loading, and maintain high frame rates across different hardware configurations.

The debug system transforms performance optimization from guesswork into data-driven decision-making, enabling the team to deliver a smooth, responsive 3D experience to all users.

---

**Next Steps**: Implementation begins with Phase 1 (Minimal Integration), targeting completion within 4 weeks following the detailed migration schedule above.
