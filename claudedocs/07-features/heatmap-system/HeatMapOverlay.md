# Heat Map Overlay Component

Advanced heat map visualization system for tennis court usage analytics, player movement tracking, and tactical pattern recognition.

## Features

### Core Capabilities
- **Real-time Heat Map Rendering**: WebGL shader-based visualization with color-coded intensity gradients
- **Multiple Data Types**: Player position, ball impact, serve placement, tactical patterns
- **Time-Based Filtering**: Historical data playback with timeline scrubbing
- **Pattern Recognition**: Automatic detection of hot zones and strategic patterns
- **Performance Optimized**: Efficient texture generation and GPU-accelerated rendering

### Visualization Modes
1. **Real-time Mode**: Live court activity monitoring
2. **Historical Mode**: Time-series playback with timeline controls
3. **Comparison Mode**: Side-by-side analysis of different time periods

### Pattern Detection
- Gaussian clustering for hot zone identification
- Confidence scoring for pattern reliability
- Strategic zone categorization (service box, baseline, net approach)
- Automated tactical insights

## Installation

The component is part of the ACE tennis facility visualization project and requires:

```bash
npm install three @react-three/fiber @react-three/drei lucide-react
```

## Basic Usage

```typescript
import HeatMapOverlay from './components/HeatMapOverlay';

function MyCourtVisualization() {
  return (
    <Canvas>
      <HeatMapOverlay
        position={[0, 0, 0]}
        courtWidth={10}
        courtLength={22}
        courtId="court_1"
        courtType="hard"
        initialMode="historical"
        initialDataType="player_position"
        showControls={true}
      />
    </Canvas>
  );
}
```

## Props API

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `position` | `[number, number, number]` | 3D position of heat map overlay |
| `courtWidth` | `number` | Width of court in meters (typically 10m) |
| `courtLength` | `number` | Length of court in meters (typically 22m) |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `courtId` | `string` | `'court_1'` | Unique identifier for data association |
| `courtType` | `'hard' \| 'clay' \| 'grass' \| 'wood'` | `'hard'` | Court surface type |
| `initialMode` | `HeatMapMode` | `'historical'` | Visualization mode on load |
| `initialDataType` | `HeatMapDataType` | `'player_position'` | Data type to display initially |
| `showControls` | `boolean` | `true` | Show interactive control panel |
| `onPatternDetected` | `(pattern: HeatMapPattern) => void` | - | Callback for pattern detection events |

## Data Types

### Heat Point Structure
```typescript
interface HeatPoint {
  x: number;           // Court x position (0-10m)
  z: number;           // Court z position (0-22m)
  intensity: number;   // Normalized intensity (0-1)
  timestamp: number;   // Unix timestamp (ms)
  type: HeatMapDataType;
  metadata?: {
    playerName?: string;
    shotType?: string;
    speed?: number;     // km/h
    spin?: number;      // rpm
  };
}
```

### Pattern Structure
```typescript
interface HeatMapPattern {
  id: string;
  name: string;
  description: string;
  zones: Array<{ x: number; z: number; radius: number }>;
  frequency: number;
  confidence: number; // 0-1
}
```

## Data Integration

### Custom Data Source
Replace the `generateMockHeatData` function with your data provider:

```typescript
// Example: Fetch from API
const loadHeatData = async (
  courtId: string,
  dataType: HeatMapDataType,
  timeRange: { start: number; end: number }
): Promise<HeatPoint[]> => {
  const response = await fetch(`/api/courts/${courtId}/heatmap`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dataType, timeRange }),
  });

  return response.json();
};
```

### Real-time Data Streaming
```typescript
// Example: WebSocket integration
useEffect(() => {
  const ws = new WebSocket('wss://api.example.com/courts/realtime');

  ws.onmessage = (event) => {
    const newPoint: HeatPoint = JSON.parse(event.data);
    setHeatData((prev) => [...prev, newPoint]);
  };

  return () => ws.close();
}, []);
```

## Advanced Usage

### Multi-Court Comparison
```typescript
<Canvas>
  <HeatMapOverlay
    position={[0, 0, 0]}
    courtWidth={10}
    courtLength={22}
    courtId="court_1"
    initialDataType="player_position"
  />
  <HeatMapOverlay
    position={[15, 0, 0]}
    courtWidth={10}
    courtLength={22}
    courtId="court_2"
    initialDataType="ball_impact"
  />
</Canvas>
```

### Pattern Detection Callback
```typescript
const handlePatternDetected = (pattern: HeatMapPattern) => {
  console.log(`Pattern detected: ${pattern.name}`);
  console.log(`Confidence: ${(pattern.confidence * 100).toFixed(1)}%`);

  // Send to analytics
  analytics.track('pattern_detected', {
    patternId: pattern.id,
    confidence: pattern.confidence,
    zones: pattern.zones.length,
  });

  // Display notification
  toast.success(`New pattern detected: ${pattern.name}`);
};

<HeatMapOverlay
  onPatternDetected={handlePatternDetected}
  // ... other props
/>
```

### Custom Time Ranges
```typescript
const [timeRange, setTimeRange] = useState({
  start: Date.now() - 24 * 60 * 60 * 1000, // Last 24 hours
  end: Date.now(),
});

// Update when user selects date range
const handleDateRangeChange = (start: Date, end: Date) => {
  setTimeRange({
    start: start.getTime(),
    end: end.getTime(),
  });
};
```

## Color Gradient System

The heat map uses a 5-color gradient for intensity visualization:

| Intensity Range | Color | Meaning |
|----------------|-------|---------|
| 0.00 - 0.25 | Blue → Cyan | Low activity |
| 0.25 - 0.50 | Cyan → Green | Moderate activity |
| 0.50 - 0.75 | Green → Yellow | High activity |
| 0.75 - 1.00 | Yellow → Red | Extreme activity |

## Performance Optimization

### Texture Resolution
The default resolution is 256x256 pixels. Adjust for performance/quality trade-off:

```typescript
// High quality (slower)
const resolution = 512;

// Balanced (default)
const resolution = 256;

// Performance (faster)
const resolution = 128;
```

### Point Filtering
For large datasets, implement client-side filtering:

```typescript
const filteredPoints = useMemo(() => {
  return heatData.filter((point) => {
    // Only show points in visible time range
    return point.timestamp >= visibleStart && point.timestamp <= visibleEnd;
  });
}, [heatData, visibleStart, visibleEnd]);
```

### Shader Optimization
The component uses custom WebGL shaders for maximum performance:
- Additive blending for heat accumulation
- Early fragment discard for empty areas
- GPU-accelerated Gaussian blur

## Pattern Recognition Algorithm

The pattern detection system uses a grid-based clustering approach:

1. **Grid Generation**: Divide court into configurable grid (default 20x20)
2. **Heat Accumulation**: Sum intensity values for each grid cell
3. **Local Maxima Detection**: Find peaks that exceed threshold
4. **Neighbor Comparison**: Validate peaks against surrounding cells
5. **Pattern Formation**: Group nearby peaks into strategic zones

### Customizing Detection Sensitivity
```typescript
// In the detectHotZones function
const gridSize = 20;           // Higher = more granular
const threshold = maxValue * 0.6; // Lower = more sensitive
```

## Integration with ThreeScene

Add heat maps to existing tennis courts:

```typescript
// In ThreeScene.tsx
import HeatMapOverlay from './HeatMapOverlay';

const TennisCourt: React.FC = ({ position, type }) => {
  const [showHeatMap, setShowHeatMap] = useState(false);

  return (
    <group position={position}>
      {/* Existing court mesh */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 22]} />
        <meshStandardMaterial color={colors[type]} />
      </mesh>

      {/* Heat map overlay */}
      {showHeatMap && (
        <HeatMapOverlay
          position={[0, 0, 0]}
          courtWidth={10}
          courtLength={22}
          courtType={type}
        />
      )}
    </group>
  );
};
```

## Accessibility

The component includes accessible controls:
- Keyboard navigation for playback controls
- ARIA labels for screen readers
- High contrast color scheme option
- Configurable opacity for visual clarity

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Requires WebGL 2.0 support

## Troubleshooting

### Heat map not rendering
- Check that `position` prop matches court position
- Verify WebGL support in browser
- Ensure heat data array is not empty

### Performance issues
- Reduce texture resolution
- Implement data pagination
- Use lower point counts for real-time mode
- Enable GPU acceleration in browser

### Pattern detection not working
- Verify data has sufficient density
- Adjust threshold sensitivity
- Check grid size configuration
- Ensure minimum data points (>100 recommended)

## Examples

See `HeatMapDemo.tsx` for a comprehensive demonstration including:
- Multiple court types
- Side-by-side comparison
- Pattern detection alerts
- Interactive controls
- Data type switching

## Future Enhancements

Planned features for future versions:
- 3D heat map visualization (volumetric data)
- Machine learning pattern prediction
- Multi-player trajectory tracking
- Video synchronization
- Export to common formats (PNG, CSV, JSON)
- Integration with tracking cameras
- Real-time coaching overlays

## License

Part of the ACE Tennis Facility Visualization Project
