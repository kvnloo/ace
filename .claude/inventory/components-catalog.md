# ACE Components Catalog

**Project**: LawnTech Dynamics - Athletic Complex Environment
**Total Components**: 44
**Total Lines of Code**: 17,461
**Generated**: 2025-11-22
**Purpose**: Complete inventory of all React components in `/src/components`

---

## 📊 Component Statistics

| Category | Count | Lines |
|----------|-------|-------|
| 3D Scenes & Core | 8 | 2,669 |
| Facility Spaces | 11 | 5,936 |
| Systems & Effects | 10 | 4,461 |
| UI & Interface | 8 | 1,293 |
| Performance & Debug | 3 | 1,390 |
| Examples & Demos | 4 | 682 |
| **Total** | **44** | **17,461** |

---

## 🎯 Category 1: 3D Scenes & Core Infrastructure

### ThreeScene.tsx (1,545 lines) ⭐ PRIMARY
**Purpose**: Main 3D facility visualization scene
**Key Features**:
- Multi-level building rendering (Ground + 3 floors)
- 24 tennis courts (Hard, Clay, Grass, Wood)
- Camera rig with floor-level navigation
- Annotation modes (Labels, Measurements)
- Orchestrates all facility components
- OrbitControls integration
- Feature navigation system

**Architecture**:
- Uses Canvas from @react-three/fiber
- Floor-based component organization
- Dynamic camera positioning
- Court texture management
- Component imports: Grass, ClayCourtEffect, ReceptionArea, ParkingLot, BMSControlRoom, RoboticGrassSystem, TransportPods, HydroponicsSystem, MechanicalRooms, LockerRoom

**Court Layout**:
```
Ground Level:
- 6 Hard courts (blue synthetic)
- 6 Clay courts (orange with particles)
- 6 Grass courts (natural lawn)
- 6 Wood courts (indoor style)
```

### BasicThreeScene.tsx (168 lines)
**Purpose**: Pure Three.js implementation bypass for React 19 compatibility
**Key Features**:
- No React Three Fiber dependency
- Direct THREE.js scene setup
- Animated spinning cube demo
- Mouse drag rotation controls
- Window resize handling
- Manual WebGL renderer management

### SafeThreeScene.tsx (297 lines)
**Purpose**: Error-resistant 3D scene wrapper
**Key Features**:
- WebGL capability detection
- Graceful degradation
- Error boundary integration
- Fallback UI for WebGL failures
- Performance monitoring

### LazyThreeScene.tsx (102 lines)
**Purpose**: Code-split lazy loading wrapper for ThreeScene
**Key Features**:
- React.lazy implementation
- Suspense boundary
- Loading state handling
- Performance optimization

### PersistentThreeScene.tsx (48 lines)
**Purpose**: Scene state persistence across navigation
**Key Features**:
- Camera position saving
- Scene state preservation
- localStorage integration

### TestScene.tsx (38 lines)
**Purpose**: Minimal test scene for debugging
**Key Features**:
- Simple cube rendering
- Quick Three.js verification
- Development testing

### ThreeSceneDiagnostic.tsx (154 lines)
**Purpose**: Scene debugging and diagnostics
**Key Features**:
- Performance metrics display
- Scene graph inspection
- WebGL stats
- Render debugging

### Grass.tsx (141 lines)
**Purpose**: Realistic grass rendering component
**Key Features**:
- Instanced mesh rendering (2,000 blades)
- Wind animation system
- Color variation
- Performance optimized
- Configurable density and appearance

---

## 🏢 Category 2: Facility Spaces & Structures

### ReceptionArea.tsx (675 lines)
**Purpose**: Main entrance and reception facility
**Key Features**:
- Reception desk with staff
- Visitor information displays
- Waiting area seating
- Digital signage
- Entrance automation
- Security checkpoint

### BMSControlRoom.tsx (333 lines)
**Purpose**: Building Management System control center
**Key Features**:
- Operator workstations (4 stations, 2 rows)
- Wall-mounted display screens
- Server rack visualization
- Control consoles
- Real-time monitoring displays
- Security camera placement

**Components**:
- `OperatorWorkstation`: Triple monitor setup with keyboard/mouse
- `WallDisplayScreen`: Large format displays with data grids
- `ServerRack`: 8-unit server stack with status LEDs

### BiometricLab.tsx (746 lines) 🔬
**Purpose**: APEX Performance Center biometric testing facility
**Key Features**:
- Body composition scanner with rotating ring
- VO2 Max testing station with treadmill
- Force plate with pressure sensors
- Motion capture zone (4 cameras)
- Holographic data displays
- 3D body metrics model

**Testing Equipment**:
- Body scanner: 360° scanning beam, platform
- VO2 station: Treadmill + respiratory analysis
- Force plate: 5x5 pressure sensor grid
- Motion capture: 4-camera IR system

### CognitiveLab.tsx (608 lines) 🧠
**Purpose**: APEX Cognitive Training Laboratory
**Key Features**:
- Reaction time testing station
- VR training pods (4 units)
- Eye tracking system
- Decision-making simulator
- Neural feedback displays
- Cognitive exercise stations

**Stations**:
- Reaction tester: Multi-button response system
- VR pods: Spherical chambers with haptic seating
- Eye tracker: Gaze point analysis
- Decision sim: Multi-path decision tree visualization

### MovementStudio.tsx (754 lines)
**Purpose**: APEX Movement Optimization Studio
**Key Features**:
- Biomechanics analysis equipment
- Movement tracking cameras
- Performance testing stations
- Real-time feedback displays
- Exercise equipment visualization

### RecoverySuite.tsx (680 lines)
**Purpose**: APEX Recovery and wellness facility
**Key Features**:
- Hyperbaric oxygen chambers
- Cryotherapy units
- Sleep pods
- Massage stations
- Recovery monitoring
- Ambient lighting control

### MechanicalRooms.tsx (1,146 lines) ⚙️
**Purpose**: Building systems and infrastructure
**Key Features**:
- HVAC systems visualization
- Electrical distribution
- Water treatment facilities
- Backup power generators
- Maintenance robot stations
- Cooling towers

### HydroponicsSystem.tsx (649 lines) 🌱
**Purpose**: Level 3 vertical farming system
**Key Features**:
- 4x 500sqm farming sectors
- LED grow light arrays
- Automated irrigation
- Nutrient delivery systems
- Climate control
- Crop monitoring stations

### ParkingLot.tsx (363 lines)
**Purpose**: Outdoor parking facility
**Key Features**:
- Multi-level parking visualization
- EV charging stations
- Traffic flow simulation
- Entrance/exit gates
- Lighting system

### LockerRoom.tsx (168 lines)
**Purpose**: Athletic locker and changing facilities
**Key Features**:
- Locker arrays
- Bench seating
- Shower facilities
- Towel stations

### SupportSpaces.tsx (561 lines)
**Purpose**: Additional facility support areas
**Key Features**:
- Storage rooms
- Maintenance areas
- Staff facilities
- Equipment storage

---

## ⚙️ Category 3: Systems, Effects & Automation

### RoboticGrassSystem.tsx (529 lines) 🤖
**Purpose**: Autonomous grass court swap system
**Key Features**:
- Robotic cart visualization
- 60-minute modular swap simulation
- Automated pathfinding
- Court grid management
- Maintenance scheduling
- Status monitoring

### TransportPods.tsx (684 lines) 🚊
**Purpose**: Autonomous internal transportation
**Key Features**:
- Self-driving pod vehicles
- Multi-floor routing
- Passenger simulation
- Traffic management
- Loading/unloading animation

### WeatherSystem.tsx (575 lines) 🌦️
**Purpose**: Environmental simulation and effects
**Key Features**:
- Rain particle system
- Cloud generation
- Fog effects
- Lighting adaptation
- Weather transitions
- Real-time controls

### LightingSystem.tsx (665 lines) 💡
**Purpose**: Facility lighting control and visualization
**Key Features**:
- Dynamic lighting zones
- LED court lighting
- Ambient adjustment
- Energy optimization
- Day/night cycles
- Emergency lighting

### ClayCourtEffect.tsx (276 lines)
**Purpose**: Realistic clay court surface
**Key Features**:
- Procedural clay texture generation
- Dust particle system
- Normal/roughness mapping
- Surface wear patterns
- Canvas-based texture creation

### HeatMapOverlay.tsx (629 lines) 📊
**Purpose**: Player activity and court usage visualization
**Key Features**:
- Real-time heat map generation
- Player position tracking
- Court usage analytics
- Color-coded intensity mapping
- Interactive data overlay

### CharacterSystem.tsx (577 lines) 👥
**Purpose**: Animated facility population
**Key Features**:
- Multiple character types (players, coaches, staff, visitors, spectators)
- AI pathfinding and navigation
- Activity states (idle, walking, playing, coaching, watching)
- Court assignment system
- Crowd simulation (200+ spectators)
- Character count: 83 active characters
  - 48 players
  - 12 coaches
  - 8 staff
  - 15 visitors
  - 200 spectators (bleachers)

**Movement System**:
- Waypoint-based pathfinding
- Activity zone navigation
- State machine behaviors
- Collision avoidance

### PerformanceMetrics.tsx (522 lines) 📈
**Purpose**: Real-time performance monitoring
**Key Features**:
- FPS tracking
- Memory usage monitoring
- Frame time analysis
- WebGL diagnostics
- Performance warnings
- Stats display overlay

### WeatherControls.tsx (155 lines)
**Purpose**: Weather system UI controls
**Key Features**:
- Weather preset selection
- Real-time parameter adjustment
- Visual feedback

### WeatherIntegrationSnippet.tsx (235 lines)
**Purpose**: Weather system code examples
**Key Features**:
- Integration documentation
- Usage examples
- API demonstration

---

## 🎨 Category 4: UI & Interface Components

### NavBar.tsx (74 lines)
**Purpose**: Main application navigation
**Key Features**:
- View switching (Home, Specs, 3D Map, Amenities, Invest)
- Mobile responsive menu
- Brand identity display
- CTA button (Join Waiting List)

**Views**:
```typescript
View.HOME - Vision page
View.SPECIFICATIONS - Technical specs
View.FACILITY_DEMO - 3D interactive map
View.AMENITIES - Facility features
View.INVEST - Investment opportunity
```

### Amenities.tsx (633 lines)
**Purpose**: Facility features showcase
**Key Features**:
- Multi-sport complex details
- APEX Performance Center overview
- Vertical farm integration
- Autonomous operations
- Membership tiers display
- Pricing cards

**Sections**:
1. Multi-Sport Complex (Tennis, Pickleball, Badminton, Squash)
2. APEX Performance Center (6 specialized labs)
3. Vertical Farm Integration
4. Autonomous Features
5. Membership Tiers (Foundation $299, Optimization $999, Elite $2,999)

### Specifications.tsx (214 lines)
**Purpose**: Technical facility specifications
**Key Features**:
- Dimension tables
- Surface specifications
- System capabilities
- Performance metrics

### AIChat.tsx (127 lines) 💬
**Purpose**: AI concierge chatbot interface
**Key Features**:
- Framer Motion animations
- Chat history
- Gemini API integration
- Message streaming
- Floating chat widget
- Context-aware responses

### QualityBadge.tsx (57 lines)
**Purpose**: Quality indicator component
**Key Features**:
- Visual quality rating
- Icon display
- Status indicators

### LoadingProvider.tsx (136 lines)
**Purpose**: Global loading state management
**Key Features**:
- Asset registration system
- Priority-based loading (high/medium/low)
- Progress tracking
- Asset types: texture, model, environment, data
- Context API for loading state

### LoadingProgress.tsx (145 lines)
**Purpose**: Loading screen UI
**Key Features**:
- Progress bar visualization
- Asset loading status
- Loading animations

### MissingComponentStub.tsx (103 lines)
**Purpose**: Development placeholder
**Key Features**:
- Component placeholder rendering
- Missing component warnings
- Development debugging aid

---

## 🛠️ Category 5: Performance & Debugging Tools

### DebugLogger.tsx (512 lines) 🐛
**Purpose**: Production-ready debugging overlay
**Key Features**:
- Console error/warn interception
- WebGL context loss detection
- Performance monitoring (FPS, memory, frame time)
- Error persistence (localStorage)
- Log export (JSON download)
- Global `window.debugLogger` API
- Visual debug overlay with categorized logs

**Monitored Events**:
- console.error, console.warn
- window.error, unhandledrejection
- WebGL context lost/restored
- Performance degradation (FPS < 30)

### ErrorBoundary.tsx (354 lines)
**Purpose**: React error boundary with full reporting
**Key Features**:
- React error catching
- Component stack traces
- Error persistence (localStorage, last 10 errors)
- Error report export (clipboard + file download)
- Recovery mechanisms
- User-friendly fallback UI
- Unique error IDs for tracking

**Error Reporting**:
- Full stack traces
- Component trees
- Environment data (user agent, viewport)
- Error ID generation
- Copy/download error reports

### PerformanceMetrics.tsx (522 lines)
**Purpose**: Advanced performance analytics
**Key Features**:
- Real-time FPS tracking
- Memory usage monitoring
- Frame time analysis
- WebGL performance metrics
- Performance warnings
- Historical data tracking

---

## 📚 Category 6: Examples & Demonstrations

### HeatMapExample.tsx (154 lines)
**Purpose**: Heat map usage demonstration
**Key Features**:
- Sample data visualization
- Integration examples
- Interactive demo

### HeatMapDemo.tsx (339 lines)
**Purpose**: Advanced heat map demonstration
**Key Features**:
- Multiple heat map types
- Real-time data updates
- Configuration options

### LightingDemo.tsx (143 lines)
**Purpose**: Lighting system showcase
**Key Features**:
- Lighting presets
- Dynamic lighting effects
- Configuration examples

### WeatherSystemExample.tsx (190 lines)
**Purpose**: Weather system demonstration
**Key Features**:
- Weather effect showcase
- Preset configurations
- Integration patterns

### TennisCourtWithHeatMap.tsx (257 lines)
**Purpose**: Combined court + analytics demo
**Key Features**:
- Court rendering with heat map overlay
- Player tracking visualization
- Performance analytics

---

## 🔗 Component Dependencies Graph

```
ThreeScene (Main Entry Point)
├── Grass (x24 courts)
├── ClayCourtEffect (x6 courts)
├── ReceptionArea
├── BMSControlRoom
│   ├── OperatorWorkstation (x4)
│   ├── WallDisplayScreen (x7)
│   └── ServerRack (x2)
├── BiometricLab
│   ├── BodyScanner
│   ├── VO2MaxStation
│   ├── ForcePlate
│   └── MotionCaptureZone
├── CognitiveLab
│   ├── ReactionTimeStation
│   ├── VRTrainingPod
│   ├── EyeTrackingSystem
│   ├── DecisionSimulator
│   └── CognitiveExerciseStation
├── RoboticGrassSystem
├── TransportPods
├── HydroponicsSystem
├── MechanicalRooms
├── MovementStudio
├── RecoverySuite
├── ParkingLot
├── LockerRoom
├── SupportSpaces
├── CharacterSystem
├── WeatherSystem
├── LightingSystem
├── HeatMapOverlay
└── PerformanceMetrics

App.tsx
├── ErrorBoundary
├── LoadingProvider
│   └── LoadingProgress
├── DebugLogger
├── NavBar
├── AIChat
└── ThreeScene (or view-specific components)
```

---

## 🏗️ Architecture Patterns

### 3D Component Pattern
```typescript
// Standard 3D component structure
interface ComponentProps {
  position: [number, number, number];
  // ... specific props
}

const Component: React.FC<ComponentProps> = ({ position }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    // Animation logic
  });

  return (
    <group position={position}>
      {/* Three.js objects */}
    </group>
  );
};
```

### Performance Optimization Patterns
1. **Instanced Meshes**: Grass (2,000 instances), Characters (283 instances)
2. **LOD Systems**: Distance-based detail reduction
3. **Lazy Loading**: Code-split heavy components
4. **Memoization**: useMemo for expensive calculations
5. **Canvas Textures**: Procedural texture generation

### State Management
- **React Context**: LoadingProvider
- **Local State**: Component-specific useState
- **Refs**: THREE.js object references
- **Global Window**: debugLogger API

---

## 📦 Key Technologies Used

### Core 3D Stack
- **React Three Fiber** (@react-three/fiber)
- **Drei** (@react-three/drei) - Helper components
- **Three.js** - WebGL rendering

### UI/UX
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **Tailwind CSS** - Styling

### AI Integration
- **Gemini API** - AI chat (AIChat.tsx)

### Performance
- **React.lazy** - Code splitting
- **InstancedMesh** - Rendering optimization
- **Canvas API** - Procedural textures

---

## 🎯 Component Usage Recommendations

### For New Features
1. **3D Facility Elements**: Extend ThreeScene.tsx
2. **Interactive Objects**: Follow Grass.tsx pattern
3. **UI Overlays**: Use Html from drei (see CharacterSystem.tsx)
4. **Performance Monitoring**: Extend PerformanceMetrics.tsx
5. **Error Handling**: Wrap with ErrorBoundary

### Performance Considerations
- Use instanced meshes for >100 similar objects
- Implement LOD for complex geometries
- Lazy load components not visible on initial render
- Monitor with DebugLogger and PerformanceMetrics

### Best Practices
- All positions as `[x, y, z]` tuples
- Use refs for THREE.js objects
- Implement cleanup in useEffect returns
- Add TypeScript interfaces for all props
- Include JSDoc comments for complex components

---

## 📊 Component Complexity Matrix

| Component | Complexity | Lines | Dependencies | Performance Impact |
|-----------|-----------|-------|--------------|-------------------|
| ThreeScene | ⭐⭐⭐⭐⭐ | 1,545 | 10+ | High |
| BiometricLab | ⭐⭐⭐⭐ | 746 | 5 | Medium |
| CognitiveLab | ⭐⭐⭐⭐ | 608 | 6 | Medium |
| CharacterSystem | ⭐⭐⭐⭐ | 577 | 3 | High |
| PerformanceMetrics | ⭐⭐⭐ | 522 | 2 | Low |
| DebugLogger | ⭐⭐⭐ | 512 | 1 | Low |
| Grass | ⭐⭐ | 141 | 1 | Medium |
| NavBar | ⭐ | 74 | 0 | Minimal |

---

## 🚀 Future Enhancement Opportunities

1. **Component Library Export**: Extract reusable 3D primitives
2. **Storybook Integration**: Visual component documentation
3. **Performance Profiling**: Add detailed instrumentation
4. **A11y Improvements**: Keyboard navigation for 3D scenes
5. **Mobile Optimization**: Touch controls and responsive 3D
6. **Component Testing**: Unit and integration test coverage
7. **Documentation**: Auto-generate from JSDoc comments

---

**End of Component Catalog**
*Generated by Component Inventory Specialist*
*Last Updated: 2025-11-22*
