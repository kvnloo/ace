# Robotic Grass Management System

## Overview

The Autonomous Robotic Grass Management System provides intelligent, automated maintenance of the 6 grass tennis courts at the ACE facility. The system features autonomous mowing robots with pathfinding algorithms, battery management, and real-time visualization.

## Features

### Autonomous Operations
- **6 Independent Robots**: One dedicated robot per grass court
- **Lawn Mower Pattern**: Efficient strip-by-strip coverage pattern
- **Collision Avoidance**: Path planning prevents robot interference
- **Automatic Charging**: Low battery triggers return to docking station

### Battery Management
- **Real-time Monitoring**: Live battery percentage display
- **Automatic Charging**: Robots autonomously return when battery drops below 15%
- **Fast Charging**: 5% per second charging rate
- **Smart Resume**: Returns to mowing pattern after full charge

### Visual Feedback
- **Status Indicators**: Color-coded robot status (mowing/charging/returning/idle)
- **Battery Lights**: Color-coded battery indicators (green/yellow/red)
- **Path Visualization**: Optional display of mowing patterns
- **System Dashboard**: Real-time fleet status overview

### Charging Stations
- **Strategic Placement**: One docking station per grass court
- **Visual Status**: Occupied/available indicator lights
- **Automated Docking**: Precise positioning system
- **Ground Connection**: Visual charging pad indicators

## Component Structure

### RoboticGrassSystem
Main system component that orchestrates all robots and charging stations.

**Props:**
```typescript
interface RoboticGrassSystemProps {
  position?: [number, number, number];  // System base position
  robotCount?: number;                  // Number of robots (default: 6)
  showPaths?: boolean;                  // Display mowing paths (default: false)
  showStatus?: boolean;                 // Show status HUD (default: true)
}
```

### Robot States

```typescript
type RobotStatus = 'mowing' | 'charging' | 'returning' | 'idle';
```

- **mowing**: Active grass cutting with battery drain
- **charging**: Docked at station, battery replenishing
- **returning**: Low battery, navigating to charging station
- **idle**: Waiting to begin operations

### Robot Properties

```typescript
interface Robot {
  id: string;                    // Unique identifier (MOWER-01, etc.)
  position: THREE.Vector3;       // Current 3D position
  targetPosition: THREE.Vector3; // Next waypoint
  battery: number;               // 0-100 percentage
  status: RobotStatus;           // Current operational state
  speed: number;                 // Movement speed (0.8-1.2)
  path: THREE.Vector3[];         // Full mowing pattern
  currentPathIndex: number;      // Current waypoint index
  assignedCourt: number;         // Dedicated court (1-6)
}
```

## Pathfinding Algorithm

### Lawn Mower Pattern
The system uses an efficient strip-by-strip pattern:

1. **Strip Width**: 1.0m per pass
2. **Pattern**: Alternating forward/backward passes
3. **Coverage**: Complete court coverage (10m × 22m)
4. **Efficiency**: Minimizes turns and overlaps

```
Court Layout (10m × 22m):
┌─────────────────────────┐
│ Strip 1 ↓              │
│ Strip 2 ↑              │
│ Strip 3 ↓              │
│ Strip 4 ↑              │
│ ...                    │
└─────────────────────────┘
```

### Path Generation
```typescript
const stripWidth = 1.0;
const strips = Math.floor(courtWidth / stripWidth);

for (let strip = 0; strip < strips; strip++) {
  const x = courtCenterX - courtWidth / 2 + strip * stripWidth;

  if (strip % 2 === 0) {
    // Mow forward
    path.push(new Vector3(x, y, z_start));
    path.push(new Vector3(x, y, z_end));
  } else {
    // Mow backward
    path.push(new Vector3(x, y, z_end));
    path.push(new Vector3(x, y, z_start));
  }
}
```

## Battery Management System

### Drain Rate
- **Active Mowing**: 0.5% per second
- **Runtime**: ~200 seconds at full charge
- **Idle/Charging**: No drain

### Charging Rate
- **Charge Speed**: 5% per second
- **Full Charge Time**: 20 seconds from empty
- **Auto-Resume**: Returns to mowing at 100%

### Low Battery Protocol
```typescript
if (battery < 15% && status !== 'charging' && status !== 'returning') {
  status = 'returning';
  targetPosition = chargingStationPosition;
}
```

## Visual Design

### Robot Design
- **Body**: 0.8m × 1.2m × 0.3m green metallic chassis
- **Wheels**: 4 independent wheels with realistic tread
- **Sensor Array**: Front-mounted cylindrical sensor
- **Blade Housing**: Bottom-mounted rotating disc
- **Status Light**: Rear-mounted color-coded indicator

### Color Coding
| Status | Color | Hex |
|--------|-------|-----|
| Mowing | Green | #22c55e |
| Charging | Yellow | #eab308 |
| Returning | Orange | #f59e0b |
| Idle | Gray | #94a3b8 |

### Battery Colors
| Level | Color | Hex |
|-------|-------|-----|
| >30% | Green | #22c55e |
| 10-30% | Orange | #f59e0b |
| <10% | Red | #ef4444 |

## Integration with ThreeScene

### Setup
```typescript
import RoboticGrassSystem from './RoboticGrassSystem';

// In GroundFloor component
const grassCourtRow = 2;
const roboticSystemPosition: [number, number, number] = [0, 0, -40 + grassCourtRow * 26];

<RoboticGrassSystem
  position={roboticSystemPosition}
  robotCount={6}
  showPaths={showMeasurements}
  showStatus={showLabels}
/>
```

### UI Controls
- **Labels Mode**: Shows robot status HUD and system dashboard
- **Measurements Mode**: Displays mowing path visualizations
- **Clean Mode**: Hides all overlays for clear viewing

## Performance Optimization

### Instancing
- Each robot: ~1,500 triangles
- 6 robots total: ~9,000 triangles
- Stations: ~500 triangles each
- Total system: ~12,000 triangles

### Animation
- Frame-based movement using `useFrame`
- Smooth interpolation for position updates
- Rotation aligned with movement direction
- Blade rotation animation during mowing

### State Management
- React state for robot positions
- Ref for time tracking
- Memoized path calculations
- Efficient distance checks

## System Status Dashboard

Real-time fleet monitoring display:

```
┌─────────────────────────────────┐
│ 🟢 GRASS MANAGEMENT SYSTEM      │
├─────────────────────────────────┤
│ Active Robots:    6/6           │
│ Charging:         0             │
│ Avg Battery:      87%           │
│ System Status:    OPERATIONAL   │
└─────────────────────────────────┘
```

## Future Enhancements

### Potential Features
- Weather-based operation scheduling
- Grass height sensors
- Multi-robot coordination for larger courts
- Predictive maintenance alerts
- Remote manual override
- Obstacle detection and avoidance
- Variable speed based on grass density
- GPS waypoint logging

### Scalability
- System designed for easy expansion to 10+ robots
- Modular charging station design
- Configurable patrol patterns
- Dynamic court assignment

## Technical Notes

### Dependencies
- **@react-three/fiber**: 3D rendering framework
- **@react-three/drei**: Helper components (Html, Line)
- **three.js**: Core 3D mathematics and rendering

### Browser Support
- Modern browsers with WebGL 2.0 support
- Recommended: Chrome 90+, Firefox 88+, Safari 15+

### Performance Targets
- 60 FPS with 6 active robots
- <10ms per frame for pathfinding
- <100ms state update cycles

## Maintenance

### Code Location
```
/components/RoboticGrassSystem.tsx  - Main component
/components/ThreeScene.tsx          - Integration
/docs/ROBOTIC_GRASS_SYSTEM.md       - This documentation
```

### Testing
- Visual inspection of robot movement
- Battery drain/charge verification
- Path coverage validation
- Status indicator accuracy
- Docking precision

## Credits

**Design Philosophy**: Autonomous facility management with visual transparency
**Architecture**: Modular, scalable robotic fleet system
**UX Focus**: Real-time status feedback and operational visibility
