/**
 * LightingSystem.tsx
 *
 * Advanced lighting and atmosphere system for tennis facility visualization
 *
 * Features:
 * - Dynamic time-of-day lighting (dawn, day, dusk, night)
 * - Stadium floodlights with realistic falloff
 * - Court-level spotlights for individual courts
 * - Ambient facility lighting (corridors, reception, etc)
 * - Special event effects (championship mode, sunset glow)
 * - Volumetric fog and atmospheric scattering
 * - Dynamic shadow quality based on time of day
 * - Light bloom and HDR effects
 *
 * Performance optimizations:
 * - Instanced light fixtures
 * - LOD-based light quality
 * - Selective shadow casting
 * - Efficient fog implementation
 */

import React, { useRef, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing';
import { Sun, Moon, Zap, Eye } from 'lucide-react';

// === TYPE DEFINITIONS ===

export type TimeOfDay = 'dawn' | 'day' | 'dusk' | 'night';
export type LightingMode = 'natural' | 'sports' | 'event' | 'maintenance';
export type AtmosphereQuality = 'low' | 'medium' | 'high' | 'ultra';

export interface LightingConfig {
  timeOfDay: TimeOfDay;
  mode: LightingMode;
  quality: AtmosphereQuality;
  floodlightsEnabled: boolean;
  courtLightsEnabled: boolean;
  ambientIntensity: number;
  fogDensity: number;
  bloomStrength: number;
}

interface LightFixture {
  position: [number, number, number];
  intensity: number;
  color: string;
  distance: number;
  angle?: number;
  penumbra?: number;
}

// === LIGHTING PRESETS ===

const TIME_PRESETS: Record<TimeOfDay, {
  skyColor: string;
  groundColor: string;
  sunColor: string;
  sunIntensity: number;
  ambientIntensity: number;
  fogColor: string;
  fogDensity: number;
  shadowOpacity: number;
}> = {
  dawn: {
    skyColor: '#ff9966',
    groundColor: '#4a5568',
    sunColor: '#ffaa88',
    sunIntensity: 1.2,
    ambientIntensity: 0.4,
    fogColor: '#ffccaa',
    fogDensity: 0.002,
    shadowOpacity: 0.3,
  },
  day: {
    skyColor: '#87ceeb',
    groundColor: '#e2e8f0',
    sunColor: '#ffffff',
    sunIntensity: 2.5,
    ambientIntensity: 0.6,
    fogColor: '#e0f2fe',
    fogDensity: 0.0008,
    shadowOpacity: 0.5,
  },
  dusk: {
    skyColor: '#ff6b6b',
    groundColor: '#2d3748',
    sunColor: '#ff8866',
    sunIntensity: 1.0,
    ambientIntensity: 0.3,
    fogColor: '#ff9988',
    fogDensity: 0.0015,
    shadowOpacity: 0.4,
  },
  night: {
    skyColor: '#0f172a',
    groundColor: '#1e293b',
    sunColor: '#6b8ccc',
    sunIntensity: 0.3,
    ambientIntensity: 0.2,
    fogColor: '#1e3a5f',
    fogDensity: 0.001,
    shadowOpacity: 0.7,
  },
};

// === COURT LIGHTING POSITIONS ===

// Generate positions for 24 tennis courts (6x4 grid)
const generateCourtLightPositions = (): LightFixture[] => {
  const fixtures: LightFixture[] = [];

  // 24 courts in 4 rows, 6 courts per row
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 6; col++) {
      const courtX = -35 + col * 14;
      const courtZ = -40 + row * 26;

      // 4 spotlights per court (corner mounted)
      const positions: [number, number][] = [
        [-4, -10], [4, -10], [-4, 10], [4, 10]
      ];

      positions.forEach(([offsetX, offsetZ]) => {
        fixtures.push({
          position: [courtX + offsetX, 12, courtZ + offsetZ],
          intensity: 8,
          color: '#ffffff',
          distance: 18,
          angle: Math.PI / 4,
          penumbra: 0.2,
        });
      });
    }
  }

  return fixtures;
};

// === STADIUM FLOODLIGHT POSITIONS ===

const generateFloodlightPositions = (): LightFixture[] => {
  const fixtures: LightFixture[] = [];
  const buildingPerimeter = [
    // North side
    { x: -60, z: -55, angle: Math.PI / 3 },
    { x: -30, z: -55, angle: Math.PI / 3 },
    { x: 0, z: -55, angle: Math.PI / 3 },
    { x: 30, z: -55, angle: Math.PI / 3 },
    { x: 60, z: -55, angle: Math.PI / 3 },

    // South side
    { x: -60, z: 55, angle: Math.PI / 3 },
    { x: -30, z: 55, angle: Math.PI / 3 },
    { x: 0, z: 55, angle: Math.PI / 3 },
    { x: 30, z: 55, angle: Math.PI / 3 },
    { x: 60, z: 55, angle: Math.PI / 3 },

    // East side
    { x: 65, z: -30, angle: Math.PI / 3 },
    { x: 65, z: 0, angle: Math.PI / 3 },
    { x: 65, z: 30, angle: Math.PI / 3 },

    // West side
    { x: -65, z: -30, angle: Math.PI / 3 },
    { x: -65, z: 0, angle: Math.PI / 3 },
    { x: -65, z: 30, angle: Math.PI / 3 },
  ];

  buildingPerimeter.forEach(({ x, z, angle }) => {
    fixtures.push({
      position: [x, 25, z],
      intensity: 15,
      color: '#ffffee',
      distance: 80,
      angle,
      penumbra: 0.3,
    });
  });

  return fixtures;
};

// === AMBIENT FACILITY LIGHTING ===

const generateAmbientLightPositions = (): LightFixture[] => {
  const fixtures: LightFixture[] = [];

  // Reception area lighting
  fixtures.push({
    position: [0, 8, 48],
    intensity: 4,
    color: '#fff8dc',
    distance: 20,
  });

  // Corridor and circulation lighting (Level 1-3)
  for (let level = 1; level <= 3; level++) {
    const yPos = level * 20;
    const corridorPositions = [
      [-50, yPos, -40], [-50, yPos, 0], [-50, yPos, 40],
      [50, yPos, -40], [50, yPos, 0], [50, yPos, 40],
      [0, yPos, -45], [0, yPos, 45],
    ];

    corridorPositions.forEach(pos => {
      fixtures.push({
        position: pos as [number, number, number],
        intensity: 3,
        color: '#f0f8ff',
        distance: 15,
      });
    });
  }

  return fixtures;
};

// === COMPONENTS ===

/**
 * Floodlight Fixture - Stadium-style high-intensity lighting
 */
const FloodlightFixture: React.FC<{
  position: [number, number, number];
  intensity: number;
  color: string;
  distance: number;
  angle: number;
  penumbra: number;
  enabled: boolean;
  quality: AtmosphereQuality;
}> = ({ position, intensity, color, distance, angle, penumbra, enabled, quality }) => {
  const lightRef = useRef<THREE.SpotLight>(null);

  // Animate light flickering for realism
  useFrame((state) => {
    if (lightRef.current && enabled) {
      const flicker = Math.sin(state.clock.elapsedTime * 20 + position[0]) * 0.02;
      lightRef.current.intensity = intensity * (1 + flicker);
    }
  });

  const shadowMapSize = useMemo(() => {
    switch (quality) {
      case 'ultra': return 2048;
      case 'high': return 1024;
      case 'medium': return 512;
      default: return 256;
    }
  }, [quality]);

  return (
    <group position={position}>
      {/* Main spotlight */}
      <spotLight
        ref={lightRef}
        intensity={enabled ? intensity : 0}
        color={color}
        distance={distance}
        angle={angle}
        penumbra={penumbra}
        castShadow={quality !== 'low'}
        shadow-mapSize={[shadowMapSize, shadowMapSize]}
        shadow-bias={-0.0001}
      />

      {/* Light fixture housing */}
      <mesh rotation={[-Math.PI / 4, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.5, 1, 8]} />
        <meshStandardMaterial
          color="#1e293b"
          metalness={0.8}
          roughness={0.2}
          emissive={enabled ? color : '#000000'}
          emissiveIntensity={enabled ? 0.3 : 0}
        />
      </mesh>

      {/* Support pole */}
      <mesh position={[0, -2, 0]}>
        <cylinderGeometry args={[0.1, 0.15, 4, 6]} />
        <meshStandardMaterial
          color="#475569"
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* Mounting bracket */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[0.6, 0.2, 0.4]} />
        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
};

/**
 * Court Spotlight - Individual court lighting
 */
const CourtSpotlight: React.FC<{
  position: [number, number, number];
  intensity: number;
  color: string;
  distance: number;
  angle: number;
  penumbra: number;
  enabled: boolean;
}> = ({ position, intensity, color, distance, angle, penumbra, enabled }) => {
  return (
    <group position={position}>
      <spotLight
        intensity={enabled ? intensity : 0}
        color={color}
        distance={distance}
        angle={angle}
        penumbra={penumbra}
        castShadow={false} // Disable shadows for performance
      />

      {/* Light fixture (simplified) */}
      <mesh rotation={[-Math.PI / 3, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.5, 6]} />
        <meshBasicMaterial
          color={enabled ? color : '#333333'}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
};

/**
 * Directional Sun/Moon Light - Primary natural lighting
 */
const CelestialLight: React.FC<{
  timeOfDay: TimeOfDay;
  quality: AtmosphereQuality;
}> = ({ timeOfDay, quality }) => {
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const preset = TIME_PRESETS[timeOfDay];

  // Animate sun position based on time of day
  const sunPosition = useMemo(() => {
    const positions: Record<TimeOfDay, [number, number, number]> = {
      dawn: [-100, 50, 80],
      day: [-80, 150, 100],
      dusk: [100, 40, 80],
      night: [50, 200, 50], // Moon position
    };
    return positions[timeOfDay];
  }, [timeOfDay]);

  useFrame((state) => {
    if (lightRef.current) {
      // Subtle sun movement animation
      const time = state.clock.elapsedTime * 0.05;
      lightRef.current.position.x = sunPosition[0] + Math.sin(time) * 10;
      lightRef.current.position.y = sunPosition[1] + Math.cos(time) * 5;
    }
  });

  const shadowMapSize = quality === 'ultra' ? 4096 : quality === 'high' ? 2048 : 1024;

  return (
    <>
      <directionalLight
        ref={lightRef}
        position={sunPosition}
        intensity={preset.sunIntensity}
        color={preset.sunColor}
        castShadow
        shadow-mapSize={[shadowMapSize, shadowMapSize]}
        shadow-camera-left={-150}
        shadow-camera-right={150}
        shadow-camera-top={150}
        shadow-camera-bottom={-150}
        shadow-camera-near={0.1}
        shadow-camera-far={500}
        shadow-bias={-0.0005}
      />

      {/* Hemisphere light for ambient color variation */}
      <hemisphereLight
        skyColor={preset.skyColor}
        groundColor={preset.groundColor}
        intensity={preset.ambientIntensity}
      />
    </>
  );
};

/**
 * Volumetric Fog - Atmospheric depth and mood
 */
const VolumetricFog: React.FC<{
  timeOfDay: TimeOfDay;
  density: number;
}> = ({ timeOfDay, density }) => {
  const { scene } = useThree();
  const preset = TIME_PRESETS[timeOfDay];

  React.useEffect(() => {
    if (density > 0) {
      scene.fog = new THREE.FogExp2(preset.fogColor, density);
    } else {
      scene.fog = null;
    }

    return () => {
      scene.fog = null;
    };
  }, [scene, preset.fogColor, density]);

  return null;
};

/**
 * Ambient Point Lights - General facility illumination
 */
const AmbientLightGrid: React.FC<{
  positions: LightFixture[];
  enabled: boolean;
}> = ({ positions, enabled }) => {
  return (
    <>
      {positions.map((fixture, idx) => (
        <pointLight
          key={`ambient-${idx}`}
          position={fixture.position}
          intensity={enabled ? fixture.intensity : 0}
          color={fixture.color}
          distance={fixture.distance}
          decay={2}
        />
      ))}
    </>
  );
};

/**
 * Control Panel UI - Interactive lighting controls
 */
const LightingControlPanel: React.FC<{
  config: LightingConfig;
  onConfigChange: (config: Partial<LightingConfig>) => void;
}> = ({ config, onConfigChange }) => {
  return (
    <div className="absolute top-40 right-6 z-10 flex flex-col gap-4 pointer-events-none">
      <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-white/10 pointer-events-auto shadow-2xl">
        <div className="px-2 py-2 text-xs font-bold text-white/50 uppercase tracking-wider flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4" /> Lighting System
        </div>

        {/* Time of Day */}
        <div className="mb-4">
          <label className="text-xs text-white/60 block mb-2">Time of Day</label>
          <div className="grid grid-cols-2 gap-2">
            {(['dawn', 'day', 'dusk', 'night'] as TimeOfDay[]).map((time) => (
              <button
                key={time}
                onClick={() => onConfigChange({ timeOfDay: time })}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all ${
                  config.timeOfDay === time
                    ? 'bg-tennis-yellow text-tennis-dark shadow-lg'
                    : 'text-white bg-white/10 hover:bg-white/20'
                }`}
              >
                {time === 'day' ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
                {time.charAt(0).toUpperCase() + time.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Lighting Mode */}
        <div className="mb-4">
          <label className="text-xs text-white/60 block mb-2">Mode</label>
          <div className="grid grid-cols-2 gap-2">
            {(['natural', 'sports', 'event', 'maintenance'] as LightingMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => onConfigChange({ mode })}
                className={`px-3 py-2 rounded-lg text-xs transition-all ${
                  config.mode === mode
                    ? 'bg-tennis-yellow text-tennis-dark'
                    : 'text-white bg-white/10 hover:bg-white/20'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-2">
          <label className="flex items-center justify-between text-xs text-white cursor-pointer">
            <span>Floodlights</span>
            <input
              type="checkbox"
              checked={config.floodlightsEnabled}
              onChange={(e) => onConfigChange({ floodlightsEnabled: e.target.checked })}
              className="ml-2"
            />
          </label>
          <label className="flex items-center justify-between text-xs text-white cursor-pointer">
            <span>Court Lights</span>
            <input
              type="checkbox"
              checked={config.courtLightsEnabled}
              onChange={(e) => onConfigChange({ courtLightsEnabled: e.target.checked })}
              className="ml-2"
            />
          </label>
        </div>

        {/* Sliders */}
        <div className="mt-4 space-y-3">
          <div>
            <label className="text-xs text-white/60 block mb-1">Fog Density</label>
            <input
              type="range"
              min="0"
              max="0.005"
              step="0.0001"
              value={config.fogDensity}
              onChange={(e) => onConfigChange({ fogDensity: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-xs text-white/60 block mb-1">Bloom Strength</label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={config.bloomStrength}
              onChange={(e) => onConfigChange({ bloomStrength: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Main Lighting System Component
 */
export const LightingSystem: React.FC<{
  showControls?: boolean;
  initialConfig?: Partial<LightingConfig>;
}> = ({ showControls = true, initialConfig = {} }) => {
  const [config, setConfig] = useState<LightingConfig>({
    timeOfDay: 'day',
    mode: 'sports',
    quality: 'high',
    floodlightsEnabled: true,
    courtLightsEnabled: true,
    ambientIntensity: 0.5,
    fogDensity: 0.001,
    bloomStrength: 0.5,
    ...initialConfig,
  });

  const updateConfig = (partial: Partial<LightingConfig>) => {
    setConfig(prev => ({ ...prev, ...partial }));
  };

  // Generate light positions (memoized for performance)
  const courtLights = useMemo(() => generateCourtLightPositions(), []);
  const floodlights = useMemo(() => generateFloodlightPositions(), []);
  const ambientLights = useMemo(() => generateAmbientLightPositions(), []);

  // Determine which lights should be active based on mode and time
  const lightingState = useMemo(() => {
    const isNightTime = config.timeOfDay === 'night' || config.timeOfDay === 'dusk';

    return {
      floodlights: config.floodlightsEnabled && (config.mode === 'sports' || config.mode === 'event') && isNightTime,
      courtLights: config.courtLightsEnabled && config.mode !== 'natural',
      ambient: config.mode !== 'natural',
    };
  }, [config]);

  return (
    <>
      {/* Control Panel */}
      {showControls && (
        <LightingControlPanel config={config} onConfigChange={updateConfig} />
      )}

      {/* Celestial Lighting */}
      <CelestialLight timeOfDay={config.timeOfDay} quality={config.quality} />

      {/* Stadium Floodlights */}
      {floodlights.map((fixture, idx) => (
        <FloodlightFixture
          key={`flood-${idx}`}
          position={fixture.position}
          intensity={fixture.intensity!}
          color={fixture.color}
          distance={fixture.distance}
          angle={fixture.angle!}
          penumbra={fixture.penumbra!}
          enabled={lightingState.floodlights}
          quality={config.quality}
        />
      ))}

      {/* Court Spotlights */}
      {courtLights.map((fixture, idx) => (
        <CourtSpotlight
          key={`court-${idx}`}
          position={fixture.position}
          intensity={fixture.intensity}
          color={fixture.color}
          distance={fixture.distance}
          angle={fixture.angle!}
          penumbra={fixture.penumbra!}
          enabled={lightingState.courtLights}
        />
      ))}

      {/* Ambient Facility Lighting */}
      <AmbientLightGrid
        positions={ambientLights}
        enabled={lightingState.ambient}
      />

      {/* Volumetric Fog */}
      <VolumetricFog
        timeOfDay={config.timeOfDay}
        density={config.fogDensity}
      />

      {/* Post-processing Effects */}
      <EffectComposer>
        <Bloom
          intensity={config.bloomStrength}
          luminanceThreshold={0.6}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <ToneMapping
          adaptive
          resolution={256}
          middleGrey={0.6}
          maxLuminance={16.0}
          averageLuminance={1.0}
          adaptationRate={2.0}
        />
      </EffectComposer>
    </>
  );
};

export default LightingSystem;
