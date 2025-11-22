import React from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

/**
 * LockerRoom Component - Facility locker room representation
 *
 * Features:
 * - Architectural structure (walls, floor, ceiling)
 * - Locker banks with individual compartments
 * - Shower facilities
 * - Bench seating
 * - Ambient lighting
 * - Gender-specific labeling
 */

interface LockerRoomProps {
  position: [number, number, number];
  label: string;
  rotation?: number;
}

export const LockerRoom: React.FC<LockerRoomProps> = ({
  position,
  label,
  rotation = 0,
}) => {
  const WIDTH = 25;
  const DEPTH = 15;
  const HEIGHT = 4;

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[WIDTH, DEPTH]} />
        <meshStandardMaterial color="#475569" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, HEIGHT / 2, -DEPTH / 2]}>
        <boxGeometry args={[WIDTH, HEIGHT, 0.3]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} />
      </mesh>

      {/* Side Walls */}
      <mesh position={[-WIDTH / 2, HEIGHT / 2, 0]}>
        <boxGeometry args={[0.3, HEIGHT, DEPTH]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} />
      </mesh>
      <mesh position={[WIDTH / 2, HEIGHT / 2, 0]}>
        <boxGeometry args={[0.3, HEIGHT, DEPTH]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, HEIGHT, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[WIDTH, DEPTH]} />
        <meshStandardMaterial color="#334155" />
      </mesh>

      {/* Locker Banks - Left Side */}
      {Array.from({ length: 4 }).map((_, row) => (
        <group key={`lockers-left-${row}`} position={[-WIDTH / 2 + 1.5, 0, -DEPTH / 2 + 2 + row * 3]}>
          {Array.from({ length: 8 }).map((_, i) => (
            <mesh key={i} position={[0, 1 + (i % 2) * 1.8, 0]} castShadow>
              <boxGeometry args={[0.8, 1.6, 0.5]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? '#64748b' : '#475569'}
                metalness={0.4}
                roughness={0.5}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* Locker Banks - Right Side */}
      {Array.from({ length: 4 }).map((_, row) => (
        <group key={`lockers-right-${row}`} position={[WIDTH / 2 - 1.5, 0, -DEPTH / 2 + 2 + row * 3]}>
          {Array.from({ length: 8 }).map((_, i) => (
            <mesh key={i} position={[0, 1 + (i % 2) * 1.8, 0]} castShadow>
              <boxGeometry args={[0.8, 1.6, 0.5]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? '#64748b' : '#475569'}
                metalness={0.4}
                roughness={0.5}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* Center Benches */}
      {Array.from({ length: 3 }).map((_, i) => (
        <group key={`bench-${i}`} position={[0, 0.3, -DEPTH / 2 + 3 + i * 4]}>
          {/* Bench seat */}
          <mesh>
            <boxGeometry args={[WIDTH - 6, 0.2, 1]} />
            <meshStandardMaterial color="#78350f" roughness={0.7} />
          </mesh>
          {/* Bench legs */}
          <mesh position={[-WIDTH / 2 + 3.5, -0.15, 0]}>
            <boxGeometry args={[0.2, 0.3, 0.8]} />
            <meshStandardMaterial color="#451a03" />
          </mesh>
          <mesh position={[WIDTH / 2 - 3.5, -0.15, 0]}>
            <boxGeometry args={[0.2, 0.3, 0.8]} />
            <meshStandardMaterial color="#451a03" />
          </mesh>
        </group>
      ))}

      {/* Shower Stalls - Back Area */}
      {Array.from({ length: 6 }).map((_, i) => (
        <group key={`shower-${i}`} position={[-WIDTH / 2 + 4 + i * 2.5, 0, DEPTH / 2 - 2]}>
          {/* Stall walls */}
          <mesh position={[-0.6, 1, 0]}>
            <boxGeometry args={[0.1, 2, 1.5]} />
            <meshStandardMaterial color="#94a3b8" opacity={0.6} transparent />
          </mesh>
          <mesh position={[0.6, 1, 0]}>
            <boxGeometry args={[0.1, 2, 1.5]} />
            <meshStandardMaterial color="#94a3b8" opacity={0.6} transparent />
          </mesh>
          {/* Shower head */}
          <mesh position={[0, 2.2, -0.4]}>
            <cylinderGeometry args={[0.1, 0.1, 0.3, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Ambient Lighting */}
      <pointLight position={[0, HEIGHT - 0.5, 0]} intensity={0.8} distance={20} color="#f8fafc" />
      <pointLight position={[-WIDTH / 4, HEIGHT - 0.5, 0]} intensity={0.6} distance={15} color="#f8fafc" />
      <pointLight position={[WIDTH / 4, HEIGHT - 0.5, 0]} intensity={0.6} distance={15} color="#f8fafc" />

      {/* Ceiling Light Fixtures */}
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh key={`light-${i}`} position={[-WIDTH / 4 + (i * WIDTH / 4), HEIGHT - 0.2, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.1, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}

      {/* Room Label */}
      <Text
        position={[0, 2.5, -DEPTH / 2 + 0.2]}
        fontSize={0.8}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.05}
      >
        {label}
      </Text>

      {/* Entrance (open doorway) */}
      <mesh position={[0, 1.2, DEPTH / 2]}>
        <boxGeometry args={[3, 2.4, 0.1]} />
        <meshStandardMaterial color="#0f172a" transparent opacity={0.3} />
      </mesh>
    </group>
  );
};

export default LockerRoom;
