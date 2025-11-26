# PR #6 Integration Plan - Safe Feature Cherry-Pick

## Overview

This plan integrates valuable facility/lab components from PR #6 into the current branch WITHOUT breaking existing functionality.

**Strategy**: Copy standalone components, adapt imports, add as optional features.

---

## Pre-Integration Checklist

- [x] Build passes (`npm run build`)
- [x] Tests pass
- [x] Feature comparison complete
- [ ] Backup/checkpoint created
- [ ] Integration branch created

---

## Phase 1: Create Directory Structure

```bash
# Create organized subdirectories for new components
mkdir -p src/components/facilities
mkdir -p src/components/labs
mkdir -p src/components/farming
```

---

## Phase 2: Facility Components Integration

### 2.1 BMSControlRoom.tsx

**Source**: `git show pr6-temp:components/BMSControlRoom.tsx`

**Steps**:
1. Copy file to `src/components/facilities/BMSControlRoom.tsx`
2. Update imports:
   ```tsx
   // Change from
   import { Html, Text, Float } from '@react-three/drei';
   // To (if needed)
   import { Html, Text } from '@react-three/drei';
   ```
3. Add optional DebugContext integration
4. Export from facilities index

**Risk**: LOW - Self-contained component with no external dependencies

### 2.2 ReceptionArea.tsx

**Source**: `git show pr6-temp:components/ReceptionArea.tsx`

**Steps**:
1. Copy to `src/components/facilities/ReceptionArea.tsx`
2. Remove/fix font path: `/fonts/inter-bold.woff` → use system font or add font
3. Update drei imports
4. Export from facilities index

**Risk**: LOW - One font dependency to handle

### 2.3 ParkingLot.tsx

**Source**: `git show pr6-temp:components/ParkingLot.tsx`

**Steps**:
1. Copy to `src/components/facilities/ParkingLot.tsx`
2. Update drei imports
3. Export from facilities index

**Risk**: LOW - Completely standalone

### 2.4 LockerRoom.tsx

**Source**: `git show pr6-temp:components/LockerRoom.tsx`

**Steps**:
1. Copy to `src/components/facilities/LockerRoom.tsx`
2. Update drei imports
3. Export from facilities index

**Risk**: LOW - Completely standalone

### 2.5 MechanicalRooms.tsx

**Source**: `git show pr6-temp:components/MechanicalRooms.tsx`

**Steps**:
1. Copy to `src/components/facilities/MechanicalRooms.tsx`
2. Update drei imports
3. Export from facilities index

**Risk**: LOW - Animated but self-contained

### 2.6 Create facilities/index.ts

```typescript
// src/components/facilities/index.ts
export { BMSControlRoom, OperatorWorkstation, WallDisplayScreen } from './BMSControlRoom';
export { ReceptionArea } from './ReceptionArea';
export { ParkingLot, ParkingSpace } from './ParkingLot';
export { LockerRoom } from './LockerRoom';
export { MechanicalRooms } from './MechanicalRooms';
```

---

## Phase 3: Lab Components Integration

### 3.1 BiometricLab.tsx

**Source**: `git show pr6-temp:components/BiometricLab.tsx`

**Steps**:
1. Copy to `src/components/labs/BiometricLab.tsx`
2. Update imports
3. Export from labs index

### 3.2 CognitiveLab.tsx

**Source**: `git show pr6-temp:components/CognitiveLab.tsx`

**Steps**:
1. Copy to `src/components/labs/CognitiveLab.tsx`
2. Update imports
3. Export from labs index

### 3.3 MovementStudio.tsx

**Source**: `git show pr6-temp:components/MovementStudio.tsx`

**Steps**:
1. Copy to `src/components/labs/MovementStudio.tsx`
2. Update imports
3. Export from labs index

### 3.4 RecoverySuite.tsx

**Source**: `git show pr6-temp:components/RecoverySuite.tsx`

**Steps**:
1. Copy to `src/components/labs/RecoverySuite.tsx`
2. Update imports
3. Export from labs index

### 3.5 Create labs/index.ts

```typescript
// src/components/labs/index.ts
export { BiometricLab } from './BiometricLab';
export { CognitiveLab } from './CognitiveLab';
export { MovementStudio } from './MovementStudio';
export { RecoverySuite } from './RecoverySuite';
```

---

## Phase 4: Farming Integration

### 4.1 HydroponicsSystem.tsx

**Source**: `git show pr6-temp:components/HydroponicsSystem.tsx`

**Steps**:
1. Copy to `src/components/farming/HydroponicsSystem.tsx`
2. Update imports
3. Add useDebug integration for dev mode
4. Export from farming index

**Note**: This complements existing InstancedFarmRacks

### 4.2 Create farming/index.ts

```typescript
// src/components/farming/index.ts
export { HydroponicsSystem } from './HydroponicsSystem';
```

---

## Phase 5: ThreeScene Integration (Optional)

Add new components as optional renders in ThreeScene.tsx:

```tsx
// In ThreeScene.tsx imports section
const BMSControlRoom = lazy(() => import('./facilities/BMSControlRoom'));
const ReceptionArea = lazy(() => import('./facilities/ReceptionArea'));
const ParkingLot = lazy(() => import('./facilities/ParkingLot'));
const HydroponicsSystem = lazy(() => import('./farming/HydroponicsSystem'));

// In render section (GroundFloor or as standalone)
{showFacilities && (
  <Suspense fallback={null}>
    <BMSControlRoom position={[-50, 0, -30]} />
    <ReceptionArea position={[0, 0, 60]} />
    <ParkingLot position={[-100, 0, -20]} />
  </Suspense>
)}
```

**Important**: This step is OPTIONAL. Components can exist without being rendered.

---

## Phase 6: Verification

### Build Check
```bash
npm run build
# Should complete with no errors
```

### Type Check
```bash
npm run typecheck
# Should pass
```

### Visual Check
```bash
npm run dev
# Load application, verify no regressions
```

---

## Rollback Plan

If anything breaks:

```bash
# Revert to before integration
git checkout HEAD~N  # where N is number of commits

# Or selectively remove
git rm -r src/components/facilities/
git rm -r src/components/labs/
git rm -r src/components/farming/
git commit -m "Rollback: Remove PR #6 components"
```

---

## Phase 7: Advanced Systems Integration

### 7.1 TransportPods System (687 lines)

**What it does**: Autonomous transit pods that move visitors between facility floors/areas via a station network with smooth Catmull-Rom curve pathfinding.

**Key Features**:
- 7 stations: Main Entrance, Parking, Ground Courts, L1-L3 Hubs, Outdoor Plaza
- Pod vehicles with boarding/traveling/arriving states
- Smooth path generation with elevation arcs
- Real-time passenger tracking
- Interactive station/pod clicking

**Integration Strategy**:

```bash
# Copy to transport subdirectory
mkdir -p src/components/transport
```

**Steps**:
1. Copy TransportPods.tsx to `src/components/transport/TransportPods.tsx`
2. Update imports (drei, THREE)
3. Add `useDebug` integration for visibility toggle
4. Make station positions configurable via props (not hardcoded)
5. Add lazy loading wrapper
6. Create `src/components/transport/index.ts`

**Refactoring needed**:
```tsx
// Before (hardcoded stations)
const STATIONS: PodStation[] = [
  { id: 'main_entrance', position: [0, 0.5, 65], ... }
];

// After (configurable)
interface TransportPodsProps {
  stations?: PodStation[];
  podCount?: number;
  enabled?: boolean;
}

const DEFAULT_STATIONS: PodStation[] = [...];

export const TransportPods: React.FC<TransportPodsProps> = ({
  stations = DEFAULT_STATIONS,
  podCount = 4,
  enabled = true
}) => { ... }
```

**Risk**: MEDIUM - Need to ensure station positions align with current building layout

---

### 7.2 CharacterSystem (577 lines)

**What it does**: Animated NPCs populating the facility - players on courts, coaches, staff, visitors walking around, spectators in bleachers.

**Key Features**:
- 5 character types: player, coach, staff, visitor, spectator
- State machine: idle → walking → playing/coaching → resting
- Simple waypoint pathfinding
- Activity zones (courts, walkways, reception, bleachers)
- Court assignment system (players distributed across 24 courts)
- Instanced spectator crowds

**Integration Strategy**:

```bash
# Copy to characters subdirectory
mkdir -p src/components/characters
```

**Steps**:
1. Copy CharacterSystem.tsx to `src/components/characters/CharacterSystem.tsx`
2. Update imports
3. Add `useDebug` for toggling character visibility
4. Update court positions to match current `FEATURES` array
5. Add InstancedMesh optimization for large spectator counts
6. Create `src/components/characters/index.ts`

**Refactoring needed**:
```tsx
// Add performance optimization for spectators
// Current: Individual meshes per spectator (up to 200)
// Better: InstancedMesh for spectators

// Add debug toggle
const { showCharacters = true } = useDebug?.() ?? {};
if (!enabled || !showCharacters) return null;
```

**Integration with existing systems**:
- Court positions should read from shared config (not duplicate)
- Can integrate with RoboticGrassSystem (robots avoid characters)
- Add to PerformanceOverlay character count metric

**Risk**: MEDIUM - Performance impact with many characters; may need LOD

---

### 7.3 Create transport/index.ts

```typescript
// src/components/transport/index.ts
export { TransportPods } from './TransportPods';
export type { PodStation, Pod, PodRoute } from './TransportPods';
```

### 7.4 Create characters/index.ts

```typescript
// src/components/characters/index.ts
export { CharacterSystem, Character, SpectatorCrowd } from './CharacterSystem';
export type { CharacterData, CharacterSystemProps } from './CharacterSystem';
```

---

## Phase 8: ThreeScene Integration for All New Systems

After all components are copied, add to ThreeScene.tsx:

```tsx
// Add lazy imports
const TransportPods = lazy(() => import('./transport/TransportPods'));
const CharacterSystem = lazy(() => import('./characters/CharacterSystem'));
const BMSControlRoom = lazy(() => import('./facilities/BMSControlRoom'));
const ReceptionArea = lazy(() => import('./facilities/ReceptionArea'));
const ParkingLot = lazy(() => import('./facilities/ParkingLot'));
const HydroponicsSystem = lazy(() => import('./farming/HydroponicsSystem'));

// Add feature flags (can be controlled via UI or debug)
interface SceneFeatures {
  showFacilities: boolean;
  showTransport: boolean;
  showCharacters: boolean;
  showLabs: boolean;
}

// In render, wrap in Suspense groups
{features.showFacilities && (
  <Suspense fallback={null}>
    <BMSControlRoom position={[-50, 0, -30]} />
    <ReceptionArea position={[0, 0, 60]} />
    <ParkingLot position={[-100, 0, -20]} />
  </Suspense>
)}

{features.showTransport && (
  <Suspense fallback={null}>
    <TransportPods enabled={true} />
  </Suspense>
)}

{features.showCharacters && (
  <Suspense fallback={null}>
    <CharacterSystem
      playerCount={48}
      coachCount={12}
      spectatorCount={100}  // Reduced for performance
      enabled={true}
    />
  </Suspense>
)}
```

---

## Components NOT Being Integrated

| Component | Reason |
|-----------|--------|
| QualityBadge | Redundant with PerformanceOverlay |
| SupportSpaces | Low value, too generic |

---

## Estimated Time

| Phase | Duration |
|-------|----------|
| Phase 1: Directories | 1 min |
| Phase 2: Facilities (5 components) | 15 min |
| Phase 3: Labs (4 components) | 10 min |
| Phase 4: Farming (1 component) | 5 min |
| Phase 5: Basic ThreeScene hooks | 10 min |
| Phase 6: Verification | 5 min |
| Phase 7: Transport + Characters | 25 min |
| Phase 8: Full ThreeScene integration | 15 min |
| **Total** | **~85 min** |

---

## Success Criteria

1. Build passes with no errors
2. Existing features work unchanged
3. New components available for import
4. No TypeScript errors
5. No runtime errors in dev mode

---

## Post-Integration

After successful integration:
1. Update ThreeScene to optionally render new facilities (if desired)
2. Add toggle in UI to show/hide facility details
3. Document new component APIs
4. Consider adding tests for new components
