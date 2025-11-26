# Weather System Quick Reference Card

## 🚀 Quick Start (Copy-Paste Ready)

```tsx
// 1. Import
import WeatherSystem, { useWeather } from './components/WeatherSystem';
import WeatherControls from './components/WeatherControls';

// 2. In component
const { weather, intensity, changeWeather, setIntensity } = useWeather();

// 3. In Canvas
<WeatherSystem weather={weather} intensity={intensity} areaSize={[300, 300]} />

// 4. Outside Canvas
<WeatherControls currentWeather={weather} onWeatherChange={changeWeather}
                 intensity={intensity} onIntensityChange={setIntensity} />
```

## 📊 Weather Types Reference

| Type | Particles | FPS Impact | Visual Effect | Best For |
|------|-----------|------------|---------------|----------|
| `clear` | 0 | None | Dynamic sun | Demos, gameplay |
| `rain` | 2000 | Medium | Droplets + splash | Realism |
| `snow` | 1500 | Low-Med | Gentle fall | Seasonal |
| `windy` | 500 | Low | Visible flow | Challenges |
| `storm` | 3000 | High | Heavy rain + wind | Drama |

## ⚙️ Common Configurations

### High Performance (60 FPS)
```tsx
<WeatherSystem weather="clear" intensity={0.5} areaSize={[200, 200]}
               enableEffects={true} enableWetSurfaces={false} />
```

### Balanced (45 FPS)
```tsx
<WeatherSystem weather="rain" intensity={0.7} areaSize={[300, 300]}
               enableEffects={true} enableWetSurfaces={true} />
```

### Maximum Quality (30 FPS+)
```tsx
<WeatherSystem weather="storm" intensity={1.0} areaSize={[500, 500]}
               enableEffects={true} enableWetSurfaces={true} />
```

## 🎯 Props Quick Ref

| Prop | Type | Default | Range | Effect |
|------|------|---------|-------|--------|
| `weather` | WeatherType | 'clear' | 5 types | Current weather |
| `intensity` | number | 0.7 | 0.0-1.0 | Particle density |
| `areaSize` | [number, number] | [300, 300] | Any | Coverage area |
| `enableEffects` | boolean | true | - | Toggle particles |
| `enableWetSurfaces` | boolean | true | - | Wet reflections |
| `transitionDuration` | number | 3 | 0-10 | Blend time (s) |

## 🎮 Gameplay Integration

```tsx
<WeatherSystem
  weather={weather}
  onWeatherChange={(w) => {
    const impacts = {
      clear: { friction: 1.0, visibility: 1.0 },
      rain: { friction: 0.7, visibility: 0.8 },
      snow: { friction: 0.5, visibility: 0.7 },
      storm: { friction: 0.6, visibility: 0.6 }
    };
    updateGamePhysics(impacts[w]);
  }}
/>
```

## 🔧 Common Patterns

### Auto-Cycle Weather
```tsx
useEffect(() => {
  const cycle = ['clear', 'rain', 'snow', 'windy'];
  let i = 0;
  const timer = setInterval(() =>
    changeWeather(cycle[i++ % cycle.length]), 30000);
  return () => clearInterval(timer);
}, []);
```

### Performance Detection
```tsx
const [mode, setMode] = useState('high');
useEffect(() => {
  // FPS detection logic
  if (fps < 30) setMode('low');
}, [fps]);

const config = {
  high: { intensity: 1.0, area: [500, 500] },
  low: { intensity: 0.3, area: [200, 200] }
}[mode];
```

### Weather-Affected Grass
```tsx
<Grass
  animated={weather === 'windy' || weather === 'storm'}
  size={[100, 100]}
/>
```

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| No particles | Check `enableEffects={true}`, `intensity > 0` |
| Low FPS | Reduce `intensity` to 0.3, smaller `areaSize` |
| Jerky transitions | Increase `transitionDuration` to 5-10s |
| Particles too dense | Lower `intensity` or reduce area |
| Not visible | Verify camera is within `areaSize` bounds |

## 📈 Performance Targets

| Particle Count | Expected FPS | Device Tier |
|----------------|--------------|-------------|
| 0-500 | 60 | Any |
| 500-1500 | 50+ | Mid-range+ |
| 1500-2500 | 40+ | High-end |
| 2500+ | 30+ | Gaming PC |

## 🎨 Customization Quick Hits

### Change Rain Color
```tsx
// In WeatherSystem.tsx, RainEffect component
<meshBasicMaterial color="#yourcolor" opacity={0.6} />
```

### Adjust Particle Speed
```tsx
// In particle initialization
velocity: new THREE.Vector3(0, -20, 0) // Faster
velocity: new THREE.Vector3(0, -10, 0) // Slower
```

### Modify Lighting
```tsx
// In AtmosphericLighting, add new weather case
case 'yourweather':
  return { directional: 0.8, ambient: 0.5, color: '#yourcolor' };
```

## 📚 File Locations

```
components/
├── WeatherSystem.tsx          # Main (575 lines)
├── WeatherControls.tsx        # UI (155 lines)
├── WeatherSystemExample.tsx   # Demo (190 lines)
└── WeatherIntegrationSnippet.tsx # Reference

docs/
├── WEATHER_SYSTEM.md          # Full docs
├── WEATHER_ARCHITECTURE.md    # Architecture
└── WEATHER_QUICK_REFERENCE.md # This file

types/
└── weather.d.ts               # TypeScript

tests/
└── WeatherSystem.test.tsx     # Tests
```

## 🔑 Key Functions

### useWeather Hook
```tsx
const { weather, intensity, changeWeather, setWeather, setIntensity } = useWeather();

changeWeather('rain', 0.8);  // Change with intensity
setWeather('snow');           // Change type only
setIntensity(0.5);           // Change intensity only
```

### Weather Callbacks
```tsx
<WeatherSystem
  onWeatherChange={(newWeather) => {
    console.log('Now:', newWeather);
    // Your logic here
  }}
/>
```

## 💡 Best Practices

1. **Start Low**: Begin with `intensity={0.5}`, increase if FPS allows
2. **Match Area**: Set `areaSize` to your actual scene bounds
3. **Monitor FPS**: Use browser DevTools Performance tab
4. **Profile First**: Test on lowest target device
5. **Gradual Transitions**: Keep `transitionDuration` ≥ 3s
6. **Conditional Effects**: Toggle based on scene complexity
7. **User Control**: Allow players to adjust quality

## 🎯 Common Use Cases

### Demo/Presentation
```tsx
// Auto-cycle through all weather types
changeWeather(['clear', 'rain', 'snow', 'windy', 'storm'][index]);
```

### Gameplay
```tsx
// Player-controlled weather for training mode
<WeatherControls ... />
```

### Realism
```tsx
// Fixed weather for consistent experience
<WeatherSystem weather="clear" />
```

### Challenge Mode
```tsx
// Random weather changes
changeWeather(randomChoice(['rain', 'snow', 'storm']));
```

## 🚦 Status Indicators

Add to your UI:
```tsx
<div>
  Weather: <span>{weather}</span>
  Intensity: <span>{Math.round(intensity * 100)}%</span>
  Particles: <span>{getParticleCount(weather, intensity)}</span>
</div>
```

## ⚡ Quick Optimizations

```tsx
// Reduce particles
const counts = { rain: 1000, snow: 750, wind: 250 }; // Half default

// Smaller coverage
<WeatherSystem areaSize={[200, 200]} /> // From 300x300

// Disable wet surfaces
<WeatherSystem enableWetSurfaces={false} />

// Lower intensity
<WeatherSystem intensity={0.3} />
```

## 🧪 Testing Commands

```bash
npm run test                  # Run all tests
npm run test:watch           # Watch mode
npm run dev                  # Start dev server
npm run build                # Production build
```

## 📞 Need Help?

1. Check `WEATHER_README.md` for quick start
2. Read `docs/WEATHER_SYSTEM.md` for full API
3. See `WeatherSystemExample.tsx` for integration
4. Review `WEATHER_ARCHITECTURE.md` for internals
5. Run tests to verify setup

---

**Remember**: Weather system is fully self-contained. All dependencies already in package.json. No npm install needed! 🎉
