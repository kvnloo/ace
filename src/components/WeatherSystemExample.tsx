import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import WeatherSystem, { useWeather, WeatherType } from './WeatherSystem';
import WeatherControls from './WeatherControls';
import Grass from './Grass';

/**
 * WeatherSystemExample Component
 *
 * Demonstration of the weather system integration.
 * Shows how to:
 * 1. Initialize weather system with useWeather hook
 * 2. Integrate with existing scene components
 * 3. Add UI controls for weather manipulation
 * 4. Handle weather-affected vegetation
 *
 * Usage in ThreeScene.tsx:
 * ```tsx
 * import WeatherSystem, { useWeather } from './WeatherSystem';
 * import WeatherControls from './WeatherControls';
 *
 * // Inside your component:
 * const { weather, intensity, changeWeather, setIntensity } = useWeather();
 *
 * // In your JSX:
 * <WeatherSystem
 *   weather={weather}
 *   intensity={intensity}
 *   areaSize={[300, 300]}
 *   enableWetSurfaces={true}
 *   enableEffects={true}
 *   onWeatherChange={(w) => console.log('Weather changed to:', w)}
 * />
 *
 * <WeatherControls
 *   currentWeather={weather}
 *   onWeatherChange={changeWeather}
 *   intensity={intensity}
 *   onIntensityChange={setIntensity}
 * />
 * ```
 */
const WeatherSystemExample: React.FC = () => {
  const { weather, intensity, changeWeather, setIntensity } = useWeather();

  // Handle weather change events
  const handleWeatherChange = (newWeather: WeatherType) => {
    changeWeather(newWeather);
    console.log(`Weather changed to: ${newWeather}`);
  };

  return (
    <div className="w-full h-screen relative bg-slate-900">
      {/* UI Controls */}
      <WeatherControls
        currentWeather={weather}
        onWeatherChange={handleWeatherChange}
        intensity={intensity}
        onIntensityChange={setIntensity}
      />

      {/* Info Panel */}
      <div className="absolute top-6 left-6 z-10 bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xl max-w-md">
        <h2 className="text-lg font-bold text-white mb-2">Weather System Demo</h2>
        <p className="text-sm text-white/70 mb-3">
          Dynamic weather effects with particle systems, lighting transitions, and surface interactions.
        </p>
        <div className="space-y-2 text-xs text-white/60">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <span>Real-time particle systems (rain, snow, wind)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span>Smooth weather transitions</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-400" />
            <span>Dynamic atmospheric lighting</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span>Wet surface reflections</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            <span>Wind-affected vegetation</span>
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="absolute bottom-6 left-6 z-10 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 text-xs text-white/70 font-mono">
        Current: <span className="text-tennis-yellow font-bold">{weather.toUpperCase()}</span>
        {' | '}
        Intensity: <span className="text-tennis-yellow font-bold">{Math.round(intensity * 100)}%</span>
      </div>

      {/* 3D Scene */}
      <Canvas shadows dpr={[1, 2]} camera={{ position: [50, 30, 50], fov: 50 }}>
        <PerspectiveCamera makeDefault />

        {/* Weather System - Main Component */}
        <WeatherSystem
          weather={weather}
          intensity={intensity}
          areaSize={[200, 200]}
          enableWetSurfaces={true}
          enableEffects={true}
          transitionDuration={3}
          onWeatherChange={(w) => console.log('Weather transition to:', w)}
        />

        {/* Environment */}
        <Environment preset="sunset" />

        {/* Scene Lighting (supplementary to weather lighting) */}
        <hemisphereLight intensity={0.2} groundColor="#555555" />

        {/* Ground Plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[200, 200]} />
          <meshStandardMaterial color="#2a5a2a" roughness={0.8} metalness={0.1} />
        </mesh>

        {/* Grass - Wind-affected by weather system */}
        <Grass
          position={[0, 0, 0]}
          size={[80, 80]}
          bladeCount={3000}
          color="#3a7a3a"
          animated={true}
        />

        {/* Sample Tennis Court */}
        <group position={[0, 0.05, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[23.77, 10.97]} />
            <meshStandardMaterial color="#4d7c0f" roughness={0.7} />
          </mesh>
          {/* Court lines */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
            <planeGeometry args={[23.77, 10.97]} />
            <meshBasicMaterial color="white" wireframe opacity={0.8} transparent />
          </mesh>
        </group>

        {/* Reference Objects - Trees affected by wind */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const radius = 60;
          return (
            <group
              key={i}
              position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}
            >
              {/* Tree trunk */}
              <mesh position={[0, 2, 0]} castShadow>
                <cylinderGeometry args={[0.3, 0.5, 4]} />
                <meshStandardMaterial color="#5a3a1a" />
              </mesh>
              {/* Tree foliage */}
              <mesh position={[0, 5, 0]} castShadow>
                <sphereGeometry args={[2.5, 8, 8]} />
                <meshStandardMaterial color="#2d5a2d" roughness={0.9} />
              </mesh>
            </group>
          );
        })}

        {/* Sample Building/Structure */}
        <mesh position={[0, 3, -40]} castShadow receiveShadow>
          <boxGeometry args={[30, 6, 15]} />
          <meshStandardMaterial color="#4a5568" roughness={0.6} metalness={0.2} />
        </mesh>

        <OrbitControls
          enablePan={true}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.2}
          minDistance={10}
          maxDistance={150}
        />
      </Canvas>
    </div>
  );
};

export default WeatherSystemExample;
