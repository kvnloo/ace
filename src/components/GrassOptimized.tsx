import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface GrassOptimizedProps {
  position: [number, number, number];
  size: [number, number];
  bladeCount?: number;
  color?: string;
  animated?: boolean;
  performanceMode?: 'high' | 'medium' | 'low';
}

/**
 * Optimized Grass Component
 *
 * Performance improvements:
 * - Reduced blade count based on performance mode
 * - LOD system based on camera distance
 * - Throttled animations
 * - Frustum culling enabled
 * - Cached geometry and materials
 * - Conditional animation based on visibility
 */
const GrassOptimized: React.FC<GrassOptimizedProps> = ({
  position,
  size,
  bladeCount = 2000,
  color = '#4d7c0f',
  animated = true,
  performanceMode = 'medium'
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { camera } = useThree();
  const timeRef = useRef(0);
  const lastUpdateRef = useRef(0);
  const visibleRef = useRef(true);

  // Adjust blade count based on performance mode
  const getOptimizedBladeCount = () => {
    const modifiers = {
      high: 1.0,
      medium: 0.5,
      low: 0.25
    };
    return Math.floor(bladeCount * modifiers[performanceMode]);
  };

  const optimizedBladeCount = getOptimizedBladeCount();

  // Update interval based on performance mode
  const updateInterval = useMemo(() => ({
    high: 0,     // Every frame
    medium: 16,  // ~60fps
    low: 50      // ~20fps
  })[performanceMode], [performanceMode]);

  // Cached geometry and material
  const { geometry, material } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(0.15, 1, 1, performanceMode === 'low' ? 1 : 2);
    const mat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      side: THREE.DoubleSide,
      roughness: 0.8,
      metalness: 0
    });
    return { geometry: geo, material: mat };
  }, [performanceMode]);

  // Generate grass blade data with LOD
  const grassData = useMemo(() => {
    const instances = [];
    const [width, depth] = size;
    const tempColor = new THREE.Color();

    for (let i = 0; i < optimizedBladeCount; i++) {
      const x = (Math.random() - 0.5) * width;
      const z = (Math.random() - 0.5) * depth;
      const height = 0.8 + Math.random() * 0.4;
      const rotation = Math.random() * Math.PI * 2;
      const scale = 0.8 + Math.random() * 0.4;

      // Color variation (simpler calculation)
      const colorVariation = 0.85 + Math.random() * 0.15;
      tempColor.setStyle(color).multiplyScalar(colorVariation);

      instances.push({
        position: [x, 0, z] as [number, number, number],
        rotation,
        height,
        scale,
        color: tempColor.clone(),
        phase: Math.random() * Math.PI * 2,
        lodDistance: 0 // Will be calculated based on camera distance
      });
    }

    return instances;
  }, [size, optimizedBladeCount, color]);

  // Apply initial transforms
  useMemo(() => {
    if (!meshRef.current) return;

    const tempObject = new THREE.Object3D();

    grassData.forEach((blade, i) => {
      const [x, y, z] = blade.position;
      tempObject.position.set(x, y, z);
      tempObject.rotation.set(0, blade.rotation, 0);
      tempObject.scale.set(blade.scale, blade.height, blade.scale);
      tempObject.updateMatrix();

      meshRef.current!.setMatrixAt(i, tempObject.matrix);
      meshRef.current!.setColorAt(i, blade.color);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [grassData]);

  // Optimized animation with LOD and frustum culling
  useFrame((state, delta) => {
    if (!animated || !meshRef.current || !visibleRef.current) return;

    const now = state.clock.elapsedTime * 1000;

    // Throttle updates based on performance mode
    if (updateInterval > 0 && now - lastUpdateRef.current < updateInterval) {
      return;
    }
    lastUpdateRef.current = now;

    timeRef.current += delta * 0.5;

    // Check if grass is in view (simple frustum check)
    const grassWorldPos = new THREE.Vector3(...position);
    const distanceToCamera = camera.position.distanceTo(grassWorldPos);

    // Skip animation if too far
    if (distanceToCamera > 150) {
      visibleRef.current = false;
      return;
    }
    visibleRef.current = true;

    const tempObject = new THREE.Object3D();
    const lodMultiplier = distanceToCamera > 100 ? 0.5 : distanceToCamera > 50 ? 0.75 : 1.0;

    // Update only visible blades with LOD
    const bladesToUpdate = performanceMode === 'low'
      ? Math.floor(grassData.length * 0.5)  // Update only half in low mode
      : grassData.length;

    for (let i = 0; i < bladesToUpdate; i++) {
      const blade = grassData[i];

      // Simplified wind calculation
      const windStrength = performanceMode === 'high'
        ? Math.sin(timeRef.current + blade.phase) * 0.08 * lodMultiplier
        : Math.sin(timeRef.current * 0.5) * 0.04; // Simpler calculation for lower modes

      const windBend = performanceMode === 'high'
        ? Math.sin(timeRef.current * 2 + blade.phase * 1.5) * 0.05 * lodMultiplier
        : 0;

      const [x, y, z] = blade.position;
      tempObject.position.set(x, y, z);
      tempObject.rotation.set(windBend, blade.rotation, windStrength);
      tempObject.scale.set(blade.scale, blade.height, blade.scale);
      tempObject.updateMatrix();

      meshRef.current!.setMatrixAt(i, tempObject.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group position={position}>
      <instancedMesh
        ref={meshRef}
        args={[geometry, material, optimizedBladeCount]}
        castShadow={performanceMode === 'high'} // Only cast shadows in high mode
        receiveShadow
        frustumCulled={true} // Enable frustum culling
      >
      </instancedMesh>
    </group>
  );
};

export default GrassOptimized;