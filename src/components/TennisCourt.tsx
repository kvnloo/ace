/**
 * TennisCourt Component
 *
 * Reusable tennis court component with progressive loading support.
 * Integrates with AssetRegistry to conditionally render based on loading state.
 */

import React from 'react';
import { useAssetEnabled } from '../hooks/useAssetEnabled';

interface TennisCourtProps {
    position: [number, number, number];
    type: 'grass' | 'hard' | 'clay' | 'wood';
    id?: string;
}

interface NetProps {
    width: number;
}

const Net: React.FC<NetProps> = ({ width }) => (
    <group position={[0, 1, 0]}>
        <mesh position={[-width / 2, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 2]} />
            <meshStandardMaterial color="#333" />
        </mesh>
        <mesh position={[width / 2, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 2]} />
            <meshStandardMaterial color="#333" />
        </mesh>
        <mesh position={[0, 0, 0]}>
            <boxGeometry args={[width, 1.8, 0.02]} />
            <meshBasicMaterial color="white" transparent opacity={0.3} wireframe />
        </mesh>
    </group>
);

const TennisCourt: React.FC<TennisCourtProps> = ({ position, type, id }) => {
    // Check if this court is enabled in the asset registry
    const isEnabled = id ? useAssetEnabled(id) : true;

    // Don't render if not enabled
    if (!isEnabled) {
        return null;
    }

    const colors = {
        grass: '#4d7c0f',
        hard: '#3b82f6',
        clay: '#ea580c',
        wood: '#d4a373'
    };

    return (
        <group position={position}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[10, 22]} />
                <meshStandardMaterial color={colors[type]} roughness={type === 'wood' ? 0.2 : 0.8} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
                <planeGeometry args={[8, 20]} />
                <meshBasicMaterial color="white" wireframe={false} transparent opacity={0.8} />
                <mesh position={[0, 0, 0.01]}>
                    <planeGeometry args={[7.8, 19.8]} />
                    <meshBasicMaterial color={colors[type]} />
                </mesh>
            </mesh>
            <Net width={10} />
        </group>
    );
};

export default TennisCourt;
