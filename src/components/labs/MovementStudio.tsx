/**
 * MovementStudio.tsx
 * Movement analysis studio with force plates, motion capture cameras, and skeletal tracking
 * Integrated from PR #6 with DebugContext support
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

// Types
interface MovementStudioProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

// Force Plate Component
const ForcePlate: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const sensorRefs = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Animate sensor pressure visualization
    sensorRefs.current.forEach((sensor, i) => {
      if (sensor) {
        const offset = i * 0.5;
        const intensity = Math.abs(Math.sin(time * 2 + offset)) * 0.3 + 0.7;
        (sensor.material as THREE.MeshStandardMaterial).emissive.setRGB(
          0.2 * intensity,
          0.8 * intensity,
          0.3 * intensity
        );
        (sensor.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
      }
    });
  });

  return (
    <group position={position}>
      {/* Main plate */}
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <boxGeometry args={[1.2, 1.2, 0.05]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Corner sensors */}
      {[
        [-0.5, 0.03, -0.5],
        [0.5, 0.03, -0.5],
        [-0.5, 0.03, 0.5],
        [0.5, 0.03, 0.5]
      ].map((pos, i) => (
        <mesh
          key={i}
          position={pos as [number, number, number]}
          ref={(el) => { if (el) sensorRefs.current[i] = el; }}
        >
          <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
          <meshStandardMaterial
            color="#00ff66"
            emissive="#00ff66"
            emissiveIntensity={0.7}
            metalness={0.5}
            roughness={0.3}
          />
        </mesh>
      ))}

      {/* Pressure visualization grid */}
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.1, 1.1, 8, 8]} />
        <meshStandardMaterial
          color="#00ff66"
          transparent
          opacity={0.15}
          wireframe
        />
      </mesh>
    </group>
  );
};

// Motion Capture Camera Component
const MotionCaptureCamera: React.FC<{
  position: [number, number, number];
  lookAt: [number, number, number]
}> = ({ position, lookAt }) => {
  const cameraRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Pulsing indicator light
    if (lightRef.current) {
      const pulse = Math.sin(time * 3) * 0.5 + 0.5;
      (lightRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5 + pulse * 0.5;
    }

    // Subtle tracking movement
    if (cameraRef.current) {
      cameraRef.current.rotation.y = Math.sin(time * 0.5) * 0.1;
    }
  });

  // Calculate direction to lookAt point
  const direction = useMemo(() => {
    const dir = new THREE.Vector3(
      lookAt[0] - position[0],
      lookAt[1] - position[1],
      lookAt[2] - position[2]
    ).normalize();
    return dir;
  }, [position, lookAt]);

  return (
    <group ref={cameraRef} position={position}>
      {/* Camera body */}
      <mesh rotation={[0, Math.atan2(direction.x, direction.z), 0]} castShadow>
        <boxGeometry args={[0.15, 0.15, 0.25]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Lens */}
      <mesh position={[0, 0, 0.15]} rotation={[0, Math.atan2(direction.x, direction.z), 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.08, 16]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Recording indicator */}
      <mesh ref={lightRef} position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshStandardMaterial
          color="#ff0033"
          emissive="#ff0033"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Mount bracket */}
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.1, 16]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
};

// Skeletal Joint Component
const SkeletalJoint: React.FC<{
  position: [number, number, number];
  size?: number;
  active?: boolean;
}> = ({ position, size = 0.04, active = false }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && active) {
      const time = state.clock.getElapsedTime();
      const pulse = Math.sin(time * 5) * 0.2 + 0.8;
      meshRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial
        color={active ? "#00ffaa" : "#0088ff"}
        emissive={active ? "#00ffaa" : "#0088ff"}
        emissiveIntensity={active ? 0.8 : 0.5}
        metalness={0.3}
        roughness={0.4}
      />
    </mesh>
  );
};

// Skeletal Bone Component
const SkeletalBone: React.FC<{
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
}> = ({ start, end, color = "#0088ff" }) => {
  return (
    <Line
      points={[start, end]}
      color={color}
      lineWidth={2}
      transparent
      opacity={0.8}
    />
  );
};

// Animated Athlete Skeleton
const AthleteSkeletonDemo: React.FC<{ animationPhase: number }> = ({ animationPhase }) => {
  const baseY = 0.1;
  const centerX = 0;
  const centerZ = 0;

  // Calculate joint positions based on animation phase (squat motion)
  const t = animationPhase;
  const squatDepth = Math.sin(t) * 0.4;

  // Joint positions
  const head: [number, number, number] = [centerX, baseY + 1.7 - squatDepth * 0.3, centerZ];
  const neck: [number, number, number] = [centerX, baseY + 1.5 - squatDepth * 0.3, centerZ];
  const chest: [number, number, number] = [centerX, baseY + 1.2 - squatDepth * 0.4, centerZ];
  const hips: [number, number, number] = [centerX, baseY + 0.9 - squatDepth, centerZ];

  // Arms
  const leftShoulder: [number, number, number] = [centerX - 0.2, baseY + 1.35 - squatDepth * 0.35, centerZ];
  const leftElbow: [number, number, number] = [centerX - 0.35, baseY + 1.0 - squatDepth * 0.4, centerZ + 0.1];
  const leftHand: [number, number, number] = [centerX - 0.3, baseY + 0.7 - squatDepth * 0.5, centerZ + 0.15];
  const rightShoulder: [number, number, number] = [centerX + 0.2, baseY + 1.35 - squatDepth * 0.35, centerZ];
  const rightElbow: [number, number, number] = [centerX + 0.35, baseY + 1.0 - squatDepth * 0.4, centerZ + 0.1];
  const rightHand: [number, number, number] = [centerX + 0.3, baseY + 0.7 - squatDepth * 0.5, centerZ + 0.15];

  // Legs
  const leftHip: [number, number, number] = [centerX - 0.1, baseY + 0.9 - squatDepth, centerZ];
  const leftKnee: [number, number, number] = [centerX - 0.12, baseY + 0.45 - squatDepth * 0.7, centerZ + 0.15];
  const leftAnkle: [number, number, number] = [centerX - 0.1, baseY + 0.08, centerZ + 0.1];
  const leftFoot: [number, number, number] = [centerX - 0.1, baseY + 0.03, centerZ + 0.25];
  const rightHip: [number, number, number] = [centerX + 0.1, baseY + 0.9 - squatDepth, centerZ];
  const rightKnee: [number, number, number] = [centerX + 0.12, baseY + 0.45 - squatDepth * 0.7, centerZ + 0.15];
  const rightAnkle: [number, number, number] = [centerX + 0.1, baseY + 0.08, centerZ + 0.1];
  const rightFoot: [number, number, number] = [centerX + 0.1, baseY + 0.03, centerZ + 0.25];

  return (
    <group>
      {/* Torso bones */}
      <SkeletalBone start={head} end={neck} color="#00ffaa" />
      <SkeletalBone start={neck} end={chest} color="#00ffaa" />
      <SkeletalBone start={chest} end={hips} color="#00ffaa" />

      {/* Left arm */}
      <SkeletalBone start={chest} end={leftShoulder} />
      <SkeletalBone start={leftShoulder} end={leftElbow} />
      <SkeletalBone start={leftElbow} end={leftHand} />

      {/* Right arm */}
      <SkeletalBone start={chest} end={rightShoulder} />
      <SkeletalBone start={rightShoulder} end={rightElbow} />
      <SkeletalBone start={rightElbow} end={rightHand} />

      {/* Left leg */}
      <SkeletalBone start={hips} end={leftHip} color="#ff6600" />
      <SkeletalBone start={leftHip} end={leftKnee} color="#ff6600" />
      <SkeletalBone start={leftKnee} end={leftAnkle} color="#ff6600" />
      <SkeletalBone start={leftAnkle} end={leftFoot} color="#ff6600" />

      {/* Right leg */}
      <SkeletalBone start={hips} end={rightHip} color="#ff6600" />
      <SkeletalBone start={rightHip} end={rightKnee} color="#ff6600" />
      <SkeletalBone start={rightKnee} end={rightAnkle} color="#ff6600" />
      <SkeletalBone start={rightAnkle} end={rightFoot} color="#ff6600" />

      {/* Joints */}
      <SkeletalJoint position={head} size={0.08} />
      <SkeletalJoint position={neck} />
      <SkeletalJoint position={chest} />
      <SkeletalJoint position={hips} size={0.06} />
      <SkeletalJoint position={leftShoulder} />
      <SkeletalJoint position={leftElbow} />
      <SkeletalJoint position={leftHand} />
      <SkeletalJoint position={rightShoulder} />
      <SkeletalJoint position={rightElbow} />
      <SkeletalJoint position={rightHand} />
      <SkeletalJoint position={leftHip} active />
      <SkeletalJoint position={leftKnee} active size={0.05} />
      <SkeletalJoint position={leftAnkle} />
      <SkeletalJoint position={leftFoot} size={0.03} />
      <SkeletalJoint position={rightHip} active />
      <SkeletalJoint position={rightKnee} active size={0.05} />
      <SkeletalJoint position={rightAnkle} />
      <SkeletalJoint position={rightFoot} size={0.03} />
    </group>
  );
};

// Analysis Display Panel
const AnalysisPanel: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
}> = ({ position, rotation = [0, 0, 0] }) => {
  const [time, setTime] = React.useState(0);

  useFrame((state) => {
    setTime(state.clock.getElapsedTime());
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Panel background */}
      <mesh>
        <boxGeometry args={[2, 1.5, 0.1]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Screen */}
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[1.9, 1.4]} />
        <meshStandardMaterial
          color="#0a1a2a"
          emissive="#0066ff"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Simulated data bars */}
      {[-0.6, -0.2, 0.2, 0.6].map((x, i) => {
        const height = 0.3 + Math.sin(time * 2 + i) * 0.2;
        return (
          <mesh key={i} position={[x, -0.4 + height / 2, 0.07]}>
            <boxGeometry args={[0.2, height, 0.02]} />
            <meshStandardMaterial
              color={["#00ff88", "#ffaa00", "#ff4488", "#44aaff"][i]}
              emissive={["#00ff88", "#ffaa00", "#ff4488", "#44aaff"][i]}
              emissiveIntensity={0.5}
            />
          </mesh>
        );
      })}
    </group>
  );
};

// Main Movement Studio component
export const MovementStudio: React.FC<MovementStudioProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1
}) => {
  const [animationPhase, setAnimationPhase] = React.useState(0);

  useFrame((state) => {
    setAnimationPhase(state.clock.getElapsedTime());
  });

  // Camera positions around the capture zone
  const cameraPositions: [number, number, number][] = [
    [-4, 2.5, -4], [4, 2.5, -4], [-4, 2.5, 4], [4, 2.5, 4],
    [0, 3.5, -4], [0, 3.5, 4], [-4, 3.5, 0], [4, 3.5, 0]
  ];

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Floor */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[15, 15]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.8} />
      </mesh>

      {/* Force Plates */}
      <ForcePlate position={[-2, 0, 0]} />
      <ForcePlate position={[0, 0, 0]} />
      <ForcePlate position={[2, 0, 0]} />

      {/* Motion Capture Cameras */}
      {cameraPositions.map((pos, i) => (
        <MotionCaptureCamera key={i} position={pos} lookAt={[0, 1, 0]} />
      ))}

      {/* Animated Skeleton Demo */}
      <group position={[0, 0, 0]}>
        <AthleteSkeletonDemo animationPhase={animationPhase} />
      </group>

      {/* Analysis Panels */}
      <AnalysisPanel position={[-6, 1.5, 0]} rotation={[0, Math.PI / 4, 0]} />
      <AnalysisPanel position={[6, 1.5, 0]} rotation={[0, -Math.PI / 4, 0]} />

      {/* Capture volume indicator */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[6, 3, 6]} />
        <meshBasicMaterial
          color="#00ffff"
          wireframe
          transparent
          opacity={0.1}
        />
      </mesh>

      {/* Ambient lighting */}
      <pointLight
        position={[0, 5, 0]}
        intensity={0.6}
        color="#ffffff"
        distance={20}
        decay={2}
      />
      <pointLight
        position={[0, 2, 0]}
        intensity={0.3}
        color="#0088ff"
        distance={10}
        decay={2}
      />
    </group>
  );
};

export default MovementStudio;
