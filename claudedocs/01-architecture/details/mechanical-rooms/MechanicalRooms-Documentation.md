# MechanicalRooms Component Documentation

## Overview

The `MechanicalRooms` component provides a comprehensive infrastructure visualization system featuring HVAC units, electrical distribution panels, water treatment facilities, backup generators, and autonomous maintenance robots with docking stations.

**Location**: Level 1 (Mezzanine), East Wing
**Position**: `[35, 0.1, -40]`
**Total Footprint**: ~80m × 60m across 4 specialized rooms

---

## Architecture

### 1. HVAC Room (20m × 15m)

**Air Handler Units (4 units)**
- Large-scale air handling systems with animated supply/exhaust fans
- Real-time airflow particle visualization (200 particles per unit)
- Dual-fan configuration for balanced ventilation
- Visible filter sections with grill patterns
- Individual control panels with status displays

**Specifications per AHU:**
- Temperature range: 18-24°C
- Pressure: 450-525 Pa
- Airflow: 3200-3650 CFM
- Power consumption: 85-97 kW

**Visual Features:**
- 6-blade rotating fans (15 RPM)
- Blue airflow particle effects
- Status LEDs (green/yellow indicators)
- Ductwork connections with isolation mounts
- Digital metrics displays

---

### 2. Electrical Distribution Room (15m × 12m)

**Main Distribution Boards (6 panels: MDB-1 to MDB-6)**
- 24 circuit breakers per panel (144 total circuits)
- Real-time voltage/current monitoring with animated gauges
- Visual circuit status (green=on, red=off)
- Exposed copper bus bars (400A capacity)
- Digital power metrics displays

**Panel Features:**
- Voltmeter with sweeping needle animation
- Ammeter with live readings
- Per-panel specifications:
  - Voltage: 415-425V (3-phase)
  - Current: 285-360A
  - Power: 120-152 kW
  - Frequency: 50.0 Hz

**Safety Elements:**
- High voltage warning labels (⚡ symbols)
- Emergency cutoff switches
- Panel door visualization (open position)

---

### 3. Water Treatment Room (18m × 15m)

**Main Storage Tank**
- 5m height × 2.5m radius cylindrical design
- Transparent material showing water level (78%)
- 5-tier level sensors with LED indicators
- Structural support legs (4 corner pillars)

**Filtration System**
- 3-stage filter array (stacked cylindrical units)
- Visible filter housings (0.5m diameter × 1.2m height)
- Real-time filter status monitoring

**Circulation System**
- Animated pump with 6-blade impeller (rotating)
- Motor assembly with status indicators
- Piping network (inlet/outlet manifolds)
- Flow rate: 450 L/min
- Operating pressure: 3.2 bar

**Control Panel:**
- Digital display with system metrics
- Water quality monitoring (Excellent status)
- Flow rate visualization
- Pressure readings

---

### 4. Generator Room (20m × 12m)

**Backup Generators (2 units: GEN-1, GEN-2)**
- 500 kVA capacity per unit (1 MVA total)
- Diesel engine with simulated vibration effects
- Exhaust system with heat shimmer particles
- Fuel tanks (1.5m diameter) with level indicators

**Generator Features:**
- Animated engine vibration (40 Hz simulation)
- Exhaust particle effects (100 particles)
- Ventilation grills on enclosure
- Status indicators:
  - Green: STANDBY mode
  - Yellow: System health
  - Red: Emergency alerts
- Control panel with digital readouts

**Specifications per Generator:**
- Power output: 500 kVA
- Fuel capacity: 1200L (87% full)
- Runtime: 12 hours at full load
- Status: STANDBY (ready for auto-start)

**Safety Features:**
- Yellow warning stripes on enclosure
- Emergency shutdown switches
- Acoustic dampening housing

---

### 5. Maintenance Robot System

**Autonomous Maintenance Robots (3 active units)**
- Spherical design (0.3m diameter) with metallic finish
- 4 rotor propulsion system for facility navigation
- 360° scanning ring with animated rotation
- Camera/sensor eye with blue illumination
- Status indicator LEDs (green/blue configuration)

**Robot Capabilities:**
- Hovering motion (0.05m amplitude)
- Equipment inspection routines
- Thermal monitoring
- Vibration analysis
- Visual defect detection
- Autonomous navigation
- Self-docking for recharging

**Docking Stations (2 units)**
- Circular platform (1.5m diameter)
- 4 charging pads with amber glow
- Central charging column with status ring
- Green status indicator (charging active)
- 3 support legs for stability

**Robot Identification:**
- MAINT-01: Primary inspector
- MAINT-02: Secondary patrol
- MAINT-03: Backup unit

---

## Performance Optimizations

### Animation Systems
1. **HVAC Fans**: Continuous rotation at 0.15 rad/s
2. **Airflow Particles**: 200 particles per AHU, recycling animation
3. **Water Pump**: Rotating impeller with 6 blades
4. **Generator Vibration**: Sine wave at 40 Hz for realistic engine feel
5. **Robot Hovering**: Sine wave motion with per-robot phase offset
6. **Gauge Needles**: Smooth interpolation based on real-time values
7. **Exhaust Particles**: Rising heat shimmer effect

### Rendering Efficiency
- **Instanced Geometries**: Circuit breakers, LED indicators, filter stages
- **LOD System**: Detailed close-up, simplified distance rendering
- **Particle Pooling**: Reuse particles for continuous effects
- **Material Reuse**: Shared materials across similar components
- **Shadow Optimization**: Selective shadow casting on large objects only

---

## Technical Specifications

### Component Count
- **Air Handler Units**: 4 (32 animated fans total)
- **Electrical Panels**: 6 (144 circuit breakers)
- **Water Tanks**: 1 main + 3 filter stages
- **Generators**: 2 (1 MVA total capacity)
- **Maintenance Robots**: 3 active + 2 docking stations
- **Status Displays**: 15+ HTML overlays
- **Animated Particles**: 900+ (airflow + exhaust)

### Lighting Design
- **HVAC Area**: 1 point light (white, 25m radius)
- **Electrical Room**: 1 point light (amber, 20m radius)
- **Water Treatment**: 1 point light (blue, 20m radius)
- **Generator Room**: 1 point light (yellow, 20m radius)
- **Local Lights**: 50+ status indicators, screen glows, charging stations

### Material Distribution
- **Metals**: #334155, #475569, #1e293b (various finishes)
- **Glass/Transparent**: Water tanks, electrical meters, windows
- **Emissive**: Status LEDs, screens, warning labels
- **Specialized**: Copper bus bars (#d97706), fuel indicators

---

## Integration Points

### Props Interface
```typescript
interface MechanicalRoomsProps {
  position: [number, number, number];  // 3D world position
  showMetrics?: boolean;                // Display performance metrics
  showLabels?: boolean;                 // Show room/equipment labels
}
```

### Default Configuration
```typescript
<MechanicalRooms
  position={[35, 0.1, -40]}
  showMetrics={true}
  showLabels={true}
/>
```

### Scene Integration (ThreeScene.tsx)
- **Placement**: Level 1 (Mezzanine), East Wing
- **Feature Marker**: 'level1_mechanical' at `[35, 25, -40]`
- **Visibility**: Shown when Level 1 or ALL floors active
- **Interaction**: Click feature marker for detailed view

---

## Real-Time Monitoring

### HVAC Metrics
Each AHU displays:
- Supply temperature (°C)
- Static pressure (Pa)
- Airflow rate (CFM)
- Power consumption estimate

### Electrical Metrics
Each MDB panel shows:
- Line voltage (V)
- Load current (A)
- Active power (kW)
- Frequency (Hz)
- Circuit status (24 per panel)

### Water System Metrics
- Tank level percentage
- Flow rate (L/min)
- System pressure (bar)
- Water quality status

### Generator Metrics
- Operational status
- Power capacity (kVA)
- Fuel level percentage
- Estimated runtime

### Robot Status
- Unit identification
- Current position
- Mission status
- Battery/charging level

---

## User Interactions

### Camera Controls
- **Orbit**: Click and drag to rotate view
- **Zoom**: Scroll wheel to zoom in/out on equipment
- **Pan**: Right-click drag to move viewpoint

### Floor Navigation
- Select "L1: Racquet" from floor selector
- Click "L1: Mechanical Systems" feature marker
- Camera animates to focused view of mechanical rooms

### Annotation Modes
- **Clean**: No overlays (pure 3D view)
- **Labels**: Room labels and equipment IDs visible
- **Measurements**: Equipment dimensions and spacing shown

---

## Maintenance & Status Indicators

### Color Coding System
- **Green (#22c55e)**: Normal operation, charging active
- **Yellow (#eab308)**: Warning, monitoring required
- **Red (#ef4444)**: Alert, immediate attention needed
- **Blue (#3b82f6)**: System active, data flowing
- **Amber (#fbbf24)**: Power system, backup status
- **Cyan (#0ea5e9)**: Monitoring, sensors active

### LED Status Patterns
- **Solid**: Stable operation
- **Pulsing**: Active charging/processing
- **Animated**: Data transmission/scanning
- **Off/Gray**: Inactive/disabled

---

## Future Enhancements

### Planned Features
1. **Predictive Maintenance**: AI-driven failure prediction
2. **Energy Dashboard**: Real-time power consumption visualization
3. **Fault Diagnostics**: Interactive troubleshooting system
4. **Remote Control**: Equipment start/stop simulation
5. **Historical Data**: Performance trends and analytics
6. **VR Integration**: Immersive maintenance training
7. **Digital Twin**: Live synchronization with real equipment

### Scalability
- **Modular Design**: Add/remove rooms independently
- **Equipment Library**: Expand with chillers, boilers, compressors
- **Robot Fleet**: Scale from 3 to 10+ units
- **Monitoring Integration**: Connect to real BMS systems
- **Multi-Building**: Replicate for campus-wide facilities

---

## Performance Benchmarks

### Target Metrics
- **Frame Rate**: 60 FPS (maintain with all animations)
- **Draw Calls**: <200 (with instancing)
- **Memory**: <100MB additional allocation
- **Load Time**: <2 seconds for initial render
- **Interaction**: <16ms response time

### Optimization Strategies
1. Frustum culling for off-screen equipment
2. Particle system pooling and recycling
3. Texture atlas for status indicators
4. Simplified collision meshes
5. Progressive enhancement for detail levels

---

## Accessibility Features

### Visual Clarity
- High-contrast status indicators
- Large, readable text on displays
- Color-blind friendly palette options
- Clear spatial organization

### Information Architecture
- Logical room grouping by function
- Consistent labeling scheme
- Hierarchical information display
- Progressive disclosure of details

---

## Developer Notes

### Component Structure
```
MechanicalRooms/
├── AirHandlerUnit (HVAC)
│   ├── Fan assembly (animated)
│   ├── Filter section
│   ├── Airflow particles
│   └── Control panel
├── ElectricalPanel
│   ├── Circuit breakers (24x)
│   ├── Bus bars
│   ├── Meters (volt/amp)
│   └── Status display
├── WaterTreatmentSystem
│   ├── Storage tank
│   ├── Filtration units (3x)
│   ├── Circulation pump
│   └── Piping network
├── BackupGenerator
│   ├── Engine block
│   ├── Alternator
│   ├── Fuel tank
│   ├── Exhaust system
│   └── Control panel
├── MaintenanceRobot
│   ├── Spherical body
│   ├── Scanner ring
│   ├── Propulsion rotors (4x)
│   └── Sensor array
└── RobotDockingStation
    ├── Charging platform
    ├── Power transfer pads (4x)
    └── Status indicators
```

### Animation Hooks
- `useFrame`: Primary animation loop for all moving parts
- `useRef`: Direct mesh access for performance-critical animations
- `useMemo`: Cached particle positions and equipment metrics

### State Management
- Equipment status derived from props and component IDs
- Deterministic pseudo-random values for realistic variation
- No global state dependencies for easy reusability

---

## Conclusion

The MechanicalRooms component provides a production-ready, visually engaging representation of critical facility infrastructure. With comprehensive monitoring capabilities, animated equipment, and autonomous maintenance robots, it offers both aesthetic appeal and functional insight into building operations.

**Last Updated**: 2025-11-22
**Component Version**: 1.0.0
**Three.js Version**: ^0.158.0
**React Three Fiber**: ^8.15.0
