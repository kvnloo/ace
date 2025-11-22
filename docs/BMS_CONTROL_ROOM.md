# BMS Control Room - Level 1 Implementation

## Overview
Complete Building Management System (BMS) control room implementation with operational control center, server infrastructure, and monitoring systems for the ACE facility.

## Location
- **Floor**: Level 1 (Racquet Mezzanine)
- **Position**: Northwest corner (-45, 0.1, 40) in facility coordinates
- **Dimensions**: 15m × 10m (150m²)
- **Height**: 5m ceiling clearance

## Architecture

### Room Structure
- **Floor**: Raised technical floor with access panels
  - Dark slate base (#1e293b)
  - 6 raised access panels (2.4m × 2.4m) for cable management
  - Professional data center aesthetic

- **Walls**:
  - Back wall: Solid (#0f172a) with integrated display systems
  - Side walls: Solid (#0f172a) for equipment mounting
  - Front wall: Glass partition (transmission 0.7, opacity 0.3)
  - Professional command center appearance

### Main Control Wall

#### Central Display - Facility Overview
- **Size**: 6m × 3.5m
- **Color**: Emerald green (#059669)
- **Purpose**: Real-time facility status dashboard
- **Features**:
  - Emissive display (intensity 0.6)
  - Wire-frame data visualization overlay
  - Ambient glow lighting (5m radius)

#### Left Side Screen - Environmental Data
- **Size**: 3m × 2.5m
- **Color**: Sky blue (#0ea5e9)
- **Purpose**: HVAC, temperature, air quality monitoring
- **Integration**: Climate control systems

#### Right Side Screen - Security Feeds
- **Size**: 3m × 2.5m
- **Color**: Purple (#8b5cf6)
- **Purpose**: Security camera feeds, access control
- **Integration**: Facility security infrastructure

#### Status Bar Displays (Bottom Row)
Three horizontal status displays (2.5m × 0.8m each):
1. **Left** - Warnings/Alerts (Yellow #eab308)
2. **Center** - System Health (Green #22c55e)
3. **Right** - Critical Alarms (Red #ef4444)

### Operator Workstations

#### Configuration
- **Total Stations**: 4 workstations
- **Layout**: 2 rows of 2 stations
- **Spacing**: 6m between stations (left/right), 2.5m (front/back)

#### Each Workstation Includes:
1. **Desk**: 2.5m × 1.2m professional control desk (#334155)
2. **Monitor Array**: 3 screens per station
   - Center: Primary control (Blue #3b82f6)
   - Left/Right: Secondary monitors (Cyan #0ea5e9)
   - Emissive screens with ambient glow
3. **Peripherals**:
   - Keyboard (0.45m × 0.15m)
   - Mouse
   - Ergonomic adjustable chair

#### Operator Positions:
- **Station 1** (-3, 0, 1): Front left operator
- **Station 2** (3, 0, 1): Front right operator
- **Station 3** (-3, 0, -1.5): Back left operator
- **Station 4** (3, 0, -1.5): Back right operator

### Server Room Section

#### Location
- Right side of control room (5.5m offset)
- Partitioned with translucent divider
- Separate climate zone

#### Infrastructure
1. **Server Racks** (2 racks):
   - **Position 1**: (2.5, 2, 1.5)
   - **Position 2**: (2.5, 2, -1.5)
   - Each rack: 1m × 4m × 1.2m
   - 8 server units per rack (stacked 0.45m apart)

2. **Server Unit Details**:
   - Slot dimensions: 0.9m × 0.4m × 1.1m
   - Status LEDs: Green (operational), Blue (processing), Yellow (warning)
   - LED pattern cycles through rack (mod 3)
   - Front panel ventilation grills

3. **Support Systems**:
   - Cooling unit (1m × 1.6m × 0.5m)
   - Warning light (red, 0.5 intensity)
   - Blue cooling fan glow
   - Access door (2.4m × 1m)

#### Server Room Partition
- Semi-transparent divider (opacity 0.8)
- 0.1m thick, 5m height
- 6m length
- Professional data center separation

### Lighting System

#### Overhead Lighting
- **Count**: 6 recessed ceiling fixtures
- **Pattern**: 3×2 grid
- **Specifications**:
  - Position height: 4.8m
  - Intensity: 1.5
  - Distance: 8m spread
  - Color: Cool white (#f1f5f9)
  - Decay: 2

#### Screen Ambient Lighting
- Each display generates colored point lights
- Intensity varies by display size (0.3-1.0)
- Creates professional NOC (Network Operations Center) atmosphere
- Colors match display purpose

### Safety & Infrastructure

#### Cable Management
- Overhead cable trays (12m × 0.1m × 0.3m)
- Position: 4.5m height
- Metallic finish (#334155)
- Professional data center standard

#### Emergency Systems
1. **Exit Sign**:
   - Position: Near front wall (7m high, 4.2m up)
   - Size: 0.6m × 0.3m
   - Color: Bright green (#22c55e)
   - Emissive intensity: 1.0
   - Ambient glow: 3m radius

2. **Security Camera**:
   - Position: Corner (7m, 4.5m, -4m)
   - Rotation: Angled toward workstations
   - Housing: 0.15m × 0.15m × 0.25m
   - Lens: 0.04m cylinder extending 0.1m
   - Color: Dark slate (#1e293b)

## Technical Specifications

### Dimensions with CAD Overlay
When measurement mode is active, displays:
- **Width**: "15m BMS WIDTH" dimension line
- **Depth**: "10m DEPTH" dimension line
- CAD-style dimension annotations with yellow accent (#DFFF4F)

### Material Properties
- **Metallic surfaces**: 0.5-0.8 metalness
- **Screen bezels**: High metalness (0.8), low roughness (0.2)
- **Glass partition**: Transmission 0.7, thickness 0.5
- **Floor**: Low metalness (0.1), moderate roughness (0.3)

### Performance Optimization
- Efficient geometry (boxes, planes, cylinders)
- Point lights strategically placed (not per-object)
- Shared materials where possible
- LOD-friendly architecture

## Integration

### Component Structure
```
BMSControlRoom (main container)
├── Floor & Raised Panels
├── Walls (back, left, right, front glass)
├── WallDisplayScreen × 6 (main control displays)
├── OperatorWorkstation × 4
│   ├── Desk
│   ├── Monitor Array (3 screens)
│   ├── Keyboard & Mouse
│   └── Office Chair
├── Server Room Section
│   ├── Partition
│   ├── ServerRack × 2
│   │   └── Server Units × 8 each
│   ├── Cooling Unit
│   └── Access Door
├── Lighting System
│   └── Ceiling Lights × 6
├── Cable Management
├── Emergency Exit Sign
└── Security Camera
```

### File Organization
- **Main Scene**: `components/ThreeScene.tsx`
- **BMS Components**: `components/BMSControlRoom.tsx`
- **Exports**:
  - `BMSControlRoom` (primary component)
  - `OperatorWorkstation` (reusable)
  - `WallDisplayScreen` (reusable)
  - `ServerRack` (reusable)

## Usage

### Placement in Scene
```tsx
<BMSControlRoom position={[-45, 0.1, 40]} />
```

### Standalone Workstation
```tsx
<OperatorWorkstation position={[x, y, z]} rotation={angleInRadians} />
```

### Custom Display Screen
```tsx
<WallDisplayScreen
  position={[x, y, z]}
  width={6}
  height={3.5}
  color="#059669"
/>
```

### Server Rack
```tsx
<ServerRack position={[x, y, z]} />
```

## Visual Characteristics

### Color Scheme
- **Base**: Dark slate (#1e293b, #0f172a)
- **Displays**: Green (#059669), Blue (#0ea5e9), Purple (#8b5cf6)
- **Status**: Green (#22c55e), Yellow (#eab308), Red (#ef4444)
- **Accents**: Light slate (#334155, #475569)

### Lighting Atmosphere
- Cool professional NOC environment
- Colored ambient glows from displays
- Bright overhead task lighting
- Warning lights in server area
- Emergency exit illumination

### Visibility Modes
- **Clean View**: Full control room visible
- **Labels Mode**: Component identification
- **Measurements Mode**: CAD dimensions displayed

## Operational Context

### Purpose
The BMS Control Room serves as the central command center for:
- Facility operations monitoring
- Environmental control (HVAC, lighting)
- Security surveillance
- Court scheduling systems
- Energy management
- Equipment status tracking
- Emergency response coordination

### Staffing
Designed for 4 concurrent operators:
- **2 Front stations**: Primary facility monitoring
- **2 Back stations**: Secondary systems, security

### Integration Points
- Level 1 racquet sports facilities
- Building-wide environmental systems
- Security infrastructure
- Court booking systems
- Vertical farm monitoring (Level 3)
- Energy/solar panel management

## Future Enhancements

### Potential Additions
1. Animated screen content (facility maps, data flows)
2. Interactive workstation detail views
3. Server rack activity indicators (pulsing LEDs)
4. Cooling system particle effects
5. Real-time facility data integration
6. Sound design (server hum, HVAC ambient)
7. Personnel/avatar operator figures
8. Additional monitoring equipment

### Scalability
Components designed for reuse:
- Workstations can be placed in other control areas
- Display screens suitable for conference rooms
- Server racks for IT infrastructure visualization
- Camera system expandable to building-wide

## Technical Notes

### Performance
- Triangle budget: ~2,000-3,000 triangles total
- Point lights: 20 total (controlled intensity)
- Materials: Optimized shared instances
- Shadows: Enabled on key geometry only

### Accessibility
- Glass partition allows visual oversight
- Emergency exit clearly marked
- Wide aisles between workstations (3m+)
- Raised floor access for maintenance
- Separate server room for safety

### Compliance
- Professional data center standards
- Emergency egress requirements
- Equipment cooling/ventilation
- Security camera coverage
- Status light visibility (ISO colors)

## Related Components
- `ReceptionArea.tsx` - Front desk systems
- `ParkingLot.tsx` - External monitoring
- `ThreeScene.tsx` - Main facility integration
- CAD dimension system for measurements

## Version
- **Implemented**: 2025-11-22
- **Last Updated**: 2025-11-22
- **Status**: Production ready
- **Tested**: Build successful, TypeScript clean
