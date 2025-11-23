# Adaptive Loading API Reference

Developer guide for integrating and extending the adaptive loading system.

## Core APIs

### Loading Provider

React context provider for loading state management.

```typescript
import { LoadingProvider, useLoading } from '@/components/LoadingProvider';

function App() {
  return (
    <LoadingProvider>
      <YourApp />
    </LoadingProvider>
  );
}
```

#### useLoading Hook

Access loading state and methods:

```typescript
const {
  // State
  assets,           // AssetItem[]
  isLoading,        // boolean
  overallProgress,  // number (0-100)
  loadedCount,      // number
  totalCount,       // number

  // Methods
  registerAsset,    // (asset) => void
  updateAssetProgress, // (id, progress) => void
  markAssetLoaded,  // (id) => void
  markAssetError,   // (id, error) => void
  startLoading,     // () => void
  finishLoading     // () => void
} = useLoading();
```

### Quality Preset Manager

Manages quality modes and auto-adjustment.

```typescript
import { qualityPresetManager, QualityMode } from '@/services/loading/QualityPresets';

// Get current mode
const mode = qualityPresetManager.getCurrentMode();
// Returns: QualityMode.BALANCED

// Get current preset
const preset = qualityPresetManager.getCurrentPreset();
// Returns: QualityPreset { mode, name, settings, ... }

// Apply preset
await qualityPresetManager.applyPreset(QualityMode.ULTRA, 'manual');

// Upgrade/downgrade
await qualityPresetManager.upgradeQuality();
await qualityPresetManager.downgradeQuality();

// Check capabilities
qualityPresetManager.canUpgrade(); // boolean
qualityPresetManager.canDowngrade(); // boolean

// FPS tracking
qualityPresetManager.recordFPS(fps);

// Auto-adjustment
await qualityPresetManager.autoAdjust(fps);

// Monitoring
qualityPresetManager.startMonitoring(() => getCurrentFPS());
qualityPresetManager.stopMonitoring();

// Status
const status = qualityPresetManager.getStatus();
// Returns: { currentMode, currentPreset, averageFPS, canUpgrade, canDowngrade, monitoring }
```

### Phase Definitions

Access loading phase configurations:

```typescript
import {
  LOADING_PHASES,
  getPhaseDefinition,
  getNextPhase,
  getPreviousPhase,
  isPhasePerformanceAcceptable,
  getTotalEstimatedDuration,
  getPhaseForAsset
} from '@/services/loading/phases';

// Get all phases
LOADING_PHASES.forEach(phase => {
  console.log(phase.name, phase.targetFPS, phase.estimatedDuration);
});

// Get specific phase
const corePhase = getPhaseDefinition(LoadingPhase.CORE);

// Navigation
const next = getNextPhase(LoadingPhase.ESSENTIAL);
// Returns: LoadingPhase.CORE

const prev = getPreviousPhase(LoadingPhase.VISUAL);
// Returns: LoadingPhase.CORE

// FPS check
const acceptable = isPhasePerformanceAcceptable(LoadingPhase.CORE, 55);
// Returns: true (target is 50)

// Duration
const total = getTotalEstimatedDuration();
// Returns: 27 seconds

// Asset lookup
const phase = getPhaseForAsset('geometry-tennis-court-1');
// Returns: LoadingPhase.CORE
```

## Types

### LoadingPhase

```typescript
enum LoadingPhase {
  ESSENTIAL = 'essential',
  CORE = 'core',
  VISUAL = 'visual',
  ENHANCED = 'enhanced'
}
```

### AssetCategory

```typescript
enum AssetCategory {
  SCENE = 'scene',
  CAMERA = 'camera',
  LIGHTING = 'lighting',
  GEOMETRY = 'geometry',
  MATERIALS = 'materials',
  EFFECTS = 'effects',
  WEATHER = 'weather',
  POSTPROCESSING = 'postprocessing'
}
```

### LoadingState

```typescript
enum LoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  ERROR = 'error'
}
```

### AssetLoadStatus

```typescript
enum AssetLoadStatus {
  PENDING = 'pending',
  LOADING = 'loading',
  LOADED = 'loaded',
  FAILED = 'failed',
  SKIPPED = 'skipped'
}
```

### QualityMode

```typescript
enum QualityMode {
  EMERGENCY = 'emergency',
  MINIMAL = 'minimal',
  BALANCED = 'balanced',
  QUALITY = 'quality',
  ULTRA = 'ultra'
}
```

### PhaseDefinition

```typescript
interface PhaseDefinition {
  phase: LoadingPhase;
  name: string;
  description: string;
  targetFPS: number;
  estimatedDuration: number; // seconds
  categories: AssetCategory[];
  assets: string[];
}
```

### QualityPreset

```typescript
interface QualityPreset {
  mode: QualityMode;
  name: string;
  description: string;
  enabledAssets: string[];
  disabledAssets: string[];
  settings: QualitySettings;
  targetFPS: { min: number; max: number };
  estimatedMemory: number; // MB
}
```

### QualitySettings

```typescript
interface QualitySettings {
  shadowQuality: 'off' | 'low' | 'medium' | 'high';
  grassDensity: number; // 0-1
  particleCount: number;
  postProcessing: boolean;
  weatherEffects: boolean;
  lodDistance: number; // meters
}
```

### QualityChangeEvent

```typescript
interface QualityChangeEvent {
  from: QualityMode;
  to: QualityMode;
  reason: 'manual' | 'auto_downgrade' | 'auto_upgrade';
  timestamp: number;
}
```

## Integration Examples

### Basic Loading Flow

```typescript
import { useLoading } from '@/components/LoadingProvider';
import { LoadingPhase } from '@/services/loading/types';

function LoadingScreen() {
  const {
    isLoading,
    overallProgress,
    registerAsset,
    markAssetLoaded,
    startLoading,
    finishLoading
  } = useLoading();

  useEffect(() => {
    async function load() {
      startLoading();

      // Register assets
      registerAsset({
        id: 'scene-container',
        name: 'Scene Container',
        type: 'data',
        priority: 'high'
      });

      // Load asset
      await loadSceneContainer();
      markAssetLoaded('scene-container');

      finishLoading();
    }

    load();
  }, []);

  if (!isLoading) return null;

  return (
    <div>
      <progress value={overallProgress} max={100} />
      <p>{overallProgress.toFixed(0)}% loaded</p>
    </div>
  );
}
```

### FPS Monitoring

```typescript
import { qualityPresetManager } from '@/services/loading/QualityPresets';
import { useFrame } from '@react-three/fiber';

function FPSMonitor() {
  const lastTime = useRef(performance.now());
  const frames = useRef(0);

  useFrame(() => {
    frames.current++;

    const now = performance.now();
    const elapsed = now - lastTime.current;

    if (elapsed >= 1000) {
      const fps = (frames.current / elapsed) * 1000;

      // Record FPS
      qualityPresetManager.recordFPS(fps);

      // Auto-adjust quality
      qualityPresetManager.autoAdjust(fps);

      frames.current = 0;
      lastTime.current = now;
    }
  });

  return null;
}
```

### Quality Change Listener

```typescript
import { qualityPresetManager } from '@/services/loading/QualityPresets';

function QualityNotifications() {
  useEffect(() => {
    const unsubscribe = qualityPresetManager.onChange((event) => {
      console.log(`Quality changed from ${event.from} to ${event.to}`);

      if (event.reason === 'auto_downgrade') {
        showNotification('Performance adjusted for better FPS');
      }
    });

    return unsubscribe;
  }, []);

  return null;
}
```

### Custom Loading Phase

```typescript
import { LoadingPhase, AssetCategory } from '@/services/loading/types';

const CUSTOM_PHASE: PhaseDefinition = {
  phase: 'custom' as LoadingPhase,
  name: 'Custom Assets',
  description: 'Additional custom content',
  targetFPS: 30,
  estimatedDuration: 5,
  categories: [AssetCategory.GEOMETRY, AssetCategory.MATERIALS],
  assets: [
    'custom-model-1',
    'custom-model-2',
    'custom-texture-1'
  ]
};

// Register custom phase
LOADING_PHASES.push(CUSTOM_PHASE);
```

### Progressive Asset Loading

```typescript
import { useLoading } from '@/components/LoadingProvider';
import { LOADING_PHASES } from '@/services/loading/phases';

function ProgressiveLoader() {
  const { registerAsset, markAssetLoaded } = useLoading();

  async function loadPhase(phase: PhaseDefinition) {
    for (const assetId of phase.assets) {
      // Register
      registerAsset({
        id: assetId,
        name: assetId,
        type: 'model',
        priority: 'high'
      });

      // Load
      await loadAsset(assetId);

      // Mark complete
      markAssetLoaded(assetId);
    }
  }

  async function loadAllPhases() {
    for (const phase of LOADING_PHASES) {
      console.log(`Loading phase: ${phase.name}`);
      await loadPhase(phase);

      // Check FPS after each phase
      const fps = getCurrentFPS();
      if (fps < phase.targetFPS) {
        console.warn(`FPS below target: ${fps} < ${phase.targetFPS}`);
        // Trigger quality adjustment
        await qualityPresetManager.autoAdjust(fps);
      }
    }
  }

  return <button onClick={loadAllPhases}>Start Loading</button>;
}
```

### Error Handling

```typescript
import { useLoading } from '@/components/LoadingProvider';

function RobustLoader() {
  const { registerAsset, markAssetLoaded, markAssetError } = useLoading();

  async function loadAssetSafely(assetId: string) {
    registerAsset({
      id: assetId,
      name: assetId,
      type: 'model',
      priority: 'high'
    });

    try {
      await loadAsset(assetId);
      markAssetLoaded(assetId);
    } catch (error) {
      console.error(`Failed to load ${assetId}:`, error);
      markAssetError(assetId, error.message);

      // Retry logic
      if (shouldRetry(error)) {
        await delay(1000);
        return loadAssetSafely(assetId);
      }
    }
  }

  return null;
}
```

## Advanced Usage

### Custom Quality Preset

```typescript
import { QualityPreset, QualityMode } from '@/services/loading/QualityPresets';

const CUSTOM_PRESET: QualityPreset = {
  mode: 'custom' as QualityMode,
  name: 'Custom',
  description: 'Custom quality configuration',
  enabledAssets: ['courts', 'buildings', 'grass'],
  disabledAssets: ['particles', 'reflections'],
  settings: {
    shadowQuality: 'medium',
    grassDensity: 0.5,
    particleCount: 500,
    postProcessing: true,
    weatherEffects: true,
    lodDistance: 125
  },
  targetFPS: { min: 45, max: 55 },
  estimatedMemory: 640
};

// Add to presets
QUALITY_PRESETS['custom'] = CUSTOM_PRESET;
```

### Performance Metrics

```typescript
import { qualityPresetManager } from '@/services/loading/QualityPresets';

function PerformanceTracker() {
  const [metrics, setMetrics] = useState({
    fps: 0,
    mode: QualityMode.BALANCED,
    canUpgrade: false,
    canDowngrade: false
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const status = qualityPresetManager.getStatus();
      setMetrics({
        fps: status.averageFPS,
        mode: status.currentMode,
        canUpgrade: status.canUpgrade,
        canDowngrade: status.canDowngrade
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <p>FPS: {metrics.fps.toFixed(1)}</p>
      <p>Mode: {metrics.mode}</p>
      {metrics.canUpgrade && <button>Upgrade Quality</button>}
      {metrics.canDowngrade && <button>Downgrade Quality</button>}
    </div>
  );
}
```

## Testing

### Mock Quality Manager

```typescript
import { vi } from 'vitest';
import { qualityPresetManager } from '@/services/loading/QualityPresets';

// Mock methods
vi.spyOn(qualityPresetManager, 'applyPreset').mockResolvedValue();
vi.spyOn(qualityPresetManager, 'recordFPS').mockImplementation(() => {});

// Test
await qualityPresetManager.applyPreset(QualityMode.ULTRA);
expect(qualityPresetManager.applyPreset).toHaveBeenCalledWith(QualityMode.ULTRA);
```

### Test Helpers

```typescript
// Helper to simulate FPS
function simulateFPS(manager: QualityPresetManager, fps: number, samples: number = 10) {
  for (let i = 0; i < samples; i++) {
    manager.recordFPS(fps);
  }
}

// Helper to wait for quality change
async function waitForQualityChange(
  manager: QualityPresetManager,
  expectedMode: QualityMode
): Promise<void> {
  return new Promise((resolve) => {
    const unsubscribe = manager.onChange((event) => {
      if (event.to === expectedMode) {
        unsubscribe();
        resolve();
      }
    });
  });
}
```

## Performance Considerations

### Memory Management

```typescript
// Clean up monitoring when component unmounts
useEffect(() => {
  qualityPresetManager.startMonitoring(() => getCurrentFPS());

  return () => {
    qualityPresetManager.stopMonitoring();
  };
}, []);
```

### Throttling

```typescript
// Throttle FPS updates
const throttledRecordFPS = throttle((fps: number) => {
  qualityPresetManager.recordFPS(fps);
}, 1000);

useFrame(() => {
  const fps = calculateFPS();
  throttledRecordFPS(fps);
});
```

### Lazy Loading

```typescript
// Lazy load quality presets
const QUALITY_PRESETS = {
  get [QualityMode.EMERGENCY]() {
    return import('./presets/emergency').then(m => m.default);
  },
  get [QualityMode.MINIMAL]() {
    return import('./presets/minimal').then(m => m.default);
  },
  // ...
};
```

## See Also

- [User Guide](./adaptive-loading.md)
- [Troubleshooting](./troubleshooting-loading.md)
- [Performance Optimization](../performance/optimization-guide.md)
- [Testing Guide](../testing/loading-tests.md)
