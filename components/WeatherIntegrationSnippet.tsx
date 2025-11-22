/**
 * Weather System Integration Snippet
 *
 * Copy and paste this code into your ThreeScene.tsx to add weather system.
 * This file is for reference only - do not import directly.
 *
 * @example
 * // STEP 1: Add imports at the top of ThreeScene.tsx
 * import WeatherSystem, { useWeather } from './WeatherSystem';
 * import WeatherControls from './WeatherControls';
 *
 * // STEP 2: Add hook inside ThreeScene component
 * const { weather, intensity, changeWeather, setIntensity } = useWeather();
 *
 * // STEP 3: Add WeatherSystem inside Canvas and WeatherControls in UI
 */

import React from 'react';

// Type-safe documentation component - prevents TS errors
const WeatherIntegrationSnippet: React.FC = () => null;

export default WeatherIntegrationSnippet;

/* ============================================
   INTEGRATION CODE (Copy sections as needed)
   ============================================

STEP 1: Add imports at the top of ThreeScene.tsx
------------------------------------------------
import WeatherSystem, { useWeather } from './WeatherSystem';
import WeatherControls from './WeatherControls';

STEP 2: Add hook inside ThreeScene component
---------------------------------------------
const ThreeScene: React.FC<ThreeSceneProps> = ({ onFeatureSelect }) => {
  // Existing state...
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeFloor, setActiveFloor] = useState<FloorLevel>('ALL');

  // ADD THIS: Weather system hook
  const { weather, intensity, changeWeather, setIntensity } = useWeather();

  // Rest of component...

STEP 3: Add WeatherSystem inside Canvas
----------------------------------------
  return (
    <div className="w-full h-full absolute inset-0">
      {/* Existing UI controls */}
      <ControlsOverlay {...props} />

      {/* ADD THIS: Weather Controls UI */}
      <WeatherControls
        currentWeather={weather}
        onWeatherChange={changeWeather}
        intensity={intensity}
        onIntensityChange={setIntensity}
      />

      <Canvas shadows dpr={[1, 1.5]} camera={{ position: [180, 100, 180], fov: 35 }}>
        <CameraRig {...cameraProps} />
        <PerspectiveCamera makeDefault fov={40} />

        {/* Existing lights */}
        <ambientLight intensity={0.4} />
        <directionalLight {...lightProps} />
        <Environment preset="park" />

        {/* ADD THIS: Weather System */}
        <WeatherSystem
          weather={weather}
          intensity={intensity}
          areaSize={[300, 300]}
          enableWetSurfaces={true}
          enableEffects={true}
          transitionDuration={3}
          onWeatherChange={(newWeather) => {
            console.log('Weather changed to:', newWeather);
            // Optional: Add gameplay mechanics updates here
            // Example: Update surface friction, visibility, ball physics
          }}
        />

        {/* Your existing scene content */}
        <group>
          <BuildingShell activeFloor={activeFloor} />
          <CampusGrounds />
          {/* ... rest of scene ... */}
        </group>

        <OrbitControls {...orbitProps} />
      </Canvas>

      {/* Existing UI elements */}
      <div className="absolute bottom-8 left-1/2 ...">
        ECO-FACILITY VIEWER v3.3
      </div>
    </div>
  );
};

// ============================================
// OPTIONAL: Advanced Integration Examples
// ============================================

// Example 1: Auto-cycling weather every 30 seconds
/*
useEffect(() => {
  const weathers = ['clear', 'rain', 'snow', 'windy', 'storm'];
  let index = 0;

  const interval = setInterval(() => {
    changeWeather(weathers[index % weathers.length]);
    index++;
  }, 30000);

  return () => clearInterval(interval);
}, [changeWeather]);
*/

// Example 2: Weather-based gameplay updates
/*
<WeatherSystem
  weather={weather}
  intensity={intensity}
  onWeatherChange={(newWeather) => {
    // Update surface properties
    const surfaceConfig = {
      clear: { friction: 1.0, bounce: 1.0, visibility: 1.0 },
      rain: { friction: 0.7, bounce: 0.8, visibility: 0.8 },
      snow: { friction: 0.5, bounce: 0.6, visibility: 0.7 },
      windy: { friction: 1.0, bounce: 1.0, visibility: 1.0 },
      storm: { friction: 0.6, bounce: 0.7, visibility: 0.6 }
    };

    const config = surfaceConfig[newWeather];
    // Apply to your game physics
    console.log('Surface config:', config);
  }}
/>
*/

// Example 3: Performance-aware mode
/*
const [performanceMode, setPerformanceMode] = useState(false);

// Detect low FPS and enable performance mode
useEffect(() => {
  let fps = 60;
  // FPS detection logic...

  if (fps < 30) {
    setPerformanceMode(true);
  }
}, []);

<WeatherSystem
  weather={weather}
  intensity={performanceMode ? 0.3 : intensity}
  enableEffects={!performanceMode}
  areaSize={performanceMode ? [200, 200] : [300, 300]}
/>
*/

// Example 4: Weather synchronized with grass animation
/*
// In your Grass component props:
<Grass
  position={[0, 0, 0]}
  size={[80, 80]}
  animated={weather === 'windy' || weather === 'storm'}
  // If you extend Grass component with wind parameter:
  // windStrength={weather === 'storm' ? intensity * 2 : intensity}
/>
*/

// ============================================
// CONFIGURATION PRESETS
// ============================================

// High-end devices (60 FPS target)
const highEndConfig = {
  intensity: 1.0,
  areaSize: [500, 500] as [number, number],
  enableEffects: true,
  enableWetSurfaces: true
};

// Mid-range devices (45 FPS target)
const midRangeConfig = {
  intensity: 0.7,
  areaSize: [300, 300] as [number, number],
  enableEffects: true,
  enableWetSurfaces: true
};

// Low-end devices (30 FPS target)
const lowEndConfig = {
  intensity: 0.3,
  areaSize: [200, 200] as [number, number],
  enableEffects: true,
  enableWetSurfaces: false
};

// Usage:
// const config = highEndConfig; // Choose based on device detection
// <WeatherSystem weather={weather} {...config} />

// ============================================
// NOTES
// ============================================

/*
1. All dependencies are already in package.json (no npm install needed)
2. TypeScript types are available in types/weather.d.ts
3. See docs/WEATHER_SYSTEM.md for full documentation
4. See components/WeatherSystemExample.tsx for standalone demo
5. Run npm run test to verify everything works

Weather Types Available:
- 'clear'  - Sunny with dynamic sun
- 'rain'   - Rain droplets with splash (2000 particles)
- 'snow'   - Gentle snowfall (1500 particles)
- 'windy'  - Wind particles (500 particles)
- 'storm'  - Heavy rain + wind (3000 particles)

Performance Tips:
- Start with intensity 0.5 and increase if FPS allows
- Reduce areaSize if covering smaller scene area
- Disable enableWetSurfaces on low-end devices
- Monitor browser DevTools for GPU usage
*/

export {};
