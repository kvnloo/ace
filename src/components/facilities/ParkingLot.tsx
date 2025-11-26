/**
 * ParkingLot.tsx
 * Complete parking lot with EV charging, accessible spaces, and bike racks
 * Integrated from PR #6 with DebugContext support
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Types
type SpaceType = 'standard' | 'ev' | 'accessible';

interface ParkingSpaceProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  type?: SpaceType;
  occupied?: boolean;
}

interface BikeRackProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  slots?: number;
}

interface ParkingLaneProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  length?: number;
}

interface DropOffZoneProps {
  position: [number, number, number];
  rotation?: [number, number, number];
}

interface ParkingLotProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

// Single parking space
export const ParkingSpace: React.FC<ParkingSpaceProps> = ({
  position,
  rotation = [0, 0, 0],
  type = 'standard',
  occupied = false
}) => {
  const chargerRef = useRef<THREE.Mesh>(null);

  // EV charger LED animation
  useFrame((state) => {
    if (chargerRef.current && type === 'ev') {
      const material = chargerRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }
  });

  const spaceColor = useMemo(() => {
    switch (type) {
      case 'ev': return '#00aa44';
      case 'accessible': return '#0066cc';
      default: return '#666666';
    }
  }, [type]);

  return (
    <group position={position} rotation={rotation}>
      {/* Parking space lines */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.5, 5]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* Space markings */}
      {/* Left line */}
      <mesh position={[-1.2, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.1, 5]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Right line */}
      <mesh position={[1.2, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.1, 5]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Space type indicator */}
      <mesh position={[0, 0.02, -2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.5, 1]} />
        <meshStandardMaterial color={spaceColor} />
      </mesh>

      {/* EV charger */}
      {type === 'ev' && (
        <group position={[1.5, 0, -2]}>
          {/* Charger post */}
          <mesh position={[0, 0.6, 0]} castShadow>
            <boxGeometry args={[0.3, 1.2, 0.2]} />
            <meshStandardMaterial color="#2a2a2a" metalness={0.4} />
          </mesh>

          {/* Charger screen */}
          <mesh position={[0, 0.8, 0.11]}>
            <planeGeometry args={[0.2, 0.15]} />
            <meshStandardMaterial
              color="#003311"
              emissive="#00ff44"
              emissiveIntensity={0.5}
            />
          </mesh>

          {/* Status LED */}
          <mesh ref={chargerRef} position={[0, 1.1, 0.11]}>
            <circleGeometry args={[0.03, 16]} />
            <meshStandardMaterial
              color="#00ff44"
              emissive="#00ff44"
              emissiveIntensity={0.8}
            />
          </mesh>

          {/* Charging cable */}
          <mesh position={[0, 0.3, 0.15]}>
            <torusGeometry args={[0.08, 0.02, 8, 16, Math.PI]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
        </group>
      )}

      {/* Accessible symbol */}
      {type === 'accessible' && (
        <group position={[0, 0.03, 0]}>
          {/* Wheelchair symbol (simplified) */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.5, 16]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.4, 16]} />
            <meshStandardMaterial color="#0066cc" />
          </mesh>
        </group>
      )}

      {/* Occupied vehicle (simplified) */}
      {occupied && (
        <group position={[0, 0.5, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.8, 1, 4]} />
            <meshStandardMaterial
              color={['#3a3a3a', '#1a1a4a', '#4a1a1a', '#1a4a1a'][Math.floor(Math.random() * 4)]}
              metalness={0.6}
              roughness={0.4}
            />
          </mesh>
          {/* Windows */}
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[1.6, 0.5, 2]} />
            <meshStandardMaterial color="#1a2a3a" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      )}
    </group>
  );
};

// Bike rack
export const BikeRack: React.FC<BikeRackProps> = ({
  position,
  rotation = [0, 0, 0],
  slots = 8
}) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Base rail */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[slots * 0.4, 0.05, 0.1]} />
        <meshStandardMaterial color="#555555" metalness={0.6} />
      </mesh>

      {/* Vertical loops */}
      {Array.from({ length: slots }, (_, i) => {
        const x = (i - (slots - 1) / 2) * 0.4;
        return (
          <group key={i} position={[x, 0, 0]}>
            {/* Loop frame */}
            <mesh position={[0, 0.4, 0]} castShadow>
              <torusGeometry args={[0.25, 0.02, 8, 16, Math.PI]} />
              <meshStandardMaterial color="#555555" metalness={0.6} />
            </mesh>
            {/* Vertical posts */}
            <mesh position={[-0.25, 0.2, 0]} castShadow>
              <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
              <meshStandardMaterial color="#555555" metalness={0.6} />
            </mesh>
            <mesh position={[0.25, 0.2, 0]} castShadow>
              <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
              <meshStandardMaterial color="#555555" metalness={0.6} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

// Parking lane (driving lane)
export const ParkingLane: React.FC<ParkingLaneProps> = ({
  position,
  rotation = [0, 0, 0],
  length = 20
}) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Lane surface */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, length]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      {/* Center line (dashed) */}
      {Array.from({ length: Math.floor(length / 3) }, (_, i) => (
        <mesh
          key={i}
          position={[0, 0.02, (i - length / 6) * 3 + 0.5]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.15, 1.5]} />
          <meshStandardMaterial color="#ffff00" />
        </mesh>
      ))}

      {/* Direction arrows */}
      {[-length / 4, length / 4].map((z, i) => (
        <mesh
          key={i}
          position={[0, 0.02, z]}
          rotation={[-Math.PI / 2, 0, i === 0 ? 0 : Math.PI]}
        >
          <coneGeometry args={[0.3, 1, 3]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}
    </group>
  );
};

// Drop-off/pickup zone
export const DropOffZone: React.FC<DropOffZoneProps> = ({
  position,
  rotation = [0, 0, 0]
}) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Zone surface */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 4]} />
        <meshStandardMaterial color="#ffaa00" opacity={0.8} transparent />
      </mesh>

      {/* Border markings */}
      <mesh position={[0, 0.02, -1.9]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 0.2]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 0.02, 1.9]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 0.2]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Sign post */}
      <mesh position={[-3.5, 1, -1.5]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 2, 8]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* Sign */}
      <mesh position={[-3.5, 1.8, -1.5]} castShadow>
        <boxGeometry args={[0.8, 0.4, 0.05]} />
        <meshStandardMaterial color="#0066cc" />
      </mesh>
    </group>
  );
};

// Lighting pole
const LightPole: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <group position={position}>
      {/* Pole */}
      <mesh position={[0, 3, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 6, 8]} />
        <meshStandardMaterial color="#444444" metalness={0.6} />
      </mesh>

      {/* Light fixture */}
      <mesh position={[0, 5.8, 0]}>
        <boxGeometry args={[0.4, 0.15, 0.4]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* Light */}
      <pointLight
        position={[0, 5.5, 0]}
        intensity={0.5}
        color="#ffffcc"
        distance={15}
        decay={2}
      />
    </group>
  );
};

// Main Parking Lot component
export const ParkingLot: React.FC<ParkingLotProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1
}) => {
  // Generate parking spaces
  const spaces = useMemo(() => {
    const result: Array<{
      position: [number, number, number];
      rotation: [number, number, number];
      type: SpaceType;
      occupied: boolean;
    }> = [];

    // Row 1 - Standard spaces (left side)
    for (let i = 0; i < 15; i++) {
      result.push({
        position: [-20, 0, -30 + i * 5.5],
        rotation: [0, Math.PI / 2, 0],
        type: i < 2 ? 'accessible' : 'standard',
        occupied: Math.random() > 0.4
      });
    }

    // Row 2 - Standard spaces (right side)
    for (let i = 0; i < 15; i++) {
      result.push({
        position: [20, 0, -30 + i * 5.5],
        rotation: [0, -Math.PI / 2, 0],
        type: 'standard',
        occupied: Math.random() > 0.5
      });
    }

    // Row 3 - EV spaces
    for (let i = 0; i < 10; i++) {
      result.push({
        position: [-8, 0, -30 + i * 5.5],
        rotation: [0, Math.PI / 2, 0],
        type: 'ev',
        occupied: Math.random() > 0.6
      });
    }

    // Row 4 - More standard
    for (let i = 0; i < 10; i++) {
      result.push({
        position: [8, 0, -30 + i * 5.5],
        rotation: [0, -Math.PI / 2, 0],
        type: 'standard',
        occupied: Math.random() > 0.5
      });
    }

    return result;
  }, []);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Main lot surface */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[80, 100]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>

      {/* Parking spaces */}
      {spaces.map((space, i) => (
        <ParkingSpace
          key={i}
          position={space.position}
          rotation={space.rotation}
          type={space.type}
          occupied={space.occupied}
        />
      ))}

      {/* Driving lanes */}
      <ParkingLane position={[-14, 0, 0]} length={80} />
      <ParkingLane position={[0, 0, 0]} length={80} />
      <ParkingLane position={[14, 0, 0]} length={80} />

      {/* Drop-off zone */}
      <DropOffZone position={[0, 0, 45]} />

      {/* Bike racks */}
      <BikeRack position={[-35, 0, 40]} rotation={[0, Math.PI / 2, 0]} slots={12} />
      <BikeRack position={[35, 0, 40]} rotation={[0, -Math.PI / 2, 0]} slots={12} />

      {/* Light poles */}
      <LightPole position={[-30, 0, -35]} />
      <LightPole position={[-30, 0, 0]} />
      <LightPole position={[-30, 0, 35]} />
      <LightPole position={[30, 0, -35]} />
      <LightPole position={[30, 0, 0]} />
      <LightPole position={[30, 0, 35]} />

      {/* Ambient lighting for the lot */}
      <ambientLight intensity={0.2} />
    </group>
  );
};

export default ParkingLot;
