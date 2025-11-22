# Autonomous Transport Pods System

## Overview

The Autonomous Transport Pods system provides intelligent, self-driving transportation throughout the ACE facility. The system features 8 autonomous pods that navigate between 7 stations, connecting all major areas of the facility from ground level to the vertical farm.

## Features

### 1. Self-Driving Pods
- **8 Autonomous Vehicles**: Sleek capsule-design pods with glass canopies
- **4 Passenger Capacity**: Each pod can carry up to 4 passengers
- **Real-time Status Indicators**:
  - Idle: Gray (waiting at station)
  - Boarding: Yellow (loading passengers)
  - Traveling: Green (in transit)
  - Arriving: Blue (approaching destination)
- **Hover Technology**: Visual thruster effects and energy fields when moving
- **Smart Navigation**: Smooth path following with automatic rotation to face direction of travel

### 2. Station Network
Seven interconnected stations provide comprehensive facility coverage:

#### Ground Level Stations
- **Main Entrance** (0, 0.5, 65): Primary arrival point, connects to ground courts, parking, and L1
- **Parking Lot** (-100, 0.5, -20): Vehicle transition hub
- **Ground Courts** (40, 0.5, 0): Tennis arena access
- **Outdoor Plaza** (90, 0.5, 50): Public recreation area

#### Elevated Stations
- **L1 Racquet Sports Hub** (0, 20.5, 0): Badminton, squash, table tennis access
- **L2 Social Zone Hub** (0, 40.5, 0): Pickleball courts and viewing galleries
- **L3 Vertical Farm Hub** (0, 60.5, 0): Autonomous farming sector access

### 3. Route Visualization
- **Dynamic Path Display**: Routes shown as colored lines
  - Active routes (pods traveling): Bright yellow, solid lines
  - Inactive routes: Gray, dashed lines
- **Smooth Curves**: Catmull-Rom spline interpolation for natural movement
- **Vertical Arcs**: Elevated paths for multi-level transit
- **Direction Indicators**: Cone-shaped markers at stations showing available routes

### 4. Interactive Booking Kiosks
- **Click Stations**: Tap any station platform to open booking interface
- **Route Selection**: Choose destination from available routes
- **Real-time Availability**: Shows active pod count at each station
- **Automatic Dispatch**: Pods depart 2 seconds after boarding begins

### 5. Real-Time Tracking
- **Pod Selection**: Click any pod to open detailed tracking panel
- **Live Status Display**:
  - Pod ID and current status
  - Passenger count (current/capacity)
  - Current station location
  - Destination and progress
- **Progress Bar**: Visual representation of journey completion (0-100%)
- **Position Updates**: Frame-by-frame position interpolation

## Technical Implementation

### Path Generation
```typescript
const generatePath = (from: Vector3, to: Vector3): Vector3[] => {
  // Creates smooth curve with 50 waypoints
  // Adds vertical arc for elevation changes
  // Uses Catmull-Rom curve for natural movement
}
```

### Pod State Machine
```
IDLE → BOARDING (2s delay) → TRAVELING (progress 0→1) → ARRIVING → IDLE
```

### Animation System
- **Frame-based Updates**: Uses `useFrame` hook for smooth 60fps animation
- **Progress Tracking**: Linear interpolation along waypoint path
- **Dynamic Rotation**: Automatic heading calculation based on movement direction
- **Speed Control**: `delta * 0.08` provides optimal travel speed

### Station Configuration
Each station includes:
- Circular platform (6m radius) with LED edge lighting
- Support columns with metallic finish
- Floating station name label
- Direction indicators for connected routes
- Interactive booking kiosk interface

### Pod Vehicle Design
- **Body**: Capsule geometry (0.8m radius, 2.5m length)
- **Canopy**: Physical material with 90% transmission for glass effect
- **Status Light**: Dynamic color based on operational state
- **Thrusters**: Torus geometry with emissive glow when active
- **Energy Field**: Wireframe sphere during travel

## Usage

### Integration
```tsx
import TransportPods from './TransportPods';

<TransportPods
  position={[0, 0, 0]}        // Optional offset position
  showRoutes={true}            // Toggle route visualization
/>
```

### User Interactions

#### Booking a Pod
1. Click any station platform
2. Kiosk interface appears with available destinations
3. Select desired destination
4. Pod enters boarding state (yellow indicator)
5. Pod departs after 2-second boarding delay
6. Track progress via status indicators

#### Tracking a Pod
1. Click any moving or stationary pod
2. Tracking panel appears with:
   - Pod identification
   - Current status and location
   - Passenger count
   - Journey progress (if traveling)
3. Click "Close Tracking" to dismiss

### Visibility Control
Route visualization toggles with annotation mode:
- `LABELS` mode: Routes visible (integrated with scene controls)
- `NONE` or `MEASUREMENTS` mode: Routes hidden

## Performance Considerations

### Optimization Strategies
- **Efficient Path Sampling**: 50 waypoints per route (balance between smoothness and performance)
- **Conditional Rendering**: Routes only render when visible
- **State Batching**: All pod updates processed in single `useFrame` call
- **Minimal Geometry**: Low-poly capsule and torus primitives
- **Shared Materials**: Reused material definitions across pods

### Resource Usage
- **8 Pods**: ~1,200 triangles total (150 per pod)
- **7 Stations**: ~2,800 triangles total (400 per station)
- **Routes**: Dynamic line rendering (minimal overhead)
- **Memory**: Cached path calculations in Map structure

## Accessibility Features

### Visual Indicators
- **High-contrast Colors**: Yellow (primary), Green (active), Blue (destination)
- **Multiple Status Channels**: Color + text + position
- **Large Interactive Targets**: 6m station platforms, 2.5m pod bodies

### Information Hierarchy
- **Station Names**: Floating text labels at 3m height
- **Pod Status**: Hover labels follow vehicle position
- **Tracking Panel**: Clear hierarchical information display

## Future Enhancements

### Potential Additions
- **Queue System**: Multiple passengers waiting at stations
- **Priority Routing**: Express routes for premium users
- **Energy Management**: Battery levels and charging stations
- **Maintenance Mode**: Scheduled service and diagnostics
- **Traffic Optimization**: AI-driven route efficiency
- **Emergency Override**: Manual control for facility staff
- **Weather Adaptation**: Enclosed vs. open-air routing
- **Accessibility Pods**: Specialized vehicles for wheelchair access

### Integration Opportunities
- **BMS Integration**: Link to building management system controls
- **Booking App**: Mobile reservation system
- **Analytics Dashboard**: Usage patterns and optimization metrics
- **Safety Systems**: Collision avoidance and emergency stops

## Architecture Decisions

### Why Catmull-Rom Curves?
- Natural-looking paths without manual waypoint definition
- Smooth tangent transitions at endpoints
- Computationally efficient for real-time updates

### Why 50 Waypoints Per Route?
- Balance between path smoothness and memory usage
- Sufficient granularity for accurate position tracking
- Fast enough for 60fps interpolation

### Why Station-Based Routing?
- Simplified navigation logic (node graph vs. free movement)
- Predictable user experience
- Easy expansion with new stations
- Clear visual communication of available routes

### Why 8 Pods?
- Sufficient coverage for 7 stations (1+ per station average)
- Manageable visual density in overview mode
- Performance headroom for complex scenes
- Realistic capacity for facility size

## File Structure
```
components/
  TransportPods.tsx          # Main component with all logic
  ThreeScene.tsx             # Integration point (line ~1456)

docs/
  TRANSPORT_PODS.md          # This documentation
```

## Code Statistics
- **Total Lines**: ~750
- **Components**: 4 main (PodVehicle, PodStation, RoutePath, TransportPods)
- **State Management**: useState for pods, routes, selection
- **Animation**: useFrame for movement updates
- **Interactions**: 3 types (station booking, pod tracking, route selection)

## Testing Checklist
- [ ] All 7 stations render correctly
- [ ] All 8 pods initialize at appropriate stations
- [ ] Clicking station opens booking kiosk
- [ ] Selecting route dispatches available pod
- [ ] Pod travels smoothly along generated path
- [ ] Status indicators update correctly (idle → boarding → traveling → arriving)
- [ ] Clicking pod opens tracking panel
- [ ] Progress bar accurately reflects journey completion
- [ ] Pod rotation faces movement direction
- [ ] Routes toggle visibility with annotation mode
- [ ] Multiple pods can travel simultaneously
- [ ] Pods return to idle state after arrival
- [ ] Passenger counts update realistically
- [ ] No z-fighting or visual artifacts
- [ ] Acceptable performance with all pods active

## Credits
- **Design**: Inspired by autonomous transit systems and futuristic transportation
- **Implementation**: React Three Fiber, Three.js
- **Integration**: ACE Facility 3D Visualization System
