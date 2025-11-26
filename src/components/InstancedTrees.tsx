/**
 * InstancedTrees Component
 *
 * High-performance tree renderer using THREE.js InstancedMesh.
 * Reduces draw calls by batching all trunks and foliage separately.
 */

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface TreeConfig {
    position: [number, number, number];
    scale?: number;
}

interface InstancedTreesProps {
    trees: TreeConfig[];
}

// Shared geometry - created once at module level, reused for all instances
const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.25, 2, 8);
const foliageGeometry = new THREE.ConeGeometry(1, 2, 8);

// Shared materials - created once at module level
const trunkMaterial = new THREE.MeshStandardMaterial({
    color: '#8B4513', // Brown
    roughness: 0.9
});

const foliageMaterial = new THREE.MeshStandardMaterial({
    color: '#228B22', // Forest green
    roughness: 0.7
});

/**
 * Instanced Trees - renders all trees in minimal draw calls
 */
const InstancedTrees: React.FC<InstancedTreesProps> = ({ trees }) => {
    return (
        <group>
            {/* Single instanced mesh for ALL trunks */}
            <InstancedTrunks trees={trees} />

            {/* Single instanced mesh for ALL foliage */}
            <InstancedFoliage trees={trees} />
        </group>
    );
};

/**
 * Renders all tree trunks using a single instanced mesh
 */
const InstancedTrunks: React.FC<{ trees: TreeConfig[] }> = ({ trees }) => {
    const ref = useRef<THREE.InstancedMesh>(null);

    useEffect(() => {
        if (!ref.current) return;

        const tempMatrix = new THREE.Matrix4();
        const quaternion = new THREE.Quaternion();

        trees.forEach((tree, i) => {
            const [x, y, z] = tree.position;
            const scale = tree.scale ?? 1;

            // Position trunk at ground level, scale it
            tempMatrix.compose(
                new THREE.Vector3(x, y + 1 * scale, z), // Trunk height/2 above ground
                quaternion,
                new THREE.Vector3(scale, scale, scale)
            );
            ref.current!.setMatrixAt(i, tempMatrix);
        });

        ref.current.instanceMatrix.needsUpdate = true;
    }, [trees]);

    return (
        <instancedMesh
            ref={ref}
            args={[trunkGeometry, trunkMaterial, trees.length]}
            castShadow
            receiveShadow
            frustumCulled
        />
    );
};

/**
 * Renders all tree foliage using a single instanced mesh
 */
const InstancedFoliage: React.FC<{ trees: TreeConfig[] }> = ({ trees }) => {
    const ref = useRef<THREE.InstancedMesh>(null);

    useEffect(() => {
        if (!ref.current) return;

        const tempMatrix = new THREE.Matrix4();
        const quaternion = new THREE.Quaternion();

        trees.forEach((tree, i) => {
            const [x, y, z] = tree.position;
            const scale = tree.scale ?? 1;

            // Position foliage at top of trunk
            tempMatrix.compose(
                new THREE.Vector3(x, y + 2.5 * scale, z), // Top of trunk + half foliage height
                quaternion,
                new THREE.Vector3(scale, scale, scale)
            );
            ref.current!.setMatrixAt(i, tempMatrix);
        });

        ref.current.instanceMatrix.needsUpdate = true;
    }, [trees]);

    return (
        <instancedMesh
            ref={ref}
            args={[foliageGeometry, foliageMaterial, trees.length]}
            castShadow
            receiveShadow
            frustumCulled
        />
    );
};

export default InstancedTrees;
