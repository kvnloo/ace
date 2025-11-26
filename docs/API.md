# ACE Component API Reference

## Core Components

### ThreeScene

Main 3D scene container.

```typescript
import { ThreeScene } from './components/ThreeScene';

<ThreeScene />
```

**Props:** None (self-contained)

**Features:**
- WebGL canvas initialization
- Camera controls
- Lighting setup
- Court rendering
- Performance monitoring

---

### InstancedTennisCourtsFull

Renders multiple tennis courts using GPU instancing.

```typescript
import { InstancedTennisCourtsFull } from './components/InstancedTennisCourtsFull';

<InstancedTennisCourtsFull
  count={100}
  layout="grid"
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `count` | `number` | `100` | Number of court instances to render |
| `layout` | `'grid' \| 'circular'` | `'grid'` | Layout pattern for courts |

---

### GrassAdaptive

Adaptive grass rendering with density-based LOD.

```typescript
import { GrassAdaptive } from './components/GrassAdaptive';

<GrassAdaptive
  density={0.5}
  coverage="full"
  showMonitor={true}
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `density` | `number` | `0.5` | Grass density (0-1) |
| `coverage` | `'full' \| 'partial'` | `'full'` | Coverage area |
| `showMonitor` | `boolean` | `false` | Show density monitor |

---

### LoadingScreen

Multi-phase loading screen with progress.

```typescript
import { LoadingScreen } from './components/LoadingScreen';

<LoadingScreen
  progress={45}
  phase="loading_assets"
  message="Loading court models..."
/>
```

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `progress` | `number` | Yes | Progress percentage (0-100) |
| `phase` | `LoadingPhase` | Yes | Current loading phase |
| `message` | `string` | No | Custom loading message |

**LoadingPhase Type:**
```typescript
type LoadingPhase =
  | 'initializing'
  | 'loading_assets'
  | 'building_scene'
  | 'finalizing';
```

---

### DebugPanel

Developer debug panel for performance monitoring.

```typescript
import { DebugPanel } from './components/debug/DebugPanel';

<DebugPanel
  visible={true}
  position="top-right"
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | `boolean` | `false` | Panel visibility |
| `position` | `Position` | `'top-right'` | Panel position |

**Position Type:**
```typescript
type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
```

**Features:**
- FPS counter
- Draw call count
- Memory usage
- Triangle count

---

## Hooks

### useLoadingProgress

Hook for managing loading progress state.

```typescript
import { useLoadingProgress } from './hooks/useLoadingProgress';

function MyComponent() {
  const {
    progress,
    phase,
    updateProgress,
    setPhase
  } = useLoadingProgress();

  // Use loading state...
}
```

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| `progress` | `number` | Current progress (0-100) |
| `phase` | `LoadingPhase` | Current loading phase |
| `updateProgress` | `(value: number) => void` | Update progress |
| `setPhase` | `(phase: LoadingPhase) => void` | Set current phase |

---

### useThreePerformance

Hook for Three.js performance metrics.

```typescript
import { useThreePerformance } from './hooks/useThreePerformance';

function MyComponent() {
  const { fps, drawCalls, triangles, memory } = useThreePerformance();

  console.log(`FPS: ${fps}, Draw Calls: ${drawCalls}`);
}
```

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| `fps` | `number` | Current frames per second |
| `drawCalls` | `number` | Number of draw calls per frame |
| `triangles` | `number` | Total triangle count |
| `memory` | `number` | Memory usage in MB |

---

## Contexts

### LoadingContext

Global loading state management.

```typescript
import { LoadingProvider, useLoading } from './contexts/LoadingContext';

// Provider (wrap your app)
function App() {
  return (
    <LoadingProvider>
      <YourComponents />
    </LoadingProvider>
  );
}

// Consumer
function MyComponent() {
  const { isLoading, progress, phase } = useLoading();

  if (isLoading) {
    return <LoadingScreen progress={progress} phase={phase} />;
  }

  return <MainContent />;
}
```

**Context Value:**

| Property | Type | Description |
|----------|------|-------------|
| `isLoading` | `boolean` | Whether loading is in progress |
| `progress` | `number` | Current progress (0-100) |
| `phase` | `LoadingPhase` | Current loading phase |
| `startLoading` | `() => void` | Start loading sequence |
| `completeLoading` | `() => void` | Complete loading sequence |

---

## Utilities

### calculateCourtLayout

Calculate court positions for grid or circular layouts.

```typescript
import { calculateCourtLayout } from './utils/layoutUtils';

const positions = calculateCourtLayout({
  count: 100,
  layout: 'grid',
  spacing: 15
});
```

**Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `count` | `number` | Yes | Number of courts |
| `layout` | `'grid' \| 'circular'` | Yes | Layout type |
| `spacing` | `number` | No | Spacing between courts |

**Returns:** `Array<[x: number, y: number, z: number]>`

---

### optimizeInstances

Optimize instance transforms for GPU rendering.

```typescript
import { optimizeInstances } from './utils/instanceUtils';

const optimized = optimizeInstances(instances);
```

**Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `instances` | `InstanceData[]` | Array of instance data |

**Returns:** `OptimizedInstanceData`

---

## Types

### Common Types

```typescript
// Loading phase
type LoadingPhase =
  | 'initializing'
  | 'loading_assets'
  | 'building_scene'
  | 'finalizing';

// Court layout
type CourtLayout = 'grid' | 'circular';

// Position
type Position3D = [x: number, y: number, z: number];

// Instance data
interface InstanceData {
  position: Position3D;
  rotation: Position3D;
  scale: number | Position3D;
}

// Performance metrics
interface PerformanceMetrics {
  fps: number;
  drawCalls: number;
  triangles: number;
  memory: number;
}
```

---

## Examples

### Basic Scene Setup

```typescript
import { Canvas } from '@react-three/fiber';
import { ThreeScene } from './components/ThreeScene';

function App() {
  return (
    <Canvas>
      <ThreeScene />
    </Canvas>
  );
}
```

### With Loading Screen

```typescript
import { Suspense } from 'react';
import { LoadingScreen } from './components/LoadingScreen';
import { ThreeScene } from './components/ThreeScene';

function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <ThreeScene />
    </Suspense>
  );
}
```

### With Debug Tools

```typescript
import { ThreeScene } from './components/ThreeScene';
import { DebugPanel } from './components/debug/DebugPanel';

function App() {
  return (
    <>
      <ThreeScene />
      {import.meta.env.DEV && <DebugPanel visible={true} />}
    </>
  );
}
```

---

For more detailed examples and advanced usage, see `claudedocs/`.
