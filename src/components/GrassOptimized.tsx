import React, { useRef, useMemo, useEffect } from 'react';
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
 * Optimized Grass Component with PROPER instance coloring
 *
 * KEY FIX: Don't use vertexColors with setColorAt!
 * - vertexColors is for vertex-level colors on geometry
 * - setColorAt sets per-instance colors that multiply with material color
 * - Using both causes the color to be wrong (brown/gray instead of green)
 *
 * Solution: Use a white base material color and let setColorAt handle all coloring
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
  const optimizedBladeCount = useMemo(() => {
    const modifiers = {
      high: 1.0,
      medium: 0.5,
      low: 0.25
    };
    return Math.floor(bladeCount * modifiers[performanceMode]);
  }, [bladeCount, performanceMode]);

  // Update interval based on performance mode
  const updateInterval = useMemo(() => ({
    high: 0,     // Every frame
    medium: 16,  // ~60fps
    low: 50      // ~20fps
  })[performanceMode], [performanceMode]);

  // Generate grass blade data with color variation
  const grassData = useMemo(() => {
    const instances = [];
    const [width, depth] = size;
    const baseColor = new THREE.Color(color);

    for (let i = 0; i < optimizedBladeCount; i++) {
      const x = (Math.random() - 0.5) * width;
      const z = (Math.random() - 0.5) * depth;
      const height = 0.8 + Math.random() * 0.4;
      const rotation = Math.random() * Math.PI * 2;
      const scale = 0.8 + Math.random() * 0.4;

      // Color variation for natural look (85% to 115% of base color)
      const colorVariation = 0.85 + Math.random() * 0.30;
      const bladeColor = baseColor.clone().multiplyScalar(colorVariation);

      instances.push({
        position: [x, 0, z] as [number, number, number],
        rotation,
        height,
        scale,
        color: bladeColor,
        phase: Math.random() * Math.PI * 2
      });
    }

    return instances;
  }, [size, optimizedBladeCount, color]);

  // Apply initial transforms - use useEffect to ensure meshRef is available
  useEffect(() => {
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
      ? Math.floor(grassData.length * 0.5)
      : grassData.length;

    for (let i = 0; i < bladesToUpdate; i++) {
      const blade = grassData[i];

      // Wind calculation
      const windStrength = performanceMode === 'high'
        ? Math.sin(timeRef.current + blade.phase) * 0.08 * lodMultiplier
        : Math.sin(timeRef.current * 0.5) * 0.04;

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
        args={[undefined, undefined, optimizedBladeCount]}
        castShadow={performanceMode === 'high'}
        receiveShadow
        frustumCulled={true}
      >
        {/* Grass blade geometry - thin elongated quad */}
        <planeGeometry args={[0.15, 1]} />
        {/*
          KEY: Use color="#ffffff" (white) as base!
          The instance colors from setColorAt will multiply with this.
          White * green = green. Any other base color would tint the result wrong.

          DO NOT use vertexColors - that's for per-vertex colors on geometry,
          not for per-instance colors!
        */}
        <meshStandardMaterial
          color="#ffffff"
          side={THREE.DoubleSide}
          roughness={0.8}
          metalness={0}
        />
      </instancedMesh>
    </group>
  );
};

export default GrassOptimized;
