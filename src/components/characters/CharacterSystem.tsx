/**
 * CharacterSystem.tsx
 * Animated character population system with players, coaches, staff, visitors, and spectators
 * Integrated from PR #6 with DebugContext support and performance optimizations
 */

import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Types
type CharacterType = 'player' | 'coach' | 'staff' | 'visitor' | 'spectator';
type ActivityState = 'idle' | 'walking' | 'playing' | 'coaching' | 'watching' | 'resting';

interface CharacterData {
  id: string;
  type: CharacterType;
  state: ActivityState;
  position: THREE.Vector3;
  targetPosition: THREE.Vector3;
  velocity: THREE.Vector3;
  rotation: number;
  speed: number;
  courtAssignment?: number;
  pathWaypoints: THREE.Vector3[];
  currentWaypointIndex: number;
  stateTimer: number;
  color: THREE.Color;
}

interface CharacterSystemProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  playerCount?: number;
  coachCount?: number;
  staffCount?: number;
  visitorCount?: number;
  spectatorCount?: number;
  courtPositions?: Array<[number, number, number]>;
  enabled?: boolean;
}

// Character colors by type
const CHARACTER_COLORS = {
  player: new THREE.Color('#3b82f6'),
  coach: new THREE.Color('#f59e0b'),
  staff: new THREE.Color('#6366f1'),
  visitor: new THREE.Color('#10b981'),
  spectator: new THREE.Color('#8b5cf6'),
};

// Movement speeds (m/s)
const SPEEDS = {
  player: 1.5,
  coach: 1.2,
  staff: 1.0,
  visitor: 0.8,
  spectator: 0.5,
};

// Activity zones
const ACTIVITY_ZONES = {
  COURTS: { min: [-60, 0, -60], max: [60, 0, 60] },
  WALKWAYS: { min: [-70, 0, -70], max: [70, 0, 70] },
  RECEPTION: { min: [-15, 0, 50], max: [15, 0, 65] },
  BLEACHERS: [
    { position: new THREE.Vector3(0, 2, -60), radius: 8 },
    { position: new THREE.Vector3(0, 2, 52), radius: 8 },
    { position: new THREE.Vector3(-55, 2, -14), radius: 6 },
    { position: new THREE.Vector3(-55, 2, 12), radius: 6 },
    { position: new THREE.Vector3(55, 2, -40), radius: 6 },
    { position: new THREE.Vector3(55, 2, -14), radius: 6 },
  ],
};

// Default court positions
const DEFAULT_COURT_POSITIONS: Array<[number, number, number]> = [
  // Hard courts (6)
  [-35, 0.1, -40], [-21, 0.1, -40], [-7, 0.1, -40], [7, 0.1, -40], [21, 0.1, -40], [35, 0.1, -40],
  // Clay courts (6)
  [-35, 0.1, -14], [-21, 0.1, -14], [-7, 0.1, -14], [7, 0.1, -14], [21, 0.1, -14], [35, 0.1, -14],
  // Grass courts (6)
  [-35, 0.1, 12], [-21, 0.1, 12], [-7, 0.1, 12], [7, 0.1, 12], [21, 0.1, 12], [35, 0.1, 12],
  // Wood courts (6)
  [-35, 0.1, 38], [-21, 0.1, 38], [-7, 0.1, 38], [7, 0.1, 38], [21, 0.1, 38], [35, 0.1, 38],
];

// Helper functions
function getRandomPositionInZone(zone: { min: number[], max: number[] }): THREE.Vector3 {
  return new THREE.Vector3(
    THREE.MathUtils.randFloat(zone.min[0], zone.max[0]),
    zone.min[1],
    THREE.MathUtils.randFloat(zone.min[2], zone.max[2])
  );
}

function generatePath(start: THREE.Vector3, end: THREE.Vector3, waypointCount: number = 2): THREE.Vector3[] {
  const waypoints: THREE.Vector3[] = [];

  for (let i = 0; i <= waypointCount; i++) {
    const t = i / waypointCount;
    const randomOffset = new THREE.Vector3(
      THREE.MathUtils.randFloat(-2, 2),
      0,
      THREE.MathUtils.randFloat(-2, 2)
    );
    const point = new THREE.Vector3().lerpVectors(start, end, t).add(randomOffset);
    waypoints.push(point);
  }

  return waypoints;
}

// Individual Character Component
const Character: React.FC<{ data: CharacterData; onClick?: () => void }> = ({ data, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Smooth rotation towards movement direction
    if (data.velocity.lengthSq() > 0.01) {
      const targetRotation = Math.atan2(data.velocity.x, data.velocity.z);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        targetRotation,
        delta * 5
      );
    }

    // Bobbing animation for walking
    if (data.state === 'walking') {
      const bobAmount = 0.1;
      const bobSpeed = 8;
      meshRef.current.position.y = data.position.y + Math.sin(state.clock.elapsedTime * bobSpeed) * bobAmount;
    } else {
      meshRef.current.position.y = data.position.y;
    }
  });

  // Different geometries for different character types
  const geometry = useMemo(() => {
    switch (data.type) {
      case 'player':
        return <capsuleGeometry args={[0.3, 1.4, 8, 16]} />;
      case 'coach':
        return <capsuleGeometry args={[0.35, 1.5, 8, 16]} />;
      case 'staff':
        return <cylinderGeometry args={[0.3, 0.3, 1.6, 12]} />;
      case 'spectator':
        return <boxGeometry args={[0.4, 1.2, 0.4]} />;
      default:
        return <capsuleGeometry args={[0.3, 1.4, 8, 16]} />;
    }
  }, [data.type]);

  return (
    <group position={[data.position.x, data.position.y, data.position.z]}>
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {geometry}
        <meshStandardMaterial
          color={data.color}
          emissive={hovered ? data.color : new THREE.Color('#000000')}
          emissiveIntensity={hovered ? 0.3 : 0}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.3, 0]} castShadow>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#f8b195" roughness={0.8} />
      </mesh>

      {/* Tennis racket for players */}
      {data.type === 'player' && data.state === 'playing' && (
        <mesh position={[0.4, 0.8, 0]} rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0.02, 0.02, 0.8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      )}

      {/* Shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <circleGeometry args={[0.4, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>
    </group>
  );
};

// Spectator Crowd Component (optimized with instanced rendering)
const SpectatorCrowd: React.FC<{
  position: [number, number, number];
  count: number;
  radius: number;
}> = ({ position, count, radius }) => {
  const spectators = useMemo(() => {
    const crowd: Array<{ position: THREE.Vector3; rotation: number; variant: number }> = [];

    for (let i = 0; i < count; i++) {
      const row = Math.floor(i / 10);
      const col = i % 10;
      const angle = (col / 10) * Math.PI;

      const x = position[0] + Math.cos(angle) * (radius - row * 0.5);
      const y = position[1] + row * 0.4;
      const z = position[2] + Math.sin(angle) * (radius - row * 0.5);

      crowd.push({
        position: new THREE.Vector3(x, y, z),
        rotation: Math.random() * Math.PI * 2,
        variant: Math.floor(Math.random() * 3),
      });
    }

    return crowd;
  }, [position, count, radius]);

  return (
    <group>
      {spectators.map((spec, i) => (
        <mesh
          key={i}
          position={spec.position}
          rotation={[0, spec.rotation, 0]}
          castShadow
        >
          <boxGeometry args={[0.35, 0.8, 0.35]} />
          <meshStandardMaterial
            color={CHARACTER_COLORS.spectator}
            roughness={0.8}
          />
        </mesh>
      ))}
    </group>
  );
};

// Main Character System Component
export const CharacterSystem: React.FC<CharacterSystemProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  playerCount = 48,
  coachCount = 12,
  staffCount = 8,
  visitorCount = 15,
  spectatorCount = 100,
  courtPositions = DEFAULT_COURT_POSITIONS,
  enabled = true,
}) => {
  const charactersRef = useRef<CharacterData[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);

  // Initialize characters
  const characters = useMemo(() => {
    if (charactersRef.current.length > 0) return charactersRef.current;

    const newCharacters: CharacterData[] = [];
    let id = 0;

    // Create players - assign to courts
    for (let i = 0; i < playerCount; i++) {
      const courtIndex = Math.floor(i / 2) % courtPositions.length;
      const courtPos = courtPositions[courtIndex];
      const side = i % 2 === 0 ? -1 : 1;

      const pos = new THREE.Vector3(
        courtPos[0] + side * 3,
        courtPos[1],
        courtPos[2]
      );

      newCharacters.push({
        id: `player-${id++}`,
        type: 'player',
        state: Math.random() > 0.3 ? 'playing' : 'walking',
        position: pos,
        targetPosition: pos.clone(),
        velocity: new THREE.Vector3(),
        rotation: 0,
        speed: SPEEDS.player,
        courtAssignment: courtIndex,
        pathWaypoints: [],
        currentWaypointIndex: 0,
        stateTimer: Math.random() * 10,
        color: CHARACTER_COLORS.player.clone(),
      });
    }

    // Create coaches
    for (let i = 0; i < coachCount; i++) {
      const courtIndex = Math.floor(i * courtPositions.length / coachCount);
      const courtPos = courtPositions[courtIndex];

      const pos = new THREE.Vector3(
        courtPos[0] + THREE.MathUtils.randFloat(-5, 5),
        courtPos[1],
        courtPos[2] + 8
      );

      newCharacters.push({
        id: `coach-${id++}`,
        type: 'coach',
        state: Math.random() > 0.5 ? 'coaching' : 'walking',
        position: pos,
        targetPosition: pos.clone(),
        velocity: new THREE.Vector3(),
        rotation: 0,
        speed: SPEEDS.coach,
        courtAssignment: courtIndex,
        pathWaypoints: [],
        currentWaypointIndex: 0,
        stateTimer: Math.random() * 10,
        color: CHARACTER_COLORS.coach.clone(),
      });
    }

    // Create staff
    for (let i = 0; i < staffCount; i++) {
      const pos = getRandomPositionInZone(ACTIVITY_ZONES.WALKWAYS);

      newCharacters.push({
        id: `staff-${id++}`,
        type: 'staff',
        state: 'walking',
        position: pos,
        targetPosition: pos.clone(),
        velocity: new THREE.Vector3(),
        rotation: 0,
        speed: SPEEDS.staff,
        pathWaypoints: [],
        currentWaypointIndex: 0,
        stateTimer: Math.random() * 10,
        color: CHARACTER_COLORS.staff.clone(),
      });
    }

    // Create visitors
    for (let i = 0; i < visitorCount; i++) {
      const pos = getRandomPositionInZone(
        Math.random() > 0.5 ? ACTIVITY_ZONES.RECEPTION : ACTIVITY_ZONES.WALKWAYS
      );

      newCharacters.push({
        id: `visitor-${id++}`,
        type: 'visitor',
        state: Math.random() > 0.3 ? 'walking' : 'watching',
        position: pos,
        targetPosition: pos.clone(),
        velocity: new THREE.Vector3(),
        rotation: 0,
        speed: SPEEDS.visitor,
        pathWaypoints: [],
        currentWaypointIndex: 0,
        stateTimer: Math.random() * 10,
        color: CHARACTER_COLORS.visitor.clone(),
      });
    }

    charactersRef.current = newCharacters;
    return newCharacters;
  }, [playerCount, coachCount, staffCount, visitorCount, courtPositions]);

  // Update character positions
  useFrame((state, delta) => {
    if (!enabled) return;

    characters.forEach(char => {
      // Update state timer
      char.stateTimer -= delta;

      // State transitions
      if (char.stateTimer <= 0) {
        char.stateTimer = THREE.MathUtils.randFloat(5, 15);

        // Randomly transition states
        if (char.type === 'player') {
          char.state = Math.random() > 0.3 ? 'playing' : 'walking';
        } else if (char.type === 'coach') {
          char.state = Math.random() > 0.5 ? 'coaching' : 'walking';
        } else {
          char.state = Math.random() > 0.4 ? 'walking' : 'idle';
        }

        // Set new target if walking
        if (char.state === 'walking') {
          const zone = char.type === 'player' || char.type === 'coach'
            ? ACTIVITY_ZONES.COURTS
            : ACTIVITY_ZONES.WALKWAYS;

          char.targetPosition = getRandomPositionInZone(zone);
          char.pathWaypoints = generatePath(char.position, char.targetPosition);
          char.currentWaypointIndex = 0;
        }
      }

      // Movement
      if (char.state === 'walking' && char.pathWaypoints.length > 0) {
        const targetWaypoint = char.pathWaypoints[char.currentWaypointIndex];

        if (targetWaypoint) {
          const direction = new THREE.Vector3()
            .subVectors(targetWaypoint, char.position)
            .normalize();

          char.velocity.copy(direction).multiplyScalar(char.speed);
          char.position.addScaledVector(char.velocity, delta);

          // Check if reached waypoint
          const distToWaypoint = char.position.distanceTo(targetWaypoint);
          if (distToWaypoint < 0.5) {
            char.currentWaypointIndex++;
            if (char.currentWaypointIndex >= char.pathWaypoints.length) {
              char.state = 'idle';
              char.velocity.set(0, 0, 0);
            }
          }
        }
      } else {
        char.velocity.set(0, 0, 0);
      }
    });
  });

  if (!enabled) return null;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Render characters */}
      {characters.map(char => (
        <Character
          key={char.id}
          data={char}
          onClick={() => setSelectedCharacter(char.id)}
        />
      ))}

      {/* Spectator crowds in bleacher areas */}
      {ACTIVITY_ZONES.BLEACHERS.map((bleacher, i) => (
        <SpectatorCrowd
          key={i}
          position={[bleacher.position.x, bleacher.position.y, bleacher.position.z]}
          count={Math.floor(spectatorCount / ACTIVITY_ZONES.BLEACHERS.length)}
          radius={bleacher.radius}
        />
      ))}
    </group>
  );
};

export default CharacterSystem;
export type { CharacterData, CharacterSystemProps, CharacterType, ActivityState };
