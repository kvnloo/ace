# ACE Architecture

## System Overview

ACE is a React-based 3D visualization application built on Three.js, designed for high-performance rendering of complex sports facility environments.

```
┌─────────────────────────────────────────────────┐
│                 React App                       │
│  ┌───────────┐  ┌──────────┐  ┌──────────────┐ │
│  │    UI     │  │  Three   │  │   Loading    │ │
│  │ Components│  │  Scene   │  │   System     │ │
│  └───────────┘  └──────────┘  └──────────────┘ │
└─────────────────────────────────────────────────┘
         │              │               │
         ▼              ▼               ▼
┌─────────────────────────────────────────────────┐
│              Core Services                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐ │
│  │ Asset    │  │ Instance │  │   Camera     │ │
│  │ Loader   │  │ Manager  │  │   Controls   │ │
│  └──────────┘  └──────────┘  └──────────────┘ │
└─────────────────────────────────────────────────┘
```

## Core Components

### 1. Scene Management (`src/components/ThreeScene.tsx`)

Primary 3D scene container responsible for:
- Canvas initialization and WebGL context management
- Camera setup and controls
- Lighting configuration
- Performance monitoring

**Key Design Decisions:**
- Uses React Three Fiber for declarative 3D scene management
- Implements instanced rendering for performance
- Defers heavy rendering until scene is ready

### 2. Loading System

Multi-phase loading with progress tracking:

```
Phase 1: Initializing (0-20%)
  ├─ WebGL context creation
  └─ Basic scene setup

Phase 2: Loading Assets (20-60%)
  ├─ Court models
  ├─ Textures
  └─ Materials

Phase 3: Building Scene (60-90%)
  ├─ Instance creation
  └─ Layout positioning

Phase 4: Finalizing (90-100%)
  ├─ Lighting setup
  └─ Post-processing
```

**Implementation:**
- `LoadingScreen.tsx` - Visual progress display
- `LoadingProgress.tsx` - Progress state management
- Batch loading to prevent UI freezes

### 3. Court Rendering

#### Instance Management
Courts use GPU instancing for performance:

```typescript
// Render 100+ courts efficiently
<InstancedMesh count={courtCount}>
  <boxGeometry args={[width, height, depth]} />
  <meshStandardMaterial color={surfaceColor} />
</InstancedMesh>
```

#### Court Types
- **Tennis Courts**: Full-size courts with nets and lines
- **Padel Courts**: Glass walls and unique layouts
- **Pickleball Courts**: Compact design with specific dimensions

### 4. Grass System (`src/components/GrassAdaptive.tsx`)

Realistic grass rendering with performance optimization:

**Features:**
- Density-based LOD (Level of Detail)
- Frustum culling for off-screen grass
- Adaptive blade count based on camera distance

**Density Monitoring:**
- Real-time density display
- Performance impact tracking
- Debug panel integration

### 5. Debug System

Developer tools for inspection and optimization:

```typescript
DebugPanel
├─ Performance Metrics (FPS, memory)
├─ Scene Statistics (draw calls, triangles)
├─ Grass Density Monitor
└─ Loading Progress Tracker
```

## Data Flow

```
User Action
    │
    ▼
UI Component
    │
    ▼
State Management (React Context/State)
    │
    ├─► Asset Loading
    │      │
    │      ▼
    │   Three.js Scene Update
    │      │
    │      ▼
    │   GPU Rendering
    │
    └─► Progress Updates
           │
           ▼
        Loading Screen
```

## Performance Optimizations

### 1. Instanced Rendering
- Reduces draw calls from 1000+ to single digits
- Uses GPU for transform calculations
- Supports thousands of objects

### 2. Batch Loading
- Asynchronous asset loading
- Progress tracking for UX
- Prevents UI blocking

### 3. Lazy Rendering
- Defers complex components until visible
- Uses Suspense boundaries
- Progressive enhancement approach

### 4. Frustum Culling
- Automatic with Three.js
- Custom culling for grass system
- Reduces unnecessary rendering

## File Structure

```
src/
├─ components/
│  ├─ ThreeScene.tsx          # Main 3D scene
│  ├─ InstancedTennisCourtsFull.tsx
│  ├─ GrassAdaptive.tsx
│  └─ debug/
│     ├─ DebugPanel.tsx
│     └─ GrassDensityMonitor.tsx
├─ contexts/
│  └─ LoadingContext.tsx      # Loading state management
└─ hooks/
   └─ useLoadingProgress.ts   # Progress tracking logic
```

## Technology Decisions

### Why React Three Fiber?
- Declarative 3D scene management
- Seamless React integration
- Strong TypeScript support
- Active ecosystem

### Why Instanced Rendering?
- GPU-efficient for many similar objects
- Maintains 60 FPS with 100+ courts
- Industry standard for large scenes

### Why Multi-Phase Loading?
- Better UX with progress feedback
- Prevents UI freezes
- Allows for graceful degradation

## Future Architecture

### Planned Improvements
1. **Worker-based asset loading** - Offload parsing to Web Workers
2. **Progressive streaming** - Stream large assets incrementally
3. **Level-of-detail system** - Dynamic quality based on viewport
4. **Virtual texturing** - Reduce memory footprint

### Scalability Considerations
- Current: ~100 courts, 60 FPS
- Target: 1000+ courts with dynamic LOD
- Memory budget: <2GB for full scene

## Debugging & Monitoring

### Performance Profiling
```bash
# Enable React DevTools Profiler
npm run dev

# Three.js stats
# Accessible via DebugPanel in development mode
```

### Common Issues

**Grass not rendering:**
- Check `GrassAdaptive` density settings
- Verify frustum culling is not too aggressive

**Low FPS:**
- Reduce instance counts
- Check draw call count in debug panel
- Profile with Chrome DevTools

**Loading hangs:**
- Check console for asset loading errors
- Verify network requests complete
- Inspect LoadingProgress state

## References

- Three.js: https://threejs.org/docs/
- React Three Fiber: https://docs.pmnd.rs/react-three-fiber/
- Detailed system docs: `claudedocs/architecture-detail/`
