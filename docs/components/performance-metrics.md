# PerformanceMetrics

## Overview
Comprehensive real-time performance monitoring HUD for the tennis facility. Displays live metrics across four categories: court utilization, player statistics, energy consumption, and predictive analytics. Features animated visualizations, streaming data graphs, and glassmorphism UI design.

## Location
- **Path**: `/src/components/PerformanceMetrics.tsx`
- **Category**: Debug / Monitoring / UI Overlay
- **Type**: React Functional Component

## Props
None - Self-contained component with internal state management.

## Features

### Multi-Tab Interface
Four tabbed categories with smooth transitions:
- **Courts** - Real-time court utilization and status
- **Players** - Active user statistics and demographics
- **Energy** - Power consumption and efficiency metrics
- **Analytics** - Predictive insights and maintenance alerts

### Real-Time Data Simulation
- Updates every 1 second
- Court duration tracking
- Dynamic player count
- Energy usage fluctuations
- Streaming data visualization

### Visual Components
- **Canvas Visualization** - Live activity stream with HTML5 Canvas
- **Progress Bars** - Animated utilization indicators
- **Status Indicators** - Color-coded court availability
- **Metric Cards** - Individual stat displays with trends
- **Pulse Animations** - Subtle background effects

## Court Utilization Tracking

### Court States
| Status | Color | Description |
|--------|-------|-------------|
| Active | #00ff88 (Green) | Currently in use |
| Reserved | #ffd700 (Gold) | Booked for future use |
| Available | #888 (Gray) | Ready for booking |

### Court Data Interface
```typescript
interface CourtUtilization {
  courtId: number;
  status: 'active' | 'reserved' | 'available';
  currentPlayers: number;
  duration: number;        // minutes
  nextReservation?: string; // time string
}
```

### Court Display Features
- Status indicator with glow effect
- Player count for active courts
- Duration tracking with progress bar
- Next reservation time for reserved courts
- Auto-updating duration counters

## Player Statistics

### Tracked Metrics
```typescript
interface PlayerStats {
  activeUsers: number;
  peakHour: string;
  averageSessionTime: number;
  memberVsGuest: { members: number; guests: number };
}
```

### Visualizations
- Active user count with trend indicator
- Average session time
- Peak hours display
- Member vs Guest percentage bars
- Live activity stream (canvas graph)

### Activity Stream
- 50-point scrolling graph
- Real-time data visualization
- Grid background for readability
- Glow effect on data line
- Updates every second

## Energy Metrics

### Monitored Values
```typescript
interface EnergyMetrics {
  currentUsage: number;    // kWh
  peakUsage: number;       // kWh
  efficiency: number;      // percentage
  costPerHour: number;     // USD
}
```

### Displays
- Current vs Peak usage comparison
- Efficiency percentage with trend
- Cost per hour
- Daily cost estimate
- Animated bar charts

## Predictive Analytics

### Data Interface
```typescript
interface PredictiveAnalytics {
  nextPeakTime: string;
  expectedOccupancy: number;
  maintenanceAlert?: string;
  weatherImpact?: string;
}
```

### Alert Types
- **Maintenance Alerts** (Yellow) - Equipment maintenance reminders
- **Weather Impacts** (Blue) - Weather-related utilization predictions
- **Occupancy Predictions** - Expected facility usage
- **Trend Analysis** - Weekend/evening patterns

## Usage Example

### Basic Integration
```tsx
import PerformanceMetrics from './components/PerformanceMetrics';

function App() {
  return (
    <>
      <ThreeScene />
      <PerformanceMetrics />
    </>
  );
}
```

### With Visibility Control
```tsx
function Dashboard() {
  const [showMetrics, setShowMetrics] = useState(true);

  return (
    <>
      <button onClick={() => setShowMetrics(!showMetrics)}>
        Toggle Metrics
      </button>

      {showMetrics && <PerformanceMetrics />}
    </>
  );
}
```

## Component Structure

### Main Container
- Fixed position overlay (z-index: 50)
- Pointer-events-none for transparency
- Framer Motion animations
- Responsive layout

### Tab Navigation
- 4-tab system with active state
- Smooth tab switching
- Color-coded active indicators
- Uppercase tracking for labels

### Content Panels
- Scrollable content area
- Maximum height constraints
- Custom scrollbar styling
- Staggered entry animations

### Floating Mini Stats
- Bottom-left system status
- Uptime, response time, load metrics
- Always visible during operation
- Compact design

## State Management

### Internal State
- `isVisible` - Component visibility toggle
- `activeTab` - Current tab selection
- `courtData` - Array of court utilization objects
- `playerStats` - Player statistics object
- `energyMetrics` - Energy consumption data
- `analytics` - Predictive analytics data
- `streamingData` - Canvas visualization data

### Update Intervals
- Court durations: +1 minute every second
- Player count: Random walk every 5 seconds
- Energy metrics: Random fluctuation every second
- Streaming data: New point every second

## Canvas Visualization

### Implementation
```typescript
useEffect(() => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');

  // Draw grid
  // Draw data line
  // Apply glow effect
}, [streamingData]);
```

### Visual Features
- 320x100px canvas
- 50-point data buffer
- Grid background
- Tennis-yellow (#00ff88) data line
- Glow effect overlay
- Auto-scaling Y-axis

## Styling System

### Color Palette
- **Primary**: #00ff88 (Tennis yellow-green)
- **Background**: Black with opacity
- **Borders**: White with 10-30% opacity
- **Text**: White with varying opacity

### Glass-Morphism
- Backdrop blur effects
- Semi-transparent backgrounds
- Border glows
- Layered depth

### Animations
- Framer Motion for enter/exit
- Width animations for progress bars
- Fade transitions for tab switching
- Pulse effects for active indicators

## Dependencies
- **React** - Component framework
- **framer-motion** - Animation library
- **AnimatePresence** - Exit animations

## Layout & Positioning

### Main HUD
- **Position**: Fixed top-right
- **Top offset**: 5rem (80px)
- **Right offset**: 1rem (16px)
- **Width**: 24rem (384px)
- **Z-index**: 50

### Mini Stats
- **Position**: Fixed bottom-left
- **Bottom offset**: 1rem (16px)
- **Left offset**: 1rem (16px)

## Metric Card Component

### Props
```typescript
interface MetricData {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  change?: number;
}
```

### Features
- Label with uppercase styling
- Large value display
- Optional unit suffix
- Trend arrow with color coding
- Percentage change indicator

## Performance Considerations

### Optimization Strategies
- Canvas rendering only when data changes
- Efficient state updates with useCallback
- Minimal re-renders with proper dependencies
- Throttled data updates (1 second intervals)

### Memory Management
- Limited data buffer (50 points for streaming)
- Automatic interval cleanup
- Efficient canvas redrawing
- No memory leaks from intervals

## Browser Compatibility
- Modern browsers with Canvas 2D support
- CSS backdrop-filter for blur effects
- Framer Motion animation support
- ES6+ JavaScript features

## Related Components
- [ThreeScene](/docs/components/three-scene.md) - Main 3D scene
- [DebugLogger](/docs/components/debug-logger.md) - System logging
- [BMSControlRoom](/docs/components/bms-control-room.md) - Building management

## Common Use Cases
1. **Development monitoring** - Real-time performance tracking
2. **Demo presentations** - Showcase facility capabilities
3. **System diagnostics** - Identify usage patterns
4. **Energy optimization** - Track power consumption
5. **Maintenance scheduling** - Predictive alerts

## Notes
- Designed for desktop displays (responsive layout)
- Data is simulated for demonstration purposes
- Can be extended to use real API data
- Toggle button allows hiding when not needed
- All metrics update independently
- Canvas performance tested up to 60fps
- Suitable for production with real data integration

## Future Enhancements
- Real-time API integration
- Historical data charts
- Export functionality for reports
- Customizable metric thresholds
- Alarm system for critical values
- User preference persistence
- Mobile-responsive layout
- Accessibility improvements (ARIA labels)

## Testing
```tsx
// Example test for court status
expect(screen.getByText('Court 1')).toBeInTheDocument();
expect(screen.getByText('active')).toBeInTheDocument();

// Example test for tab switching
fireEvent.click(screen.getByText('PLAYERS'));
expect(screen.getByText('Active Users')).toBeInTheDocument();
```
