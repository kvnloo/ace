# CharacterSystem Integration Guide

## Files Created

1. **components/CharacterSystem.tsx** - Main animated character system
2. **components/LockerRoom.tsx** - Locker room component (referenced in ThreeScene)

## Integration Instructions for ThreeScene.tsx

### 1. Add Imports (after line 24)

```typescript
import { CharacterSystem } from './CharacterSystem';
import { LockerRoom } from './LockerRoom';
```

### 2. Add State (in ThreeScene component, after line 1409)

```typescript
const [charactersEnabled, setCharactersEnabled] = useState<boolean>(true);
```

### 3. Add Court Positions Memo (before return statement, around line 1425)

```typescript
// Court positions for character system
const courtPositions: Array<[number, number, number]> = useMemo(() => {
  const positions: Array<[number, number, number]> = [];
  for (let i = 0; i < 24; i++) {
    const row = Math.floor(i / 6);
    const col = i % 6;
    positions.push([-35 + col * 14, 0.1, -40 + row * 26]);
  }
  return positions;
}, []);
```

### 4. Update ControlsOverlay Component Props (around line 101)

Add these props to ControlsOverlay interface and implementation:
```typescript
charactersEnabled: boolean,
setCharactersEnabled: (enabled: boolean) => void
```

### 5. Add Character Toggle UI (in ControlsOverlay, after annotation toggles)

```typescript
{/* Character Toggle */}
<div className="bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-white/10 pointer-events-auto shadow-2xl">
  <div className="px-3 py-2 text-xs font-bold text-white/50 uppercase tracking-wider">
    Characters
  </div>
  <button
    onClick={() => setCharactersEnabled(!charactersEnabled)}
    className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
      charactersEnabled ? 'bg-tennis-yellow text-black' : 'text-white/50 hover:text-white'
    }`}
  >
    {charactersEnabled ? '✓' : '○'} {charactersEnabled ? 'Enabled' : 'Disabled'}
  </button>
</div>
```

### 6. Add CharacterSystem to Scene (in Canvas > group, after LevelThree, around line 1456)

```typescript
{/* Character System - Animated people throughout facility */}
<CharacterSystem
  playerCount={48}
  coachCount={12}
  staffCount={8}
  visitorCount={15}
  spectatorCount={200}
  courtPositions={courtPositions}
  enabled={charactersEnabled && (activeFloor === 'ALL' || activeFloor === 0)}
/>
```

### 7. Pass Characters Props to ControlsOverlay (around line 1428)

```typescript
<ControlsOverlay
  activeFloor={activeFloor}
  setActiveFloor={setActiveFloor}
  annotationMode={annotationMode}
  setAnnotationMode={setAnnotationMode}
  charactersEnabled={charactersEnabled}
  setCharactersEnabled={setCharactersEnabled}
/>
```

## Features Implemented

### Character Types
- **Players (48)** - Tennis players on courts with playing animations
- **Coaches (12)** - Positioned near courts with coaching behaviors
- **Staff (8)** - Facility staff walking through walkways
- **Visitors (15)** - General visitors exploring the facility
- **Spectators (200)** - Crowd simulation in bleacher areas

### Animations & Behaviors
- Walking with pathfinding and waypoint navigation
- Playing animations (oscillating movement on courts)
- Coaching states (standing positions near courts)
- Idle/resting states
- Smooth rotation towards movement direction
- Bobbing animation while walking

### Interaction Features
- Hover to see character info
- Click to select character
- Info panel shows: ID, type, state, position, court assignment
- Color-coded by character type
- Activity emoji indicators

### Performance Optimizations
- Instanced spectator crowds (low-poly boxes)
- Simple state machine for behaviors
- LOD considerations (can be disabled per floor)
- Efficient pathfinding with waypoints
- Shadow optimization

### Court Assignment System
- Players assigned to specific courts (2 per court)
- Courts numbered 0-23 (Hard, Clay, Grass, Wood)
- Players stay near assigned courts
- Pathfinding respects court boundaries

### Spectator Distribution
- 8 bleacher locations around facility
- ~25 spectators per section
- Realistic seating arrangement
- Row-based positioning

## Usage

Toggle characters on/off using the new "Characters" panel in the UI overlay (left side).

Characters are only visible on Ground Floor (Floor 0) or "All Floors" view for performance.

## Customization

Adjust character counts in the CharacterSystem component props:
```typescript
<CharacterSystem
  playerCount={48}      // Number of tennis players
  coachCount={12}       // Number of coaches
  staffCount={8}        // Number of staff members
  visitorCount={15}     // Number of visitors
  spectatorCount={200}  // Total spectators in bleachers
  enabled={true}        // Toggle system on/off
/>
```

## Technical Details

- Built with React Three Fiber
- Uses THREE.Vector3 for positioning
- Simple waypoint-based pathfinding
- State machine: idle → walking → playing/coaching → resting
- Frame-based animation with useFrame hook
- Responsive to user interaction
