# LightingSystem Component

Advanced lighting and atmosphere system for ACE Tennis Facility 3D visualization.

## Quick Start

```typescript
import { LightingSystem } from './components/LightingSystem';

<Canvas shadows>
  <LightingSystem />
  {/* Your 3D scene */}
</Canvas>
```

## Features

✨ **Dynamic Time-of-Day** - Dawn, day, dusk, night presets
💡 **Stadium Floodlights** - 16 high-intensity perimeter lights
🎯 **Court Spotlights** - 96 individual court lights (4 per court)
🌫️ **Volumetric Fog** - Atmospheric depth with adjustable density
✨ **Light Bloom** - HDR glow effects for dramatic lighting
🎮 **Interactive Controls** - Real-time UI for all settings
⚡ **Performance Optimized** - LOD system, instancing, selective shadows

## Architecture

```
146 Total Lights
├── 1 Directional (Sun/Moon) - Main illumination
├── 1 Hemisphere - Ambient color variation
├── 16 Spot Lights - Stadium floodlights
├── 96 Spot Lights - Court lighting
└── 32 Point Lights - Facility ambient lighting

Post-Processing
├── Bloom - Light glow and halation
└── Tone Mapping - HDR to LDR conversion
```

## Configuration

```typescript
interface LightingConfig {
  timeOfDay: 'dawn' | 'day' | 'dusk' | 'night';
  mode: 'natural' | 'sports' | 'event' | 'maintenance';
  quality: 'low' | 'medium' | 'high' | 'ultra';
  floodlightsEnabled: boolean;
  courtLightsEnabled: boolean;
  ambientIntensity: number;
  fogDensity: number;
  bloomStrength: number;
}
```

## Usage Examples

### Basic

```typescript
<LightingSystem />
```

### Custom Configuration

```typescript
<LightingSystem
  showControls={false}
  initialConfig={{
    timeOfDay: 'night',
    mode: 'event',
    quality: 'ultra',
    bloomStrength: 2.0,
    fogDensity: 0.003
  }}
/>
```

### Championship Mode

```typescript
<LightingSystem
  initialConfig={{
    timeOfDay: 'night',
    mode: 'event',
    floodlightsEnabled: true,
    courtLightsEnabled: true,
    bloomStrength: 2.0,
    fogDensity: 0.003
  }}
/>
```

### Daytime Practice

```typescript
<LightingSystem
  initialConfig={{
    timeOfDay: 'day',
    mode: 'sports',
    quality: 'high'
  }}
/>
```

## Lighting Modes

### Natural
- Sun/moon lighting only
- No artificial lights
- Realistic daytime appearance
- Best for architectural visualization

### Sports (Default)
- Court lights active
- Floodlights at night/dusk
- Balanced illumination
- Optimized for gameplay views

### Event
- All lights maximum intensity
- Enhanced bloom effects
- Dramatic atmosphere
- Perfect for tournaments/championships

### Maintenance
- All facility lights active
- Bright, even illumination
- No atmospheric effects
- Ideal for inspections

## Time Presets

| Time  | Sky Color | Sun Intensity | Fog | Use Case |
|-------|-----------|---------------|-----|----------|
| Dawn  | Orange/Pink | 1.2 | Light | Sunrise ambiance |
| Day   | Bright Blue | 2.5 | Minimal | Clear visibility |
| Dusk  | Red/Orange | 1.0 | Moderate | Sunset drama |
| Night | Dark Blue | 0.3 | Light | Evening/night matches |

## Performance

### Quality Levels

**Low** (Mobile)
- 256×256 shadow maps
- No bloom
- Minimal lights
- 30+ FPS target

**Medium** (Web Default)
- 512×512 shadow maps
- Basic bloom
- Balanced lighting
- 60 FPS target

**High** (Desktop)
- 1024×1024 shadow maps
- Full bloom pipeline
- All effects
- 60+ FPS target

**Ultra** (High-end)
- 2048×2048 shadow maps
- Maximum quality
- All features
- Uncapped FPS

### Optimization Tips

```typescript
// Mobile optimization
<LightingSystem
  initialConfig={{
    quality: 'low',
    bloomStrength: 0,
    fogDensity: 0,
    floodlightsEnabled: false
  }}
/>

// Selective shadows
<mesh
  castShadow={isImportant}
  receiveShadow={isGround}
>
```

## UI Controls

Control panel includes:

- **Time of Day** - 4 buttons (Dawn, Day, Dusk, Night)
- **Mode** - 4 buttons (Natural, Sports, Event, Maintenance)
- **Floodlights** - Toggle on/off
- **Court Lights** - Toggle on/off
- **Fog Density** - Slider (0 to 0.005)
- **Bloom Strength** - Slider (0 to 2)

## Integration

### Step 1: Import

```typescript
import { LightingSystem } from './components/LightingSystem';
```

### Step 2: Remove Old Lighting

```typescript
// Remove these:
// <ambientLight intensity={0.4} />
// <directionalLight ... />
```

### Step 3: Add LightingSystem

```typescript
<Canvas shadows>
  <LightingSystem showControls={true} />
  {/* Scene content */}
</Canvas>
```

### Step 4: Update Materials

```typescript
<meshStandardMaterial
  color="#yourColor"
  roughness={0.6}
  metalness={0.1}
  receiveShadow
/>
```

## Testing

Run unit tests:
```bash
npm test tests/LightingSystem.test.tsx
```

Run demo:
```typescript
import { LightingDemo } from './components/LightingDemo';
<LightingDemo />
```

## Documentation

- **Full Documentation**: `/docs/LIGHTING_SYSTEM.md`
- **Integration Guide**: `/docs/LIGHTING_INTEGRATION_GUIDE.md`
- **Unit Tests**: `/tests/LightingSystem.test.tsx`
- **Demo Component**: `/components/LightingDemo.tsx`

## Technical Details

### Light Count Breakdown

**Stadium Floodlights (16):**
- North side: 5 fixtures
- South side: 5 fixtures
- East side: 3 fixtures
- West side: 3 fixtures

**Court Spotlights (96):**
- 24 tennis courts
- 4 spotlights per court
- Corner-mounted configuration

**Ambient Lights (32):**
- Reception area: 1 light
- Level 1 corridors: 8 lights
- Level 2 corridors: 8 lights
- Level 3 corridors: 8 lights
- Circulation spaces: 7 lights

### Shadow Map Budget

- Sun/Moon: 2048×2048 (4MB)
- Floodlights: 16 × 1024×1024 (16MB)
- **Total: ~20MB shadow memory**

### Performance Metrics

- Target FPS: 60 (high quality)
- Light update time: <5ms
- Shadow update time: <10ms
- Total render time: <16ms (60 FPS)

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ⚠️ Mobile (use low/medium quality)

## Customization

### Custom Time Preset

```typescript
// Edit TIME_PRESETS in LightingSystem.tsx
const TIME_PRESETS = {
  // ... existing presets
  custom: {
    skyColor: '#yourColor',
    sunIntensity: 1.5,
    // ... other properties
  }
};
```

### Custom Light Positions

```typescript
// Add to generateCourtLightPositions()
fixtures.push({
  position: [x, y, z],
  intensity: 10,
  color: '#ffffff',
  distance: 50,
  angle: Math.PI / 3,
  penumbra: 0.2,
});
```

### Custom Modes

```typescript
// Add to lighting state calculation
const lightingState = useMemo(() => {
  if (config.mode === 'yourCustomMode') {
    return {
      floodlights: true,
      courtLights: false,
      ambient: true,
    };
  }
  // ... existing logic
}, [config]);
```

## Troubleshooting

**Scene too dark?**
```typescript
initialConfig={{ ambientIntensity: 0.8 }}
```

**Shadows not showing?**
- Check `<Canvas shadows>`
- Verify `receiveShadow` on meshes
- Use quality: 'medium' or higher

**Performance issues?**
```typescript
initialConfig={{
  quality: 'medium',
  bloomStrength: 0,
  fogDensity: 0,
  floodlightsEnabled: false
}}
```

**Colors washed out?**
```typescript
// Adjust bloom threshold
<Bloom luminanceThreshold={0.8} />
```

## Examples in the Wild

```typescript
// Sunset match visualization
<LightingSystem
  initialConfig={{
    timeOfDay: 'dusk',
    mode: 'sports',
    bloomStrength: 1.5,
    fogDensity: 0.002
  }}
/>

// Morning practice session
<LightingSystem
  initialConfig={{
    timeOfDay: 'dawn',
    mode: 'maintenance',
    courtLightsEnabled: true
  }}
/>

// Night championship
<LightingSystem
  initialConfig={{
    timeOfDay: 'night',
    mode: 'event',
    floodlightsEnabled: true,
    bloomStrength: 2.0
  }}
/>
```

## Contributing

To extend the lighting system:

1. Add new time presets in `TIME_PRESETS`
2. Create new light fixtures in generator functions
3. Add modes to `LightingMode` type
4. Update tests in `LightingSystem.test.tsx`
5. Document changes in `LIGHTING_SYSTEM.md`

## License

Part of ACE Tennis Facility Visualization Project

## Credits

Built with:
- Three.js for WebGL rendering
- React Three Fiber for React integration
- React Three Postprocessing for effects
- Physically-based rendering principles

---

**Version**: 1.0.0
**Last Updated**: 2025-11-22
**Component**: `/components/LightingSystem.tsx`
