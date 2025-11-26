# Debug System Demo Scenarios

Comprehensive demo scenarios for the 3D Performance Debug System, showcasing real-world troubleshooting workflows and performance optimization techniques.

## Table of Contents
1. [Quick Start](#quick-start)
2. [Scenario 1: Identify Grass Performance Issue](#scenario-1-identify-grass-performance-issue)
3. [Scenario 2: Test Light Combinations](#scenario-2-test-light-combinations)
4. [Scenario 3: Asset Dependency Validation](#scenario-3-asset-dependency-validation)
5. [Scenario 4: Memory Leak Detection](#scenario-4-memory-leak-detection)
6. [Scenario 5: Baseline Performance Testing](#scenario-5-baseline-performance-testing)
7. [Scenario 6: Progressive Performance Profiling](#scenario-6-progressive-performance-profiling)
8. [Advanced Workflows](#advanced-workflows)

---

## Quick Start

### Accessing the Debug Panel

**Method 1: Keyboard Shortcut**
```
Press: Ctrl+Shift+D (or Cmd+Shift+D on Mac)
```

**Method 2: Click Debug Button**
```
Click the Bug icon (🐛) in bottom-right corner
```

**Method 3: Console Access**
```javascript
// Access debug utilities in browser console
window.debug.stats()     // View current stats
window.debug.enabled()   // List enabled assets
window.debug.disabled()  // List disabled assets
```

---

## Scenario 1: Identify Grass Performance Issue

**Goal:** Determine if grass rendering is causing FPS drops

**Expected Outcome:** Identify grass-blades as major performance bottleneck (~42% FPS reduction)

### Step-by-Step Workflow

#### 1. Enable Debug Mode
```
Press Ctrl+Shift+D to open debug panel
```

#### 2. Load Baseline Preset
```
1. Click "Preset" dropdown
2. Select "Baseline" preset
3. Wait for preset to apply
```
**Expected State:**
- All assets disabled
- FPS should stabilize at ~60 FPS
- Memory usage minimal

#### 3. Record Baseline Metrics
```
Wait 3-5 seconds for FPS to stabilize
Note baseline FPS: _________ (should be ~60)
```

#### 4. Enable Grass Blades Only
```
1. Scroll to "Effects" section
2. Find "Grass Blades" toggle
3. Click to enable (should turn green)
4. Wait 3 seconds for stabilization
```

#### 5. Compare Performance
```
Baseline FPS: ~60 FPS
With Grass:   ~35 FPS
Impact:       ~42% reduction
```

### Analysis Results

**Performance Impact:**
- **Critical**: Grass reduces FPS by 42%
- **Memory**: +15MB heap allocation
- **Render Time**: +12ms per frame

**Recommendations:**
1. ✅ Reduce grass blade count
2. ✅ Implement LOD (Level of Detail) system
3. ✅ Use instanced rendering
4. ✅ Consider grass texture instead of geometry

### Export Evidence
```
1. Click "Export Report" button
2. Report saved as: performance-report-{timestamp}.json
3. Share with team for analysis
```

---

## Scenario 2: Test Light Combinations

**Goal:** Determine performance cost of each lighting component

**Expected Outcome:** Identify shadows as most expensive lighting feature

### Progressive Testing Workflow

#### Phase 1: Baseline (No Lights)
```
1. Load "Baseline" preset
2. Disable all lights
3. Record FPS: _________ (expected: ~60)
```

#### Phase 2: Ambient Light
```
1. Enable "Ambient Light"
2. Wait 3 seconds
3. Record FPS: _________ (expected: ~60)
Impact: 0 FPS (negligible)
```

#### Phase 3: Directional Light
```
1. Enable "Directional Light" (keep Ambient on)
2. Wait 3 seconds
3. Record FPS: _________ (expected: ~58)
Impact: -2 FPS (minimal)
```

#### Phase 4: Spot Lights
```
1. Enable "Spot Lights" (keep previous lights on)
2. Wait 3 seconds
3. Record FPS: _________ (expected: ~55)
Impact: -3 FPS (moderate)
```

#### Phase 5: Dynamic Shadows
```
1. Enable "Dynamic Shadows" (keep all lights on)
2. Wait 3 seconds
3. Record FPS: _________ (expected: ~42)
Impact: -13 FPS ⚠️ CRITICAL
```

### Performance Summary

| Component          | FPS Impact | Cumulative FPS | Cost Rating |
|-------------------|-----------|----------------|-------------|
| Baseline          | 0         | 60             | N/A         |
| Ambient Light     | 0         | 60             | ✅ Free     |
| Directional Light | -2        | 58             | ✅ Low      |
| Spot Lights       | -3        | 55             | ⚠️ Moderate |
| Dynamic Shadows   | -13       | 42             | 🔴 High     |

### Optimization Recommendations

**Immediate Actions:**
1. ✅ Reduce shadow map resolution (2048 → 1024)
2. ✅ Limit shadow casting to main objects only
3. ✅ Use baked shadows for static geometry
4. ✅ Implement shadow distance culling

**Advanced Optimization:**
1. Switch to cascaded shadow maps (CSM)
2. Use contact shadows for small details
3. Implement shadow LOD system
4. Consider screen-space shadows (SSAO)

---

## Scenario 3: Asset Dependency Validation

**Goal:** Verify dependency chain enforcement

**Expected Outcome:** System auto-enables/disables dependent assets

### Test Case: Robotic Mowers

#### Expected Behavior
```
Robotic Mowers depends on → Grass Blades
```

#### Test Steps

**1. Verify Dependency Chain**
```javascript
// In browser console
window.debug.assets().then(registry => {
  const mowers = registry.get('robotic-mowers');
  console.log('Dependencies:', mowers.dependencies);
  // Expected: ['grass-blades']
});
```

**2. Test Auto-Enable**
```
1. Disable "Grass Blades"
2. Disable "Robotic Mowers"
3. Enable "Robotic Mowers"

Expected Result:
✅ "Grass Blades" should auto-enable
✅ Console log: "Auto-enabling dependency: grass-blades"
```

**3. Test Auto-Disable**
```
1. Enable both "Grass Blades" and "Robotic Mowers"
2. Disable "Grass Blades"

Expected Result:
✅ "Robotic Mowers" should auto-disable
✅ Console log: "Auto-disabling dependent: robotic-mowers"
```

### Validation Checklist

- [ ] Dependencies auto-enable correctly
- [ ] Dependents auto-disable correctly
- [ ] Console warnings show missing dependencies
- [ ] Circular dependencies detected and prevented
- [ ] Dependency tree displayed correctly

---

## Scenario 4: Memory Leak Detection

**Goal:** Detect memory leaks from asset enable/disable cycles

**Expected Outcome:** Memory should stabilize after multiple toggle cycles

### Monitoring Workflow

#### 1. Record Baseline Memory
```
1. Open debug panel
2. Note initial memory: _________ MB
3. Wait 30 seconds
4. Verify memory is stable
```

#### 2. Stress Test Asset Toggling
```javascript
// Rapid toggle test (browser console)
async function stressTest() {
  const registry = await window.debug.assets();

  for (let i = 0; i < 100; i++) {
    registry.enableAll();
    await new Promise(r => setTimeout(r, 100));
    registry.disableAll();
    await new Promise(r => setTimeout(r, 100));

    if (i % 10 === 0) {
      console.log(`Cycle ${i}: ${performance.memory.usedJSHeapSize / 1048576} MB`);
    }
  }
}

stressTest();
```

#### 3. Monitor Memory Growth
```
Initial Memory: _________ MB
After 100 cycles: _________ MB
Growth: _________ MB

✅ PASS: Growth < 50 MB (normal GC overhead)
❌ FAIL: Growth > 100 MB (potential memory leak)
```

#### 4. Force Garbage Collection
```javascript
// Chrome DevTools only
if (window.gc) {
  window.gc();
  console.log('After GC:', performance.memory.usedJSHeapSize / 1048576, 'MB');
}
```

### Expected Results

**Healthy Behavior:**
- Memory fluctuates during cycles
- Returns to baseline ±20 MB after GC
- No linear growth trend

**Memory Leak Indicators:**
- Continuous upward trend
- Doesn't recover after GC
- Event listeners not cleaned up

---

## Scenario 5: Baseline Performance Testing

**Goal:** Establish performance baseline for regression testing

**Expected Outcome:** Documented baseline metrics for CI/CD integration

### Full Performance Test Suite

#### 1. Minimal Scene (Baseline)
```
Preset: "Minimal"
Assets Enabled: Ambient Light only

Expected Metrics:
├─ FPS: 60 ±2
├─ Memory: 80-100 MB
├─ Render Time: 12-14 ms
└─ Draw Calls: 5-10
```

#### 2. Development Scene
```
Preset: "Development"
Assets Enabled: Basic lighting + primary models

Expected Metrics:
├─ FPS: 55-58
├─ Memory: 150-180 MB
├─ Render Time: 16-18 ms
└─ Draw Calls: 50-80
```

#### 3. Production Scene
```
Preset: "Production"
Assets Enabled: All assets (full quality)

Expected Metrics:
├─ FPS: 45-50
├─ Memory: 250-300 MB
├─ Render Time: 20-22 ms
└─ Draw Calls: 150-200
```

#### 4. Stress Test
```
Preset: "Stress Test"
Assets Enabled: All + debug overlays

Expected Metrics:
├─ FPS: 30-35 (intentionally heavy)
├─ Memory: 400-500 MB
├─ Render Time: 28-33 ms
└─ Draw Calls: 300-400
```

### Generate Baseline Report

```bash
# Export all preset test results
1. Load each preset
2. Wait 10 seconds for stabilization
3. Export report for each
4. Save to: docs/debugging/baselines/
```

**Report Format:**
```json
{
  "preset": "production",
  "timestamp": "2024-11-22T19:00:00Z",
  "metrics": {
    "avgFps": 48,
    "minFps": 42,
    "maxFps": 52,
    "avgMemory": 275,
    "peakMemory": 310
  },
  "assets": {
    "grass-blades": { "fpsImpact": -15, "memoryMB": 45 },
    "dynamic-shadows": { "fpsImpact": -13, "memoryMB": 30 }
  }
}
```

---

## Scenario 6: Progressive Performance Profiling

**Goal:** Identify cumulative performance impact of asset combinations

**Expected Outcome:** Performance budget allocation recommendations

### Systematic Asset Addition

#### Asset Addition Order (by Performance Cost)

**1. Free Assets (0-1 FPS impact)**
```
Enable in sequence:
├─ Ambient Light
├─ Skybox
├─ Static Models (buildings)
└─ Ground Plane

Expected FPS: 58-60
```

**2. Low-Cost Assets (2-5 FPS impact)**
```
Add:
├─ Directional Light
├─ Basic Textures
└─ Court Lines

Expected FPS: 52-56
```

**3. Medium-Cost Assets (5-10 FPS impact)**
```
Add:
├─ Spot Lights
├─ Character Models
└─ Particle Effects

Expected FPS: 42-48
```

**4. High-Cost Assets (10+ FPS impact)**
```
Add:
├─ Grass Blades (-15 FPS)
├─ Dynamic Shadows (-13 FPS)
├─ Weather Effects (-8 FPS)
└─ Robotic Mowers (-5 FPS)

Expected FPS: 30-38 ⚠️
```

### Performance Budget Matrix

| Asset Category | Budget Allocation | FPS Impact | Priority |
|----------------|-------------------|------------|----------|
| Lighting       | 20%               | -8 FPS     | High     |
| Models         | 15%               | -6 FPS     | High     |
| Effects        | 40%               | -18 FPS    | Medium   |
| Shadows        | 25%               | -13 FPS    | Low      |

### Budget Recommendations

**60 FPS Target (Desktop):**
```
Maximum Budget: -15 FPS
├─ Lighting: -3 FPS
├─ Models: -2 FPS
├─ Effects: -7 FPS
└─ Shadows: -3 FPS
```

**30 FPS Target (Mobile):**
```
Maximum Budget: -30 FPS
├─ Lighting: -8 FPS
├─ Models: -6 FPS
├─ Effects: -10 FPS
└─ Shadows: -6 FPS
```

---

## Advanced Workflows

### Multi-Asset Comparison

#### Compare Light Types
```javascript
// Browser console
async function compareLights() {
  const registry = await window.debug.assets();

  const tests = [
    { name: 'Ambient Only', assets: ['ambient-light'] },
    { name: 'Directional Only', assets: ['directional-light'] },
    { name: 'Spot Only', assets: ['spot-lights'] },
    { name: 'All Lights', assets: ['ambient-light', 'directional-light', 'spot-lights'] }
  ];

  for (const test of tests) {
    registry.disableAll();
    test.assets.forEach(id => registry.enable(id));
    await new Promise(r => setTimeout(r, 3000));
    console.log(`${test.name}: ${getFPS()} FPS`);
  }
}
```

### Automated Regression Testing

```javascript
// Integration test example
describe('Performance Regression Tests', () => {
  it('should maintain 60 FPS with minimal preset', async () => {
    await loadPreset('minimal');
    await wait(3000);

    const avgFps = getAverageFPS(60); // 60 samples
    expect(avgFps).toBeGreaterThan(58);
  });

  it('should not exceed 300 MB memory in production', async () => {
    await loadPreset('production');
    await wait(5000);

    const memory = performance.memory.usedJSHeapSize / 1048576;
    expect(memory).toBeLessThan(300);
  });
});
```

### Performance Bottleneck Isolation

```javascript
// Find worst performing asset
async function findBottleneck() {
  const registry = await window.debug.assets();
  const results = [];

  // Test each asset individually
  for (const asset of registry.getAll()) {
    registry.disableAll();
    registry.enable(asset.id);
    await wait(3000);

    const fps = getAverageFPS(30);
    results.push({ id: asset.id, fps, impact: 60 - fps });
  }

  // Sort by impact
  results.sort((a, b) => b.impact - a.impact);
  console.table(results.slice(0, 10));
}
```

---

## Keyboard Shortcuts Reference

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+D` | Toggle debug panel |
| `Ctrl+Shift+A` | Enable all assets |
| `Ctrl+Shift+N` | Disable all assets (None) |
| `Ctrl+Shift+R` | Reset to defaults |
| `Ctrl+Shift+E` | Export performance report |

---

## Troubleshooting

### Debug Panel Not Appearing

**Solution:**
1. Check console for errors
2. Verify DebugProvider wraps app
3. Try clicking debug button instead
4. Check browser compatibility

### FPS Counter Shows 0

**Solution:**
1. Wait 1-2 seconds for initialization
2. Check if scene is rendering
3. Verify requestAnimationFrame is running
4. Check for JavaScript errors

### Asset Toggles Not Working

**Solution:**
1. Check console for dependency warnings
2. Verify asset is registered in registry
3. Check for circular dependencies
4. Ensure component uses assetRegistry.isEnabled()

### Memory Keeps Growing

**Solution:**
1. Check for event listener leaks
2. Verify Three.js object disposal
3. Run GC manually to confirm leak
4. Use Chrome DevTools memory profiler

---

## Next Steps

After mastering these scenarios:

1. ✅ Create custom presets for your use cases
2. ✅ Integrate with CI/CD for regression testing
3. ✅ Set up performance monitoring alerts
4. ✅ Document team-specific workflows
5. ✅ Create automated test suite

**Further Reading:**
- [Performance Optimization Guide](./performance-optimization.md)
- [Asset Registry API Reference](./api-reference.md)
- [Custom Preset Creation](./custom-presets.md)
- [CI/CD Integration Guide](./cicd-integration.md)
