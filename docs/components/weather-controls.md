# WeatherControls

## Overview
Interactive UI controls for managing the weather simulation system in the 3D environment. Provides an intuitive interface for selecting weather types, adjusting intensity, and viewing gameplay impact indicators.

## Location
- **Path**: `/src/components/WeatherControls.tsx`
- **Category**: Weather System / UI Controls
- **Related System**: WeatherSystem.tsx

## Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| currentWeather | `WeatherType` | ✓ | Currently active weather condition |
| onWeatherChange | `(weather: WeatherType) => void` | ✓ | Callback when weather type changes |
| intensity | `number` | ✓ | Current weather intensity (0.0 - 1.0) |
| onIntensityChange | `(intensity: number) => void` | ✓ | Callback when intensity changes |

## Weather Types
The component supports five weather conditions:
- **Clear** ☀️ - Optimal playing conditions
- **Rain** 🌧️ - Slower surface, wet bounce, moderate visibility
- **Snow** ❄️ - Slippery surface, difficult ball tracking
- **Windy** 💨 - Affected ball trajectory, high serve difficulty
- **Storm** ⛈️ - Severe weather with reduced visibility

## Features

### Weather Type Selection
- Icon-based buttons for each weather type
- Visual feedback with color-coded borders
- Active state indicator with pulsing animation
- Lucide React icons for consistent design

### Intensity Control
- Range slider (0-100%)
- Real-time percentage display
- Visual gradient showing current level
- Custom tennis-yellow accent color

### Gameplay Impact Indicators
Dynamic feedback showing how weather affects gameplay:
- **Surface conditions** - Court speed and bounce characteristics
- **Visibility** - Player sight lines
- **Ball trajectory** - Wind effects on ball movement
- **Playing difficulty** - Overall challenge level

### Visual Design
- Dark glass-morphism aesthetic
- Backdrop blur for modern UI
- Border glows with tennis-yellow accents
- Responsive hover states
- Smooth transitions and animations

## Usage Example
```tsx
import WeatherControls from './components/WeatherControls';
import { WeatherType } from './components/WeatherSystem';

function Scene() {
  const [weather, setWeather] = useState<WeatherType>('clear');
  const [intensity, setIntensity] = useState(0.5);

  return (
    <>
      <WeatherSystem
        weather={weather}
        intensity={intensity}
      />

      <WeatherControls
        currentWeather={weather}
        onWeatherChange={setWeather}
        intensity={intensity}
        onIntensityChange={setIntensity}
      />
    </>
  );
}
```

## Dependencies
- **React** - Component framework
- **lucide-react** - Icon library (Cloud, CloudRain, CloudSnow, Wind, Sun, CloudDrizzle)
- **WeatherSystem** - Weather type definitions

## Styling
- **Position**: Fixed top-right (top-40, right-6)
- **Z-Index**: 10
- **Width**: Auto-sized based on content
- **Background**: Semi-transparent slate with backdrop blur
- **Borders**: White/10 opacity with accent color highlights

## Related Components
- [WeatherSystem](/docs/components/weather-system.md) - Core weather simulation
- [ThreeScene](/docs/components/three-scene.md) - Main 3D scene container

## Integration Points
- Used in main App component for weather testing
- Coordinates with WeatherSystem for particle effects
- Triggers lighting changes in the scene
- Affects court surface properties

## Performance Notes
- Lightweight UI component with minimal re-renders
- No performance impact on 3D rendering
- Smooth slider interactions with throttled updates

## Notes
- Designed for development/testing purposes
- Can be hidden in production builds
- Intensity affects particle density and visual effects
- Weather changes are instant but can be animated
- Includes helpful tips panel for user guidance

## Browser Compatibility
- Modern browsers with CSS backdrop-filter support
- Graceful degradation on older browsers
- Touch-friendly controls for mobile testing
