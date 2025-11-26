# Debug System Validation Checklist

Comprehensive QA checklist for validating all debug system integrations and functionality.

## Quick Summary

- **Total Checks:** 120+
- **Categories:** 8
- **Estimated Time:** 2-3 hours
- **Required Tools:** Browser DevTools, Debug Panel

---

## 1. Installation & Setup ✓

### Environment Setup
- [ ] Node.js 18+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] Development server runs (`npm run dev`)
- [ ] No console errors on startup
- [ ] TypeScript compiles without errors (`npm run typecheck`)

### Debug System Files
- [ ] `/src/utils/debug/index.ts` exists
- [ ] `/src/utils/debug/assetRegistry.ts` exists
- [ ] `/src/utils/debug/performanceTracker.ts` exists
- [ ] `/src/utils/debug/assetDefinitions.ts` exists
- [ ] `/src/utils/debug/debugStorage.ts` exists
- [ ] `/src/components/debug/DebugPanel.tsx` exists
- [ ] `/src/components/debug/AssetToggle.tsx` exists
- [ ] `/src/components/debug/PerformanceChart.tsx` exists
- [ ] `/src/components/debug/PresetSelector.tsx` exists
- [ ] `/src/components/DebugContext.tsx` exists

### Import Validation
```typescript
// No TypeScript errors
import { assetRegistry } from '@/utils/debug/assetRegistry';
import { DebugProvider } from '@/components/DebugContext';
import DebugPanel from '@/components/debug/DebugPanel';
```

---

## 2. Asset Registry Integration ✓

### Core Asset Registration

**All 3D assets must be registered in assetDefinitions.ts:**

#### Lighting Assets
- [ ] `ambient-light` - Ambient scene lighting
- [ ] `directional-light` - Main directional light
- [ ] `spot-lights` - Focused spot lights
- [ ] `dynamic-shadows` - Real-time shadow mapping

#### Model Assets
- [ ] `court-models` - Tennis court geometry
- [ ] `building-models` - Facility buildings
- [ ] `character-models` - Player characters
- [ ] `furniture-models` - Interior furniture

#### Effects Assets
- [ ] `grass-blades` - Grass blade rendering
- [ ] `robotic-mowers` - Autonomous mowers
- [ ] `particle-effects` - Particle systems
- [ ] `weather-effects` - Rain/wind effects
- [ ] `post-processing` - Visual effects

#### Texture Assets
- [ ] `grass-texture` - Grass material textures
- [ ] `clay-texture` - Clay court textures
- [ ] `wood-texture` - Wood materials
- [ ] `concrete-texture` - Concrete materials

### Asset Properties Validation

For each asset, verify:
```typescript
{
  id: string,              // ✓ Unique identifier
  name: string,            // ✓ Human-readable name
  type: AssetType,         // ✓ Valid category
  performanceCost: number, // ✓ 1-10 scale
  defaultEnabled: boolean, // ✓ Initial state
  dependencies: string[]   // ✓ Valid asset IDs
}
```

### Console Validation
```javascript
// Browser console
window.debug.stats()

// Expected output:
{
  total: 20+,
  enabled: X,
  disabled: Y,
  byType: {...},
  totalCost: <100
}
```

---

## 3. Component Integration ✓

### DebugContext Integration

**All 3D components must use DebugContext:**

#### Check Each Component
- [ ] `BasicThreeScene.tsx` - Uses `useDebugOptional()`
- [ ] `LazyThreeScene.tsx` - Uses `useDebugOptional()`
- [ ] `Grass.tsx` - Checks `isAssetEnabled('grass-blades')`
- [ ] `ClayCourtEffect.tsx` - Uses debug context
- [ ] `WeatherSystem.tsx` - Checks weather asset state
- [ ] `LightingSystem.tsx` - Checks light asset states
- [ ] `CharacterSystem.tsx` - Checks character asset state

### Integration Pattern Validation

**Each component should follow this pattern:**

```typescript
import { useDebugOptional } from '@/components/DebugContext';

function MyComponent() {
  const debug = useDebugOptional();

  // Check if asset is enabled
  const isEnabled = debug?.isAssetEnabled('my-asset') ?? true;

  // Don't render if disabled
  if (!isEnabled) return null;

  return <mesh>...</mesh>;
}
```

### Registration Pattern
```typescript
useEffect(() => {
  debug?.registerAsset({
    id: 'my-asset',
    name: 'My Asset',
    type: 'model',
    performanceCost: 5,
    dependencies: []
  });
}, [debug]);
```

---

## 4. Debug Panel Functionality ✓

### UI Elements
- [ ] Debug panel renders without errors
- [ ] Panel is draggable
- [ ] Panel is resizable
- [ ] Minimize button works
- [ ] Close button works
- [ ] Maximize button works (when minimized)

### Performance Metrics
- [ ] FPS counter updates every second
- [ ] FPS value is accurate (compare to browser DevTools)
- [ ] Memory counter updates every second
- [ ] Memory value is reasonable (50-500 MB range)
- [ ] FPS history graph renders
- [ ] Graph updates in real-time
- [ ] Graph colors change based on FPS (green/yellow/red)

### Asset Controls
- [ ] All registered assets appear in list
- [ ] Assets grouped by type correctly
- [ ] Asset toggle switches work
- [ ] Enabling asset triggers re-render
- [ ] Disabling asset triggers re-render
- [ ] Performance cost displayed correctly
- [ ] Dependencies shown for dependent assets
- [ ] "Enable All" button works
- [ ] "Disable All" button works

### Preset Selector
- [ ] Preset dropdown renders
- [ ] Default presets available:
  - [ ] Baseline
  - [ ] Minimal
  - [ ] Development
  - [ ] Production
  - [ ] Stress Test
- [ ] Selecting preset applies asset states
- [ ] "Save Current" button works
- [ ] Custom preset saves successfully
- [ ] Custom preset loads successfully
- [ ] Delete custom preset works
- [ ] Preset descriptions display

---

## 5. Keyboard Shortcuts ✓

### Shortcut Testing

| Shortcut | Expected Action | Pass/Fail |
|----------|----------------|-----------|
| `Ctrl+Shift+D` | Toggle panel visibility | [ ] |
| `Ctrl+Shift+A` | Enable all assets | [ ] |
| `Ctrl+Shift+N` | Disable all assets | [ ] |
| `Ctrl+Shift+R` | Reset to defaults | [ ] |
| `Ctrl+Shift+E` | Export report | [ ] |

### Validation Steps
```
1. Panel closed → Press Ctrl+Shift+D → Panel opens
2. Panel open → Press Ctrl+Shift+D → Panel closes
3. Press Ctrl+Shift+A → All toggles turn green
4. Press Ctrl+Shift+N → All toggles turn gray
5. Press Ctrl+Shift+R → Assets reset to defaults
6. Press Ctrl+Shift+E → JSON file downloads
```

---

## 6. Performance Tracking ✓

### FPS Monitoring
- [ ] FPS starts at 0, then updates to valid value
- [ ] FPS range is realistic (0-144 FPS)
- [ ] FPS updates consistently every second
- [ ] FPS reflects actual scene performance
- [ ] Low FPS (<30) shows red
- [ ] Medium FPS (30-60) shows yellow
- [ ] High FPS (>60) shows green

### Memory Monitoring
- [ ] Memory value in MB (not bytes)
- [ ] Memory updates consistently
- [ ] Memory range is realistic (50-1000 MB)
- [ ] Memory reflects actual heap usage
- [ ] Memory leak test: Toggling assets 100x doesn't grow >100 MB

### Performance Report Export
- [ ] Export button generates JSON file
- [ ] Filename includes timestamp
- [ ] JSON structure is valid
- [ ] Report includes all metrics:
  - [ ] timestamp
  - [ ] duration
  - [ ] metrics (avgFps, minFps, maxFps, avgMemory, peakMemory)
  - [ ] assets (per-asset metrics)
  - [ ] presetUsed

### Example Report Validation
```json
{
  "timestamp": "2024-11-22T19:00:00.000Z",
  "duration": 120,
  "metrics": {
    "avgFps": 48,
    "minFps": 42,
    "maxFps": 52,
    "avgMemory": 275,
    "peakMemory": 310
  },
  "assets": {
    "grass-blades": {
      "fpsImpact": -15,
      "memoryMB": 45
    }
  },
  "presetUsed": "production"
}
```

---

## 7. LocalStorage Persistence ✓

### Storage Keys
- [ ] `debug-presets` key exists in localStorage
- [ ] `debug-panel-position` key exists
- [ ] `debug-panel-size` key exists
- [ ] `debug-asset-states` key exists (optional)

### Preset Persistence
```
1. Create custom preset "Test Preset"
2. Refresh page
3. Open debug panel
4. Verify "Test Preset" still exists
5. Delete "Test Preset"
6. Refresh page
7. Verify "Test Preset" is gone
```

### Panel Position Persistence
```
1. Drag panel to new position (e.g., top-left)
2. Note X,Y coordinates
3. Refresh page
4. Open panel
5. Verify panel opens at same position
```

### Panel Size Persistence
```
1. Resize panel to 600x700
2. Refresh page
3. Open panel
4. Verify panel size is 600x700
```

### Storage Cleanup
- [ ] No memory leaks in localStorage
- [ ] Old presets can be manually deleted
- [ ] Storage size <5 MB
- [ ] Invalid JSON gracefully handled

---

## 8. Dependency Management ✓

### Dependency Chain Validation

**Test Case 1: Auto-Enable Dependencies**
```
Asset: robotic-mowers
Dependency: grass-blades

Steps:
1. Disable grass-blades
2. Disable robotic-mowers
3. Enable robotic-mowers

Expected:
✓ grass-blades auto-enables
✓ Console log: "Auto-enabling dependency: grass-blades"
```

**Test Case 2: Auto-Disable Dependents**
```
Steps:
1. Enable grass-blades
2. Enable robotic-mowers
3. Disable grass-blades

Expected:
✓ robotic-mowers auto-disables
✓ Console log: "Auto-disabling dependent: robotic-mowers"
```

**Test Case 3: Circular Dependency Detection**
```javascript
// Should detect and prevent
assetA.dependencies = ['assetB'];
assetB.dependencies = ['assetA'];

Expected:
✓ Console error: "Circular dependency detected"
✓ Asset not enabled
```

### Dependency Validation
- [ ] All dependencies exist in registry
- [ ] No circular dependencies
- [ ] Multi-level dependencies work (A→B→C)
- [ ] Console warnings for missing dependencies
- [ ] Dependency tree displayed correctly

---

## 9. Browser Compatibility ✓

### Desktop Browsers
- [ ] Chrome 100+ (full support)
- [ ] Firefox 100+ (full support)
- [ ] Safari 15+ (full support)
- [ ] Edge 100+ (full support)

### Mobile Browsers
- [ ] Chrome Mobile (touch support)
- [ ] Safari iOS (touch support)
- [ ] Samsung Internet

### Browser Features
- [ ] `performance.memory` API (Chrome only, graceful fallback)
- [ ] `requestAnimationFrame` available
- [ ] localStorage available
- [ ] ES6+ syntax supported
- [ ] CSS Grid/Flexbox supported

---

## 10. Error Handling ✓

### Graceful Degradation
- [ ] Panel works without DebugProvider
- [ ] Missing assets don't crash
- [ ] Invalid preset data handled
- [ ] localStorage quota exceeded handled
- [ ] Network errors handled (if applicable)

### Console Error Checks
```
1. Open DevTools console
2. Perform all test actions
3. Verify NO errors logged
4. Verify warnings are appropriate
```

### Expected Warnings (OK)
- "Asset already registered" (if duplicate registration)
- "Missing dependency" (if dependency not found)
- "Asset not found" (if toggling non-existent asset)

### Unexpected Errors (FAIL)
- TypeScript compilation errors
- React rendering errors
- localStorage access errors
- JSON parse errors

---

## 11. Performance Overhead ✓

### Debug System Impact

**FPS Overhead:**
```
Test: Enable debug panel with all tracking

1. Baseline (debug disabled): _____ FPS
2. With debug panel: _____ FPS
3. Overhead: _____ FPS

✓ PASS: Overhead < 2 FPS
✗ FAIL: Overhead >= 2 FPS
```

**Memory Overhead:**
```
Test: Debug panel memory usage

1. Baseline: _____ MB
2. With debug: _____ MB
3. Overhead: _____ MB

✓ PASS: Overhead < 50 MB
✗ FAIL: Overhead >= 50 MB
```

**Bundle Size Impact:**
```
1. Build production bundle
2. Check bundle size with debug code
3. Compare to bundle without debug

✓ PASS: Increase < 100 KB (gzipped)
```

---

## 12. Accessibility ✓

### Keyboard Navigation
- [ ] Tab through all controls
- [ ] Enter activates buttons
- [ ] Space toggles switches
- [ ] Escape closes panel
- [ ] Focus visible on all elements

### Screen Reader
- [ ] Asset names announced
- [ ] Button actions announced
- [ ] Toggle states announced
- [ ] Metrics values announced
- [ ] ARIA labels present

### Color Contrast
- [ ] Text readable on backgrounds
- [ ] Meets WCAG AA standards
- [ ] High contrast mode supported
- [ ] Color-blind friendly (red/green alternatives)

---

## 13. Regression Testing ✓

### Baseline Performance
- [ ] 60 FPS with minimal preset
- [ ] <100 MB memory with minimal preset
- [ ] <300 MB memory with production preset
- [ ] No FPS drops during asset toggling
- [ ] No memory leaks after 100 toggle cycles

### Visual Regression
- [ ] Panel UI matches design specs
- [ ] Graphs render correctly
- [ ] Toggle switches styled correctly
- [ ] Tooltips display properly
- [ ] Responsive layout works

### Functional Regression
- [ ] All shortcuts work after code changes
- [ ] Presets save/load after refactors
- [ ] Asset dependencies work after updates
- [ ] Performance tracking accurate after changes

---

## Final Validation Summary

### Critical Path (Must Pass)
- [ ] Debug panel opens and closes
- [ ] Asset toggles affect 3D rendering
- [ ] FPS counter is accurate
- [ ] Presets save and load
- [ ] Keyboard shortcuts work
- [ ] Export report works
- [ ] No console errors

### High Priority (Should Pass)
- [ ] All assets registered
- [ ] Dependencies work correctly
- [ ] Memory tracking accurate
- [ ] localStorage persistence works
- [ ] Panel draggable/resizable
- [ ] Performance overhead <2 FPS

### Medium Priority (Nice to Have)
- [ ] Custom presets persist
- [ ] Panel position/size persists
- [ ] Circular dependency detection
- [ ] Mobile browser support
- [ ] Screen reader support

### Sign-Off

**QA Engineer:** ___________________
**Date:** ___________________
**Status:** [ ] Approved [ ] Needs Work
**Notes:**

---

## Quick Smoke Test (5 minutes)

For rapid validation:

```
1. Open debug panel (Ctrl+Shift+D) ✓
2. Toggle 3 different assets ✓
3. Check FPS counter updates ✓
4. Save custom preset ✓
5. Refresh page ✓
6. Load custom preset ✓
7. Export report ✓
8. No console errors ✓
```

If all 8 steps pass, system is functional.
