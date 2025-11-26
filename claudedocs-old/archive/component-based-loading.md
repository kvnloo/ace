# Component-Based Progressive Loading System

## Overview

The AssetLoader and AssetRegistry now work with **React component rendering** instead of file loading. All assets are React components built with Three.js - there are no external asset files to load.

## Key Concept

**Progressive Rendering**: Components conditionally render based on their enabled state in the AssetRegistry. The AssetLoader enables components in phases, monitoring FPS after each component renders.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       AssetLoader                            │
│  - Manages loading phases (ESSENTIAL → ENHANCED)            │
│  - Enables assets in AssetRegistry progressively            │
│  - Monitors FPS after each enable                           │
│  - Auto-degrades on performance issues                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ enable(assetId)
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    AssetRegistry                             │
│  - Stores asset definitions and state                       │
│  - Tracks enabled/disabled state per asset                  │
│  - Handles dependency chains                                │
│  - Provides enable/disable methods                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ isEnabled(assetId) polling
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  useAssetEnabled Hook                        │
│  - Polls AssetRegistry for enabled state                    │
│  - Triggers React re-render when state changes              │
│  - Returns boolean: should component render?                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ return isEnabled ? <Component> : null
                     ▼
┌─────────────────────────────────────────────────────────────┐
│               React Three Fiber Component                    │
│  - Uses useAssetEnabled(id) to check state                  │
│  - Returns null when disabled                               │
│  - Renders 3D content when enabled                          │
└─────────────────────────────────────────────────────────────┘
```

## Loading Flow

### 1. Initial State
```tsx
// All components start disabled by default
assetRegistry.get('tennis-court-1').enabled = false;
assetRegistry.get('grass-blades').enabled = false;
assetRegistry.get('robotic-mowers').enabled = false;
```

### 2. AssetLoader Starts
```tsx
const loader = new AssetLoader(assetRegistry, debugContext);
await loader.start();
// → Begins phase-based progressive enabling
```

### 3. Phase ESSENTIAL
```tsx
// AssetLoader enables essential assets
assetRegistry.enable('tennis-court-1'); // ✅ Enabled
assetRegistry.enable('tennis-court-2'); // ✅ Enabled
// ... other essential assets

// Wait for React render
await waitForRender();

// Monitor FPS
const fps = getCurrentFPS(); // e.g., 58
if (fps >= targetFPS) {
  // ✅ Continue to next phase
} else {
  // ⚠️ Auto-degradation or skip to minimal mode
}
```

### 4. Components React
```tsx
function TennisCourt({ id }) {
  const isEnabled = useAssetEnabled(id);
  // isEnabled changes from false → true
  // Component re-renders and returns mesh

  if (!isEnabled) return null; // Before: returned null
  return <mesh>...</mesh>;      // Now: renders
}
```

### 5. Subsequent Phases
```tsx
// Phase CORE
assetRegistry.enable('court-lines');
assetRegistry.enable('court-net');

// Phase VISUAL
assetRegistry.enable('grass-blades');
assetRegistry.enable('lighting');

// Phase ENHANCED
assetRegistry.enable('robotic-mowers');
assetRegistry.enable('weather-particles');
```

## Component Integration

### Basic Pattern
```tsx
import { useAssetEnabled } from '@/hooks/useAssetEnabled';

function TennisCourt({ id = 'tennis-court-1' }) {
  const isEnabled = useAssetEnabled(id);

  if (!isEnabled) {
    return null; // Don't render until AssetLoader enables
  }

  return (
    <group>
      <mesh>
        <boxGeometry args={[23.77, 0.1, 10.97]} />
        <meshStandardMaterial color="#2d5a3d" />
      </mesh>
    </group>
  );
}
```

### Multi-Dependency Pattern
```tsx
function CourtLines() {
  const allCourtsEnabled = useAssetsEnabled([
    'tennis-court-1',
    'tennis-court-2',
    'tennis-court-3',
    'tennis-court-4'
  ]);

  if (!allCourtsEnabled) return null;

  return <LineMarkings />;
}
```

### Progressive Detail Pattern
```tsx
function GrassSystem() {
  const bladesEnabled = useAssetEnabled('grass-blades');
  const physicsEnabled = useAssetEnabled('grass-physics');
  const mowersEnabled = useAssetEnabled('robotic-mowers');

  if (!bladesEnabled) return null;

  return (
    <group>
      <GrassBlades />
      {physicsEnabled && <GrassPhysics />}
      {mowersEnabled && <RoboticMowers />}
    </group>
  );
}
```

## Performance Monitoring

### FPS-Based Auto-Degradation
```tsx
// AssetLoader configuration
const loader = new AssetLoader(assetRegistry, debugContext, {
  autoDegradation: true,
  minimalModeThreshold: 30,
  fpsThresholds: new Map([
    [LoadingPhase.ESSENTIAL, 60],
    [LoadingPhase.CORE, 50],
    [LoadingPhase.VISUAL, 45],
    [LoadingPhase.ENHANCED, 40]
  ])
});

// If FPS drops below threshold during a phase:
// 1. Skip remaining assets in current phase
// 2. Skip all subsequent phases
// 3. Return to ESSENTIAL phase only
```

### Per-Asset FPS Monitoring
```tsx
// After enabling each asset:
1. registry.enable('asset-id')
2. waitForRender() // 2 animation frames
3. currentFPS = getCurrentFPS()
4. if (currentFPS < targetFPS * 0.8) {
     console.warn('Performance impact detected')
   }
5. if (currentFPS < minimalModeThreshold) {
     registry.disable('asset-id') // Auto-disable
     throw error
   }
```

## Asset Definition

### Adding New Assets
```tsx
// 1. Define in assetDefinitions.ts
{
  id: 'new-component',
  name: 'New Component',
  type: 'building',
  description: 'My new 3D component',
  performanceCost: 5, // 1-10 scale
  dependencies: ['required-asset-id'],
  defaultEnabled: false,
  componentPath: 'components/NewComponent'
}

// 2. Create React component
function NewComponent() {
  const isEnabled = useAssetEnabled('new-component');
  if (!isEnabled) return null;
  return <mesh>...</mesh>;
}

// 3. Add to loading phase
// Edit src/services/loading/phases.ts
{
  phase: LoadingPhase.VISUAL,
  assets: [
    'existing-asset',
    'new-component' // ← Add here
  ]
}
```

## Debugging

### Check Asset State
```tsx
// In browser console
window.assetRegistry.get('tennis-court-1');
// → { id: 'tennis-court-1', enabled: true, ... }

window.assetRegistry.isEnabled('grass-blades');
// → true/false

window.assetRegistry.getStats();
// → { total: 40, enabled: 25, disabled: 15, ... }
```

### Debug Overlay Component
```tsx
import { AssetDebugOverlay } from '@/components/examples/ProgressiveComponent.example';

function Scene() {
  return (
    <>
      <Canvas>...</Canvas>
      <AssetDebugOverlay assetId="tennis-court-1" />
    </>
  );
}
```

### Loading Progress
```tsx
const loader = new AssetLoader(assetRegistry, debugContext, {
  onProgress: (progress) => {
    console.log(`Loading: ${progress.totalProgress.toFixed(1)}%`);
    console.log(`Phase: ${progress.currentPhase}`);
    console.log(`Assets: ${progress.assets.size}`);
  },
  onPhaseComplete: (result) => {
    console.log(`✅ ${result.phase} complete`);
    console.log(`   FPS: ${result.averageFPS}`);
    console.log(`   Duration: ${result.duration}s`);
  }
});
```

## Key Files

| File | Purpose |
|------|---------|
| `src/services/loading/AssetLoader.ts` | Progressive loading orchestrator |
| `src/utils/debug/assetRegistry.ts` | Asset state management |
| `src/utils/debug/assetDefinitions.ts` | Asset catalog |
| `src/hooks/useAssetEnabled.ts` | React hook for components |
| `src/services/loading/phases.ts` | Loading phase definitions |
| `src/components/examples/ProgressiveComponent.example.tsx` | Integration examples |

## Migration Guide

### Old Approach (File Loading)
```tsx
// ❌ Don't do this anymore
const model = await loader.loadGLTF('/assets/court.glb');
scene.add(model);
```

### New Approach (Component Enabling)
```tsx
// ✅ Do this instead
function TennisCourt({ id }) {
  const isEnabled = useAssetEnabled(id);
  if (!isEnabled) return null;
  return <mesh>...</mesh>; // Built with Three.js primitives
}
```

## Benefits

1. **No File I/O**: All assets are code, no network requests
2. **Progressive Rendering**: Smooth performance during load
3. **FPS Monitoring**: Real-time performance feedback
4. **Auto-Degradation**: Gracefully handles low-end devices
5. **Dependency Management**: Automatic dependency resolution
6. **Hot Reload**: Vite HMR works seamlessly
7. **Type Safety**: Full TypeScript support

## Examples

See `src/components/examples/ProgressiveComponent.example.tsx` for complete working examples of:
- Simple single-asset components
- Multi-dependency components
- Progressive detail levels
- Debug overlays
- Fallback rendering
