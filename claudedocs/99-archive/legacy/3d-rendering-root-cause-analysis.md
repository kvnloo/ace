# ACE Tennis 3D Rendering Debug Report
**Date:** 2025-11-22
**Status:** ROOT CAUSE IDENTIFIED
**Priority:** CRITICAL

## Executive Summary

3D court view fails to render on main branch (`enhance/3D`) while working perfectly on dev branch. Root cause identified: Loading screen state management blocks 3D scene initialization.

---

## Comparison Analysis

### DEV BRANCH (WORKING) - `/worktre

es/ace-dev`

**App.tsx Structure:**
```tsx
// Simple, direct rendering
const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [selectedFeature, setSelectedFeature] = useState<FeatureData | null>(null);

  // NO loading state
  // NO LoadingProvider
  // NO LoadingScreen component

  return (
    <div>
      <NavBar currentView={currentView} onChangeView={setCurrentView} />
      <main>
        {currentView === View.FACILITY_DEMO && (
          <ThreeScene onFeatureSelect={setSelectedFeature} />
        )}
      </main>
    </div>
  );
};
```

**Result:** 3D renders immediately ✅

---

### MAIN BRANCH (BROKEN) - `/repos/ace` (enhance/3D)

**App.tsx Structure:**
```tsx
const App: React.FC = () => {
  // PROBLEM: Complex loading state management
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [shouldShowLoading, setShouldShowLoading] = useState(false);
  const { isLoading } = useLoading(); // LoadingProvider context

  // Show loading screen only when entering court view
  useEffect(() => {
    if (currentView === View.FACILITY_DEMO && !loadingComplete) {
      setShouldShowLoading(true);
    } else {
      setShouldShowLoading(false);
    }
  }, [currentView, loadingComplete]);

  return (
    <div>
      {/* BLOCKS rendering until loadingComplete */}
      <AnimatePresence>
        {shouldShowLoading && !loadingComplete && (
          <LoadingScreen
            onComplete={() => setLoadingComplete(true)}
            minimumDisplayTime={2000}
            showFPSMonitor={true}
          />
        )}
      </AnimatePresence>

      <main>
        {currentView === View.FACILITY_DEMO && (
          <ThreeSceneWrapper onFeatureSelect={setSelectedFeature} />
        )}
      </main>
    </div>
  );
};
```

**Result:** Loading screen shows, but 3D never renders ❌

---

## Root Cause Analysis

### Problem 1: Loading State Never Completes
```tsx
// LoadingScreen is shown
{shouldShowLoading && !loadingComplete && (
  <LoadingScreen onComplete={() => setLoadingComplete(true)} />
)}

// ThreeScene tries to render simultaneously
{currentView === View.FACILITY_DEMO && (
  <ThreeSceneWrapper />
)}
```

**Issue:** `ThreeSceneWrapper` renders at same time as loading screen, but:
1. Loading screen covers it completely (z-index issue)
2. Asset loading state managed separately
3. `loadingComplete` never gets set to `true` because assets don't trigger completion

### Problem 2: ThreeScene Has Its Own Loading System
```tsx
// From src/components/ThreeScene.tsx lines 1612-1621
const ThreeScene: React.FC<ThreeSceneProps> = ({ onFeatureSelect }) => {
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);

  return (
    <LoadingProvider registry={AssetRegistry.getInstance()}>
      {!isLoadingComplete && (
        <LoadingScreen
          onComplete={handleLoadingComplete}
          minimumDisplayTime={2000}
        />
      )}
      <Canvas>...</Canvas>
    </LoadingProvider>
  );
};
```

**Issue:** DOUBLE loading screens!
- App.tsx has loading screen
- ThreeScene.tsx ALSO has loading screen
- They compete and block each other

### Problem 3: Asset System Mismatch
Current system assumes file-based assets:
```typescript
// AssetRegistry expects URL-based loading
AssetRegistry.getInstance().registerAsset({
  id: 'grass-texture',
  url: '/textures/grass.jpg',  // ❌ Doesn't exist for React components
  type: 'texture'
});
```

Reality: Assets are React components:
```tsx
<Grass position={[0, 0.1, 0]} size={[10, 22]} />  // Component, not file
<ClayCourtEffect position={[0, 0, 0]} />          // Component, not file
<HydroponicsSystem position={[-30, 0, -20]} />    // Component, not file
```

---

## Technical Breakdown

### Loading Flow (BROKEN)

```
User clicks "Explore 3D Demo"
  ↓
currentView = FACILITY_DEMO
  ↓
App.tsx useEffect triggers
  ↓
shouldShowLoading = true (because !loadingComplete)
  ↓
LoadingScreen renders (BLOCKS view)
  ↓
ThreeSceneWrapper tries to render
  ↓
ThreeScene.tsx ALSO renders LoadingScreen
  ↓
DOUBLE loading screens, NEITHER complete
  ↓
3D canvas created but NEVER shown
  ↓
User sees infinite loading screen ❌
```

### Working Flow (DEV BRANCH)

```
User clicks "Explore 3D Demo"
  ↓
currentView = FACILITY_DEMO
  ↓
ThreeScene renders directly
  ↓
Canvas mounts
  ↓
3D court appears immediately ✅
```

---

## Solution Strategy

### Option 1: Remove App-Level Loading Screen (RECOMMENDED)
```tsx
// Remove from App.tsx:
// - loadingComplete state
// - shouldShowLoading state
// - LoadingScreen component
// - useLoading context

// Keep only in ThreeScene.tsx with FIX
```

### Option 2: Fix Asset System for Components
```typescript
// New approach: Track component mounting, not file loading
interface ComponentAsset {
  id: string;
  Component: React.FC;
  mounted: boolean;
  renderPriority: number;
}

class ComponentRegistry {
  private components: Map<string, ComponentAsset>;
  private mountedCount = 0;

  registerComponent(asset: ComponentAsset) {
    this.components.set(asset.id, asset);
  }

  onComponentMount(id: string) {
    const asset = this.components.get(id);
    if (asset) {
      asset.mounted = true;
      this.mountedCount++;
      this.checkCompletion();
    }
  }

  getProgress(): number {
    return this.mountedCount / this.components.size;
  }
}
```

### Option 3: Batch Component Rendering
```tsx
// Render components in batches based on FPS
const [visibleComponents, setVisibleComponents] = useState<string[]>([]);
const [currentFPS, setCurrentFPS] = useState(60);

useEffect(() => {
  const batchSize = currentFPS > 50 ? 10 : currentFPS > 30 ? 5 : 2;

  // Enable next batch when FPS stable
  if (visibleComponents.length < totalComponents.length) {
    setTimeout(() => {
      setVisibleComponents(prev => [
        ...prev,
        ...nextBatch(batchSize)
      ]);
    }, 100);
  }
}, [visibleComponents, currentFPS]);

return (
  <group>
    {components.map(comp =>
      visibleComponents.includes(comp.id) ? (
        <comp.Component key={comp.id} {...comp.props} />
      ) : null
    )}
  </group>
);
```

---

## Recommended Fix Plan

### Phase 1: Remove Conflicting Loading Screens
1. Remove loading screen from `App.tsx` (lines 100-108)
2. Remove `loadingComplete` state from `App.tsx`
3. Remove `shouldShowLoading` state from `App.tsx`
4. Remove `useLoading` context import from `App.tsx`

### Phase 2: Fix ThreeScene Loading
1. Keep loading screen in `ThreeScene.tsx` ONLY
2. Simplify to: Show loading → Mount canvas → Hide loading
3. Remove asset registry (not applicable for React components)

### Phase 3: Implement Batch Loading (Future)
1. Create ComponentRegistry for tracking mounted components
2. Implement FPS monitoring
3. Batch component rendering based on performance
4. Progressive enhancement: Core → Details → Effects

---

## Files Requiring Changes

### Immediate (Fix 3D rendering):
- `/home/kvn/workspace/evolve/repos/ace/src/App.tsx` - Remove app-level loading
- `/home/kvn/workspace/evolve/repos/ace/src/components/ThreeScene.tsx` - Simplify loading
- `/home/kvn/workspace/evolve/repos/ace/src/components/ThreeSceneWrapper.tsx` - Remove loading context

### Future (Batch loading system):
- Create: `/home/kvn/workspace/evolve/repos/ace/src/utils/ComponentRegistry.ts`
- Create: `/home/kvn/workspace/evolve/repos/ace/src/hooks/useFPSMonitor.ts`
- Create: `/home/kvn/workspace/evolve/repos/ace/src/hooks/useBatchRenderer.ts`

---

## Testing Requirements

### Critical Tests (Must pass):
1. 3D court view renders on navigation from home
2. No console errors during rendering
3. Canvas element exists in DOM
4. WebGL context successfully created
5. Camera controls functional
6. Court objects visible in scene

### Performance Tests:
1. Initial render FPS > 30
2. Stable FPS after 5 seconds > 45
3. Memory usage < 500MB
4. No memory leaks on view change

### User Journey Tests:
1. Home → Court view (3D renders)
2. Court view → Home → Court view (still works)
3. Multiple navigation cycles (no degradation)

---

## Next Steps

1. ✅ Complete root cause analysis (DONE)
2. ⏳ Implement Phase 1 fixes (remove conflicting loading)
3. ⏳ Validate 3D rendering works
4. ⏳ Add console error monitoring to tests
5. ⏳ Implement batch component loading (if performance requires)
6. ⏳ Create comprehensive test suite

---

## Appendix: Console Errors to Monitor

```typescript
// Add to all tests:
beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation();
});

afterEach(() => {
  expect(console.error).not.toHaveBeenCalled();
  jest.restoreAllMocks();
});
```

Expected errors to BLOCK:
- "Canvas is not defined"
- "Failed to create WebGL context"
- "Cannot read property 'renderer' of undefined"
- "Three.js error: ..."
- Any React rendering errors
