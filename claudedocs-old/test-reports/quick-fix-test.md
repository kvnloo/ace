# Quick Fix Test Plan

## Hypothesis
The main branch's 3D view fails because of the complex initialization chain with providers and wrappers. Removing these should restore functionality.

## Test 1: Simplify Entry Point

### Current (Failing) - src/index.tsx:
```tsx
root.render(
  <React.StrictMode>
    <DebugProvider>
      <LoadingProvider registry={assetRegistry} autoStart={true}>
        <App />
      </LoadingProvider>
    </DebugProvider>
  </React.StrictMode>
);
```

### Proposed Fix - src/index.tsx:
```tsx
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## Test 2: Remove ThreeSceneWrapper

### Current (Failing) - src/App.tsx:
```tsx
{currentView === View.FACILITY_DEMO && (
  <motion.div className="w-full h-full relative bg-gradient-to-b from-slate-900 to-black">
    <ThreeSceneDiagnostic />
    <div className="absolute inset-0 z-0">
      <ThreeSceneWrapper onFeatureSelect={setSelectedFeature} />
    </div>
    <CourtNavigationUI />
  </motion.div>
)}
```

### Proposed Fix - src/App.tsx:
```tsx
{currentView === View.FACILITY_DEMO && (
  <motion.div className="w-full h-full relative bg-gradient-to-b from-slate-900 to-black">
    <div className="absolute inset-0 z-0">
      <ThreeScene onFeatureSelect={setSelectedFeature} />
    </div>
  </motion.div>
)}
```

## Test 3: Inline TennisCourt Component

If Tests 1 & 2 don't work, copy the TennisCourt implementation from dev branch directly into ThreeScene.tsx.

### From Dev Branch:
```tsx
const TennisCourt: React.FC<{ position: [number, number, number], type: 'grass' | 'hard' | 'clay' | 'wood' }> = ({ position, type }) => {
    const colors = { grass: '#4d7c0f', hard: '#3b82f6', clay: '#ea580c', wood: '#d4a373' };
    return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 22]} />
        <meshStandardMaterial color={colors[type]} roughness={type === 'wood' ? 0.2 : 0.8} />
      </mesh>
      // ... rest of implementation
    </group>
  );
};
```

## Verification Commands

```bash
# 1. Make the changes
# 2. Start dev server
npm run dev

# 3. Navigate to 3D view
# Open http://localhost:5173/court

# 4. Check console for errors
# Should see Canvas mounting without errors

# 5. Verify 3D scene renders
# Should see the facility model
```

## Expected Outcomes

### Success Indicators:
- ✅ No console errors about Canvas or Three.js
- ✅ 3D scene renders with courts visible
- ✅ Camera controls work (orbit, zoom)
- ✅ Floor selector UI appears

### If Still Failing:
- Check for remaining import errors
- Verify all Three.js dependencies installed
- Consider copying entire ThreeScene.tsx from dev branch

## Risk Assessment

**Low Risk Changes:**
- Removing providers temporarily for testing
- Direct mounting of components

**These changes can be easily reverted if needed.**

## Next Steps After Success

1. Determine which providers are actually needed
2. Add them back one by one with proper loading states
3. Optimize the initialization sequence
4. Document the working configuration