import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Box, Sphere, Cylinder, RoundedBox, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Body Composition Scanner
const BodyScanner = ({ position }: { position: [number, number, number] }) => {
  const scannerRef = useRef<THREE.Group>(null);
  const scanBeamRef = useRef<THREE.Mesh>(null);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanning(true);
      setScanProgress(0);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useFrame((state, delta) => {
    if (scannerRef.current) {
      scannerRef.current.rotation.y += delta * 0.1;
    }

    if (scanning && scanBeamRef.current) {
      setScanProgress(prev => {
        const next = prev + delta * 0.3;
        if (next >= 1) {
          setScanning(false);
          return 0;
        }
        return next;
      });

      scanBeamRef.current.position.y = -1 + scanProgress * 2;
      scanBeamRef.current.material.opacity = Math.sin(scanProgress * Math.PI) * 0.6;
    }
  });

  return (
    <group position={position}>
      {/* Scanner Ring */}
      <group ref={scannerRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.5, 0.08, 16, 32]} />
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.5} />
        </mesh>
        {/* Scanner Sensors */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(angle) * 1.5, 0, Math.sin(angle) * 1.5]}>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={1} />
            </mesh>
          );
        })}
      </group>

      {/* Scanning Beam */}
      {scanning && (
        <mesh ref={scanBeamRef} position={[0, -1, 0]}>
          <cylinderGeometry args={[1.6, 1.6, 0.05, 32]} />
          <meshStandardMaterial
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={1.5}
            transparent
            opacity={0.6}
          />
        </mesh>
      )}

      {/* Platform */}
      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 0.1, 32]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Support Stand */}
      <mesh position={[0, -2, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 1, 16]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Label */}
      <Text
        position={[0, -2.8, 0]}
        fontSize={0.15}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
      >
        BODY COMPOSITION
      </Text>
    </group>
  );
};

// VO2 Max Testing Equipment
const VO2MaxStation = ({ position }: { position: [number, number, number] }) => {
  const [isActive, setIsActive] = useState(false);
  const dataPointsRef = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsActive(prev => !prev);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useFrame((state) => {
    dataPointsRef.current.forEach((point, i) => {
      if (point && isActive) {
        point.position.y = Math.sin(state.clock.elapsedTime * 2 + i * 0.5) * 0.2;
        point.material.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 3 + i) * 0.5;
      }
    });
  });

  return (
    <group position={position}>
      {/* Treadmill Base */}
      <mesh position={[0, -2, 0]}>
        <boxGeometry args={[2, 0.3, 3]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Treadmill Belt */}
      <mesh position={[0, -1.85, 0]}>
        <boxGeometry args={[1.8, 0.02, 2.8]} />
        <meshStandardMaterial color="#333333" roughness={0.9} />
      </mesh>

      {/* Console Stand */}
      <mesh position={[0, -0.5, -1.3]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[1.5, 0.8, 0.1]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* VO2 Mask Display */}
      <mesh position={[0.5, -0.3, -1.25]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color={isActive ? "#00ff00" : "#666666"}
          emissive={isActive ? "#00ff00" : "#000000"}
          emissiveIntensity={isActive ? 0.8 : 0}
        />
      </mesh>

      {/* Data Visualization Points */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) dataPointsRef.current[i] = el; }}
          position={[-0.6 + i * 0.15, -0.5, -1.25]}
        >
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial
            color="#00ff00"
            emissive="#00ff00"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}

      {/* Handrails */}
      <mesh position={[-0.8, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 2, 8]} />
        <meshStandardMaterial color="#444444" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.8, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 2, 8]} />
        <meshStandardMaterial color="#444444" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Label */}
      <Text
        position={[0, -2.5, 0]}
        fontSize={0.15}
        color="#00ff00"
        anchorX="center"
        anchorY="middle"
      >
        VO2 MAX TESTING
      </Text>
    </group>
  );
};

// Force Plate
const ForcePlate = ({ position }: { position: [number, number, number] }) => {
  const forceIndicatorsRef = useRef<THREE.Mesh[]>([]);
  const [forceLevel, setForceLevel] = useState(0);

  useFrame((state) => {
    const newForce = (Math.sin(state.clock.elapsedTime * 1.5) + 1) / 2;
    setForceLevel(newForce);

    forceIndicatorsRef.current.forEach((indicator, i) => {
      if (indicator) {
        const threshold = i / 8;
        indicator.material.opacity = forceLevel > threshold ? 0.8 : 0.2;
        indicator.material.emissiveIntensity = forceLevel > threshold ? 1 : 0.1;
      }
    });
  });

  return (
    <group position={position}>
      {/* Main Plate */}
      <mesh position={[0, -1.95, 0]}>
        <boxGeometry args={[1.5, 0.1, 1.5]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Pressure Sensors Grid */}
      {Array.from({ length: 5 }).map((_, x) =>
        Array.from({ length: 5 }).map((_, z) => (
          <mesh
            key={`${x}-${z}`}
            position={[-0.6 + x * 0.3, -1.89, -0.6 + z * 0.3]}
          >
            <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
            <meshStandardMaterial
              color="#ff0000"
              emissive="#ff0000"
              emissiveIntensity={0.3}
              transparent
              opacity={0.6}
            />
          </mesh>
        ))
      )}

      {/* Force Indicators */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) forceIndicatorsRef.current[i] = el; }}
          position={[-0.8, -1.5 + i * 0.15, 0.8]}
        >
          <boxGeometry args={[0.08, 0.08, 0.02]} />
          <meshStandardMaterial
            color={i < 3 ? "#00ff00" : i < 6 ? "#ffff00" : "#ff0000"}
            emissive={i < 3 ? "#00ff00" : i < 6 ? "#ffff00" : "#ff0000"}
            emissiveIntensity={0.5}
            transparent
            opacity={0.2}
          />
        </mesh>
      ))}

      {/* Base Support */}
      <mesh position={[0, -2.3, 0]}>
        <boxGeometry args={[1.8, 0.5, 1.8]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Label */}
      <Text
        position={[0, -2.8, 0]}
        fontSize={0.15}
        color="#ff0000"
        anchorX="center"
        anchorY="middle"
      >
        FORCE PLATE
      </Text>
    </group>
  );
};

// Motion Capture Zone
const MotionCaptureZone = ({ position }: { position: [number, number, number] }) => {
  const camerasRef = useRef<THREE.Group[]>([]);
  const markerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    camerasRef.current.forEach((camera, i) => {
      if (camera) {
        camera.rotation.y = Math.sin(state.clock.elapsedTime + i) * 0.3;
      }
    });

    if (markerRef.current) {
      markerRef.current.position.x = Math.sin(state.clock.elapsedTime) * 1.5;
      markerRef.current.position.z = Math.cos(state.clock.elapsedTime * 0.7) * 1.5;
    }
  });

  return (
    <group position={position}>
      {/* Floor Grid */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, 4, 8, 8]} />
        <meshStandardMaterial
          color="#1a1a1a"
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Motion Capture Cameras */}
      {Array.from({ length: 4 }).map((_, i) => {
        const angle = (i / 4) * Math.PI * 2;
        return (
          <group
            key={i}
            ref={(el) => { if (el) camerasRef.current[i] = el; }}
            position={[Math.cos(angle) * 2.5, 1, Math.sin(angle) * 2.5]}
            rotation={[0, -angle + Math.PI / 2, 0]}
          >
            {/* Camera Body */}
            <mesh>
              <boxGeometry args={[0.15, 0.15, 0.2]} />
              <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Camera Lens */}
            <mesh position={[0, 0, 0.15]}>
              <cylinderGeometry args={[0.06, 0.06, 0.1, 16]} />
              <meshStandardMaterial
                color="#ff00ff"
                emissive="#ff00ff"
                emissiveIntensity={0.8}
              />
            </mesh>
            {/* IR Light */}
            <pointLight color="#ff00ff" intensity={0.5} distance={5} />
          </group>
        );
      })}

      {/* Motion Tracking Marker */}
      <mesh ref={markerRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color="#ff00ff"
          emissive="#ff00ff"
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* Tracking Trail */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.sin(Date.now() * 0.001 - i * 0.1) * 1.5,
            0,
            Math.cos(Date.now() * 0.0007 - i * 0.1) * 1.5
          ]}
        >
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial
            color="#ff00ff"
            emissive="#ff00ff"
            emissiveIntensity={0.8}
            transparent
            opacity={1 - i * 0.1}
          />
        </mesh>
      ))}

      {/* Label */}
      <Text
        position={[0, -2.5, 0]}
        fontSize={0.15}
        color="#ff00ff"
        anchorX="center"
        anchorY="middle"
      >
        MOTION CAPTURE
      </Text>
    </group>
  );
};

// Holographic Data Display
const HolographicDataDisplay = ({ position }: { position: [number, number, number] }) => {
  const dataRef = useRef<THREE.Group>(null);
  const [athleteData, setAthleteData] = useState({
    heartRate: 145,
    vo2: 52.3,
    power: 850,
    bodyFat: 8.2
  });

  useFrame((state) => {
    if (dataRef.current) {
      dataRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }

    // Simulate live data updates
    if (Math.random() < 0.02) {
      setAthleteData({
        heartRate: 140 + Math.random() * 20,
        vo2: 50 + Math.random() * 5,
        power: 800 + Math.random() * 100,
        bodyFat: 8 + Math.random() * 0.5
      });
    }
  });

  return (
    <group position={position} ref={dataRef}>
      {/* Holographic Frame */}
      <mesh>
        <boxGeometry args={[2, 3, 0.05]} />
        <meshStandardMaterial
          color="#00ffff"
          transparent
          opacity={0.1}
          emissive="#00ffff"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Data Displays */}
      <Text
        position={[0, 1.2, 0.1]}
        fontSize={0.25}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
      >
        ATHLETE METRICS
      </Text>

      <Text
        position={[-0.7, 0.6, 0.1]}
        fontSize={0.15}
        color="#ff0000"
        anchorX="left"
        anchorY="middle"
      >
        HR: {athleteData.heartRate.toFixed(0)} bpm
      </Text>

      <Text
        position={[-0.7, 0.2, 0.1]}
        fontSize={0.15}
        color="#00ff00"
        anchorX="left"
        anchorY="middle"
      >
        VO2: {athleteData.vo2.toFixed(1)} ml/kg/min
      </Text>

      <Text
        position={[-0.7, -0.2, 0.1]}
        fontSize={0.15}
        color="#ffff00"
        anchorX="left"
        anchorY="middle"
      >
        POWER: {athleteData.power.toFixed(0)} W
      </Text>

      <Text
        position={[-0.7, -0.6, 0.1]}
        fontSize={0.15}
        color="#00ffff"
        anchorX="left"
        anchorY="middle"
      >
        BF%: {athleteData.bodyFat.toFixed(1)}%
      </Text>

      {/* Animated Graph */}
      {Array.from({ length: 20 }).map((_, i) => {
        const height = Math.sin(Date.now() * 0.002 + i * 0.3) * 0.3 + 0.3;
        return (
          <mesh key={i} position={[-0.9 + i * 0.1, -1.2 + height / 2, 0.1]}>
            <boxGeometry args={[0.05, height, 0.02]} />
            <meshStandardMaterial
              color="#00ff00"
              emissive="#00ff00"
              emissiveIntensity={0.8}
            />
          </mesh>
        );
      })}

      {/* Holographic Particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 3,
            0.2
          ]}
        >
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={1}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
};

// 3D Body Model with Metrics
const BodyMetricsModel = ({ position }: { position: [number, number, number] }) => {
  const bodyRef = useRef<THREE.Group>(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanning(true);
      setTimeout(() => setScanning(false), 3000);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useFrame((state) => {
    if (bodyRef.current) {
      bodyRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group position={position} ref={bodyRef}>
      {/* Simplified Human Body Model */}
      {/* Head */}
      <mesh position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color={scanning ? "#00ffff" : "#666666"}
          emissive={scanning ? "#00ffff" : "#000000"}
          emissiveIntensity={scanning ? 0.5 : 0}
          wireframe
        />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[0.4, 0.8, 0.2]} />
        <meshStandardMaterial
          color={scanning ? "#00ffff" : "#666666"}
          emissive={scanning ? "#00ffff" : "#000000"}
          emissiveIntensity={scanning ? 0.5 : 0}
          wireframe
        />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.3, 0.9, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.05, 0.05, 0.6, 8]} />
        <meshStandardMaterial
          color={scanning ? "#00ffff" : "#666666"}
          emissive={scanning ? "#00ffff" : "#000000"}
          emissiveIntensity={scanning ? 0.5 : 0}
          wireframe
        />
      </mesh>
      <mesh position={[0.3, 0.9, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.05, 0.05, 0.6, 8]} />
        <meshStandardMaterial
          color={scanning ? "#00ffff" : "#666666"}
          emissive={scanning ? "#00ffff" : "#000000"}
          emissiveIntensity={scanning ? 0.5 : 0}
          wireframe
        />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.12, -0.2, 0]}>
        <cylinderGeometry args={[0.08, 0.06, 0.8, 8]} />
        <meshStandardMaterial
          color={scanning ? "#00ffff" : "#666666"}
          emissive={scanning ? "#00ffff" : "#000000"}
          emissiveIntensity={scanning ? 0.5 : 0}
          wireframe
        />
      </mesh>
      <mesh position={[0.12, -0.2, 0]}>
        <cylinderGeometry args={[0.08, 0.06, 0.8, 8]} />
        <meshStandardMaterial
          color={scanning ? "#00ffff" : "#666666"}
          emissive={scanning ? "#00ffff" : "#000000"}
          emissiveIntensity={scanning ? 0.5 : 0}
          wireframe
        />
      </mesh>

      {/* Measurement Points */}
      {[
        [0, 1.6, 0],      // Head
        [0.3, 0.9, 0],    // Shoulder
        [-0.3, 0.9, 0],   // Shoulder
        [0, 0.8, 0],      // Chest
        [0, 0.4, 0],      // Waist
        [0.12, -0.6, 0],  // Leg
        [-0.12, -0.6, 0]  // Leg
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial
            color="#ff0000"
            emissive="#ff0000"
            emissiveIntensity={scanning ? 1 : 0.3}
          />
        </mesh>
      ))}

      {/* Scanning Effect */}
      {scanning && (
        <mesh position={[0, Math.sin(Date.now() * 0.003) * 1.5, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.05, 32]} />
          <meshStandardMaterial
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={1.5}
            transparent
            opacity={0.4}
          />
        </mesh>
      )}
    </group>
  );
};

// Main Biometric Lab Component
export default function BiometricLab() {
  return (
    <group>
      {/* Room Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#ffffff" />
      <pointLight position={[5, 3, 5]} intensity={0.3} color="#00ffff" />
      <pointLight position={[-5, 3, -5]} intensity={0.3} color="#ff00ff" />

      {/* Testing Equipment */}
      <BodyScanner position={[-6, 2, -6]} />
      <VO2MaxStation position={[-6, 2, 0]} />
      <ForcePlate position={[-6, 2, 6]} />
      <MotionCaptureZone position={[0, 2, 0]} />

      {/* Data Displays */}
      <HolographicDataDisplay position={[6, 3, -6]} />
      <HolographicDataDisplay position={[6, 3, 0]} />
      <BodyMetricsModel position={[6, 1, 6]} />

      {/* Floor */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color="#0a0a0a"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Grid Lines */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20, 20, 20]} />
        <meshStandardMaterial
          color="#00ffff"
          wireframe
          transparent
          opacity={0.1}
        />
      </mesh>

      {/* Wall Panels */}
      {[-10, 10].map((x) => (
        <mesh key={`wall-x-${x}`} position={[x, 3, 0]} rotation={[0, x > 0 ? -Math.PI / 2 : Math.PI / 2, 0]}>
          <planeGeometry args={[20, 6]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}
      {[-10, 10].map((z) => (
        <mesh key={`wall-z-${z}`} position={[0, 3, z]} rotation={[0, z > 0 ? Math.PI : 0, 0]}>
          <planeGeometry args={[20, 6]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}

      {/* Ceiling */}
      <mesh position={[0, 6, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Ceiling Lights */}
      {Array.from({ length: 4 }).map((_, i) =>
        Array.from({ length: 4 }).map((_, j) => (
          <mesh
            key={`light-${i}-${j}`}
            position={[-7.5 + i * 5, 5.9, -7.5 + j * 5]}
          >
            <boxGeometry args={[0.8, 0.05, 0.8]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={0.5}
            />
          </mesh>
        ))
      )}

      {/* Lab Title */}
      <Text
        position={[0, 5.5, -9.9]}
        fontSize={0.5}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
      >
        BIOMETRIC TESTING LABORATORY
      </Text>

      {/* Status Indicators */}
      {['ACTIVE', 'CALIBRATED', 'READY'].map((status, i) => (
        <group key={status} position={[-8 + i * 3, 5, -9.8]}>
          <mesh>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial
              color="#00ff00"
              emissive="#00ff00"
              emissiveIntensity={1}
            />
          </mesh>
          <Text
            position={[0.5, 0, 0]}
            fontSize={0.15}
            color="#00ff00"
            anchorX="left"
            anchorY="middle"
          >
            {status}
          </Text>
        </group>
      ))}
    </group>
  );
}
