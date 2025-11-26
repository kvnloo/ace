/**
 * HydroponicsSystem.tsx
 * Vertical farming system with automated nutrient delivery and growth monitoring
 * Integrated from PR #6 with DebugContext support
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// Types
interface HydroponicsSystemProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  towerCount?: number;
  showMetrics?: boolean;
}

// Growth stage definitions
enum GrowthStage {
  SEEDLING = 0,
  VEGETATIVE = 1,
  FLOWERING = 2,
  MATURE = 3
}

interface PlantData {
  stage: GrowthStage;
  health: number;
  daysGrowing: number;
}

// Tower tier component with plants
const TowerTier: React.FC<{
  position: [number, number, number];
  tierIndex: number;
  towerIndex: number;
}> = ({ position, tierIndex, towerIndex }) => {
  const plantsPerTier = 8;

  // Generate plant data based on tier and tower
  const plants = useMemo(() => {
    const plantData: PlantData[] = [];
    const seed = towerIndex * 100 + tierIndex;

    for (let i = 0; i < plantsPerTier; i++) {
      const pseudoRandom = (seed + i * 37) % 100;
      const baseDays = tierIndex * 10 + i * 3;

      let stage = GrowthStage.SEEDLING;
      if (baseDays > 30) stage = GrowthStage.MATURE;
      else if (baseDays > 20) stage = GrowthStage.FLOWERING;
      else if (baseDays > 10) stage = GrowthStage.VEGETATIVE;

      plantData.push({
        stage,
        health: 85 + (pseudoRandom % 15),
        daysGrowing: baseDays
      });
    }

    return plantData;
  }, [tierIndex, towerIndex]);

  // Plant rendering
  const renderPlant = (plantIndex: number, plant: PlantData) => {
    const angle = (plantIndex / plantsPerTier) * Math.PI * 2;
    const radius = 1.2;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    // Growth stage visual properties
    const stageProps = {
      [GrowthStage.SEEDLING]: { height: 0.15, color: '#86efac', leafCount: 2 },
      [GrowthStage.VEGETATIVE]: { height: 0.35, color: '#4ade80', leafCount: 4 },
      [GrowthStage.FLOWERING]: { height: 0.5, color: '#22c55e', leafCount: 6 },
      [GrowthStage.MATURE]: { height: 0.65, color: '#16a34a', leafCount: 8 },
    };

    const props = stageProps[plant.stage];
    const healthFactor = plant.health / 100;

    return (
      <group key={plantIndex} position={[x, 0, z]}>
        {/* Plant stem */}
        <mesh position={[0, props.height / 2, 0]}>
          <cylinderGeometry args={[0.02, 0.03, props.height, 8]} />
          <meshStandardMaterial color={props.color} roughness={0.6} />
        </mesh>

        {/* Leaves */}
        {Array.from({ length: props.leafCount }).map((_, leafIdx) => {
          const leafAngle = (leafIdx / props.leafCount) * Math.PI * 2;
          const leafY = (leafIdx / props.leafCount) * props.height;

          return (
            <mesh
              key={leafIdx}
              position={[
                Math.cos(leafAngle) * 0.1,
                leafY,
                Math.sin(leafAngle) * 0.1
              ]}
              rotation={[Math.PI / 3, leafAngle, 0]}
            >
              <planeGeometry args={[0.12 * healthFactor, 0.08 * healthFactor]} />
              <meshStandardMaterial
                color={props.color}
                side={THREE.DoubleSide}
                roughness={0.4}
                emissive={props.color}
                emissiveIntensity={0.1}
              />
            </mesh>
          );
        })}

        {/* Root zone */}
        <mesh position={[0, -0.15, 0]}>
          <coneGeometry args={[0.04, 0.2, 6]} />
          <meshStandardMaterial color="#f5f5dc" transparent opacity={0.6} />
        </mesh>
      </group>
    );
  };

  return (
    <group position={position}>
      {/* Tier platform */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.4, 1.4, 0.1, 32]} />
        <meshPhysicalMaterial
          color="#e5e7eb"
          transparent
          opacity={0.4}
          roughness={0.2}
          metalness={0.3}
        />
      </mesh>

      {/* Nutrient channel */}
      <mesh position={[0, -0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.1, 1.3, 32]} />
        <meshStandardMaterial
          color="#60a5fa"
          transparent
          opacity={0.6}
          roughness={0.1}
          metalness={0.8}
          emissive="#3b82f6"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Render plants */}
      {plants.map((plant, idx) => renderPlant(idx, plant))}

      {/* LED grow light */}
      <LEDGrowLight position={[0, 1.8, 0]} tierIndex={tierIndex} />
    </group>
  );
};

// LED Grow Light Component
const LEDGrowLight: React.FC<{
  position: [number, number, number];
  tierIndex: number;
}> = ({ position, tierIndex }) => {
  const lightRef = useRef<THREE.PointLight>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (lightRef.current && ringRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2 + tierIndex * 0.5) * 0.15 + 0.85;
      lightRef.current.intensity = 1.5 * pulse;
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.1 + tierIndex;
    }
  });

  return (
    <group position={position}>
      {/* LED housing ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[1.3, 0.08, 16, 32]} />
        <meshStandardMaterial
          color="#1e293b"
          metalness={0.8}
          roughness={0.2}
          emissive="#7c3aed"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Individual LEDs */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 1.3, 0, Math.sin(angle) * 1.3]}
          >
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color="#a855f7" />
          </mesh>
        );
      })}

      {/* Point light */}
      <pointLight
        ref={lightRef}
        color="#a855f7"
        intensity={1.5}
        distance={4}
        decay={2}
      />
    </group>
  );
};

// Vertical farming tower
const FarmingTower: React.FC<{
  position: [number, number, number];
  towerIndex: number;
  showMetrics: boolean;
}> = ({ position, towerIndex, showMetrics }) => {
  const tiersPerTower = 8;
  const tierSpacing = 2;

  return (
    <group position={position}>
      {/* Central support column */}
      <mesh position={[0, 8, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 16, 16]} />
        <meshStandardMaterial
          color="#334155"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Structural support beams */}
      {Array.from({ length: 4 }).map((_, i) => {
        const angle = (i / 4) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 1.5, 8, Math.sin(angle) * 1.5]}
          >
            <boxGeometry args={[0.08, 16, 0.08]} />
            <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.4} />
          </mesh>
        );
      })}

      {/* Render all tiers */}
      {Array.from({ length: tiersPerTower }).map((_, tierIdx) => (
        <TowerTier
          key={tierIdx}
          position={[0, tierIdx * tierSpacing + 0.5, 0]}
          tierIndex={tierIdx}
          towerIndex={towerIndex}
        />
      ))}

      {/* Tower metrics display */}
      {showMetrics && (
        <MonitoringDisplay
          position={[0, 17, 0]}
          towerIndex={towerIndex}
        />
      )}
    </group>
  );
};

// Water circulation system
const WaterCirculationSystem: React.FC<{
  position: [number, number, number];
  towerCount: number;
}> = ({ position, towerCount }) => {
  return (
    <group position={position}>
      {/* Central reservoir */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[2, 2.2, 1, 32]} />
        <meshPhysicalMaterial
          color="#1e40af"
          transparent
          opacity={0.4}
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>

      {/* Water level indicator */}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[1.9, 1.9, 0.05, 32]} />
        <meshStandardMaterial
          color="#3b82f6"
          emissive="#60a5fa"
          emissiveIntensity={0.3}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Distribution pipes */}
      {Array.from({ length: towerCount }).map((_, i) => {
        const angle = (i / towerCount) * Math.PI * 2;
        const distance = 15;
        const x = Math.cos(angle) * distance;
        const z = Math.sin(angle) * distance;

        return (
          <group key={i}>
            {/* Horizontal pipe */}
            <mesh
              position={[x / 2, 0.5, z / 2]}
              rotation={[0, angle, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.08, 0.08, distance, 8]} />
              <meshStandardMaterial
                color="#64748b"
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>

            {/* Vertical riser pipe */}
            <mesh position={[x, 8, z]}>
              <cylinderGeometry args={[0.08, 0.08, 16, 8]} />
              <meshStandardMaterial
                color="#64748b"
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>

            {/* Flow indicator */}
            <AnimatedFlowIndicator
              position={[x / 2, 0.5, z / 2]}
              delay={i * 0.5}
            />
          </group>
        );
      })}

      {/* Pump housing */}
      <mesh position={[0, -0.3, 2.5]}>
        <boxGeometry args={[1, 0.8, 1]} />
        <meshStandardMaterial
          color="#1e293b"
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* Pump status indicator */}
      <mesh position={[0, 0.2, 3]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#22c55e" />
      </mesh>
      <pointLight position={[0, 0.2, 3]} color="#22c55e" intensity={0.8} distance={3} />
    </group>
  );
};

// Animated flow indicator
const AnimatedFlowIndicator: React.FC<{
  position: [number, number, number];
  delay: number;
}> = ({ position, delay }) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      const t = (state.clock.elapsedTime + delay) % 2;
      const progress = t / 2;

      ref.current.position.x = position[0] * (1 - progress * 2);
      ref.current.position.z = position[2] * (1 - progress * 2);
      (ref.current.material as THREE.MeshBasicMaterial).opacity = Math.sin(progress * Math.PI);
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.12, 8, 8]} />
      <meshBasicMaterial
        color="#60a5fa"
        transparent
        opacity={0.8}
      />
    </mesh>
  );
};

// Growth monitoring display
const MonitoringDisplay: React.FC<{
  position: [number, number, number];
  towerIndex: number;
}> = ({ position, towerIndex }) => {
  const metrics = useMemo(() => {
    const base = towerIndex * 7;
    return {
      ph: (6.0 + (base % 10) * 0.05).toFixed(1),
      ec: (1.8 + (base % 8) * 0.1).toFixed(1),
      temp: (22 + (base % 6)).toFixed(0),
      humidity: (65 + (base % 15)).toFixed(0),
      growth: (75 + (base % 20)).toFixed(0)
    };
  }, [towerIndex]);

  const screenRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (screenRef.current) {
      const mat = screenRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
      <group position={position}>
        {/* Display panel */}
        <mesh>
          <boxGeometry args={[3, 2, 0.1]} />
          <meshStandardMaterial
            color="#0f172a"
            metalness={0.3}
            roughness={0.6}
            emissive="#1e293b"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Screen */}
        <mesh ref={screenRef} position={[0, 0, 0.06]}>
          <planeGeometry args={[2.6, 1.6]} />
          <meshStandardMaterial
            color="#0c4a6e"
            emissive="#075985"
            emissiveIntensity={0.4}
          />
        </mesh>

        {/* Data visualization bars */}
        {[
          { x: -0.8, height: parseFloat(metrics.ph) / 10, color: '#00ff88' },
          { x: -0.3, height: parseFloat(metrics.ec) / 4, color: '#00aaff' },
          { x: 0.2, height: parseFloat(metrics.temp) / 40, color: '#ff8800' },
          { x: 0.7, height: parseFloat(metrics.growth) / 100, color: '#22c55e' }
        ].map(({ x, height, color }, i) => (
          <mesh key={i} position={[x, -0.4 + height * 0.5, 0.07]}>
            <boxGeometry args={[0.3, height, 0.02]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
          </mesh>
        ))}

        {/* Status indicator */}
        <mesh position={[-1.2, 0.8, 0.06]}>
          <circleGeometry args={[0.08, 16]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>
        <pointLight position={[-1.2, 0.8, 0.2]} color="#22c55e" intensity={0.5} distance={1} />
      </group>
    </Float>
  );
};

// Main Hydroponics System component
export const HydroponicsSystem: React.FC<HydroponicsSystemProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  towerCount = 4,
  showMetrics = true
}) => {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Farming towers arranged in circle */}
      {Array.from({ length: towerCount }).map((_, i) => {
        const angle = (i / towerCount) * Math.PI * 2;
        const x = Math.cos(angle) * 15;
        const z = Math.sin(angle) * 15;

        return (
          <FarmingTower
            key={i}
            position={[x, 0, z]}
            towerIndex={i}
            showMetrics={showMetrics}
          />
        );
      })}

      {/* Central water circulation */}
      <WaterCirculationSystem position={[0, 0, 0]} towerCount={towerCount} />

      {/* Floor platform */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[25, 64]} />
        <meshStandardMaterial
          color="#334155"
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>

      {/* Ambient grow light */}
      <pointLight position={[0, 10, 0]} color="#a855f7" intensity={0.5} distance={40} />
      <hemisphereLight args={['#a855f7', '#22c55e', 0.3]} position={[0, 15, 0]} />
    </group>
  );
};

export default HydroponicsSystem;
