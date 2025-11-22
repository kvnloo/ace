import React, { useState, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Text, Float, Line, useCursor } from '@react-three/drei';
import * as THREE from 'three';

const BRAND_YELLOW = "#DFFF4F";

// --- Types & Configuration ---

interface PodStation {
  id: string;
  name: string;
  position: [number, number, number];
  routes: string[]; // IDs of connected stations
}

interface PodRoute {
  from: string;
  to: string;
  waypoints: THREE.Vector3[];
}

interface Pod {
  id: string;
  currentStation: string | null;
  targetStation: string | null;
  position: THREE.Vector3;
  progress: number; // 0-1 along route
  passengers: number;
  capacity: number;
  status: 'idle' | 'boarding' | 'traveling' | 'arriving';
  route: THREE.Vector3[] | null;
  color: string;
}

// Station network configuration
const STATIONS: PodStation[] = [
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
    midPoint.y += heightDiff * 0.2; // Arc upward
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

// --- Pod Vehicle Component ---

interface PodVehicleProps {
  pod: Pod;
  onClick: () => void;
}

const PodVehicle: React.FC<PodVehicleProps> = ({ pod, onClick }) => {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

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
      {/* Main pod body - sleek capsule design */}
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
          transmission={0.9}
          opacity={0.2}
          transparent
          roughness={0.05}
          metalness={0.1}
          thickness={0.3}
        />
      </mesh>

      {/* Status indicator lights */}
      <mesh position={[0, 1.5, 1]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.15, 16]} />
        <meshBasicMaterial
          color={
            pod.status === 'idle' ? '#6b7280' :
              pod.status === 'boarding' ? '#fbbf24' :
                pod.status === 'traveling' ? '#22c55e' :
                  '#3b82f6'
          }
          toneMapped={false}
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

      {/* Hover thrusters/wheels */}
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

      {/* Passenger capacity indicator */}
      <Html distanceFactor={20} position={[0, 2, 0]} style={{ pointerEvents: 'none' }}>
        <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20 text-xs font-bold text-white whitespace-nowrap">
          Pod {pod.id.slice(-2)} • {pod.passengers}/{pod.capacity}
          <div className={`text-[10px] mt-0.5 ${pod.status === 'idle' ? 'text-gray-400' :
              pod.status === 'boarding' ? 'text-yellow-400' :
                pod.status === 'traveling' ? 'text-green-400' :
                  'text-blue-400'
            }`}>
            {pod.status.toUpperCase()}
          </div>
        </div>
      </Html>

      {/* Energy field effect when moving */}
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

// --- Pod Station Component ---

interface StationProps {
  station: PodStation;
  activePods: number;
  onBooking: (stationId: string, destination: string) => void;
}

const PodStation: React.FC<StationProps> = ({ station, activePods, onBooking }) => {
  const [hovered, setHovered] = useState(false);
  const [showKiosk, setShowKiosk] = useState(false);
  useCursor(hovered);

  return (
    <group position={station.position}>
      {/* Station platform */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => { e.stopPropagation(); setShowKiosk(!showKiosk); }}
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
          toneMapped={false}
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
        <Text
          position={[0, 3, 0]}
          fontSize={1.2}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#000"
        >
          {station.name}
        </Text>
      </Float>

      {/* Active pods indicator */}
      <mesh position={[0, 2, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial
          color={activePods > 0 ? "#22c55e" : "#6b7280"}
          toneMapped={false}
        />
      </mesh>

      {/* Interactive booking kiosk */}
      {showKiosk && (
        <Html position={[0, 4, 0]} distanceFactor={15} center>
          <div className="bg-slate-900/95 backdrop-blur-md p-4 rounded-xl border-2 border-tennis-yellow shadow-2xl min-w-[280px]">
            <div className="text-tennis-yellow font-bold text-sm mb-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              TRANSPORT BOOKING
            </div>

            <div className="text-xs text-white/70 mb-3">
              From: <span className="text-white font-bold">{station.name}</span>
            </div>

            <div className="space-y-1.5">
              {station.routes.map((routeId) => {
                const dest = STATIONS.find(s => s.id === routeId);
                if (!dest) return null;

                return (
                  <button
                    key={routeId}
                    onClick={() => onBooking(station.id, routeId)}
                    className="w-full px-3 py-2 bg-white/10 hover:bg-tennis-yellow hover:text-black rounded-lg text-xs text-white font-medium transition-all duration-200 text-left flex items-center justify-between"
                  >
                    <span>{dest.name}</span>
                    <span className="text-[10px] opacity-60">→</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowKiosk(false)}
              className="w-full mt-3 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-xs text-red-300 font-medium transition-all"
            >
              Close
            </button>
          </div>
        </Html>
      )}

      {/* Direction indicators to connected stations */}
      {station.routes.map((routeId, i) => {
        const dest = STATIONS.find(s => s.id === routeId);
        if (!dest) return null;

        const direction = new THREE.Vector3(...dest.position)
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

// --- Route Visualization Component ---

interface RoutePathProps {
  route: THREE.Vector3[];
  active: boolean;
}

const RoutePath: React.FC<RoutePathProps> = ({ route, active }) => {
  return (
    <Line
      points={route}
      color={active ? BRAND_YELLOW : "#475569"}
      lineWidth={active ? 3 : 1.5}
      transparent
      opacity={active ? 0.8 : 0.3}
      dashed={!active}
      dashSize={2}
      gapSize={1}
    />
  );
};

// --- Main Transport Pods System ---

export interface TransportPodsProps {
  position?: [number, number, number];
  showRoutes?: boolean;
}

const TransportPods: React.FC<TransportPodsProps> = ({
  position = [0, 0, 0],
  showRoutes = true
}) => {
  const [pods, setPods] = useState<Pod[]>(() => {
    // Initialize 8 pods distributed across stations
    return Array.from({ length: 8 }, (_, i) => {
      const stationIdx = i % STATIONS.length;
      const station = STATIONS[stationIdx];

      return {
        id: `pod_${i.toString().padStart(2, '0')}`,
        currentStation: station.id,
        targetStation: null,
        position: new THREE.Vector3(...station.position),
        progress: 0,
        passengers: Math.floor(Math.random() * 3),
        capacity: 4,
        status: 'idle' as const,
        route: null,
        color: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'][i % 4]
      };
    });
  });

  const [selectedPod, setSelectedPod] = useState<string | null>(null);
  const [routes, setRoutes] = useState<Map<string, THREE.Vector3[]>>(new Map());

  // Pre-compute all possible routes
  useMemo(() => {
    const routeMap = new Map<string, THREE.Vector3[]>();

    STATIONS.forEach(station => {
      station.routes.forEach(destId => {
        const dest = STATIONS.find(s => s.id === destId);
        if (dest) {
          const key = `${station.id}-${destId}`;
          const path = generatePath(
            new THREE.Vector3(...station.position),
            new THREE.Vector3(...dest.position)
          );
          routeMap.set(key, path);
        }
      });
    });

    setRoutes(routeMap);
  }, []);

  // Handle pod booking
  const handleBooking = (fromStationId: string, toStationId: string) => {
    // Find available pod at the station
    const availablePod = pods.find(
      p => p.currentStation === fromStationId && p.status === 'idle'
    );

    if (!availablePod) {
      console.log('No available pods at this station');
      return;
    }

    const routeKey = `${fromStationId}-${toStationId}`;
    const route = routes.get(routeKey);

    if (!route) {
      console.log('Route not found');
      return;
    }

    setPods(prev => prev.map(p =>
      p.id === availablePod.id
        ? {
          ...p,
          status: 'boarding',
          targetStation: toStationId,
          route,
          progress: 0,
          passengers: Math.min(p.capacity, p.passengers + Math.floor(Math.random() * 2) + 1)
        }
        : p
    ));

    // Start boarding animation, then travel after 2 seconds
    setTimeout(() => {
      setPods(prev => prev.map(p =>
        p.id === availablePod.id
          ? { ...p, status: 'traveling' }
          : p
      ));
    }, 2000);
  };

  // Animation loop for pod movement
  useFrame((_, delta) => {
    setPods(prev => prev.map(pod => {
      if (pod.status === 'traveling' && pod.route) {
        let newProgress = pod.progress + delta * 0.08; // Speed control

        if (newProgress >= 1) {
          // Arrived at destination
          const destStation = STATIONS.find(s => s.id === pod.targetStation);

          return {
            ...pod,
            status: 'arriving',
            progress: 1,
            position: destStation ? new THREE.Vector3(...destStation.position) : pod.position,
            currentStation: pod.targetStation,
            targetStation: null,
            route: null
          };
        }

        // Update position along route
        const idx = Math.floor(newProgress * (pod.route.length - 1));
        const nextIdx = Math.min(idx + 1, pod.route.length - 1);
        const segmentProgress = (newProgress * (pod.route.length - 1)) % 1;

        const current = pod.route[idx];
        const next = pod.route[nextIdx];
        const newPosition = current.clone().lerp(next, segmentProgress);

        return {
          ...pod,
          progress: newProgress,
          position: newPosition
        };
      }

      if (pod.status === 'arriving') {
        // Complete arrival after brief pause
        setTimeout(() => {
          setPods(prev => prev.map(p =>
            p.id === pod.id
              ? {
                ...p,
                status: 'idle',
                passengers: Math.max(0, p.passengers - Math.floor(Math.random() * 2))
              }
              : p
          ));
        }, 1500);
      }

      return pod;
    }));
  });

  // Count active pods per station
  const getActivePodCount = (stationId: string) => {
    return pods.filter(p => p.currentStation === stationId).length;
  };

  return (
    <group position={position}>
      {/* Render all stations */}
      {STATIONS.map(station => (
        <PodStation
          key={station.id}
          station={station}
          activePods={getActivePodCount(station.id)}
          onBooking={handleBooking}
        />
      ))}

      {/* Render route paths */}
      {showRoutes && Array.from(routes.entries()).map(([key, route]) => {
        const isActive = pods.some(p =>
          p.route === route && p.status === 'traveling'
        );

        return (
          <RoutePath
            key={key}
            route={route}
            active={isActive}
          />
        );
      })}

      {/* Render all pods */}
      {pods.map(pod => (
        <PodVehicle
          key={pod.id}
          pod={pod}
          onClick={() => setSelectedPod(selectedPod === pod.id ? null : pod.id)}
        />
      ))}

      {/* Real-time tracking overlay */}
      {selectedPod && (
        <Html position={[0, 80, 0]} center>
          <div className="bg-slate-900/95 backdrop-blur-md p-4 rounded-xl border-2 border-tennis-yellow shadow-2xl min-w-[300px]">
            <div className="text-tennis-yellow font-bold text-lg mb-3">
              POD TRACKING
            </div>

            {pods
              .filter(p => p.id === selectedPod)
              .map(pod => {
                const currentStn = STATIONS.find(s => s.id === pod.currentStation);
                const targetStn = STATIONS.find(s => s.id === pod.targetStation);

                return (
                  <div key={pod.id} className="space-y-2 text-sm text-white">
                    <div className="flex justify-between">
                      <span className="text-white/60">Pod ID:</span>
                      <span className="font-bold">{pod.id}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-white/60">Status:</span>
                      <span className={`font-bold ${pod.status === 'idle' ? 'text-gray-400' :
                          pod.status === 'boarding' ? 'text-yellow-400' :
                            pod.status === 'traveling' ? 'text-green-400' :
                              'text-blue-400'
                        }`}>
                        {pod.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-white/60">Passengers:</span>
                      <span className="font-bold">{pod.passengers}/{pod.capacity}</span>
                    </div>

                    {currentStn && (
                      <div className="flex justify-between">
                        <span className="text-white/60">Current:</span>
                        <span className="font-bold">{currentStn.name}</span>
                      </div>
                    )}

                    {targetStn && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-white/60">Destination:</span>
                          <span className="font-bold">{targetStn.name}</span>
                        </div>

                        <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                          <div
                            className="bg-tennis-yellow h-2 rounded-full transition-all duration-300"
                            style={{ width: `${pod.progress * 100}%` }}
                          />
                        </div>

                        <div className="text-xs text-white/60 text-center">
                          {Math.round(pod.progress * 100)}% Complete
                        </div>
                      </>
                    )}
                  </div>
                );
              })}

            <button
              onClick={() => setSelectedPod(null)}
              className="w-full mt-4 px-3 py-2 bg-tennis-yellow text-black rounded-lg font-bold text-sm hover:bg-yellow-300 transition-all"
            >
              Close Tracking
            </button>
          </div>
        </Html>
      )}
    </group>
  );
};

export default TransportPods;
