# Loading Progress Fix - Implementation Summary

## Problem
The loading screen shows "0/0" with no progress indication. THREE.js asset loading is not connected to the LoadingProvider context, preventing proper progress tracking.

## Root Cause Analysis

### Current State
1. **LoadingProvider** expects assets from `assetRegistry` (line 138-149 in LoadingProvider.tsx)
2. **ThreeScene** configures `THREE.DefaultLoadingManager` handlers (lines 803-834)
3. **Connection Missing**: ThreeScene's loading manager reports to `reportProgress()` but this uses a different signature than expected
4. **Asset Registry Empty**: No assets registered in `assetRegistry`, resulting in 0 total count

## Files Requiring Changes

### 1. `/src/utils/debug/assetRegistry.ts`
**Purpose**: Register THREE.js assets so LoadingProvider knows what to track

**Changes Needed**:
- Add asset definitions for all THREE.js loaded resources:
  - Environment maps
  - Tennis court textures (lazy-loaded)
  - Any other @react-three/drei resources

**Complexity**: Medium (need to identify all loadable assets)

**Example**:
```typescript
assetRegistry.register({
  id: 'environment-park',
  name: 'Environment Map',
  type: 'texture',
  priority: 'essential',
  url: 'preset://park' // drei Environment preset
});

assetRegistry.register({
  id: 'tennis-court-component',
  name: 'Tennis Court Models',
  type: 'component',
  priority: 'core',
  url: 'lazy://TennisCourt'
});
```

### 2. `/src/components/ThreeScene.tsx`
**Purpose**: Connect THREE.js loading to reportProgress with correct signature

**Changes Needed** (lines 803-834):

**Current Code**:
```typescript
THREE.DefaultLoadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
  const progress = totalItems > 0 ? (itemsLoaded / itemsTotal) * 100 : 0;
  reportProgress(progress, `Loading 3D assets (${itemsLoaded}/${itemsTotal})`);
};
```

**Required Change**:
```typescript
THREE.DefaultLoadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
  loadedItems = itemsLoaded;
  totalItems = itemsTotal;
  // reportProgress expects (loaded: number, total: number, currentAsset?: string)
  reportProgress(itemsLoaded, itemsTotal, url);
};
```

**Complexity**: Low (signature fix only)

**Risk**: None - this is a simple parameter alignment

### 3. `/src/components/loading/LoadingProvider.tsx`
**Purpose**: Ensure reportProgress properly handles THREE.js updates

**Current Implementation** (lines 185-208):
The `reportProgress` callback already has the correct signature:
```typescript
const reportProgress = useCallback((loaded: number, total: number, currentAsset?: string) => {
  const progress = total > 0 ? Math.round((loaded / total) * 100) : 0;
  setOverallProgress(progress);
  setLoadedCount(loaded);
  setTotalCount(total);
  // ... asset matching logic
}, []);
```

**Changes Needed**:
- Add fallback logic to create placeholder assets if registry is empty
- Handle dynamic asset discovery from THREE.js

**Complexity**: Medium

**Example Addition** (after line 149):
```typescript
// If registry has no assets, create placeholders for THREE.js loading
if (initialAssets.length === 0) {
  console.warn('[LoadingProvider] No assets registered, will track THREE.js dynamically');
  setAssets([]);
  setTotalCount(0); // Will be updated by reportProgress
}
```

### 4. `/src/components/loading/LoadingScreen.tsx`
**Purpose**: Handle edge case where totalCount starts at 0

**Current Logic** (lines 156-157):
```typescript
const assetsComplete = totalCount === 0 || loadedCount === totalCount;
```

**Issue**: This causes immediate completion when totalCount=0 initially

**Required Change** (line 156-157):
```typescript
// Don't complete if we're still loading AND no assets loaded yet
// (waiting for THREE.js to report actual total)
const assetsComplete = (totalCount > 0 && loadedCount === totalCount) ||
                       (!isLoading && totalCount === 0 && loadedCount === 0);
```

**Complexity**: Low

**Risk**: May need timeout adjustment to handle delayed THREE.js reporting

## Step-by-Step Implementation Order

### Step 1: Register Assets (assetRegistry.ts)
1. Identify all THREE.js loadable resources
2. Register each with appropriate priority
3. Test that registry contains expected count

**Validation**: `assetRegistry.getAll().length > 0`

### Step 2: Fix ThreeScene Progress Reporting (ThreeScene.tsx)
1. Update `reportProgress` call signature (line 816)
2. Remove percentage calculation (let LoadingProvider handle it)
3. Pass url as currentAsset parameter

**Validation**: Console logs show correct loaded/total counts

### Step 3: Add Dynamic Asset Handling (LoadingProvider.tsx)
1. Add empty registry fallback after line 149
2. Allow totalCount to update dynamically
3. Create assets on-the-fly if needed

**Validation**: Progress updates even with empty initial registry

### Step 4: Fix Completion Logic (LoadingScreen.tsx)
1. Update assetsComplete condition (line 156)
2. Add timeout safeguard for slow THREE.js initialization
3. Test with various load scenarios

**Validation**: Loading screen shows proper progress and completes when done

## Edge Cases & Risks

### Edge Case 1: THREE.js reports total=0
**Scenario**: No textures/models to load (all procedural geometry)
**Mitigation**: Timeout fallback already exists (line 135-151 in LoadingScreen.tsx)

### Edge Case 2: Lazy-loaded components delay reporting
**Scenario**: TennisCourt component loads after initial THREE setup
**Mitigation**: Use Suspense boundaries to track lazy component loading separately

### Edge Case 3: Environment preset loads instantly
**Scenario**: Drei Environment preset may not trigger loading manager
**Mitigation**: Manually track Environment component mount/ready state

### Risk 1: Race Condition
**Issue**: reportProgress called before LoadingProvider initializes
**Mitigation**: reportProgress is a noop if provider not ready (lines 38-42)

### Risk 2: Double Loading Tracking
**Issue**: Both AssetLoader and THREE.js report progress
**Mitigation**: Disable AssetLoader auto-start when THREE.js will handle loading

## Testing Checklist

- [ ] Loading screen shows proper count (e.g., "3/10")
- [ ] Progress bar animates from 0% to 100%
- [ ] Individual assets show loading status
- [ ] Loading completes when all assets loaded
- [ ] Timeout fallback works after 10 seconds
- [ ] FPS monitor transitions properly after loading
- [ ] No console errors during loading
- [ ] Works with empty asset registry
- [ ] Works with pre-registered assets
- [ ] Lazy-loaded TennisCourt tracked properly

## Estimated Complexity

| File | Lines Changed | Complexity | Time Estimate |
|------|---------------|------------|---------------|
| assetRegistry.ts | +20-30 | Medium | 15 min |
| ThreeScene.tsx | 1 line | Low | 5 min |
| LoadingProvider.tsx | +10-15 | Medium | 10 min |
| LoadingScreen.tsx | 2 lines | Low | 5 min |
| **TOTAL** | **~40 lines** | **Medium** | **35 min** |

## Implementation Priority

1. **HIGH**: Fix ThreeScene reportProgress signature (quick win)
2. **HIGH**: Register core assets in assetRegistry
3. **MEDIUM**: Add dynamic asset handling in LoadingProvider
4. **LOW**: Refine LoadingScreen completion logic

## Success Criteria

✅ Loading screen displays actual progress (not 0/0)
✅ Progress bar fills as assets load
✅ Individual assets show loading state
✅ Loading completes when assets ready
✅ No race conditions or timing issues
✅ Fallbacks work for edge cases
