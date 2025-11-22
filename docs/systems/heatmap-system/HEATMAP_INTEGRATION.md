# Heat Map Integration Guide

Complete guide for integrating heat map visualization into the ACE Tennis Facility project.

## Table of Contents
- [Overview](#overview)
- [Quick Start](#quick-start)
- [Integration Methods](#integration-methods)
- [Component Architecture](#component-architecture)
- [Data Structures](#data-structures)
- [Customization](#customization)
- [Performance Optimization](#performance-optimization)
- [Use Cases](#use-cases)
- [Troubleshooting](#troubleshooting)

## Overview

The Heat Map Overlay system provides advanced analytics visualization for tennis court usage, including:

- **Player Movement Tracking**: Visualize where players spend most time on court
- **Ball Impact Analysis**: Identify shot placement patterns and hot zones
- **Serve Placement Statistics**: Analyze serving patterns and target zones
- **Tactical Pattern Recognition**: Automated detection of strategic play patterns

### Key Features
- Real-time and historical data modes
- Color-coded intensity gradients (blue → cyan → green → yellow → red)
- Time-based filtering with playback controls
- Automatic pattern detection with confidence scoring
- WebGL shader-based rendering for optimal performance
- Interactive controls for data exploration

## Quick Start

### Method 1: Drop-in Replacement Component

Replace existing `TennisCourt` components with `TennisCourtWithHeatMap`:

```typescript
// Before
import TennisCourt from './TennisCourt';

<TennisCourt position={[0, 0, 0]} type="hard" />

// After
import TennisCourtWithHeatMap from './TennisCourtWithHeatMap';

<TennisCourtWithHeatMap
  position={[0, 0, 0]}
  type="hard"
  showHeatMapByDefault={true}
  enableHeatMapToggle={true}
/>
```

### Method 2: Standalone Heat Map

Add heat map overlay to existing court setup:

```typescript
import HeatMapOverlay from './components/HeatMapOverlay';

<group position={[0, 0, 0]}>
  {/* Your existing court mesh */}
  <TennisCourt position={[0, 0, 0]} type="clay" />

  {/* Add heat map overlay */}
  <HeatMapOverlay
    position={[0, 0, 0]}
    courtWidth={10}
    courtLength={22}
    courtType="clay"
    showControls={true}
  />
</group>
```

### Method 3: Comprehensive Demo

Run the full-featured demonstration:

```typescript
import HeatMapDemo from './components/HeatMapDemo';

function App() {
  return <HeatMapDemo />;
}
```

## Integration Methods

### Integration into ThreeScene.tsx

#### Option A: Enable for All Courts

```typescript
// In ThreeScene.tsx, modify GroundFloor component

const GroundFloor = ({ active, showMeasurements, showLabels }: Props) => {
  const [showHeatMaps, setShowHeatMaps] = useState(false);

  const courts = [];
  for(let i=0; i<24; i++) {
    let type: 'hard' | 'clay' | 'grass' | 'wood' = 'hard';
    if (i >= 6 && i < 12) type = 'clay';
    if (i >= 12 && i < 18) type = 'grass';
    if (i >= 18) type = 'wood';

    const row = Math.floor(i / 6);
    const col = i % 6;

    courts.push(
      <TennisCourtWithHeatMap
        key={i}
        type={type}
        position={[-35 + col * 14, 0.1, -40 + row * 26]}
        courtId={`ground_court_${i}`}
        showHeatMapByDefault={showHeatMaps}
        enableHeatMapToggle={true}
      />
    );
  }

  // Add toggle in UI
  return (
    <group position={[0, 0, 0]}>
      {courts}
      {/* Add heat map global toggle button */}
    </group>
  );
};
```

#### Option B: Enable for Specific Courts Only

```typescript
// Enable heat maps only for center courts or featured courts

const centerCourtIndices = [9, 10, 13, 14]; // Center 4 courts

courts.push(
  centerCourtIndices.includes(i) ? (
    <TennisCourtWithHeatMap
      key={i}
      type={type}
      position={[-35 + col * 14, 0.1, -40 + row * 26]}
      courtId={`ground_court_${i}`}
      showHeatMapByDefault={true}
    />
  ) : (
    <TennisCourt
      key={i}
      type={type}
      position={[-35 + col * 14, 0.1, -40 + row * 26]}
    />
  )
);
```

### Adding Heat Map Controls to ControlsOverlay

```typescript
// In ControlsOverlay component

const ControlsOverlay = ({ /* existing props */ }) => {
  const [heatMapMode, setHeatMapMode] = useState(false);

  return (
    <div className="absolute top-40 left-6 z-10 flex flex-col gap-4">
      {/* Existing controls */}

      {/* Heat Map Controls */}
      <div className="bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-white/10 pointer-events-auto shadow-2xl">
        <div className="px-3 py-2 text-xs font-bold text-white/50 uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-3 h-3" /> Heat Maps
        </div>
        <button
          onClick={() => setHeatMapMode(!heatMapMode)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
            heatMapMode ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'
          }`}
        >
          {heatMapMode ? 'Enabled' : 'Disabled'}
        </button>
      </div>
    </div>
  );
};
```

## Component Architecture

### Core Components

```
HeatMapOverlay (Main)
├── Heat Map Rendering
│   ├── Texture Generation
│   ├── Shader Material
│   └── Mesh Rendering
├── Pattern Detection
│   ├── Grid Clustering
│   ├── Hot Zone Identification
│   └── Pattern Visualization
├── Control Panel
│   ├── Data Type Selector
│   ├── Timeline Controls
│   ├── Playback Controls
│   └── Opacity Slider
└── UI Elements
    ├── Color Legend
    ├── Pattern Labels
    └── Statistics Display

TennisCourtWithHeatMap (Wrapper)
├── Court Rendering
├── HeatMapOverlay Integration
├── Toggle Button
└── Pattern Event Handling

HeatMapDemo (Showcase)
├── Multi-Court Layout
├── Global Controls
├── Pattern Dashboard
└── Comparison Tools
```

### Data Flow

```
Data Source → HeatPoint[] → Texture Generation → WebGL Shader → Rendered Heat Map
                    ↓
              Pattern Detection → HeatMapPattern[] → UI Visualization
```

## Data Structures

### Input Data Format

```typescript
// Example heat point data
const heatPoints: HeatPoint[] = [
  {
    x: 5.2,              // Position on court (0-10m)
    z: 11.5,             // Position on court (0-22m)
    intensity: 0.8,      // Activity intensity (0-1)
    timestamp: 1698765432000,
    type: 'player_position',
    metadata: {
      playerName: 'Player 1',
      shotType: 'forehand',
      speed: 95,         // km/h
      spin: 2500,        // rpm
    },
  },
  // ... more points
];
```

### Pattern Output Format

```typescript
// Detected patterns
const patterns: HeatMapPattern[] = [
  {
    id: 'zone_0',
    name: 'Hot Zone 1',
    description: 'High activity area at (5.2m, 11.5m)',
    zones: [
      { x: 5.2, z: 11.5, radius: 1.5 }
    ],
    frequency: 127,      // Number of events
    confidence: 0.92,    // Confidence score (0-1)
  },
];
```

## Customization

### Adjusting Color Gradient

Modify the `heatMapColor` function in the fragment shader:

```glsl
vec3 heatMapColor(float value) {
  // Custom gradient: purple → blue → green → orange
  if (value < 0.33) {
    return mix(vec3(0.5, 0.0, 1.0), vec3(0.0, 0.0, 1.0), value * 3.0);
  } else if (value < 0.66) {
    return mix(vec3(0.0, 0.0, 1.0), vec3(0.0, 1.0, 0.0), (value - 0.33) * 3.0);
  } else {
    return mix(vec3(0.0, 1.0, 0.0), vec3(1.0, 0.5, 0.0), (value - 0.66) * 3.0);
  }
}
```

### Custom Pattern Detection

Implement custom pattern recognition:

```typescript
const detectCustomPatterns = (points: HeatPoint[]): HeatMapPattern[] => {
  // Example: Detect serve-and-volley patterns
  const netApproaches = points.filter(p =>
    p.type === 'player_position' &&
    p.z < 8 && // Near net
    p.metadata?.shotType === 'volley'
  );

  if (netApproaches.length > 50) {
    return [{
      id: 'serve_volley_pattern',
      name: 'Serve & Volley Strategy',
      description: 'Frequent net approaches detected',
      zones: [{ x: 5, z: 6, radius: 2 }],
      frequency: netApproaches.length,
      confidence: 0.85,
    }];
  }

  return [];
};
```

### Styling the Control Panel

Customize the UI theme:

```typescript
// Custom theme colors
const customTheme = {
  primary: '#DFFF4F',        // Tennis yellow
  background: '#0f172a',     // Dark slate
  accent: '#3b82f6',         // Blue
  success: '#22c55e',        // Green
};

// Apply to control panel
<div
  className="bg-slate-900/95 backdrop-blur-md p-4 rounded-xl"
  style={{ backgroundColor: customTheme.background }}
>
  {/* Controls */}
</div>
```

## Performance Optimization

### Texture Resolution Tuning

```typescript
// Adjust based on device capability
const getOptimalResolution = () => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const hasHighEndGPU = /* detect GPU capability */;

  if (isMobile) return 128;
  if (hasHighEndGPU) return 512;
  return 256; // Default
};
```

### Data Pagination

```typescript
// Load data in chunks for large datasets
const usePagedHeatData = (courtId: string, pageSize: number = 1000) => {
  const [data, setData] = useState<HeatPoint[]>([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const loadPage = async () => {
      const chunk = await fetchHeatData(courtId, page, pageSize);
      setData(prev => [...prev, ...chunk]);
    };
    loadPage();
  }, [courtId, page, pageSize]);

  return { data, loadMore: () => setPage(p => p + 1) };
};
```

### Memory Management

```typescript
// Cleanup textures when unmounting
useEffect(() => {
  return () => {
    if (heatTexture) {
      heatTexture.dispose();
    }
  };
}, [heatTexture]);
```

## Use Cases

### 1. Player Performance Analysis

Track individual player movement patterns:

```typescript
<HeatMapOverlay
  position={[0, 0, 0]}
  courtWidth={10}
  courtLength={22}
  initialDataType="player_position"
  onPatternDetected={(pattern) => {
    console.log('Player tends to favor:', pattern.name);
  }}
/>
```

### 2. Court Maintenance Planning

Identify high-wear areas:

```typescript
<HeatMapOverlay
  initialDataType="ball_impact"
  onPatternDetected={(pattern) => {
    if (pattern.confidence > 0.8) {
      scheduleMaintenance(pattern.zones);
    }
  }}
/>
```

### 3. Tactical Training

Analyze strategic patterns:

```typescript
<HeatMapOverlay
  initialDataType="tactical_pattern"
  onPatternDetected={(pattern) => {
    generateCoachingTips(pattern);
  }}
/>
```

### 4. Match Replay Analysis

Review historical matches:

```typescript
const [matchTime, setMatchTime] = useState(matchStartTime);

<HeatMapOverlay
  initialMode="historical"
  currentTime={matchTime}
  onTimeChange={setMatchTime}
/>
```

## Troubleshooting

### Issue: Heat map not visible

**Possible causes:**
- Heat map positioned incorrectly relative to court
- Opacity set too low
- No data in current time range
- WebGL not supported

**Solutions:**
```typescript
// 1. Verify position matches court
<HeatMapOverlay position={[0, 0, 0]} /> // Same as court

// 2. Increase opacity
<HeatMapOverlay opacity={0.9} />

// 3. Check data range
console.log('Data points:', heatData.length);

// 4. Check WebGL support
const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl2');
if (!gl) console.error('WebGL 2.0 not supported');
```

### Issue: Poor performance with large datasets

**Solutions:**
```typescript
// 1. Reduce texture resolution
const resolution = 128; // Instead of 256

// 2. Implement data filtering
const visiblePoints = heatData.filter(p =>
  p.timestamp >= currentTime - 3600000 // Last hour only
);

// 3. Use lower detail for distant cameras
const detail = cameraDistance > 50 ? 'low' : 'high';
```

### Issue: Patterns not detected

**Solutions:**
```typescript
// 1. Lower threshold
const threshold = maxValue * 0.4; // More sensitive

// 2. Increase grid resolution
const gridSize = 30; // More granular

// 3. Ensure sufficient data density
if (heatData.length < 100) {
  console.warn('Insufficient data for pattern detection');
}
```

### Issue: Control panel not showing

**Solutions:**
```typescript
// 1. Verify showControls prop
<HeatMapOverlay showControls={true} />

// 2. Check z-index conflicts
// Ensure control panel has higher z-index than other UI

// 3. Verify HTML rendering in Three.js scene
// Html component requires Canvas with gl prop
<Canvas gl={{ alpha: true }}>
```

## Advanced Integration Examples

### Multi-Court Comparison Dashboard

```typescript
const ComparisonView = () => {
  const courts = ['court_1', 'court_2', 'court_3'];

  return (
    <Canvas>
      {courts.map((courtId, i) => (
        <group key={courtId} position={[i * 15, 0, 0]}>
          <TennisCourtWithHeatMap
            courtId={courtId}
            showHeatMapByDefault={true}
          />
        </group>
      ))}
    </Canvas>
  );
};
```

### Real-time WebSocket Integration

```typescript
const RealtimeHeatMap = ({ courtId }: { courtId: string }) => {
  const [liveData, setLiveData] = useState<HeatPoint[]>([]);

  useEffect(() => {
    const ws = new WebSocket(`wss://api.example.com/courts/${courtId}`);

    ws.onmessage = (event) => {
      const newPoint: HeatPoint = JSON.parse(event.data);
      setLiveData(prev => [...prev.slice(-1000), newPoint]); // Keep last 1000
    };

    return () => ws.close();
  }, [courtId]);

  return (
    <HeatMapOverlay
      initialMode="realtime"
      heatData={liveData}
    />
  );
};
```

### Export Heat Map as Image

```typescript
const exportHeatMap = (canvas: HTMLCanvasElement) => {
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = 'heatmap.png';
  link.href = dataUrl;
  link.click();
};

// Trigger from button
<button onClick={() => exportHeatMap(canvasRef.current)}>
  Export Heat Map
</button>
```

## Next Steps

1. **Connect Real Data**: Replace mock data generator with actual tracking system
2. **Add Export Features**: Implement PNG/CSV export functionality
3. **Enhance Patterns**: Develop more sophisticated pattern recognition algorithms
4. **Mobile Optimization**: Create touch-friendly controls for mobile devices
5. **3D Visualization**: Extend to volumetric heat maps for serve trajectories

## Resources

- [Component Documentation](./HeatMapOverlay.md)
- [Demo Application](../components/HeatMapDemo.tsx)
- [Integration Example](../components/TennisCourtWithHeatMap.tsx)
- [Three.js Documentation](https://threejs.org/docs/)
- [React Three Fiber Guide](https://docs.pmnd.rs/react-three-fiber)

## Support

For issues or questions, refer to:
- Component source code comments
- This integration guide
- Project README.md
