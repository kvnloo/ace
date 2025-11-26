# Overlay Integration Guide

## Overview
This guide documents the overlays migrated from the enhance/3D branch and how to integrate them into the main application.

## Migrated Overlays

### 1. PerformanceOverlay Component
**Location**: `/src/components/PerformanceOverlay.tsx`

**Purpose**: Provides real-time FPS monitoring and performance controls.

**Features**:
- Live FPS counter with color-coded status (green ≥55, yellow ≥30, red <30)
- Performance mode selector (high/medium/low)
- Shadow quality controls
- Expandable/collapsible design
- Compact, non-intrusive UI

**Props**:
```typescript
interface PerformanceOverlayProps {
  performanceMode?: 'high' | 'medium' | 'low';
  onPerformanceModeChange?: (mode: 'high' | 'medium' | 'low') => void;
  shadowQuality?: ShadowQuality;
  onShadowQualityChange?: (quality: ShadowQuality) => void;
  showFPS?: boolean;
}
```

### 2. DebugPanel Component (Already Exists)
**Location**: `/src/components/debug/DebugPanel.tsx`

**Purpose**: Comprehensive debug panel for 3D asset management and performance monitoring.

**Features**:
- Draggable and resizable panel
- Asset enable/disable toggles
- Real-time performance metrics
- FPS history graph
- Performance presets
- Shadow quality controls
- Keyboard shortcuts (Ctrl+Shift+D, Ctrl+Shift+A, etc.)

### 3. ControlsOverlay (In ThreeScene)
**Location**: `/src/components/ThreeScene.tsx`

**Purpose**: Floor view selector and annotation controls.

**Current Features**:
- Floor level selector (L3, L2, L1, G, ALL)
- Annotation mode toggles (Clean, Labels, Measurements)

**Missing from enhance/3D**:
- ❌ FPS counter integration
- ❌ Performance mode selector
- ❌ Shadow quality toggle

## Integration Instructions

### Option 1: Add PerformanceOverlay to ThreeScene

Add the PerformanceOverlay component as a separate overlay in the ThreeScene:

```tsx
// In ThreeScene.tsx
import PerformanceOverlay from './PerformanceOverlay';

// Add state for performance controls
const [performanceMode, setPerformanceMode] = useState<'high' | 'medium' | 'low'>('high');
const [shadowQuality, setShadowQuality] = useState<ShadowQuality>('high');

// In the render, add the overlay
return (
  <div className="relative w-full h-full">
    {/* Existing ControlsOverlay */}
    <ControlsOverlay
      activeFloor={activeFloor}
      setActiveFloor={setActiveFloor}
      annotationMode={annotationMode}
      setAnnotationMode={setAnnotationMode}
    />

    {/* NEW: Add PerformanceOverlay */}
    <PerformanceOverlay
      performanceMode={performanceMode}
      onPerformanceModeChange={setPerformanceMode}
      shadowQuality={shadowQuality}
      onShadowQualityChange={setShadowQuality}
      showFPS={true}
    />

    {/* Canvas */}
    <Canvas shadows={shadowQuality !== 'low'} ...>
      {/* Scene content */}
    </Canvas>
  </div>
);
```

### Option 2: Extend ControlsOverlay

Alternatively, extend the existing ControlsOverlay with performance controls:

```tsx
// In ThreeScene.tsx ControlsOverlay component
const ControlsOverlay = ({
  activeFloor,
  setActiveFloor,
  annotationMode,
  setAnnotationMode,
  performanceMode,      // NEW
  setPerformanceMode,   // NEW
  currentFPS            // NEW
}: {
  activeFloor: FloorLevel,
  setActiveFloor: (f: FloorLevel) => void,
  annotationMode: AnnotationMode,
  setAnnotationMode: (m: AnnotationMode) => void,
  performanceMode: 'high' | 'medium' | 'low',     // NEW
  setPerformanceMode: (m: 'high' | 'medium' | 'low') => void,  // NEW
  currentFPS?: number  // NEW
}) => {
  return (
    <div className="absolute top-40 left-6 z-10 flex flex-col gap-4 pointer-events-none">

      {/* FPS Counter (NEW) */}
      {currentFPS !== undefined && (
        <div className="bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-white/10 pointer-events-auto shadow-2xl">
          <div className="text-xs font-bold text-white/80 uppercase tracking-wider">
            FPS: <span className={currentFPS < 30 ? 'text-red-500' : currentFPS < 50 ? 'text-yellow-500' : 'text-green-500'}>
              {Math.round(currentFPS)}
            </span>
          </div>
        </div>
      )}

      {/* Existing Floor Selector */}
      {/* ... */}

      {/* Performance Mode Selector (NEW) */}
      <div className="bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-white/10 pointer-events-auto shadow-2xl flex flex-col gap-1">
        <div className="px-4 py-2 text-xs font-bold text-white/80 uppercase tracking-wider border-b border-white/5 mb-1">
          Performance
        </div>
        <div className="flex gap-1 p-1">
          {(['low', 'medium', 'high'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setPerformanceMode(mode)}
              className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                performanceMode === mode
                  ? 'bg-tennis-yellow text-tennis-dark shadow-lg'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
        <div className="px-2 py-1 text-xs text-white/60">
          {performanceMode === 'high' && 'All effects, shadows, high quality'}
          {performanceMode === 'medium' && 'Balanced quality and performance'}
          {performanceMode === 'low' && 'Maximum FPS, reduced effects'}
        </div>
      </div>

      {/* Existing Annotation Toggles */}
      {/* ... */}
    </div>
  );
};
```

## Overlay Positioning

Current overlay positions:
- **ControlsOverlay**: Top-left (top-40, left-6)
- **PerformanceOverlay**: Top-right (top-6, right-6) - NEW
- **DebugPanel**: Bottom-right (as floating button/panel)
- **PerformanceMetrics**: Top-right (facility metrics, separate from 3D performance)

## Performance Impact

### FPS Monitoring
The FPS counter uses `requestAnimationFrame` and has minimal performance impact (~0.1ms per frame).

### Performance Modes
- **High**: All effects, full shadows, antialiasing
- **Medium**: Reduced shadow quality, simplified materials
- **Low**: Minimal shadows, no antialiasing, simplified geometry

### Shadow Quality Settings
- **High**: 2048x2048 shadow maps
- **Medium**: 1024x1024 shadow maps
- **Low**: 512x512 shadow maps or shadows disabled

## Testing Checklist

- [ ] FPS counter displays and updates correctly
- [ ] Performance mode changes affect rendering quality
- [ ] Shadow quality changes are visible
- [ ] Overlays don't overlap or block important UI
- [ ] Overlays are readable on all backgrounds
- [ ] Controls are responsive and accessible
- [ ] Performance mode descriptions are accurate
- [ ] FPS color coding works (green/yellow/red)

## Comparison: enhance/3D vs Current Branch

### enhance/3D (ThreeSceneOptimized)
✅ Integrated FPS counter in ControlsOverlay
✅ Performance mode selector with descriptions
✅ Compact, unified controls overlay
❌ No separate debug panel
❌ Less comprehensive asset management

### Current Branch
✅ Comprehensive DebugPanel with asset management
✅ Performance metrics and history tracking
✅ Draggable/resizable debug interface
✅ Keyboard shortcuts
❌ No FPS counter in ThreeScene overlay
❌ No performance mode selector in ThreeScene
❌ Performance controls separated from scene

### Recommended Approach
**Use both overlays for different purposes:**
1. **PerformanceOverlay** - Quick, in-scene performance monitoring for end users
2. **DebugPanel** - Comprehensive debugging for developers

This provides the best of both worlds:
- Casual users get simple performance controls
- Developers get full debugging capabilities

## Migration Checklist

- [x] Create PerformanceOverlay component
- [x] Document overlay features and props
- [x] Provide integration examples
- [ ] Add PerformanceOverlay to ThreeScene
- [ ] Test FPS counter accuracy
- [ ] Test performance mode switching
- [ ] Test shadow quality changes
- [ ] Verify overlay positioning
- [ ] Ensure overlays work together (DebugPanel + PerformanceOverlay)

## Notes

1. The PerformanceOverlay is designed to be lightweight and non-intrusive
2. It can coexist with the existing DebugPanel
3. The FPS counter implementation is similar to the one in DebugPanel but more compact
4. Performance mode changes should be propagated to the Canvas and scene components
5. Consider adding keyboard shortcut for toggling PerformanceOverlay (e.g., Ctrl+Shift+P)
