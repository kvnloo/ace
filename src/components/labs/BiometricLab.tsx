/**
 * BiometricLab.tsx
 * Biometric analysis lab with body scanning, VO2 max testing, force plates, and motion capture
 * Integrated from PR #6 with DebugContext support
 */

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Types
interface BiometricLabProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

// Body Composition Scanner
const BodyScanner: React.FC<{ position: [number, number, number] }> = ({ position }) => {
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
      (scanBeamRef.current.material as THREE.MeshStandardMaterial).opacity = Math.sin(scanProgress * Math.PI) * 0.6;
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
    </group>
  );
};

// VO2 Max Testing Equipment
const VO2MaxStation: React.FC<{ position: [number, number, number] }> = ({ position }) => {
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
        (point.material as THREE.MeshStandardMaterial).emissiveIntensity =
          0.5 + Math.sin(state.clock.elapsedTime * 3 + i) * 0.5;
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
    </group>
  );
};

// Force Plate
const ForcePlate: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const forceIndicatorsRef = useRef<THREE.Mesh[]>([]);
  const [forceLevel, setForceLevel] = useState(0);

  useFrame((state) => {
    const newForce = (Math.sin(state.clock.elapsedTime * 1.5) + 1) / 2;
    setForceLevel(newForce);

    forceIndicatorsRef.current.forEach((indicator, i) => {
      if (indicator) {
        const threshold = i / 8;
        (indicator.material as THREE.MeshStandardMaterial).opacity = forceLevel > threshold ? 0.8 : 0.2;
        (indicator.material as THREE.MeshStandardMaterial).emissiveIntensity = forceLevel > threshold ? 1 : 0.1;
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
    </group>
  );
};

// Motion Capture Zone
const MotionCaptureZone: React.FC<{ position: [number, number, number] }> = ({ position }) => {
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

  // Camera positions around the capture zone
  const cameraPositions: [number, number, number][] = [
    [-3, 2, -3], [3, 2, -3], [-3, 2, 3], [3, 2, 3],
    [0, 3, -3], [0, 3, 3], [-3, 3, 0], [3, 3, 0]
  ];

  return (
    <group position={position}>
      {/* Floor Grid */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, 4]} />
        <meshStandardMaterial
          color="#1a1a1a"
          wireframe
        />
      </mesh>

      {/* Capture volume boundary */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4, 4, 4]} />
        <meshBasicMaterial
          color="#00ffff"
          wireframe
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Motion capture cameras */}
      {cameraPositions.map((pos, i) => (
        <group
          key={i}
          ref={(el) => { if (el) camerasRef.current[i] = el; }}
          position={pos}
        >
          {/* Camera body */}
          <mesh>
            <boxGeometry args={[0.15, 0.15, 0.2]} />
            <meshStandardMaterial color="#2a2a2a" metalness={0.7} />
          </mesh>
          {/* Lens */}
          <mesh position={[0, 0, 0.12]}>
            <cylinderGeometry args={[0.05, 0.06, 0.06, 16]} />
            <meshStandardMaterial color="#0a0a0a" metalness={0.9} />
          </mesh>
          {/* LED indicator */}
          <mesh position={[0, 0.08, 0]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial
              color="#ff0033"
              emissive="#ff0033"
              emissiveIntensity={0.8}
            />
          </mesh>
        </group>
      ))}

      {/* Moving marker (demonstrating tracking) */}
      <mesh ref={markerRef} position={[0, -1, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={1}
        />
      </mesh>
    </group>
  );
};

// Main Biometric Lab component
export const BiometricLab: React.FC<BiometricLabProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1
}) => {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Floor */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[25, 20]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.8} />
      </mesh>

      {/* Body Scanner Station */}
      <BodyScanner position={[-8, 0, -5]} />

      {/* VO2 Max Testing */}
      <VO2MaxStation position={[0, 0, -5]} />

      {/* Force Plates */}
      <ForcePlate position={[8, 0, -5]} />

      {/* Motion Capture Zone */}
      <MotionCaptureZone position={[0, 0, 5]} />

      {/* Ambient lighting */}
      <pointLight
        position={[0, 5, 0]}
        intensity={0.5}
        color="#4488ff"
        distance={30}
        decay={2}
      />
      <pointLight
        position={[-8, 3, -5]}
        intensity={0.4}
        color="#00ffff"
        distance={10}
        decay={2}
      />
      <pointLight
        position={[0, 3, -5]}
        intensity={0.4}
        color="#00ff00"
        distance={10}
        decay={2}
      />
    </group>
  );
};

export default BiometricLab;
