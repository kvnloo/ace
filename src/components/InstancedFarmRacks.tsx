/**
 * InstancedFarmRacks Component
 *
 * High-performance vertical farm rack renderer using THREE.js InstancedMesh.
 * Renders 4 large vertical farm rack sectors with growing trays and LED lighting.
 * Each sector is ~500sqm with multiple growing levels.
 */

import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';

interface RackConfig {
    position: [number, number, number];
}

interface InstancedFarmRacksProps {
    racks: RackConfig[];
}

// Shared geometries - created once at module level, reused for all instances
const rackFrameGeometry = new THREE.BoxGeometry(20, 10, 25); // Large vertical farm sector
const trayGeometry = new THREE.BoxGeometry(19, 0.15, 24); // Thin growing trays
const ledStripGeometry = new THREE.BoxGeometry(18, 0.1, 0.3); // LED lighting strips

// Shared materials - created once at module level
const frameMaterial = new THREE.MeshStandardMaterial({
    color: '#374151', // Gray frame
    metalness: 0.6,
    roughness: 0.4
});

const trayMaterial = new THREE.MeshStandardMaterial({
    color: '#22c55e', // Green trays
    roughness: 0.7,
    metalness: 0.2
});

const ledMaterial = new THREE.MeshStandardMaterial({
    color: '#a855f7', // Purple LED glow
    emissive: '#a855f7',
    emissiveIntensity: 0.8,
    toneMapped: false
});

/**
 * Main component - renders all farm racks using instanced meshes
 */
const InstancedFarmRacks: React.FC<InstancedFarmRacksProps> = ({ racks }) => {
    return (
        <group>
            {/* Rack frames (main structure) */}
            <InstancedRackFrames racks={racks} />

            {/* Growing trays (5 levels per rack) */}
            <InstancedGrowingTrays racks={racks} />

            {/* LED lighting strips (5 per rack) */}
            <InstancedLEDStrips racks={racks} />
        </group>
    );
};

/**
 * Renders all rack frame structures using instancing
 */
const InstancedRackFrames: React.FC<{ racks: RackConfig[] }> = ({ racks }) => {
    const ref = useRef<THREE.InstancedMesh>(null);

    useEffect(() => {
        if (!ref.current) return;

        const tempMatrix = new THREE.Matrix4();
        const scale = new THREE.Vector3(1, 1, 1);
        const quaternion = new THREE.Quaternion();

        racks.forEach((rack, i) => {
            const [x, y, z] = rack.position;

            tempMatrix.compose(
                new THREE.Vector3(x, y + 5, z), // Center vertically
                quaternion,
                scale
            );
            ref.current!.setMatrixAt(i, tempMatrix);
        });

        ref.current.instanceMatrix.needsUpdate = true;
    }, [racks]);

    return (
        <instancedMesh
            ref={ref}
            args={[rackFrameGeometry, frameMaterial, racks.length]}
            castShadow
            receiveShadow
            frustumCulled={true}
        />
    );
};

/**
 * Renders all growing trays using a single instanced mesh
 * 5 trays per rack, evenly spaced vertically
 */
const InstancedGrowingTrays: React.FC<{ racks: RackConfig[] }> = ({ racks }) => {
    const ref = useRef<THREE.InstancedMesh>(null);
    const traysPerRack = 5;

    useEffect(() => {
        if (!ref.current) return;

        const tempMatrix = new THREE.Matrix4();
        const scale = new THREE.Vector3(1, 1, 1);
        const quaternion = new THREE.Quaternion();

        racks.forEach((rack, rackIndex) => {
            const [x, y, z] = rack.position;

            // Create 5 trays evenly spaced vertically (2m apart)
            for (let trayLevel = 0; trayLevel < traysPerRack; trayLevel++) {
                const trayY = y + 1 + (trayLevel * 2); // Start at y+1, spacing of 2m

                tempMatrix.compose(
                    new THREE.Vector3(x, trayY, z),
                    quaternion,
                    scale
                );
                ref.current!.setMatrixAt(rackIndex * traysPerRack + trayLevel, tempMatrix);
            }
        });

        ref.current.instanceMatrix.needsUpdate = true;
    }, [racks]);

    return (
        <instancedMesh
            ref={ref}
            args={[trayGeometry, trayMaterial, racks.length * traysPerRack]}
            castShadow
            receiveShadow
            frustumCulled={true}
        />
    );
};

/**
 * Renders all LED lighting strips using a single instanced mesh
 * 5 LED strips per rack, positioned above each tray
 */
const InstancedLEDStrips: React.FC<{ racks: RackConfig[] }> = ({ racks }) => {
    const ref = useRef<THREE.InstancedMesh>(null);
    const ledsPerRack = 5;

    useEffect(() => {
        if (!ref.current) return;

        const tempMatrix = new THREE.Matrix4();
        const scale = new THREE.Vector3(1, 1, 1);
        const quaternion = new THREE.Quaternion();

        racks.forEach((rack, rackIndex) => {
            const [x, y, z] = rack.position;

            // Create 5 LED strips, positioned above each tray level
            for (let ledLevel = 0; ledLevel < ledsPerRack; ledLevel++) {
                const ledY = y + 1.5 + (ledLevel * 2); // 0.5m above each tray

                tempMatrix.compose(
                    new THREE.Vector3(x, ledY, z - 12), // Front edge of rack
                    quaternion,
                    scale
                );
                ref.current!.setMatrixAt(rackIndex * ledsPerRack + ledLevel, tempMatrix);
            }
        });

        ref.current.instanceMatrix.needsUpdate = true;
    }, [racks]);

    return (
        <instancedMesh
            ref={ref}
            args={[ledStripGeometry, ledMaterial, racks.length * ledsPerRack]}
            frustumCulled={true}
        />
    );
};

export default InstancedFarmRacks;
