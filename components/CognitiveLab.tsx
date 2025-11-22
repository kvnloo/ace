import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text, RoundedBox, Sphere, Cylinder, Box } from '@react-three/drei';
import * as THREE from 'three';

// Neural Feedback Display Component
function NeuralFeedbackDisplay({ position }: { position: [number, number, number] }) {
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
      <RoundedBox args={[2.5, 1.8, 0.1]} radius={0.05} position={[0, 1.5, 0]}>
        <meshStandardMaterial color="#0a0a0a" metalness={0.8} roughness={0.2} />
      </RoundedBox>

      {/* Brain Activity Waves */}
      {brainActivity.map((activity, i) => (
        <group key={i} position={[-1 + i * 0.28, 1.5, 0.06]}>
          <Box args={[0.15, activity * 1.2, 0.02]}>
            <meshStandardMaterial
              color={activity > 0.7 ? "#00ff88" : activity > 0.4 ? "#ffaa00" : "#4488ff"}
              emissive={activity > 0.7 ? "#00ff88" : activity > 0.4 ? "#ffaa00" : "#4488ff"}
              emissiveIntensity={0.5}
            />
          </Box>
        </group>
      ))}

      {/* Stand */}
      <Cylinder args={[0.08, 0.08, 1.5, 16]} position={[0, 0.75, 0]}>
        <meshStandardMaterial color="#2a2a2a" metalness={0.9} roughness={0.1} />
      </Cylinder>

      {/* Base */}
      <Cylinder args={[0.4, 0.4, 0.1, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
      </Cylinder>

      <Text
        position={[0, 0.5, 0.06]}
        fontSize={0.12}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
      >
        NEURAL FEEDBACK
      </Text>
    </group>
  );
}

// Reaction Time Testing Station
function ReactionTimeStation({ position }: { position: [number, number, number] }) {
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
      <RoundedBox args={[1.5, 1, 0.5]} radius={0.05} position={[0, 0.5, 0]}>
        <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.3} />
      </RoundedBox>

      {/* Reaction Target */}
      <Sphere ref={targetRef} args={[0.3, 32, 32]} position={[0, 1.5, 0.3]}>
        <meshStandardMaterial
          color={isActive ? "#ff0044" : "#444444"}
          emissive={isActive ? "#ff0044" : "#000000"}
          emissiveIntensity={isActive ? 0.8 : 0}
        />
      </Sphere>

      <pointLight ref={lightRef} position={[0, 1.5, 0.5]} color="#ff0044" distance={3} />

      {/* Response Buttons */}
      {[-0.5, 0, 0.5].map((x, i) => (
        <RoundedBox key={i} args={[0.25, 0.08, 0.25]} radius={0.02} position={[x, 0.54, 0.3]}>
          <meshStandardMaterial
            color={["#ff4444", "#44ff44", "#4444ff"][i]}
            emissive={["#ff4444", "#44ff44", "#4444ff"][i]}
            emissiveIntensity={0.3}
          />
        </RoundedBox>
      ))}

      {/* Display */}
      <RoundedBox args={[1.2, 0.6, 0.05]} radius={0.02} position={[0, 1.2, 0.26]}>
        <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={0.5} />
      </RoundedBox>

      <Text
        position={[0, 0.1, 0.26]}
        fontSize={0.1}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
      >
        REACTION TESTER
      </Text>
    </group>
  );
}

// VR Training Pod
function VRTrainingPod({ position }: { position: [number, number, number] }) {
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
      <Sphere args={[1.2, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} position={[0, 1.2, 0]}>
        <meshStandardMaterial
          color="#0a0a0a"
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.8}
        />
      </Sphere>

      {/* Door */}
      <group rotation={[0, doorOpen ? -Math.PI / 2 : 0, 0]} position={[0, 1.2, 0]}>
        <Box args={[0.1, 2, 1.2]} position={[0.6, 0, 0]}>
          <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
        </Box>
      </group>

      {/* Interior Seat */}
      <RoundedBox args={[0.8, 0.3, 0.8]} radius={0.1} position={[0, 0.7, 0]}>
        <meshStandardMaterial color="#2a2a2a" />
      </RoundedBox>

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
      <Cylinder args={[1.5, 1.5, 0.2, 32]} position={[0, 0.1, 0]}>
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
      </Cylinder>

      {/* Indicator Lights */}
      {[0, 1, 2, 3].map((i) => (
        <Sphere
          key={i}
          args={[0.05, 16, 16]}
          position={[
            Math.cos(i * Math.PI / 2) * 1.3,
            0.2,
            Math.sin(i * Math.PI / 2) * 1.3
          ]}
        >
          <meshStandardMaterial
            color={doorOpen ? "#00ff00" : "#ff0000"}
            emissive={doorOpen ? "#00ff00" : "#ff0000"}
            emissiveIntensity={0.8}
          />
        </Sphere>
      ))}

      <Text
        position={[0, 0.05, 1.6]}
        fontSize={0.12}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
      >
        VR TRAINING POD
      </Text>
    </group>
  );
}

// Eye Tracking System
function EyeTrackingSystem({ position }: { position: [number, number, number] }) {
  const eyeRef = useRef<THREE.Group>(null);
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

  useFrame((state) => {
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
      <RoundedBox args={[1.2, 1.5, 0.4]} radius={0.05} position={[0, 0.75, 0]}>
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </RoundedBox>

      {/* Eye Display */}
      <group ref={eyeRef} position={[0, 1, 0.21]}>
        {/* Sclera */}
        <Sphere args={[0.25, 32, 32]}>
          <meshStandardMaterial color="#ffffff" />
        </Sphere>

        {/* Iris */}
        <Sphere args={[0.15, 32, 32]} position={[0, 0, 0.2]}>
          <meshStandardMaterial color="#0088ff" />
        </Sphere>

        {/* Pupil */}
        <Sphere ref={pupilRef} args={[0.08, 32, 32]} position={[0, 0, 0.22]}>
          <meshStandardMaterial color="#000000" />
        </Sphere>
      </group>

      {/* Tracking Grid */}
      <group position={[0, 0.5, 0.21]}>
        {[-0.4, -0.2, 0, 0.2, 0.4].map((x) =>
          [-0.3, -0.15, 0, 0.15, 0.3].map((y) => (
            <Sphere key={`${x}-${y}`} args={[0.015, 8, 8]} position={[x, y, 0]}>
              <meshStandardMaterial
                color="#00ffff"
                emissive="#00ffff"
                emissiveIntensity={0.3}
              />
            </Sphere>
          ))
        )}
      </group>

      {/* Stand */}
      <Cylinder args={[0.06, 0.08, 0.5, 16]} position={[0, 0.25, 0]}>
        <meshStandardMaterial color="#2a2a2a" metalness={0.9} roughness={0.1} />
      </Cylinder>

      <Text
        position={[0, 0.05, 0.21]}
        fontSize={0.08}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
      >
        EYE TRACKING
      </Text>
    </group>
  );
}

// Decision Making Simulator
function DecisionSimulator({ position }: { position: [number, number, number] }) {
  const [activeOption, setActiveOption] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveOption(Math.floor(Math.random() * 4));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <group position={position}>
      {/* Main Console */}
      <RoundedBox args={[2, 1.2, 0.6]} radius={0.05} position={[0, 0.6, 0]}>
        <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.3} />
      </RoundedBox>

      {/* Central Display */}
      <RoundedBox args={[1.5, 0.8, 0.05]} radius={0.02} position={[0, 1.3, 0.31]}>
        <meshStandardMaterial color="#000000" />
      </RoundedBox>

      {/* Decision Diagram */}
      <Sphere args={[0.15, 32, 32]} position={[0, 1.3, 0.35]}>
        <meshStandardMaterial
          color="#ffaa00"
          emissive="#ffaa00"
          emissiveIntensity={0.6}
        />
      </Sphere>

      {/* Option Paths */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i * Math.PI / 2) - Math.PI / 4;
        const x = Math.cos(angle) * 0.5;
        const y = Math.sin(angle) * 0.5;
        return (
          <group key={i}>
            <Cylinder
              args={[0.01, 0.01, 0.5, 8]}
              position={[x / 2, 1.3 + y / 2, 0.35]}
              rotation={[0, 0, -angle]}
            >
              <meshStandardMaterial
                color={activeOption === i ? "#00ff88" : "#444444"}
                emissive={activeOption === i ? "#00ff88" : "#000000"}
                emissiveIntensity={activeOption === i ? 0.5 : 0}
              />
            </Cylinder>
            <Sphere args={[0.08, 16, 16]} position={[x, 1.3 + y, 0.35]}>
              <meshStandardMaterial
                color={activeOption === i ? "#00ff88" : "#444444"}
                emissive={activeOption === i ? "#00ff88" : "#000000"}
                emissiveIntensity={activeOption === i ? 0.8 : 0}
              />
            </Sphere>
          </group>
        );
      })}

      {/* Control Panel */}
      <group position={[0, 0.65, 0.31]}>
        {[-0.6, -0.2, 0.2, 0.6].map((x, i) => (
          <RoundedBox key={i} args={[0.15, 0.15, 0.05]} radius={0.02} position={[x, 0, 0]}>
            <meshStandardMaterial
              color={activeOption === i ? "#00ff88" : "#ff4444"}
              emissive={activeOption === i ? "#00ff88" : "#ff4444"}
              emissiveIntensity={0.5}
            />
          </RoundedBox>
        ))}
      </group>

      <Text
        position={[0, 0.1, 0.31]}
        fontSize={0.1}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
      >
        DECISION SIMULATOR
      </Text>
    </group>
  );
}

// Cognitive Exercise Station
function CognitiveExerciseStation({ position }: { position: [number, number, number] }) {
  const [pattern, setPattern] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPattern(Array.from({ length: 9 }, () => Math.floor(Math.random() * 3)));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <group position={position}>
      {/* Table Surface */}
      <RoundedBox args={[1.8, 0.1, 1.2]} radius={0.02} position={[0, 0.9, 0]}>
        <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.3} />
      </RoundedBox>

      {/* Pattern Grid */}
      {pattern.map((value, i) => {
        const x = (i % 3 - 1) * 0.35;
        const z = (Math.floor(i / 3) - 1) * 0.35;
        return (
          <RoundedBox
            key={i}
            args={[0.25, 0.15, 0.25]}
            radius={0.02}
            position={[x, 1, z]}
          >
            <meshStandardMaterial
              color={["#ff4444", "#44ff44", "#4444ff"][value]}
              emissive={["#ff4444", "#44ff44", "#4444ff"][value]}
              emissiveIntensity={0.4}
            />
          </RoundedBox>
        );
      })}

      {/* Table Legs */}
      {[[-0.7, 0, -0.5], [0.7, 0, -0.5], [-0.7, 0, 0.5], [0.7, 0, 0.5]].map((pos, i) => (
        <Cylinder key={i} args={[0.05, 0.05, 0.9, 16]} position={pos as [number, number, number]}>
          <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
        </Cylinder>
      ))}

      <Text
        position={[0, 0.85, 0.65]}
        fontSize={0.08}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
      >
        PATTERN RECOGNITION
      </Text>
    </group>
  );
}

// Main Cognitive Lab Component
export default function CognitiveLab() {
  return (
    <div style={{ width: '100%', height: '100vh', background: '#000000' }}>
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[8, 6, 8]} fov={60} />
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={5}
          maxDistance={25}
          maxPolarAngle={Math.PI / 2}
        />

        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[10, 15, 5]}
          intensity={0.8}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <pointLight position={[-5, 5, -5]} intensity={0.5} color="#0088ff" />
        <pointLight position={[5, 5, 5]} intensity={0.5} color="#ff0088" />

        {/* Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.3} roughness={0.7} />
        </mesh>

        {/* Grid Lines */}
        <gridHelper args={[30, 30, '#00ffff', '#003333']} position={[0, 0.01, 0]} />

        {/* Lab Stations */}
        <ReactionTimeStation position={[-4, 0, -4]} />
        <VRTrainingPod position={[0, 0, -4]} />
        <EyeTrackingSystem position={[4, 0, -4]} />
        <DecisionSimulator position={[-4, 0, 0]} />
        <NeuralFeedbackDisplay position={[0, 0, 0]} />
        <CognitiveExerciseStation position={[4, 0, 0]} />

        {/* Additional Neural Displays */}
        <NeuralFeedbackDisplay position={[-4, 0, 4]} />
        <NeuralFeedbackDisplay position={[4, 0, 4]} />

        {/* Central Holographic Display */}
        <group position={[0, 0, 4]}>
          <mesh position={[0, 2, 0]}>
            <torusGeometry args={[1, 0.05, 16, 32]} />
            <meshStandardMaterial
              color="#00ffff"
              emissive="#00ffff"
              emissiveIntensity={0.8}
              transparent
              opacity={0.6}
            />
          </mesh>
          <Text
            position={[0, 2, 0]}
            fontSize={0.3}
            color="#00ffff"
            anchorX="center"
            anchorY="middle"
          >
            APEX
          </Text>
          <Text
            position={[0, 1.6, 0]}
            fontSize={0.12}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            COGNITIVE LAB
          </Text>
        </group>

        {/* Wall Panels */}
        {[-10, 10].map((z) => (
          <RoundedBox key={z} args={[20, 4, 0.2]} radius={0.05} position={[0, 2, z]}>
            <meshStandardMaterial color="#0a0a0a" metalness={0.8} roughness={0.2} />
          </RoundedBox>
        ))}
        {[-10, 10].map((x) => (
          <RoundedBox key={x} args={[0.2, 4, 20]} radius={0.05} position={[x, 2, 0]}>
            <meshStandardMaterial color="#0a0a0a" metalness={0.8} roughness={0.2} />
          </RoundedBox>
        ))}

        {/* Accent Lighting Strips */}
        {[-9, -6, -3, 0, 3, 6, 9].map((x) => (
          <Box key={`light-${x}`} args={[0.1, 0.05, 18]} position={[x, 3.9, 0]}>
            <meshStandardMaterial
              color="#00ffff"
              emissive="#00ffff"
              emissiveIntensity={0.5}
            />
          </Box>
        ))}
      </Canvas>

      {/* UI Overlay */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        color: '#00ffff',
        fontFamily: 'monospace',
        fontSize: '14px',
        textShadow: '0 0 10px rgba(0,255,255,0.5)',
        pointerEvents: 'none',
        userSelect: 'none'
      }}>
        <div style={{ marginBottom: 10, fontSize: '24px', fontWeight: 'bold' }}>
          APEX COGNITIVE TRAINING LABORATORY
        </div>
        <div style={{ opacity: 0.8 }}>
          <div>▸ REACTION TIME TESTING - Active</div>
          <div>▸ VR TRAINING PODS - 2/4 Occupied</div>
          <div>▸ EYE TRACKING - Calibrated</div>
          <div>▸ DECISION SIMULATOR - Running</div>
          <div>▸ NEURAL FEEDBACK - Real-time</div>
          <div>▸ COGNITIVE EXERCISES - Session 47</div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        right: 20,
        color: '#00ff88',
        fontFamily: 'monospace',
        fontSize: '12px',
        textAlign: 'right',
        pointerEvents: 'none',
        userSelect: 'none'
      }}>
        <div>AVG REACTION TIME: 187ms</div>
        <div>DECISION ACCURACY: 94.3%</div>
        <div>FOCUS INDEX: 8.7/10</div>
        <div>NEURAL EFFICIENCY: 91%</div>
      </div>
    </div>
  );
}
