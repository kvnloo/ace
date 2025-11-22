import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GrassProps {
  /** Position of the grass patch [x, y, z] */
  position: [number, number, number];
  /** Size of the grass area [width, depth] */
  size: [number, number];
  /** Number of grass blades (default: 2000) */
  bladeCount?: number;
  /** Base color of grass (default: #4d7c0f) */
  color?: string;
  /** Enable subtle wind animation (default: true) */
  animated?: boolean;
}

/**
 * Grass component using instanced meshes for performance
 * Renders realistic grass blades with optional wind animation
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

  // Generate grass blade positions and variations
  const grassData = useMemo(() => {
    const instances = [];
    const [width, depth] = size;
    const tempObject = new THREE.Object3D();
    const tempColor = new THREE.Color();

    for (let i = 0; i < bladeCount; i++) {
      // Random position within the area
      const x = (Math.random() - 0.5) * width;
      const z = (Math.random() - 0.5) * depth;

      // Random height variation (0.8 to 1.2)
      const height = 0.8 + Math.random() * 0.4;

      // Random rotation
      const rotation = Math.random() * Math.PI * 2;

      // Slight random scale for width variation
      const scale = 0.8 + Math.random() * 0.4;

      // Color variation (darker to lighter green)
      const colorVariation = 0.85 + Math.random() * 0.15;
      tempColor.setStyle(color).multiplyScalar(colorVariation);

      instances.push({
        position: [x, 0, z] as [number, number, number],
        rotation,
        height,
        scale,
        color: tempColor.clone(),
        // Store phase offset for animation
        phase: Math.random() * Math.PI * 2
      });
    }

    return instances;
  }, [size, bladeCount, color]);

  // Apply transforms to instanced mesh
  useMemo(() => {
    if (!meshRef.current) return;

    const tempObject = new THREE.Object3D();
    const tempColor = new THREE.Color();

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
        <meshStandardMaterial
          vertexColors
          side={THREE.DoubleSide}
          roughness={0.8}
          metalness={0}
          flatShading={false}
        />
      </instancedMesh>
    </group>
  );
};

export default Grass;
