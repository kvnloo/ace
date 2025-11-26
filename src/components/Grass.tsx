import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GrassProps {
  position: [number, number, number];
  size: [number, number];
  bladeCount?: number;
  color?: string;
  animated?: boolean;
}

/**
 * Grass component using instanced meshes for performance
 *
 * KEY FIX: Don't use vertexColors with setColorAt!
 * - vertexColors is for vertex-level colors on geometry
 * - setColorAt sets per-instance colors that multiply with material color
 * - Using both causes the color to be wrong (brown/gray instead of green)
 *
 * Solution: Use a white base material color and let setColorAt handle all coloring
 */
const Grass: React.FC<GrassProps> = ({
  position,
  size,
  bladeCount = 2000,
  color = '#4d7c0f',
  animated = true
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const timeRef = useRef(0);

  // Generate grass blade data with color variation
  const grassData = useMemo(() => {
    const instances = [];
    const [width, depth] = size;
    const baseColor = new THREE.Color(color);

    for (let i = 0; i < bladeCount; i++) {
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
  }, [size, bladeCount, color]);

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

  // Animate grass with wind effect
  useFrame((state, delta) => {
    if (!animated || !meshRef.current) return;

    timeRef.current += delta * 0.5;
    const tempObject = new THREE.Object3D();

    grassData.forEach((blade, i) => {
      // Calculate wind sway
      const windStrength = Math.sin(timeRef.current + blade.phase) * 0.08;
      const windBend = Math.sin(timeRef.current * 2 + blade.phase * 1.5) * 0.05;

      const [x, y, z] = blade.position;
      tempObject.position.set(x, y, z);
      tempObject.rotation.set(windBend, blade.rotation, windStrength);
      tempObject.scale.set(blade.scale, blade.height, blade.scale);
      tempObject.updateMatrix();

      meshRef.current!.setMatrixAt(i, tempObject.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group position={position}>
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, bladeCount]}
        castShadow
        receiveShadow
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

export default Grass;
