# Performance Debug System - User Guide

## Table of Contents
1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Using the Debug Panel](#using-the-debug-panel)
4. [Performance Metrics](#performance-metrics)
5. [Asset Management](#asset-management)
6. [Running Performance Tests](#running-performance-tests)
7. [Presets and Configurations](#presets-and-configurations)
8. [Troubleshooting](#troubleshooting)

## Introduction

The Performance Debug System provides comprehensive tools for analyzing, monitoring, and optimizing the 3D scene's performance. It tracks individual asset impact on FPS, memory usage, and render times to help identify performance bottlenecks.

### Key Features
- **Real-time Performance Monitoring**: Live FPS, memory, and frame time tracking
- **Per-Asset Performance Analysis**: Measure each asset's performance impact
- **Automated Testing Suite**: Run systematic performance comparisons
- **Preset Management**: Save and restore asset configurations
- **Visual Performance Charts**: Historical FPS graphs and metrics
- **Performance Recommendations**: AI-generated optimization suggestions

## Getting Started

### Enabling Debug Mode

Debug mode can be enabled globally via the window object:

```typescript
// In browser console or your code
window.debug.enabled = true;

// Or access the full debug utilities
const stats = await window.debug.stats();
console.log(stats);
```

### Opening the Debug Panel

The debug panel can be accessed through:
1. **UI Toggle**: Click the debug icon in the top-right corner
2. **Keyboard Shortcut**: Press `Ctrl+Shift+D` (Windows/Linux) or `Cmd+Shift+D` (Mac)
3. **Programmatic**: `window.debugPanel.show()`

## Using the Debug Panel

### Panel Overview

```
┌──────────────────────────────────────────────────────┐
│  Performance Metrics                                 │
│  ┌────────┬────────────┬──────────────┐              │
│  │ FPS: 60│ Memory: 45 │ Frame: 16.7ms│              │
│  └────────┴────────────┴──────────────┘              │
│                                                       │
│  FPS History Graph                                   │
│  [Live 60-frame rolling graph]                       │
│                                                       │
│  Asset Controls                                      │
│  ┌──────────────────────────────────────┐           │
│  │ ⚫ Tennis Courts        [HIGH]  ✓    │           │
│  │ ⚫ Grass System         [MED]   ✓    │           │
│  │ ⚫ Lighting             [LOW]   ✓    │           │
│  └──────────────────────────────────────┘           │
│                                                       │
│  Presets: [Baseline ▾]  [Save] [Test]               │
└──────────────────────────────────────────────────────┘
```

### Panel Sections

#### 1. Performance Metrics Dashboard
- **FPS Counter**: Current frames per second (green >60, yellow 30-60, red <30)
- **Memory Usage**: JavaScript heap memory in MB
- **Frame Time**: Time to render each frame in milliseconds
- **Delta Indicators**: Show change vs. baseline (arrows indicate trend)

#### 2. FPS History Graph
- Real-time visualization of last 60 frames
- Color-coded performance zones:
  - 🟢 Green: >60 FPS (optimal)
  - 🟡 Yellow: 30-60 FPS (acceptable)
  - 🔴 Red: <30 FPS (needs optimization)
- Reference lines at 30 FPS and 60 FPS thresholds

#### 3. Asset Toggle Controls
Each asset shows:
- **Toggle Switch**: Enable/disable individual assets
- **Asset Name**: Descriptive name with icon
- **Performance Cost Badge**: Visual indicator (LOW/MED/HIGH)
- **Dependencies**: Assets that must be enabled together
- **Metrics on Hover**: Detailed render time and memory usage

#### 4. Preset Selector
- Quick-load predefined configurations
- Save custom configurations
- Delete user-created presets

## Performance Metrics

### Understanding the Metrics

#### FPS (Frames Per Second)
- **What it means**: How many times per second the scene is rendered
- **Target**: 60 FPS for smooth performance
- **Warning threshold**: Below 30 FPS indicates performance issues
- **Impact on user**: Low FPS causes stuttering and poor experience

#### Memory Usage
- **What it means**: JavaScript heap memory consumed by the application
- **Typical range**: 50-200 MB for most scenes
- **Warning threshold**: >500 MB indicates potential memory leak
- **Impact on user**: High memory can cause browser slowdown or crashes

#### Frame Time
- **What it means**: Time in milliseconds to render one frame
- **Target**: <16.67ms for 60 FPS (1000ms / 60fps)
- **Calculation**: Frame Time = 1000 / FPS
- **Impact on user**: Higher frame time means lower FPS

### Performance Indicators

| Indicator | FPS Range | Status | Action |
|-----------|-----------|--------|--------|
| 🟢 Green  | >60 | Optimal | No action needed |
| 🟡 Yellow | 30-60 | Acceptable | Consider optimization |
| 🔴 Red | <30 | Critical | Immediate optimization required |

### Baseline Comparison

The system tracks a **baseline** (empty scene with minimal assets) and compares all metrics against it:

```
Current FPS: 45 (Δ -15 vs baseline)
               ↑        ↑
            actual    change from baseline
```

- **Positive delta (green)**: Performance improvement
- **Negative delta (red)**: Performance degradation

## Asset Management

### Asset Registry

The Asset Registry tracks all 3D assets in the scene with:
- Unique identifiers
- Performance cost estimates (1-10 scale)
- Dependencies between assets
- Enable/disable state
- Real-time metrics

### Asset Categories

Assets are organized by type:

| Type | Examples | Typical Cost |
|------|----------|--------------|
| **Courts** | Tennis courts, court lines, nets | Medium (3-4) |
| **Grass** | Grass blades, physics, robotic mowers | High (6-7) |
| **Lighting** | Ambient, directional, spot lights, shadows | Medium-High (2-7) |
| **Weather** | Rain, clouds, fog, wind | High (6-8) |
| **Effects** | Particles, post-processing, bloom | Medium-High (4-6) |
| **UI** | Performance HUD, heat maps, markers | Low (1-3) |
| **Building** | Reception, labs, control rooms | Medium-High (5-6) |
| **Characters** | Player models, animations | High (8) |
| **Physics** | Physics simulation engine | High (6) |

### Managing Dependencies

Some assets depend on others and will auto-enable/disable:

```
Example: Robotic Mowers
  ├─ Requires: Grass Blades
  └─ Enables automatically: Grass Blades

Disabling Grass Blades will also disable:
  ├─ Robotic Mowers
  └─ Growth Visualization
```

**Dependency Rules:**
- Enabling an asset automatically enables its dependencies
- Disabling an asset automatically disables dependents
- Circular dependencies are detected and prevented

### Asset Toggle Operations

#### Enabling an Asset
```typescript
// UI: Click toggle switch or asset row
// Code:
assetRegistry.enable('grass-blades');
// Result: Asset + all dependencies enabled
```

#### Disabling an Asset
```typescript
// UI: Click toggle switch or asset row
// Code:
assetRegistry.disable('grass-blades');
// Result: Asset + all dependents disabled
```

#### Checking Asset State
```typescript
// Code:
const isEnabled = assetRegistry.isEnabled('grass-blades');
const allEnabled = assetRegistry.getEnabled();
const allDisabled = assetRegistry.getDisabled();
```

### Performance Cost Scale

Assets are rated 1-10 for performance impact:

| Cost Range | Category | Description | Badge Color |
|------------|----------|-------------|-------------|
| 1-2 | Minimal | Simple meshes, static lighting | 🟢 Green |
| 3-4 | Low | Textured meshes, basic shaders | 🟢 Green |
| 5-6 | Medium | Animated objects, particle systems | 🟡 Yellow |
| 7-8 | High | Complex physics, advanced shaders | 🟠 Orange |
| 9-10 | Very High | Volumetric effects, real-time GI | 🔴 Red |

### Budget Management

The system tracks a **performance budget** (default: 100 points):

```
Current Scene Cost: 65/100 points (65% budget used)

Budget Status:
  🟢 OK:       0-75% budget used
  🟡 Warning:  75-90% budget used
  🔴 Critical: 90%+ budget used
```

Check budget status:
```typescript
const budget = assetRegistry.getBudgetStatus();
console.log(`Budget: ${budget.current}/${budget.max} (${budget.percentage}%)`);
console.log(`Status: ${budget.status}`); // 'ok', 'warning', or 'critical'
console.log(`Remaining: ${budget.remaining} points`);
```

## Running Performance Tests

### Automated Test Suite

The Performance Test Runner systematically tests asset configurations and generates recommendations.

#### Running a Full Test

```typescript
import { PerformanceTestRunner } from '@/utils/debug/performanceComparison';

const runner = new PerformanceTestRunner({
  stabilizationTime: 3000,    // Wait 3s for scene to stabilize
  measurementFrames: 60,      // Measure 60 frames
  measurementPasses: 3        // Run 3 passes for accuracy
});

const report = await runner.runFullTestSuite();
```

#### Test Sequence

1. **Baseline Test**: Measure performance with no assets
2. **Individual Asset Tests**: Test each asset one at a time
3. **Combination Tests**: Test asset pairs to find interactions
4. **Full Scene Test**: Measure all assets enabled

#### Understanding Test Results

```
═══════════════════════════════════════════════════════
          PERFORMANCE COMPARISON REPORT
═══════════════════════════════════════════════════════

📊 BASELINE
───────────────────────────────────────────────────────
  FPS:        60.0
  Memory:     25.5 MB
  Frame Time: 16.67 ms

🔍 INDIVIDUAL ASSET PERFORMANCE
───────────────────────────────────────────────────────
🟢 Tennis Courts
  FPS:    58.5 (Δ -1.5 FPS)
  Memory: 28.2 MB (Δ +2.7 MB)
  Impact: MINIMAL

🟡 Grass System
  FPS:    52.0 (Δ -8.0 FPS)
  Memory: 45.3 MB (Δ +19.8 MB)
  Impact: MODERATE

🔴 Volumetric Clouds
  FPS:    35.2 (Δ -24.8 FPS)
  Memory: 52.1 MB (Δ +26.6 MB)
  Impact: SEVERE

💡 RECOMMENDATIONS
───────────────────────────────────────────────────────
🚨 [CRITICAL] Assets requiring optimization: Volumetric Clouds, Dynamic Shadows
⚠️  [HIGH] Performance budget: 8.5 FPS per asset on average
ℹ️  [LOW] Safe asset combinations: Courts + Lighting, Grass + Wind
```

### Performance Impact Levels

| Impact | FPS Loss | Description | Action |
|--------|----------|-------------|--------|
| **Minimal** | 0-5 FPS | Safe to enable | No optimization needed |
| **Moderate** | 5-10 FPS | Acceptable | Monitor in production |
| **Significant** | 10-20 FPS | Caution | Consider optimization |
| **Severe** | >20 FPS | Critical | Immediate optimization |

### Exporting Test Reports

```typescript
// Export to JSON file
runner.generateReport().then(report => {
  const json = JSON.stringify(report, null, 2);
  // Download happens automatically
});

// Save to localStorage
import { saveReportToStorage } from '@/utils/debug/performanceComparison';
saveReportToStorage(report, 'my-test-results');

// Load from localStorage
import { loadReportFromStorage } from '@/utils/debug/performanceComparison';
const savedReport = loadReportFromStorage('my-test-results');
```

## Presets and Configurations

### Built-in Presets

#### Baseline
- **Purpose**: Minimal scene for baseline measurements
- **Enabled**: Only essential lighting and camera
- **Use case**: Establishing performance baseline

#### One-by-One
- **Purpose**: Sequential asset testing
- **Enabled**: Assets enabled one at a time
- **Use case**: Isolating individual asset performance

#### Production
- **Purpose**: Full production scene
- **Enabled**: All production-ready assets
- **Use case**: Testing complete user experience

#### Performance Test
- **Purpose**: Maximum load testing
- **Enabled**: All assets including experimental
- **Use case**: Stress testing and optimization

### Creating Custom Presets

1. **Configure Assets**: Enable/disable assets as desired
2. **Click "Save Current as Preset"** in preset dropdown
3. **Enter Details**:
   - **Name**: Descriptive name (e.g., "Low-End Devices")
   - **Description**: Purpose and configuration notes
4. **Save**: Preset saved to localStorage

### Managing Presets

```typescript
import { savePreset, loadPreset, deletePreset, listPresets }
  from '@/utils/debug/debugStorage';

// Save current configuration
savePreset('My Config', {
  id: 'my-config',
  name: 'My Config',
  description: 'Custom configuration for...',
  settings: {
    performance: { showFPS: true, targetFPS: 60 },
    rendering: { shadows: true, antialias: true }
  }
});

// Load preset
const preset = loadPreset('My Config');

// List all presets
const allPresets = listPresets();

// Delete preset
deletePreset('My Config');
```

### Importing/Exporting Configurations

```typescript
import { exportToFile, importFromFile }
  from '@/utils/debug/debugStorage';

// Export to JSON file
exportToFile('my-debug-config'); // Downloads: my-debug-config-{timestamp}.json

// Import from file
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = 'application/json';
fileInput.onchange = async (e) => {
  const file = e.target.files[0];
  const state = await importFromFile(file);
  console.log('Imported:', state);
};
fileInput.click();
```

## Troubleshooting

### Common Issues

#### Low FPS Performance

**Symptoms:**
- FPS counter shows <30 FPS
- Scene feels laggy or stuttering
- Frame time >33ms

**Diagnosis Steps:**
1. Check individual asset costs in debug panel
2. Identify assets with "HIGH" or "SEVERE" impact
3. Run automated performance test
4. Review recommendations

**Solutions:**
- Disable high-cost assets (clouds, volumetric effects)
- Reduce shadow quality or disable dynamic shadows
- Lower particle counts
- Disable post-processing effects
- Use "Performance Test" preset to identify culprits

#### High Memory Usage

**Symptoms:**
- Memory counter >500 MB
- Browser tab becomes slow
- Browser shows "Out of memory" warnings

**Diagnosis Steps:**
1. Check memory usage in debug panel
2. Look for memory leaks (memory constantly increasing)
3. Review asset memory allocations
4. Check for unreleased resources

**Solutions:**
- Disable memory-intensive assets (high-res textures)
- Clear debug logs: `window.debug.clearLogs()`
- Optimize storage: `optimizeStorage()`
- Reload page to free memory
- Check for circular references in code

#### Assets Not Enabling/Disabling

**Symptoms:**
- Toggle switch doesn't work
- Asset state doesn't change
- Dependencies not auto-enabling

**Diagnosis Steps:**
1. Check browser console for errors
2. Verify no circular dependencies: `window.debug.validateCircular()`
3. Check if asset is registered: `assetRegistry.get('asset-id')`
4. Verify dependencies exist

**Solutions:**
- Reload the page
- Clear localStorage: `clearDebugData()`
- Check console for specific error messages
- Verify asset definitions are loaded

#### Debug Panel Not Appearing

**Symptoms:**
- Panel doesn't open
- Keyboard shortcut doesn't work
- No debug icon visible

**Diagnosis Steps:**
1. Check if debug mode is enabled
2. Verify no JavaScript errors
3. Check browser console

**Solutions:**
```typescript
// Force enable debug mode
window.debug.enabled = true;

// Manually show panel
if (window.debugPanel) {
  window.debugPanel.show();
}

// Check debug availability
console.log('Debug available:', typeof window.debug !== 'undefined');
```

#### Performance Test Failures

**Symptoms:**
- Test suite crashes or hangs
- Incomplete results
- Inconsistent measurements

**Diagnosis Steps:**
1. Check stabilization time (increase if scene is complex)
2. Verify all assets can be enabled/disabled
3. Check for memory issues during testing
4. Review browser console for errors

**Solutions:**
```typescript
// Use longer stabilization time
const runner = new PerformanceTestRunner({
  stabilizationTime: 5000, // 5 seconds instead of 3
  measurementPasses: 5     // More passes for accuracy
});

// Test individual assets instead of full suite
const metrics = await runner.runIndividualAssetTests();
```

### Browser-Specific Issues

#### Chrome/Edge
- Memory profiling: Use Chrome DevTools > Memory tab
- Performance timeline: Use Performance tab > Record
- Enable precise memory stats: `chrome://flags/#enable-precise-memory-info`

#### Firefox
- Memory usage may show as 0 (limitation of Firefox's performance API)
- Use `about:memory` for detailed memory stats
- Performance monitoring: Use Performance tool (Shift+F5)

#### Safari
- Performance API may have limited precision
- Use Web Inspector > Timelines for detailed analysis
- Some features may not work in private browsing

### Getting Help

If you encounter issues not covered here:

1. **Check Console**: Look for error messages
2. **Export Debug State**: Share configuration with team
3. **Report Issue**: Include browser, OS, and error details
4. **Provide Report**: Export performance test report

```typescript
// Export debug state for support
import { exportToFile } from '@/utils/debug/debugStorage';
exportToFile('debug-issue-report');

// Generate performance report
const report = await runner.generateReport();
console.log(JSON.stringify(report, null, 2));
```

### Performance Optimization Quick Reference

| Issue | Quick Fix | Long-term Solution |
|-------|-----------|-------------------|
| Low FPS | Disable clouds, shadows | Optimize shaders, reduce geometry |
| High Memory | Disable high-res textures | Implement LOD system |
| Stuttering | Reduce particle count | Optimize render loop |
| Slow Load | Disable heavy assets | Implement lazy loading |
| Memory Leak | Reload page | Fix object disposal |

---

## Next Steps

- Read the [Developer Integration Guide](./debug-system-integration.md) for API details
- Review [Troubleshooting Guide](./performance-troubleshooting.md) for specific issues
- Check [Quick Reference](./debug-quick-reference.md) for keyboard shortcuts and presets
