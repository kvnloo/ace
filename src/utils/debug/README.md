# Debug Storage Utility

localStorage persistence for debug settings with compression, versioning, and robust error handling.

## Features

✅ **Data Compression** - Automatically compresses debug state to reduce localStorage usage
✅ **Schema Versioning** - Handles migration from older versions
✅ **Error Handling** - Graceful degradation when localStorage is unavailable
✅ **Preset Management** - Save and load custom debug configurations
✅ **Import/Export** - Download and upload debug state as JSON files
✅ **Storage Optimization** - Automatic cleanup of old data

## Browser Console Quick Access

```javascript
// Access storage utilities via window.debug
await debug.storage.load();      // Load saved state
await debug.storage.save(state); // Save current state
await debug.storage.stats();     // Get storage statistics
await debug.storage.presets();   // List all presets
await debug.storage.export();    // Export to file
await debug.storage.clear();     // Clear all data
await debug.storage.optimize();  // Optimize storage
```

## API Reference

See complete documentation in the TypeScript source file.

---

# Performance Tracker

## Overview

The Performance Tracker provides comprehensive per-asset performance monitoring with baseline comparison, impact scoring, and automated recommendations.

## Quick Start

```typescript
import { getPerformanceTracker } from '@/utils/debug';

// Get singleton instance
const tracker = getPerformanceTracker();

// Set baseline (no assets enabled)
tracker.setBaseline();

// Track asset performance
tracker.startRenderTimer('asset-1');
// ... render asset ...
const renderTime = tracker.endRenderTimer('asset-1');

// Update asset metrics
tracker.updateAssetMetrics('asset-1', 'Court Lines', true);

// Generate report
const report = tracker.generateReport();
console.log(report);
```

## Core Features

### 1. FPS Tracking

```typescript
// Get current FPS
const currentFPS = tracker.trackFPS();

// Get average FPS over last 5 seconds
const avgFPS = tracker.getAverageFPS(5);
```

### 2. Memory Tracking

```typescript
// Get current memory usage (MB)
const memoryMB = tracker.getMemoryUsage();

// Track memory delta for asset
const memoryDelta = tracker.trackMemoryDelta('asset-1');
console.log(`Asset increased memory by ${memoryDelta}MB`);
```

### 3. Render Time Tracking

```typescript
// Time an asset's render
tracker.startRenderTimer('court-lines');
renderCourtLines();
const renderTime = tracker.endRenderTimer('court-lines');
console.log(`Rendered in ${renderTime.toFixed(2)}ms`);
```

### 4. Baseline Comparison

```typescript
// Set baseline with no assets
tracker.setBaseline();

// Compare to baseline
const delta = tracker.compareToBaseline(current);
console.log(`Performance impact: ${delta.impactScore}/100`);
```

## Performance Report Structure

The tracker generates comprehensive reports with:

- **Baseline metrics** (no assets enabled)
- **Current metrics** (with assets)
- **Per-asset breakdown** with impact scores
- **Rankings** by performance cost
- **Recommendations** for optimization
- **System information** (GPU, cores, memory)

## Impact Score Interpretation

- **100 to 50**: Excellent performance
- **49 to 10**: Good performance
- **9 to -9**: Neutral impact
- **-10 to -30**: Noticeable cost
- **-31 to -50**: Significant cost
- **-51 to -100**: Critical impact

## Integration Example

```typescript
import { getPerformanceTracker } from '@/utils/debug';
import { assetRegistry } from '@/utils/debug';

// Set baseline
const tracker = getPerformanceTracker();
tracker.setBaseline();

// Track asset toggling
const handleToggle = (assetId: string) => {
  tracker.startRenderTimer(assetId);
  assetRegistry.toggle(assetId);
  const renderTime = tracker.endRenderTimer(assetId);
  
  tracker.updateAssetMetrics(
    assetId,
    assetRegistry.get(assetId)?.name || assetId,
    assetRegistry.isEnabled(assetId)
  );
  
  // Check impact
  const report = tracker.generateReport();
  console.log('Performance:', report.recommendations);
};
```

## Best Practices

1. **Set Baseline Early**: Before enabling assets
2. **Track All Assets**: Use timers for accurate data
3. **Regular Updates**: Call `updateAssetMetrics()` after changes
4. **Review Reports**: Check recommendations periodically
5. **Export Data**: Use `downloadReport()` for analysis

