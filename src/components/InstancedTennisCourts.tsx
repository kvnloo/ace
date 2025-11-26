/**
 * InstancedTennisCourts Component
 *
 * High-performance tennis court renderer using THREE.js InstancedMesh.
 * Reduces 144 draw calls to ~6 by batching all courts of the same type.
 * Uses proper tennis court dimensions: 23.77m × 10.97m (doubles)
 */

import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';

// Court colors by type
const COURT_COLORS = {
    grass: '#4d7c0f',
    hard: '#3b82f6',
    clay: '#ea580c',
    wood: '#d4a373'
} as const;

type CourtType = keyof typeof COURT_COLORS;

interface CourtConfig {
    position: [number, number, number];
    type: CourtType;
}

interface InstancedTennisCourtsProps {
    courts: CourtConfig[];
}

// Tennis court dimensions (official doubles court)
const COURT_WIDTH = 10.97;   // meters (doubles width)
const COURT_LENGTH = 23.77;  // meters
const LINE_WIDTH = 0.05;     // 5cm - standard tennis line width

// Shared geometry - created once, reused for all instances
const courtGeometry = new THREE.PlaneGeometry(COURT_WIDTH, COURT_LENGTH);
const netPoleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
const netMeshGeometry = new THREE.BoxGeometry(COURT_WIDTH, 1.8, 0.02);

// Court line specifications (distances from center)
const TENNIS_LINES = {
  // Baselines (full width at each end)
  baselines: [
    { z: -11.885, width: COURT_WIDTH },
    { z: 11.885, width: COURT_WIDTH }
  ],
  // Doubles sidelines (full length at edges)
  doublesLines: [
    { x: -5.485, length: COURT_LENGTH },
    { x: 5.485, length: COURT_LENGTH }
  ],
  // Singles sidelines (full length, inner)
  singlesLines: [
    { x: -4.115, length: COURT_LENGTH },
    { x: 4.115, length: COURT_LENGTH }
  ],
  // Service lines (singles width at 6.4m from net)
  serviceLines: [
    { z: -6.4, width: 8.23 },
    { z: 6.4, width: 8.23 }
  ],
  // Center service line (from net to service line)
  centerServiceLine: { x: 0, startZ: -6.4, endZ: 6.4 },
  // Center marks (10cm at baselines)
  centerMarks: [
    { x: 0, z: -11.885, length: 0.1 },
    { x: 0, z: 11.885, length: 0.1 }
  ]
};

// Shared materials
const lineMaterial = new THREE.MeshBasicMaterial({
    color: 'white',
    side: THREE.DoubleSide
});
const netPoleMaterial = new THREE.MeshStandardMaterial({ color: '#333' });
const netMeshMaterial = new THREE.MeshBasicMaterial({
    color: 'white',
    transparent: true,
    opacity: 0.3,
    wireframe: true
});

/**
 * Creates court line geometries for a single court
 */
const createCourtLines = (): THREE.BufferGeometry[] => {
  const geometries: THREE.BufferGeometry[] = [];

  // Helper to create horizontal line geometry
  const createHorizontalLine = (z: number, width: number) => {
    const geo = new THREE.PlaneGeometry(width, LINE_WIDTH);
    geo.translate(0, z, 0);
    return geo;
  };

  // Helper to create vertical line geometry
  const createVerticalLine = (x: number, length: number, startZ: number = -length / 2) => {
    const geo = new THREE.PlaneGeometry(LINE_WIDTH, length);
    geo.translate(x, startZ + length / 2, 0);
    return geo;
  };

  // Baselines
  TENNIS_LINES.baselines.forEach(line => {
    geometries.push(createHorizontalLine(line.z, line.width));
  });

  // Doubles sidelines
  TENNIS_LINES.doublesLines.forEach(line => {
    geometries.push(createVerticalLine(line.x, line.length));
  });

  // Singles sidelines
  TENNIS_LINES.singlesLines.forEach(line => {
    geometries.push(createVerticalLine(line.x, line.length));
  });

  // Service lines
  TENNIS_LINES.serviceLines.forEach(line => {
    geometries.push(createHorizontalLine(line.z, line.width));
  });

  // Center service line
  const centerLine = TENNIS_LINES.centerServiceLine;
  const centerGeo = new THREE.PlaneGeometry(LINE_WIDTH, centerLine.endZ - centerLine.startZ);
  centerGeo.translate(centerLine.x, 0, 0);
  geometries.push(centerGeo);

  // Center marks at baselines
  TENNIS_LINES.centerMarks.forEach(mark => {
    const markGeo = new THREE.PlaneGeometry(LINE_WIDTH, mark.length);
    // Position extending inward from baseline
    const direction = mark.z > 0 ? -1 : 1;
    markGeo.translate(mark.x, mark.z + direction * (mark.length / 2), 0);
    geometries.push(markGeo);
  });

  return geometries;
};

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
