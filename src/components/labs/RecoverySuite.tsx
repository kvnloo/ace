/**
 * RecoverySuite.tsx
 * Recovery facilities with cryotherapy, compression therapy, infrared sauna, and hydrotherapy
 * Integrated from PR #6 with DebugContext support
 */

import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Types
interface RecoverySuiteProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

// Cryotherapy Chamber Component
const CryoChamber: React.FC<{ position: [number, number, number]; active: boolean }> = ({
  position,
  active
}) => {
  const chamberRef = useRef<THREE.Group>(null);
  const mistRef = useRef<THREE.Points>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  // Mist particles
  const mistParticles = useMemo(() => {
    const positions = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 1.5;
      positions[i * 3 + 1] = Math.random() * 2.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (!chamberRef.current || !active) return;

    const time = state.clock.elapsedTime;

    // Pulsing glow effect
    if (glowRef.current) {
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.3 + Math.sin(time * 2) * 0.15;
    }

    // Animated mist
    if (mistRef.current) {
      const positions = mistRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += 0.01;
        if (positions[i + 1] > 2.5) positions[i + 1] = 0;
      }
      mistRef.current.geometry.attributes.position.needsUpdate = true;
      mistRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={chamberRef} position={position}>
      {/* Chamber base */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[1, 1, 1, 32]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Glass cylinder */}
      <mesh position={[0, 1.75, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 2.5, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#4dd0e1"
          transparent
          opacity={0.2}
          metalness={0.1}
          roughness={0.1}
        />
      </mesh>

      {/* Cryo mist particles */}
      {active && (
        <points ref={mistRef} position={[0, 0.5, 0]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={mistParticles.length / 3}
              array={mistParticles}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.08}
            color="#80deea"
            transparent
            opacity={0.6}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}

      {/* Glow effect */}
      <mesh ref={glowRef} position={[0, 1.75, 0]}>
        <cylinderGeometry args={[0.95, 0.95, 2.6, 32]} />
        <meshBasicMaterial
          color={active ? "#00bcd4" : "#333"}
          transparent
          opacity={active ? 0.3 : 0.1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Control panel */}
      <mesh position={[1.1, 1, 0]}>
        <boxGeometry args={[0.3, 0.5, 0.2]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.6} />
      </mesh>

      {/* Status indicator */}
      <mesh position={[1.1, 1.3, 0.11]}>
        <circleGeometry args={[0.05, 16]} />
        <meshStandardMaterial
          color={active ? "#00e5ff" : "#666"}
          emissive={active ? "#00e5ff" : "#000"}
          emissiveIntensity={active ? 0.8 : 0}
        />
      </mesh>
    </group>
  );
};

// Compression Therapy Station
const CompressionStation: React.FC<{ position: [number, number, number]; active: boolean }> = ({
  position,
  active
}) => {
  const [compressionPhase, setCompressionPhase] = useState(0);

  useFrame((state) => {
    if (!active) return;
    const time = state.clock.elapsedTime;
    setCompressionPhase((Math.sin(time * 1.5) + 1) / 2);
  });

  return (
    <group position={position}>
      {/* Base platform */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[2.5, 0.4, 1.5]} />
        <meshStandardMaterial color="#2c2c3e" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Recliner */}
      <mesh position={[0, 0.6, 0]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[0.8, 0.3, 1.8]} />
        <meshStandardMaterial color="#1e1e2e" />
      </mesh>

      {/* Compression sleeves (legs) */}
      <mesh position={[-0.3, 0.5, -0.5]} scale={[1, 1, active ? 0.95 + compressionPhase * 0.05 : 1]}>
        <cylinderGeometry args={[0.15, 0.18, 0.8, 16]} />
        <meshStandardMaterial
          color={active ? "#7b1fa2" : "#333"}
          emissive={active ? "#7b1fa2" : "#000"}
          emissiveIntensity={active ? compressionPhase * 0.5 : 0}
        />
      </mesh>
      <mesh position={[0.3, 0.5, -0.5]} scale={[1, 1, active ? 0.95 + compressionPhase * 0.05 : 1]}>
        <cylinderGeometry args={[0.15, 0.18, 0.8, 16]} />
        <meshStandardMaterial
          color={active ? "#7b1fa2" : "#333"}
          emissive={active ? "#7b1fa2" : "#000"}
          emissiveIntensity={active ? compressionPhase * 0.5 : 0}
        />
      </mesh>

      {/* Control panel */}
      <mesh position={[0.8, 1, 0.5]}>
        <boxGeometry args={[0.3, 0.5, 0.05]} />
        <meshStandardMaterial color="#1a1a2e" emissive="#4a148c" emissiveIntensity={active ? 0.3 : 0} />
      </mesh>
    </group>
  );
};

// Infrared Sauna
const InfraredSauna: React.FC<{ position: [number, number, number]; active: boolean }> = ({
  position,
  active
}) => {
  const heatWavesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!active || !heatWavesRef.current) return;
    const time = state.clock.elapsedTime;
    heatWavesRef.current.children.forEach((wave, i) => {
      wave.position.y = 0.5 + Math.sin(time * 2 + i * 0.5) * 0.3;
      ((wave as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity =
        0.1 + Math.sin(time * 2 + i * 0.5) * 0.05;
    });
  });

  return (
    <group position={position}>
      {/* Sauna structure */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[2.5, 2.4, 2.5]} />
        <meshStandardMaterial color="#5d4037" roughness={0.8} />
      </mesh>

      {/* Glass door */}
      <mesh position={[1.26, 1.2, 0]}>
        <boxGeometry args={[0.02, 2, 1.5]} />
        <meshPhysicalMaterial
          color="#ff6f00"
          transparent
          opacity={0.3}
          metalness={0.1}
          roughness={0.1}
        />
      </mesh>

      {/* Infrared panels */}
      {[-0.8, 0, 0.8].map((x, i) => (
        <mesh key={i} position={[x, 1.5, -1.2]}>
          <boxGeometry args={[0.4, 1.2, 0.05]} />
          <meshStandardMaterial
            color={active ? "#ff6d00" : "#333"}
            emissive={active ? "#ff6d00" : "#000"}
            emissiveIntensity={active ? 0.8 : 0}
          />
        </mesh>
      ))}

      {/* Heat waves effect */}
      {active && (
        <group ref={heatWavesRef} position={[0, 1.2, 0]}>
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[0, 0, 0]}>
              <sphereGeometry args={[1.5 + i * 0.2, 16, 16]} />
              <meshBasicMaterial
                color="#ff6d00"
                transparent
                opacity={0.1}
                blending={THREE.AdditiveBlending}
                side={THREE.BackSide}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Bench */}
      <mesh position={[0, 0.6, -0.8]}>
        <boxGeometry args={[2, 0.2, 0.6]} />
        <meshStandardMaterial color="#6d4c41" />
      </mesh>
    </group>
  );
};

// Hydrotherapy Pool
const HydrotherapyPool: React.FC<{ position: [number, number, number]; active: boolean }> = ({
  position,
  active
}) => {
  const waterRef = useRef<THREE.Mesh>(null);
  const bubblesRef = useRef<THREE.Points>(null);

  const bubblePositions = useMemo(() => {
    const positions = new Float32Array(150 * 3);
    for (let i = 0; i < 150; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 3;
      positions[i * 3 + 1] = Math.random() * -0.8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    return positions;
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Water ripple effect
    if (waterRef.current) {
      waterRef.current.position.y = 0.05 + Math.sin(time * 1.5) * 0.02;
    }

    // Bubble animation
    if (bubblesRef.current && active) {
      const positions = bubblesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += 0.015;
        if (positions[i + 1] > 0.1) {
          positions[i + 1] = -0.8;
          positions[i] = (Math.random() - 0.5) * 3;
          positions[i + 2] = (Math.random() - 0.5) * 2;
        }
      }
      bubblesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group position={position}>
      {/* Pool shell */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[4, 1.2, 3]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Water surface */}
      <mesh ref={waterRef} position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.8, 2.8]} />
        <meshPhysicalMaterial
          color="#0288d1"
          transparent
          opacity={0.7}
          metalness={0.1}
          roughness={0.1}
        />
      </mesh>

      {/* Bubbles */}
      {active && (
        <points ref={bubblesRef} position={[0, 0, 0]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={bubblePositions.length / 3}
              array={bubblePositions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.05}
            color="#ffffff"
            transparent
            opacity={0.6}
          />
        </points>
      )}

      {/* Jets indicators */}
      {[[-1.5, -0.2, -1], [-1.5, -0.2, 1], [1.5, -0.2, -1], [1.5, -0.2, 1]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.1, 0.1, 0.1, 16]} />
          <meshStandardMaterial
            color={active ? "#00bcd4" : "#333"}
            emissive={active ? "#00bcd4" : "#000"}
            emissiveIntensity={active ? 0.8 : 0}
          />
        </mesh>
      ))}

      {/* Pool edge */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[4.2, 0.1, 3.2]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.4} />
      </mesh>
    </group>
  );
};

// Main Recovery Suite component
export const RecoverySuite: React.FC<RecoverySuiteProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1
}) => {
  const [activeStations, setActiveStations] = useState({
    cryo: true,
    compression: true,
    sauna: false,
    hydro: true
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Floor */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[25, 20]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.8} />
      </mesh>

      {/* Cryotherapy Chambers */}
      <CryoChamber position={[-8, 0, -6]} active={activeStations.cryo} />
      <CryoChamber position={[-5, 0, -6]} active={false} />

      {/* Compression Stations */}
      <CompressionStation position={[0, 0, -6]} active={activeStations.compression} />
      <CompressionStation position={[4, 0, -6]} active={false} />

      {/* Infrared Sauna */}
      <InfraredSauna position={[8, 0, -5]} active={activeStations.sauna} />

      {/* Hydrotherapy Pools */}
      <HydrotherapyPool position={[-5, 0, 5]} active={activeStations.hydro} />
      <HydrotherapyPool position={[5, 0, 5]} active={false} />

      {/* Ambient lighting */}
      <pointLight
        position={[0, 5, 0]}
        intensity={0.4}
        color="#4488ff"
        distance={30}
        decay={2}
      />
      <pointLight
        position={[-8, 3, -6]}
        intensity={0.4}
        color="#00bcd4"
        distance={10}
        decay={2}
      />
      <pointLight
        position={[8, 3, -5]}
        intensity={0.3}
        color="#ff6d00"
        distance={10}
        decay={2}
      />
      <pointLight
        position={[0, 2, 5]}
        intensity={0.3}
        color="#0288d1"
        distance={15}
        decay={2}
      />
    </group>
  );
};

export default RecoverySuite;
