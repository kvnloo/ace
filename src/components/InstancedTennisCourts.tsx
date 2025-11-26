/**
 * InstancedTennisCourts Component
 *
 * High-performance tennis court renderer using THREE.js InstancedMesh.
 * Reduces 144 draw calls to ~6 by batching all courts of the same type.
 */

import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

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

// Shared geometry - created once, reused for all instances
const courtGeometry = new THREE.PlaneGeometry(10, 22);
const innerCourtGeometry = new THREE.PlaneGeometry(8, 20);
const netPoleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
const netMeshGeometry = new THREE.BoxGeometry(10, 1.8, 0.02);

// Shared materials - created once
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
                        innerMaterial={courtMaterials[type].clone()}
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
    innerMaterial: THREE.MeshStandardMaterial;
}> = ({ courts, material, innerMaterial }) => {
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
                new THREE.Vector3(0.975, 0.99, 1) // Slightly smaller
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
            {/* Main court surface */}
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

export default InstancedTennisCourts;
