/**
 * GrassAdaptive Component
 *
 * High-performance grass with FPS-based adaptive density.
 * Automatically increases grass density while maintaining target FPS.
 *
 * Real-world grass reference:
 * - Tennis court (78ft x 36ft = 2,808 sq ft)
 * - Real grass: ~2,500 blades/sq ft = ~7 million blades per court
 * - We scale this down but still aim for visually-dense appearance
 */

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GrassAdaptiveProps {
  position: [number, number, number];
  size: [number, number];
  color?: string;
  animated?: boolean;
  /** Target FPS to maintain (default: 60) */
  targetFPS?: number;
  /** Starting blade count (default: 20000) */
  initialDensity?: number;
  /** Maximum blade count (default: 150000) */
  maxDensity?: number;
  /** Callback when density changes */
  onDensityChange?: (density: number, fps: number) => void;
}

// Real-world constants for reference
const REAL_BLADES_PER_COURT = 7_000_000;

// Create grass blade geometry - cached and reused
const createGrassBladeGeometry = (): THREE.BufferGeometry => {
  const geometry = new THREE.BufferGeometry();

  const bladeWidth = 0.05;
  const bladeHeight = 1.0;
  const midHeight = 0.5;
  const midWidth = bladeWidth * 0.5;

  const vertices = new Float32Array([
    -bladeWidth / 2, 0, 0,
    bladeWidth / 2, 0, 0,
    -midWidth / 2, midHeight, 0,
    midWidth / 2, midHeight, 0,
    0, bladeHeight, 0,
  ]);

  const indices = new Uint16Array([0, 1, 2, 1, 3, 2, 2, 3, 4]);

  const colors = new Float32Array([
    0, 0, 0,
    0, 0, 0,
    0.4, 0.4, 0.4,
    0.4, 0.4, 0.4,
    1, 1, 1,
  ]);

  const uvs = new Float32Array([0, 0, 1, 0, 0, 0.5, 1, 0.5, 0.5, 1]);

  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  geometry.computeVertexNormals();

  return geometry;
};

// Shader for wind animation
const grassVertexShader = `
  uniform float uTime;
  uniform float uWindStrength;

  attribute vec3 color;

  varying vec3 vColor;
  varying vec2 vUv;
  varying float vWindFactor;

  void main() {
    vColor = color;
    vUv = uv;
    vWindFactor = color.r;

    vec3 pos = position;

    if (vWindFactor > 0.0) {
      float wave1 = sin(uTime * 1.5 + pos.x * 2.0 + pos.z * 2.0) * uWindStrength;
      float wave2 = sin(uTime * 3.0 + pos.x * 4.0) * uWindStrength * 0.3;
      float wave3 = sin(uTime * 5.0 + pos.z * 6.0) * uWindStrength * 0.1;
      float totalWind = (wave1 + wave2 + wave3) * vWindFactor;
      pos.x += totalWind;
      pos.z += totalWind * 0.5;
    }

    vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const grassFragmentShader = `
  uniform vec3 uBaseColor;
  uniform vec3 uTipColor;

  varying vec3 vColor;
  varying vec2 vUv;
  varying float vWindFactor;

  void main() {
    vec3 finalColor = mix(uBaseColor, uTipColor, vUv.y * 0.7);
    finalColor *= (0.9 + vWindFactor * 0.1);
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

// Generate grass blade positions using seeded random for consistency
const generateGrassPositions = (
  count: number,
  width: number,
  depth: number,
  seed: number = 12345
) => {
  const instances = [];
  let s = seed;
  const random = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };

  for (let i = 0; i < count; i++) {
    instances.push({
      x: (random() - 0.5) * width,
      z: (random() - 0.5) * depth,
      height: 0.5 + random() * 0.6,
      rotation: random() * Math.PI * 2,
      lean: (random() - 0.5) * 0.25,
      scale: 0.7 + random() * 0.5,
    });
  }

  return instances;
};

const GrassAdaptive: React.FC<GrassAdaptiveProps> = ({
  position,
  size,
  color = '#4d7c0f',
  animated = true,
  targetFPS = 60,
  initialDensity = 20000,
  maxDensity = 150000,
  onDensityChange,
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const densityRef = useRef(initialDensity);
  const [renderKey, setRenderKey] = useState(0);

  // FPS tracking refs
  const frameTimesRef = useRef<number[]>([]);
  const lastTimeRef = useRef(performance.now());
  const framesSinceChangeRef = useRef(0);
  const hasReachedMaxRef = useRef(false);
  const initialDelayRef = useRef(true);
  const frameCountRef = useRef(0);

  // Phase tracking: 'burst' = aggressive initial scaling, 'monitor' = periodic checks
  const phaseRef = useRef<'init' | 'burst' | 'monitor'>('init');
  const lastMonitorCheckRef = useRef(0);
  const burstIterationsRef = useRef(0);
  const stableCountRef = useRef(0); // Count of consecutive stable checks

  // Geometry and material (memoized, never changes)
  const geometry = useMemo(() => createGrassBladeGeometry(), []);

  const material = useMemo(() => {
    const baseColor = new THREE.Color(color);
    const tipColor = new THREE.Color(color).offsetHSL(0.05, 0, 0.15);

    return new THREE.ShaderMaterial({
      vertexShader: grassVertexShader,
      fragmentShader: grassFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uWindStrength: { value: 0.12 },
        uBaseColor: { value: baseColor },
        uTipColor: { value: tipColor },
      },
      side: THREE.DoubleSide,
    });
  }, [color]);

  // Generate grass positions based on current density
  const grassData = useMemo(() => {
    const count = densityRef.current;
    console.log(`[GrassAdaptive] Generating ${count.toLocaleString()} grass blades (${((count / REAL_BLADES_PER_COURT) * 100).toFixed(3)}% of real grass)`);
    return generateGrassPositions(count, size[0], size[1]);
  }, [renderKey, size]);

  // Apply transforms to instances when grass data changes
  useEffect(() => {
    if (!meshRef.current) return;

    const tempObject = new THREE.Object3D();
    const count = Math.min(grassData.length, densityRef.current);

    for (let i = 0; i < count; i++) {
      const blade = grassData[i];
      tempObject.position.set(blade.x, 0, blade.z);
      tempObject.rotation.set(blade.lean, blade.rotation, 0);
      tempObject.scale.set(blade.scale, blade.height, blade.scale);
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    meshRef.current.count = count;
  }, [grassData]);

  // Animation and adaptive density logic
  useFrame((state) => {
    // Update wind animation
    if (animated && material.uniforms) {
      material.uniforms.uTime.value = state.clock.elapsedTime;
    }

    const now = performance.now();

    // Calculate frame time
    const frameTime = now - lastTimeRef.current;
    lastTimeRef.current = now;

    // Store frame times (keep last 30)
    if (frameTime > 0 && frameTime < 200) { // Ignore outliers
      frameTimesRef.current.push(frameTime);
      if (frameTimesRef.current.length > 30) {
        frameTimesRef.current.shift();
      }
    }

    frameCountRef.current++;
    framesSinceChangeRef.current++;

    // === PHASE: INIT - Wait for scene to stabilize ===
    if (phaseRef.current === 'init') {
      if (frameCountRef.current >= 45) {
        phaseRef.current = 'burst';
        frameTimesRef.current = [];
        console.log('[GrassAdaptive] Starting burst phase - aggressive density scaling');
      }
      return;
    }

    // Helper: Calculate current FPS
    const calculateFPS = () => {
      if (frameTimesRef.current.length < 10) return 0;
      const avg = frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length;
      return 1000 / avg;
    };

    // Helper: Try to increase density
    const tryIncreaseDensity = (currentFPS: number): boolean => {
      if (densityRef.current >= maxDensity || currentFPS < targetFPS * 1.3) {
        return false;
      }

      const headroom = currentFPS - targetFPS;
      let growthFactor: number;

      if (headroom > 180) {
        growthFactor = 3.0;
      } else if (headroom > 120) {
        growthFactor = 2.5;
      } else if (headroom > 80) {
        growthFactor = 2.0;
      } else if (headroom > 40) {
        growthFactor = 1.5;
      } else {
        growthFactor = 1.2;
      }

      const newDensity = Math.min(
        Math.round(densityRef.current * growthFactor),
        maxDensity
      );

      if (newDensity > densityRef.current) {
        const phase = phaseRef.current;
        console.log(
          `[GrassAdaptive] [${phase}] FPS: ${currentFPS.toFixed(0)} | ${densityRef.current.toLocaleString()} → ${newDensity.toLocaleString()} (${((newDensity / REAL_BLADES_PER_COURT) * 100).toFixed(2)}% real)`
        );

        densityRef.current = newDensity;
        framesSinceChangeRef.current = 0;
        frameTimesRef.current = [];
        stableCountRef.current = 0;

        if (newDensity >= maxDensity) {
          hasReachedMaxRef.current = true;
          phaseRef.current = 'monitor';
          console.log(`[GrassAdaptive] Reached maximum density: ${maxDensity.toLocaleString()} - switching to monitor phase`);
        }

        onDensityChange?.(newDensity, currentFPS);
        setRenderKey(prev => prev + 1);
        return true;
      }
      return false;
    };

    // === PHASE: BURST - Aggressive initial scaling ===
    if (phaseRef.current === 'burst') {
      // Check every 20 frames during burst
      if (framesSinceChangeRef.current < 20 || frameTimesRef.current.length < 15) {
        return;
      }

      const currentFPS = calculateFPS();
      if (currentFPS === 0) return;

      burstIterationsRef.current++;

      const increased = tryIncreaseDensity(currentFPS);

      if (!increased) {
        stableCountRef.current++;
        // If we've been stable for 3 consecutive checks, switch to monitor phase
        if (stableCountRef.current >= 3) {
          phaseRef.current = 'monitor';
          lastMonitorCheckRef.current = now;
          console.log(`[GrassAdaptive] Burst complete after ${burstIterationsRef.current} iterations. Final density: ${densityRef.current.toLocaleString()} - switching to monitor phase`);
        }
      }

      // Safety: After 20 burst iterations, switch to monitor anyway
      if (burstIterationsRef.current >= 20) {
        phaseRef.current = 'monitor';
        lastMonitorCheckRef.current = now;
        console.log(`[GrassAdaptive] Burst timeout. Final density: ${densityRef.current.toLocaleString()} - switching to monitor phase`);
      }

      return;
    }

    // === PHASE: MONITOR - Periodic checks every 5 seconds ===
    if (phaseRef.current === 'monitor') {
      const timeSinceLastCheck = now - lastMonitorCheckRef.current;

      // Check every 5 seconds
      if (timeSinceLastCheck < 5000) {
        return;
      }

      lastMonitorCheckRef.current = now;

      if (hasReachedMaxRef.current) {
        return; // Already at max, nothing to do
      }

      const currentFPS = calculateFPS();
      if (currentFPS === 0) return;

      const increased = tryIncreaseDensity(currentFPS);
      if (increased) {
        console.log(`[GrassAdaptive] [monitor] Periodic increase successful`);
      }
    }
  });

  return (
    <group position={position}>
      <instancedMesh
        key={renderKey}
        ref={meshRef}
        args={[geometry, material, densityRef.current]}
        receiveShadow
        frustumCulled={true}
      />
    </group>
  );
};

export default GrassAdaptive;
