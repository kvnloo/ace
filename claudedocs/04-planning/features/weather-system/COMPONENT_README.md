# Weather System - Quick Start Guide

## 🌦️ What's Included

Dynamic weather effects system for the tennis facility 3D visualization with:
- Rain, snow, wind, storm, and clear weather
- Real-time particle systems (2000+ particles)
- Smooth weather transitions
- Wet surface reflections
- Atmospheric lighting
- Gameplay condition impacts

## 📦 Files Created

```
components/
├── WeatherSystem.tsx          # Main component with all weather effects
├── WeatherControls.tsx        # UI controls for weather manipulation
├── WeatherSystemExample.tsx   # Complete demo/example
└── WEATHER_README.md          # This file

docs/
└── WEATHER_SYSTEM.md          # Comprehensive documentation

types/
└── weather.d.ts               # TypeScript definitions
```

## 🚀 Quick Integration (3 Steps)

### Step 1: Import Components

Add to `ThreeScene.tsx`:

```tsx
import WeatherSystem, { useWeather } from './WeatherSystem';
import WeatherControls from './WeatherControls';
```

### Step 2: Add Weather Hook

Inside your `ThreeScene` component:

```tsx
const { weather, intensity, changeWeather, setIntensity } = useWeather();
```

### Step 3: Add to Scene

Inside your `<Canvas>`:

```tsx
<Canvas shadows dpr={[1, 1.5]} camera={{ position: [180, 100, 180], fov: 35 }}>
  {/* Your existing content */}

  <WeatherSystem
    weather={weather}
    intensity={intensity}
    areaSize={[300, 300]}
    enableWetSurfaces={true}
    enableEffects={true}
  />

  {/* Rest of scene */}
</Canvas>
```

And add controls outside Canvas:

```tsx
<WeatherControls
  currentWeather={weather}
  onWeatherChange={changeWeather}
  intensity={intensity}
  onIntensityChange={setIntensity}
/>
```

## 💻 Test the Example

Run the standalone example to see all features:

```tsx
// In your app, temporarily render:
import WeatherSystemExample from './components/WeatherSystemExample';

<WeatherSystemExample />
```

Then navigate to the page to see:
- All weather types
- Interactive controls
- Performance indicators
- Gameplay impact display

## 🎮 Available Weather Types

| Type | Effect | Particle Count | Use Case |
|------|--------|----------------|----------|
| `clear` | Sunny with dynamic sun | 0 | Optimal gameplay |
| `rain` | Rain droplets with splash | 2000 | Wet surface, reduced visibility |
| `snow` | Gentle snowfall | 1500 | Slippery surface, ball tracking difficulty |
| `windy` | Wind particles | 500 | Ball trajectory affected |
| `storm` | Heavy rain + strong wind | 3000 | Challenging conditions |

## ⚙️ Configuration Options

### Minimal Setup

```tsx
<WeatherSystem weather="rain" />
```

### Full Configuration

```tsx
<WeatherSystem
  weather="rain"
  intensity={0.8}
  areaSize={[500, 500]}
  enableWetSurfaces={true}
  enableEffects={true}
  transitionDuration={5}
  onWeatherChange={(w) => console.log('Weather:', w)}
/>
```

## 🎨 Customization Examples

### Auto-Cycling Weather

```tsx
useEffect(() => {
  const weathers = ['clear', 'rain', 'snow', 'windy'];
  let index = 0;

  const interval = setInterval(() => {
    changeWeather(weathers[index++ % weathers.length]);
  }, 30000);

  return () => clearInterval(interval);
}, []);
```

### Performance Mode

```tsx
const [performanceMode, setPerformanceMode] = useState(false);

<WeatherSystem
  weather={weather}
  intensity={performanceMode ? 0.3 : 0.7}
  enableEffects={!performanceMode}
/>
```

### Gameplay Integration

```tsx
<WeatherSystem
  weather={weather}
  onWeatherChange={(w) => {
    // Update physics
    if (w === 'rain' || w === 'storm') {
      setSurfaceFriction(0.7);
    }
    // Update AI difficulty
    if (w === 'windy') {
      setAIDifficulty('hard');
    }
  }}
/>
```

## 📊 Performance Tips

### For 60 FPS Target

```tsx
<WeatherSystem
  weather={weather}
  intensity={0.5}        // Lower intensity
  areaSize={[200, 200]}  // Smaller area
  enableWetSurfaces={false} // Disable reflections
/>
```

### For High-End Systems

```tsx
<WeatherSystem
  weather={weather}
  intensity={1.0}
  areaSize={[500, 500]}
  enableWetSurfaces={true}
  enableEffects={true}
/>
```

## 🐛 Troubleshooting

**Particles not visible?**
- Check `enableEffects={true}`
- Verify `intensity > 0`
- Ensure camera is within particle area

**Performance issues?**
- Reduce `intensity` to 0.3-0.5
- Decrease `areaSize`
- Disable `enableWetSurfaces`
- Lower particle counts in component

**Transitions not smooth?**
- Increase `transitionDuration` to 5-10 seconds
- Check overall FPS (needs to be stable 30+)

## 📚 Full Documentation

See `/docs/WEATHER_SYSTEM.md` for:
- Complete API reference
- Advanced customization
- Performance benchmarks
- Adding new weather types
- Integration examples
- Best practices

## 🎯 Next Steps

1. ✅ Test the example (`WeatherSystemExample.tsx`)
2. ✅ Integrate into `ThreeScene.tsx`
3. ✅ Customize weather types for your needs
4. ✅ Add gameplay mechanics integration
5. ✅ Optimize for your target devices

## 💡 Usage Ideas

- **Tournament Mode**: Clear weather only
- **Challenge Mode**: Random weather changes
- **Training Mode**: User-selectable weather
- **Realism Mode**: Weather based on real location/time
- **Season Mode**: Snow in winter, rain in spring, etc.

## 🤝 Integration with Existing Components

### With Grass Component

Weather affects wind strength in grass:

```tsx
<Grass
  position={[0, 0, 0]}
  size={[100, 100]}
  animated={weather === 'windy' || weather === 'storm'}
/>
```

### With Court Surfaces

Adjust material properties based on wetness:

```tsx
const surfaceRoughness = wetness > 0.5 ? 0.3 : 0.7;
```

### With Lighting

Weather system handles atmospheric lighting automatically,
but you can extend it with custom lights.

## 📝 Example Output

When integrated, you'll see:
- Rain particles falling from sky with wind drift
- Snow gently swaying and rotating
- Wind visible through particle flow
- Wet surfaces with reflective properties
- Dynamic lighting matching weather mood
- Smooth 3-second transitions between states

## 🚀 Ready to Start?

1. Follow the 3-step integration above
2. Test with the demo example
3. Customize for your needs
4. Refer to full docs for advanced features

Happy coding! ☀️🌧️❄️💨⛈️
