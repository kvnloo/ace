# Advanced Lighting and Atmosphere System

## Overview

The LightingSystem component provides a comprehensive, production-ready lighting solution for the tennis facility 3D visualization. It combines realistic lighting physics, atmospheric effects, and performance optimization to create immersive, time-aware environments.

## Features

### 1. Dynamic Time-of-Day Lighting

Four distinct lighting presets that simulate natural lighting conditions:

- **Dawn** - Warm orange/pink tones, low sun angle, light fog
- **Day** - Bright white sunlight, high sun position, minimal fog
- **Dusk** - Red/orange sunset glow, medium sun angle, moderate fog
- **Night** - Cool blue moonlight, low ambient, subtle fog

Each preset includes:
- Sky color (hemisphere lighting)
- Ground color (reflected lighting)
- Sun/moon color and intensity
- Ambient light intensity
- Fog color and density
- Shadow opacity

### 2. Stadium Floodlights

High-intensity perimeter lighting for nighttime sports:

- **16 floodlight fixtures** strategically positioned around building perimeter
- Realistic light falloff and penumbra (soft shadows)
- Animated flickering effect for realism
- Physical light fixtures with support poles
- Automatic activation during night/dusk + sports mode
- Shadow casting with quality-based LOD

**Positions:**
- 5 fixtures on north and south sides
- 3 fixtures on east and west sides
- Height: 25m above ground
- Coverage: 80m distance per fixture
- Angle: 60° cone

### 3. Court Spotlights

Individual court-level lighting for 24 tennis courts:

- **96 spotlights total** (4 per court)
- Corner-mounted positioning for optimal coverage
- 12m mounting height
- 18m coverage distance per light
- 45° beam angle with 0.2 penumbra
- Disabled shadow casting for performance
- Automatic activation in sports/event/maintenance modes

### 4. Ambient Facility Lighting

Interior and circulation area illumination:

- **Reception area** - Warm white (3000K equivalent)
- **Corridors** - Cool white for all 3 levels (4000K equivalent)
- **Circulation spaces** - 8 positions per level
- Soft point lights without shadow casting
- 15m coverage radius
- Automatically enabled in non-natural modes

### 5. Atmospheric Effects

#### Volumetric Fog
- Exponential fog density (THREE.FogExp2)
- Time-dependent color shifting
- User-controllable density (0 to 0.005)
- Enhances depth perception and mood

#### Post-Processing
- **Bloom Effect** - Light glow and halation
  - Configurable intensity (0-2)
  - Luminance threshold: 0.6
  - Mipmap blur for quality
- **Tone Mapping** - HDR to LDR conversion
  - Adaptive luminance
  - Middle grey: 0.6
  - Max luminance: 16.0

### 6. Special Event Effects

"Event" mode activates championship-level lighting:
- Maximum floodlight intensity
- Enhanced bloom strength
- All court lights at full power
- Dramatic atmospheric fog
- Ideal for tournament visualization

## Component API

### LightingSystem Props

```typescript
interface LightingSystemProps {
  showControls?: boolean;          // Display UI controls (default: true)
  initialConfig?: Partial<LightingConfig>;  // Initial configuration
}

interface LightingConfig {
  timeOfDay: 'dawn' | 'day' | 'dusk' | 'night';
  mode: 'natural' | 'sports' | 'event' | 'maintenance';
  quality: 'low' | 'medium' | 'high' | 'ultra';
  floodlightsEnabled: boolean;
  courtLightsEnabled: boolean;
  ambientIntensity: number;        // 0-1
  fogDensity: number;              // 0-0.005
  bloomStrength: number;           // 0-2
}
```

### Usage Examples

#### Basic Integration

```typescript
import { LightingSystem } from './components/LightingSystem';

<Canvas>
  <LightingSystem />
  {/* Your scene content */}
</Canvas>
```

#### Custom Configuration

```typescript
<LightingSystem
  showControls={false}
  initialConfig={{
    timeOfDay: 'dusk',
    mode: 'event',
    quality: 'ultra',
    bloomStrength: 1.5,
    fogDensity: 0.002
  }}
/>
```

#### Programmatic Control

```typescript
const [config, setConfig] = useState<LightingConfig>({
  timeOfDay: 'day',
  mode: 'sports',
  // ... other settings
});

// Update lighting state
setConfig(prev => ({
  ...prev,
  timeOfDay: 'night',
  floodlightsEnabled: true
}));
```

## Lighting Modes

### Natural Mode
- Only sun/moon directional light
- No artificial lighting
- Minimal fog
- Ideal for daytime architectural views

### Sports Mode (Default)
- Court lights active during non-day times
- Floodlights at night/dusk
- Standard bloom and fog
- Optimized for gameplay visualization

### Event Mode
- All lights at maximum intensity
- Enhanced bloom for dramatic effect
- Increased fog for atmosphere
- Championship/tournament aesthetic

### Maintenance Mode
- All facility lights active
- Court lights on regardless of time
- Bright, even illumination
- No atmospheric effects

## Quality Settings

### Low
- Shadow map: 256x256
- Single shadow cascade
- No bloom mipmapping
- Reduced light count

### Medium (Recommended for Web)
- Shadow map: 512x512
- Bloom with reduced samples
- Balanced performance/quality

### High (Default)
- Shadow map: 1024x1024
- Full bloom pipeline
- Multiple shadow cascades

### Ultra (High-end devices)
- Shadow map: 2048x2048 (floodlights)
- Shadow map: 4096x4096 (sun)
- Maximum bloom quality
- All effects enabled

## Performance Optimization

### Instancing
- Light fixtures use shared geometries
- Material reuse across similar lights
- Reduced draw calls

### LOD System
- Shadow quality adapts to distance
- Selective shadow casting
- Court lights don't cast shadows

### Conditional Rendering
- Lights enabled/disabled based on mode
- Fog only applied when density > 0
- Dynamic intensity calculations

### Memory Management
- Memoized light position arrays
- Efficient useFrame hooks
- No unnecessary re-renders

## Architecture

### Component Hierarchy

```
LightingSystem
├── LightingControlPanel (UI)
├── CelestialLight (Sun/Moon)
├── FloodlightFixture × 16
│   ├── SpotLight (shadow casting)
│   ├── Housing mesh
│   └── Support pole
├── CourtSpotlight × 96
│   ├── SpotLight (no shadows)
│   └── Fixture mesh
├── AmbientLightGrid
│   └── PointLight × 32
├── VolumetricFog
└── EffectComposer
    ├── Bloom
    └── ToneMapping
```

### Lighting Calculations

**Total Light Count:**
- 1 directional (sun/moon)
- 1 hemisphere (ambient)
- 16 spot lights (floodlights)
- 96 spot lights (courts)
- 32 point lights (ambient)
- **Total: 146 dynamic lights**

**Shadow Maps:**
- 1 shadow map for sun (2048×2048)
- 16 shadow maps for floodlights (1024×1024 each)
- **Total: ~20MB shadow memory**

## Integration Guide

### Step 1: Install Dependencies

Already included in project:
- `@react-three/fiber`
- `@react-three/drei`
- `@react-three/postprocessing`
- `three`

### Step 2: Import Component

```typescript
import { LightingSystem } from './components/LightingSystem';
```

### Step 3: Add to Scene

Replace existing lighting in ThreeScene.tsx:

```typescript
// Remove:
// <ambientLight intensity={0.4} />
// <directionalLight position={[-80, 150, 100]} intensity={2} />

// Add:
<LightingSystem showControls={true} />
```

### Step 4: Adjust Scene Materials

Ensure scene objects have proper material properties:

```typescript
<meshStandardMaterial
  color="#3b82f6"
  roughness={0.6}  // Affects light reflection
  metalness={0.1}  // Non-metallic surfaces
/>
```

### Step 5: Enable Shadows

Set shadow properties on receiving meshes:

```typescript
<mesh receiveShadow>
  <planeGeometry args={[100, 100]} />
  <meshStandardMaterial />
</mesh>
```

## UI Controls

### Control Panel (Right Side)

**Time of Day Selector**
- 4 buttons: Dawn, Day, Dusk, Night
- Updates sun position and color
- Adjusts fog and ambient lighting

**Mode Selector**
- 4 buttons: Natural, Sports, Event, Maintenance
- Controls which lights are active
- Changes atmosphere preset

**Toggles**
- Floodlights On/Off
- Court Lights On/Off

**Sliders**
- Fog Density (0 to 0.005)
- Bloom Strength (0 to 2)

## Customization

### Adding New Light Fixtures

```typescript
const customLights: LightFixture[] = [
  {
    position: [x, y, z],
    intensity: 10,
    color: '#ffffff',
    distance: 50,
    angle: Math.PI / 3,
    penumbra: 0.2,
  },
];
```

### Custom Time Presets

```typescript
const TIME_PRESETS: Record<TimeOfDay, PresetConfig> = {
  // ... existing presets
  custom: {
    skyColor: '#ff00ff',
    sunIntensity: 1.5,
    // ... other properties
  },
};
```

### Event-Specific Lighting

```typescript
// Create preset for specific event
const championshipLighting: Partial<LightingConfig> = {
  timeOfDay: 'night',
  mode: 'event',
  floodlightsEnabled: true,
  bloomStrength: 2.0,
  fogDensity: 0.003,
};

<LightingSystem initialConfig={championshipLighting} />
```

## Browser Compatibility

### Tested Browsers
- ✅ Chrome 90+ (Recommended)
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### WebGL Requirements
- WebGL 2.0 support required
- Shadow map support
- Floating point textures

### Mobile Support
- Use `quality: 'low'` or `quality: 'medium'`
- Reduce light count for mobile
- Disable bloom on low-end devices

## Troubleshooting

### Shadows Not Appearing
- Check `castShadow` and `receiveShadow` props
- Verify shadow camera bounds
- Increase shadow map size

### Performance Issues
- Lower quality setting
- Reduce fog density
- Disable bloom
- Decrease light count

### Lighting Too Dark
- Increase ambient intensity
- Enable more light sources
- Reduce fog density
- Check time of day preset

### Bloom Artifacts
- Reduce bloom intensity
- Adjust luminance threshold
- Lower bloom resolution
- Check material emissive values

## Future Enhancements

### Planned Features
- [ ] Light animation presets (strobing, pulsing)
- [ ] Weather effects (rain, storm lighting)
- [ ] Lens flare effects
- [ ] God rays (volumetric lighting)
- [ ] Light probe system for GI
- [ ] Dynamic shadow cascades
- [ ] SSAO integration
- [ ] Color temperature control

### Optimization Ideas
- [ ] Light culling based on camera frustum
- [ ] Deferred lighting pipeline
- [ ] Clustered forward rendering
- [ ] Baked lightmaps for static geometry

## Technical Specifications

### Performance Metrics (Target)
- 60 FPS at 1080p (high quality)
- 30 FPS at 4K (ultra quality)
- <50ms lighting update time
- <100MB total memory usage

### Code Metrics
- Component: ~600 lines
- TypeScript: Fully typed
- React hooks: Optimized with useMemo/useCallback
- Three.js: Modern API usage

## Credits

Built for ACE Tennis Facility Visualization
Using Three.js and React Three Fiber
Advanced lighting techniques based on PBR principles

## License

Part of the ACE Tennis Facility project
All rights reserved
