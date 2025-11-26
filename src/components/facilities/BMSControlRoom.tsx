/**
 * BMSControlRoom.tsx
 * Building Management System control room with monitoring stations
 * Integrated from PR #6 with DebugContext support
 */

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Types
interface WorkstationProps {
  position: [number, number, number];
  rotation?: [number, number, number];
}

interface WallDisplayProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
  label?: string;
}

interface ServerRackProps {
  position: [number, number, number];
}

interface BMSControlRoomProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

// Operator workstation with 3 monitors
export const OperatorWorkstation: React.FC<WorkstationProps> = ({
  position,
  rotation = [0, 0, 0]
}) => {
  const screenRef = useRef<THREE.Mesh>(null);

  // Subtle screen flicker effect
  useFrame((state) => {
    if (screenRef.current) {
      const material = screenRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.8 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Desk */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.05, 0.8]} />
        <meshStandardMaterial color="#2c2c2c" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Desk legs */}
      {[[-0.8, 0.2, 0.3], [0.8, 0.2, 0.3], [-0.8, 0.2, -0.3], [0.8, 0.2, -0.3]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.05, 0.4, 0.05]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}

      {/* Triple monitor setup */}
      {[-0.55, 0, 0.55].map((xOffset, i) => (
        <group key={i} position={[xOffset, 0.7, -0.2]}>
          {/* Monitor frame */}
          <mesh castShadow>
            <boxGeometry args={[0.5, 0.35, 0.03]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.4} roughness={0.6} />
          </mesh>
          {/* Screen */}
          <mesh ref={i === 1 ? screenRef : undefined} position={[0, 0, 0.016]}>
            <planeGeometry args={[0.46, 0.31]} />
            <meshStandardMaterial
              color="#0a2a1a"
              emissive="#00ff88"
              emissiveIntensity={0.8}
            />
          </mesh>
          {/* Monitor stand */}
          <mesh position={[0, -0.25, 0]} castShadow>
            <boxGeometry args={[0.08, 0.15, 0.08]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* Keyboard */}
      <mesh position={[0, 0.43, 0.1]} castShadow>
        <boxGeometry args={[0.45, 0.02, 0.15]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.2} roughness={0.8} />
      </mesh>

      {/* Mouse */}
      <mesh position={[0.4, 0.43, 0.1]} castShadow>
        <boxGeometry args={[0.06, 0.02, 0.1]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.2} roughness={0.8} />
      </mesh>

      {/* Chair */}
      <group position={[0, 0.5, 0.6]}>
        {/* Seat */}
        <mesh castShadow>
          <boxGeometry args={[0.5, 0.08, 0.5]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.2} roughness={0.8} />
        </mesh>
        {/* Backrest */}
        <mesh position={[0, 0.35, -0.22]} castShadow>
          <boxGeometry args={[0.48, 0.6, 0.08]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.2} roughness={0.8} />
        </mesh>
        {/* Chair base */}
        <mesh position={[0, -0.25, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.05, 16]} />
          <meshStandardMaterial color="#333333" metalness={0.6} roughness={0.4} />
        </mesh>
        {/* Chair stem */}
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.3, 8]} />
          <meshStandardMaterial color="#555555" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
};

// Large wall-mounted display
export const WallDisplayScreen: React.FC<WallDisplayProps> = ({
  position,
  rotation = [0, 0, 0],
  color = '#00ff88',
  label = 'SYSTEM STATUS'
}) => {
  const screenRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (screenRef.current) {
      const material = screenRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.6 + Math.sin(state.clock.elapsedTime * 1.5) * 0.15;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Display frame */}
      <mesh castShadow>
        <boxGeometry args={[2.5, 1.5, 0.1]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Screen */}
      <mesh ref={screenRef} position={[0, 0, 0.051]}>
        <planeGeometry args={[2.4, 1.4]} />
        <meshStandardMaterial
          color="#0a1a2a"
          emissive={color}
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Status indicator light */}
      <mesh position={[1.15, 0.65, 0.051]}>
        <circleGeometry args={[0.03, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1}
        />
      </mesh>
    </group>
  );
};

// Server rack with status LEDs
export const ServerRack: React.FC<ServerRackProps> = ({ position }) => {
  const ledRefs = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    ledRefs.current.forEach((led, i) => {
      if (led) {
        const material = led.material as THREE.MeshStandardMaterial;
        const phase = state.clock.elapsedTime * 3 + i * 0.5;
        material.emissiveIntensity = 0.5 + Math.sin(phase) * 0.5;
      }
    });
  });

  return (
    <group position={position}>
      {/* Rack cabinet */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.6, 2, 0.8]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Front panel with ventilation */}
      <mesh position={[0, 0, 0.401]}>
        <boxGeometry args={[0.55, 1.9, 0.01]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Status LEDs */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) ledRefs.current[i] = el; }}
          position={[0.2, 0.8 - i * 0.2, 0.42]}
        >
          <circleGeometry args={[0.015, 8]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? '#ff4444' : '#00ff44'}
            emissive={i % 3 === 0 ? '#ff4444' : '#00ff44'}
            emissiveIntensity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
};

// Main BMS Control Room component
export const BMSControlRoom: React.FC<BMSControlRoomProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1
}) => {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Room floor */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 8]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Operator workstations - 3 stations */}
      <OperatorWorkstation position={[-3, 0, 2]} rotation={[0, 0, 0]} />
      <OperatorWorkstation position={[0, 0, 2]} rotation={[0, 0, 0]} />
      <OperatorWorkstation position={[3, 0, 2]} rotation={[0, 0, 0]} />

      {/* Wall displays */}
      <WallDisplayScreen
        position={[-3, 2, -3.9]}
        color="#00ff88"
        label="HVAC SYSTEMS"
      />
      <WallDisplayScreen
        position={[0, 2, -3.9]}
        color="#4488ff"
        label="LIGHTING CONTROL"
      />
      <WallDisplayScreen
        position={[3, 2, -3.9]}
        color="#ffaa00"
        label="ENERGY USAGE"
      />

      {/* Server racks along side wall */}
      <ServerRack position={[-5.5, 1, -1]} />
      <ServerRack position={[-5.5, 1, 0.5]} />
      <ServerRack position={[-5.5, 1, 2]} />

      {/* Ambient lighting */}
      <pointLight
        position={[0, 3, 0]}
        intensity={0.5}
        color="#4488ff"
        distance={15}
        decay={2}
      />

      {/* Monitor glow */}
      <pointLight
        position={[0, 1, 1]}
        intensity={0.3}
        color="#00ff88"
        distance={5}
        decay={2}
      />
    </group>
  );
};

export default BMSControlRoom;
