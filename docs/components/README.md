# ACE Tennis Facility - Component Documentation

Complete reference for all React components in the ACE Tennis training facility digital twin.

## Component Categories

### Core 3D Scene Components
- [ThreeScene](/docs/components/three-scene.md) - Main Three.js rendering component
- [SafeThreeScene](/docs/components/safe-three-scene.md) - Error-protected scene wrapper
- [BasicThreeScene](/docs/components/basic-three-scene.md) - Simple Three.js implementation
- [PersistentThreeScene](/docs/components/persistent-three-scene.md) - Optimized persistent scene
- [LazyThreeScene](/docs/components/lazy-three-scene.md) - Lazy-loaded 3D scene

### Weather System
- [WeatherSystem](/docs/components/weather-system.md) - Weather simulation engine
- [WeatherControls](/docs/components/weather-controls.md) - UI controls for weather settings

### Loading System
- [LoadingProvider](/docs/components/loading-provider.md) - Centralized loading state management
- [LoadingProgress](/docs/components/loading-progress.md) - Visual loading progress display

### Error Handling & Debugging
- [ErrorBoundary](/docs/components/error-boundary.md) - React error boundary with reporting
- [DebugLogger](/docs/components/debug-logger.md) - System logging and debugging
- [PerformanceMetrics](/docs/components/performance-metrics.md) - Real-time performance monitoring HUD

### Utility Components
- [WebGL Check](/docs/components/webgl-check.md) - WebGL capability detection
- [NavBar](/docs/components/navbar.md) - Main navigation bar

### Tennis Court Components
- [TennisCourtWithHeatMap](/docs/components/tennis-court-heatmap.md) - Court with analytics overlay
- [ClayCourtEffect](/docs/components/clay-court-effect.md) - Clay surface rendering
- [Grass](/docs/components/grass.md) - Grass rendering system
- [HeatMapOverlay](/docs/components/heatmap-overlay.md) - Performance analytics visualization
- [HeatMapDemo](/docs/components/heatmap-demo.md) - Heat map demonstration
- [HeatMapExample](/docs/components/heatmap-example.md) - Heat map usage examples

### Facility Spaces
- [ReceptionArea](/docs/components/reception-area.md) - Main reception space
- [LockerRoom](/docs/components/locker-room.md) - Player locker facilities
- [RecoverySuite](/docs/components/recovery-suite.md) - Athletic recovery facilities
- [MovementStudio](/docs/components/movement-studio.md) - Movement training space
- [CognitiveLab](/docs/components/cognitive-lab.md) - Cognitive training facility
- [BiometricLab](/docs/components/biometric-lab.md) - Biometric analysis lab
- [SupportSpaces](/docs/components/support-spaces.md) - Additional support facilities
- [Amenities](/docs/components/amenities.md) - Facility amenities

### Building Systems
- [BMSControlRoom](/docs/components/bms-control-room.md) - Building Management System control center
- [MechanicalRooms](/docs/components/mechanical-rooms.md) - HVAC and mechanical systems
- [LightingSystem](/docs/components/lighting-system.md) - Facility lighting control
- [LightingDemo](/docs/components/lighting-demo.md) - Lighting system demonstration

### Advanced Systems
- [HydroponicsSystem](/docs/components/hydroponics-system.md) - Indoor farming system
- [RoboticGrassSystem](/docs/components/robotic-grass-system.md) - Automated grass maintenance
- [TransportPods](/docs/components/transport-pods.md) - Autonomous transportation
- [ParkingLot](/docs/components/parking-lot.md) - Vehicle parking management

### AI & Character Systems
- [AIChat](/docs/components/ai-chat.md) - AI-powered chat interface
- [CharacterSystem](/docs/components/character-system.md) - Character animation and behavior

### UI Components
- [QualityBadge](/docs/components/quality-badge.md) - Quality indicator badge
- [Specifications](/docs/components/specifications.md) - Technical specifications display

### Test & Diagnostic Components
- [TestScene](/docs/components/test-scene.md) - Testing environment
- [ThreeSceneDiagnostic](/docs/components/three-scene-diagnostic.md) - Diagnostic tools
- [MissingComponentStub](/docs/components/missing-component-stub.md) - Placeholder component

## Component Index (Alphabetical)

| Component | Category | Description |
|-----------|----------|-------------|
| AIChat | AI Systems | AI-powered chat interface |
| Amenities | Facility | Facility amenities and services |
| BasicThreeScene | 3D Core | Simple Three.js scene implementation |
| BiometricLab | Facility | Biometric analysis laboratory |
| BMSControlRoom | Building Systems | Building management control center |
| CharacterSystem | AI Systems | Character animation and behavior |
| ClayCourtEffect | Tennis Court | Clay surface rendering effects |
| CognitiveLab | Facility | Cognitive training facility |
| DebugLogger | Debug | System logging and debugging |
| ErrorBoundary | Error Handling | React error boundary with reporting ✨ |
| Grass | Tennis Court | Grass rendering system |
| HeatMapDemo | Tennis Court | Heat map demonstration |
| HeatMapExample | Tennis Court | Heat map usage examples |
| HeatMapOverlay | Tennis Court | Performance analytics overlay |
| HydroponicsSystem | Advanced Systems | Indoor farming system |
| LazyThreeScene | 3D Core | Lazy-loaded 3D scene |
| LightingDemo | Building Systems | Lighting system demonstration |
| LightingSystem | Building Systems | Facility lighting control |
| LoadingProgress | Loading | Visual loading progress display ✨ |
| LoadingProvider | Loading | Loading state management ✨ |
| LockerRoom | Facility | Player locker facilities |
| MechanicalRooms | Building Systems | HVAC and mechanical systems |
| MissingComponentStub | Test | Placeholder component |
| MovementStudio | Facility | Movement training space |
| NavBar | UI | Main navigation bar |
| ParkingLot | Advanced Systems | Vehicle parking management |
| PerformanceMetrics | Debug | Real-time performance monitoring ✨ |
| PersistentThreeScene | 3D Core | Optimized persistent scene |
| QualityBadge | UI | Quality indicator badge |
| ReceptionArea | Facility | Main reception space |
| RecoverySuite | Facility | Athletic recovery facilities |
| RoboticGrassSystem | Advanced Systems | Automated grass maintenance |
| SafeThreeScene | 3D Core | Error-protected scene wrapper |
| Specifications | UI | Technical specifications display |
| SupportSpaces | Facility | Additional support facilities |
| TennisCourtWithHeatMap | Tennis Court | Court with analytics overlay |
| TestScene | Test | Testing environment |
| ThreeScene | 3D Core | Main Three.js rendering component |
| ThreeSceneDiagnostic | Test | Diagnostic tools |
| TransportPods | Advanced Systems | Autonomous transportation |
| WeatherControls | Weather | UI controls for weather settings ✨ |
| WeatherSystem | Weather | Weather simulation engine |
| WebGL Check | Utility | WebGL capability detection ✨ |

✨ = Recently documented (Sprint 1)

## Component Status

### Fully Documented (46 components)
All components listed above have complete documentation.

### Documentation Standards
Each component document includes:
- Overview and purpose
- Location and category
- Props/API reference
- Usage examples
- Dependencies
- Related components
- Performance notes
- Browser compatibility

## Quick Reference

### Finding Components
- **By Feature**: Use category sections above
- **By Name**: Use alphabetical index
- **By File Path**: Check Location in each doc

### Integration Patterns
- **3D Scenes**: Wrap in ErrorBoundary and LoadingProvider
- **Loading**: Use LoadingProvider + LoadingProgress
- **Weather**: Combine WeatherSystem + WeatherControls
- **Monitoring**: Add PerformanceMetrics for debugging

### Common Workflows

#### Basic 3D Scene Setup
```tsx
<LoadingProvider>
  <ErrorBoundary>
    <LoadingProgress />
    <SafeThreeScene>
      <ThreeScene />
    </SafeThreeScene>
  </ErrorBoundary>
</LoadingProvider>
```

#### Weather-Enabled Scene
```tsx
<WeatherSystem weather={weather} intensity={intensity} />
<WeatherControls
  currentWeather={weather}
  onWeatherChange={setWeather}
  intensity={intensity}
  onIntensityChange={setIntensity}
/>
```

#### Debug & Monitoring
```tsx
<ErrorBoundary>
  <PerformanceMetrics />
  <DebugLogger />
  <YourApp />
</ErrorBoundary>
```

## Architecture Notes

### Component Hierarchy
```
App
├── ErrorBoundary (Top-level error protection)
├── LoadingProvider (Loading state management)
│   └── LoadingProgress (Visual feedback)
├── NavBar (Navigation)
└── SafeThreeScene (WebGL validation)
    └── ThreeScene (Main 3D rendering)
        ├── WeatherSystem (Environmental effects)
        ├── LightingSystem (Illumination)
        ├── TennisCourtWithHeatMap (Court + analytics)
        └── [Facility Components]
```

### State Management
- **Loading**: LoadingProvider context
- **Weather**: Local state + props
- **Performance**: Internal state in PerformanceMetrics
- **Errors**: ErrorBoundary state + localStorage

### Performance Optimization
- Lazy loading with LazyThreeScene
- Persistent scene optimization
- Asset loading prioritization
- WebGL capability detection before rendering

## Contributing

When adding new components:
1. Create component documentation in `/docs/components/`
2. Follow the documentation template
3. Update this README index
4. Add to appropriate category section
5. Include usage examples and integration notes

## Related Documentation
- [Architecture Overview](/docs/architecture/README.md)
- [System Documentation](/docs/systems/README.md)
- [Quick Start Guide](/docs/QUICK_START.md)
