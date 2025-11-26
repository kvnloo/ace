/**
 * MechanicalRooms.tsx
 * Mechanical infrastructure systems with animated components
 * HVAC, electrical, water treatment, generators, and maintenance robots
 * Integrated from PR #6 with DebugContext support
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Types
interface AirHandlerProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  isRunning?: boolean;
}

interface ElectricalPanelProps {
  position: [number, number, number];
  rotation?: [number, number, number];
}

interface WaterTreatmentProps {
  position: [number, number, number];
  rotation?: [number, number, number];
}

interface GeneratorProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  isRunning?: boolean;
}

interface MaintenanceRobotProps {
  position: [number, number, number];
  rotation?: [number, number, number];
}

interface RobotDockingStationProps {
  position: [number, number, number];
  rotation?: [number, number, number];
}

interface MechanicalRoomsProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

// Air Handler Unit with animated fans and particles
export const AirHandlerUnit: React.FC<AirHandlerProps> = ({
  position,
  rotation = [0, 0, 0],
  isRunning = true
}) => {
  const fanRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Animate fan rotation
  useFrame((state, delta) => {
    if (fanRef.current && isRunning) {
      fanRef.current.rotation.z += delta * 10;
    }

    // Animate air particles
    if (particlesRef.current && isRunning) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 2] += 0.02; // Move along Z axis
        if (positions[i + 2] > 1) {
          positions[i + 2] = -0.5;
          positions[i] = (Math.random() - 0.5) * 0.8;
          positions[i + 1] = (Math.random() - 0.5) * 0.8;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  // Air particles
  const particles = useMemo(() => {
    const count = 50;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.8;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.8;
      positions[i * 3 + 2] = Math.random() * 1.5 - 0.5;
    }
    return positions;
  }, []);

  return (
    <group position={position} rotation={rotation}>
      {/* Main housing */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2, 1.5, 3]} />
        <meshStandardMaterial color="#5a6578" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Intake vent (front) */}
      <mesh position={[0, 0, -1.51]}>
        <planeGeometry args={[1.5, 1]} />
        <meshStandardMaterial color="#2d3748" metalness={0.4} />
      </mesh>

      {/* Vent slats */}
      {[-0.3, -0.1, 0.1, 0.3].map((y, i) => (
        <mesh key={i} position={[0, y, -1.52]}>
          <boxGeometry args={[1.4, 0.02, 0.02]} />
          <meshStandardMaterial color="#1a202c" />
        </mesh>
      ))}

      {/* Fan assembly (visible through vent) */}
      <group ref={fanRef} position={[0, 0, -1.3]}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <mesh key={i} rotation={[0, 0, (i * Math.PI) / 3]}>
            <boxGeometry args={[0.5, 0.08, 0.02]} />
            <meshStandardMaterial color="#a0aec0" metalness={0.7} />
          </mesh>
        ))}
        {/* Hub */}
        <mesh>
          <cylinderGeometry args={[0.08, 0.08, 0.05, 16]} />
          <meshStandardMaterial color="#2d3748" metalness={0.8} />
        </mesh>
      </group>

      {/* Exhaust (back) */}
      <mesh position={[0, 0, 1.51]}>
        <circleGeometry args={[0.5, 32]} />
        <meshStandardMaterial color="#2d3748" metalness={0.4} />
      </mesh>

      {/* Air particles */}
      {isRunning && (
        <points ref={particlesRef} position={[0, 0, 1.5]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particles.length / 3}
              array={particles}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            color="#88ccff"
            size={0.02}
            transparent
            opacity={0.4}
          />
        </points>
      )}

      {/* Status indicator */}
      <mesh position={[0.9, 0.6, -1.01]}>
        <circleGeometry args={[0.05, 16]} />
        <meshStandardMaterial
          color={isRunning ? '#00ff44' : '#ff4444'}
          emissive={isRunning ? '#00ff44' : '#ff4444'}
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Control panel */}
      <mesh position={[0.8, 0, -1.51]}>
        <boxGeometry args={[0.3, 0.4, 0.02]} />
        <meshStandardMaterial color="#1a202c" />
      </mesh>
    </group>
  );
};

// Electrical Panel with animated gauge
export const ElectricalPanel: React.FC<ElectricalPanelProps> = ({
  position,
  rotation = [0, 0, 0]
}) => {
  const needleRef = useRef<THREE.Mesh>(null);
  const ledsRef = useRef<THREE.Mesh[]>([]);

  // Animate gauge needle and LEDs
  useFrame((state) => {
    if (needleRef.current) {
      needleRef.current.rotation.z =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.5 - Math.PI / 4;
    }

    ledsRef.current.forEach((led, i) => {
      if (led) {
        const material = led.material as THREE.MeshStandardMaterial;
        const phase = state.clock.elapsedTime * 2 + i * 0.3;
        material.emissiveIntensity = 0.3 + Math.sin(phase) * 0.3;
      }
    });
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Main cabinet */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.2, 2, 0.4]} />
        <meshStandardMaterial color="#4a5568" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Door */}
      <mesh position={[0, 0, 0.21]} castShadow>
        <boxGeometry args={[1.1, 1.9, 0.02]} />
        <meshStandardMaterial color="#5a6578" metalness={0.4} />
      </mesh>

      {/* Handle */}
      <mesh position={[0.45, 0, 0.23]}>
        <boxGeometry args={[0.03, 0.15, 0.03]} />
        <meshStandardMaterial color="#2d3748" metalness={0.8} />
      </mesh>

      {/* Gauge */}
      <group position={[-0.3, 0.6, 0.23]}>
        {/* Gauge background */}
        <mesh>
          <circleGeometry args={[0.12, 32]} />
          <meshStandardMaterial color="#f7fafc" />
        </mesh>
        {/* Gauge border */}
        <mesh position={[0, 0, 0.001]}>
          <ringGeometry args={[0.11, 0.12, 32]} />
          <meshStandardMaterial color="#2d3748" />
        </mesh>
        {/* Needle */}
        <mesh ref={needleRef} position={[0, 0, 0.01]}>
          <boxGeometry args={[0.08, 0.01, 0.005]} />
          <meshStandardMaterial color="#e53e3e" />
        </mesh>
      </group>

      {/* Status LEDs */}
      {[0.3, 0.1, -0.1, -0.3, -0.5].map((y, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) ledsRef.current[i] = el; }}
          position={[0.35, y + 0.5, 0.23]}
        >
          <circleGeometry args={[0.025, 16]} />
          <meshStandardMaterial
            color={i === 2 ? '#ff4444' : '#00ff44'}
            emissive={i === 2 ? '#ff4444' : '#00ff44'}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}

      {/* Warning label */}
      <mesh position={[0, 0.85, 0.23]}>
        <planeGeometry args={[0.3, 0.1]} />
        <meshStandardMaterial color="#ecc94b" />
      </mesh>

      {/* Breaker switches (visible through vents) */}
      {[-0.3, -0.5, -0.7].map((y, i) => (
        <mesh key={i} position={[0, y, 0.23]}>
          <boxGeometry args={[0.6, 0.08, 0.02]} />
          <meshStandardMaterial color="#2d3748" />
        </mesh>
      ))}
    </group>
  );
};

// Water Treatment System
export const WaterTreatmentSystem: React.FC<WaterTreatmentProps> = ({
  position,
  rotation = [0, 0, 0]
}) => {
  const waterLevelRef = useRef<THREE.Mesh>(null);

  // Animate water level
  useFrame((state) => {
    if (waterLevelRef.current) {
      waterLevelRef.current.scale.y = 0.7 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Main tank */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 0.8, 2, 32]} />
        <meshStandardMaterial
          color="#718096"
          metalness={0.6}
          roughness={0.3}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Water inside (animated level) */}
      <mesh ref={waterLevelRef} position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.75, 0.75, 1.4, 32]} />
        <meshStandardMaterial
          color="#4299e1"
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Top cap */}
      <mesh position={[0, 1.05, 0]} castShadow>
        <cylinderGeometry args={[0.85, 0.85, 0.1, 32]} />
        <meshStandardMaterial color="#4a5568" metalness={0.5} />
      </mesh>

      {/* Input pipe */}
      <mesh position={[0.6, 0.5, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.5, 16]} />
        <meshStandardMaterial color="#a0aec0" metalness={0.7} />
      </mesh>

      {/* Output pipe */}
      <mesh position={[-0.6, -0.5, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.5, 16]} />
        <meshStandardMaterial color="#a0aec0" metalness={0.7} />
      </mesh>

      {/* Level indicator */}
      <mesh position={[0.82, 0, 0]}>
        <boxGeometry args={[0.05, 1.5, 0.05]} />
        <meshStandardMaterial color="#2d3748" />
      </mesh>

      {/* Control valve */}
      <mesh position={[-0.6, -0.5, 0.15]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.08, 16]} />
        <meshStandardMaterial color="#e53e3e" />
      </mesh>
    </group>
  );
};

// Backup Generator
export const BackupGenerator: React.FC<GeneratorProps> = ({
  position,
  rotation = [0, 0, 0],
  isRunning = false
}) => {
  const generatorRef = useRef<THREE.Group>(null);

  // Vibration effect when running
  useFrame((state) => {
    if (generatorRef.current && isRunning) {
      generatorRef.current.position.x =
        position[0] + Math.sin(state.clock.elapsedTime * 30) * 0.002;
      generatorRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 25) * 0.001;
    }
  });

  return (
    <group ref={generatorRef} position={position} rotation={rotation}>
      {/* Main housing */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.5, 1.2, 1.2]} />
        <meshStandardMaterial color="#2d3748" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Cooling vents */}
      {[-0.8, -0.4, 0, 0.4, 0.8].map((x, i) => (
        <mesh key={i} position={[x, 0, 0.61]}>
          <boxGeometry args={[0.15, 0.8, 0.02]} />
          <meshStandardMaterial color="#1a202c" />
        </mesh>
      ))}

      {/* Exhaust pipe */}
      <mesh position={[1.1, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.6, 16]} />
        <meshStandardMaterial color="#4a5568" metalness={0.6} />
      </mesh>

      {/* Control panel */}
      <mesh position={[-1.26, 0.2, 0]}>
        <boxGeometry args={[0.02, 0.5, 0.6]} />
        <meshStandardMaterial color="#1a202c" />
      </mesh>

      {/* Status light */}
      <mesh position={[-1.27, 0.4, 0.2]}>
        <circleGeometry args={[0.04, 16]} />
        <meshStandardMaterial
          color={isRunning ? '#00ff44' : '#666666'}
          emissive={isRunning ? '#00ff44' : '#000000'}
          emissiveIntensity={isRunning ? 0.8 : 0}
        />
      </mesh>

      {/* Fuel tank */}
      <mesh position={[0, -0.9, 0]} castShadow>
        <boxGeometry args={[1.8, 0.4, 0.8]} />
        <meshStandardMaterial color="#1a202c" />
      </mesh>

      {/* Base/mounting */}
      <mesh position={[0, -1.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.7, 0.1, 1.4]} />
        <meshStandardMaterial color="#718096" metalness={0.4} />
      </mesh>
    </group>
  );
};

// Maintenance Robot
export const MaintenanceRobot: React.FC<MaintenanceRobotProps> = ({
  position,
  rotation = [0, 0, 0]
}) => {
  const robotRef = useRef<THREE.Group>(null);
  const armRef = useRef<THREE.Mesh>(null);

  // Animate robot
  useFrame((state) => {
    if (robotRef.current) {
      // Subtle hovering motion
      robotRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.02;
    }
    if (armRef.current) {
      armRef.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.3;
    }
  });

  return (
    <group ref={robotRef} position={position} rotation={rotation}>
      {/* Body */}
      <mesh castShadow>
        <boxGeometry args={[0.4, 0.3, 0.5]} />
        <meshStandardMaterial color="#4299e1" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Head/sensor dome */}
      <mesh position={[0, 0.22, 0]} castShadow>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#1a202c" metalness={0.8} />
      </mesh>

      {/* Eye/camera */}
      <mesh position={[0, 0.22, 0.1]}>
        <circleGeometry args={[0.04, 16]} />
        <meshStandardMaterial
          color="#ff4444"
          emissive="#ff4444"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Arm */}
      <mesh ref={armRef} position={[0.25, 0, 0.1]} castShadow>
        <boxGeometry args={[0.15, 0.05, 0.05]} />
        <meshStandardMaterial color="#a0aec0" metalness={0.7} />
      </mesh>

      {/* Wheels/tracks */}
      {[[-0.15, -0.18, 0.2], [0.15, -0.18, 0.2], [-0.15, -0.18, -0.2], [0.15, -0.18, -0.2]].map(
        (pos, i) => (
          <mesh key={i} position={pos as [number, number, number]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.04, 16]} />
            <meshStandardMaterial color="#2d3748" />
          </mesh>
        )
      )}

      {/* Antenna */}
      <mesh position={[-0.1, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.01, 0.01, 0.15, 8]} />
        <meshStandardMaterial color="#a0aec0" />
      </mesh>
    </group>
  );
};

// Robot Docking Station
export const RobotDockingStation: React.FC<RobotDockingStationProps> = ({
  position,
  rotation = [0, 0, 0]
}) => {
  const chargeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (chargeRef.current) {
      const material = chargeRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 3) * 0.3;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Base */}
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.1, 0.8]} />
        <meshStandardMaterial color="#2d3748" metalness={0.5} />
      </mesh>

      {/* Back panel */}
      <mesh position={[0, 0.3, -0.35]} castShadow>
        <boxGeometry args={[0.7, 0.5, 0.1]} />
        <meshStandardMaterial color="#4a5568" metalness={0.4} />
      </mesh>

      {/* Charging contacts */}
      {[-0.15, 0.15].map((x, i) => (
        <mesh key={i} position={[x, 0.15, -0.29]}>
          <boxGeometry args={[0.08, 0.15, 0.02]} />
          <meshStandardMaterial color="#d69e2e" metalness={0.8} />
        </mesh>
      ))}

      {/* Status light */}
      <mesh ref={chargeRef} position={[0, 0.45, -0.3]}>
        <circleGeometry args={[0.04, 16]} />
        <meshStandardMaterial
          color="#00ff44"
          emissive="#00ff44"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
};

// Main Mechanical Rooms component
export const MechanicalRooms: React.FC<MechanicalRoomsProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1
}) => {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Floor */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 15]} />
        <meshStandardMaterial color="#4a5568" roughness={0.8} />
      </mesh>

      {/* HVAC Section */}
      <AirHandlerUnit position={[-6, 0.75, -5]} isRunning={true} />
      <AirHandlerUnit position={[-6, 0.75, -1]} isRunning={true} />
      <AirHandlerUnit position={[-6, 0.75, 3]} isRunning={false} />

      {/* Electrical Section */}
      <ElectricalPanel position={[6, 0, -5]} />
      <ElectricalPanel position={[6, 0, -3]} />
      <ElectricalPanel position={[6, 0, -1]} />

      {/* Water Treatment */}
      <WaterTreatmentSystem position={[0, 1, -5]} />
      <WaterTreatmentSystem position={[2.5, 1, -5]} />

      {/* Backup Generators */}
      <BackupGenerator position={[-2, 1.2, 5]} isRunning={false} />
      <BackupGenerator position={[3, 1.2, 5]} isRunning={true} />

      {/* Maintenance Robots */}
      <MaintenanceRobot position={[-3, 0.2, 0]} />
      <MaintenanceRobot position={[1, 0.2, 2]} rotation={[0, Math.PI / 3, 0]} />

      {/* Robot Docking Stations */}
      <RobotDockingStation position={[5, 0, 3]} />
      <RobotDockingStation position={[5, 0, 5]} />

      {/* Ambient industrial lighting */}
      <pointLight
        position={[0, 4, 0]}
        intensity={0.6}
        color="#ffffcc"
        distance={20}
        decay={2}
      />
      <pointLight
        position={[-6, 3, 0]}
        intensity={0.4}
        color="#88ccff"
        distance={10}
        decay={2}
      />
      <pointLight
        position={[6, 3, 0]}
        intensity={0.4}
        color="#ffcc88"
        distance={10}
        decay={2}
      />
    </group>
  );
};

export default MechanicalRooms;
