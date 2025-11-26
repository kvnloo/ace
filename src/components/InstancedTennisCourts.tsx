/**
 * InstancedTennisCourts Component
 *
 * High-performance tennis court renderer using THREE.js InstancedMesh.
 * Reduces 144 draw calls to ~6 by batching all courts of the same type.
 * Uses proper tennis court dimensions: 23.77m × 10.97m (doubles)
 */

import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import {
  COURT_WIDTH,
  COURT_COLORS,
  CourtType,
  CourtConfig,
  courtGeometry,
  netPoleGeometry,
  netMeshGeometry,
  lineMaterial,
  netPoleMaterial,
  netMeshMaterial,
  createCourtLines
} from './tennis/shared';

interface InstancedTennisCourtsProps {
  courts: CourtConfig[];
}

/**
 * Instanced Tennis Courts - renders all courts in minimal draw calls
 */
const InstancedTennisCourts: React.FC<InstancedTennisCourtsProps> = ({ courts }) => {
  // Group courts by type for efficient instanced rendering
  const courtsByType = useMemo(() => {
    const grouped: Record<CourtType, CourtConfig[]> = {
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

  // Pre-compute materials for each court type
  const courtMaterials = useMemo(() => {
    const materials: Record<CourtType, THREE.MeshStandardMaterial> = {} as any;
    (Object.keys(COURT_COLORS) as CourtType[]).forEach(type => {
      materials[type] = new THREE.MeshStandardMaterial({
        color: COURT_COLORS[type],
        roughness: type === 'wood' ? 0.2 : 0.8
      });
    });
    return materials;
  }, []);

  return (
    <group>
      {/* Render instanced meshes for each court type */}
      {(Object.keys(courtsByType) as CourtType[]).map(type => {
        const typeCourts = courtsByType[type];
        if (typeCourts.length === 0) return null;

        return (
          <InstancedCourtType
            key={type}
            courts={typeCourts}
            material={courtMaterials[type]}
          />
        );
      })}

      {/* Single instanced mesh for ALL net poles (2 per court) */}
      <InstancedNetPoles courts={courts} />

      {/* Single instanced mesh for ALL nets */}
      <InstancedNets courts={courts} />
    </group>
  );
};

/**
 * Renders all courts of a single type using instancing
 */
const InstancedCourtType: React.FC<{
  courts: CourtConfig[];
  material: THREE.MeshStandardMaterial;
}> = ({ courts, material }) => {
  const courtRef = useRef<THREE.InstancedMesh>(null);

  // Pre-create court line geometries
  const lineGeometries = useMemo(() => createCourtLines(), []);

  useEffect(() => {
    if (!courtRef.current) return;

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
    });

    courtRef.current.instanceMatrix.needsUpdate = true;
  }, [courts]);

  const count = courts.length;

  return (
    <group>
      {/* Main court surface */}
      <instancedMesh
        ref={courtRef}
        args={[courtGeometry, material, count]}
        receiveShadow
        frustumCulled
      />

      {/* Court lines for each court */}
      {courts.map((court, courtIndex) => {
        const [x, y, z] = court.position;
        return (
          <group
            key={`lines-${courtIndex}`}
            position={[x, y + 0.01, z]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            {lineGeometries.map((geometry, lineIndex) => (
              <mesh
                key={`line-${courtIndex}-${lineIndex}`}
                geometry={geometry}
                material={lineMaterial}
              />
            ))}
          </group>
        );
      })}
    </group>
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

      // Left pole (at doubles sideline)
      tempMatrix.compose(
        new THREE.Vector3(x - COURT_WIDTH / 2, y + 1, z),
        quaternion,
        scale
      );
      ref.current!.setMatrixAt(i * 2, tempMatrix);

      // Right pole (at doubles sideline)
      tempMatrix.compose(
        new THREE.Vector3(x + COURT_WIDTH / 2, y + 1, z),
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

      // Net height is 1.8m, position center at y + 0.9 so bottom sits on court surface
      tempMatrix.compose(
        new THREE.Vector3(x, y + 0.9, z),
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

export default InstancedTennisCourts;
