/**
 * TransportPods.tsx
 * Autonomous transit pod system connecting facility areas
 * Integrated from PR #6 with configurable stations and DebugContext support
 */

import React, { useState, useRef, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Line } from '@react-three/drei';
import * as THREE from 'three';

// Brand color
const BRAND_YELLOW = "#DFFF4F";

// Types
interface PodStation {
  id: string;
  name: string;
  position: [number, number, number];
  routes: string[];
}

interface Pod {
  id: string;
  currentStation: string | null;
  targetStation: string | null;
  position: THREE.Vector3;
  progress: number;
  passengers: number;
  capacity: number;
  status: 'idle' | 'boarding' | 'traveling' | 'arriving';
  route: THREE.Vector3[] | null;
  color: string;
}

interface TransportPodsProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  stations?: PodStation[];
  podCount?: number;
  enabled?: boolean;
}

// Default station network
const DEFAULT_STATIONS: PodStation[] = [
  {
    id: 'main_entrance',
    name: 'Main Entrance',
    position: [0, 0.5, 65],
    routes: ['ground_courts', 'parking', 'level1_hub']
  },
  {
    id: 'parking',
    name: 'Parking Lot',
    position: [-100, 0.5, -20],
    routes: ['main_entrance', 'ground_courts']
  },
  {
    id: 'ground_courts',
    name: 'Ground Courts',
    position: [40, 0.5, 0],
    routes: ['main_entrance', 'parking', 'level1_hub']
  },
  {
    id: 'level1_hub',
    name: 'L1 Racquet Sports',
    position: [0, 20.5, 0],
    routes: ['main_entrance', 'ground_courts', 'level2_hub']
  },
  {
    id: 'level2_hub',
    name: 'L2 Social Zone',
    position: [0, 40.5, 0],
    routes: ['level1_hub', 'level3_hub']
  },
  {
    id: 'level3_hub',
    name: 'L3 Vertical Farm',
    position: [0, 60.5, 0],
    routes: ['level2_hub']
  },
  {
    id: 'outdoor_plaza',
    name: 'Outdoor Plaza',
    position: [90, 0.5, 50],
    routes: ['ground_courts', 'parking']
  }
];

// Generate smooth path between stations
const generatePath = (from: THREE.Vector3, to: THREE.Vector3): THREE.Vector3[] => {
  const waypoints: THREE.Vector3[] = [];
  const midPoint = from.clone().lerp(to, 0.5);

  // Add vertical arc for elevation changes
  const heightDiff = Math.abs(to.y - from.y);
  if (heightDiff > 5) {
    midPoint.y += heightDiff * 0.2;
  }

  // Create smooth curve using Catmull-Rom interpolation
  const curve = new THREE.CatmullRomCurve3([
    from,
    from.clone().lerp(midPoint, 0.33),
    midPoint,
    midPoint.clone().lerp(to, 0.67),
    to
  ]);

  // Sample points along curve
  for (let i = 0; i <= 50; i++) {
    waypoints.push(curve.getPoint(i / 50));
  }

  return waypoints;
};

// Pod Vehicle Component
const PodVehicle: React.FC<{
  pod: Pod;
  onClick: () => void;
}> = ({ pod, onClick }) => {
  const [hovered, setHovered] = useState(false);

  // Calculate rotation to face movement direction
  const rotation = useMemo(() => {
    if (pod.route && pod.route.length > 1) {
      const currentIdx = Math.floor(pod.progress * (pod.route.length - 1));
      const nextIdx = Math.min(currentIdx + 1, pod.route.length - 1);

      const current = pod.route[currentIdx];
      const next = pod.route[nextIdx];

      const direction = new THREE.Vector3().subVectors(next, current).normalize();
      const angle = Math.atan2(direction.x, direction.z);

      return [0, angle, 0] as [number, number, number];
    }
    return [0, 0, 0] as [number, number, number];
  }, [pod.route, pod.progress]);

  return (
    <group
      position={pod.position}
      rotation={rotation}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
    >
      {/* Main pod body - sleek capsule */}
      <mesh castShadow>
        <capsuleGeometry args={[0.8, 2.5, 16, 32]} />
        <meshStandardMaterial
          color={hovered ? BRAND_YELLOW : pod.color}
          metalness={0.7}
          roughness={0.2}
          emissive={pod.color}
          emissiveIntensity={hovered ? 0.4 : 0.2}
        />
      </mesh>

      {/* Glass canopy */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <capsuleGeometry args={[0.75, 1.8, 16, 32]} />
        <meshPhysicalMaterial
          color="#bfdbfe"
          transparent
          opacity={0.2}
          roughness={0.05}
          metalness={0.1}
        />
      </mesh>

      {/* Status indicator */}
      <mesh position={[0, 1.5, 1]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.15, 16]} />
        <meshBasicMaterial
          color={
            pod.status === 'idle' ? '#6b7280' :
            pod.status === 'boarding' ? '#fbbf24' :
            pod.status === 'traveling' ? '#22c55e' :
            '#3b82f6'
          }
        />
      </mesh>
      <pointLight
        position={[0, 1.5, 1]}
        intensity={0.5}
        distance={5}
        color={
          pod.status === 'idle' ? '#6b7280' :
          pod.status === 'boarding' ? '#fbbf24' :
          pod.status === 'traveling' ? '#22c55e' :
          '#3b82f6'
        }
      />

      {/* Hover thrusters */}
      {[-0.8, 0.8].map((x, i) => (
        <group key={i} position={[x, -1, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.3, 0.08, 16, 32]} />
            <meshStandardMaterial
              color="#1e293b"
              metalness={0.9}
              roughness={0.1}
              emissive="#3b82f6"
              emissiveIntensity={pod.status === 'traveling' ? 0.6 : 0.1}
            />
          </mesh>
        </group>
      ))}

      {/* Energy field when moving */}
      {pod.status === 'traveling' && (
        <mesh position={[0, -1.2, 0]}>
          <sphereGeometry args={[1.2, 16, 16]} />
          <meshBasicMaterial
            color="#3b82f6"
            transparent
            opacity={0.15}
            wireframe
          />
        </mesh>
      )}
    </group>
  );
};

// Station Component
const Station: React.FC<{
  station: PodStation;
  activePods: number;
  onStationClick: () => void;
}> = ({ station, activePods, onStationClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={station.position}>
      {/* Station platform */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => { e.stopPropagation(); onStationClick(); }}
      >
        <circleGeometry args={[6, 32]} />
        <meshStandardMaterial
          color={hovered ? BRAND_YELLOW : "#1e293b"}
          metalness={0.4}
          roughness={0.6}
          emissive={hovered ? BRAND_YELLOW : "#334155"}
          emissiveIntensity={hovered ? 0.3 : 0.1}
        />
      </mesh>

      {/* Platform edge lighting */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[5.8, 6, 64]} />
        <meshBasicMaterial
          color={BRAND_YELLOW}
          transparent
          opacity={0.6}
        />
      </mesh>
      <pointLight position={[0, 0.5, 0]} intensity={1.5} distance={12} color={BRAND_YELLOW} />

      {/* Support columns */}
      {[0, Math.PI / 2, Math.PI, 3 * Math.PI / 2].map((angle, i) => (
        <mesh key={i} position={[Math.cos(angle) * 5, -2, Math.sin(angle) * 5]}>
          <cylinderGeometry args={[0.2, 0.25, 4, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}

      {/* Station name label */}
      <Float speed={1.5} rotationIntensity={0} floatIntensity={0.3}>
        <mesh position={[0, 3, 0]}>
          <boxGeometry args={[8, 1, 0.1]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0, 3, 0.06]}>
          <planeGeometry args={[7.5, 0.8]} />
          <meshStandardMaterial
            color="#0a1a2a"
            emissive={BRAND_YELLOW}
            emissiveIntensity={0.3}
          />
        </mesh>
      </Float>

      {/* Active pods indicator */}
      <mesh position={[0, 2, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial
          color={activePods > 0 ? "#22c55e" : "#6b7280"}
        />
      </mesh>

      {/* Direction indicators */}
      {station.routes.map((routeId) => {
        const destStation = DEFAULT_STATIONS.find(s => s.id === routeId);
        if (!destStation) return null;

        const direction = new THREE.Vector3(...destStation.position)
          .sub(new THREE.Vector3(...station.position))
          .normalize()
          .multiplyScalar(6);

        return (
          <mesh
            key={routeId}
            position={[direction.x, 0.1, direction.z]}
            rotation={[-Math.PI / 2, 0, Math.atan2(direction.x, direction.z)]}
          >
            <coneGeometry args={[0.3, 0.6, 8]} />
            <meshBasicMaterial color={BRAND_YELLOW} transparent opacity={0.4} />
          </mesh>
        );
      })}
    </group>
  );
};

// Route visualization
const RoutePath: React.FC<{
  route: THREE.Vector3[];
  active: boolean;
}> = ({ route, active }) => {
  return (
    <Line
      points={route}
      color={active ? BRAND_YELLOW : "#475569"}
      lineWidth={active ? 3 : 1.5}
      transparent
      opacity={active ? 0.8 : 0.3}
      dashed={!active}
      dashSize={1}
      gapSize={0.5}
    />
  );
};

// Main Transport Pods component
export const TransportPods: React.FC<TransportPodsProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  stations = DEFAULT_STATIONS,
  podCount = 4,
  enabled = true
}) => {
  // Initialize pods
  const [pods, setPods] = useState<Pod[]>(() => {
    const initialPods: Pod[] = [];
    const colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444'];

    for (let i = 0; i < podCount; i++) {
      const stationIndex = i % stations.length;
      const station = stations[stationIndex];

      initialPods.push({
        id: `pod-${i}`,
        currentStation: station.id,
        targetStation: null,
        position: new THREE.Vector3(...station.position),
        progress: 0,
        passengers: Math.floor(Math.random() * 3),
        capacity: 4,
        status: 'idle',
        route: null,
        color: colors[i % colors.length]
      });
    }

    return initialPods;
  });

  const [selectedPod, setSelectedPod] = useState<string | null>(null);

  // Update pod positions
  useFrame((state, delta) => {
    if (!enabled) return;

    setPods(prevPods => {
      return prevPods.map(pod => {
        if (pod.status === 'traveling' && pod.route) {
          // Move along route
          const newProgress = Math.min(pod.progress + delta * 0.1, 1);
          const routeIndex = Math.floor(newProgress * (pod.route.length - 1));
          const newPosition = pod.route[routeIndex].clone();

          if (newProgress >= 1) {
            // Arrived at destination
            return {
              ...pod,
              position: newPosition,
              progress: 0,
              status: 'arriving' as const,
              currentStation: pod.targetStation,
              targetStation: null,
              route: null
            };
          }

          return {
            ...pod,
            position: newPosition,
            progress: newProgress
          };
        } else if (pod.status === 'arriving') {
          // Brief pause at arrival
          return { ...pod, status: 'idle' as const };
        } else if (pod.status === 'idle' && Math.random() < 0.001) {
          // Randomly start new journey
          const currentStationData = stations.find(s => s.id === pod.currentStation);
          if (currentStationData && currentStationData.routes.length > 0) {
            const targetId = currentStationData.routes[Math.floor(Math.random() * currentStationData.routes.length)];
            const targetStation = stations.find(s => s.id === targetId);

            if (targetStation) {
              const route = generatePath(
                new THREE.Vector3(...currentStationData.position),
                new THREE.Vector3(...targetStation.position)
              );

              return {
                ...pod,
                status: 'boarding' as const,
                targetStation: targetId,
                route,
                passengers: Math.floor(Math.random() * pod.capacity)
              };
            }
          }
        } else if (pod.status === 'boarding') {
          // Start traveling after boarding
          return { ...pod, status: 'traveling' as const };
        }

        return pod;
      });
    });
  });

  // Generate route visualizations
  const routeVisualizations = useMemo(() => {
    const routes: THREE.Vector3[][] = [];
    const addedRoutes = new Set<string>();

    stations.forEach(station => {
      station.routes.forEach(targetId => {
        const key = [station.id, targetId].sort().join('-');
        if (!addedRoutes.has(key)) {
          const targetStation = stations.find(s => s.id === targetId);
          if (targetStation) {
            routes.push(generatePath(
              new THREE.Vector3(...station.position),
              new THREE.Vector3(...targetStation.position)
            ));
            addedRoutes.add(key);
          }
        }
      });
    });

    return routes;
  }, [stations]);

  // Count active pods per station
  const podCountByStation = useMemo(() => {
    const counts: Record<string, number> = {};
    stations.forEach(s => counts[s.id] = 0);
    pods.forEach(p => {
      if (p.currentStation && (p.status === 'idle' || p.status === 'boarding')) {
        counts[p.currentStation] = (counts[p.currentStation] || 0) + 1;
      }
    });
    return counts;
  }, [pods, stations]);

  if (!enabled) return null;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Route paths */}
      {routeVisualizations.map((route, i) => (
        <RoutePath key={i} route={route} active={false} />
      ))}

      {/* Stations */}
      {stations.map(station => (
        <Station
          key={station.id}
          station={station}
          activePods={podCountByStation[station.id] || 0}
          onStationClick={() => {}}
        />
      ))}

      {/* Pods */}
      {pods.map(pod => (
        <PodVehicle
          key={pod.id}
          pod={pod}
          onClick={() => setSelectedPod(pod.id)}
        />
      ))}
    </group>
  );
};

export default TransportPods;
export type { PodStation, Pod, TransportPodsProps };
