/**
 * InstancedPickleballCourts Component
 *
 * High-performance pickleball court renderer using THREE.js InstancedMesh.
 * Reduces 32 draw calls (8 courts × 4 meshes) to ~4 draw calls.
 */

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface CourtConfig {
    position: [number, number, number];
}

interface InstancedPickleballCourtsProps {
    courts: CourtConfig[];
}

// Shared geometry - created once at module level, reused for all instances
const courtGeometry = new THREE.PlaneGeometry(6, 13);
const netPoleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
const netMeshGeometry = new THREE.BoxGeometry(6, 1.8, 0.02);

// Shared materials - created once at module level
const courtMaterial = new THREE.MeshStandardMaterial({ color: '#4ade80' });
const netPoleMaterial = new THREE.MeshStandardMaterial({ color: '#333' });
const netMeshMaterial = new THREE.MeshBasicMaterial({
    color: 'white',
    transparent: true,
    opacity: 0.3,
    wireframe: true
});

const InstancedPickleballCourts: React.FC<InstancedPickleballCourtsProps> = ({ courts }) => {
    const courtRef = useRef<THREE.InstancedMesh>(null);
    const leftPoleRef = useRef<THREE.InstancedMesh>(null);
    const rightPoleRef = useRef<THREE.InstancedMesh>(null);
    const netRef = useRef<THREE.InstancedMesh>(null);

    useEffect(() => {
        if (!courtRef.current || !leftPoleRef.current || !rightPoleRef.current || !netRef.current) return;

        const tempMatrix = new THREE.Matrix4();
        const courtRotation = new THREE.Euler(-Math.PI / 2, 0, 0);
        const courtQuaternion = new THREE.Quaternion().setFromEuler(courtRotation);
        const identityQuaternion = new THREE.Quaternion();
        const scale = new THREE.Vector3(1, 1, 1);

        courts.forEach((court, i) => {
            const [x, y, z] = court.position;

            // Court surface
            tempMatrix.compose(
                new THREE.Vector3(x, y, z),
                courtQuaternion,
                scale
            );
            courtRef.current!.setMatrixAt(i, tempMatrix);

            // Left pole
            tempMatrix.compose(
                new THREE.Vector3(x - 3, y + 1, z),
                identityQuaternion,
                scale
            );
            leftPoleRef.current!.setMatrixAt(i, tempMatrix);

            // Right pole
            tempMatrix.compose(
                new THREE.Vector3(x + 3, y + 1, z),
                identityQuaternion,
                scale
            );
            rightPoleRef.current!.setMatrixAt(i, tempMatrix);

            // Net
            tempMatrix.compose(
                new THREE.Vector3(x, y + 1, z),
                identityQuaternion,
                scale
            );
            netRef.current!.setMatrixAt(i, tempMatrix);
        });

        courtRef.current.instanceMatrix.needsUpdate = true;
        leftPoleRef.current.instanceMatrix.needsUpdate = true;
        rightPoleRef.current.instanceMatrix.needsUpdate = true;
        netRef.current.instanceMatrix.needsUpdate = true;
    }, [courts]);

    const count = courts.length;

    return (
        <group>
            <instancedMesh
                ref={courtRef}
                args={[courtGeometry, courtMaterial, count]}
                receiveShadow
                frustumCulled={true}
            />
            <instancedMesh
                ref={leftPoleRef}
                args={[netPoleGeometry, netPoleMaterial, count]}
                frustumCulled={true}
            />
            <instancedMesh
                ref={rightPoleRef}
                args={[netPoleGeometry, netPoleMaterial, count]}
                frustumCulled={true}
            />
            <instancedMesh
                ref={netRef}
                args={[netMeshGeometry, netMeshMaterial, count]}
                frustumCulled={true}
            />
        </group>
    );
};

export default InstancedPickleballCourts;
