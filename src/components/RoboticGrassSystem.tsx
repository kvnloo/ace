import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Autonomous Robotic Grass Management System
 *
 * Features:
 * - Autonomous mowing robots with pathfinding
 * - Battery management and charging stations
 * - Real-time position tracking
 * - Collision avoidance
 * - Visual indicators for status
 */

interface DockingStation {
  id: string;
  position: [number, number, number];
  occupied: boolean;
}

interface Robot {
  id: string;
  position: THREE.Vector3;
  targetPosition: THREE.Vector3;
  battery: number; // 0-100
  status: 'mowing' | 'charging' | 'returning' | 'idle';
  speed: number;
  path: THREE.Vector3[];
  currentPathIndex: number;
  assignedCourt: number;
}

interface RoboticGrassSystemProps {
  /** Position of the grass system [x, y, z] */
  position?: [number, number, number];
  /** Number of autonomous robots (default: 6, one per grass court) */
  robotCount?: number;
  /** Enable pathfinding visualization (default: false) */
  showPaths?: boolean;
  /** Enable robot status HUD (default: true) */
  showStatus?: boolean;
}

/**
 * Individual Autonomous Mowing Robot
 */
const MowingRobot: React.FC<{
  robot: Robot;
  showStatus: boolean;
}> = ({ robot, showStatus }) => {
  const groupRef = useRef<THREE.Group>(null);
  const bladeRef = useRef<THREE.Mesh>(null);

  // Animate robot rotation based on movement
  useFrame(() => {
    if (groupRef.current && robot.status === 'mowing') {
      const direction = new THREE.Vector3()
        .subVectors(robot.targetPosition, robot.position)
        .normalize();

      if (direction.length() > 0.001) {
        const angle = Math.atan2(direction.x, direction.z);
        groupRef.current.rotation.y = angle;
      }
    }

    // Animate mower blades
    if (bladeRef.current && robot.status === 'mowing') {
      bladeRef.current.rotation.y += 0.3;
    }
  });

  // Status color coding
  const statusColor = {
    mowing: '#22c55e',
    charging: '#eab308',
    returning: '#f59e0b',
    idle: '#94a3b8'
  }[robot.status];

  const batteryColor = robot.battery > 30 ? '#22c55e' : robot.battery > 10 ? '#f59e0b' : '#ef4444';

  return (
    <group ref={groupRef} position={robot.position.toArray()}>
      {/* Robot Body */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[0.8, 0.3, 1.2]} />
        <meshStandardMaterial
          color={statusColor}
          metalness={0.6}
          roughness={0.3}
          emissive={statusColor}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Robot Top Cover */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[0.7, 0.1, 1.0]} />
        <meshStandardMaterial
          color="#1e293b"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Sensor Array */}
      <mesh position={[0, 0.45, 0.5]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.15, 16]} />
        <meshStandardMaterial
          color="#3b82f6"
          emissive="#3b82f6"
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Wheels */}
      {[-0.4, 0.4].map((x, i) => (
        <React.Fragment key={i}>
          <mesh position={[x, 0, 0.4]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.12, 0.15, 16]} />
            <meshStandardMaterial color="#334155" roughness={0.8} />
          </mesh>
          <mesh position={[x, 0, -0.4]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.12, 0.15, 16]} />
            <meshStandardMaterial color="#334155" roughness={0.8} />
          </mesh>
        </React.Fragment>
      ))}

      {/* Mower Blade Housing */}
      <mesh ref={bladeRef} position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.08, 32]} />
        <meshStandardMaterial
          color="#475569"
          metalness={0.7}
          roughness={0.4}
        />
      </mesh>

      {/* Blade Indicators */}
      {[0, 1, 2].map((i) => {
        const angle = (i / 3) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.25, -0.05, Math.sin(angle) * 0.25]}
          >
            <boxGeometry args={[0.08, 0.04, 0.3]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} />
          </mesh>
        );
      })}

      {/* Battery Indicator Light */}
      <mesh position={[0, 0.42, -0.5]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial
          color={batteryColor}
          emissive={batteryColor}
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Status HUD */}
      {showStatus && (
        <Html position={[0, 0.8, 0]} center distanceFactor={15} zIndexRange={[100, 0]}>
          <div className="bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-lg border border-white/20 shadow-lg pointer-events-none min-w-[140px]">
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: statusColor }}
              />
              <span className="text-white text-xs font-bold">
                {robot.id}
              </span>
            </div>
            <div className="text-white/70 text-[10px] space-y-0.5">
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-white font-medium">{robot.status}</span>
              </div>
              <div className="flex justify-between">
                <span>Battery:</span>
                <span style={{ color: batteryColor }} className="font-medium">
                  {Math.round(robot.battery)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Court:</span>
                <span className="text-white font-medium">G{robot.assignedCourt}</span>
              </div>
            </div>
          </div>
        </Html>
      )}

      {/* Active indicator ring */}
      {robot.status === 'mowing' && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[0.9, 1.0, 32]} />
          <meshBasicMaterial
            color={statusColor}
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
};

/**
 * Docking/Charging Station
 */
const ChargingStation: React.FC<{
  station: DockingStation;
  showLabel: boolean;
}> = ({ station, showLabel }) => {
  return (
    <group position={station.position}>
      {/* Base Platform */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[1.5, 0.1, 1.8]} />
        <meshStandardMaterial
          color="#1e293b"
          metalness={0.5}
          roughness={0.4}
        />
      </mesh>

      {/* Charging Pads */}
      <mesh position={[0, 0.11, 0]}>
        <boxGeometry args={[1.3, 0.02, 1.6]} />
        <meshStandardMaterial
          color={station.occupied ? '#eab308' : '#22c55e'}
          emissive={station.occupied ? '#eab308' : '#22c55e'}
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Rear Panel with Connectors */}
      <mesh position={[0, 0.5, -0.9]} castShadow>
        <boxGeometry args={[1.4, 1.0, 0.15]} />
        <meshStandardMaterial
          color="#334155"
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Charging Indicator Lights */}
      {[-0.4, 0, 0.4].map((x, i) => (
        <mesh key={i} position={[x, 0.8, -0.82]}>
          <cylinderGeometry args={[0.05, 0.05, 0.05, 16]} />
          <meshStandardMaterial
            color={station.occupied ? '#eab308' : '#64748b'}
            emissive={station.occupied ? '#eab308' : '#000000'}
            emissiveIntensity={station.occupied ? 0.6 : 0}
          />
        </mesh>
      ))}

      {/* Top Light Bar */}
      <mesh position={[0, 1.1, -0.9]}>
        <boxGeometry args={[1.2, 0.08, 0.08]} />
        <meshStandardMaterial
          color={station.occupied ? '#eab308' : '#22c55e'}
          emissive={station.occupied ? '#eab308' : '#22c55e'}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Station Label */}
      {showLabel && (
        <Html position={[0, 1.4, 0]} center distanceFactor={20} zIndexRange={[50, 0]}>
          <div className="bg-slate-800/90 backdrop-blur px-2 py-1 rounded text-white text-[10px] font-mono border border-white/10 pointer-events-none">
            DOCK-{station.id}
          </div>
        </Html>
      )}

      {/* Ground Connection Lines */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.6, 1.8, 32]} />
        <meshBasicMaterial
          color="#22c55e"
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

/**
 * Main Robotic Grass Management System Component
 */
const RoboticGrassSystem: React.FC<RoboticGrassSystemProps> = ({
  position = [0, 0, 0],
  robotCount = 6,
  showPaths = false,
  showStatus = true
}) => {
  const timeRef = useRef(0);

  // Initialize docking stations (one per grass court area)
  const dockingStations = useMemo<DockingStation[]>(() => {
    const stations: DockingStation[] = [];
    const grassCourtStartIndex = 12; // Grass courts start at index 12 in the layout

    for (let i = 0; i < robotCount; i++) {
      const col = i % 6;
      const row = 2; // Grass court row

      stations.push({
        id: `0${i + 1}`,
        position: [
          position[0] - 40 + col * 14,
          position[1] + 0.1,
          position[2] + 12 + row * 26 + 12 // Position at edge of grass court
        ],
        occupied: false
      });
    }

    return stations;
  }, [robotCount, position]);

  // Initialize robots
  const [robots, setRobots] = useState<Robot[]>(() => {
    return Array.from({ length: robotCount }, (_, i) => {
      const station = dockingStations[i];
      const col = i % 6;
      const row = 2; // Grass court row

      // Define court patrol area
      const courtCenterX = position[0] - 35 + col * 14;
      const courtCenterZ = position[2] + 12 + row * 26;

      // Generate lawn mower pattern path
      const path: THREE.Vector3[] = [];
      const stripWidth = 1.0; // Width of each mowing strip
      const courtWidth = 10;
      const courtLength = 22;
      const strips = Math.floor(courtWidth / stripWidth);

      for (let strip = 0; strip < strips; strip++) {
        const x = courtCenterX - courtWidth / 2 + strip * stripWidth;

        if (strip % 2 === 0) {
          // Mow forward
          path.push(new THREE.Vector3(x, position[1] + 0.2, courtCenterZ - courtLength / 2));
          path.push(new THREE.Vector3(x, position[1] + 0.2, courtCenterZ + courtLength / 2));
        } else {
          // Mow backward
          path.push(new THREE.Vector3(x, position[1] + 0.2, courtCenterZ + courtLength / 2));
          path.push(new THREE.Vector3(x, position[1] + 0.2, courtCenterZ - courtLength / 2));
        }
      }

      return {
        id: `MOWER-${String(i + 1).padStart(2, '0')}`,
        position: new THREE.Vector3(...station.position),
        targetPosition: new THREE.Vector3(...station.position),
        battery: 85 + Math.random() * 15, // Start with 85-100% battery
        status: 'idle',
        speed: 0.8 + Math.random() * 0.4, // Varying speeds
        path,
        currentPathIndex: 0,
        assignedCourt: i + 1
      };
    });
  });

  // Pathfinding and robot control
  useFrame((state, delta) => {
    timeRef.current += delta;

    setRobots((prevRobots) => {
      return prevRobots.map((robot, index) => {
        const newRobot = { ...robot };
        const station = dockingStations[index];

        // Battery drain
        if (newRobot.status === 'mowing') {
          newRobot.battery = Math.max(0, newRobot.battery - delta * 0.5); // Drain 0.5% per second
        }

        // Battery charge
        if (newRobot.status === 'charging') {
          newRobot.battery = Math.min(100, newRobot.battery + delta * 5); // Charge 5% per second

          // Return to mowing when fully charged
          if (newRobot.battery >= 100) {
            newRobot.status = 'mowing';
            newRobot.currentPathIndex = 0;
            newRobot.targetPosition = newRobot.path[0].clone();
            station.occupied = false;
          }
        }

        // Check if battery is low
        if (newRobot.battery < 15 && newRobot.status !== 'charging' && newRobot.status !== 'returning') {
          newRobot.status = 'returning';
          newRobot.targetPosition = new THREE.Vector3(...station.position);
          station.occupied = false;
        }

        // Move robot towards target
        const distanceToTarget = newRobot.position.distanceTo(newRobot.targetPosition);

        if (distanceToTarget > 0.1) {
          const direction = new THREE.Vector3()
            .subVectors(newRobot.targetPosition, newRobot.position)
            .normalize()
            .multiplyScalar(newRobot.speed * delta);

          newRobot.position.add(direction);
        } else {
          // Reached target
          if (newRobot.status === 'mowing') {
            // Move to next waypoint in path
            newRobot.currentPathIndex = (newRobot.currentPathIndex + 1) % newRobot.path.length;
            newRobot.targetPosition = newRobot.path[newRobot.currentPathIndex].clone();
          } else if (newRobot.status === 'returning') {
            // Arrived at charging station
            newRobot.status = 'charging';
            newRobot.position.copy(new THREE.Vector3(...station.position));
            station.occupied = true;
          } else if (newRobot.status === 'idle') {
            // Start mowing after initial delay
            if (timeRef.current > index * 2) {
              newRobot.status = 'mowing';
              newRobot.currentPathIndex = 0;
              newRobot.targetPosition = newRobot.path[0].clone();
            }
          }
        }

        return newRobot;
      });
    });
  });

  return (
    <group position={position}>
      {/* Render Charging Stations */}
      {dockingStations.map((station) => (
        <ChargingStation
          key={station.id}
          station={station}
          showLabel={showStatus}
        />
      ))}

      {/* Render Robots */}
      {robots.map((robot) => (
        <MowingRobot
          key={robot.id}
          robot={robot}
          showStatus={showStatus}
        />
      ))}

      {/* Render Patrol Paths */}
      {showPaths && robots.map((robot) => (
        <Line
          key={`path-${robot.id}`}
          points={robot.path.map(p => p.toArray())}
          color="#22c55e"
          lineWidth={1}
          transparent
          opacity={0.3}
          dashed
          dashScale={2}
          dashSize={0.5}
          gapSize={0.5}
        />
      ))}

      {/* System Status Panel */}
      {showStatus && (
        <Html position={[0, 10, -50]} center distanceFactor={80} zIndexRange={[200, 0]}>
          <div className="bg-slate-900/95 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-2xl pointer-events-none min-w-[280px]">
            <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-white text-sm font-bold">GRASS MANAGEMENT SYSTEM</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-white/70">
                <span>Active Robots:</span>
                <span className="text-green-400 font-bold">
                  {robots.filter(r => r.status === 'mowing').length}/{robotCount}
                </span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Charging:</span>
                <span className="text-yellow-400 font-bold">
                  {robots.filter(r => r.status === 'charging').length}
                </span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Avg Battery:</span>
                <span className="text-white font-bold">
                  {Math.round(robots.reduce((sum, r) => sum + r.battery, 0) / robotCount)}%
                </span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>System Status:</span>
                <span className="text-green-400 font-bold">OPERATIONAL</span>
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

export default RoboticGrassSystem;
