import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useDebug } from '../contexts/DebugContext';

// Weather type definitions
export type WeatherType = 'clear' | 'rain' | 'snow' | 'windy' | 'storm';

interface WeatherSystemProps {
  weather?: WeatherType;
  transitionDuration?: number;
  intensity?: number;
  enableEffects?: boolean;
  areaSize?: [number, number];
  enableWetSurfaces?: boolean;
  onWeatherChange?: (weather: WeatherType) => void;
  performanceMode?: 'high' | 'medium' | 'low';
}

/**
 * Optimized WeatherSystem Component
 *
 * Performance Improvements:
 * - Reduced particle counts based on performance mode
 * - Frustum culling enabled
 * - LOD system for particles based on camera distance
 * - Throttled animation updates
 * - Conditional rendering based on visibility
 * - GPU-optimized instanced rendering
 * - Cached geometry and materials
 */
const WeatherSystemOptimized: React.FC<WeatherSystemProps> = ({
  weather = 'clear',
  transitionDuration = 3,
  intensity = 0.7,
  enableEffects = true,
  areaSize = [300, 300],
  enableWetSurfaces = true,
  onWeatherChange,
  performanceMode = 'medium'
}) => {
  const { registerAsset, isAssetEnabled } = useDebug();
  const { camera } = useThree();
  const [currentWeather, setCurrentWeather] = useState<WeatherType>(weather);
  const [targetWeather, setTargetWeather] = useState<WeatherType>(weather);
  const [transitionProgress, setTransitionProgress] = useState(1);
  const [wetness, setWetness] = useState(0);
  const [particleLOD, setParticleLOD] = useState(1); // LOD multiplier

  const rainMeshRef = useRef<THREE.InstancedMesh>(null);
  const snowMeshRef = useRef<THREE.InstancedMesh>(null);
  const windParticlesRef = useRef<THREE.Points>(null);
  const timeRef = useRef(0);
  const lastUpdateRef = useRef(0);

  // Performance-based particle counts
  const getParticleCount = (baseCount: number): number => {
    const modifiers = {
      high: 1.0,
      medium: 0.5,
      low: 0.25
    };
    return Math.floor(baseCount * modifiers[performanceMode] * particleLOD);
  };

  // Update throttling based on performance mode
  const getUpdateInterval = (): number => {
    const intervals = {
      high: 0,      // Every frame
      medium: 16,   // ~60fps
      low: 33       // ~30fps
    };
    return intervals[performanceMode];
  };

  // Register debug assets
  useEffect(() => {
    registerAsset({
      id: 'weather-particles-optimized',
      name: 'Optimized Weather Particles',
      type: 'weather',
      enabled: true,
      performanceCost: performanceMode === 'low' ? 2 : performanceMode === 'medium' ? 4 : 6
    });
  }, [registerAsset, performanceMode]);

  // Weather transition management
  useEffect(() => {
    if (weather !== targetWeather) {
      setTargetWeather(weather);
      setTransitionProgress(0);
      onWeatherChange?.(weather);
    }
  }, [weather, targetWeather, onWeatherChange]);

  // Update LOD based on camera distance
  useFrame(() => {
    const distance = camera.position.length();
    const newLOD = distance > 200 ? 0.5 : distance > 100 ? 0.75 : 1.0;
    if (Math.abs(newLOD - particleLOD) > 0.1) {
      setParticleLOD(newLOD);
    }
  });

  // Throttled update for transitions
  useFrame((state, delta) => {
    const now = state.clock.elapsedTime * 1000;
    const updateInterval = getUpdateInterval();

    if (updateInterval > 0 && now - lastUpdateRef.current < updateInterval) {
      return; // Skip this frame for performance
    }
    lastUpdateRef.current = now;

    if (transitionProgress < 1) {
      setTransitionProgress(Math.min(1, transitionProgress + delta / transitionDuration));
      if (transitionProgress >= 1) {
        setCurrentWeather(targetWeather);
      }
    }

    // Update wetness
    if (targetWeather === 'rain' || targetWeather === 'storm') {
      setWetness(Math.min(1, wetness + delta * 0.2));
    } else {
      setWetness(Math.max(0, wetness - delta * 0.1));
    }

    timeRef.current += delta;
  });

  const getCurrentIntensity = () => {
    if (transitionProgress >= 1) return intensity;
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
        isAssetEnabled('weather-particles-optimized') && (
        <RainEffectOptimized
          intensity={getCurrentIntensity() * (currentWeather === 'storm' || targetWeather === 'storm' ? 1.5 : 1)}
          meshRef={rainMeshRef}
          areaSize={areaSize}
          windStrength={currentWeather === 'storm' || targetWeather === 'storm' ? 0.3 : 0.1}
          particleCount={getParticleCount(2000)}
          performanceMode={performanceMode}
        />
      )}

      {/* Snow Effect */}
      {(currentWeather === 'snow' || targetWeather === 'snow') &&
        enableEffects &&
        isAssetEnabled('weather-particles-optimized') && (
        <SnowEffectOptimized
          intensity={getCurrentIntensity()}
          meshRef={snowMeshRef}
          areaSize={areaSize}
          windStrength={0.2}
          particleCount={getParticleCount(1500)}
          performanceMode={performanceMode}
        />
      )}

      {/* Atmospheric Lighting - simplified */}
      <AtmosphericLightingOptimized
        weather={transitionProgress >= 1 ? currentWeather : targetWeather}
        transitionProgress={transitionProgress}
        intensity={intensity}
      />

      {/* Wet Surface Effects - only in high mode */}
      {performanceMode === 'high' && enableWetSurfaces && wetness > 0 && (
        <WetSurfaceEffectOptimized wetness={wetness} areaSize={areaSize} />
      )}
    </group>
  );
};

/**
 * Optimized Rain Effect
 * - Reduced particle count
 * - Frustum culling enabled
 * - Simplified physics calculations
 * - Batch updates
 */
const RainEffectOptimized: React.FC<{
  intensity: number;
  meshRef: React.RefObject<THREE.InstancedMesh>;
  areaSize: [number, number];
  windStrength: number;
  particleCount: number;
  performanceMode: 'high' | 'medium' | 'low';
}> = ({ intensity, meshRef, areaSize, windStrength, particleCount, performanceMode }) => {
  const { camera } = useThree();
  const lastUpdateRef = useRef(0);

  // Static geometry and material (cached)
  const { geometry, material } = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.02, 0.02, 1, performanceMode === 'low' ? 3 : 4);
    const mat = new THREE.MeshBasicMaterial({
      color: '#a0c4ff',
      transparent: true,
      opacity: 0.6,
      depthWrite: false
    });
    return { geometry: geo, material: mat };
  }, [performanceMode]);

  const particles = useMemo(() => {
    const [width, depth] = areaSize;
    const particleData = [];

    for (let i = 0; i < particleCount; i++) {
      particleData.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * width,
          Math.random() * 100 + 50,
          (Math.random() - 0.5) * depth
        ),
        velocity: new THREE.Vector3(
          windStrength * (Math.random() - 0.5),
          -(15 + Math.random() * 10),
          windStrength * (Math.random() - 0.5)
        ),
        phase: Math.random() * Math.PI * 2
      });
    }

    return particleData;
  }, [particleCount, areaSize, windStrength]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Throttle updates for low performance mode
    const now = state.clock.elapsedTime * 1000;
    if (performanceMode === 'low' && now - lastUpdateRef.current < 33) return;
    lastUpdateRef.current = now;

    const [width, depth] = areaSize;
    const tempObject = new THREE.Object3D();
    const camPos = camera.position;

    // Batch update with distance culling
    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];

      // Simple distance check for culling
      const distanceSq = particle.position.distanceToSquared(camPos);
      if (distanceSq > 40000) continue; // Skip distant particles

      // Update position
      particle.position.addScaledVector(particle.velocity, delta);

      // Reset if below ground
      if (particle.position.y < 0) {
        particle.position.set(
          (Math.random() - 0.5) * width,
          100 + Math.random() * 50,
          (Math.random() - 0.5) * depth
        );
      }

      // Simplified transform update
      tempObject.position.copy(particle.position);
      tempObject.scale.set(0.08, 2.5, 0.08);
      tempObject.updateMatrix();

      meshRef.current!.setMatrixAt(i, tempObject.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, particleCount]}
      frustumCulled={true} // Enable frustum culling
    />
  );
};

/**
 * Optimized Snow Effect
 * - Reduced complexity
 * - Simplified animations
 * - Distance-based rendering
 */
const SnowEffectOptimized: React.FC<{
  intensity: number;
  meshRef: React.RefObject<THREE.InstancedMesh>;
  areaSize: [number, number];
  windStrength: number;
  particleCount: number;
  performanceMode: 'high' | 'medium' | 'low';
}> = ({ intensity, meshRef, areaSize, windStrength, particleCount, performanceMode }) => {
  const { camera } = useThree();
  const lastUpdateRef = useRef(0);

  // Simplified geometry for better performance
  const { geometry, material } = useMemo(() => {
    const geo = new THREE.TetrahedronGeometry(0.5, 0); // Simpler than octahedron
    const mat = new THREE.MeshBasicMaterial({
      color: '#ffffff',
      transparent: true,
      opacity: 0.8,
      depthWrite: false
    });
    return { geometry: geo, material: mat };
  }, []);

  const particles = useMemo(() => {
    const [width, depth] = areaSize;
    const particleData = [];

    for (let i = 0; i < particleCount; i++) {
      particleData.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * width,
          Math.random() * 100 + 50,
          (Math.random() - 0.5) * depth
        ),
        velocity: -(0.5 + Math.random() * 1.5),
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 2,
        phase: Math.random() * Math.PI * 2
      });
    }

    return particleData;
  }, [particleCount, areaSize]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Throttle for performance
    const now = state.clock.elapsedTime * 1000;
    if (performanceMode === 'low' && now - lastUpdateRef.current < 50) return;
    lastUpdateRef.current = now;

    const [width, depth] = areaSize;
    const tempObject = new THREE.Object3D();
    const time = state.clock.elapsedTime;

    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];

      // Simplified motion
      const sway = performanceMode === 'high'
        ? Math.sin(time * 0.5 + particle.phase) * windStrength * 2
        : 0;

      particle.position.x += sway * delta;
      particle.position.y += particle.velocity * delta;

      // Reset if below ground
      if (particle.position.y < 0) {
        particle.position.set(
          (Math.random() - 0.5) * width,
          100 + Math.random() * 50,
          (Math.random() - 0.5) * depth
        );
      }

      // Update rotation only in high mode
      if (performanceMode === 'high') {
        particle.rotation += particle.rotationSpeed * delta;
      }

      // Set transform
      const size = 0.15;
      tempObject.position.copy(particle.position);
      tempObject.rotation.set(0, particle.rotation, 0);
      tempObject.scale.setScalar(size);
      tempObject.updateMatrix();

      meshRef.current!.setMatrixAt(i, tempObject.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, particleCount]}
      frustumCulled={true}
    />
  );
};

/**
 * Simplified Atmospheric Lighting
 */
const AtmosphericLightingOptimized: React.FC<{
  weather: WeatherType;
  transitionProgress: number;
  intensity: number;
}> = ({ weather, intensity }) => {
  const config = useMemo(() => {
    switch (weather) {
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
  }, [weather]);

  return (
    <>
      <directionalLight
        position={[50, 100, 50]}
        intensity={config.directional * intensity}
        color={config.color}
      />
      <ambientLight
        intensity={config.ambient * intensity}
        color={config.color}
      />
    </>
  );
};

/**
 * Simplified Wet Surface Effect
 */
const WetSurfaceEffectOptimized: React.FC<{
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
      />
    </mesh>
  );
};

export default WeatherSystemOptimized;

// Export the same helper hook
export { useWeather } from './WeatherSystem';