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
 *
 * Debug Integration:
 * - Asset performance tracking for each lighting component
 * - Conditional rendering based on debug flags
 * - Performance cost monitoring (1-7 scale)
 * - Dependency tracking between lighting systems
 */

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing';
import { Sun, Moon, Zap, Eye } from 'lucide-react';
import { useDebug } from '../contexts/DebugContext';

// === TYPE DEFINITIONS ===

/**
 * Time of day setting for lighting presets
 *
 * @remarks
 * Each time period has associated lighting characteristics:
 * - `dawn`: Warm orange/pink tones, moderate intensity
 * - `day`: Bright white sunlight, maximum visibility
 * - `dusk`: Red/orange sunset colors, moderate intensity
 * - `night`: Cool blue moonlight, minimal natural light
 */
export type TimeOfDay = 'dawn' | 'day' | 'dusk' | 'night';

/**
 * Operating mode that determines which lighting systems are active
 *
 * @remarks
 * Lighting modes control the activation of different light fixtures:
 * - `natural`: Only celestial lighting (sun/moon), no artificial lights
 * - `sports`: Standard court operations with floodlights and court lights
 * - `event`: Enhanced lighting for special events with maximum intensity
 * - `maintenance`: Minimal lighting for facility maintenance periods
 */
export type LightingMode = 'natural' | 'sports' | 'event' | 'maintenance';

/**
 * Rendering quality level for atmospheric effects and shadows
 *
 * @remarks
 * Quality levels affect performance vs visual fidelity:
 * - `low`: Shadow map 256px, minimal fog, basic effects
 * - `medium`: Shadow map 512px, standard fog and shadows
 * - `high`: Shadow map 1024px, enhanced atmospheric effects
 * - `ultra`: Shadow map 2048-4096px, maximum visual quality
 *
 * Performance impact scales exponentially with quality level.
 */
export type AtmosphereQuality = 'low' | 'medium' | 'high' | 'ultra';

/**
 * Complete lighting system configuration
 *
 * @remarks
 * This interface controls all aspects of the lighting system including
 * time of day presets, operational modes, and visual quality settings.
 *
 * @example
 * ```tsx
 * const config: LightingConfig = {
 *   timeOfDay: 'night',
 *   mode: 'sports',
 *   quality: 'high',
 *   floodlightsEnabled: true,
 *   courtLightsEnabled: true,
 *   ambientIntensity: 0.5,
 *   fogDensity: 0.001,
 *   bloomStrength: 0.7
 * };
 * ```
 */
export interface LightingConfig {
  /** Current time of day setting affecting celestial light color and intensity */
  timeOfDay: TimeOfDay;

  /** Operating mode determining which light fixtures are active */
  mode: LightingMode;

  /** Rendering quality level for shadows and atmospheric effects */
  quality: AtmosphereQuality;

  /** Enable/disable stadium perimeter floodlights (16 fixtures) */
  floodlightsEnabled: boolean;

  /** Enable/disable individual court spotlights (96 fixtures, 4 per court) */
  courtLightsEnabled: boolean;

  /** Ambient light intensity multiplier (0.0 - 1.0) */
  ambientIntensity: number;

  /** Volumetric fog density (0.0 - 0.005), higher values reduce visibility */
  fogDensity: number;

  /** HDR bloom effect strength (0.0 - 2.0), enhances light glow */
  bloomStrength: number;
}

/**
 * Individual light fixture specification
 *
 * @internal
 * Used internally for positioning and configuring light sources
 */
interface LightFixture {
  /** 3D world position [x, y, z] in meters */
  position: [number, number, number];

  /** Light intensity value (typical range: 1-20) */
  intensity: number;

  /** Light color in hex format (e.g., '#ffffff') */
  color: string;

  /** Maximum effective distance of light in meters */
  distance: number;

  /** Spotlight cone angle in radians (optional, for spotlights) */
  angle?: number;

  /** Spotlight edge softness (0.0 - 1.0, optional) */
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

/**
 * Generates spotlight positions for all tennis courts
 *
 * @remarks
 * Creates a 4-corner spotlight configuration for each of the 24 tennis courts
 * arranged in a 6-column by 4-row grid layout. Each court receives 4 spotlights
 * mounted at the corners, angled inward for optimal court coverage.
 *
 * Algorithm:
 * - Court grid: 6 columns × 4 rows = 24 courts
 * - Spacing: 14m horizontal, 26m vertical between court centers
 * - Light height: 12m above ground for optimal angle
 * - Coverage: 18m effective distance per spotlight
 *
 * @returns Array of 96 light fixtures (4 per court × 24 courts)
 *
 * @internal
 */
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

/**
 * Generates stadium perimeter floodlight positions
 *
 * @remarks
 * Creates high-intensity floodlights around the building perimeter for
 * wide-area illumination during night sports events. Lights are positioned
 * at 25m height to minimize glare and maximize coverage.
 *
 * Distribution:
 * - North side: 5 floodlights
 * - South side: 5 floodlights
 * - East side: 3 floodlights
 * - West side: 3 floodlights
 * - Total: 16 fixtures
 *
 * Performance characteristics:
 * - Intensity: 15 units (high power)
 * - Distance: 80m effective range
 * - Color: Warm white (#ffffee) to reduce eye strain
 * - Angle: π/3 radians (60°) for wide spread
 *
 * @returns Array of 16 floodlight fixtures
 *
 * @internal
 */
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

/**
 * Generates ambient facility lighting for indoor spaces
 *
 * @remarks
 * Creates general illumination for reception areas, corridors, and circulation
 * spaces across three building levels. Provides warm, welcoming lighting for
 * non-court areas.
 *
 * Coverage areas:
 * - Reception area: Central entrance lighting
 * - Level 1-3 corridors: Distributed along major circulation paths
 * - North/South circulation: Strategic placement at key points
 *
 * Light characteristics:
 * - Color: Warm white (#fff8dc, #f0f8ff) for comfort
 * - Intensity: 3-4 units for ambient coverage
 * - Distance: 15-20m for overlapping zones
 *
 * @returns Array of 25+ ambient light fixtures
 *
 * @internal
 */
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
 * Stadium-style high-intensity floodlight fixture with dynamic effects
 *
 * @remarks
 * Renders a physically-modeled floodlight with housing, mounting bracket,
 * and support pole. Includes realistic flickering animation and quality-based
 * shadow map sizing for performance optimization.
 *
 * Visual components:
 * - Spotlight with shadow casting
 * - Cylindrical housing with emissive material when active
 * - Support pole and mounting bracket
 *
 * Performance optimization:
 * - Shadow quality scales with `quality` prop (256px to 2048px)
 * - Shadows disabled on 'low' quality setting
 * - Subtle flicker effect using sine wave animation
 *
 * @param props - Floodlight configuration properties
 * @param props.position - 3D world position [x, y, z] in meters
 * @param props.intensity - Light intensity (typical: 15 units)
 * @param props.color - Light color in hex format
 * @param props.distance - Maximum effective range in meters
 * @param props.angle - Spotlight cone angle in radians
 * @param props.penumbra - Edge softness (0.0 = hard edge, 1.0 = soft edge)
 * @param props.enabled - Whether the light is currently active
 * @param props.quality - Rendering quality affecting shadow resolution
 *
 * @example
 * ```tsx
 * <FloodlightFixture
 *   position={[60, 25, 55]}
 *   intensity={15}
 *   color="#ffffee"
 *   distance={80}
 *   angle={Math.PI / 3}
 *   penumbra={0.3}
 *   enabled={true}
 *   quality="high"
 * />
 * ```
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
 * Individual court spotlight for focused playing surface illumination
 *
 * @remarks
 * Simplified spotlight fixture optimized for high instance counts (96 total).
 * Shadows are disabled for performance as these lights provide supplementary
 * illumination rather than primary lighting.
 *
 * Optimization techniques:
 * - No shadow casting (performance)
 * - Simplified geometry for reduced draw calls
 * - Basic material instead of standard for faster rendering
 *
 * @param props - Court spotlight configuration
 * @param props.position - 3D position at court corner, 12m height
 * @param props.intensity - Light intensity (typical: 8 units)
 * @param props.color - Light color, usually white (#ffffff)
 * @param props.distance - Effective range (typical: 18m)
 * @param props.angle - Spotlight cone angle (typical: π/4)
 * @param props.penumbra - Edge softness for smooth falloff
 * @param props.enabled - Active state based on lighting mode
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
 * Primary celestial light source (sun/moon) with hemisphere ambient
 *
 * @remarks
 * Provides main directional lighting that simulates sunlight or moonlight
 * based on time of day. Includes subtle animation for natural movement and
 * hemisphere light for realistic sky/ground color gradients.
 *
 * Light positioning algorithm:
 * - Dawn: Low angle from east (-100, 50, 80)
 * - Day: High overhead angle (-80, 150, 100)
 * - Dusk: Low angle from west (100, 40, 80)
 * - Night: Moon position (50, 200, 50)
 *
 * Animation:
 * - Slow sinusoidal movement (0.05 speed)
 * - ±10m horizontal sway, ±5m vertical variation
 * - Creates realistic celestial movement feel
 *
 * Shadow optimization:
 * - Ultra: 4096px shadow map
 * - High: 2048px shadow map
 * - Medium/Low: 1024px shadow map
 * - Large shadow camera frustum (-150 to 150m) for facility coverage
 *
 * @param props - Celestial light configuration
 * @param props.timeOfDay - Current time period affecting color and position
 * @param props.quality - Shadow map resolution quality
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
 * Exponential volumetric fog for atmospheric depth and mood
 *
 * @remarks
 * Applies Three.js FogExp2 to the scene for distance-based atmospheric effects.
 * Fog color matches the time of day preset for visual coherence. This component
 * directly modifies the scene fog property and cleans up on unmount.
 *
 * Fog density guidelines:
 * - 0.0000: No fog (crystal clear)
 * - 0.0008: Light haze (day default)
 * - 0.0015: Moderate fog (dusk/dawn)
 * - 0.005: Dense fog (reduced visibility)
 *
 * Performance impact:
 * - Minimal CPU overhead
 * - Fragment shader cost increases with density
 * - Exponential falloff (FogExp2) more realistic than linear
 *
 * @param props - Fog configuration
 * @param props.timeOfDay - Time period determining fog color
 * @param props.density - Fog density value (0.0 - 0.005)
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
 * Grid of ambient point lights for general facility illumination
 *
 * @remarks
 * Renders multiple point lights for reception, corridor, and circulation
 * lighting. Uses physics-based decay (inverse square law) for realistic
 * light falloff. All lights toggled together based on enabled state.
 *
 * Light characteristics:
 * - Point lights with omnidirectional emission
 * - Decay value of 2 (physically accurate inverse square)
 * - Warm color temperatures for welcoming atmosphere
 * - Overlapping coverage zones for even illumination
 *
 * @param props - Ambient lighting configuration
 * @param props.positions - Array of light fixture specifications
 * @param props.enabled - Master switch for all ambient lights
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
 * Interactive UI control panel for lighting system configuration
 *
 * @remarks
 * Provides real-time controls for all lighting system parameters through
 * an intuitive interface. Positioned in the top-right corner of the viewport
 * with glassmorphic styling for modern aesthetics.
 *
 * Control categories:
 * - Time of day selection (4 buttons)
 * - Lighting mode selection (4 buttons)
 * - Floodlights toggle (checkbox)
 * - Court lights toggle (checkbox)
 * - Fog density slider (0.0 - 0.005)
 * - Bloom strength slider (0.0 - 2.0)
 *
 * UI features:
 * - Backdrop blur for depth separation
 * - Active state highlighting with brand colors
 * - Icon indicators for visual clarity
 * - Responsive hover states
 *
 * @param props - Control panel configuration
 * @param props.config - Current lighting configuration state
 * @param props.onConfigChange - Callback for configuration updates
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
 * Complete lighting system with dynamic time-of-day, artificial lighting, and atmospheric effects
 *
 * @remarks
 * This is the main component that orchestrates all lighting elements for the tennis
 * facility visualization. It manages 112+ individual light sources, volumetric fog,
 * and HDR post-processing effects with intelligent performance optimization.
 *
 * System architecture:
 * - 1 celestial light (sun/moon) + hemisphere ambient
 * - 16 stadium floodlights (perimeter mounted)
 * - 96 court spotlights (4 per court × 24 courts)
 * - 25+ ambient facility lights (corridors, reception)
 * - Volumetric fog system
 * - HDR bloom and tone mapping post-processing
 *
 * Performance optimization strategies:
 * - Memoized light position generation
 * - Quality-based shadow map resolution
 * - Selective shadow casting (only primary lights)
 * - Instanced light fixtures where possible
 * - Conditional rendering based on lighting mode
 *
 * State management:
 * - Time-of-day presets with smooth transitions
 * - Mode-based light activation logic
 * - Real-time configuration updates
 * - Persistent user preferences support
 *
 * @param props - Lighting system configuration
 * @param props.showControls - Show/hide interactive control panel (default: true)
 * @param props.initialConfig - Initial configuration overrides (optional)
 *
 * @example
 * ```tsx
 * // Basic usage with defaults
 * <LightingSystem />
 *
 * // Custom night sports configuration
 * <LightingSystem
 *   showControls={false}
 *   initialConfig={{
 *     timeOfDay: 'night',
 *     mode: 'sports',
 *     quality: 'high',
 *     floodlightsEnabled: true,
 *     fogDensity: 0.001,
 *     bloomStrength: 0.8
 *   }}
 * />
 * ```
 *
 * @see {@link LightingConfig} for configuration options
 * @see {@link TimeOfDay} for time period presets
 * @see {@link LightingMode} for operational modes
 */
export const LightingSystem: React.FC<{
  /** Enable interactive control panel UI (default: true) */
  showControls?: boolean;

  /** Initial configuration overrides merged with defaults */
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

  const { registerAsset, isAssetEnabled } = useDebug();

  // Debug asset registration
  useEffect(() => {
    registerAsset({
      id: 'ambient-light',
      name: 'Ambient Light',
      type: 'lighting',
      enabled: true,
      performanceCost: 1, // Low cost
      dependencies: []
    });

    registerAsset({
      id: 'directional-light',
      name: 'Directional Light (Sun)',
      type: 'lighting',
      enabled: true,
      performanceCost: 2,
      dependencies: []
    });

    registerAsset({
      id: 'spot-lights',
      name: 'Stadium Spot Lights',
      type: 'lighting',
      enabled: true,
      performanceCost: 5, // Multiple lights
      dependencies: []
    });

    registerAsset({
      id: 'dynamic-shadows',
      name: 'Dynamic Shadow Mapping',
      type: 'lighting',
      enabled: true,
      performanceCost: 7, // Very expensive
      dependencies: ['directional-light', 'spot-lights']
    });

    registerAsset({
      id: 'hdr-environment',
      name: 'HDR Environment Map',
      type: 'lighting',
      enabled: true,
      performanceCost: 4,
      dependencies: []
    });

    // Post-processing effects
    registerAsset({
      id: 'bloom-effects',
      name: 'Bloom Lighting Effects',
      type: 'effects',
      enabled: true,
      performanceCost: 4,
      dependencies: ['hdr-environment']
    });

    registerAsset({
      id: 'post-processing',
      name: 'Post-Processing Pipeline',
      type: 'effects',
      enabled: true,
      performanceCost: 6,
      dependencies: []
    });
  }, [registerAsset]);

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

  // Debug flags for conditional rendering
  const debugFlags = {
    ambientLight: isAssetEnabled('ambient-light'),
    directionalLight: isAssetEnabled('directional-light'),
    spotLights: isAssetEnabled('spot-lights'),
    dynamicShadows: isAssetEnabled('dynamic-shadows'),
    hdrEnvironment: isAssetEnabled('hdr-environment'),
  };

  return (
    <>
      {/* Control Panel */}
      {showControls && (
        <LightingControlPanel config={config} onConfigChange={updateConfig} />
      )}

      {/* Celestial Lighting - conditionally rendered based on debug flags */}
      {debugFlags.directionalLight && debugFlags.ambientLight && (
        <CelestialLight timeOfDay={config.timeOfDay} quality={config.quality} />
      )}

      {/* Stadium Floodlights - conditionally rendered based on debug flags */}
      {debugFlags.spotLights && floodlights.map((fixture, idx) => (
        <FloodlightFixture
          key={`flood-${idx}`}
          position={fixture.position}
          intensity={fixture.intensity!}
          color={fixture.color}
          distance={fixture.distance}
          angle={fixture.angle!}
          penumbra={fixture.penumbra!}
          enabled={lightingState.floodlights}
          quality={debugFlags.dynamicShadows ? config.quality : 'low'}
        />
      ))}

      {/* Court Spotlights - conditionally rendered based on debug flags */}
      {debugFlags.spotLights && courtLights.map((fixture, idx) => (
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

      {/* Ambient Facility Lighting - conditionally rendered based on debug flags */}
      {debugFlags.ambientLight && (
        <AmbientLightGrid
          positions={ambientLights}
          enabled={lightingState.ambient}
        />
      )}

      {/* Volumetric Fog */}
      <VolumetricFog
        timeOfDay={config.timeOfDay}
        density={config.fogDensity}
      />

      {/* Post-processing Effects - HDR conditionally rendered based on debug flags */}
      {debugFlags.hdrEnvironment && (
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
      )}
    </>
  );
};

export default LightingSystem;
