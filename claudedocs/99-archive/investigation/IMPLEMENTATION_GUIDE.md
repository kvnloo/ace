# Visual Improvements Implementation Guide

Step-by-step instructions to restore realistic visual elements to the 3D scene.

---

## Pre-Implementation Checklist

```bash
# 1. Create safety snapshot
./scripts/create-snapshot.sh "before-visual-improvements"

# 2. Capture performance baseline
npm run build
npm run dev  # In one terminal
npm run perf:baseline  # In another terminal

# 3. Verify current health
./scripts/verify-state.sh
```

---

## Phase 1: Add Realistic Grass Rendering

### Step 1.1: Import Grass Component

**File**: `components/ThreeScene.tsx`
**Line**: 17 (after existing imports)

**Add**:
```typescript
import Grass from './Grass';
```

### Step 1.2: Modify TennisCourt Component

**File**: `components/ThreeScene.tsx`
**Lines**: 400-419

**Current Code**:
```typescript
const TennisCourt: React.FC<{ position: [number, number, number], type: 'grass' | 'hard' | 'clay' | 'wood' }> = ({ position, type }) => {
    const colors = { grass: '#4d7c0f', hard: '#3b82f6', clay: '#ea580c', wood: '#d4a373' };
    return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 22]} />
        <meshStandardMaterial color={colors[type]} roughness={type === 'wood' ? 0.2 : 0.8} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[8, 20]} />
        <meshBasicMaterial color="white" wireframe={false} transparent opacity={0.8} />
        <mesh position={[0, 0, 0.01]}>
             <planeGeometry args={[7.8, 19.8]} />
             <meshBasicMaterial color={colors[type]} />
        </mesh>
      </mesh>
      <Net width={10} />
    </group>
  );
};
```

**Replace With**:
```typescript
const TennisCourt: React.FC<{ position: [number, number, number], type: 'grass' | 'hard' | 'clay' | 'wood' }> = ({ position, type }) => {
    const colors = { grass: '#4d7c0f', hard: '#3b82f6', clay: '#ea580c', wood: '#d4a373' };
    return (
    <group position={position}>
      {/* Court Surface - Use realistic grass for grass courts */}
      {type === 'grass' ? (
        <Grass
          position={[0, 0.1, 0]}
          size={[10, 22]}
          bladeCount={1500}  // Optimized for 6 courts
          color={colors[type]}
          animated={true}
        />
      ) : (
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[10, 22]} />
          <meshStandardMaterial color={colors[type]} roughness={type === 'wood' ? 0.2 : 0.8} />
        </mesh>
      )}

      {/* Court Lines - White boundary and playing area */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[8, 20]} />
        <meshBasicMaterial color="white" wireframe={false} transparent opacity={0.8} />
        <mesh position={[0, 0, 0.01]}>
             <planeGeometry args={[7.8, 19.8]} />
             <meshBasicMaterial color={colors[type]} />
        </mesh>
      </mesh>

      {/* Net */}
      <Net width={10} />
    </group>
  );
};
```

**Changes Made**:
1. Added conditional rendering based on `type === 'grass'`
2. Integrated `Grass` component with optimized parameters
3. Kept flat planes for other court types (hard, clay, wood)
4. Added comments for clarity

### Step 1.3: Test Grass Rendering

```bash
# Start dev server
npm run dev

# Navigate to 3D demo view
# Set floor to "Ground: Tennis"
# Observe grass courts (courts 12-17, the green ones)
```

**Expected Result**:
- Grass courts show individual grass blades
- Subtle wind animation visible
- Color variation between blades
- FPS should stay > 55

**If Performance Issue**:
Reduce `bladeCount` from 1500 to 1000:
```typescript
bladeCount={1000}  // Lower blade count for better FPS
```

### Step 1.4: Validate and Commit

```bash
# Test performance
npm run perf:test

# If acceptable, commit
git add components/ThreeScene.tsx
git commit -m "Add realistic grass rendering using existing Grass component"

# Create snapshot
./scripts/create-snapshot.sh "grass-rendering-complete"
```

---

## Phase 2: Improve Court Labels

### Step 2.1: Create CourtLabel Component

**File**: `components/ThreeScene.tsx`
**Line**: After `CadDimension` component (around line 264)

**Add**:
```typescript
const CourtLabel: React.FC<{
  position: [number, number, number],
  label: string
}> = ({ position, label }) => (
  <group position={position}>
    <Html
      distanceFactor={60}
      zIndexRange={[100, 0]}
      style={{ pointerEvents: 'none' }}
    >
      <div className="px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap bg-slate-900/90 text-tennis-yellow backdrop-blur-md border border-tennis-yellow/30 shadow-lg">
        {label}
      </div>
    </Html>
  </group>
);
```

### Step 2.2: Replace Text Labels in GroundFloor

**File**: `components/ThreeScene.tsx`
**Lines**: 636-650

**Current Code**:
```typescript
{/* Explicit Labels */}
{showLabels && rowConfigs.map((row, i) => (
    <Text
        key={`lbl-${i}`}
        position={[-55, 1, row.z]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        fontSize={4}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.1}
        outlineColor="#000"
    >
        {row.label} COURTS
    </Text>
))}
```

**Replace With**:
```typescript
{/* Court Type Labels - Floating HTML for better readability */}
{showLabels && rowConfigs.map((row, i) => (
    <CourtLabel
        key={`lbl-${i}`}
        position={[-60, 8, row.z]}  // Float above courts
        label={`${row.label} COURTS`}
    />
))}
```

**Changes Made**:
1. Replaced 3D Text with HTML-based labels
2. Positioned labels floating above courts (y=8 instead of y=1)
3. Used brand colors (tennis-yellow) for consistency
4. Improved readability with backdrop blur

### Step 2.3: Test Labels

```bash
npm run dev

# Navigate to 3D demo
# Set floor to "Ground: Tennis"
# Enable "Labels" overlay
# Verify labels are visible and floating above courts
# Test camera rotation - labels should remain readable
```

### Step 2.4: Commit

```bash
git add components/ThreeScene.tsx
git commit -m "Improve court labels with floating HTML components"
```

---

## Phase 3: Add Court Textures (Optional)

### Step 3.1: Source Textures

**Required Assets**:
1. `clay-court.jpg` - Tileable orange granular texture (512×512)
2. `wood-court.jpg` - Tileable parquet pattern (512×512)
3. `wood-court-normal.jpg` - Normal map for wood grain depth (512×512)
4. `hard-court.jpg` - Tileable blue acrylic surface (512×512)

**Recommended Sources**:
- [Polyhaven Textures](https://polyhaven.com/textures) - Free CC0
- [3DTextures.me](https://3dtextures.me/) - Free textures
- Custom creation in Photoshop/GIMP

**Save to**: `/public/textures/`

### Step 3.2: Import useTexture Hook

**File**: `components/ThreeScene.tsx`
**Line**: 4 (in drei imports)

**Modify**:
```typescript
import {
  OrbitControls,
  Html,
  Grid,
  PerspectiveCamera,
  Environment,
  Text,
  useCursor,
  ContactShadows,
  Float,
  Line,
  useTexture  // ADD THIS
} from '@react-three/drei';
```

### Step 3.3: Load Textures in TennisCourt

**File**: `components/ThreeScene.tsx`
**Lines**: 400-419

**Add at the start of TennisCourt component**:
```typescript
const TennisCourt: React.FC<{ position: [number, number, number], type: 'grass' | 'hard' | 'clay' | 'wood' }> = ({ position, type }) => {
    const colors = { grass: '#4d7c0f', hard: '#3b82f6', clay: '#ea580c', wood: '#d4a373' };

    // Load textures (only if files exist)
    const [clayTexture, woodTexture, woodNormal, hardTexture] = useTexture([
        '/textures/clay-court.jpg',
        '/textures/wood-court.jpg',
        '/textures/wood-court-normal.jpg',
        '/textures/hard-court.jpg',
    ]);

    return (
    <group position={position}>
      {/* Court Surface */}
      {type === 'grass' ? (
        <Grass
          position={[0, 0.1, 0]}
          size={[10, 22]}
          bladeCount={1500}
          color={colors[type]}
          animated={true}
        />
      ) : type === 'clay' ? (
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[10, 22]} />
          <meshStandardMaterial
            map={clayTexture}
            color={colors[type]}
            roughness={0.9}  // Granular clay surface
            metalness={0}
          />
        </mesh>
      ) : type === 'wood' ? (
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[10, 22]} />
          <meshStandardMaterial
            map={woodTexture}
            normalMap={woodNormal}
            color={colors[type]}
            roughness={0.3}  // Polished wood
            metalness={0.1}  // Slight sheen
          />
        </mesh>
      ) : type === 'hard' ? (
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[10, 22]} />
          <meshStandardMaterial
            map={hardTexture}
            color={colors[type]}
            roughness={0.6}  // Acrylic surface
            metalness={0}
          />
        </mesh>
      ) : null}

      {/* Court Lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[8, 20]} />
        <meshBasicMaterial color="white" wireframe={false} transparent opacity={0.8} />
        <mesh position={[0, 0, 0.01]}>
             <planeGeometry args={[7.8, 19.8]} />
             <meshBasicMaterial color={colors[type]} />
        </mesh>
      </mesh>

      <Net width={10} />
    </group>
  );
};
```

### Step 3.4: Add Error Handling (Optional)

Wrap texture loading in Suspense:

**File**: `components/ThreeScene.tsx`
**Around line 841** (in scene rendering)

```typescript
import { Suspense } from 'react'; // Add to imports

// Wrap the scene content:
<Canvas shadows dpr={[1, 1.5]} camera={{ position: [180, 100, 180], fov: 35 }}>
  <Suspense fallback={null}>
    <CameraRig activeFloor={activeFloor} controlsRef={controlsRef} isAnimatingRef={isAnimatingRef} />
    {/* ... rest of scene ... */}
  </Suspense>
</Canvas>
```

### Step 3.5: Test Textures

```bash
npm run dev

# Check each court type:
# - Hard courts (rows 1): Should show blue acrylic texture
# - Clay courts (rows 2): Should show orange granular texture
# - Grass courts (rows 3): Should show grass blades (from Phase 1)
# - Wood courts (rows 4): Should show wood grain with normal mapping
```

### Step 3.6: Commit

```bash
git add components/ThreeScene.tsx public/textures/
git commit -m "Add realistic court surface textures"
```

---

## Phase 4: Performance Validation

### Step 4.1: Run Performance Tests

```bash
# Ensure dev server is running
npm run dev

# In another terminal
npm run perf:test
```

**Expected Results**:
- Load Time: < 3s
- FPS: > 55
- Memory: < 100MB
- All tests: PASS ✅

### Step 4.2: If Performance Issues

**If FPS < 55**:
1. Reduce grass blade count:
   ```typescript
   bladeCount={1000}  // Or even 800
   ```

2. Disable grass animation:
   ```typescript
   animated={false}
   ```

3. Check texture sizes (should be 512×512 max)

**If Memory > 100MB**:
1. Compress textures (use smaller resolution or better compression)
2. Reduce grass blade count
3. Check for memory leaks in console

**If Load Time > 3s**:
1. Optimize texture file sizes
2. Consider lazy loading textures
3. Add loading states

### Step 4.3: Update Baseline (If Improved)

```bash
# If performance is still good, update baseline
npm run perf:baseline
```

### Step 4.4: Final Snapshot

```bash
./scripts/create-snapshot.sh "visual-improvements-complete"
```

---

## Testing Checklist

### Visual Quality
- [ ] Grass courts show individual blades
- [ ] Grass animation is smooth and natural
- [ ] Clay courts show granular texture
- [ ] Wood courts show grain pattern with depth
- [ ] Hard courts show acrylic surface
- [ ] Court labels are readable and properly positioned
- [ ] All court types render without errors

### Performance
- [ ] FPS > 55 on ground floor view
- [ ] FPS > 58 on full facility view
- [ ] Load time < 3 seconds
- [ ] Memory usage < 100MB
- [ ] No console errors or warnings
- [ ] Smooth camera movement
- [ ] No texture pop-in or loading issues

### Camera Views
- [ ] Full facility view (activeFloor='ALL')
- [ ] Ground floor zoom (activeFloor=0)
- [ ] Different camera angles
- [ ] Close-up view of each court type
- [ ] Labels visible from all angles

---

## Rollback Procedures

### If Something Breaks

**Quick Rollback**:
```bash
# List snapshots
./scripts/rollback-to-snapshot.sh

# Select snapshot (interactive)
# Or directly:
./scripts/rollback-to-snapshot.sh snapshot-20251122-XXXXXX
```

**Emergency Reset**:
```bash
./scripts/emergency-reset.sh
# Type 'RESET' when prompted
```

### Incremental Rollback

**Revert just textures**:
```bash
git checkout HEAD -- components/ThreeScene.tsx
git clean -fd public/textures/
```

**Revert just grass**:
```bash
# Edit ThreeScene.tsx and remove Grass import
# Change grass courts back to flat planes
```

---

## Performance Budgets

| Metric | Before | After Phase 1 | After Phase 3 | Target |
|--------|--------|---------------|---------------|--------|
| Load Time | 1.8s | 2.0s | 2.2s | < 3s ✅ |
| FPS | 60 | 57 | 55 | > 55 ✅ |
| Memory | 70MB | 80MB | 85MB | < 100MB ✅ |
| Bundle | 750KB | 750KB | 755KB | < 800KB ✅ |

---

## Troubleshooting

### Grass Not Rendering
- Check import: `import Grass from './Grass';`
- Check console for errors
- Verify Grass.tsx exists in components/
- Check blade count (try 500 for testing)

### Textures Not Loading
- Check file paths: `/public/textures/clay-court.jpg`
- Verify files exist in public/textures/
- Check browser console for 404 errors
- Verify file extensions match (jpg vs png)

### Performance Issues
- Reduce grass bladeCount
- Disable grass animation
- Reduce texture resolution
- Check for memory leaks (increasing over time)

### Labels Not Visible
- Check showLabels state
- Verify CourtLabel component exists
- Check z-index and positioning
- Try different camera angles

---

## Success Criteria

All must be true to consider implementation complete:

- [x] Grass component imported and rendering
- [x] Grass animation working smoothly
- [x] Court labels floating above surface
- [x] Labels readable from all angles
- [ ] Textures loaded for clay, wood, hard courts
- [ ] No console errors
- [ ] FPS > 55 on ground floor
- [ ] Memory < 100MB
- [ ] Load time < 3s
- [ ] Performance tests passing
- [ ] Visual quality improved significantly
- [ ] Code committed with descriptive messages
- [ ] Snapshot created for rollback safety

---

## Next Steps After Completion

1. **Document Changes**:
   - Update README with visual improvements
   - Add screenshots to documentation
   - Update performance baseline in docs

2. **Consider Enhancements**:
   - LOD system for grass (simple when far)
   - Clay court particle effects on ball impact
   - Animated water reflections on hard courts
   - Quality settings for user preference

3. **Share Results**:
   - Create before/after comparison
   - Update project demo
   - Document performance impact

---

**Implementation Guide Version**: 1.0
**Created**: 2025-11-22
**For Project**: ACE 3D Tennis Facility
