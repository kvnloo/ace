# FPS-Batch Integration Quick Reference

## 🚀 Quick Start (30 seconds)

```typescript
import { fpsBatchController } from '@/services/fps';
import { BatchControlPanel } from '@/components/fps/BatchControlPanel';

// In your App component
useEffect(() => {
  fpsBatchController.start();
  return () => fpsBatchController.stop();
}, []);

// Add to your JSX
<BatchControlPanel controller={fpsBatchController} />
```

## 📊 Component Batches

| Batch | Cost | Description |
|-------|------|-------------|
| COURTS_ONLY | 0 | Always enabled |
| BUILDINGS | 5 | Structures |
| GRASS | 10 | Ground cover |
| TREES | 8 | Foliage |
| SHADOWS | 12 | Dynamic shadows |
| WEATHER | 7 | Atmosphere |
| PARTICLES | 15 | Effects |
| POST_PROCESSING | 10 | Post-FX |
| REFLECTIONS | 18 | Advanced lighting |

## 🎯 FPS Thresholds

- **< 25 FPS**: Emergency mode (courts only)
- **< 40 FPS**: Auto-downgrade batches
- **>= 55 FPS**: Auto-upgrade batches

## 💻 Common Code Patterns

### React Hook
```typescript
const { controller, state, actions } = useFPSBatchController();
// state.currentFPS, state.enabledBatches, state.warnings
// actions.enableBatch(), actions.disableBatch()
```

### Manual Control
```typescript
await controller.enableBatch(ComponentBatch.GRASS);
await controller.disableBatch(ComponentBatch.PARTICLES);
controller.clearManualOverrides();
```

### Warning Handler
```typescript
controller.onWarning((warning) => {
  console.log(warning.message);
  if (warning.type === 'fps_critical') {
    // Handle critical FPS
  }
});
```

### Batch Change Handler
```typescript
controller.getBatchManager().onBatchChange((event) => {
  if (event.enabled) {
    // Enable in Three.js scene
  } else {
    // Disable in Three.js scene
  }
});
```

### Correlation Data
```typescript
const data = controller.exportCorrelationData();
console.log(JSON.stringify(data, null, 2));
```

## 🔧 Diagnostics

```typescript
const diag = controller.getDiagnostics();
console.log('Monitoring:', diag.monitoring);
console.log('FPS:', diag.fps.stats);
console.log('Enabled:', diag.batches.enabled);
console.log('Thresholds:', diag.thresholds);
```

## 🎨 UI Features

- **Floating button**: Bottom right, opens panel
- **FPS display**: Real-time with color coding
- **Batch toggles**: Enable/disable buttons
- **Lock icons**: Manual override indicators
- **Warnings**: Auto-dismissible notifications
- **Stats view**: Correlation data toggle

## 📁 File Locations

```
src/
  services/fps/
    ComponentBatchManager.ts  # Core batch management
    FPSBatchController.ts     # Integration controller
    index.ts                  # Exports
  components/fps/
    BatchControlPanel.tsx     # UI component
    BatchControlPanel.example.tsx  # Examples
  hooks/
    useFPSBatchController.ts  # React hook
docs/
  fps-batch-integration.md    # Full documentation
  fps-batch-quick-reference.md  # This file
```

## 🐛 Troubleshooting

### FPS not updating?
```typescript
controller.getFPSMonitor().getDiagnostics().monitoring // Should be true
```

### Batches not auto-adjusting?
```typescript
controller.clearManualOverrides(); // Remove locks
```

### Too much thrashing?
Increase stability thresholds in FPSBatchController constructor

## 📖 Full Documentation

See `docs/fps-batch-integration.md` for complete guide.

## 🎯 Key Exports

```typescript
import {
  // Enums
  ComponentBatch,

  // Classes
  ComponentBatchManager,
  FPSBatchController,
  FPSMonitor,

  // Singletons
  componentBatchManager,
  fpsBatchController,

  // Types
  BatchConfig,
  BatchState,
  FPSStats,
  WarningEvent
} from '@/services/fps';

import { BatchControlPanel } from '@/components/fps/BatchControlPanel';
import { useFPSBatchController } from '@/hooks/useFPSBatchController';
```

## ⚡ Performance Tips

1. Start monitoring after loading complete
2. Respect manual overrides
3. Export correlation data periodically
4. Test thresholds on target devices
5. Monitor warning events
6. Adjust batch costs based on real data

## 🚦 Status Indicators

- **Green (>= 55)**: Excellent
- **Blue (>= 40)**: Good
- **Amber (>= 25)**: Fair
- **Red (< 25)**: Critical

## 🔒 Manual Override

1. Toggle batch in UI
2. Lock icon appears
3. Auto-adjustment skips locked batches
4. Click "Clear Locks" to restore auto-mode

---

**Need more details?** See `docs/fps-batch-integration.md`
