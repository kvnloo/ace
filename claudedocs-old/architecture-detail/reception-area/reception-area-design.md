# ACE Facility - Reception Area Design Documentation

## Overview
The Reception Area serves as the primary entrance and first point of contact for all visitors to the ACE facility. Located on the south facade at ground floor level, this 300m² space (20m × 15m × 8m) integrates modern hospitality design with cutting-edge sports facility functionality.

## Location & Dimensions
- **Position**: South facade, Ground floor (0, 0.1, -55) in facility coordinates
- **Footprint**: 20m width × 15m depth
- **Ceiling Height**: 8m
- **Total Area**: 300m²
- **Floor Finish**: Polished metallic surface (roughness 0.1, metalness 0.8)

## Spatial Layout

### Zone Breakdown
```
┌─────────────────────────────────────────────────────────┐
│                    MAIN ENTRANCE                        │
│                  (Glass Double Doors)                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────┐                      ┌──────────────┐    │
│  │ CHECK-IN │      RECEPTION       │   WAITING    │    │
│  │ KIOSKS   │        DESK          │     AREA     │    │
│  │  (x2)    │    (Curved/12m)      │  (Benches)   │    │
│  └──────────┘                      └──────────────┘    │
│                                                         │
│  ┌──────────┐                                          │
│  │REFRESH-  │           RETAIL AREA                    │
│  │MENT BAR  │       (3 Display Cases)                  │
│  └──────────┘                                          │
│                                                         │
│  WAYFINDING          CIRCULATION          WAYFINDING   │
│   DISPLAY                                  DISPLAY     │
└─────────────────────────────────────────────────────────┘
```

## Key Components

### 1. Reception Desk
**Position**: Central, (0, 0, 2) relative to reception floor
**Dimensions**: 12.5m wide × 2.8m deep × 1.2m high

#### Design Features:
- **Curved Form**: CatmullRom curve creating organic, welcoming shape
- **Material**: Dark slate (#1e293b) with metallic finish
- **LED Accent**: Yellow brand stripe (#DFFF4F) with 1.5 emissive intensity
- **Workstations**: 3 positions with individual monitors
- **Signage**: "ACE RECEPTION" branding on front panel
- **Overhead Sign**: Floating "WELCOME TO ACE" sign at 3m height

#### Technical Specifications:
```typescript
Desk Surface: 12.5m × 2.8m × 0.15m
Material: Roughness 0.15, Metalness 0.8
LED Strip: 12m × 2.5m × 0.05m
Point Light: Color #DFFF4F, Intensity 3, Distance 8m
```

### 2. Self-Service Check-In Kiosks (×2)
**Position**: Left side, (-7, 0, -2) and (-4.5, 0, -2)
**Dimensions**: Each 1.6m × 2.4m screen, 3.8m total height

#### Features:
- **Interactive Touchscreen**: 1.6m × 2.4m diagonal display
- **Status Indicators**: Green availability light
- **Hover States**: Active highlighting on interaction
- **Base**: Cylindrical weighted base (0.4-0.5m radius)
- **Post**: 0.12m diameter support column

#### User Experience:
- Proximity detection triggers active state
- Screen displays "TAP TO CHECK IN" when active
- Color transitions: Inactive (#0f172a) → Active (#3b82f6)
- Status light: Green (#22c55e) with 2 intensity when available

### 3. Waiting Area
**Position**: Right side, (6, 0, -2)
**Capacity**: 8 seats across 2 benches

#### Seating Configuration:
- **2 Benches**: 4 seats each
- **Dimensions**: 3.2m × 0.8m per bench
- **Spacing**: 3m between benches
- **Material**: Dark frame (#1e293b) with brand yellow cushions (#DFFF4F)
- **Coffee Table**: Φ0.8m cylindrical table between benches

#### Comfort Features:
- Individual seat cushions (0.7m × 0.7m)
- Backrest: 0.8m high
- Armrests on both ends
- Central coffee table for convenience

### 4. Wayfinding Displays (×2)
**Positions**: Corner positions for maximum visibility
- Display 1: (-9, 0, 5) rotated 45°
- Display 2: (9, 0, 5) rotated -45°

#### Content Structure:
```
FACILITY DIRECTORY
─────────────────
🎾 GROUND     Tennis Arena
🏸 L1         Racquet Sports
🏓 L2         Pickleball & Heritage
🌱 L3         Vertical Farm
```

#### Technical Details:
- **Screen Size**: 3m × 4m panel
- **Display Surface**: 2.8m × 3.8m active area
- **Stand Height**: 3m (screen center at 3.5m)
- **Interactive**: Hover highlighting for each level
- **Lighting**: Backlit with blue emissive (#1e40af)

### 5. Retail Area - Pro Shop
**Position**: Back wall, (0, 0, 6)
**Configuration**: 3 display cases

#### Display Cases (×3):
- **Positions**: -5m, 0m, +5m along back wall
- **Dimensions**: 3m × 1.5m × 2m each
- **Glass Top**: 90% transmission for premium visibility
- **LED Lighting**: White shelf lighting (intensity 5)
- **Product Display**: 3 items per case at varying positions

#### Visual Features:
- Transparent glass enclosures (transmission 0.9)
- Integrated LED shelf lighting
- Dark base cabinets (#1e293b)
- "ACE PRO SHOP" floating signage at 3.5m height
- Brand yellow accent lighting

### 6. Refreshment Bar
**Position**: Left wall, (-8, 0, 0)
**Dimensions**: 4m wide × 1.2m deep

#### Amenities:
- **Coffee Machine**: Premium espresso station with green status light
- **Display Shelves**: 2 tiers for beverages and snacks
- **Bar Counter**: Metallic finish work surface
- **Menu Board**: Backlit 3.5m × 1.2m display overhead
- **Service Area**: Professional barista workspace

### 7. Main Entrance
**Position**: (0, 0, -7) - South facade connection
**Configuration**: Double glass doors

#### Entrance Features:
- **Doors**: 1.8m × 4m each, 60% transmission glass
- **Frame**: 5m × 4.2m dark metallic (#0f172a)
- **Signage**: "MAIN ENTRANCE" floating sign at 5m height
- **Lighting**: Yellow LED halo effect (intensity 15)
- **Entry Mat**: 12m × 6m carpet runner

## Lighting Design

### Ambient Ceiling Lights (×6)
**Grid Pattern**: 3 × 2 configuration
**Position Height**: 5m above floor
**Specifications**:
- Intensity: 8 per fixture
- Distance: 12m spread
- Color: Warm white (#f8fafc)
- Shadow Casting: Enabled

### Accent Lighting
1. **Reception Desk**: Yellow brand stripe (intensity 3)
2. **Entrance Sign**: Yellow halo (intensity 15)
3. **Kiosk Status**: Green availability lights (intensity 2)
4. **Retail Cases**: White shelf lights (intensity 5)
5. **Wayfinding**: Blue backlight (intensity 0.2 emissive)

## Material Specifications

### Floor
- **Type**: Polished metallic surface
- **Color**: Light gray (#f1f5f9)
- **Roughness**: 0.1 (highly polished)
- **Metalness**: 0.8 (reflective finish)
- **Environment Map Intensity**: 1.5

### Reception Desk
- **Primary**: Dark slate (#1e293b)
- **Roughness**: 0.3
- **Metalness**: 0.6
- **Accent**: Brand yellow LED (#DFFF4F)

### Glass Elements
- **Entry Doors**: 60% transmission
- **Display Cases**: 90% transmission
- **Kiosk Screens**: Active states with emissive glow

## Interactive Features

### Hover States
- **Reception Desk**: Color shift to yellow on hover
- **Kiosks**: Activation message and color change
- **Wayfinding**: Level highlighting on interaction
- **Court Labels**: Scale transformation (1.0 → 1.1)

### Dynamic Elements
- **Floating Signs**: Gentle oscillation (Float component)
  - Speed: 1.5
  - Rotation Intensity: 0.05-0.08
  - Float Intensity: 0.15-0.25

## Accessibility Features

### ADA Compliance
- **Counter Height**: 1.2m (ADA compliant for wheelchair access)
- **Clear Pathways**: Minimum 1.5m circulation width
- **Signage Height**: 3-5m range for visibility
- **Seating**: Mix of bench and accessible waiting areas
- **Lighting**: 8-point system ensuring uniform 300 lux minimum

### Wayfinding
- **High Contrast**: Yellow text on dark backgrounds
- **Large Text**: 0.25m header, 0.18m body text
- **Icons**: Universal symbols (🎾🏸🏓🌱)
- **Multiple Displays**: Redundant information at entrance points

## User Flow

### Primary Visitor Journey
```
1. ENTRANCE
   ↓
2. WAYFINDING CHECK (Display positions)
   ↓
3a. RECEPTION DESK (First-time visitors, inquiries)
   OR
3b. SELF-SERVICE KIOSK (Registered members)
   ↓
4. FACILITY ACCESS (To courts/amenities)

Alternative: RETAIL/REFRESHMENT → Browse/Purchase → Continue
```

### Staff Workflow
```
RECEPTION DESK → 3 Workstations
├─ Station 1: Primary check-in
├─ Station 2: Membership services
└─ Station 3: Guest services/inquiries
```

## Integration with Main Facility

### Connection Points
1. **South Facade Entrance**: Direct access from outdoor plaza
2. **Ground Floor Courts**: Open sightlines to tennis arena
3. **Elevator Bank**: Access to L1, L2, L3 (not shown, nearby)
4. **Service Corridors**: Staff access to pro shop inventory

### Visual Continuity
- **Brand Yellow**: Consistent use of #DFFF4F throughout
- **Dark Slate**: Matches facility interior palette
- **Glass/Metal**: Echoes building facade materials
- **Lighting**: Coordinates with facility-wide system

## Performance Optimizations

### 3D Rendering
- **LOD Strategy**: Simplified geometry for distant views
- **Instancing**: Repeated elements (lights, seats) use instanced meshes
- **Texture Resolution**: Appropriate for viewing distance
- **Shadow Casting**: Strategic assignment to key elements

### Interactive Performance
- **Hover Detection**: Efficient raycasting for interactive elements
- **State Management**: Minimal re-renders on interaction
- **Lighting**: Point lights with appropriate distance/decay

## Future Enhancements

### Potential Additions
1. **Digital Signage**: Video displays for event information
2. **Smart Lighting**: Occupancy-based intensity adjustment
3. **Queue Management**: Digital queue display system
4. **Retail Expansion**: Additional display cases or pop-up areas
5. **Biometric Check-in**: Facial recognition kiosks

### Technology Integration
- **Mobile App Sync**: Pre-check-in via app
- **Real-time Court Status**: Availability displays
- **Wayfinding AR**: Augmented reality navigation
- **Energy Monitoring**: Display of facility sustainability metrics

## Maintenance Considerations

### Daily Operations
- **Reception Desk**: 3-person minimum staffing
- **Kiosks**: Daily system checks and cleaning
- **Retail**: Stock rotation and display updates
- **Refreshment Bar**: Health code compliance checks

### Cleaning Protocols
- **Floor**: Nightly polishing to maintain finish
- **Glass Surfaces**: Multiple daily cleanings
- **Seating**: Regular sanitization
- **Lighting**: Monthly fixture cleaning

## Design Credits

### Architectural Inspiration
- **Curved Reception**: Zaha Hadid-inspired organic forms
- **Minimal Aesthetic**: Scandinavian modernism
- **Brand Integration**: Sports facility best practices
- **Lighting Design**: Contemporary hospitality standards

### Material Palette
- Primary: Dark slate (#0f172a, #1e293b, #334155)
- Accent: Brand yellow (#DFFF4F)
- Glass: High transmission for openness
- Metal: Polished finishes for premium feel

---

## Technical Implementation Notes

### Component Structure
```typescript
ReceptionArea
├─ ReceptionDesk
├─ CheckInKiosk (×2)
├─ WaitingBench (×2)
├─ WaitingTable
├─ WayfindingDisplay (×2)
├─ RetailDisplay (×3)
├─ RefreshmentBar
├─ MainEntrance
└─ AmbientLighting (×6)
```

### Props Interface
```typescript
interface ReceptionAreaProps {
  showMeasurements?: boolean;  // CAD dimension overlay
  showLabels?: boolean;        // Zone identification labels
}
```

### Coordinate System
- **Origin**: Facility center (0, 0, 0)
- **Reception Base**: (0, 0.1, -55)
- **Y-Axis**: Height above ground
- **Z-Axis**: North (-) to South (+)
- **X-Axis**: West (-) to East (+)

---

**Last Updated**: 2025-11-22
**Version**: 1.0
**Status**: Production Ready
