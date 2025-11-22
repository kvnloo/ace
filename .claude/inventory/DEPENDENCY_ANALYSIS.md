# ACE Tennis Facility - Component Dependency Analysis

**Analysis Date:** 2025-11-22
**Total Components:** 44 TypeScript/React files
**Total Exports:** 85+ named/default exports

---

## Executive Summary

The ACE codebase follows a **clean, layered architecture** with:
- ✅ **No circular dependencies** detected
- ✅ **Clear dependency hierarchy** (12 distinct layers)
- ⚠️ **One high-complexity component** (ThreeScene.tsx - 1546 lines, 17 dependencies)
- ✅ **Good separation of concerns** between infrastructure, features, and presentation

---

## Dependency Layers (Bottom-up)

```
Level 0: External Libraries
├─ react, three.js, @react-three/fiber, framer-motion, lucide-react

Level 1: Types & Utilities
├─ types.ts (used by 7 components)
├─ courtTextures.ts
└─ webglCheck utilities

Level 2: Services
└─ geminiService.ts (AI chat integration)

Level 3: Infrastructure
├─ ErrorBoundary
├─ LoadingProvider (context for loading states)
└─ DebugLogger

Level 4: Visual Effects
├─ Grass (animated grass blades)
└─ ClayCourtEffect (clay court particles)

Level 5: Advanced Features
├─ CharacterSystem (character animation)
├─ WeatherSystem (dynamic weather)
├─ LightingSystem (time-of-day lighting)
└─ HeatMapOverlay (player analytics)

Level 6: Facility Spaces (11 components)
├─ ReceptionArea, LockerRoom, ParkingLot
├─ BMSControlRoom, HydroponicsSystem, MechanicalRooms
├─ TransportPods, RoboticGrassSystem
└─ SupportSpaces

Level 7: 3D Core Orchestration
├─ ThreeScene (main scene - HIGH COMPLEXITY)
├─ PersistentThreeScene
├─ LazyThreeScene
└─ SafeThreeScene

Level 8: UI Components
├─ NavBar
├─ WeatherControls
└─ LoadingProgress

Level 9: Pages
├─ Specifications
├─ Amenities
└─ AIChat

Level 10: Application Root
└─ App (routes views, manages state)

Level 11: Entry Point
└─ index.tsx (ReactDOM render)
```

---

## Core Dependencies (Most Critical)

| Library/Component | Import Count | Criticality | Purpose |
|-------------------|--------------|-------------|---------|
| **three** | 35 | 🔴 CRITICAL | 3D rendering engine foundation |
| **@react-three/fiber** | 28 | 🔴 CRITICAL | React integration for Three.js |
| **@react-three/drei** | 25 | 🟡 HIGH | Helper components (cameras, controls) |
| **types.ts** | 12 | 🟡 HIGH | Type definitions across app |
| **framer-motion** | 6 | 🟢 MEDIUM | UI animations |
| **lucide-react** | 11 | 🟢 LOW | Icon library |

---

## Component Dependency Tree

### Entry Flow
```
index.tsx
  └─ App
      ├─ NavBar
      ├─ ThreeScene ⚠️ (17 dependencies - main orchestrator)
      │   ├─ Grass
      │   ├─ ClayCourtEffect
      │   ├─ ReceptionArea
      │   ├─ ParkingLot
      │   ├─ BMSControlRoom
      │   ├─ RoboticGrassSystem
      │   ├─ TransportPods
      │   ├─ HydroponicsSystem
      │   ├─ MechanicalRooms
      │   ├─ LockerRoom
      │   └─ courtTextures
      ├─ AIChat
      │   └─ geminiService
      ├─ Specifications
      ├─ Amenities
      ├─ ErrorBoundary
      ├─ ThreeSceneDiagnostic
      └─ DebugLogger
```

### Demo/Example Components (Parallel Branch)
```
WeatherSystemExample
  ├─ WeatherSystem
  ├─ WeatherControls
  └─ Grass

HeatMapDemo
  └─ HeatMapOverlay

TennisCourtWithHeatMap
  ├─ HeatMapOverlay
  ├─ Grass
  ├─ ClayCourtEffect
  └─ courtTextures

CognitiveLab (standalone)
BiometricLab (standalone)
MovementStudio (standalone)
RecoverySuite (standalone)
```

---

## Leaf Components (No Internal Dependencies)

These components can be developed/tested independently:

1. **BasicThreeScene** - Simple 3D template
2. **TestScene** - Debug scene
3. **QualityBadge** - Visual quality indicator
4. **MissingComponentStub** - Placeholder component
5. **Grass** - Grass rendering effect
6. **ClayCourtEffect** - Clay court effect
7. **CharacterSystem** - Character animation
8. **geminiService** - AI service integration
9. **courtTextures** - Texture management
10. **webglCheck** - WebGL detection
11. **types** - Type definitions
12. **WeatherIntegrationSnippet** - Integration example

---

## High Fan-Out Components (Change Impact High)

Changes to these components affect many others:

| Component | Dependents | Risk | Impact Area |
|-----------|-----------|------|-------------|
| **types** | 7 | 🔴 HIGH | Type contracts across entire app |
| **HeatMapOverlay** | 3 | 🟢 LOW | Demo components only |
| **ThreeScene** | 2 | 🟡 MEDIUM | Scene wrappers (encapsulated) |
| **LoadingProvider** | 2 | 🟡 MEDIUM | Loading state consumers |
| **WeatherSystem** | 2 | 🟢 LOW | Demo components only |

---

## High Fan-In Components (Complexity High)

These components have many dependencies (harder to maintain):

| Component | Dependencies | Complexity | LOC | Notes |
|-----------|--------------|------------|-----|-------|
| **ThreeScene** | 17 | 🔴 VERY HIGH | 1546 | Main orchestrator - needs refactoring |
| **App** | 12 | 🟡 HIGH | 371 | Root component - acceptable |
| **TennisCourtWithHeatMap** | 7 | 🟡 HIGH | - | Complex demo component |
| **PersistentThreeScene** | 4 | 🟢 MEDIUM | - | Scene wrapper |

---

## Critical Path for Startup

Components required for main 3D demo to load:

```
index.tsx → App → ThreeScene → types → three → @react-three/fiber → @react-three/drei
```

**Startup Dependencies:**
- 3 internal components (index, App, ThreeScene)
- 1 utility (types)
- 3 external libraries (three, fiber, drei)

**Total Critical Path:** 7 components/libraries

---

## Build Order Recommendations

### Parallel Build Groups

**Group 1** (Foundations - Build First):
- types.ts
- courtTextures.ts
- webglCheck utilities
- geminiService.ts

**Group 2** (Infrastructure - Build Second):
- ErrorBoundary
- LoadingProvider
- DebugLogger

**Group 3** (Effects - Build Third):
- Grass
- ClayCourtEffect
- CharacterSystem

**Group 4** (Systems - Build Fourth):
- WeatherSystem
- LightingSystem
- HeatMapOverlay

**Group 5** (Facilities - Build Fifth):
- All 11 facility components (can build in parallel)

**Group 6** (Scenes - Build Sixth):
- ThreeScene, PersistentThreeScene, LazyThreeScene, SafeThreeScene

**Group 7** (UI - Build Seventh):
- NavBar, WeatherControls, LoadingProgress

**Group 8** (Pages - Build Eighth):
- Specifications, Amenities, AIChat

**Group 9** (Application - Build Ninth):
- App

**Group 10** (Entry - Build Last):
- index.tsx

---

## Component Categories

| Category | Count | Purpose |
|----------|-------|---------|
| Infrastructure | 4 | Error handling, loading, debugging |
| Navigation | 1 | Main navigation bar |
| Pages | 3 | Full page views |
| 3D Core | 4 | Scene orchestration and wrappers |
| 3D Facility | 11 | Facility space models |
| 3D Systems | 5 | Advanced features (weather, lighting, etc.) |
| Visual Effects | 2 | Reusable 3D effects |
| Demo/Examples | 11 | Demonstration components |
| Diagnostic | 5 | Development/debugging tools |
| Utilities | 3 | Helper functions |
| Services | 1 | External integrations |
| **TOTAL** | **50** | - |

---

## Circular Dependencies

**Status:** ✅ **NONE DETECTED**

The architecture follows proper layering with no circular imports. All dependencies flow in one direction (bottom-up from utilities to application).

---

## Recommendations

### 🔴 Critical Refactoring Needed

1. **Split ThreeScene.tsx** (1546 lines → target 300-500 lines)
   - Extract court rendering → `CourtRenderer.tsx`
   - Extract floor layouts → `FloorLayouts.tsx`
   - Extract building shell → `BuildingShell.tsx`
   - Extract UI overlays → `SceneControls.tsx`

### 🟡 High Priority

2. **Consolidate Demo Components**
   - Move all demo/example components to `src/components/demos/`
   - Benefits: clearer structure, easier code-splitting

3. **Create Component Loaders**
   - `FacilityComponentLoader` - dynamic loading of facility components
   - `SystemLoader` - lazy load advanced systems (weather, character)

### 🟢 Medium Priority

4. **Optimize Bundle Size**
   - Code-split demo components (not in critical path)
   - Lazy load: WeatherSystem, CharacterSystem, CognitiveLab, BiometricLab
   - Dynamic imports for facility components in ThreeScene

5. **Testing Strategy**
   - **Priority 1:** Test utilities (types, courtTextures, webglCheck)
   - **Priority 2:** Test infrastructure (ErrorBoundary, LoadingProvider)
   - **Priority 3:** Test services (geminiService)
   - **Priority 4:** Visual regression for 3D components
   - **Priority 5:** Integration tests for ThreeScene

### 📚 Documentation

6. **Architecture Documentation**
   - Document the 12-layer dependency structure
   - Create component ownership matrix
   - Establish dependency update strategy

7. **Development Guidelines**
   - Pre-commit hooks to detect circular dependencies
   - Component creation checklist (which layer?)
   - Dependency addition approval process

---

## Build Optimization Potential

### Current Bundle Structure
```
Main Bundle:
├─ App + Critical Path (required for startup)
├─ All Facility Components (could be code-split)
├─ All Demo Components (should be code-split)
└─ Advanced Systems (could be lazy loaded)

Recommended Structure:
├─ Core Bundle (App + ThreeScene + Infrastructure) - ~40% current size
├─ Facility Chunk (lazy loaded on demand) - ~30%
├─ Demos Chunk (separate, not loaded by default) - ~20%
└─ Systems Chunk (weather, character, etc.) - ~10%
```

**Estimated Bundle Reduction:** 40-60% for initial load

---

## Dependency Health Metrics

| Metric | Value | Status |
|--------|-------|--------|
| Total Components | 44 | ✅ |
| Circular Dependencies | 0 | ✅ |
| Max Component LOC | 1546 | ⚠️ (ThreeScene) |
| Max Dependencies (fan-in) | 17 | ⚠️ (ThreeScene) |
| Max Dependents (fan-out) | 7 | ✅ (types) |
| Leaf Components | 12 | ✅ |
| Dependency Layers | 12 | ✅ |
| Critical Path Length | 7 | ✅ |

---

## Next Steps

1. **Immediate:** Refactor ThreeScene.tsx into 4-5 smaller modules
2. **Short-term:** Move demo components to dedicated directory
3. **Medium-term:** Implement code-splitting for non-critical components
4. **Long-term:** Establish automated dependency graph generation in CI/CD

---

**Analysis Complete** ✅
**Deliverable:** `/home/kvn/workspace/evolve/repos/ace/.claude/inventory/dependency-graph.json`
**Documentation:** `/home/kvn/workspace/evolve/repos/ace/.claude/inventory/DEPENDENCY_ANALYSIS.md`
