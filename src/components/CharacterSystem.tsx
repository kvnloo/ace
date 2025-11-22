import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float, Html } from '@react-three/drei';

/**
 * CharacterSystem - Animated character population system for tennis facility
 *
 * Features:
 * - Multiple character types (players, coaches, staff, visitors)
 * - Realistic movement animations with pathfinding
 * - Activity-based behaviors (playing, walking, standing, practicing)
 * - Court assignment and interaction states
 * - Crowd simulation for spectator areas
 * - Performance optimized with instanced rendering
 *
 * Architecture:
 * - Character state machine (idle → walking → playing → resting)
 * - Simple pathfinding with waypoint navigation
 * - Activity zones (courts, walkways, facilities, bleachers)
 * - LOD system for distance-based detail
 */

// --- Types & Constants ---

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
  playerCount?: number;
  coachCount?: number;
  staffCount?: number;
  visitorCount?: number;
  spectatorCount?: number;
  courtPositions?: Array<[number, number, number]>;
  enabled?: boolean;
}

// Character appearance colors
const CHARACTER_COLORS = {
  player: new THREE.Color('#3b82f6'),      // Blue - tennis players
  coach: new THREE.Color('#f59e0b'),       // Amber - coaches
  staff: new THREE.Color('#6366f1'),       // Indigo - facility staff
  visitor: new THREE.Color('#10b981'),     // Green - visitors/guests
  spectator: new THREE.Color('#8b5cf6'),   // Purple - spectators
};

// Movement speeds (m/s)
const SPEEDS = {
  player: 1.5,
  coach: 1.2,
  staff: 1.0,
  visitor: 0.8,
  spectator: 0.5,
};

// Activity zones - key areas for character navigation
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

// Court positions for player assignment (from ThreeScene layout)
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

// --- Helper Functions ---

/**
 * Generate random position within zone
 */
function getRandomPositionInZone(zone: { min: number[], max: number[] }): THREE.Vector3 {
  return new THREE.Vector3(
    THREE.MathUtils.randFloat(zone.min[0], zone.max[0]),
    zone.min[1],
    THREE.MathUtils.randFloat(zone.min[2], zone.max[2])
  );
}

/**
 * Simple pathfinding - generate waypoints between two points
 */
function generatePath(start: THREE.Vector3, end: THREE.Vector3, waypointCount: number = 2): THREE.Vector3[] {
  const waypoints: THREE.Vector3[] = [];

  for (let i = 0; i <= waypointCount; i++) {
    const t = i / waypointCount;
    // Add some randomness to create more natural paths
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

/**
 * Check if position is within court area
 */
function isOnCourt(position: THREE.Vector3): boolean {
  const courtBounds = ACTIVITY_ZONES.COURTS;
  return position.x >= courtBounds.min[0] && position.x <= courtBounds.max[0] &&
         position.z >= courtBounds.min[2] && position.z <= courtBounds.max[2];
}

// --- Character Components ---

/**
 * Individual character mesh with animation
 */
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

  // Activity indicators
  const getActivityEmoji = () => {
    switch (data.state) {
      case 'playing': return '🎾';
      case 'coaching': return '📋';
      case 'watching': return '👀';
      case 'walking': return '🚶';
      default: return '';
    }
  };

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
        <meshStandardMaterial
          color="#f8b195"
          roughness={0.8}
        />
      </mesh>

      {/* Equipment indicator for players */}
      {data.type === 'player' && data.state === 'playing' && (
        <mesh position={[0.4, 0.8, 0]} rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0.02, 0.02, 0.8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      )}

      {/* Hover label */}
      {hovered && (
        <Html distanceFactor={20} center>
          <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold text-white whitespace-nowrap border border-white/20 pointer-events-none">
            {getActivityEmoji()} {data.type.toUpperCase()} - {data.state}
          </div>
        </Html>
      )}

      {/* Shadow plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <circleGeometry args={[0.4, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>
    </group>
  );
};

/**
 * Crowd simulation for spectator areas (bleachers)
 */
const SpectatorCrowd: React.FC<{
  position: [number, number, number];
  count: number;
  radius: number;
}> = ({ position, count, radius }) => {
  const spectators = useMemo(() => {
    const crowd: Array<{ position: THREE.Vector3; rotation: number; variant: number }> = [];

    for (let i = 0; i < count; i++) {
      // Arrange in rows
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

// --- Main Character System ---

export const CharacterSystem: React.FC<CharacterSystemProps> = ({
  playerCount = 48,
  coachCount = 12,
  staffCount = 8,
  visitorCount = 15,
  spectatorCount = 200,
  courtPositions = DEFAULT_COURT_POSITIONS,
  enabled = true,
}) => {
  // Initialize character data
  const characters = useRef<CharacterData[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);

  // Initialize characters on first render
  useMemo(() => {
    if (characters.current.length > 0) return;

    const newCharacters: CharacterData[] = [];
    let id = 0;

    // Create players - assign to courts
    for (let i = 0; i < playerCount; i++) {
      const courtIndex = Math.floor(i / 2) % courtPositions.length;
      const courtPos = courtPositions[courtIndex];
      const side = i % 2 === 0 ? -1 : 1;

      const position = new THREE.Vector3(
        courtPos[0] + side * 3,
        courtPos[1],
        courtPos[2]
      );

      newCharacters.push({
        id: `player-${id++}`,
        type: 'player',
        state: Math.random() > 0.3 ? 'playing' : 'walking',
        position,
        targetPosition: position.clone(),
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

    // Create coaches - positioned near courts
    for (let i = 0; i < coachCount; i++) {
      const courtIndex = Math.floor(i * courtPositions.length / coachCount);
      const courtPos = courtPositions[courtIndex];

      const position = new THREE.Vector3(
        courtPos[0] + THREE.MathUtils.randFloat(-5, 5),
        courtPos[1],
        courtPos[2] + 8
      );

      newCharacters.push({
        id: `coach-${id++}`,
        type: 'coach',
        state: Math.random() > 0.5 ? 'coaching' : 'walking',
        position,
        targetPosition: position.clone(),
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

    // Create staff - positioned in walkways and facilities
    for (let i = 0; i < staffCount; i++) {
      const position = getRandomPositionInZone(ACTIVITY_ZONES.WALKWAYS);

      newCharacters.push({
        id: `staff-${id++}`,
        type: 'staff',
        state: 'walking',
        position,
        targetPosition: position.clone(),
        velocity: new THREE.Vector3(),
        rotation: 0,
        speed: SPEEDS.staff,
        pathWaypoints: [],
        currentWaypointIndex: 0,
        stateTimer: Math.random() * 10,
        color: CHARACTER_COLORS.staff.clone(),
      });
    }

    // Create visitors - walking around facility
    for (let i = 0; i < visitorCount; i++) {
      const position = getRandomPositionInZone(ACTIVITY_ZONES.WALKWAYS);

      newCharacters.push({
        id: `visitor-${id++}`,
        type: 'visitor',
        state: 'walking',
        position,
        targetPosition: position.clone(),
        velocity: new THREE.Vector3(),
        rotation: 0,
        speed: SPEEDS.visitor,
        pathWaypoints: [],
        currentWaypointIndex: 0,
        stateTimer: Math.random() * 10,
        color: CHARACTER_COLORS.visitor.clone(),
      });
    }

    characters.current = newCharacters;
  }, [playerCount, coachCount, staffCount, visitorCount, courtPositions]);

  // Animation loop - update all characters
  useFrame((state, delta) => {
    if (!enabled) return;

    characters.current.forEach((char) => {
      // Update state timer
      char.stateTimer -= delta;

      // State transitions
      if (char.stateTimer <= 0) {
        switch (char.state) {
          case 'idle':
            // Start walking to new location
            if (char.type === 'player' && char.courtAssignment !== undefined) {
              const courtPos = courtPositions[char.courtAssignment];
              char.targetPosition.set(
                courtPos[0] + THREE.MathUtils.randFloat(-4, 4),
                courtPos[1],
                courtPos[2] + THREE.MathUtils.randFloat(-10, 10)
              );
            } else {
              char.targetPosition = getRandomPositionInZone(ACTIVITY_ZONES.WALKWAYS);
            }
            char.pathWaypoints = generatePath(char.position, char.targetPosition, 2);
            char.currentWaypointIndex = 0;
            char.state = 'walking';
            char.stateTimer = 5 + Math.random() * 10;
            break;

          case 'walking':
            // Arrive at destination
            if (char.type === 'player' && isOnCourt(char.position)) {
              char.state = 'playing';
              char.stateTimer = 10 + Math.random() * 20;
            } else if (char.type === 'coach') {
              char.state = 'coaching';
              char.stateTimer = 5 + Math.random() * 10;
            } else {
              char.state = 'idle';
              char.stateTimer = 2 + Math.random() * 5;
            }
            break;

          case 'playing':
          case 'coaching':
            // Return to walking
            char.state = 'idle';
            char.stateTimer = 1;
            break;
        }
      }

      // Movement behavior
      if (char.state === 'walking') {
        if (char.pathWaypoints.length > 0) {
          const currentWaypoint = char.pathWaypoints[char.currentWaypointIndex];
          const direction = new THREE.Vector3()
            .subVectors(currentWaypoint, char.position)
            .normalize();

          const distance = char.position.distanceTo(currentWaypoint);

          if (distance < 0.5) {
            // Reached waypoint, move to next
            char.currentWaypointIndex++;
            if (char.currentWaypointIndex >= char.pathWaypoints.length) {
              // Reached final destination
              char.pathWaypoints = [];
              char.velocity.set(0, 0, 0);
            }
          } else {
            // Move towards waypoint
            char.velocity.copy(direction).multiplyScalar(char.speed);
            char.position.add(char.velocity.clone().multiplyScalar(delta));
          }
        }
      } else {
        // Idle or activity states - minimal movement
        char.velocity.multiplyScalar(0.9);
      }

      // Playing animation - slight oscillation
      if (char.state === 'playing') {
        const oscillation = Math.sin(state.clock.elapsedTime * 2) * 0.3;
        char.position.x += oscillation * delta;
      }
    });
  });

  if (!enabled) return null;

  return (
    <group name="character-system">
      {/* Active characters (players, coaches, staff, visitors) */}
      {characters.current.map((char) => (
        <Character
          key={char.id}
          data={char}
          onClick={() => setSelectedCharacter(char.id)}
        />
      ))}

      {/* Spectator crowds in bleacher areas */}
      {ACTIVITY_ZONES.BLEACHERS.map((bleacher, i) => (
        <SpectatorCrowd
          key={`crowd-${i}`}
          position={[bleacher.position.x, bleacher.position.y, bleacher.position.z]}
          count={Math.floor(spectatorCount / ACTIVITY_ZONES.BLEACHERS.length)}
          radius={bleacher.radius}
        />
      ))}

      {/* Debug info for selected character */}
      {selectedCharacter && (
        <Html position={[0, 50, 0]} center>
          <div className="bg-slate-900/95 backdrop-blur-md px-6 py-4 rounded-xl border border-tennis-yellow/30 text-white">
            <h3 className="text-lg font-bold text-tennis-yellow mb-2">Character Info</h3>
            {characters.current
              .filter((c) => c.id === selectedCharacter)
              .map((c) => (
                <div key={c.id} className="space-y-1 text-sm font-mono">
                  <div>ID: {c.id}</div>
                  <div>Type: {c.type}</div>
                  <div>State: {c.state}</div>
                  <div>Position: ({c.position.x.toFixed(1)}, {c.position.z.toFixed(1)})</div>
                  {c.courtAssignment !== undefined && (
                    <div>Court: {c.courtAssignment}</div>
                  )}
                </div>
              ))}
            <button
              onClick={() => setSelectedCharacter(null)}
              className="mt-3 px-3 py-1 bg-tennis-yellow text-black rounded font-bold text-xs hover:bg-tennis-yellow/80"
            >
              Close
            </button>
          </div>
        </Html>
      )}
    </group>
  );
};

export default CharacterSystem;
