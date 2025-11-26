# Robotic Grass Management System

**Imported from:** claudedocs-old/systems-detail/systems/robotic-systems/
**Component:** RoboticGrassSystem.tsx
**Status:** ✅ Production Ready

---

## Overview

The Autonomous Robotic Grass Management System provides intelligent, automated maintenance of the 6 grass tennis courts at the ACE facility. The system features autonomous mowing robots with pathfinding algorithms, battery management, and real-time visualization.

### Key Specifications
- **Total Robots:** 6 (1 per grass court)
- **Pattern:** Lawn-mower strip coverage
- **Coverage Area:** 10m × 22m per court
- **Runtime:** ~200 seconds at full charge

---

## Features

### Autonomous Operations
- **6 Independent Robots**: One dedicated robot per grass court
- **Lawn Mower Pattern**: Efficient strip-by-strip coverage pattern
- **Collision Avoidance**: Path planning prevents robot interference
- **Automatic Charging**: Low battery triggers return to docking station

### Battery Management
- **Real-time Monitoring**: Live battery percentage display
- **Automatic Charging**: Return when battery <15%
- **Fast Charging**: 5% per second charging rate
- **Smart Resume**: Returns to mowing pattern after full charge

### Visual Feedback
- **Status Indicators**: Color-coded robot status
- **Battery Lights**: Color-coded battery levels
- **Path Visualization**: Optional display of mowing patterns
- **System Dashboard**: Real-time fleet status overview

---

## Component Architecture

### Props Interface

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

| Status | Description | Color | Hex |
|--------|-------------|-------|-----|
| mowing | Active grass cutting | Green | #22c55e |
| charging | Docked, battery replenishing | Yellow | #eab308 |
| returning | Navigating to charging station | Orange | #f59e0b |
| idle | Waiting to begin operations | Gray | #94a3b8 |

### Battery Colors

| Level | Color | Hex |
|-------|-------|-----|
| >30% | Green | #22c55e |
| 10-30% | Orange | #f59e0b |
| <10% | Red | #ef4444 |

---

## Robot State Machine

```
┌─────────┐
│  IDLE   │ (startup delay)
└────┬────┘
     │
     ├─→ Start mowing after delay
     ▼
┌─────────┐
│ MOWING  │ (active grass cutting)
└────┬────┘
     │
     ├─→ Battery drains (0.5%/sec)
     ├─→ Follow waypoint path
     │
     ├─→ Battery < 15%
     ▼
┌──────────┐
│RETURNING │ (navigate to dock)
└────┬─────┘
     │
     ├─→ Navigate to charging station
     │
     ├─→ Reach dock position
     ▼
┌──────────┐
│ CHARGING │ (replenish battery)
└────┬─────┘
     │
     ├─→ Battery charges (5%/sec)
     │
     ├─→ Battery = 100%
     └─→ Return to MOWING
```

---

## Pathfinding Algorithm

### Lawn Mower Pattern

```
Court Layout (10m × 22m):
Strip Width: 1.0m | Total Strips: 10

┌─────────────────────────┐
│ 1→→→→→→→→→→→→→→→→→→→→→→│  Forward pass
│ ←←←←←←←←←←←←←←←←←←←←← 2│  Backward pass
│ 3→→→→→→→→→→→→→→→→→→→→→→│  Forward pass
│ ←←←←←←←←←←←←←←←←←←←←← 4│  Backward pass
│ ...                    │
└─────────────────────────┘

Result: Continuous path with minimal turns
Coverage: 100% of court area
```

### Path Generation Logic

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

---

## Battery Management

### Drain and Charge Rates

| State | Rate | Time for 100% |
|-------|------|---------------|
| Mowing (drain) | 0.5%/sec | ~200 seconds runtime |
| Charging | 5%/sec | 20 seconds from empty |

### Low Battery Protocol

```typescript
if (battery < 15% && status !== 'charging' && status !== 'returning') {
  status = 'returning';
  targetPosition = chargingStationPosition;
}
```

---

## Visual Design

### Robot Design
- **Body**: 0.8m × 1.2m × 0.3m green metallic chassis
- **Wheels**: 4 independent wheels with realistic tread
- **Sensor Array**: Front-mounted cylindrical sensor
- **Blade Housing**: Bottom-mounted rotating disc
- **Status Light**: Rear-mounted color-coded indicator

### System Dashboard

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

---

## Integration

### Setup in ThreeScene

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

---

## Performance

### Triangle Count

| Component | Triangles |
|-----------|-----------|
| Robot Meshes (6 robots) | ~9,000 |
| Station Meshes (6 stations) | ~3,000 |
| **Total System** | **~12,000** |

### Performance Targets
- 60 FPS with 6 active robots
- <10ms per frame for pathfinding
- <100ms state update cycles

### Scalability Testing
- 12 robots: 60 FPS
- 24 robots: 45-50 FPS
- 50 robots: 30 FPS (playable)

---

## Dependencies

- **@react-three/fiber**: 3D rendering framework
- **@react-three/drei**: Helper components (Html, Line)
- **three.js**: Core 3D mathematics and rendering

---

## Future Enhancements

- Weather-based operation scheduling
- Grass height sensors
- Multi-robot coordination for larger courts
- Predictive maintenance alerts
- Remote manual override
- Obstacle detection and avoidance
- Variable speed based on grass density
- GPS waypoint logging

---

*Last Updated: 2025-11-22*
*Component Version: 1.0.0*
