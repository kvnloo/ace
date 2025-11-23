# Asset Registry Root Cause Analysis

## Executive Summary
The asset registry is populated but asset loading fails due to **ID mismatch** between asset definitions and loading phases. The registry contains assets with IDs like `tennis-court-1` while the loader searches for `geometry-tennis-court-1`.

## Root Cause Identification

### Primary Issue: Asset ID Mismatch
**Location**: Between `assetDefinitions.ts` and `phases.ts`

#### Asset Definitions (Registry)
```typescript
// src/utils/debug/assetDefinitions.ts
{
  id: 'tennis-court-1',  // Actual ID in registry
  type: 'court',
  componentPath: 'components/TennisCourt',
  ...
}
```

#### Loading Phases (Loader)
```typescript
// src/services/loading/phases.ts
assets: [
  'geometry-tennis-court-1',  // ID being searched for
  'geometry-tennis-court-2',
  ...
]
```

### Secondary Issue: Category vs Type Property
**Location**: `assetRegistry.ts` line 144-147

The `getAssetsByCategory` method filters by asset.type but AssetLoader expects a `category` property that doesn't exist:
```typescript
// AssetLoader expects asset.category
progress = {
  category: asset.category as AssetCategory,  // Line 278
  ...
}
```

## Impact Analysis

### Failed Operations
1. **Asset Loading**: AssetLoader.loadAsset() fails at line 273 with "Asset not found"
2. **Phase Loading**: All phases fail because no assets can be found
3. **Component Rendering**: Components never render because assets are never enabled

### Cascade Effect
```
Phase starts → createPhaseTasks() → registry.get('geometry-tennis-court-1') → NULL
                                                     ↓
                                           "Asset not found in registry"
                                                     ↓
                                                Phase fails
```

## Fix Strategy

### Solution 1: Asset ID Mapping (RECOMMENDED)
Create a mapping layer between phase asset IDs and registry asset IDs:

```typescript
// Create asset ID mapping
const ASSET_ID_MAP = {
  // Phase ID → Registry ID
  'geometry-tennis-court-1': 'tennis-court-1',
  'geometry-tennis-court-2': 'tennis-court-2',
  'geometry-grass-system': 'grass-blades',
  'light-ambient': 'ambient-light',
  'light-directional-sun': 'directional-light',
  // ... etc
};
```

### Solution 2: Update Phase Definitions
Align phase asset IDs with actual registry IDs:
```typescript
// Update phases.ts to use actual IDs
assets: [
  'tennis-court-1',  // Use actual registry ID
  'tennis-court-2',
  'tennis-court-3',
  'tennis-court-4',
]
```

### Solution 3: Fix Category Property
Add category property to assets or map type to category:
```typescript
// In AssetLoader or Registry
const category = asset.type; // Map type to category
```

## Implementation Plan

### Phase 1: Quick Fix (5 minutes)
1. Create ASSET_ID_MAP in phases.ts
2. Update AssetLoader.createPhaseTasks() to use mapping
3. Fix category property mapping

### Phase 2: Proper Solution (15 minutes)
1. Update all phase definitions to use correct asset IDs
2. Add validation to ensure all phase assets exist in registry
3. Create unit tests to prevent regression

### Phase 3: Validation (5 minutes)
1. Test asset loading through all phases
2. Verify components render when assets are enabled
3. Check performance metrics

## Code Changes Required

### File: src/services/loading/phases.ts
```typescript
// Add mapping at top of file
export const PHASE_TO_REGISTRY_MAP: Record<string, string> = {
  'geometry-tennis-court-1': 'tennis-court-1',
  'geometry-tennis-court-2': 'tennis-court-2',
  'geometry-tennis-court-3': 'tennis-court-3',
  'geometry-tennis-court-4': 'tennis-court-4',
  'geometry-court-lines': 'court-lines',
  'geometry-court-nets': 'court-net',
  'light-ambient': 'ambient-light',
  'light-directional-sun': 'directional-light',
  'geometry-grass-system': 'grass-blades',
  // ... add all mappings
};

// Helper function to resolve asset ID
export function resolveAssetId(phaseAssetId: string): string {
  return PHASE_TO_REGISTRY_MAP[phaseAssetId] || phaseAssetId;
}
```

### File: src/services/loading/AssetLoader.ts
```typescript
// Line 413 in createPhaseTasks()
for (const phaseAssetId of phaseDef.assets) {
  const assetId = resolveAssetId(phaseAssetId); // Resolve to registry ID
  const asset = this.registry.get(assetId);
  // ...
}

// Line 278 - Fix category mapping
progress = {
  id: assetId,
  category: (asset.type || 'unknown') as AssetCategory, // Map type to category
  status: AssetLoadStatus.PENDING,
  retries: 0
};
```

## Testing Strategy

### Unit Test Coverage
1. Test all phase asset IDs resolve to valid registry IDs
2. Test AssetLoader can load all defined assets
3. Test category mapping works correctly

### Integration Test
1. Start loading process
2. Verify each phase completes
3. Check assets are enabled in registry
4. Confirm components render

## Prevention Measures

1. **Type Safety**: Create shared types between phases and definitions
2. **Validation**: Add startup validation to ensure all phase assets exist
3. **Documentation**: Document the ID naming convention
4. **CI Check**: Add test that validates phase/registry alignment

## Timeline
- **Immediate Fix**: 5 minutes (mapping layer)
- **Proper Solution**: 20 minutes (align IDs + tests)
- **Full Validation**: 10 minutes (testing all scenarios)

## Conclusion
The root cause is a simple ID mismatch between two systems that should be synchronized. The fix is straightforward: either create a mapping layer or align the IDs. The recommended approach is to fix the phase definitions to use the actual asset IDs from the registry, ensuring long-term maintainability.