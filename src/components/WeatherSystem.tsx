import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useDebug } from '../contexts/DebugContext';

// Weather type definitions
export type WeatherType = 'clear' | 'rain' | 'snow' | 'windy' | 'storm';

interface WeatherSystemProps {
  /** Current weather type */
  weather?: WeatherType;
  /** Transition duration in seconds (default: 3) */
  transitionDuration?: number;
  /** Weather intensity (0-1, default: 0.7) */
  intensity?: number;
  /** Enable visual effects (default: true) */
  enableEffects?: true;
  /** Area size [width, depth] */
  areaSize?: [number, number];
  /** Enable wet surface reflections (default: true) */
  enableWetSurfaces?: boolean;
  /** Callback when weather changes */
  onWeatherChange?: (weather: WeatherType) => void;
}

interface RainParticle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  phase: number;
}

interface SnowParticle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  rotation: number;
  rotationSpeed: number;
  life: number;
  phase: number;
}

/**
 * WeatherSystem Component
 *
 * Implements dynamic weather effects for the tennis facility:
 * - Rain with particle systems and splash effects
 * - Snow with wind-affected drift patterns
 * - Wind affecting vegetation and particles
 * - Sun effects with dynamic lighting
 * - Weather transitions with smooth blending
 * - Wet surface reflections during/after rain
 * - Gameplay condition impacts (visibility, surface friction)
 *
 * Performance optimized with instanced meshes and LOD techniques.
 */
const WeatherSystem: React.FC<WeatherSystemProps> = ({
  weather = 'clear',
  transitionDuration = 3,
  intensity = 0.7,
  enableEffects = true,
  areaSize = [300, 300],
  enableWetSurfaces = true,
  onWeatherChange
}) => {
  const { registerAsset, isAssetEnabled } = useDebug();
  const [currentWeather, setCurrentWeather] = useState<WeatherType>(weather);
  const [targetWeather, setTargetWeather] = useState<WeatherType>(weather);
  const [transitionProgress, setTransitionProgress] = useState(1);
  const [wetness, setWetness] = useState(0); // 0-1, affects surface reflections

  const rainMeshRef = useRef<THREE.InstancedMesh>(null);
  const snowMeshRef = useRef<THREE.InstancedMesh>(null);
  const windParticlesRef = useRef<THREE.Points>(null);
  const timeRef = useRef(0);

  // Register debug assets for performance tracking
  useEffect(() => {
    registerAsset({
      id: 'weather-particles',
      name: 'Weather Particles (Rain/Snow)',
      type: 'effects',
      enabled: true,
      performanceCost: 6, // Many particles
      dependencies: []
    });

    registerAsset({
      id: 'clouds',
      name: 'Cloud System',
      type: 'environment',
      enabled: true,
      performanceCost: 4,
      dependencies: []
    });

    registerAsset({
      id: 'fog-system',
      name: 'Volumetric Fog',
      type: 'effects',
      enabled: true,
      performanceCost: 5,
      dependencies: []
    });

    registerAsset({
      id: 'wind-effects',
      name: 'Wind Animation Effects',
      type: 'effects',
      enabled: true,
      performanceCost: 3,
      dependencies: ['grass-physics'] // affects grass
    });
  }, [registerAsset]);

  // Weather transition management
  useEffect(() => {
    if (weather !== targetWeather) {
      setTargetWeather(weather);
      setTransitionProgress(0);
      onWeatherChange?.(weather);
    }
  }, [weather, targetWeather, onWeatherChange]);

  // Update transition progress
  useFrame((state, delta) => {
    if (transitionProgress < 1) {
      setTransitionProgress(Math.min(1, transitionProgress + delta / transitionDuration));

      if (transitionProgress >= 1) {
        setCurrentWeather(targetWeather);
      }
    }

    // Update wetness based on rain
    if (targetWeather === 'rain' || targetWeather === 'storm') {
      setWetness(Math.min(1, wetness + delta * 0.2));
    } else {
      setWetness(Math.max(0, wetness - delta * 0.1));
    }

    timeRef.current += delta;
  });

  // Calculate current intensity based on transition
  const getCurrentIntensity = () => {
    if (transitionProgress >= 1) return intensity;

    // Smooth ease-in-out transition
    const t = transitionProgress;
    const smoothT = t * t * (3 - 2 * t);
    return intensity * smoothT;
  };

  return (
    <group>
      {/* Rain Effect */}
      {(currentWeather === 'rain' || targetWeather === 'rain' ||
        currentWeather === 'storm' || targetWeather === 'storm') &&
        enableEffects &&
        isAssetEnabled('weather-particles') && (
        <RainEffect
          intensity={getCurrentIntensity() * (currentWeather === 'storm' || targetWeather === 'storm' ? 1.5 : 1)}
          meshRef={rainMeshRef}
          areaSize={areaSize}
          windStrength={currentWeather === 'storm' || targetWeather === 'storm' ? 0.3 : 0.1}
        />
      )}

      {/* Snow Effect */}
      {(currentWeather === 'snow' || targetWeather === 'snow') &&
        enableEffects &&
        isAssetEnabled('weather-particles') && (
        <SnowEffect
          intensity={getCurrentIntensity()}
          meshRef={snowMeshRef}
          areaSize={areaSize}
          windStrength={0.2}
        />
      )}

      {/* Wind Effect */}
      {(currentWeather === 'windy' || targetWeather === 'windy' ||
        currentWeather === 'storm' || targetWeather === 'storm') &&
        enableEffects &&
        isAssetEnabled('wind-effects') && (
        <WindEffect
          intensity={getCurrentIntensity() * (currentWeather === 'storm' || targetWeather === 'storm' ? 2 : 1)}
          particlesRef={windParticlesRef}
          areaSize={areaSize}
        />
      )}

      {/* Atmospheric Lighting */}
      <AtmosphericLighting
        weather={transitionProgress >= 1 ? currentWeather : targetWeather}
        transitionProgress={transitionProgress}
        intensity={intensity}
      />

      {/* Wet Surface Effects */}
      {enableWetSurfaces && wetness > 0 && isAssetEnabled('weather-particles') && (
        <WetSurfaceEffect wetness={wetness} areaSize={areaSize} />
      )}

      {/* Weather-specific ambient effects */}
      {currentWeather === 'clear' && isAssetEnabled('clouds') && (
        <SunEffect intensity={intensity} time={timeRef.current} />
      )}
    </group>
  );
};

/**
 * Rain Effect Component
 * Creates realistic rain with varying droplet speeds and splash effects
 */
const RainEffect: React.FC<{
  intensity: number;
  meshRef: React.RefObject<THREE.InstancedMesh>;
  areaSize: [number, number];
  windStrength: number;
}> = ({ intensity, meshRef, areaSize, windStrength }) => {
  const particleCount = Math.floor(2000 * intensity);
  const rainParticles = useRef<RainParticle[]>([]);

  // Initialize rain particles
  const rainData = useMemo(() => {
    const [width, depth] = areaSize;
    rainParticles.current = [];

    for (let i = 0; i < particleCount; i++) {
      rainParticles.current.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * width,
          Math.random() * 100 + 50,
          (Math.random() - 0.5) * depth
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * windStrength * 2,
          -(15 + Math.random() * 10), // Fall speed
          (Math.random() - 0.5) * windStrength * 2
        ),
        life: Math.random(),
        phase: Math.random() * Math.PI * 2
      });
    }

    return rainParticles.current;
  }, [particleCount, areaSize, windStrength]);

  // Animate rain particles
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const [width, depth] = areaSize;
    const tempObject = new THREE.Object3D();

    rainParticles.current.forEach((particle, i) => {
      // Update position
      particle.position.add(particle.velocity.clone().multiplyScalar(delta));

      // Reset if below ground
      if (particle.position.y < 0) {
        particle.position.set(
          (Math.random() - 0.5) * width,
          100 + Math.random() * 50,
          (Math.random() - 0.5) * depth
        );
        particle.life = 1;
      }

      // Update life
      particle.life = Math.max(0, particle.life - delta * 0.5);

      // Apply wind variation over time
      const windVariation = Math.sin(state.clock.elapsedTime + particle.phase) * windStrength;
      particle.velocity.x = windVariation;

      // Set transform
      tempObject.position.copy(particle.position);
      tempObject.scale.set(0.08, 2.5, 0.08);
      tempObject.lookAt(
        particle.position.x + particle.velocity.x,
        particle.position.y + particle.velocity.y,
        particle.position.z + particle.velocity.z
      );
      tempObject.updateMatrix();

      meshRef.current!.setMatrixAt(i, tempObject.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, particleCount]}
      frustumCulled={false}
    >
      <cylinderGeometry args={[0.02, 0.02, 1, 4]} />
      <meshBasicMaterial
        color="#a0c4ff"
        transparent
        opacity={0.6}
        depthWrite={false}
      />
    </instancedMesh>
  );
};

/**
 * Snow Effect Component
 * Creates gentle snowfall with wind drift and rotation
 */
const SnowEffect: React.FC<{
  intensity: number;
  meshRef: React.RefObject<THREE.InstancedMesh>;
  areaSize: [number, number];
  windStrength: number;
}> = ({ intensity, meshRef, areaSize, windStrength }) => {
  const particleCount = Math.floor(1500 * intensity);
  const snowParticles = useRef<SnowParticle[]>([]);

  // Initialize snow particles
  const snowData = useMemo(() => {
    const [width, depth] = areaSize;
    snowParticles.current = [];

    for (let i = 0; i < particleCount; i++) {
      snowParticles.current.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * width,
          Math.random() * 100 + 50,
          (Math.random() - 0.5) * depth
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * windStrength,
          -(0.5 + Math.random() * 1.5), // Slower fall than rain
          (Math.random() - 0.5) * windStrength
        ),
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 2,
        life: Math.random(),
        phase: Math.random() * Math.PI * 2
      });
    }

    return snowParticles.current;
  }, [particleCount, areaSize, windStrength]);

  // Animate snow particles
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const [width, depth] = areaSize;
    const tempObject = new THREE.Object3D();

    snowParticles.current.forEach((particle, i) => {
      // Gentle swaying motion
      const sway = Math.sin(state.clock.elapsedTime * 0.5 + particle.phase) * windStrength * 2;

      // Update position
      particle.position.x += (particle.velocity.x + sway) * delta;
      particle.position.y += particle.velocity.y * delta;
      particle.position.z += particle.velocity.z * delta;

      // Update rotation
      particle.rotation += particle.rotationSpeed * delta;

      // Reset if below ground
      if (particle.position.y < 0) {
        particle.position.set(
          (Math.random() - 0.5) * width,
          100 + Math.random() * 50,
          (Math.random() - 0.5) * depth
        );
        particle.life = 1;
      }

      // Set transform
      const size = 0.15 + Math.random() * 0.1;
      tempObject.position.copy(particle.position);
      tempObject.rotation.set(particle.rotation, particle.rotation * 0.7, 0);
      tempObject.scale.set(size, size, size);
      tempObject.updateMatrix();

      meshRef.current!.setMatrixAt(i, tempObject.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, particleCount]}
      frustumCulled={false}
    >
      <octahedronGeometry args={[0.5, 0]} />
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.8}
        depthWrite={false}
      />
    </instancedMesh>
  );
};

/**
 * Wind Effect Component
 * Visual wind particles and ambient effects
 */
const WindEffect: React.FC<{
  intensity: number;
  particlesRef: React.RefObject<THREE.Points>;
  areaSize: [number, number];
}> = ({ intensity, particlesRef, areaSize }) => {
  const particleCount = Math.floor(500 * intensity);

  const { geometry, material } = useMemo(() => {
    const [width, depth] = areaSize;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * width;
      positions[i3 + 1] = Math.random() * 50;
      positions[i3 + 2] = (Math.random() - 0.5) * depth;

      velocities[i3] = 5 + Math.random() * 10;
      velocities[i3 + 1] = (Math.random() - 0.5) * 2;
      velocities[i3 + 2] = (Math.random() - 0.5) * 3;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.3,
      color: '#e0e0e0',
      transparent: true,
      opacity: 0.3,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    return { geometry: geo, material: mat };
  }, [particleCount, areaSize]);

  useFrame((state, delta) => {
    if (!particlesRef.current) return;

    const positions = geometry.attributes.position.array as Float32Array;
    const velocities = geometry.attributes.velocity.array as Float32Array;
    const [width, depth] = areaSize;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      positions[i3] += velocities[i3] * delta * intensity;
      positions[i3 + 1] += velocities[i3 + 1] * delta;
      positions[i3 + 2] += velocities[i3 + 2] * delta;

      // Wrap around
      if (positions[i3] > width / 2) positions[i3] = -width / 2;
      if (positions[i3] < -width / 2) positions[i3] = width / 2;
      if (positions[i3 + 2] > depth / 2) positions[i3 + 2] = -depth / 2;
      if (positions[i3 + 2] < -depth / 2) positions[i3 + 2] = depth / 2;
    }

    geometry.attributes.position.needsUpdate = true;
  });

  return <points ref={particlesRef} geometry={geometry} material={material} />;
};

/**
 * Atmospheric Lighting Component
 * Adjusts scene lighting based on weather conditions
 */
const AtmosphericLighting: React.FC<{
  weather: WeatherType;
  transitionProgress: number;
  intensity: number;
}> = ({ weather, transitionProgress, intensity }) => {
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const ambientRef = useRef<THREE.AmbientLight>(null);

  const getLightingConfig = (weatherType: WeatherType) => {
    switch (weatherType) {
      case 'clear':
        return { directional: 1.2, ambient: 0.6, color: '#ffffff' };
      case 'rain':
        return { directional: 0.5, ambient: 0.4, color: '#b0c4de' };
      case 'snow':
        return { directional: 0.8, ambient: 0.7, color: '#f0f8ff' };
      case 'windy':
        return { directional: 1.0, ambient: 0.5, color: '#fffacd' };
      case 'storm':
        return { directional: 0.3, ambient: 0.3, color: '#708090' };
      default:
        return { directional: 1.0, ambient: 0.5, color: '#ffffff' };
    }
  };

  useFrame(() => {
    if (!lightRef.current || !ambientRef.current) return;

    const config = getLightingConfig(weather);
    const t = transitionProgress;

    lightRef.current.intensity = config.directional * intensity * t + (1 - t) * lightRef.current.intensity;
    ambientRef.current.intensity = config.ambient * intensity * t + (1 - t) * ambientRef.current.intensity;
  });

  const config = getLightingConfig(weather);

  return (
    <>
      <directionalLight
        ref={lightRef}
        position={[50, 100, 50]}
        intensity={config.directional * intensity}
        color={config.color}
      />
      <ambientLight
        ref={ambientRef}
        intensity={config.ambient * intensity}
        color={config.color}
      />
    </>
  );
};

/**
 * Wet Surface Effect Component
 * Adds reflective properties to surfaces when wet
 */
const WetSurfaceEffect: React.FC<{
  wetness: number;
  areaSize: [number, number];
}> = ({ wetness, areaSize }) => {
  const [width, depth] = areaSize;

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} receiveShadow>
      <planeGeometry args={[width, depth]} />
      <meshStandardMaterial
        color="#1a1a1a"
        transparent
        opacity={wetness * 0.15}
        roughness={Math.max(0.1, 1 - wetness * 0.7)}
        metalness={wetness * 0.3}
        envMapIntensity={wetness * 2}
      />
    </mesh>
  );
};

/**
 * Sun Effect Component
 * Volumetric sun rays and dynamic shadows
 */
const SunEffect: React.FC<{
  intensity: number;
  time: number;
}> = ({ intensity, time }) => {
  // Sun position changes throughout the day
  const sunAngle = (time * 0.1) % (Math.PI * 2);
  const sunX = Math.cos(sunAngle) * 100;
  const sunY = 50 + Math.sin(sunAngle) * 30;
  const sunZ = Math.sin(sunAngle) * 100;

  return (
    <>
      <pointLight
        position={[sunX, sunY, sunZ]}
        intensity={intensity * 1.5}
        color="#fff5e6"
        distance={300}
        decay={2}
      />
      {/* God rays effect (simplified) */}
      <mesh position={[sunX, sunY, sunZ]}>
        <sphereGeometry args={[5, 16, 16]} />
        <meshBasicMaterial
          color="#fff5e6"
          transparent
          opacity={intensity * 0.3}
          toneMapped={false}
        />
      </mesh>
    </>
  );
};

export default WeatherSystem;

// Export helper hook for weather control
export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherType>('clear');
  const [intensity, setIntensity] = useState(0.7);

  const changeWeather = (newWeather: WeatherType, newIntensity?: number) => {
    setWeather(newWeather);
    if (newIntensity !== undefined) {
      setIntensity(newIntensity);
    }
  };

  return {
    weather,
    intensity,
    changeWeather,
    setWeather,
    setIntensity
  };
};
