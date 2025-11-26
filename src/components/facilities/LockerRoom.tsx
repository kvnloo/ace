/**
 * LockerRoom.tsx
 * Locker room facilities with lockers, showers, and benches
 * Integrated from PR #6 with DebugContext support
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Types
interface LockerProps {
  position: [number, number, number];
  isOpen?: boolean;
  hasItems?: boolean;
}

interface LockerBankProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  count?: number;
}

interface ShowerStallProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  isRunning?: boolean;
}

interface BenchProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  length?: number;
}

interface LockerRoomProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  label?: string;
}

// Single locker
const Locker: React.FC<LockerProps> = ({
  position,
  isOpen = false,
  hasItems = false
}) => {
  return (
    <group position={position}>
      {/* Locker body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.4, 1.8, 0.5]} />
        <meshStandardMaterial color="#4a5568" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Door */}
      <group
        position={[isOpen ? 0.35 : 0.21, 0, 0]}
        rotation={[0, isOpen ? -Math.PI / 2 : 0, 0]}
      >
        <mesh castShadow>
          <boxGeometry args={[0.02, 1.7, 0.45]} />
          <meshStandardMaterial color="#5a6578" metalness={0.5} roughness={0.4} />
        </mesh>

        {/* Handle */}
        <mesh position={[0.02, 0, -0.18]}>
          <boxGeometry args={[0.02, 0.1, 0.02]} />
          <meshStandardMaterial color="#2d3748" metalness={0.8} />
        </mesh>

        {/* Vent slits */}
        {[-0.6, -0.4, -0.2, 0.2, 0.4, 0.6].map((y, i) => (
          <mesh key={i} position={[0.015, y, 0]}>
            <boxGeometry args={[0.005, 0.03, 0.3]} />
            <meshStandardMaterial color="#1a202c" />
          </mesh>
        ))}
      </group>

      {/* Items inside (if open and has items) */}
      {isOpen && hasItems && (
        <group position={[0, 0, 0]}>
          {/* Bag */}
          <mesh position={[0, -0.5, 0]}>
            <boxGeometry args={[0.25, 0.3, 0.2]} />
            <meshStandardMaterial color="#2b6cb0" />
          </mesh>
          {/* Towel */}
          <mesh position={[0, 0.3, 0.1]}>
            <boxGeometry args={[0.3, 0.05, 0.2]} />
            <meshStandardMaterial color="#f7fafc" />
          </mesh>
        </group>
      )}

      {/* Number plate */}
      <mesh position={[0.22, 0.7, 0]}>
        <planeGeometry args={[0.1, 0.08]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>
    </group>
  );
};

// Bank of lockers
export const LockerBank: React.FC<LockerBankProps> = ({
  position,
  rotation = [0, 0, 0],
  count = 10
}) => {
  const lockerStates = useMemo(() => {
    return Array.from({ length: count }, () => ({
      isOpen: Math.random() > 0.85,
      hasItems: Math.random() > 0.5
    }));
  }, [count]);

  return (
    <group position={position} rotation={rotation}>
      {/* Back panel */}
      <mesh position={[0, 0.9, -0.26]} castShadow receiveShadow>
        <boxGeometry args={[count * 0.42 + 0.1, 1.85, 0.02]} />
        <meshStandardMaterial color="#2d3748" metalness={0.4} />
      </mesh>

      {/* Base */}
      <mesh position={[0, -0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[count * 0.42 + 0.1, 0.1, 0.55]} />
        <meshStandardMaterial color="#1a202c" />
      </mesh>

      {/* Individual lockers */}
      {Array.from({ length: count }, (_, i) => {
        const x = (i - (count - 1) / 2) * 0.42;
        return (
          <Locker
            key={i}
            position={[x, 0.9, 0]}
            isOpen={lockerStates[i].isOpen}
            hasItems={lockerStates[i].hasItems}
          />
        );
      })}
    </group>
  );
};

// Shower stall
export const ShowerStall: React.FC<ShowerStallProps> = ({
  position,
  rotation = [0, 0, 0],
  isRunning = false
}) => {
  const waterRef = useRef<THREE.Points>(null);

  // Animate water droplets
  useFrame((state) => {
    if (waterRef.current && isRunning) {
      const positions = waterRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] -= 0.05; // Fall down
        if (positions[i + 1] < 0) {
          positions[i + 1] = 1.8; // Reset to top
          positions[i] = (Math.random() - 0.5) * 0.3;
          positions[i + 2] = (Math.random() - 0.5) * 0.3;
        }
      }
      waterRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  // Water particles
  const waterParticles = useMemo(() => {
    const count = 100;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.3;
      positions[i * 3 + 1] = Math.random() * 1.8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
    }
    return positions;
  }, []);

  return (
    <group position={position} rotation={rotation}>
      {/* Back wall */}
      <mesh position={[0, 1.1, -0.45]} castShadow receiveShadow>
        <boxGeometry args={[1, 2.2, 0.1]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.3} />
      </mesh>

      {/* Side walls */}
      <mesh position={[-0.45, 1.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 2.2, 1]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.3} />
      </mesh>
      <mesh position={[0.45, 1.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 2.2, 1]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.3} />
      </mesh>

      {/* Floor (with drain) */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[0.9, 0.9]} />
        <meshStandardMaterial color="#a0aec0" roughness={0.6} />
      </mesh>

      {/* Drain */}
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.08, 16]} />
        <meshStandardMaterial color="#2d3748" metalness={0.6} />
      </mesh>

      {/* Shower head */}
      <group position={[0, 2, -0.35]}>
        {/* Arm */}
        <mesh position={[0, -0.1, 0.1]} rotation={[Math.PI / 4, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
          <meshStandardMaterial color="#a0aec0" metalness={0.8} />
        </mesh>
        {/* Head */}
        <mesh position={[0, -0.2, 0.2]} rotation={[Math.PI / 4, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.06, 0.05, 16]} />
          <meshStandardMaterial color="#a0aec0" metalness={0.8} />
        </mesh>
      </group>

      {/* Controls */}
      <mesh position={[0.3, 1.2, -0.35]}>
        <cylinderGeometry args={[0.04, 0.04, 0.05, 16]} />
        <meshStandardMaterial color="#a0aec0" metalness={0.8} />
      </mesh>

      {/* Water particles (when running) */}
      {isRunning && (
        <points ref={waterRef} position={[0, 0, 0]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={waterParticles.length / 3}
              array={waterParticles}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            color="#88ccff"
            size={0.03}
            transparent
            opacity={0.6}
          />
        </points>
      )}
    </group>
  );
};

// Bench
export const Bench: React.FC<BenchProps> = ({
  position,
  rotation = [0, 0, 0],
  length = 2
}) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Seat */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[length, 0.05, 0.4]} />
        <meshStandardMaterial color="#8b5a2b" roughness={0.7} />
      </mesh>

      {/* Legs */}
      {[-(length / 2 - 0.15), length / 2 - 0.15].map((x, i) => (
        <group key={i} position={[x, 0.225, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.08, 0.45, 0.35]} />
            <meshStandardMaterial color="#2d3748" metalness={0.5} />
          </mesh>
        </group>
      ))}

      {/* Support beam */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[length - 0.3, 0.05, 0.05]} />
        <meshStandardMaterial color="#2d3748" metalness={0.5} />
      </mesh>
    </group>
  );
};

// Main Locker Room component
export const LockerRoom: React.FC<LockerRoomProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  label = 'LOCKER ROOM'
}) => {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Floor */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[15, 12]} />
        <meshStandardMaterial color="#a0aec0" roughness={0.6} />
      </mesh>

      {/* Walls */}
      {/* Back wall */}
      <mesh position={[0, 1.5, -5.9]} castShadow receiveShadow>
        <boxGeometry args={[15, 3, 0.2]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
      </mesh>

      {/* Side walls */}
      <mesh position={[-7.4, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 3, 12]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
      </mesh>
      <mesh position={[7.4, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 3, 12]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
      </mesh>

      {/* Locker banks */}
      <LockerBank position={[-5, 0, -5.3]} rotation={[0, 0, 0]} count={12} />
      <LockerBank position={[5, 0, -5.3]} rotation={[0, 0, 0]} count={12} />
      <LockerBank position={[-6.8, 0, 0]} rotation={[0, Math.PI / 2, 0]} count={8} />
      <LockerBank position={[6.8, 0, 0]} rotation={[0, -Math.PI / 2, 0]} count={8} />

      {/* Benches */}
      <Bench position={[-2.5, 0, -2]} length={3} />
      <Bench position={[2.5, 0, -2]} length={3} />
      <Bench position={[0, 0, 2]} rotation={[0, Math.PI / 2, 0]} length={2.5} />

      {/* Shower stalls */}
      <ShowerStall position={[-5, 0, 4]} isRunning={false} />
      <ShowerStall position={[-3.5, 0, 4]} isRunning={true} />
      <ShowerStall position={[-2, 0, 4]} isRunning={false} />
      <ShowerStall position={[2, 0, 4]} isRunning={false} />
      <ShowerStall position={[3.5, 0, 4]} isRunning={false} />
      <ShowerStall position={[5, 0, 4]} isRunning={true} />

      {/* Lighting */}
      <pointLight
        position={[0, 2.8, 0]}
        intensity={0.8}
        color="#ffffff"
        distance={15}
        decay={2}
      />
      <pointLight
        position={[-4, 2.8, 0]}
        intensity={0.5}
        color="#ffffff"
        distance={10}
        decay={2}
      />
      <pointLight
        position={[4, 2.8, 0]}
        intensity={0.5}
        color="#ffffff"
        distance={10}
        decay={2}
      />
    </group>
  );
};

export default LockerRoom;
