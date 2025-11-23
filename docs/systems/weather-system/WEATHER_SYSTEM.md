# Weather System Documentation

## Overview

The Weather System provides dynamic, realistic weather effects for the tennis facility 3D visualization. It includes particle-based precipitation, atmospheric lighting, wind effects, and surface interactions.

## Features

### 🌧️ Weather Types

1. **Clear** - Sunny conditions with dynamic sun position
2. **Rain** - Realistic rain droplets with wind drift and splash effects
3. **Snow** - Gentle snowfall with rotation and wind sway
4. **Windy** - Visible wind particles and environmental effects
5. **Storm** - Heavy rain with reduced visibility and strong wind

### ✨ Visual Effects

- **Particle Systems**: Instanced meshes for high-performance rain (2000 particles) and snow (1500 particles)
- **Wind Effects**: Dynamic particle flow and vegetation sway
- **Atmospheric Lighting**: Weather-appropriate lighting transitions
- **Wet Surfaces**: Reflective ground effects during/after rain
- **Sun Effects**: Dynamic sun position with volumetric rays
- **Smooth Transitions**: Customizable blend between weather states (default 3s)

### ⚡ Performance Optimizations

- Instanced rendering for particles (minimal draw calls)
- Frustum culling disabled for particles (boundary optimization)
- LOD-ready architecture
- Efficient particle recycling
- Conditional rendering based on weather state

## Installation

### Files Created

```
components/
├── WeatherSystem.tsx       # Main weather system component
├── WeatherControls.tsx     # UI controls for weather manipulation
└── WeatherSystemExample.tsx # Integration example
```

### Dependencies

All dependencies are already in the project:
- `@react-three/fiber` - React Three.js renderer
- `@react-three/drei` - Helper components
- `three` - 3D library
- `lucide-react` - Icons for UI

## Usage

### Basic Integration

```tsx
import WeatherSystem, { useWeather } from './components/WeatherSystem';
import WeatherControls from './components/WeatherControls';

function MyScene() {
  const { weather, intensity, changeWeather, setIntensity } = useWeather();

  return (
    <>
      {/* Add to your Canvas component */}
      <Canvas>
        <WeatherSystem
          weather={weather}
          intensity={intensity}
          areaSize={[300, 300]}
          enableWetSurfaces={true}
          enableEffects={true}
        />
        {/* Your other 3D objects */}
      </Canvas>

      {/* UI Controls */}
      <WeatherControls
        currentWeather={weather}
        onWeatherChange={changeWeather}
        intensity={intensity}
        onIntensityChange={setIntensity}
      />
    </>
  );
}
```

### Integration with ThreeScene.tsx

Add to your existing `ThreeScene.tsx`:

```tsx
// 1. Import at the top
import WeatherSystem, { useWeather } from './WeatherSystem';
import WeatherControls from './WeatherControls';

// 2. Add hook inside ThreeScene component
const { weather, intensity, changeWeather, setIntensity } = useWeather();

// 3. Add WeatherSystem inside <Canvas>
<Canvas shadows dpr={[1, 1.5]} camera={{ position: [180, 100, 180], fov: 35 }}>
  {/* Existing content */}

  <WeatherSystem
    weather={weather}
    intensity={intensity}
    areaSize={[300, 300]}
    enableWetSurfaces={true}
    enableEffects={true}
    transitionDuration={3}
  />

  {/* Rest of your scene */}
</Canvas>

// 4. Add WeatherControls outside Canvas (in the JSX return)
<WeatherControls
  currentWeather={weather}
  onWeatherChange={changeWeather}
  intensity={intensity}
  onIntensityChange={setIntensity}
/>
```

### Advanced Configuration

```tsx
<WeatherSystem
  weather="rain"
  intensity={0.8}
  areaSize={[500, 500]}
  enableWetSurfaces={true}
  enableEffects={true}
  transitionDuration={5}
  onWeatherChange={(weather) => {
    console.log('Weather changed to:', weather);
    // Update gameplay mechanics based on weather
  }}
/>
```

## API Reference

### WeatherSystem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `weather` | `WeatherType` | `'clear'` | Current weather type |
| `intensity` | `number` | `0.7` | Effect intensity (0-1) |
| `areaSize` | `[number, number]` | `[300, 300]` | Coverage area [width, depth] |
| `enableEffects` | `boolean` | `true` | Enable visual effects |
| `enableWetSurfaces` | `boolean` | `true` | Enable wet reflections |
| `transitionDuration` | `number` | `3` | Transition time in seconds |
| `onWeatherChange` | `(weather: WeatherType) => void` | - | Weather change callback |

### WeatherType

```tsx
type WeatherType = 'clear' | 'rain' | 'snow' | 'windy' | 'storm';
```

### useWeather Hook

```tsx
const {
  weather,          // Current weather state
  intensity,        // Current intensity (0-1)
  changeWeather,    // (weather, intensity?) => void
  setWeather,       // (weather) => void
  setIntensity      // (intensity) => void
} = useWeather();
```

### WeatherControls Props

| Prop | Type | Description |
|------|------|-------------|
| `currentWeather` | `WeatherType` | Active weather type |
| `onWeatherChange` | `(weather: WeatherType) => void` | Weather change handler |
| `intensity` | `number` | Current intensity (0-1) |
| `onIntensityChange` | `(intensity: number) => void` | Intensity change handler |

## Gameplay Integration

### Weather Impact on Conditions

The weather system can affect gameplay through the `onWeatherChange` callback:

```tsx
const [surfaceFriction, setSurfaceFriction] = useState(1.0);
const [visibility, setVisibility] = useState(1.0);

<WeatherSystem
  weather={weather}
  intensity={intensity}
  onWeatherChange={(weather) => {
    switch(weather) {
      case 'rain':
      case 'storm':
        setSurfaceFriction(0.7);
        setVisibility(weather === 'storm' ? 0.6 : 0.8);
        break;
      case 'snow':
        setSurfaceFriction(0.5);
        setVisibility(0.7);
        break;
      case 'windy':
        // Affect ball trajectory calculations
        break;
      default:
        setSurfaceFriction(1.0);
        setVisibility(1.0);
    }
  }}
/>
```

### Wind-Affected Vegetation

The weather system's wind effects can be synchronized with grass/vegetation:

```tsx
// In your grass component
const windStrength = weather === 'windy' || weather === 'storm'
  ? intensity * 2
  : 0;

<Grass
  position={[0, 0, 0]}
  size={[100, 100]}
  animated={true}
  // Add wind parameter if extending Grass component
/>
```

## Performance Tuning

### Particle Count Adjustment

Modify particle counts based on device capabilities:

```tsx
// In WeatherSystem.tsx, adjust these values:
const particleCount = Math.floor(2000 * intensity); // Rain
const particleCount = Math.floor(1500 * intensity); // Snow
const particleCount = Math.floor(500 * intensity);  // Wind
```

### Conditional Effects

Disable effects on low-end devices:

```tsx
const [enableEffects, setEnableEffects] = useState(true);

// Detect performance and adjust
useEffect(() => {
  if (fps < 30) {
    setEnableEffects(false);
  }
}, [fps]);

<WeatherSystem
  weather={weather}
  enableEffects={enableEffects}
/>
```

### Area Size Optimization

Reduce coverage area for better performance:

```tsx
<WeatherSystem
  areaSize={[200, 200]} // Smaller area = better performance
/>
```

## Testing

### Visual Testing

1. Run the example:
```bash
npm run dev
```

2. Open browser to see WeatherSystemExample
3. Use UI controls to test each weather type
4. Verify smooth transitions
5. Check particle performance

### Integration Testing

Test weather system in production scene:

```bash
# Run with performance monitoring
npm run dev

# Check browser console for:
# - Weather change logs
# - FPS counter
# - Particle counts
```

### Performance Benchmarks

Target performance metrics:

| Weather Type | Particle Count | Target FPS | GPU Load |
|--------------|----------------|------------|----------|
| Clear | 0 | 60 | Low |
| Rain | 2000 | 45+ | Medium |
| Snow | 1500 | 50+ | Medium |
| Windy | 500 | 55+ | Low-Medium |
| Storm | 3000 | 40+ | High |

## Customization

### Adding New Weather Types

1. Add type to `WeatherType`:
```tsx
export type WeatherType = 'clear' | 'rain' | 'snow' | 'windy' | 'storm' | 'fog';
```

2. Implement effect component:
```tsx
const FogEffect: React.FC<{...}> = ({...}) => {
  // Fog implementation
};
```

3. Add to WeatherSystem:
```tsx
{(currentWeather === 'fog' || targetWeather === 'fog') && enableEffects && (
  <FogEffect intensity={getCurrentIntensity()} />
)}
```

4. Configure lighting:
```tsx
case 'fog':
  return { directional: 0.4, ambient: 0.5, color: '#d3d3d3' };
```

### Customizing Particles

Modify particle appearance in effect components:

```tsx
// Rain - change color, size, speed
<meshBasicMaterial
  color="#a0c4ff"  // Lighter blue
  opacity={0.8}    // More visible
/>

// Snow - change shape, rotation
<octahedronGeometry args={[0.7, 0]} /> // Larger flakes
```

### Extending Wet Surface Effects

Add more detailed reflections:

```tsx
const WetSurfaceEffect: React.FC<{...}> = ({...}) => {
  return (
    <>
      <mesh>
        {/* Base wetness layer */}
      </mesh>
      <mesh>
        {/* Puddle effects */}
      </mesh>
      <mesh>
        {/* Droplet impacts */}
      </mesh>
    </>
  );
};
```

## Troubleshooting

### Particles Not Appearing

1. Check if `enableEffects` is `true`
2. Verify `intensity > 0`
3. Ensure camera is within particle area
4. Check browser console for errors

### Performance Issues

1. Reduce particle counts
2. Decrease `areaSize`
3. Disable `enableWetSurfaces`
4. Lower `intensity`
5. Check GPU usage in browser DevTools

### Transition Not Smooth

1. Increase `transitionDuration`
2. Check for other heavy computations
3. Verify frame rate is stable
4. Reduce particle counts during transition

### Lighting Too Dark/Bright

Adjust lighting configuration in `AtmosphericLighting`:

```tsx
case 'rain':
  return { directional: 0.7, ambient: 0.5, color: '#b0c4de' };
```

## Examples

### Automatic Weather Cycling

```tsx
useEffect(() => {
  const weathers: WeatherType[] = ['clear', 'rain', 'snow', 'windy', 'storm'];
  let index = 0;

  const interval = setInterval(() => {
    index = (index + 1) % weathers.length;
    changeWeather(weathers[index]);
  }, 30000); // Change every 30 seconds

  return () => clearInterval(interval);
}, []);
```

### Reactive Weather Based on Time

```tsx
useEffect(() => {
  const hour = new Date().getHours();

  if (hour >= 6 && hour < 18) {
    changeWeather('clear');
  } else if (hour >= 18 && hour < 21) {
    changeWeather('windy');
  } else {
    changeWeather('rain', 0.3);
  }
}, []);
```

### Weather API Integration

```tsx
useEffect(() => {
  fetch('https://api.weather.com/...')
    .then(res => res.json())
    .then(data => {
      const weatherMap = {
        'sunny': 'clear',
        'rainy': 'rain',
        'snowy': 'snow',
        'cloudy': 'windy'
      };
      changeWeather(weatherMap[data.condition] || 'clear');
    });
}, []);
```

## Best Practices

1. **Performance First**: Start with lower particle counts and increase based on device capabilities
2. **Smooth Transitions**: Use default 3s transition for natural feel
3. **Gameplay Integration**: Update game physics when weather changes
4. **Visual Feedback**: Show weather status in UI for player awareness
5. **Accessibility**: Provide option to disable effects for motion sensitivity
6. **Progressive Enhancement**: Detect device capabilities and adjust accordingly

## Future Enhancements

Potential additions to the weather system:

- [ ] Fog effect with distance-based opacity
- [ ] Lightning strikes during storms
- [ ] Rainbow after rain
- [ ] Particle collision with objects
- [ ] Sound effects integration
- [ ] Seasonal variations
- [ ] Cloud rendering
- [ ] Ground puddle formation
- [ ] Ice formation during snow
- [ ] Heat haze for clear/sunny weather

## Support

For issues or questions:
1. Check this documentation
2. Review example implementation
3. Check browser console for errors
4. Verify Three.js and R3F versions match project requirements

## Credits

Built using:
- React Three Fiber (@react-three/fiber)
- Three.js
- React Three Drei (@react-three/drei)
- Lucide Icons (lucide-react)
