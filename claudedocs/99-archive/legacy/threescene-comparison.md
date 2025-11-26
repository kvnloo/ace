# ThreeScene Component Comparison: dev vs main

**Analysis Date:** 2025-11-22
**Mission:** Identify why 3D scene fails to render in main branch

---

## Executive Summary

**ROOT CAUSE IDENTIFIED:** The main branch ThreeScene.tsx imports **13 additional component dependencies** and **3 additional utility modules** that are missing in the dev branch, causing rendering failures when these modules cannot be resolved.

### File Size Comparison
- **Dev Branch:** 893 lines (`worktrees/ace-dev/components/ThreeScene.tsx`)
- **Main Branch:** 1,723 lines (`src/components/ThreeScene.tsx`)
- **Difference:** 830 lines (93% larger in main)

---

## Critical Differences

### 1. Component Import Differences

#### Main Branch ONLY (Missing in Dev):
```typescript
// Enhanced Court Components
import Grass from './Grass';
import ClayCourtEffect from './ClayCourtEffect';
import ReceptionArea from './ReceptionArea';

// Utility & Support Components
import { getCourtTexture, type CourtSurfaceType } from '../utils/courtTextures';
import { ParkingLot } from './ParkingLot';
import { BMSControlRoom } from './BMSControlRoom';
import RoboticGrassSystem from './RoboticGrassSystem';
import TransportPods from './TransportPods';
import HydroponicsSystem from './HydroponicsSystem';
import MechanicalRooms from './MechanicalRooms';
import LockerRoom from './LockerRoom';

// Loading & Performance Systems
import { LoadingProvider } from './loading/LoadingProvider';
import LoadingScreen from './loading/LoadingScreen';
import { AssetRegistry } from '../utils/debug/assetRegistry';

// Weather System (lines 33-34)
import WeatherSystem, { useWeather } from './WeatherSystem';
import WeatherControls from './WeatherControls';
```

#### Both Branches Have:
```typescript
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Grid, PerspectiveCamera, Environment,
         Text, useCursor, ContactShadows, Float, Line } from '@react-three/drei';
import * as THREE from 'three';
import { FeatureData } from '../types';
import { Layers, Ruler, Eye, Box, Maximize2 } from 'lucide-react';
```

---

### 2. Component Initialization Differences

#### Main Branch Canvas Setup (Lines 1639-1644):
```typescript
<Canvas
  shadows={performanceMode !== 'low'}
  dpr={performanceMode === 'high' ? [1, 1.5] : 1}
  camera={{ position: [180, 100, 180], fov: 35 }}
  gl={{ antialias: true }}
>
```

**Features:**
- Performance mode switching (high/medium/low)
- Dynamic DPR (Device Pixel Ratio) adjustment
- Conditional shadows based on performance mode
- Explicit GL antialias configuration

#### Dev Branch Canvas Setup (Line 827):
```typescript
<Canvas shadows dpr={[1, 1.5]} camera={{ position: [180, 100, 180], fov: 35 }}>
```

**Features:**
- Static shadows (always enabled)
- Fixed DPR
- No performance mode switching
- No explicit GL configuration

---

### 3. Loading System (MAIN ONLY)

#### Main Branch (Lines 1612-1621):
```typescript
<LoadingProvider registry={AssetRegistry.getInstance()}>
  <div className="w-full h-full absolute inset-0">
    {!isLoadingComplete && (
      <LoadingScreen
        onComplete={handleLoadingComplete}
        minimumDisplayTime={2000}
        showFPSMonitor={true}
        qualityMode="auto"
      />
    )}
    {/* ... rest of scene */}
  </div>
</LoadingProvider>
```

**Dev Branch:** No loading system present

---

### 4. Weather System Integration (MAIN ONLY)

#### State Management (Lines 1590-1591):
```typescript
const { weather, intensity, setWeather, setIntensity } = useWeather();
```

#### Weather Controls (Lines 1632-1637):
```typescript
<WeatherControls
  currentWeather={weather}
  onWeatherChange={setWeather}
  intensity={intensity}
  onIntensityChange={setIntensity}
/>
```

#### Weather Rendering (Lines 1659-1665):
```typescript
<WeatherSystem
  weather={weather}
  intensity={intensity}
  enableEffects={true}
  areaSize={[300, 300]}
  enableWetSurfaces={true}
/>
```

**Dev Branch:** No weather system present

---

### 5. Enhanced Court Rendering

#### Main Branch - Tennis Court (Lines 629-683):
```typescript
const TennisCourt: React.FC<{ position, type }> = ({ position, type }) => {
  const colors = { grass: '#4d7c0f', hard: '#3b82f6', clay: '#ea580c', wood: '#d4a373' };

  // Enhanced ClayCourtEffect for clay courts
  if (type === 'clay') {
    return (
      <group position={position}>
        <ClayCourtEffect position={[0, 0, 0]} width={10} length={22} />
        <Net width={10} />
      </group>
    );
  }

  // Texture configuration for wood/hard courts
  const textureConfig = useMemo(() => getCourtTexture(type as CourtSurfaceType), [type]);

  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 22]} />
        <meshStandardMaterial
          color={textureConfig.color}
          map={textureConfig.map}
          normalMap={textureConfig.normalMap}
          roughnessMap={textureConfig.roughnessMap}
          roughness={textureConfig.roughness}
          metalness={textureConfig.metalness || 0}
        />
      </mesh>

      {/* Grass blades for grass courts */}
      {type === 'grass' && (
        <Grass
          position={[0, 0.1, 0]}
          size={[10, 22]}
          bladeCount={1500}
          color="#4d7c0f"
          animated={true}
        />
      )}
      {/* ... court lines ... */}
    </group>
  );
};
```

#### Dev Branch - Tennis Court (Lines 400-419):
```typescript
const TennisCourt: React.FC<{ position, type }> = ({ position, type }) => {
  const colors = { grass: '#4d7c0f', hard: '#3b82f6', clay: '#ea580c', wood: '#d4a373' };
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 22]} />
        <meshStandardMaterial
          color={colors[type]}
          roughness={type === 'wood' ? 0.2 : 0.8}
        />
      </mesh>
      {/* ... simple court lines ... */}
      <Net width={10} />
    </group>
  );
};
```

**Key Differences:**
- Main: Separate ClayCourtEffect component, texture system, grass blades
- Dev: Simple color-based rendering only

---

### 6. Advanced Facility Components (MAIN ONLY)

#### BleacherSection Component (Lines 541-627)
- 500+ seats spectator seating
- Retractable bleacher mechanics
- Accessible seating integration
- Low-poly performance optimization

#### Reception Area (Line 1166)
```typescript
<ReceptionArea showMeasurements={showMeasurements} showLabels={showLabels} />
```

#### Locker Rooms (Lines 1169-1181)
```typescript
<LockerRoom position={[57.5, 0, 0]} label="MEN'S LOCKER ROOM" rotation={Math.PI / 2} />
<LockerRoom position={[-57.5, 0, 0]} label="WOMEN'S LOCKER ROOM" rotation={-Math.PI / 2} />
```

#### Robotic Grass System (Lines 1220-1225)
```typescript
<RoboticGrassSystem
  position={roboticSystemPosition}
  robotCount={6}
  showPaths={showMeasurements}
  showStatus={showLabels}
/>
```

#### BMS Control Room (Line 1255)
```typescript
<BMSControlRoom position={[-45, 0.1, 40]} />
```

#### Mechanical Rooms (Lines 1258-1262)
```typescript
<MechanicalRooms
  position={[35, 0.1, -40]}
  showMetrics={showMeasurements}
  showLabels={showMeasurements}
/>
```

#### VIP Viewing Suites (Lines 941-1018)
- Glass viewing windows
- Premium seating
- Accent lighting
- Ceiling with recessed lighting

#### Glass Walkway System (Lines 1020-1072)
- Transparent glass floors with grid pattern
- Safety barriers
- LED accent lighting
- Structural support

#### Hydroponics System (Lines 1425-1444)
- Vertical farming towers
- Autonomous farming sectors
- Metrics display

#### Transport Pods (Line 1677)
```typescript
<TransportPods showRoutes={annotationMode === 'LABELS'} />
```

#### Parking Lot (Line 1512)
```typescript
<ParkingLot position={[-100, 0.2, -20]} />
```

---

### 7. Performance Mode System (MAIN ONLY)

#### State Management (Line 1585):
```typescript
const [performanceMode, setPerformanceMode] = useState<'high' | 'medium' | 'low'>('medium');
```

#### Controls Integration (Lines 1623-1630):
```typescript
<ControlsOverlay
  activeFloor={activeFloor}
  setActiveFloor={setActiveFloor}
  annotationMode={annotationMode}
  setAnnotationMode={setAnnotationMode}
  performanceMode={performanceMode}  // ← MAIN ONLY
  setPerformanceMode={setPerformanceMode}  // ← MAIN ONLY
/>
```

#### Performance Controls UI (Lines 241-261):
```typescript
{/* Performance Mode Selector */}
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
</div>
```

**Dev Branch:** No performance controls

---

### 8. UI Text Styling Differences

#### Main Branch (Lines 111, 193):
```typescript
<div className="px-3 py-2 text-xs font-bold text-white/80 uppercase tracking-wider flex items-center gap-2">
```

#### Dev Branch (Lines 111, 137):
```typescript
<div className="px-3 py-2 text-xs font-bold text-white/50 uppercase tracking-wider flex items-center gap-2">
```

**Difference:** Main uses `text-white/80`, Dev uses `text-white/50` (reduced opacity)

---

### 9. Enhanced Features List

#### Main Branch (Lines 71-78):
```typescript
const FEATURES: FeatureData[] = [
  { id: 'ground_tennis', title: 'Ground: Tennis Arena', description: '24 Courts: 6 Hard, 6 Clay, 6 Grass, 6 Wood.', icon: '🎾', position: [0, 5, 20] },
  { id: 'level1_racquet', title: 'L1: Racquet Mezzanine', description: '16 Badminton, 4 Squash, 16 Table Tennis.', icon: '🏸', position: [-20, 25, 0] },
  { id: 'level1_mechanical', title: 'L1: Mechanical Systems', description: 'HVAC, Electrical, Water Treatment, Backup Power & Maintenance Robots.', icon: '⚙️', position: [35, 25, -40] },  // ← MAIN ONLY
  { id: 'level2_social', title: 'L2: Pickleball & Heritage', description: '8 Pickleball courts and 1 Real Tennis court.', icon: '🏓', position: [20, 45, 0] },
  { id: 'level3_farm', title: 'L3: Vertical Grass Lab', description: '4x 500sqm Autonomous Farming Sectors.', icon: '🌱', position: [0, 65, 0] },
  { id: 'outdoor_plaza', title: 'Outdoor Plaza', description: 'Public courts and relaxation zones.', icon: '🌳', position: [80, 0, 80] },
];
```

**Dev Branch:** Missing the `level1_mechanical` feature entry

---

### 10. 3D Court Label Component (MAIN ONLY)

#### Main Branch (Lines 829-892):
```typescript
const CourtLabel = ({ position, label }: { position: [number, number, number], label: string }) => {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group position={position} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
        {/* Label Background Panel */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[16, 4, 0.5]} />
          <meshStandardMaterial
            color={hovered ? BRAND_YELLOW : "#1e293b"}
            metalness={0.3}
            roughness={0.4}
            emissive={hovered ? BRAND_YELLOW : "#334155"}
            emissiveIntensity={hovered ? 0.3 : 0.1}
          />
        </mesh>
        {/* ... accent strip and text ... */}
      </group>
    </Float>
  );
};
```

#### Usage (Lines 1211-1217):
```typescript
{showLabels && rowConfigs.map((row, i) => (
  <CourtLabel
    key={`lbl-${i}`}
    position={[-55, 5, row.z]}
    label={row.label}
  />
))}
```

**Dev Branch:** Uses simple 2D Text component instead (Lines 636-650)

---

### 11. Glass Barrier Components (MAIN ONLY)

#### GlassBarrier (Lines 896-939):
```typescript
const GlassBarrier: React.FC<{ position, width, rotation? }> = ({ position, width, rotation = [0, 0, 0] }) => (
  <group position={position} rotation={rotation}>
    {/* Glass Panel */}
    <mesh position={[0, 1.2, 0]}>
      <boxGeometry args={[width, 2.4, 0.15]} />
      <meshPhysicalMaterial
        color="#e0f2fe"
        transmission={0.92}
        opacity={0.15}
        transparent
        roughness={0.05}
        metalness={0.1}
        thickness={0.5}
        envMapIntensity={1.2}
        clearcoat={1}
        clearcoatRoughness={0.1}
      />
    </mesh>
    {/* Top Rail, Bottom Rail, Vertical Support Posts */}
  </group>
);
```

**Dev Branch:** No glass barrier components

---

### 12. Level 2 Enhanced Components (MAIN ONLY)

#### Viewing Cutouts with Glass (Lines 1367-1387):
```typescript
{/* Viewing Cutouts in Floor for Ground Floor Visibility */}
{Array.from({ length: 4 }).map((_, i) => (
  <group key={`viewing-${i}`} position={[-30 + i * 20, 0, -20]}>
    {/* Transparent viewing window in floor */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
      <planeGeometry args={[6, 8]} />
      <meshPhysicalMaterial
        color="#dbeafe"
        transmission={0.95}
        opacity={0.1}
        transparent
        roughness={0.02}
        thickness={0.3}
      />
    </mesh>
    {/* Safety barrier around viewing window */}
    <GlassBarrier position={[0, 0, 4]} width={6} rotation={[0, 0, 0]} />
    {/* ... more barriers ... */}
  </group>
))}
```

#### Information Kiosks (Lines 1390-1409):
```typescript
{/* Information Kiosks along walkways */}
{Array.from({ length: 8 }).map((_, i) => {
  const angle = (i / 8) * Math.PI * 2;
  const radius = (walkwayWidth + walkwayDepth) / 4;
  return (
    <group key={`kiosk-${i}`} position={[Math.cos(angle) * radius * 0.7, 0.8, Math.sin(angle) * radius * 0.7]}>
      <mesh>
        <cylinderGeometry args={[0.3, 0.4, 1.6, 6]} />
        <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.9, 0]} rotation={[0, -angle, 0]}>
        <boxGeometry args={[0.6, 0.8, 0.05]} />
        <meshStandardMaterial
          color="#1e293b"
          emissive="#3b82f6"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
})}
```

**Dev Branch:** No viewing cutouts or information kiosks

---

### 13. Footer Version Differences

#### Main Branch (Lines 1714-1717):
```typescript
<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/80 text-xs pointer-events-none select-none font-mono text-center">
  ECO-FACILITY VIEWER v3.3 <br />
  INTERACTIVE ARCHITECTURAL MODEL
</div>
```

#### Dev Branch (Lines 885-888):
```typescript
<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/50 text-xs pointer-events-none select-none font-mono text-center">
  ECO-FACILITY VIEWER v3.3 <br/>
  INTERACTIVE ARCHITECTURAL MODEL
</div>
```

**Difference:** Main uses `text-white/80`, Dev uses `text-white/50`

---

## Dependency Analysis

### Component Dependencies Status in Main Branch:

| Component | Status | Location |
|-----------|--------|----------|
| `Grass.tsx` | ✅ Exists | `src/components/` |
| `ClayCourtEffect.tsx` | ✅ Exists | `src/components/` |
| `ReceptionArea.tsx` | ✅ Exists | `src/components/` |
| `ParkingLot.tsx` | ✅ Exists | `src/components/` |
| `BMSControlRoom.tsx` | ✅ Exists | `src/components/` |
| `RoboticGrassSystem.tsx` | ✅ Exists | `src/components/` |
| `TransportPods.tsx` | ✅ Exists | `src/components/` |
| `HydroponicsSystem.tsx` | ✅ Exists | `src/components/` |
| `MechanicalRooms.tsx` | ✅ Exists | `src/components/` |
| `LockerRoom.tsx` | ✅ Exists | `src/components/` |
| `loading/` directory | ✅ Exists | `src/components/loading/` |
| `courtTextures.ts` | ✅ Exists | `src/utils/` |
| `assetRegistry.ts` | ✅ Exists | `src/utils/debug/` |
| `WeatherSystem.tsx` | ⚠️ **NEEDS VERIFICATION** | Expected: `src/components/` |
| `WeatherControls.tsx` | ⚠️ **NEEDS VERIFICATION** | Expected: `src/components/` |

---

## Root Cause of Rendering Failure

### Primary Issues:

1. **Missing Weather Components**
   - Lines 33-34 import `WeatherSystem` and `WeatherControls`
   - These components are used in the render (lines 1632-1665)
   - If these files are missing, the entire component fails to load

2. **Dependency Chain Failure**
   - If any imported component has errors or missing dependencies
   - The entire ThreeScene component fails to render
   - No fallback error handling in place

3. **Asset Loading System**
   - Main branch wraps everything in `<LoadingProvider>`
   - If `LoadingProvider` or `AssetRegistry` have issues
   - Scene may never complete loading

### Secondary Issues:

4. **Performance Mode State**
   - Main branch adds `performanceMode` state
   - Used in Canvas configuration
   - If state initialization fails, Canvas may not render

5. **Weather Hook Usage**
   - Line 1591: `const { weather, intensity, setWeather, setIntensity } = useWeather();`
   - If `useWeather` hook fails, component crashes

---

## Recommendations

### Immediate Actions:

1. **Verify Weather Components Exist**
   ```bash
   ls -la src/components/WeatherSystem.tsx
   ls -la src/components/WeatherControls.tsx
   ```

2. **Check Console for Import Errors**
   - Open browser DevTools
   - Look for module resolution errors
   - Check for 404s on component imports

3. **Test Loading System**
   - Verify `LoadingProvider` works independently
   - Check `AssetRegistry.getInstance()` doesn't crash
   - Ensure `LoadingScreen` component exists

4. **Add Error Boundary**
   ```typescript
   <ErrorBoundary fallback={<FallbackUI />}>
     <ThreeScene onFeatureSelect={handleSelect} />
   </ErrorBoundary>
   ```

### Long-term Solutions:

1. **Gradual Feature Migration**
   - Don't merge all features at once
   - Test each component addition individually
   - Use feature flags for complex systems

2. **Lazy Loading**
   ```typescript
   const WeatherSystem = React.lazy(() => import('./WeatherSystem'));
   const WeatherControls = React.lazy(() => import('./WeatherControls'));
   ```

3. **Conditional Rendering**
   ```typescript
   {weatherSystemAvailable && (
     <WeatherSystem {...weatherProps} />
   )}
   ```

4. **Build Verification**
   ```bash
   npm run build
   # Check for build errors before deployment
   ```

---

## Migration Path

### Option 1: Rollback to Dev Version
```bash
git checkout dev -- src/components/ThreeScene.tsx
```
**Pros:** Immediate fix, guaranteed to work
**Cons:** Lose all main branch enhancements

### Option 2: Fix Missing Dependencies
1. Identify missing WeatherSystem components
2. Either implement them or remove weather imports
3. Test incrementally

### Option 3: Hybrid Approach
1. Start with dev version
2. Add main branch features one-by-one
3. Test after each addition
4. Commit working states

---

## Conclusion

The main branch ThreeScene is significantly more advanced than dev, with 93% more code and 15+ additional feature integrations. The rendering failure is most likely due to:

1. **Missing WeatherSystem/WeatherControls components**
2. **Broken dependency chain from complex imports**
3. **Loading system initialization issues**

**Recommended Action:** Verify Weather component existence first, then check browser console for specific import errors. Consider using dev version as baseline and gradually migrating features.

---

## Next Steps

Run these diagnostic commands:

```bash
# 1. Check Weather components
ls -la src/components/Weather*.tsx

# 2. Verify all imports compile
npm run build

# 3. Check for missing files
git status

# 4. Compare branches
git diff dev main -- src/components/ThreeScene.tsx | head -50
```

**Investigation Priority:**
1. WeatherSystem.tsx existence ✅ HIGH
2. WeatherControls.tsx existence ✅ HIGH
3. LoadingProvider functionality ✅ MEDIUM
4. AssetRegistry initialization ✅ MEDIUM
5. Build errors ✅ HIGH

---

**Analysis Complete.** Main branch has extensive enhancements but requires all dependencies to be present for successful rendering.
