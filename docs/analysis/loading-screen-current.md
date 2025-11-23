# Loading Screen Analysis - Current Implementation

**Date:** 2025-11-23
**Worktree:** ace-3Dmerge
**Issue:** Loading Screen shows FPS but not individual loading bars

---

## Executive Summary

The Loading Screen implementation has a **critical data flow disconnect** between the `AssetLoader` service and the `LoadingProvider` context. While the screen successfully renders FPS monitoring, individual asset loading progress bars are not showing because the asset progress updates are not properly propagating from the loader to the UI.

### Key Finding
**Root Cause:** The `updateFromProgress` function in `LoadingProvider.tsx` (line 128-153) updates the `assets` state array, but this happens **before** any assets are actually registered in the initial state. The asset list is initialized once at mount (line 106-118) and never refreshes when the loader actually processes assets.

---

## Component Architecture

### 1. Data Flow Overview

```
App.tsx
  └─> LoadingProvider (Context)
       ├─> AssetLoader (Service)
       │    ├─> AssetRegistry (Data Store)
       │    └─> Phase Definitions (Config)
       └─> LoadingScreen (UI)
            └─> useLoading() hook
```

### 2. File Structure

#### Core Components
- **`/src/components/loading/LoadingScreen.tsx`** (578 lines)
  Main UI component that renders the loading screen with FPS monitor and asset list

- **`/src/components/loading/LoadingProvider.tsx`** (199 lines)
  React Context provider managing loading state and coordinating between UI and service

- **`/src/components/loading/index.ts`**
  Export barrel for loading components

#### Services
- **`/src/services/loading/AssetLoader.ts`** (622 lines)
  Core loading service implementing progressive phase-based asset loading

- **`/src/services/loading/types.ts`** (165 lines)
  TypeScript type definitions for loading system

- **`/src/services/loading/phases.ts`** (219 lines)
  Configuration of 4 loading phases with asset lists

#### Data Layer
- **`/src/utils/debug/assetRegistry.ts`** (507 lines)
  Singleton registry managing all asset definitions and enabled state

---

## State Management Deep Dive

### LoadingProvider State (lines 57-64)

```typescript
const [assets, setAssets] = useState<LoadingAsset[]>([]);
const [overallProgress, setOverallProgress] = useState(0);
const [loadedCount, setLoadedCount] = useState(0);
const [totalCount, setTotalCount] = useState(0);
const [isLoading, setIsLoading] = useState(false);
const [fps, setFps] = useState(60);
const [currentPhase, setCurrentPhase] = useState('Essential');
const [loader, setLoader] = useState<AssetLoader | null>(null);
```

### Asset State Interface (lines 13-20)

```typescript
interface LoadingAsset {
  id: string;
  name: string;
  category: string;
  loaded: boolean;
  error: boolean;
  progress: number;
}
```

### Initial Asset Population (lines 106-118)

```typescript
// Initialize asset list from registry
const registryAssets = registry.getAll();
const initialAssets: LoadingAsset[] = registryAssets.map(asset => ({
  id: asset.id,
  name: asset.name,
  category: asset.category,
  loaded: false,
  error: false,
  progress: 0,
}));

setAssets(initialAssets);
setTotalCount(initialAssets.length);
```

**Problem:** This initialization happens once when the component mounts. It reads from the registry and creates the initial asset list, but this list may not match what the AssetLoader actually processes.

---

## The Critical Data Flow Break

### Where It Breaks

#### 1. **Asset Registration Phase**
Location: `LoadingProvider.tsx` lines 106-118

When LoadingProvider initializes:
1. ✅ Reads all assets from `AssetRegistry`
2. ✅ Creates initial `LoadingAsset[]` array
3. ✅ Sets `totalCount`
4. ❌ **But this is only done ONCE at mount**

#### 2. **Asset Loading Phase**
Location: `AssetLoader.ts` lines 267-322

When AssetLoader loads an asset:
1. ✅ Updates internal `assets` Map with `AssetProgress`
2. ✅ Calls `onProgress` callback with `LoadingProgress`
3. ✅ Progress includes `assets: Map<string, AssetProgress>`

#### 3. **Progress Update Phase** ⚠️ **BROKEN HERE**
Location: `LoadingProvider.tsx` lines 128-153

```typescript
const updateFromProgress = (progress: LoadingProgress) => {
  // Update overall progress
  setOverallProgress(progress.totalProgress);
  setIsLoading(progress.state === LoadingState.LOADING);

  // Update individual asset states
  const updatedAssets = assets.map(asset => {  // ❌ PROBLEM: maps over OLD state
    const assetProgress = progress.assets.get(asset.id);
    if (!assetProgress) return asset;  // ❌ No progress found -> returns unchanged

    return {
      ...asset,
      loaded: assetProgress.status === 'loaded',
      error: assetProgress.status === 'failed',
      progress: assetProgress.status === 'loaded' ? 100 :
               assetProgress.status === 'loading' ? 50 :
               assetProgress.status === 'failed' ? 0 : 0,
    };
  });

  setAssets(updatedAssets);
  // ...
};
```

**The Issue:**
- `assets.map()` iterates over the **initial state** from line 108
- `progress.assets.get(asset.id)` looks for the asset in the **loader's Map**
- If the loader is processing assets that weren't in the initial registry read, they won't have progress tracked
- If asset IDs don't match exactly, `assetProgress` will be `undefined`

#### 4. **Phase System Mismatch**
Location: `phases.ts` lines 42-145

The phase definitions specify exactly which assets to load:
- **Essential Phase**: 5 assets (camera, scene, lighting, ground)
- **Core Phase**: 11 assets (tennis courts, buildings, materials)
- **Visual Phase**: 9 assets (grass, advanced lighting, weather)
- **Enhanced Phase**: 9 assets (particles, post-processing, advanced weather)

**Total from Phases:** 34 assets

But these asset IDs must **exactly match** the asset IDs in the AssetRegistry for progress tracking to work.

---

## Why FPS Shows But Loading Bars Don't

### FPS Monitor (WORKS ✅)
Location: `LoadingScreen.tsx` lines 84-147

```typescript
useEffect(() => {
  if (!showFPSMonitor) return;

  let frameCount = 0;
  let lastTime = performance.now();

  const measureFPS = () => {
    const currentTime = performance.now();
    const delta = currentTime - lastTime;

    if (delta >= 1000) {
      const fps = Math.round((frameCount * 1000) / delta);
      setFpsData(prev => ({
        current: fps,
        average: ...,
        min: ...,
        max: ...,
        history: [...]
      }));
      // ... FPS level determination
    }
    frameCount++;
    animationFrameId = requestAnimationFrame(measureFPS);
  };
  // ...
}, [showFPSMonitor, fpsLevel]);
```

**Why it works:**
- Self-contained useEffect
- Uses browser's `requestAnimationFrame`
- Directly measures performance
- No dependencies on external data flow

### Asset Loading Bars (BROKEN ❌)
Location: `LoadingScreen.tsx` lines 420-478

```typescript
<div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
  <AnimatePresence mode="popLayout">
    {assets.map((asset, index) => (  // ❌ assets array is not updating
      <motion.div key={asset.id}>
        {/* Status Icon */}
        {asset.error ? (
          <XCircle className="w-5 h-5 text-red-400" />
        ) : asset.loaded ? (
          <CheckCircle className="w-5 h-5 text-green-400" />
        ) : (
          <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
        )}

        {/* Progress Bar */}
        {!asset.loaded && !asset.error && (
          <motion.div
            className="h-full bg-blue-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${asset.progress}%` }}  // ❌ progress stuck at 0
          />
        )}
      </motion.div>
    ))}
  </AnimatePresence>
</div>
```

**Why it's broken:**
- Depends on `assets` from `useLoading()` context
- `assets` array is not being updated by `updateFromProgress`
- Asset progress values remain at initial state (0%)
- No visual feedback on loading progress

---

## Console Output Analysis

### Expected Flow
```
[AssetRegistry] Initialized with X assets
[LoadingScreen] Rendering: 0/X assets, 0% progress
[AssetLoader] Starting progressive asset loading...
[AssetLoader] Loading Phase: Essential
[AssetLoader]   ✅ Loaded: scene-container (XXms)
[LoadingScreen] Rendering: 1/X assets, Y% progress
[AssetLoader]   ✅ Loaded: camera-main (XXms)
[LoadingScreen] Rendering: 2/X assets, Y% progress
```

### Actual Flow (Based on Code)
```
[AssetRegistry] Initialized with X assets
[LoadingScreen] Rendering: 0/X assets, 0% progress
[AssetLoader] Starting progressive asset loading...
[AssetLoader] Loading Phase: Essential
[AssetLoader]   ✅ Loaded: scene-container (XXms)
[LoadingScreen] Rendering: 0/X assets, 0% progress  ❌ Not updating!
```

---

## Asset ID Matching System

### AssetRegistry IDs
Location: Needs to be checked in `assetDefinitions.ts` (not yet examined)

Assets registered at app startup.

### Phase Definition IDs
Location: `phases.ts`

```typescript
ESSENTIAL_PHASE.assets = [
  'scene-container',
  'camera-main',
  'camera-controller',
  'light-ambient',
  'geometry-ground-plane'
]
```

### AssetLoader Tracking
Location: `AssetLoader.ts` line 268-283

```typescript
let progress = this.assets.get(assetId);

if (!progress) {
  const asset = this.registry.get(assetId);
  if (!asset) {
    throw new Error(`Asset not found: ${assetId}`);
  }

  progress = {
    id: assetId,
    category: asset.category as AssetCategory,
    status: AssetLoadStatus.PENDING,
    retries: 0
  };
  this.assets.set(assetId, progress);
}
```

**The loader creates its own progress tracking map separate from the UI state.**

---

## Component Render Cycle

### LoadingScreen Render Conditions
Location: `LoadingScreen.tsx` lines 256-267

```typescript
// Show loading screen if:
// 1. Currently loading (isLoading = true)
// 2. Has assets to load (totalCount > 0)
// 3. Not all assets loaded yet (loadedCount < totalCount)
// Hide only when loading is complete (all assets loaded or no assets)
if (!isLoading && (totalCount === 0 || loadedCount === totalCount)) {
  console.log('[LoadingScreen] Loading complete - hiding loading screen');
  return null;
}

console.log(`[LoadingScreen] Rendering: ${loadedCount}/${totalCount} assets, ${Math.round(overallProgress)}% progress`);
```

### State Values During Loading
Based on the code:
- `isLoading`: ✅ Updates correctly (from `progress.state`)
- `totalCount`: ✅ Set at initialization (from initial registry read)
- `loadedCount`: ❌ **Not updating** (depends on `updatedAssets.filter(a => a.loaded).length`)
- `overallProgress`: ✅ Updates correctly (from `progress.totalProgress`)

**Result:**
- Screen shows: "0/34 assets, 45% progress" ← Contradictory!
- Overall progress bar fills correctly
- Individual asset bars stuck at 0%

---

## Missing Connections

### 1. Asset List Synchronization
**Problem:** Initial asset list (line 108) never syncs with what AssetLoader actually processes

**Current:**
```typescript
// ONE-TIME initialization
const initialAssets: LoadingAsset[] = registryAssets.map(...)
setAssets(initialAssets);
```

**Needed:**
- Dynamic asset list that updates when loader starts
- OR: Ensure registry and phase definitions are perfectly in sync
- OR: Loader should push its asset list to the provider

### 2. Progress Update Mapping
**Problem:** `updateFromProgress` assumes asset IDs match between initial state and loader's Map

**Current:**
```typescript
const updatedAssets = assets.map(asset => {
  const assetProgress = progress.assets.get(asset.id);
  if (!assetProgress) return asset;  // ❌ Silent failure
  // ...
});
```

**Needed:**
- Add assets from loader that aren't in initial state
- Log warnings when IDs don't match
- Validate asset ID consistency at startup

### 3. Phase Progress Integration
**Problem:** `currentPhase` updates (lines 78-99) but individual assets within phases don't show progress

**Current:**
```typescript
// Phase name updates based on percentage
if (percentage < 25) {
  setCurrentPhase('Essential');
} else if (percentage < 50) {
  setCurrentPhase('Core');
}
```

**Needed:**
- Show which assets are in current phase
- Highlight currently loading asset
- Group assets by phase in UI

---

## Specific Line Number References

### Critical Code Sections

#### LoadingProvider.tsx
- **Lines 66-126:** `useEffect` - AssetLoader initialization and auto-start
- **Lines 106-118:** Initial asset list population ⚠️ **One-time only**
- **Lines 128-153:** `updateFromProgress` function ⚠️ **Broken mapping**
- **Lines 155-172:** `startLoading` function
- **Lines 75-88:** `onProgress` callback configuration

#### LoadingScreen.tsx
- **Lines 51:** `useLoading()` hook - Gets context data
- **Lines 266:** Console log showing contradiction ⚠️ **Evidence of bug**
- **Lines 420-478:** Asset list render ⚠️ **Not receiving updates**
- **Lines 304-314:** Progress display (shows correct overall %, wrong counts)
- **Lines 318-334:** Overall progress bar ✅ **Works correctly**

#### AssetLoader.ts
- **Lines 101-180:** `start()` - Main loading loop
- **Lines 185-242:** `loadPhase()` - Phase loading logic
- **Lines 267-322:** `loadAsset()` - Individual asset loading
- **Lines 510-567:** `simulateAssetLoad()` - Component-based loading ⚠️ **Enable via registry**
- **Lines 617-620:** `emitProgress()` - Calls onProgress callback

#### phases.ts
- **Lines 30-49:** ESSENTIAL_PHASE definition (5 assets)
- **Lines 58-81:** CORE_PHASE definition (11 assets)
- **Lines 90-113:** VISUAL_PHASE definition (9 assets)
- **Lines 123-145:** ENHANCED_PHASE definition (9 assets)

---

## Data Structure Mismatches

### LoadingAsset (UI State)
```typescript
interface LoadingAsset {
  id: string;
  name: string;
  category: string;
  loaded: boolean;     // ← Simple boolean
  error: boolean;      // ← Simple boolean
  progress: number;    // ← 0-100 percentage
}
```

### AssetProgress (Loader State)
```typescript
interface AssetProgress {
  id: string;
  category: AssetCategory;
  status: AssetLoadStatus;  // ← Enum: pending/loading/loaded/failed/skipped
  retries: number;
  error?: Error;
  loadTime?: number;
}
```

### Conversion Logic Issues
Location: `LoadingProvider.tsx` lines 140-145

```typescript
return {
  ...asset,
  loaded: assetProgress.status === 'loaded',
  error: assetProgress.status === 'failed',
  progress: assetProgress.status === 'loaded' ? 100 :
           assetProgress.status === 'loading' ? 50 :  // ❌ Hardcoded 50%!
           assetProgress.status === 'failed' ? 0 : 0,
};
```

**Problems:**
1. Progress is hardcoded to 50% for loading assets (should be dynamic)
2. No intermediate progress tracking (0% → 50% → 100%)
3. Asset doesn't have actual load progress percentage

---

## Performance Implications

### Current System Behavior

1. **FPS Monitor:** ✅ Accurate (self-contained measurement)
2. **Overall Progress:** ✅ Accurate (based on phase completion)
3. **Asset Count:** ❌ Inaccurate (not updating)
4. **Individual Progress:** ❌ Not working (bars stuck at 0%)

### User Experience Impact

**What Works:**
- User sees FPS counter updating in real-time
- Overall progress bar fills from 0% to 100%
- Loading screen appears and disappears correctly
- Phase name updates ("Essential" → "Core" → "Visual" → "Enhanced")

**What's Broken:**
- Asset list shows all items with spinner, no completion indicators
- Progress count stuck at "0/34 assets"
- Individual progress bars never fill
- No visual feedback on which specific asset is loading
- Can't tell if loading is stuck or progressing

**User Perception:**
- "The FPS is fine but nothing seems to be loading"
- "Is it frozen? The counter says 0/34 but progress is at 50%?"
- Confusing and potentially anxiety-inducing

---

## Component-Based Loading System

### How It Works
Location: `AssetLoader.ts` lines 510-567

```typescript
private async simulateAssetLoad(assetId: string): Promise<void> {
  const asset = this.registry.get(assetId);

  // Enable the asset in registry (components will detect via useAssetEnabled hook)
  const enableSuccess = this.registry.enable(assetId);

  // Wait for React to re-render (give components time to mount)
  await this.waitForRender();

  // Monitor FPS after component renders
  const fpsAfterRender = this.getCurrentFPS();
  const targetFPS = this.options.fpsThresholds?.get(this.currentPhase!) || 60;

  if (fpsAfterRender < targetFPS * 0.8) {
    console.warn(`⚠️ FPS dropped to ${fpsAfterRender} after enabling ${assetId}`);
  }
}
```

**Concept:**
1. AssetLoader enables asset in registry
2. Components use `useAssetEnabled()` hook to check if they should render
3. Components render when enabled
4. Loader monitors FPS impact
5. Loader can disable assets that hurt performance

**Issue for Progress Tracking:**
- This is a **binary system** (enabled/disabled)
- No intermediate progress values
- Can't track partial loading within a component
- Progress is hardcoded to 50% while "loading" (line 142)

---

## Testing Evidence

### E2E Tests
Files found:
- `tests/e2e/adaptive-loading.spec.ts`
- `tests/e2e/performance/loading-performance.spec.ts`
- `tests/e2e/asset-loading-experience.spec.ts`

These tests likely verify the loading screen appears and disappears, but may not check individual asset progress bars.

### Unit Tests
- `tests/unit/loading/phases.test.ts`
- `tests/unit/loading/QualityPresets.test.ts`
- `tests/integration/loading/adaptive-loading-flow.test.tsx`

Should verify phase definitions and loading logic, but may not cover UI state updates.

---

## Recommendations for Next Steps

### Immediate Investigations Needed

1. **Check AssetRegistry Initialization**
   - Read `/src/utils/debug/assetDefinitions.ts`
   - Verify asset IDs match phase definitions exactly
   - Count total assets to confirm they align

2. **Add Debug Logging**
   - Log asset IDs in `updateFromProgress` when `!assetProgress`
   - Log the size of `progress.assets` Map vs `assets.length`
   - Track which assets are missing from progress updates

3. **Verify Component-Based Loading**
   - Check if `useAssetEnabled()` hook exists
   - Verify which components actually use this pattern
   - Confirm assets are being enabled correctly

### Root Cause Hypotheses (Ranked by Likelihood)

#### Hypothesis 1: Asset ID Mismatch ⭐⭐⭐⭐⭐ (Most Likely)
**Theory:** Phase definitions use IDs like `'scene-container'` but registry has different IDs

**Evidence:**
- `updateFromProgress` silently returns unchanged assets when `!assetProgress`
- No error messages about missing assets
- Overall progress works (doesn't depend on IDs) but asset list doesn't

**Test:**
```typescript
// Add to updateFromProgress
if (!assetProgress) {
  console.warn(`No progress for asset: ${asset.id}`);
  return asset;
}
```

#### Hypothesis 2: Timing Issue ⭐⭐⭐⭐ (Likely)
**Theory:** Initial asset list is set before loader processes phase assets

**Evidence:**
- Asset list initialized from registry (lines 106-118)
- Loader creates its own asset Map (line 282)
- These two lists may not sync

**Test:**
```typescript
// Log both lists at startup
console.log('Initial assets:', initialAssets.map(a => a.id));
console.log('Loader will process:', LOADING_PHASES.flatMap(p => p.assets));
```

#### Hypothesis 3: State Update Optimization ⭐⭐⭐ (Possible)
**Theory:** React batches state updates and `setAssets(updatedAssets)` isn't triggering re-render

**Evidence:**
- `overallProgress` updates correctly (same function)
- Only asset-specific state isn't updating

**Test:**
```typescript
// Force re-render
setAssets([...updatedAssets]);  // New array reference
```

#### Hypothesis 4: Progress Callback Not Firing ⭐⭐ (Less Likely)
**Theory:** `onProgress` callback in AssetLoader isn't being called

**Evidence:**
- Overall progress updates (so callback IS firing)
- But asset details don't update

**Test:**
```typescript
// Add to onProgress callback
console.log('Progress callback:', {
  totalProgress: progress.totalProgress,
  assetMapSize: progress.assets.size,
  assetIds: Array.from(progress.assets.keys())
});
```

---

## Architecture Strengths

Despite the progress tracking bug, the architecture has solid foundations:

### Well-Designed Aspects

1. **Progressive Loading System** ✅
   - Clear phase definitions with FPS targets
   - Graceful degradation on performance issues
   - Dependency-aware loading order

2. **Separation of Concerns** ✅
   - AssetLoader (business logic)
   - LoadingProvider (state management)
   - LoadingScreen (presentation)

3. **Performance Monitoring** ✅
   - Real-time FPS tracking
   - Per-phase performance gates
   - Auto-quality adjustment

4. **Type Safety** ✅
   - Comprehensive TypeScript interfaces
   - Enum-based state machines
   - Strong typing throughout

5. **Component-Based Loading** ✅ (Concept)
   - Enables progressive rendering
   - Allows FPS monitoring per component
   - Supports automatic degradation

### Areas for Improvement

1. **State Synchronization** ❌
   - Need single source of truth for asset list
   - Better connection between loader and UI state

2. **Progress Granularity** ❌
   - Binary enabled/disabled isn't enough
   - Need intermediate progress values (0-100%)

3. **Error Visibility** ❌
   - Silent failures when asset IDs don't match
   - No user-facing error states

4. **Documentation** ⚠️
   - Code is well-commented
   - But data flow isn't clearly documented
   - Missing architecture diagrams

---

## Conclusion

The Loading Screen implementation has a **sophisticated architecture** with progressive loading, performance monitoring, and component-based rendering. However, it suffers from a **critical data synchronization issue** between the `AssetLoader` service and the `LoadingProvider` context.

**The FPS monitor works** because it's self-contained and doesn't depend on external state.

**The loading bars don't work** because:
1. Initial asset list is created once from registry
2. Loader processes assets from phase definitions
3. Progress updates try to map loader's assets to UI's assets
4. If IDs don't match or lists are out of sync, progress silently fails
5. Asset state remains at initial values (0% progress, not loaded)

**Next Steps:**
1. Verify asset ID consistency between registry, phases, and loader
2. Add debug logging to trace data flow
3. Fix state synchronization in `updateFromProgress`
4. Add proper error handling for missing assets
5. Implement true progress tracking (not just 0/50/100%)

---

## File Reference Index

### Component Files
- `/src/components/loading/LoadingScreen.tsx` - Main UI (578 lines)
- `/src/components/loading/LoadingProvider.tsx` - State management (199 lines)
- `/src/components/loading/animations.ts` - Animation variants
- `/src/components/loading/index.ts` - Exports

### Service Files
- `/src/services/loading/AssetLoader.ts` - Core loading logic (622 lines)
- `/src/services/loading/types.ts` - Type definitions (165 lines)
- `/src/services/loading/phases.ts` - Phase configurations (219 lines)
- `/src/services/loading/FPSMonitor.ts` - FPS tracking
- `/src/services/loading/PerformanceGate.ts` - Performance checks
- `/src/services/loading/QualityPresets.ts` - Quality settings

### Data Layer
- `/src/utils/debug/assetRegistry.ts` - Asset registry singleton (507 lines)
- `/src/utils/debug/assetDefinitions.ts` - Asset definitions (not yet examined)

### Integration Points
- `/src/main.tsx` - App initialization (25 lines)
- `/src/App.tsx` - LoadingScreen usage (297 lines)
- `/src/contexts/DebugContext.tsx` - Debug context provider

### Test Files
- `/tests/e2e/adaptive-loading.spec.ts`
- `/tests/e2e/performance/loading-performance.spec.ts`
- `/tests/e2e/asset-loading-experience.spec.ts`
- `/tests/unit/loading/phases.test.ts`
- `/tests/unit/loading/QualityPresets.test.ts`
- `/tests/integration/loading/adaptive-loading-flow.test.tsx`

---

**End of Analysis**
