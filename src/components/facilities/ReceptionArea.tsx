/**
 * ReceptionArea.tsx
 * Reception and lobby area with check-in kiosks, waiting area, and displays
 * Integrated from PR #6 with DebugContext support
 */

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// Brand color
const BRAND_YELLOW = '#DFFF4F';
const BRAND_DARK = '#1a1a1a';

// Types
interface ReceptionDeskProps {
  position?: [number, number, number];
}

interface CheckInKioskProps {
  position: [number, number, number];
  rotation?: [number, number, number];
}

interface WaitingBenchProps {
  position: [number, number, number];
  rotation?: [number, number, number];
}

interface WayfindingDisplayProps {
  position: [number, number, number];
  rotation?: [number, number, number];
}

interface RetailDisplayProps {
  position: [number, number, number];
}

interface RefreshmentBarProps {
  position: [number, number, number];
}

interface ReceptionAreaProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

// Reception desk component
export const ReceptionDesk: React.FC<ReceptionDeskProps> = ({
  position = [0, 0, 0]
}) => {
  return (
    <group position={position}>
      {/* Main desk body - curved front */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 1, 1.2]} />
        <meshStandardMaterial color={BRAND_DARK} metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Desk top surface */}
      <mesh position={[0, 1.02, 0]} castShadow>
        <boxGeometry args={[4.1, 0.04, 1.3]} />
        <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.3} />
      </mesh>

      {/* Brand accent strip */}
      <mesh position={[0, 0.5, 0.61]}>
        <boxGeometry args={[4, 0.1, 0.02]} />
        <meshStandardMaterial
          color={BRAND_YELLOW}
          emissive={BRAND_YELLOW}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Computer monitors */}
      {[-1.2, 0, 1.2].map((x, i) => (
        <group key={i} position={[x, 1.3, -0.3]}>
          <mesh castShadow>
            <boxGeometry args={[0.5, 0.35, 0.03]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
          <mesh position={[0, 0, 0.016]}>
            <planeGeometry args={[0.46, 0.31]} />
            <meshStandardMaterial
              color="#0a2a1a"
              emissive="#00ff88"
              emissiveIntensity={0.4}
            />
          </mesh>
          <mesh position={[0, -0.25, 0]}>
            <boxGeometry args={[0.06, 0.15, 0.06]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// Self-service check-in kiosk
export const CheckInKiosk: React.FC<CheckInKioskProps> = ({
  position,
  rotation = [0, 0, 0]
}) => {
  const screenRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (screenRef.current) {
      const material = screenRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Kiosk body */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <boxGeometry args={[0.5, 1.4, 0.3]} />
        <meshStandardMaterial color="#ffffff" metalness={0.3} roughness={0.4} />
      </mesh>

      {/* Screen */}
      <mesh ref={screenRef} position={[0, 1, 0.16]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[0.4, 0.5, 0.02]} />
        <meshStandardMaterial
          color="#1a1a2e"
          emissive={BRAND_YELLOW}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Card reader slot */}
      <mesh position={[0, 0.4, 0.16]}>
        <boxGeometry args={[0.15, 0.02, 0.02]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* Brand accent */}
      <mesh position={[0, 0.1, 0.16]}>
        <boxGeometry args={[0.4, 0.05, 0.01]} />
        <meshStandardMaterial
          color={BRAND_YELLOW}
          emissive={BRAND_YELLOW}
          emissiveIntensity={0.4}
        />
      </mesh>
    </group>
  );
};

// Waiting area bench
export const WaitingBench: React.FC<WaitingBenchProps> = ({
  position,
  rotation = [0, 0, 0]
}) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Seat cushion */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.1, 0.6]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.8} />
      </mesh>

      {/* Seat frame */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[2.1, 0.05, 0.65]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} />
      </mesh>

      {/* Legs */}
      {[[-0.9, 0], [0.9, 0]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.075, z]} castShadow>
          <boxGeometry args={[0.05, 0.15, 0.5]} />
          <meshStandardMaterial color="#333333" metalness={0.6} />
        </mesh>
      ))}

      {/* Armrests */}
      {[-1, 0, 1].map((x, i) => (
        <mesh key={i} position={[x * 0.95, 0.4, 0]} castShadow>
          <boxGeometry args={[0.05, 0.25, 0.5]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.4} />
        </mesh>
      ))}
    </group>
  );
};

// Digital wayfinding display
export const WayfindingDisplay: React.FC<WayfindingDisplayProps> = ({
  position,
  rotation = [0, 0, 0]
}) => {
  const screenRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (screenRef.current) {
      const material = screenRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.4 + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0} floatIntensity={0.02}>
      <group position={position} rotation={rotation}>
        {/* Display frame */}
        <mesh castShadow>
          <boxGeometry args={[1.5, 2.2, 0.1]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.4} />
        </mesh>

        {/* Screen */}
        <mesh ref={screenRef} position={[0, 0, 0.051]}>
          <planeGeometry args={[1.4, 2.1]} />
          <meshStandardMaterial
            color="#0a1a2a"
            emissive="#4488ff"
            emissiveIntensity={0.4}
          />
        </mesh>

        {/* Stand */}
        <mesh position={[0, -1.5, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.08, 0.8, 16]} />
          <meshStandardMaterial color="#333333" metalness={0.6} />
        </mesh>

        {/* Base */}
        <mesh position={[0, -1.9, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.05, 16]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.5} />
        </mesh>
      </group>
    </Float>
  );
};

// Retail display stand
export const RetailDisplay: React.FC<RetailDisplayProps> = ({ position }) => {
  return (
    <group position={position}>
      {/* Display shelving */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[1.2, 1.5, 0.4]} />
        <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.4} />
      </mesh>

      {/* Shelves */}
      {[0.3, 0.7, 1.1].map((y, i) => (
        <mesh key={i} position={[0, y, 0.05]} castShadow>
          <boxGeometry args={[1.1, 0.02, 0.35]} />
          <meshStandardMaterial color="#f0f0f0" />
        </mesh>
      ))}

      {/* Products (simplified boxes) */}
      {[
        [-0.35, 0.4, 0],
        [0, 0.4, 0],
        [0.35, 0.4, 0],
        [-0.25, 0.8, 0],
        [0.25, 0.8, 0]
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.15, 0.2, 0.1]} />
          <meshStandardMaterial
            color={['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7'][i]}
          />
        </mesh>
      ))}

      {/* Brand accent */}
      <mesh position={[0, 1.45, 0.21]}>
        <boxGeometry args={[1.1, 0.08, 0.01]} />
        <meshStandardMaterial
          color={BRAND_YELLOW}
          emissive={BRAND_YELLOW}
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
};

// Refreshment bar
export const RefreshmentBar: React.FC<RefreshmentBarProps> = ({ position }) => {
  return (
    <group position={position}>
      {/* Counter */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 1, 0.8]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.3} roughness={0.6} />
      </mesh>

      {/* Counter top */}
      <mesh position={[0, 1.02, 0]} castShadow>
        <boxGeometry args={[3.1, 0.04, 0.85]} />
        <meshStandardMaterial color="#f5f5f5" metalness={0.1} roughness={0.3} />
      </mesh>

      {/* Coffee machine */}
      <mesh position={[-1, 1.3, -0.1]} castShadow>
        <boxGeometry args={[0.4, 0.5, 0.4]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} />
      </mesh>

      {/* Water dispenser */}
      <mesh position={[0.5, 1.4, -0.1]} castShadow>
        <boxGeometry args={[0.3, 0.7, 0.35]} />
        <meshStandardMaterial color="#e0e0e0" metalness={0.3} />
      </mesh>

      {/* Cups stack */}
      <mesh position={[1, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.08, 0.15, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
};

// Main Reception Area component
export const ReceptionArea: React.FC<ReceptionAreaProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1
}) => {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Floor */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 15]} />
        <meshStandardMaterial color="#f5f5f5" metalness={0.1} roughness={0.6} />
      </mesh>

      {/* Reception desk */}
      <ReceptionDesk position={[0, 0, -5]} />

      {/* Check-in kiosks */}
      <CheckInKiosk position={[-6, 0, -2]} rotation={[0, Math.PI / 6, 0]} />
      <CheckInKiosk position={[-4, 0, -1]} rotation={[0, Math.PI / 8, 0]} />
      <CheckInKiosk position={[4, 0, -1]} rotation={[0, -Math.PI / 8, 0]} />
      <CheckInKiosk position={[6, 0, -2]} rotation={[0, -Math.PI / 6, 0]} />

      {/* Waiting area */}
      <WaitingBench position={[-5, 0, 3]} rotation={[0, Math.PI / 2, 0]} />
      <WaitingBench position={[-5, 0, 5]} rotation={[0, Math.PI / 2, 0]} />
      <WaitingBench position={[5, 0, 3]} rotation={[0, -Math.PI / 2, 0]} />
      <WaitingBench position={[5, 0, 5]} rotation={[0, -Math.PI / 2, 0]} />

      {/* Wayfinding displays */}
      <WayfindingDisplay position={[-8, 1.5, 0]} rotation={[0, Math.PI / 4, 0]} />
      <WayfindingDisplay position={[8, 1.5, 0]} rotation={[0, -Math.PI / 4, 0]} />

      {/* Retail displays */}
      <RetailDisplay position={[-7, 0, 5]} />
      <RetailDisplay position={[7, 0, 5]} />

      {/* Refreshment bar */}
      <RefreshmentBar position={[0, 0, 6]} />

      {/* Ambient lighting */}
      <pointLight
        position={[0, 4, 0]}
        intensity={0.8}
        color="#ffffff"
        distance={20}
        decay={2}
      />

      {/* Accent lighting */}
      <pointLight
        position={[0, 2, -5]}
        intensity={0.4}
        color={BRAND_YELLOW}
        distance={8}
        decay={2}
      />
    </group>
  );
};

export default ReceptionArea;
