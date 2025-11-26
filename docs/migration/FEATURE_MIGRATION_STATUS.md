# Feature Migration Status: enhance/3D → ace-3Dmerge

**Last Updated**: 2025-11-25 (Visual Enhancements Session)
**Current Branch**: claude/merge-3d-features-carefully-016UHu9qyUERZi7foXuCqokY
**Base Worktree**: ace-3Dmerge

---

## Executive Summary

This document tracks the migration of features from the `enhance/3D` branch to the `ace-3Dmerge` worktree. The migration follows an incremental, test-driven approach to avoid the issues that caused the original `enhance/3D` branch to break.

### Migration Progress Overview

| Category | enhance/3D Total | Migrated | In Progress | Remaining |
|----------|-----------------|----------|-------------|-----------|
| Core Components | 7 | 7 | 0 | 0 |
| Loading System | 4 | 4 | 1 | 0 |
| Weather System | 2 | 2 | 0 | 0 |
| Debug/Performance | 6 | 5 | 0 | 1 |
| Visual Enhancements | 4 | 4 | 0 | 0 |
| Facility Spaces | 12 | 0 | 0 | 12 |
| 3D Scene Variants | 8 | 0 | 0 | 8 |
| Advanced Features | 6 | 0 | 0 | 6 |
| **TOTAL** | **49+** | **22** | **1** | **27+** |

**Overall Progress**: ~45% migrated

---

## Migration History

### Phase 0: Initial Merge (2025-11-23) - Commit 9a91c0fd

**Safe features merged from enhance/3D:**
- ✅ Amenities.tsx (enhanced content)
- ✅ Specifications.tsx (detailed technical specs)
- ✅ LoadingScreen.tsx (adaptive loading with FPS monitoring)
- ✅ LoadingProvider.tsx (asset loading management)
- ✅ Documentation (468+ files in claudedocs/, docs/)
- ✅ Testing infrastructure (Playwright E2E suite)

### Phase 1: Structure Reorganization (2025-11-23) - Commit 875bce45

**Reorganized to match enhance/3D structure:**
- ✅ Created src/components/loading/ directory
- ✅ Created src/components/debug/ directory
- ✅ Created src/contexts/ directory
- ✅ Created src/hooks/ directory
- ✅ Created src/services/loading/ directory

### Phase 2: Dependencies Fix (2025-11-23) - Commit 5899e711

**Added missing dependencies:**
- ✅ WeatherSystem.tsx
- ✅ WeatherControls.tsx
- ✅ DebugContext.tsx
- ✅ AssetRegistry (src/utils/debug/)
- ✅ AssetLoader service
- ✅ Hooks (useAssetEnabled, useComponentEnabled, useFPSBatchController)

### Phase 3: FPS Monitor Enhancement (Completed)

**Completed:**
- ✅ FPSMonitor.tsx - Separate component with transition capabilities
- ✅ FPSMonitorContext.tsx - Global context for FPS state
- ✅ GlobalFPSMonitor.tsx - Persistent overlay component
- ✅ Portal rendering for proper z-index handling
- ✅ Overlay positioning fixed (top-44 to appear below other overlays)

### Phase 4: Visual Enhancements (Completed - 2025-11-25)

**Ported Visual Components:**
- ✅ LightingSystem.tsx - Advanced lighting with time-of-day presets, stadium floodlights, court spotlights, fog
- ✅ ClayCourtEffect.tsx - Procedural clay texture with Canvas API, animated dust particles
- ✅ GrassOptimized.tsx - Performance-optimized instanced grass with LOD system
- ✅ HeatMapOverlay.tsx - Heat map analytics with custom GLSL shaders, pattern detection, historical playback

**Features Added:**
- Time-of-day lighting presets (dawn, day, dusk, night)
- Stadium floodlights (16) and court spotlights (96)
- Volumetric fog and celestial light animation
- Quality-based shadow rendering
- Procedural clay texture with noise and dirt patches
- Animated dust particle system (150 particles)
- Instanced grass rendering with wind animation
- Camera distance-based LOD for performance
- AI-powered hot zone detection in heat maps
- Historical playback with timeline controls

---

## Component Migration Status

### ✅ MIGRATED - Core Components (7/7)

| Component | Status | Source Location | Target Location | Notes |
|-----------|--------|-----------------|-----------------|-------|
| NavBar.tsx | ✅ Done | src/components/ | src/components/ | Basic navigation |
| AIChat.tsx | ✅ Done | src/components/ | src/components/ | Chat interface |
| Amenities.tsx | ✅ Done | src/components/ | src/components/ | Enhanced content |
| Specifications.tsx | ✅ Done | src/components/ | src/components/ | Detailed specs |
| ThreeScene.tsx | ✅ Done | src/components/ | src/components/ | Main 3D scene |
| TennisCourt.tsx | ✅ Done | src/components/ | src/components/ | Individual court |
| App.tsx | ✅ Done | src/ | src/ | Main application |

### ✅ MIGRATED - Loading System (4/4 + 1 in progress)

| Component | Status | Notes |
|-----------|--------|-------|
| LoadingScreen.tsx | ✅ Done | Adaptive loading with FPS monitoring |
| LoadingProvider.tsx | ✅ Done | Context for loading state |
| AssetLoader.ts | ✅ Done | Service for asset management |
| AssetRegistry.ts | ✅ Done | Asset tracking singleton |
| FPSMonitor.tsx | 🔄 In Progress | Transition animation feature |

### ✅ MIGRATED - Weather System (2/2)

| Component | Status | Notes |
|-----------|--------|-------|
| WeatherSystem.tsx | ✅ Done | Rain, snow, wind effects |
| WeatherControls.tsx | ✅ Done | UI controls |

### ✅ PARTIAL - Debug/Performance (5/6)

| Component | Status | Notes |
|-----------|--------|-------|
| DebugContext.tsx | ✅ Done | Debug state management |
| debug/DebugPanel.tsx | ✅ Done | Debug overlay UI |
| debug/AssetToggle.tsx | ✅ Done | Asset management UI |
| debug/PresetSelector.tsx | ✅ Done | Preset selection |
| debug/BatchControlPanel.tsx | ✅ Done | Batch rendering controls |
| DebugLogger.tsx | ❌ Not Started | Logging system |

### ❌ NOT MIGRATED - Facility Spaces (0/12)

| Component | Priority | Complexity | Dependencies |
|-----------|----------|------------|--------------|
| ReceptionArea.tsx | Medium | Low | None |
| LockerRoom.tsx | Medium | Low | None |
| SupportSpaces.tsx | Low | Low | None |
| ParkingLot.tsx | Low | Low | None |
| MechanicalRooms.tsx | Low | Medium | None |
| BMSControlRoom.tsx | Medium | High | DebugContext |
| HydroponicsSystem.tsx | Low | Medium | None |
| BiometricLab.tsx | Low | Low | None |
| CognitiveLab.tsx | Low | Low | None |
| MovementStudio.tsx | Low | Low | None |
| RecoverySuite.tsx | Low | Low | None |
| TransportPods.tsx | Low | Medium | None |

### ❌ NOT MIGRATED - 3D Scene Variants (0/8)

| Component | Priority | Complexity | Dependencies |
|-----------|----------|------------|--------------|
| ThreeSceneOptimized.tsx | **HIGH** | High | LoadingProvider |
| BasicThreeScene.tsx | Low | Low | None |
| SafeThreeScene.tsx | Medium | Low | ErrorBoundary |
| LazyThreeScene.tsx | Medium | Medium | None |
| PersistentThreeScene.tsx | Low | Medium | None |
| ThreeSceneDiagnostic.tsx | Medium | Medium | DebugContext |
| ThreeSceneWithBatching.tsx | Medium | High | BatchController |
| ThreeSceneWrapper.tsx | Low | Low | None |

### ✅ MIGRATED - Visual Enhancements (4/4)

| Component | Status | Notes |
|-----------|--------|-------|
| LightingSystem.tsx | ✅ Done | Time-of-day presets, floodlights, fog |
| ClayCourtEffect.tsx | ✅ Done | Procedural texture, dust particles |
| GrassOptimized.tsx | ✅ Done | Instanced grass with LOD |
| HeatMapOverlay.tsx | ✅ Done | GLSL shaders, pattern detection |

### ❌ NOT MIGRATED - Advanced Features (0/6)

| Component | Priority | Complexity | Dependencies |
|-----------|----------|------------|--------------|
| CharacterSystem.tsx | **HIGH** | Very High | Pathfinding, animations |
| Grass.tsx | Medium | Medium | None |
| TennisCourtWithHeatMap.tsx | Medium | Medium | HeatMapOverlay ✅ |
| CourtNavigationUI.tsx | Medium | Medium | None |
| ErrorBoundary.tsx | **HIGH** | Low | None |
| FallbackUI.tsx | Medium | Low | None |

---

## Migration Workflow

### TDD Approach

1. **Before migrating any component:**
   - Write/identify tests for the component
   - Ensure tests pass in enhance/3D branch
   - Document expected behavior

2. **Migration process:**
   - Copy component to ace-3Dmerge
   - Fix any import path issues
   - Run TypeScript compiler (`npm run typecheck`)
   - Run tests (`npm test`)
   - Run dev server and verify functionality
   - Commit only if all checks pass

3. **After migration:**
   - Update this document
   - Update CHANGELOG.md
   - Run E2E tests if applicable

### Testing Commands

```bash
# TypeScript check
npm run typecheck

# Run all tests
npm test

# Run specific component tests
npm test -- --grep "ComponentName"

# Start dev server
npm run dev

# Run E2E tests
npm run test:e2e
```

---

## Priority Migration Queue

### Sprint 1 (Current): FPS Monitor Enhancement
**Goal**: Complete FPS monitor transition animation
**Components**: FPSMonitor.tsx, GlobalFPSMonitor.tsx

### Sprint 2: Core Safety & Performance
**Goal**: Add error handling and performance optimization
**Components**:
1. ErrorBoundary.tsx (essential for safe development)
2. FallbackUI.tsx
3. ThreeSceneOptimized.tsx

### Sprint 3: Visual Enhancements
**Goal**: Add grass rendering and lighting
**Components**:
1. GrassOptimized.tsx
2. Grass.tsx
3. LightingSystem.tsx

### Sprint 4: Interactive Features
**Goal**: Add court navigation and heatmaps
**Components**:
1. CourtNavigationUI.tsx
2. TennisCourtWithHeatMap.tsx
3. HeatMapOverlay.tsx

### Sprint 5: Characters & Animation
**Goal**: Bring facility to life
**Components**:
1. CharacterSystem.tsx

### Sprint 6+: Facility Spaces
**Goal**: Complete facility visualization
**Components**: All facility space components

---

## Known Issues & Blockers

### Current Issues
1. **FPS Monitor Transition**: Animation from loading screen to overlay needs completion
2. **Untracked feature files**: WeatherSystem, batch-loading services have TypeScript errors but are not blocking main app

### Resolved Issues
1. ✅ App.tsx ease type error - Fixed with `as const`
2. ✅ DebugContext not exported - Added type export
3. ✅ Property 'category' vs 'type' mismatch - Fixed in LoadingProvider and AssetLoader

---

## File References

### Source Branch (enhance/3D)
- Repository: `/home/kvn/workspace/evolve/repos/ace`
- Branch: `enhance/3D`
- Components: `src/components/` (64 components)

### Target Worktree (ace-3Dmerge)
- Location: `/home/kvn/workspace/evolve/repos/ace/worktrees/ace-3Dmerge`
- Branch: `claude/merge-3d-features-carefully-016UHu9qyUERZi7foXuCqokY`
- Components: `src/components/` (currently ~20 components)

### Related Documentation
- `docs/analysis/feature-comparison.md` - Detailed component comparison
- `docs/analysis/loading-screen-enhance-3d.md` - Loading system analysis
- `docs/threescene-comparison.md` - ThreeScene implementation differences
- `claudedocs/07-features/COMPLETE_FEATURE_INVENTORY.md` - Full feature list

---

## Success Criteria

### Per Component
- [ ] TypeScript compiles without errors
- [ ] Component renders without console errors
- [ ] Functionality matches enhance/3D behavior
- [ ] Performance is acceptable (60 FPS target)
- [ ] Tests pass (if applicable)

### Overall Migration
- [ ] All P0 components migrated
- [ ] All P1 components migrated
- [ ] E2E tests pass
- [ ] Performance benchmarks met
- [ ] Documentation updated

---

**Document Maintenance**:
- Update after each component migration
- Review weekly during active development
- Archive when migration is complete
