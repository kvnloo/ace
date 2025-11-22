/**
 * Weather System Type Definitions
 *
 * Type definitions for the dynamic weather system components
 */

import * as THREE from 'three';

/**
 * Available weather types
 */
export type WeatherType = 'clear' | 'rain' | 'snow' | 'windy' | 'storm';

/**
 * Weather system configuration
 */
export interface WeatherConfig {
  /** Current weather type */
  weather: WeatherType;
  /** Effect intensity (0-1) */
  intensity: number;
  /** Coverage area dimensions [width, depth] */
  areaSize: [number, number];
  /** Enable particle effects */
  enableEffects: boolean;
  /** Enable wet surface reflections */
  enableWetSurfaces: boolean;
  /** Weather transition duration in seconds */
  transitionDuration: number;
}

/**
 * Particle data structure for rain
 */
export interface RainParticle {
  /** 3D position vector */
  position: THREE.Vector3;
  /** Velocity vector for movement */
  velocity: THREE.Vector3;
  /** Particle lifetime (0-1) */
  life: number;
  /** Phase offset for animation variation */
  phase: number;
}

/**
 * Particle data structure for snow
 */
export interface SnowParticle {
  /** 3D position vector */
  position: THREE.Vector3;
  /** Velocity vector for movement */
  velocity: THREE.Vector3;
  /** Current rotation angle */
  rotation: number;
  /** Rotation speed */
  rotationSpeed: number;
  /** Particle lifetime (0-1) */
  life: number;
  /** Phase offset for animation variation */
  phase: number;
}

/**
 * Lighting configuration for different weather types
 */
export interface WeatherLightingConfig {
  /** Directional light intensity */
  directional: number;
  /** Ambient light intensity */
  ambient: number;
  /** Light color in hex format */
  color: string;
}

/**
 * Gameplay impact data from weather conditions
 */
export interface WeatherGameplayImpact {
  /** Surface friction coefficient (0-1) */
  surfaceFriction: number;
  /** Visibility factor (0-1) */
  visibility: number;
  /** Wind strength affecting ball trajectory */
  windStrength: number;
  /** Surface wetness level (0-1) */
  wetness: number;
  /** Ball bounce coefficient modification */
  bounceModifier: number;
}

/**
 * Weather transition state
 */
export interface WeatherTransitionState {
  /** Current active weather */
  currentWeather: WeatherType;
  /** Target weather to transition to */
  targetWeather: WeatherType;
  /** Transition progress (0-1) */
  progress: number;
  /** Is transition active */
  isTransitioning: boolean;
}

/**
 * Weather hook return type
 */
export interface UseWeatherReturn {
  /** Current weather state */
  weather: WeatherType;
  /** Current intensity (0-1) */
  intensity: number;
  /** Change weather with optional intensity */
  changeWeather: (weather: WeatherType, intensity?: number) => void;
  /** Set weather type */
  setWeather: (weather: WeatherType) => void;
  /** Set intensity value */
  setIntensity: (intensity: number) => void;
}

/**
 * Weather effect component base props
 */
export interface WeatherEffectProps {
  /** Effect intensity (0-1) */
  intensity: number;
  /** Coverage area size */
  areaSize: [number, number];
}

/**
 * Rain effect specific props
 */
export interface RainEffectProps extends WeatherEffectProps {
  /** Reference to instanced mesh */
  meshRef: React.RefObject<THREE.InstancedMesh>;
  /** Wind strength affecting rain angle */
  windStrength: number;
}

/**
 * Snow effect specific props
 */
export interface SnowEffectProps extends WeatherEffectProps {
  /** Reference to instanced mesh */
  meshRef: React.RefObject<THREE.InstancedMesh>;
  /** Wind strength affecting snow drift */
  windStrength: number;
}

/**
 * Wind effect specific props
 */
export interface WindEffectProps extends WeatherEffectProps {
  /** Reference to particle system */
  particlesRef: React.RefObject<THREE.Points>;
}

/**
 * Atmospheric lighting props
 */
export interface AtmosphericLightingProps {
  /** Current weather type */
  weather: WeatherType;
  /** Transition progress (0-1) */
  transitionProgress: number;
  /** Base intensity multiplier */
  intensity: number;
}

/**
 * Wet surface effect props
 */
export interface WetSurfaceEffectProps {
  /** Wetness level (0-1) */
  wetness: number;
  /** Coverage area size */
  areaSize: [number, number];
}

/**
 * Sun effect props
 */
export interface SunEffectProps {
  /** Sun intensity */
  intensity: number;
  /** Current time for sun position */
  time: number;
}

/**
 * Weather controls UI props
 */
export interface WeatherControlsProps {
  /** Current active weather */
  currentWeather: WeatherType;
  /** Weather change callback */
  onWeatherChange: (weather: WeatherType) => void;
  /** Current intensity value */
  intensity: number;
  /** Intensity change callback */
  onIntensityChange: (intensity: number) => void;
}

/**
 * Weather option for UI display
 */
export interface WeatherOption {
  /** Weather type identifier */
  type: WeatherType;
  /** Icon component */
  icon: React.ComponentType<any>;
  /** Display label */
  label: string;
  /** Associated color */
  color: string;
}

/**
 * Performance metrics for weather system
 */
export interface WeatherPerformanceMetrics {
  /** Active particle count */
  particleCount: number;
  /** Current frame rate */
  fps: number;
  /** GPU memory usage (MB) */
  gpuMemory: number;
  /** Current weather type */
  weather: WeatherType;
  /** Effect intensity */
  intensity: number;
}
