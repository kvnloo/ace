import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

interface RecoverySuiteProps {
  position?: [number, number, number];
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
      glowRef.current.material.opacity = 0.3 + Math.sin(time * 2) * 0.15;
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
          transmission={0.9}
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

      {/* Temperature display */}
      <Text
        position={[0, 3.2, 1]}
        fontSize={0.15}
        color={active ? "#00e5ff" : "#666"}
        anchorX="center"
        anchorY="middle"
      >
        {active ? "-110°C" : "STANDBY"}
      </Text>
    </group>
  );
};

// Compression Therapy Station
const CompressionStation: React.FC<{ position: [number, number, number]; active: boolean }> = ({
  position,
  active
}) => {
  const stationRef = useRef<THREE.Group>(null);
  const [compressionPhase, setCompressionPhase] = useState(0);

  useFrame((state) => {
    if (!active) return;
    const time = state.clock.elapsedTime;
    setCompressionPhase((Math.sin(time * 1.5) + 1) / 2);
  });

  return (
    <group ref={stationRef} position={position}>
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

      {/* Status display */}
      <Text
        position={[0, 1.5, 0.8]}
        fontSize={0.12}
        color={active ? "#ba68c8" : "#666"}
        anchorX="center"
        anchorY="middle"
      >
        {active ? `PRESSURE: ${Math.round(40 + compressionPhase * 40)} mmHg` : "READY"}
      </Text>
    </group>
  );
};

// Infrared Sauna
const InfraredSauna: React.FC<{ position: [number, number, number]; active: boolean }> = ({
  position,
  active
}) => {
  const saunaRef = useRef<THREE.Group>(null);
  const heatWavesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!active || !heatWavesRef.current) return;
    const time = state.clock.elapsedTime;
    heatWavesRef.current.children.forEach((wave, i) => {
      wave.position.y = 0.5 + Math.sin(time * 2 + i * 0.5) * 0.3;
      (wave as THREE.Mesh).material.opacity = 0.1 + Math.sin(time * 2 + i * 0.5) * 0.05;
    });
  });

  return (
    <group ref={saunaRef} position={position}>
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

      {/* Temperature display */}
      <Text
        position={[0, 2.6, 1.3]}
        fontSize={0.15}
        color={active ? "#ff9800" : "#666"}
        anchorX="center"
        anchorY="middle"
      >
        {active ? "65°C / 149°F" : "HEATING"}
      </Text>
    </group>
  );
};

// Hydrotherapy Pool
const HydrotherapyPool: React.FC<{ position: [number, number, number]; active: boolean }> = ({
  position,
  active
}) => {
  const poolRef = useRef<THREE.Group>(null);
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
        positions[i + 1] += 0.02;
        if (positions[i + 1] > 0.2) {
          positions[i + 1] = -0.8;
          positions[i] = (Math.random() - 0.5) * 3;
          positions[i + 2] = (Math.random() - 0.5) * 2;
        }
      }
      bubblesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={poolRef} position={position}>
      {/* Pool basin */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[3.5, 1, 2.5]} />
        <meshStandardMaterial color="#1565c0" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Water surface */}
      <mesh ref={waterRef} position={[0, 0.05, 0]}>
        <boxGeometry args={[3.3, 0.1, 2.3]} />
        <meshPhysicalMaterial
          color="#0288d1"
          transparent
          opacity={0.6}
          metalness={0.2}
          roughness={0.1}
          transmission={0.5}
        />
      </mesh>

      {/* Bubbles */}
      {active && (
        <points ref={bubblesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={bubblePositions.length / 3}
              array={bubblePositions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.06}
            color="#ffffff"
            transparent
            opacity={0.7}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}

      {/* Jets (4 corners) */}
      {[
        [-1.5, -0.3, -1],
        [1.5, -0.3, -1],
        [-1.5, -0.3, 1],
        [1.5, -0.3, 1]
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.08, 0.08, 0.2, 16]} />
          <meshStandardMaterial
            color={active ? "#00bcd4" : "#333"}
            emissive={active ? "#00bcd4" : "#000"}
            emissiveIntensity={active ? 0.6 : 0}
          />
        </mesh>
      ))}

      {/* Steps */}
      <mesh position={[1.4, -0.2, 0]}>
        <boxGeometry args={[0.4, 0.6, 1]} />
        <meshStandardMaterial color="#0277bd" />
      </mesh>

      {/* Status display */}
      <Text
        position={[0, 0.5, 1.5]}
        fontSize={0.12}
        color={active ? "#03a9f4" : "#666"}
        anchorX="center"
        anchorY="middle"
      >
        {active ? "JETS ACTIVE - 38°C" : "STANDBY"}
      </Text>
    </group>
  );
};

// Meditation Pod
const MeditationPod: React.FC<{ position: [number, number, number]; active: boolean }> = ({
  position,
  active
}) => {
  const podRef = useRef<THREE.Group>(null);
  const auraRef = useRef<THREE.Mesh>(null);
  const [breathPhase, setBreathPhase] = useState(0);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (active) {
      // Breathing light effect
      const breath = (Math.sin(time * 0.8) + 1) / 2;
      setBreathPhase(breath);

      if (auraRef.current) {
        auraRef.current.scale.setScalar(1 + breath * 0.15);
        auraRef.current.material.opacity = 0.15 + breath * 0.1;
      }
    }
  });

  return (
    <group ref={podRef} position={position}>
      {/* Pod base */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 0.6, 32]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Pod dome */}
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[1.15, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial
          color="#311b92"
          transparent
          opacity={0.4}
          metalness={0.3}
          roughness={0.1}
          transmission={0.6}
        />
      </mesh>

      {/* Cushioned seat */}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.3, 32]} />
        <meshStandardMaterial color="#4a148c" />
      </mesh>

      {/* Ambient aura */}
      {active && (
        <mesh ref={auraRef} position={[0, 1, 0]}>
          <sphereGeometry args={[1.3, 32, 32]} />
          <meshBasicMaterial
            color="#9c27b0"
            transparent
            opacity={0.15}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
          />
        </mesh>
      )}

      {/* Ambient light points */}
      {active && [0, 120, 240].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <pointLight
            key={i}
            position={[Math.cos(rad) * 1, 0.8, Math.sin(rad) * 1]}
            color="#ab47bc"
            intensity={breathPhase * 0.5}
            distance={2}
          />
        );
      })}

      {/* Status display */}
      <Text
        position={[0, 2, 0]}
        fontSize={0.12}
        color={active ? "#ce93d8" : "#666"}
        anchorX="center"
        anchorY="middle"
      >
        {active ? "MEDITATION MODE" : "READY"}
      </Text>

      {/* Breath guide */}
      {active && (
        <Text
          position={[0, 1.7, 0]}
          fontSize={0.1}
          color="#e1bee7"
          anchorX="center"
          anchorY="middle"
        >
          {breathPhase > 0.5 ? "BREATHE IN" : "BREATHE OUT"}
        </Text>
      )}
    </group>
  );
};

// Wellness Monitoring Display
const WellnessMonitor: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const [heartRate, setHeartRate] = useState(72);
  const [hrv, setHrv] = useState(58);
  const [recovery, setRecovery] = useState(87);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeartRate(70 + Math.floor(Math.random() * 8));
      setHrv(55 + Math.floor(Math.random() * 10));
      setRecovery(85 + Math.floor(Math.random() * 10));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <group position={position}>
      {/* Monitor screen */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[2, 1.5, 0.1]} />
        <meshStandardMaterial color="#0a0a0a" emissive="#111" emissiveIntensity={0.2} />
      </mesh>

      {/* Screen glow */}
      <mesh position={[0, 1.5, -0.06]}>
        <planeGeometry args={[1.9, 1.4]} />
        <meshBasicMaterial color="#00e676" opacity={0.1} transparent />
      </mesh>

      {/* Stand */}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.05, 0.08, 0.7, 16]} />
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Base */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.05, 32]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Display content */}
      <Text
        position={[0, 2, 0.06]}
        fontSize={0.15}
        color="#00e676"
        anchorX="center"
        anchorY="middle"
      >
        WELLNESS METRICS
      </Text>

      <Text
        position={[-0.6, 1.7, 0.06]}
        fontSize={0.1}
        color="#64ffda"
        anchorX="left"
        anchorY="middle"
      >
        {`Heart Rate: ${heartRate} BPM`}
      </Text>

      <Text
        position={[-0.6, 1.5, 0.06]}
        fontSize={0.1}
        color="#64ffda"
        anchorX="left"
        anchorY="middle"
      >
        {`HRV: ${hrv} ms`}
      </Text>

      <Text
        position={[-0.6, 1.3, 0.06]}
        fontSize={0.1}
        color="#64ffda"
        anchorX="left"
        anchorY="middle"
      >
        {`Recovery: ${recovery}%`}
      </Text>

      {/* Recovery bar */}
      <mesh position={[-0.6 + (recovery / 100) * 0.7, 1.1, 0.06]}>
        <boxGeometry args={[(recovery / 100) * 1.4, 0.08, 0.01]} />
        <meshBasicMaterial color={recovery > 90 ? "#00e676" : recovery > 70 ? "#ffd600" : "#ff5252"} />
      </mesh>
    </group>
  );
};

// Main Recovery Suite Component
const RecoverySuite: React.FC<RecoverySuiteProps> = ({ position = [0, 0, 0] }) => {
  const suiteRef = useRef<THREE.Group>(null);
  const [activeStations, setActiveStations] = useState({
    cryo1: true,
    cryo2: false,
    compression1: true,
    compression2: false,
    sauna: true,
    pool: true,
    pod1: true,
    pod2: false,
  });

  // Cycle active stations for demo
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStations(prev => ({
        cryo1: Math.random() > 0.3,
        cryo2: Math.random() > 0.5,
        compression1: Math.random() > 0.4,
        compression2: Math.random() > 0.6,
        sauna: Math.random() > 0.2,
        pool: Math.random() > 0.3,
        pod1: Math.random() > 0.4,
        pod2: Math.random() > 0.5,
      }));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <group ref={suiteRef} position={position}>
      {/* Floor */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 25]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Ambient lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#ffffff" />

      {/* Cryotherapy Chambers */}
      <CryoChamber position={[-8, 0, -6]} active={activeStations.cryo1} />
      <CryoChamber position={[-5, 0, -6]} active={activeStations.cryo2} />

      {/* Compression Therapy Stations */}
      <CompressionStation position={[-8, 0, 0]} active={activeStations.compression1} />
      <CompressionStation position={[-5, 0, 0]} active={activeStations.compression2} />

      {/* Infrared Sauna */}
      <InfraredSauna position={[-6.5, 0, 6]} active={activeStations.sauna} />

      {/* Hydrotherapy Pool */}
      <HydrotherapyPool position={[3, 0, -5]} active={activeStations.pool} />

      {/* Meditation Pods */}
      <MeditationPod position={[7, 0, 2]} active={activeStations.pod1} />
      <MeditationPod position={[7, 0, 5]} active={activeStations.pod2} />

      {/* Wellness Monitors */}
      <WellnessMonitor position={[-10, 0, -3]} />
      <WellnessMonitor position={[9, 0, -3]} />

      {/* Suite title */}
      <Text
        position={[0, 4, -10]}
        fontSize={0.5}
        color="#00e676"
        anchorX="center"
        anchorY="middle"
      >
        APEX RECOVERY SUITE
      </Text>

      {/* Status indicators */}
      <Text
        position={[0, 3.3, -10]}
        fontSize={0.15}
        color="#64ffda"
        anchorX="center"
        anchorY="middle"
      >
        {`ACTIVE STATIONS: ${Object.values(activeStations).filter(Boolean).length}/8`}
      </Text>
    </group>
  );
};

export default RecoverySuite;
