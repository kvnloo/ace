# Debug Panel Component

Comprehensive 3D asset debugging and performance monitoring system for React applications.

## Features

- ✅ **Asset Management**: Toggle individual 3D assets on/off with dependency tracking
- 📊 **Performance Metrics**: Real-time FPS, memory usage, and frame time monitoring
- 📈 **Performance Graphs**: 60-frame FPS history visualization
- 🎯 **Preset Configurations**: Pre-defined and custom asset configurations
- 📦 **Performance Reports**: Export detailed JSON/CSV performance reports
- ⌨️ **Keyboard Shortcuts**: Quick access to common debugging actions
- 🎨 **Modern UI**: Glass-morphism design with dark theme
- 📱 **Responsive**: Works on desktop and mobile (optimized for desktop)
- 🔧 **Draggable & Resizable**: Position and size the panel to your needs

## Installation

The debug panel components are already included in the project:

```
src/components/debug/
├── DebugPanel.tsx         # Main panel component
├── AssetToggle.tsx        # Asset control component
├── PerformanceChart.tsx   # Performance visualization
├── PresetSelector.tsx     # Preset management
├── types.ts               # TypeScript definitions
├── index.ts               # Exports
├── DebugPanel.example.tsx # Usage examples
└── README.md              # This file
```

## Quick Start

```tsx
import React, { useState } from 'react';
import { DebugPanel } from '@/components/debug';
import type { Asset3D } from '@/components/debug';

function App() {
  const [assets, setAssets] = useState<Asset3D[]>([
    {
      id: 'lighting',
      name: 'Scene Lighting',
      enabled: true,
      performanceCost: 'low',
      dependencies: []
    },
    {
      id: 'shadows',
      name: 'Shadow Mapping',
      enabled: true,
      performanceCost: 'high',
      dependencies: ['lighting']
    }
  ]);

  const handleAssetToggle = (assetId: string, enabled: boolean) => {
    setAssets(prev =>
      prev.map(asset =>
        asset.id === assetId ? { ...asset, enabled } : asset
      )
    );
    // Update your 3D scene here
  };

  return (
    <div className="w-full h-screen">
      {/* Your 3D Scene */}
      <DebugPanel
        assets={assets}
        onAssetToggle={handleAssetToggle}
      />
    </div>
  );
}
```

## API Reference

### DebugPanel Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `assets` | `Asset3D[]` | `[]` | Array of 3D assets to control |
| `onAssetToggle` | `(id: string, enabled: boolean) => void` | - | Callback when asset is toggled |
| `onPresetApply` | `(presetId: string) => void` | - | Callback when preset is applied |
| `initialPosition` | `{ x: number; y: number }` | Bottom-right | Initial panel position |
| `initialSize` | `{ width: number; height: number }` | `500x580` | Initial panel size |

### Asset3D Type

```typescript
interface Asset3D {
  id: string;                           // Unique identifier
  name: string;                         // Display name
  enabled: boolean;                     // Current state
  performanceCost: 'low' | 'medium' | 'high'; // Performance impact
  dependencies: string[];               // Asset IDs this depends on
  renderTime?: number;                  // ms per frame (optional)
  memoryUsage?: number;                 // MB (optional)
}
```

### PerformanceMetrics Type

```typescript
interface PerformanceMetrics {
  fps: number;                          // Current FPS
  memory: number;                       // Memory in MB
  renderTime: number;                   // Frame time in ms
  frameHistory: number[];               // Last 60 FPS values
  timestamp: number;                    // Timestamp
}
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+D` | Toggle debug panel |
| `Ctrl+Shift+A` | Enable all assets |
| `Ctrl+Shift+N` | Disable all assets |
| `Ctrl+Shift+R` | Reset to defaults |

## Default Presets

### Baseline
Minimal scene with basic lighting only. Use this to measure baseline performance.

### One-by-One
Enable assets sequentially for isolated performance testing.

### Production
Full scene configuration with recommended production settings.

### Performance Test
Maximum load test with all assets enabled for stress testing.

## Custom Presets

Save your current asset configuration as a custom preset:

1. Configure assets to desired state
2. Click "Preset" dropdown
3. Select "Save Current as Preset"
4. Enter name and description
5. Click "Save"

Custom presets can be deleted via the trash icon in the preset dropdown.

## Performance Report Export

Export detailed performance data as JSON:

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "duration": 120,
  "metrics": {
    "avgFps": 58,
    "minFps": 45,
    "maxFps": 60,
    "avgMemory": 245,
    "peakMemory": 280
  },
  "assets": {
    "lighting": {
      "renderTime": 1.2,
      "memoryUsage": 2.5
    },
    "shadows": {
      "renderTime": 8.5,
      "memoryUsage": 45.0
    }
  },
  "presetUsed": "production"
}
```

## Integration Examples

### React Three Fiber

```tsx
import { Canvas } from '@react-three/fiber';
import { DebugPanel } from '@/components/debug';

function Scene() {
  const [assets, setAssets] = useState([...]);

  return (
    <>
      <Canvas>
        {assets.find(a => a.id === 'lighting')?.enabled && (
          <directionalLight position={[10, 10, 5]} />
        )}
        {assets.find(a => a.id === 'model')?.enabled && (
          <Model />
        )}
      </Canvas>
      <DebugPanel assets={assets} onAssetToggle={handleToggle} />
    </>
  );
}
```

### Three.js (Vanilla)

```tsx
useEffect(() => {
  const enabled = assets.find(a => a.id === 'shadows')?.enabled;
  if (renderer) {
    renderer.shadowMap.enabled = enabled ?? false;
  }
}, [assets, renderer]);
```

### Performance Tracking

```tsx
const [metrics, setMetrics] = useState<PerformanceMetrics>({
  fps: 0,
  memory: 0,
  renderTime: 0,
  frameHistory: [],
  timestamp: Date.now()
});

// Update asset performance data
const updateAssetMetrics = (assetId: string, data: {
  renderTime: number;
  memoryUsage: number;
}) => {
  setAssets(prev =>
    prev.map(asset =>
      asset.id === assetId ? { ...asset, ...data } : asset
    )
  );
};
```

## Styling

The debug panel uses Tailwind CSS with a dark theme. All components follow the design system:

- **Background**: `slate-900/95` with backdrop blur
- **Borders**: `slate-700`
- **Text**: White and slate variations
- **Accents**: Green (success), Red (error), Yellow (warning), Blue (info)

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

Requires:
- `performance.now()` API
- `requestAnimationFrame()` API
- CSS backdrop-filter support (optional, graceful degradation)

## Performance Considerations

The debug panel itself is optimized for minimal performance impact:

- Uses `requestAnimationFrame` for FPS tracking
- Debounced updates for UI rendering
- Efficient state management
- No heavy computations in render loop

Typical overhead: **< 0.5 FPS** impact

## Troubleshooting

### Panel not visible
- Check z-index conflicts
- Verify panel is enabled (`isVisible` state)
- Try keyboard shortcut `Ctrl+Shift+D`

### FPS shows 0
- Ensure performance monitoring is active
- Check browser compatibility
- Verify `requestAnimationFrame` is not blocked

### Memory shows 0
- Memory API requires Chrome-based browsers
- Check `performance.memory` availability
- Not supported in Firefox/Safari (shows 0)

### Asset toggles not working
- Verify `onAssetToggle` callback is provided
- Check asset state is being updated
- Ensure 3D scene responds to asset state changes

## License

MIT

## Contributing

Issues and PRs welcome! Please follow the existing code style and add tests for new features.
