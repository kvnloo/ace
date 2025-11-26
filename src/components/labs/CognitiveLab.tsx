/**
 * CognitiveLab.tsx
 * Cognitive training lab with neural feedback, reaction testing, VR training pods, and eye tracking
 * Integrated from PR #6 with DebugContext support
 */

import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Types
interface CognitiveLabProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

// Neural Feedback Display Component
const NeuralFeedbackDisplay: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const meshRef = useRef<THREE.Group>(null);
  const [brainActivity, setBrainActivity] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBrainActivity(Array.from({ length: 8 }, () => Math.random()));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Display Screen */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[2.5, 1.8, 0.1]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Brain Activity Waves */}
      {brainActivity.map((activity, i) => (
        <group key={i} position={[-1 + i * 0.28, 1.5, 0.06]}>
          <mesh>
            <boxGeometry args={[0.15, activity * 1.2, 0.02]} />
            <meshStandardMaterial
              color={activity > 0.7 ? "#00ff88" : activity > 0.4 ? "#ffaa00" : "#4488ff"}
              emissive={activity > 0.7 ? "#00ff88" : activity > 0.4 ? "#ffaa00" : "#4488ff"}
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>
      ))}

      {/* Stand */}
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 1.5, 16]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Base */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.1, 32]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
};

// Reaction Time Testing Station
const ReactionTimeStation: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const [isActive, setIsActive] = useState(false);
  const targetRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsActive(Math.random() > 0.5);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useFrame((state) => {
    if (targetRef.current) {
      targetRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.1);
    }
    if (lightRef.current) {
      lightRef.current.intensity = isActive ? 2 : 0.5;
    }
  });

  return (
    <group position={position}>
      {/* Main Console */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.5, 1, 0.5]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Reaction Target */}
      <mesh ref={targetRef} position={[0, 1.5, 0.3]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color={isActive ? "#ff0044" : "#444444"}
          emissive={isActive ? "#ff0044" : "#000000"}
          emissiveIntensity={isActive ? 0.8 : 0}
        />
      </mesh>

      <pointLight ref={lightRef} position={[0, 1.5, 0.5]} color="#ff0044" distance={3} />

      {/* Response Buttons */}
      {[-0.5, 0, 0.5].map((x, i) => (
        <mesh key={i} position={[x, 0.54, 0.3]}>
          <boxGeometry args={[0.25, 0.08, 0.25]} />
          <meshStandardMaterial
            color={["#ff4444", "#44ff44", "#4444ff"][i]}
            emissive={["#ff4444", "#44ff44", "#4444ff"][i]}
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}

      {/* Display */}
      <mesh position={[0, 1.2, 0.26]}>
        <boxGeometry args={[1.2, 0.6, 0.05]} />
        <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
};

// VR Training Pod
const VRTrainingPod: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const podRef = useRef<THREE.Group>(null);
  const [doorOpen, setDoorOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setDoorOpen((prev) => !prev);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useFrame((state) => {
    if (podRef.current) {
      podRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.02;
    }
  });

  return (
    <group ref={podRef} position={position}>
      {/* Pod Shell */}
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[1.2, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#0a0a0a"
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Door */}
      <group rotation={[0, doorOpen ? -Math.PI / 2 : 0, 0]} position={[0, 1.2, 0]}>
        <mesh position={[0.6, 0, 0]}>
          <boxGeometry args={[0.1, 2, 1.2]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* Interior Seat */}
      <mesh position={[0, 0.7, 0]}>
        <boxGeometry args={[0.8, 0.3, 0.8]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      {/* VR Display Rings */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, 1.2 + i * 0.3, 0]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.9 - i * 0.15, 0.02, 16, 32]} />
          <meshStandardMaterial
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={0.5 - i * 0.1}
          />
        </mesh>
      ))}

      {/* Base Platform */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.2, 32]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Indicator Lights */}
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          position={[
            Math.cos(i * Math.PI / 2) * 1.3,
            0.2,
            Math.sin(i * Math.PI / 2) * 1.3
          ]}
        >
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial
            color={doorOpen ? "#00ff00" : "#ff0000"}
            emissive={doorOpen ? "#00ff00" : "#ff0000"}
            emissiveIntensity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
};

// Eye Tracking System
const EyeTrackingSystem: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const pupilRef = useRef<THREE.Mesh>(null);
  const [gazePoint, setGazePoint] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setGazePoint({
        x: (Math.random() - 0.5) * 0.3,
        y: (Math.random() - 0.5) * 0.3
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useFrame(() => {
    if (pupilRef.current) {
      pupilRef.current.position.x = THREE.MathUtils.lerp(
        pupilRef.current.position.x,
        gazePoint.x,
        0.1
      );
      pupilRef.current.position.y = THREE.MathUtils.lerp(
        pupilRef.current.position.y,
        gazePoint.y,
        0.1
      );
    }
  });

  return (
    <group position={position}>
      {/* Main Unit */}
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[1.2, 1.5, 0.4]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Eye Display */}
      <group position={[0, 1, 0.21]}>
        {/* Sclera */}
        <mesh>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>

        {/* Iris */}
        <mesh position={[0, 0, 0.2]}>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshStandardMaterial color="#0088ff" />
        </mesh>

        {/* Pupil */}
        <mesh ref={pupilRef} position={[0, 0, 0.22]}>
          <sphereGeometry args={[0.08, 32, 32]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      </group>

      {/* Tracking Grid */}
      <group position={[0, 0.5, 0.21]}>
        {[-0.4, -0.2, 0, 0.2, 0.4].map((x) =>
          [-0.3, -0.15, 0, 0.15, 0.3].map((y) => (
            <mesh key={`${x}-${y}`} position={[x, y, 0]}>
              <sphereGeometry args={[0.015, 8, 8]} />
              <meshStandardMaterial
                color="#00ffff"
                emissive="#00ffff"
                emissiveIntensity={0.3}
              />
            </mesh>
          ))
        )}
      </group>

      {/* Stand */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.5, 16]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.7} />
      </mesh>

      {/* Base */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} />
      </mesh>
    </group>
  );
};

// Main Cognitive Lab component
export const CognitiveLab: React.FC<CognitiveLabProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1
}) => {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Floor */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 15]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.8} />
      </mesh>

      {/* Neural Feedback Displays */}
      <NeuralFeedbackDisplay position={[-6, 0, -5]} />
      <NeuralFeedbackDisplay position={[6, 0, -5]} />

      {/* Reaction Time Stations */}
      <ReactionTimeStation position={[-3, 0, 0]} />
      <ReactionTimeStation position={[3, 0, 0]} />

      {/* VR Training Pods */}
      <VRTrainingPod position={[-5, 0, 5]} />
      <VRTrainingPod position={[0, 0, 5]} />
      <VRTrainingPod position={[5, 0, 5]} />

      {/* Eye Tracking System */}
      <EyeTrackingSystem position={[0, 0, -5]} />

      {/* Ambient lighting */}
      <pointLight
        position={[0, 5, 0]}
        intensity={0.5}
        color="#4488ff"
        distance={25}
        decay={2}
      />
      <pointLight
        position={[-5, 3, 5]}
        intensity={0.4}
        color="#00ffff"
        distance={10}
        decay={2}
      />
      <pointLight
        position={[5, 3, 5]}
        intensity={0.4}
        color="#00ffff"
        distance={10}
        decay={2}
      />
    </group>
  );
};

export default CognitiveLab;
