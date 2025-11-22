import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text, Grid, Line } from '@react-three/drei';
import * as THREE from 'three';

// Force Plate Component - embedded in floor with sensor visualization
function ForcePlate({ position }: { position: [number, number, number] }) {
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
}

// Motion Capture Camera Component
function MotionCaptureCamera({ position, lookAt }: { position: [number, number, number], lookAt: [number, number, number] }) {
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
}

// Skeletal Joint Component
function SkeletalJoint({ position, size = 0.04, active = false }: {
  position: [number, number, number],
  size?: number,
  active?: boolean
}) {
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
}

// Skeletal Bone Component
function SkeletalBone({ start, end, color = "#0088ff" }: {
  start: [number, number, number],
  end: [number, number, number],
  color?: string
}) {
  return (
    <Line
      points={[start, end]}
      color={color}
      lineWidth={2}
      transparent
      opacity={0.8}
    />
  );
}

// Animated Athlete Skeleton - demonstrating proper form
function AthleteSkeletonDemo({ animationPhase = 0 }: { animationPhase?: number }) {
  const baseY = 0.1;
  const centerX = 0;
  const centerZ = 0;

  // Calculate joint positions based on animation phase (squat motion)
  const t = animationPhase;
  const squatDepth = Math.sin(t) * 0.4; // 0 to 0.4 meters squat

  // Joint positions
  const head = [centerX, baseY + 1.7 - squatDepth * 0.3, centerZ] as [number, number, number];
  const neck = [centerX, baseY + 1.5 - squatDepth * 0.3, centerZ] as [number, number, number];
  const chest = [centerX, baseY + 1.2 - squatDepth * 0.4, centerZ] as [number, number, number];
  const hips = [centerX, baseY + 0.9 - squatDepth, centerZ] as [number, number, number];

  // Left arm
  const leftShoulder = [centerX - 0.2, baseY + 1.35 - squatDepth * 0.35, centerZ] as [number, number, number];
  const leftElbow = [centerX - 0.35, baseY + 1.0 - squatDepth * 0.4, centerZ + 0.1] as [number, number, number];
  const leftHand = [centerX - 0.3, baseY + 0.7 - squatDepth * 0.5, centerZ + 0.15] as [number, number, number];

  // Right arm
  const rightShoulder = [centerX + 0.2, baseY + 1.35 - squatDepth * 0.35, centerZ] as [number, number, number];
  const rightElbow = [centerX + 0.35, baseY + 1.0 - squatDepth * 0.4, centerZ + 0.1] as [number, number, number];
  const rightHand = [centerX + 0.3, baseY + 0.7 - squatDepth * 0.5, centerZ + 0.15] as [number, number, number];

  // Left leg
  const leftHip = [centerX - 0.1, baseY + 0.9 - squatDepth, centerZ] as [number, number, number];
  const leftKnee = [centerX - 0.12, baseY + 0.45 - squatDepth * 0.7, centerZ + 0.15] as [number, number, number];
  const leftAnkle = [centerX - 0.1, baseY + 0.08, centerZ + 0.1] as [number, number, number];
  const leftFoot = [centerX - 0.1, baseY + 0.03, centerZ + 0.25] as [number, number, number];

  // Right leg
  const rightHip = [centerX + 0.1, baseY + 0.9 - squatDepth, centerZ] as [number, number, number];
  const rightKnee = [centerX + 0.12, baseY + 0.45 - squatDepth * 0.7, centerZ + 0.15] as [number, number, number];
  const rightAnkle = [centerX + 0.1, baseY + 0.08, centerZ + 0.1] as [number, number, number];
  const rightFoot = [centerX + 0.1, baseY + 0.03, centerZ + 0.25] as [number, number, number];

  // Highlight active joints (knees and hips during squat)
  const activeJoints = [leftKnee, rightKnee, leftHip, rightHip];

  return (
    <group>
      {/* Torso bones */}
      <SkeletalBone start={head} end={neck} color="#00ffaa" />
      <SkeletalBone start={neck} end={chest} color="#00ffaa" />
      <SkeletalBone start={chest} end={hips} color="#00ffaa" />

      {/* Left arm bones */}
      <SkeletalBone start={chest} end={leftShoulder} />
      <SkeletalBone start={leftShoulder} end={leftElbow} />
      <SkeletalBone start={leftElbow} end={leftHand} />

      {/* Right arm bones */}
      <SkeletalBone start={chest} end={rightShoulder} />
      <SkeletalBone start={rightShoulder} end={rightElbow} />
      <SkeletalBone start={rightElbow} end={rightHand} />

      {/* Left leg bones */}
      <SkeletalBone start={hips} end={leftHip} color="#ff6600" />
      <SkeletalBone start={leftHip} end={leftKnee} color="#ff6600" />
      <SkeletalBone start={leftKnee} end={leftAnkle} color="#ff6600" />
      <SkeletalBone start={leftAnkle} end={leftFoot} color="#ff6600" />

      {/* Right leg bones */}
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
}

// Biomechanical Analysis Display Panel
function AnalysisPanel({ position, rotation }: {
  position: [number, number, number],
  rotation?: [number, number, number]
}) {
  const [time, setTime] = React.useState(0);

  useFrame((state) => {
    setTime(state.clock.getElapsedTime());
  });

  // Simulated metrics
  const kneeAngle = Math.floor(90 + Math.sin(time * 2) * 30);
  const hipAngle = Math.floor(110 + Math.sin(time * 2) * 25);
  const forceLeft = Math.floor(450 + Math.sin(time * 2) * 200);
  const forceRight = Math.floor(470 + Math.sin(time * 2) * 190);
  const balance = Math.floor(50 + Math.sin(time * 3) * 8);

  return (
    <group position={position} rotation={rotation}>
      {/* Panel background */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[1.8, 2.4]} />
        <meshStandardMaterial
          color="#0a0a0a"
          transparent
          opacity={0.9}
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>

      {/* Border */}
      <mesh position={[0, 0, -0.005]}>
        <planeGeometry args={[1.82, 2.42]} />
        <meshStandardMaterial
          color="#00ffaa"
          transparent
          opacity={0.3}
          wireframe
        />
      </mesh>

      {/* Title */}
      <Text
        position={[0, 1.05, 0]}
        fontSize={0.1}
        color="#00ffaa"
        anchorX="center"
        anchorY="middle"
      >
        BIOMECHANICAL ANALYSIS
      </Text>

      {/* Metrics */}
      <Text
        position={[-0.7, 0.75, 0]}
        fontSize={0.06}
        color="#ffffff"
        anchorX="left"
        anchorY="middle"
      >
        KNEE ANGLE (L/R)
      </Text>
      <Text
        position={[0.7, 0.75, 0]}
        fontSize={0.08}
        color="#00ffaa"
        anchorX="right"
        anchorY="middle"
      >
        {kneeAngle}°
      </Text>

      <Text
        position={[-0.7, 0.5, 0]}
        fontSize={0.06}
        color="#ffffff"
        anchorX="left"
        anchorY="middle"
      >
        HIP ANGLE
      </Text>
      <Text
        position={[0.7, 0.5, 0]}
        fontSize={0.08}
        color="#00ffaa"
        anchorX="right"
        anchorY="middle"
      >
        {hipAngle}°
      </Text>

      <Text
        position={[-0.7, 0.2, 0]}
        fontSize={0.06}
        color="#ffffff"
        anchorX="left"
        anchorY="middle"
      >
        FORCE LEFT
      </Text>
      <Text
        position={[0.7, 0.2, 0]}
        fontSize={0.08}
        color="#ff6600"
        anchorX="right"
        anchorY="middle"
      >
        {forceLeft}N
      </Text>

      <Text
        position={[-0.7, -0.05, 0]}
        fontSize={0.06}
        color="#ffffff"
        anchorX="left"
        anchorY="middle"
      >
        FORCE RIGHT
      </Text>
      <Text
        position={[0.7, -0.05, 0]}
        fontSize={0.08}
        color="#ff6600"
        anchorX="right"
        anchorY="middle"
      >
        {forceRight}N
      </Text>

      <Text
        position={[-0.7, -0.35, 0]}
        fontSize={0.06}
        color="#ffffff"
        anchorX="left"
        anchorY="middle"
      >
        BALANCE
      </Text>
      <Text
        position={[0.7, -0.35, 0]}
        fontSize={0.08}
        color="#0088ff"
        anchorX="right"
        anchorY="middle"
      >
        {balance}%
      </Text>

      {/* Status indicator */}
      <Text
        position={[0, -0.75, 0]}
        fontSize={0.07}
        color={kneeAngle > 85 && kneeAngle < 95 ? "#00ff00" : "#ffaa00"}
        anchorX="center"
        anchorY="middle"
      >
        {kneeAngle > 85 && kneeAngle < 95 ? "OPTIMAL FORM" : "ADJUST DEPTH"}
      </Text>

      {/* Form coaching */}
      <Text
        position={[0, -1.0, 0]}
        fontSize={0.05}
        color="#aaaaaa"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.6}
        textAlign="center"
      >
        Keep knees aligned over toes{'\n'}Maintain neutral spine position
      </Text>
    </group>
  );
}

// Coaching Screen Component
function CoachingScreen({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Screen frame */}
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[3.2, 1.8, 0.08]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Screen display */}
      <mesh>
        <planeGeometry args={[3, 1.6]} />
        <meshStandardMaterial
          color="#0a0a1a"
          emissive="#001133"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Screen content */}
      <Text
        position={[0, 0.6, 0.01]}
        fontSize={0.12}
        color="#00ffaa"
        anchorX="center"
        anchorY="middle"
      >
        SQUAT FORM ANALYSIS
      </Text>

      <Text
        position={[0, 0.3, 0.01]}
        fontSize={0.08}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Session: Strength & Conditioning
      </Text>

      <Text
        position={[0, 0, 0.01]}
        fontSize={0.07}
        color="#aaaaaa"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.8}
        textAlign="center"
      >
        Real-time motion capture tracking 23 key points{'\n'}
        4 force plates measuring ground reaction forces{'\n'}
        AI-powered form correction and injury prevention
      </Text>

      {/* Stats bar */}
      <mesh position={[0, -0.6, 0.01]}>
        <planeGeometry args={[2.8, 0.3]} />
        <meshStandardMaterial color="#0a2a1a" transparent opacity={0.6} />
      </mesh>

      <Text
        position={[-1.2, -0.6, 0.02]}
        fontSize={0.06}
        color="#00ffaa"
        anchorX="left"
        anchorY="middle"
      >
        REPS: 8/10
      </Text>

      <Text
        position={[0, -0.6, 0.02]}
        fontSize={0.06}
        color="#0088ff"
        anchorX="center"
        anchorY="middle"
      >
        FORM: 94%
      </Text>

      <Text
        position={[1.2, -0.6, 0.02]}
        fontSize={0.06}
        color="#ff6600"
        anchorX="right"
        anchorY="middle"
      >
        POWER: 850W
      </Text>
    </group>
  );
}

// Main Studio Scene
function StudioScene() {
  const [animationTime, setAnimationTime] = React.useState(0);

  useFrame((state) => {
    setAnimationTime(state.clock.getElapsedTime() * 0.8);
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} castShadow />
      <directionalLight position={[-10, 10, -5]} intensity={0.3} />
      <pointLight position={[0, 3, 0]} intensity={0.4} color="#00ffaa" />

      {/* Studio floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Floor grid */}
      <Grid
        args={[12, 12]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#00ffaa"
        sectionSize={2}
        sectionThickness={1}
        sectionColor="#0088ff"
        fadeDistance={15}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={false}
        position={[0, 0.01, 0]}
      />

      {/* Force plates - 2x2 grid */}
      <ForcePlate position={[-0.6, 0, -0.6]} />
      <ForcePlate position={[0.6, 0, -0.6]} />
      <ForcePlate position={[-0.6, 0, 0.6]} />
      <ForcePlate position={[0.6, 0, 0.6]} />

      {/* Motion capture cameras - positioned around the capture volume */}
      <MotionCaptureCamera position={[3, 2.5, 3]} lookAt={[0, 1, 0]} />
      <MotionCaptureCamera position={[-3, 2.5, 3]} lookAt={[0, 1, 0]} />
      <MotionCaptureCamera position={[3, 2.5, -3]} lookAt={[0, 1, 0]} />
      <MotionCaptureCamera position={[-3, 2.5, -3]} lookAt={[0, 1, 0]} />
      <MotionCaptureCamera position={[0, 3.5, 4]} lookAt={[0, 1, 0]} />
      <MotionCaptureCamera position={[0, 3.5, -4]} lookAt={[0, 1, 0]} />

      {/* Camera mounts/poles */}
      {[
        [3, 0, 3],
        [-3, 0, 3],
        [3, 0, -3],
        [-3, 0, -3]
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.04, 0.04, 2.5, 16]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}

      {/* Animated athlete skeleton */}
      <AthleteSkeletonDemo animationPhase={animationTime} />

      {/* Biomechanical analysis displays */}
      <AnalysisPanel
        position={[-4.5, 1.5, 0]}
        rotation={[0, Math.PI / 4, 0]}
      />
      <AnalysisPanel
        position={[4.5, 1.5, 0]}
        rotation={[0, -Math.PI / 4, 0]}
      />

      {/* Main coaching screen */}
      <CoachingScreen position={[0, 1.8, -5]} />

      {/* Studio info labels */}
      <Text
        position={[0, 3.5, -5.5]}
        fontSize={0.15}
        color="#00ffaa"
        anchorX="center"
        anchorY="middle"
      >
        APEX MOVEMENT ANALYSIS STUDIO
      </Text>

      <Text
        position={[0, 3.2, -5.5]}
        fontSize={0.08}
        color="#aaaaaa"
        anchorX="center"
        anchorY="middle"
      >
        3D Motion Capture • Force Analysis • AI Coaching
      </Text>

      {/* Capture volume visualization */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[4, 2.4, 4]} />
        <meshStandardMaterial
          color="#00ffaa"
          transparent
          opacity={0.05}
          wireframe
        />
      </mesh>
    </>
  );
}

// Main Component
export default function MovementStudio() {
  return (
    <div style={{ width: '100%', height: '100vh', background: '#000000' }}>
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[6, 4, 8]} fov={60} />
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={3}
          maxDistance={15}
          maxPolarAngle={Math.PI / 2}
          target={[0, 1, 0]}
        />
        <StudioScene />
      </Canvas>

      {/* UI Overlay */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        color: '#00ffaa',
        fontFamily: 'monospace',
        fontSize: '14px',
        background: 'rgba(0, 0, 0, 0.7)',
        padding: '15px',
        borderRadius: '8px',
        border: '1px solid #00ffaa'
      }}>
        <div style={{ marginBottom: '10px', fontSize: '16px', fontWeight: 'bold' }}>
          MOVEMENT STUDIO ACTIVE
        </div>
        <div style={{ marginBottom: '5px' }}>
          ▸ 6 Motion Capture Cameras Online
        </div>
        <div style={{ marginBottom: '5px' }}>
          ▸ 4 Force Plates Calibrated
        </div>
        <div style={{ marginBottom: '5px' }}>
          ▸ 23 Body Markers Tracked
        </div>
        <div style={{ marginBottom: '5px', color: '#ffffff' }}>
          ▸ Real-time Analysis: <span style={{ color: '#00ff00' }}>ACTIVE</span>
        </div>
      </div>

      {/* Performance metrics */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        right: 20,
        color: '#00ffaa',
        fontFamily: 'monospace',
        fontSize: '12px',
        background: 'rgba(0, 0, 0, 0.7)',
        padding: '15px',
        borderRadius: '8px',
        border: '1px solid #0088ff'
      }}>
        <div style={{ marginBottom: '8px', color: '#0088ff', fontWeight: 'bold' }}>
          SYSTEM STATUS
        </div>
        <div style={{ marginBottom: '5px' }}>
          Tracking Accuracy: <span style={{ color: '#00ff00' }}>99.2%</span>
        </div>
        <div style={{ marginBottom: '5px' }}>
          Latency: <span style={{ color: '#00ff00' }}>8ms</span>
        </div>
        <div style={{ marginBottom: '5px' }}>
          Frame Rate: <span style={{ color: '#00ff00' }}>120 FPS</span>
        </div>
        <div>
          AI Confidence: <span style={{ color: '#00ffaa' }}>96%</span>
        </div>
      </div>
    </div>
  );
}
