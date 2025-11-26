# Character System Documentation

## Overview

The CharacterSystem component provides a comprehensive animated character population system for the tennis facility visualization. It simulates realistic human activity with players, coaches, staff, visitors, and spectators throughout the facility.

## Architecture

### Character State Machine

```
┌──────┐
│ IDLE │ ◄────────────────┐
└───┬──┘                  │
    │                     │
    ▼                     │
┌─────────┐               │
│ WALKING │               │
└────┬────┘               │
     │                    │
     ├──► PLAYING         │
     │                    │
     ├──► COACHING        │
     │                    │
     ├──► WATCHING        │
     │                    │
     └──► RESTING ────────┘
```

### Component Hierarchy

```
CharacterSystem
├── Character (Individual)
│   ├── Body Mesh (Capsule/Cylinder)
│   ├── Head Mesh (Sphere)
│   ├── Equipment (Racket for players)
│   ├── Hover Label
│   └── Shadow Plane
│
└── SpectatorCrowd (Grouped)
    └── Multiple Static Meshes
```

## Character Types

### 1. Players
- **Count**: 48 (2 per court × 24 courts)
- **Color**: Blue (#3b82f6)
- **Speed**: 1.5 m/s
- **Behavior**:
  - Assigned to specific courts
  - Playing state: Oscillating movement simulating tennis
  - Walking state: Movement between court positions
  - Equipment: Tennis racket visible during play

### 2. Coaches
- **Count**: 12 (1 per 2 courts)
- **Color**: Amber (#f59e0b)
- **Speed**: 1.2 m/s
- **Behavior**:
  - Positioned near courts
  - Coaching state: Standing observation
  - Walking state: Moving between courts
  - Larger body size (0.35 radius vs 0.3)

### 3. Staff
- **Count**: 8
- **Color**: Indigo (#6366f1)
- **Speed**: 1.0 m/s
- **Behavior**:
  - Patrol walkways and facility areas
  - Continuous movement patterns
  - Cylindrical body (distinct from players)

### 4. Visitors
- **Count**: 15
- **Color**: Green (#10b981)
- **Speed**: 0.8 m/s
- **Behavior**:
  - Random exploration of walkways
  - Slower, leisurely movement
  - Longer idle periods

### 5. Spectators
- **Count**: 200 (distributed across 8 bleacher sections)
- **Color**: Purple (#8b5cf6)
- **Behavior**:
  - Static crowd simulation
  - Box geometry for performance
  - Arranged in realistic seating rows

## Activity Zones

```typescript
ACTIVITY_ZONES = {
  COURTS: {
    min: [-60, 0, -60],
    max: [60, 0, 60]
  },
  WALKWAYS: {
    min: [-70, 0, -70],
    max: [70, 0, 70]
  },
  RECEPTION: {
    min: [-15, 0, 50],
    max: [15, 0, 65]
  },
  BLEACHERS: [
    // 8 sections positioned around courts
  ]
}
```

## Pathfinding System

### Simple Waypoint Navigation

```typescript
generatePath(start, end, waypointCount) {
  // Creates intermediate waypoints
  // Adds randomness for natural movement
  // Returns array of Vector3 positions
}
```

**Example Path**:
```
Start ──► Waypoint1 ──► Waypoint2 ──► End
   ↓ (random offset)  ↓ (random offset)
```

### Movement Logic

1. **Path Generation**: When transitioning to WALKING state
2. **Waypoint Following**: Move to current waypoint
3. **Waypoint Reached**: Advance to next (distance < 0.5m)
4. **Path Complete**: Transition to next state

## Animation Details

### Walking Animation
- **Bobbing**: Vertical sine wave (0.1m amplitude, 8 Hz)
- **Rotation**: Smooth interpolation towards movement direction
- **Velocity**: Direction × speed × delta time

### Playing Animation
- **Oscillation**: Horizontal sine wave (0.3m amplitude, 2 Hz)
- **Position**: Stays within court bounds
- **Equipment**: Racket angle rotates with movement

### Idle Animation
- **Minimal Movement**: Velocity decay (×0.9 per frame)
- **Position**: Stationary with minor floating
- **State Duration**: 2-5 seconds before next action

## State Transitions

### Timing System
```typescript
stateTimer -= delta;  // Countdown each frame

if (stateTimer <= 0) {
  // Transition to new state
  // Generate new timer: base + random
}
```

### Transition Rules

| From State | To State | Condition | Duration |
|------------|----------|-----------|----------|
| IDLE       | WALKING  | Timer expires | 5-15s |
| WALKING    | PLAYING  | On court + is player | 10-30s |
| WALKING    | COACHING | Near court + is coach | 5-15s |
| WALKING    | IDLE     | Path complete | 2-7s |
| PLAYING    | IDLE     | Timer expires | 1s |
| COACHING   | IDLE     | Timer expires | 1s |

## Court Assignment

### Distribution Logic
```typescript
// Players assigned in pairs
courtIndex = floor(playerIndex / 2) % courtCount

// Position on court
side = playerIndex % 2 === 0 ? -1 : 1
position.x = courtX + side × 3
position.z = courtZ
```

### Court Layout
```
Courts 0-5:   Hard Surface  (-40m Z)
Courts 6-11:  Clay Surface  (-14m Z)
Courts 12-17: Grass Surface (+12m Z)
Courts 18-23: Wood Surface  (+38m Z)
```

## Interaction System

### Hover State
- **Trigger**: onPointerOver
- **Visual**: Emissive glow on character
- **UI**: Tooltip with emoji + type + state

### Selection State
- **Trigger**: onClick
- **Visual**: Highlighted in UI panel
- **Info Displayed**:
  - Character ID
  - Type (player/coach/staff/visitor)
  - Current state
  - Position coordinates
  - Court assignment (if applicable)

## Performance Optimization

### Instancing
- **Spectators**: Low-poly boxes (0.35×0.8×0.35)
- **Geometry**: Simple capsules and cylinders
- **Total Triangles**: ~500 per active character

### LOD Strategy
- **Enabled**: Only on ground floor (activeFloor === 0)
- **Disabled**: When viewing upper floors
- **Reason**: Characters not visible from above

### Frame Budget
```
Active Characters: 83 (48+12+8+15)
Spectators: 200 static meshes
Total: 283 characters

Per-frame updates:
- State machine: 83 characters
- Movement: ~40 walking characters (average)
- Animation: All visible characters
```

## Crowd Simulation

### Bleacher Distribution
```typescript
SpectatorCrowd({
  position: [x, y, z],
  count: 25,          // Per section
  radius: 6-8         // Section spread
})
```

### Seating Arrangement
- **Rows**: 10 spectators per row
- **Row Spacing**: 0.5m
- **Vertical Rise**: 0.4m per row
- **Angular Distribution**: π radians (semicircle)

## Usage Examples

### Basic Integration
```typescript
<CharacterSystem
  playerCount={48}
  coachCount={12}
  staffCount={8}
  visitorCount={15}
  spectatorCount={200}
  enabled={true}
/>
```

### Custom Court Positions
```typescript
const customCourts = [
  [10, 0, 20],
  [30, 0, 20],
  // ... more positions
];

<CharacterSystem
  courtPositions={customCourts}
  playerCount={customCourts.length * 2}
/>
```

### Performance Mode
```typescript
<CharacterSystem
  playerCount={24}      // Reduce by 50%
  spectatorCount={100}  // Reduce by 50%
  enabled={activeFloor === 0}  // Ground floor only
/>
```

## Customization Guide

### Changing Character Appearance

**Colors**:
```typescript
const CHARACTER_COLORS = {
  player: new THREE.Color('#YOUR_COLOR'),
  // ... etc
};
```

**Geometry**:
```typescript
// In Character component
<capsuleGeometry args={[radius, height, segments]} />
```

### Adjusting Behaviors

**Speed**:
```typescript
const SPEEDS = {
  player: 2.0,  // Faster movement
  // ... etc
};
```

**State Duration**:
```typescript
// In state transition logic
char.stateTimer = 15 + Math.random() * 30;  // 15-45s
```

### Adding New Character Type

1. **Define Type**: Add to `CharacterType` union
2. **Add Color**: In `CHARACTER_COLORS`
3. **Set Speed**: In `SPEEDS`
4. **Create Instances**: In initialization loop
5. **Add Behavior**: In state machine logic

## Debugging

### Character Info Panel
- **Trigger**: Click any character
- **Display**: Floating UI panel above scene
- **Data**: ID, type, state, position, court
- **Close**: Click "Close" button

### Console Logging
```typescript
// Add to useFrame loop
console.log({
  walking: characters.filter(c => c.state === 'walking').length,
  playing: characters.filter(c => c.state === 'playing').length,
  idle: characters.filter(c => c.state === 'idle').length
});
```

## Known Limitations

1. **No Collision Avoidance**: Characters can overlap
2. **Simple Pathfinding**: No obstacle detection
3. **Fixed Spectators**: No animated crowd
4. **Court Bounds**: Soft limits, no hard constraints
5. **No Group Behavior**: Characters act independently

## Future Enhancements

- [ ] Collision avoidance using spatial hashing
- [ ] Advanced pathfinding (A* algorithm)
- [ ] Animated spectator reactions
- [ ] Group behaviors (doubles matches)
- [ ] Ball physics and trajectory
- [ ] Character customization (clothing, equipment)
- [ ] Sound effects and ambient audio
- [ ] Day/night crowd density variation
- [ ] Event-based gathering (tournaments)
- [ ] Realistic match simulation

## Technical Reference

### Dependencies
- `@react-three/fiber` - React renderer for Three.js
- `@react-three/drei` - Helper components (Float, Html)
- `three` - 3D graphics library

### Key Files
- `components/CharacterSystem.tsx` - Main system
- `components/ThreeScene.tsx` - Integration point
- `components/LockerRoom.tsx` - Facility component

### Performance Metrics
- **FPS Target**: 60 fps
- **Triangle Budget**: ~50,000 triangles total
- **Update Frequency**: Every frame (useFrame)
- **Memory**: ~5MB character data

## API Reference

### CharacterSystemProps
```typescript
interface CharacterSystemProps {
  playerCount?: number;      // Default: 48
  coachCount?: number;       // Default: 12
  staffCount?: number;       // Default: 8
  visitorCount?: number;     // Default: 15
  spectatorCount?: number;   // Default: 200
  courtPositions?: Array<[number, number, number]>;
  enabled?: boolean;         // Default: true
}
```

### CharacterData
```typescript
interface CharacterData {
  id: string;
  type: CharacterType;
  state: ActivityState;
  position: THREE.Vector3;
  targetPosition: THREE.Vector3;
  velocity: THREE.Vector3;
  rotation: number;
  speed: number;
  courtAssignment?: number;
  pathWaypoints: THREE.Vector3[];
  currentWaypointIndex: number;
  stateTimer: number;
  color: THREE.Color;
}
```

## Credits

Built for ACE Tennis Facility visualization project. Implements realistic character simulation for architectural visualization using React Three Fiber and Three.js.
