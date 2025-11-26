# FPS Monitoring and Component Batch Loading Integration

## Overview

This system integrates real-time FPS monitoring with progressive component batch loading to automatically optimize 3D scene performance across different hardware capabilities.

## Architecture

### Core Components

1. **FPSMonitor** (`src/services/loading/FPSMonitor.ts`)
   - Real-time frame rate tracking
   - FPS statistics and history
   - Significant change callbacks
   - Stability detection

2. **ComponentBatchManager** (`src/services/fps/ComponentBatchManager.ts`)
   - Manages 9 progressive component batches
   - Dependency resolution
   - Enable/disable batches based on performance
   - Manual override support

3. **FPSBatchController** (`src/services/fps/FPSBatchController.ts`)
   - Integrates FPS monitoring with batch management
   - Automatic threshold-based adjustments
   - Warning system for performance issues
   - FPS-to-batch correlation tracking

4. **BatchControlPanel** (`src/components/fps/BatchControlPanel.tsx`)
   - User interface for manual control
   - Real-time FPS display
   - Batch toggle controls
   - Performance correlation stats

## Component Batches

The system manages 9 progressive batches (in load order):

| Batch | Priority | Est. Cost | Description |
|-------|----------|-----------|-------------|
| COURTS_ONLY | 0 | 0 FPS | Essential court geometry (always enabled) |
| BUILDINGS | 1 | 5 FPS | Surrounding buildings and structures |
| GRASS | 2 | 10 FPS | Grass and ground cover |
| TREES | 3 | 8 FPS | Trees and foliage |
| SHADOWS | 4 | 12 FPS | Dynamic shadows |
| WEATHER | 5 | 7 FPS | Weather and atmospheric effects |
| PARTICLES | 6 | 15 FPS | Particle effects |
| POST_PROCESSING | 7 | 10 FPS | Post-processing effects |
| REFLECTIONS | 8 | 18 FPS | Reflections and advanced lighting |

## FPS Thresholds

The controller uses three key thresholds:

- **CRITICAL** (< 25 FPS): Emergency mode - disable all non-essential batches
- **LOW** (< 40 FPS): Downgrade mode - progressively disable batches
- **STABLE** (>= 55 FPS): Upgrade mode - enable additional batches if FPS headroom available

## Stability Requirements

To prevent thrashing, the system requires:
- **3 consecutive samples** below threshold to trigger downgrade
- **6 consecutive samples** above threshold to trigger upgrade
- **1-second sampling interval** for stability checks

## Usage

### Basic Integration

```typescript
import { FPSBatchController } from '@/services/fps';
import { BatchControlPanel } from '@/components/fps/BatchControlPanel';

// Create controller instance
const controller = new FPSBatchController();

// Start monitoring
controller.start();

// Add to your component
<BatchControlPanel controller={controller} />
```

### Using the React Hook

```typescript
import { useFPSBatchController } from '@/hooks/useFPSBatchController';
import { ComponentBatch } from '@/services/fps';

function MyComponent() {
  const { controller, state, actions } = useFPSBatchController();

  return (
    <div>
      <p>Current FPS: {state.currentFPS}</p>
      <p>Average FPS: {state.averageFPS}</p>

      <button onClick={() => actions.enableBatch(ComponentBatch.GRASS)}>
        Enable Grass
      </button>

      <button onClick={() => actions.disableBatch(ComponentBatch.PARTICLES)}>
        Disable Particles
      </button>

      {state.warnings.map((warning, i) => (
        <div key={i}>
          {warning.message}
          <button onClick={() => actions.dismissWarning(i)}>Dismiss</button>
        </div>
      ))}
    </div>
  );
}
```

### Manual Batch Control

```typescript
// Enable a specific batch
await controller.enableBatch(ComponentBatch.GRASS);

// Disable a batch
await controller.disableBatch(ComponentBatch.PARTICLES);

// Clear all manual overrides (allow auto-adjustment)
controller.clearManualOverrides();
```

### Warning System

```typescript
controller.onWarning((warning) => {
  console.log(`${warning.type}: ${warning.message}`);
  console.log(`Current FPS: ${warning.currentFPS}`);
  console.log(`Threshold: ${warning.threshold}`);

  if (warning.recommendedAction) {
    console.log(`Recommended: ${warning.recommendedAction}`);
  }
});
```

### Correlation Tracking

```typescript
// Get correlation data for a specific batch
const correlation = controller.getCorrelation(ComponentBatch.GRASS);
console.log(`Average impact: ${correlation.averageImpact} FPS`);
console.log(`Sample count: ${correlation.sampleCount}`);

// Export all correlation data
const allCorrelations = controller.exportCorrelationData();
console.log(JSON.stringify(allCorrelations, null, 2));
```

## Integration with LoadingScreen

The system can be integrated with the existing LoadingScreen:

```typescript
import { FPSBatchController } from '@/services/fps';
import { BatchControlPanel } from '@/components/fps/BatchControlPanel';

function App() {
  const [controller] = useState(() => new FPSBatchController());

  useEffect(() => {
    controller.start();
    return () => controller.stop();
  }, [controller]);

  return (
    <>
      <LoadingScreen
        onComplete={handleLoadingComplete}
        showFPSMonitor={true}
      />

      <BatchControlPanel
        controller={controller}
        initiallyOpen={false}
      />

      <ThreeScene batches={controller.getBatchManager()} />
    </>
  );
}
```

## Performance Optimization

### Automatic Downgrade

When FPS drops below 40 for 3 consecutive seconds:

1. Controller identifies enabled batches (excluding COURTS_ONLY)
2. Batches are sorted by priority (highest first)
3. Manual overrides are respected (locked batches skipped)
4. Batches are disabled one at a time until FPS recovers
5. Warning events are emitted for each change

### Automatic Upgrade

When FPS remains above 55 for 6 consecutive seconds:

1. Controller calculates available FPS headroom
2. Disabled batches are sorted by priority (lowest first)
3. Batches with cost ≤ available headroom are enabled
4. Process repeats until no more batches can be safely enabled

### Emergency Mode

When FPS drops below 25:

1. Immediate warning emitted
2. All non-essential batches disabled
3. Only COURTS_ONLY batch remains enabled
4. System remains in emergency mode until FPS recovers

## Manual Override

Users can manually enable/disable batches:

1. Click the settings button (bottom right)
2. Toggle individual batches
3. Locked icon indicates manual override
4. Click "Clear Locks" to re-enable auto-adjustment

Manual overrides are respected by automatic systems to prevent conflicts.

## Diagnostics

```typescript
const diagnostics = controller.getDiagnostics();

console.log('Monitoring:', diagnostics.monitoring);
console.log('FPS Stats:', diagnostics.fps);
console.log('Enabled Batches:', diagnostics.batches.enabled);
console.log('Manual Overrides:', diagnostics.batches.manualOverrides);
console.log('Thresholds:', diagnostics.thresholds);
console.log('Stability:', diagnostics.stability);
console.log('Correlations:', diagnostics.correlations);
```

## Best Practices

1. **Start monitoring early**: Initialize controller during app startup
2. **Respect manual overrides**: Don't force auto-adjustment on user preferences
3. **Monitor warnings**: Subscribe to warning events and notify users
4. **Export correlations**: Use correlation data to optimize estimated costs
5. **Test across devices**: Verify thresholds work on low-end hardware
6. **Provide controls**: Give users manual override option
7. **Document changes**: Log all batch changes for debugging

## Testing

### Manual Testing

1. Open batch control panel
2. Enable all batches
3. Monitor FPS as batches load
4. Verify automatic downgrade at low FPS
5. Verify automatic upgrade at high FPS
6. Test manual override locks
7. Verify emergency mode at critical FPS

### Performance Testing

```typescript
// Measure FPS impact of specific batch
const before = controller.getFPSMonitor().getAverageFPS(60);
await controller.enableBatch(ComponentBatch.GRASS);
await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for stabilization
const after = controller.getFPSMonitor().getAverageFPS(60);
const impact = before - after;
console.log(`Grass impact: ${impact} FPS`);
```

## Troubleshooting

### FPS not updating

- Ensure controller is started: `controller.start()`
- Check if monitoring is active: `controller.getDiagnostics().monitoring`
- Verify FPS monitor is running: `controller.getFPSMonitor().getDiagnostics()`

### Batches not auto-adjusting

- Check stability counters: `controller.getDiagnostics().stability`
- Verify no manual overrides: `controller.clearManualOverrides()`
- Ensure thresholds are appropriate for device

### Thrashing (rapid enable/disable)

- Increase stability threshold
- Adjust FPS thresholds
- Add hysteresis to threshold checks

### Warnings not appearing

- Subscribe to warning events: `controller.onWarning(callback)`
- Check warning callback count: `controller.getDiagnostics()`
- Verify warning events are being emitted

## Future Enhancements

1. **Quality presets integration**: Link batches to existing quality modes
2. **Machine learning**: Train cost estimates from real usage data
3. **Device profiling**: Store optimal settings per device type
4. **Predictive loading**: Anticipate FPS drops before they occur
5. **Network-aware**: Adjust loading strategy based on connection speed
6. **Asset streaming**: Load batch assets progressively
7. **Memory pressure**: Factor memory usage into batch decisions
8. **User analytics**: Track which batches users prefer
9. **A/B testing**: Test different threshold configurations
10. **Performance budgets**: Set strict FPS targets per batch

## API Reference

See TypeScript definitions in:
- `src/services/fps/ComponentBatchManager.ts`
- `src/services/fps/FPSBatchController.ts`
- `src/hooks/useFPSBatchController.ts`
- `src/components/fps/BatchControlPanel.tsx`
