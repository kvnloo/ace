/**
 * InstancedTennisCourtsFull Component
 *
 * High-performance tennis courts with surface-specific visual effects.
 * Combines InstancedMesh batching with optimized grass/texture rendering.
 * Target: 540fps with visual enhancement
 */

import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import GrassAdaptive from './GrassAdaptive';
import { getCourtTexture, type CourtSurfaceType } from '../utils/courtTextures';

interface CourtConfig {
  position: [number, number, number];
  type: CourtSurfaceType;
}

interface InstancedTennisCourtsFullProps {
  courts: CourtConfig[];
  /** Enable visual effects like grass blades (default: true) */
  enableEffects?: boolean;
}

// Shared geometries (created once, reused for all instances)
const courtGeometry = new THREE.PlaneGeometry(10, 22);
const innerCourtGeometry = new THREE.PlaneGeometry(8, 20);
const netPoleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
const netMeshGeometry = new THREE.BoxGeometry(10, 1.8, 0.02);

// Shared materials
const whiteMaterial = new THREE.MeshBasicMaterial({
  color: 'white',
  transparent: true,
  opacity: 0.8
});
const netPoleMaterial = new THREE.MeshStandardMaterial({ color: '#333' });
const netMeshMaterial = new THREE.MeshBasicMaterial({
  color: 'white',
  transparent: true,
  opacity: 0.3,
  wireframe: true
});

/**
 * Main component - renders all courts with visual effects
 */
const InstancedTennisCourtsFull: React.FC<InstancedTennisCourtsFullProps> = ({
  courts,
  enableEffects = true
}) => {
  // Group courts by surface type for batching
  const courtsByType = useMemo(() => {
    const grouped: Record<CourtSurfaceType, CourtConfig[]> = {
      grass: [],
      hard: [],
      clay: [],
      wood: []
    };
    courts.forEach(court => {
      grouped[court.type].push(court);
    });
    return grouped;
  }, [courts]);

  // Pre-compute materials with textures for each court type
  const courtMaterials = useMemo(() => {
    const materials: Record<CourtSurfaceType, THREE.MeshStandardMaterial> = {} as any;

    (['grass', 'hard', 'clay', 'wood'] as CourtSurfaceType[]).forEach(type => {
      const textureConfig = getCourtTexture(type);
      const material = new THREE.MeshStandardMaterial({
        color: textureConfig.color,
        map: textureConfig.map,
        normalMap: textureConfig.normalMap,
        roughness: textureConfig.roughness,
        metalness: textureConfig.metalness || 0
      });
      material.needsUpdate = true;
      materials[type] = material;
    });

    return materials;
  }, []);

  return (
    <group>
      {/* Render instanced meshes for each court type */}
      {(['grass', 'hard', 'clay', 'wood'] as CourtSurfaceType[]).map(type => {
        const typeCourts = courtsByType[type];
        if (typeCourts.length === 0) return null;

        return (
          <InstancedCourtType
            key={type}
            type={type}
            courts={typeCourts}
            material={courtMaterials[type]}
            innerMaterial={courtMaterials[type].clone()}
            enableEffects={enableEffects}
          />
        );
      })}

      {/* Single instanced mesh for ALL net poles */}
      <InstancedNetPoles courts={courts} />

      {/* Single instanced mesh for ALL nets */}
      <InstancedNets courts={courts} />
    </group>
  );
};

/**
 * Renders all courts of a single type with surface-specific effects
 */
const InstancedCourtType: React.FC<{
  type: CourtSurfaceType;
  courts: CourtConfig[];
  material: THREE.MeshStandardMaterial;
  innerMaterial: THREE.MeshStandardMaterial;
  enableEffects: boolean;
}> = ({ type, courts, material, innerMaterial, enableEffects }) => {
  const courtRef = useRef<THREE.InstancedMesh>(null);
  const innerWhiteRef = useRef<THREE.InstancedMesh>(null);
  const innerColorRef = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    if (!courtRef.current || !innerWhiteRef.current || !innerColorRef.current) return;

    const tempMatrix = new THREE.Matrix4();
    const rotation = new THREE.Euler(-Math.PI / 2, 0, 0);
    const quaternion = new THREE.Quaternion().setFromEuler(rotation);

    courts.forEach((court, i) => {
      const [x, y, z] = court.position;

      // Main court surface
      tempMatrix.compose(
        new THREE.Vector3(x, y, z),
        quaternion,
        new THREE.Vector3(1, 1, 1)
      );
      courtRef.current!.setMatrixAt(i, tempMatrix);

      // Inner white border
      tempMatrix.compose(
        new THREE.Vector3(x, y + 0.02, z),
        quaternion,
        new THREE.Vector3(1, 1, 1)
      );
      innerWhiteRef.current!.setMatrixAt(i, tempMatrix);

      // Inner colored surface
      tempMatrix.compose(
        new THREE.Vector3(x, y + 0.03, z),
        quaternion,
        new THREE.Vector3(0.975, 0.99, 1)
      );
      innerColorRef.current!.setMatrixAt(i, tempMatrix);
    });

    courtRef.current.instanceMatrix.needsUpdate = true;
    innerWhiteRef.current.instanceMatrix.needsUpdate = true;
    innerColorRef.current.instanceMatrix.needsUpdate = true;
  }, [courts]);

  const count = courts.length;

  return (
    <group>
      {/* Main court surface with texture */}
      <instancedMesh
        ref={courtRef}
        args={[courtGeometry, material, count]}
        receiveShadow
        frustumCulled
      />

      {/* Inner white border */}
      <instancedMesh
        ref={innerWhiteRef}
        args={[innerCourtGeometry, whiteMaterial, count]}
        frustumCulled
      />

      {/* Inner colored surface */}
      <instancedMesh
        ref={innerColorRef}
        args={[innerCourtGeometry, innerMaterial, count]}
        frustumCulled
      />

      {/* Surface-specific visual effects */}
      {enableEffects && type === 'grass' && (
        <GrassEffects courts={courts} />
      )}

      {enableEffects && type === 'clay' && (
        <ClayEffects courts={courts} />
      )}
    </group>
  );
};

/**
 * Grass surface effects - FPS-adaptive grass blade rendering
 *
 * Real-world reference:
 * - Tennis court: 78ft x 36ft = 2,808 sq ft
 * - Real grass: ~2,500 blades/sq ft = ~7 million blades per court
 * - Our adaptive system: 15k-80k blades (0.2%-1.1% of real density)
 *
 * The adaptive algorithm starts at 15k blades and exponentially
 * increases density while FPS remains above target (60fps).
 */
const GrassEffects: React.FC<{ courts: CourtConfig[] }> = ({ courts }) => {
  return (
    <>
      {courts.map((court, i) => {
        const [x, y, z] = court.position;
        return (
          <GrassAdaptive
            key={`grass-${i}`}
            position={[x, y + 0.04, z]}
            size={[10, 22]}
            color="#4d7c0f"
            animated={true}
            targetFPS={60}
            initialDensity={25000}
            maxDensity={150000}
            onDensityChange={(density, fps) => {
              console.log(`Court ${i}: ${density.toLocaleString()} blades @ ${fps.toFixed(0)} FPS`);
            }}
          />
        );
      })}
    </>
  );
};

/**
 * Clay surface effects - simple textured surface
 * Note: Skipping particle effects for performance
 */
const ClayEffects: React.FC<{ courts: CourtConfig[] }> = ({ courts }) => {
  // Generate simple clay texture - optimized for performance
  const clayMaterial = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128; // Reduced from 256 to 128 for better performance
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    // Base clay orange
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(0, 0, 128, 128);

    // Reduced granular texture loops from 1000 to 300 for performance
    for (let i = 0; i < 300; i++) {
      const x = Math.random() * 128;
      const y = Math.random() * 128;
      const size = Math.random() * 1.5;
      const brightness = Math.random() * 20 - 10;

      ctx.fillStyle = `rgba(${234 + brightness}, ${88 + brightness}, ${12 + brightness}, 0.3)`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 3);

    return new THREE.MeshStandardMaterial({
      map: texture,
      color: '#ea580c',
      roughness: 0.95,
      metalness: 0
    });
  }, []);

  const overlayGeometry = useMemo(() => new THREE.PlaneGeometry(9.8, 21.8), []);

  return (
    <>
      {courts.map((court, i) => {
        const [x, y, z] = court.position;
        return (
          <mesh
            key={`clay-${i}`}
            position={[x, y + 0.04, z]}
            rotation={[-Math.PI / 2, 0, 0]}
            geometry={overlayGeometry}
            material={clayMaterial}
            frustumCulled={true}
          />
        );
      })}
    </>
  );
};

/**
 * Renders all net poles using a single instanced mesh
 */
const InstancedNetPoles: React.FC<{ courts: CourtConfig[] }> = ({ courts }) => {
  const ref = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    if (!ref.current) return;

    const tempMatrix = new THREE.Matrix4();
    const scale = new THREE.Vector3(1, 1, 1);
    const quaternion = new THREE.Quaternion();

    courts.forEach((court, i) => {
      const [x, y, z] = court.position;

      // Left pole
      tempMatrix.compose(
        new THREE.Vector3(x - 5, y + 1, z),
        quaternion,
        scale
      );
      ref.current!.setMatrixAt(i * 2, tempMatrix);

      // Right pole
      tempMatrix.compose(
        new THREE.Vector3(x + 5, y + 1, z),
        quaternion,
        scale
      );
      ref.current!.setMatrixAt(i * 2 + 1, tempMatrix);
    });

    ref.current.instanceMatrix.needsUpdate = true;
  }, [courts]);

  return (
    <instancedMesh
      ref={ref}
      args={[netPoleGeometry, netPoleMaterial, courts.length * 2]}
      frustumCulled
    />
  );
};

/**
 * Renders all nets using a single instanced mesh
 */
const InstancedNets: React.FC<{ courts: CourtConfig[] }> = ({ courts }) => {
  const ref = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    if (!ref.current) return;

    const tempMatrix = new THREE.Matrix4();
    const scale = new THREE.Vector3(1, 1, 1);
    const quaternion = new THREE.Quaternion();

    courts.forEach((court, i) => {
      const [x, y, z] = court.position;

      tempMatrix.compose(
        new THREE.Vector3(x, y + 1, z),
        quaternion,
        scale
      );
      ref.current!.setMatrixAt(i, tempMatrix);
    });

    ref.current.instanceMatrix.needsUpdate = true;
  }, [courts]);

  return (
    <instancedMesh
      ref={ref}
      args={[netMeshGeometry, netMeshMaterial, courts.length]}
      frustumCulled
    />
  );
};

export default InstancedTennisCourtsFull;
