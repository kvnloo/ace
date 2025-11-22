import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Text, Float } from '@react-three/drei';
import * as THREE from 'three';

/**
 * MechanicalRooms Component
 *
 * Infrastructure Systems:
 * - HVAC Units: Rooftop air handling units with animated fans
 * - Electrical Panels: Main distribution boards with circuit monitoring
 * - Water Treatment: Filtration and recirculation systems
 * - Backup Generators: Emergency power with fuel tanks
 * - Maintenance Robots: Autonomous inspection units with docking stations
 * - Monitoring Systems: Real-time equipment status displays
 *
 * Layout:
 * - HVAC Room: 20m × 15m with 4 large air handlers
 * - Electrical Room: 15m × 12m with multiple distribution panels
 * - Water Treatment: 18m × 15m with tanks and filtration
 * - Generator Room: 20m × 12m with 2 backup generators
 * - Central Monitoring: Integrated BMS displays
 *
 * Performance:
 * - Animated equipment (fans, gauges, robots)
 * - Particle effects for airflow visualization
 * - Status indicators with real-time updates
 * - Optimized instancing for repeated elements
 */

interface MechanicalRoomsProps {
  position: [number, number, number];
  showMetrics?: boolean;
  showLabels?: boolean;
}

// === HVAC COMPONENTS ===

interface AirHandlerUnitProps {
  position: [number, number, number];
  unitId: number;
}

const AirHandlerUnit: React.FC<AirHandlerUnitProps> = ({ position, unitId }) => {
  const fanRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Animate fan rotation and airflow particles
  useFrame((state) => {
    if (fanRef.current) {
      fanRef.current.rotation.z += 0.15;
    }

    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] -= 0.02; // Move particles downward (supply air)
        if (positions[i + 1] < -2) {
          positions[i + 1] = 2; // Reset to top
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  // Airflow particles
  const particles = useMemo(() => {
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }

    return positions;
  }, []);

  const status = useMemo(() => {
    return {
      temp: (18 + unitId * 2).toFixed(1),
      pressure: (450 + unitId * 25).toFixed(0),
      flow: (3200 + unitId * 150).toFixed(0),
      power: (85 + unitId * 3).toFixed(0)
    };
  }, [unitId]);

  return (
    <group position={position}>
      {/* Main AHU housing */}
      <mesh castShadow>
        <boxGeometry args={[4, 3, 2.5]} />
        <meshStandardMaterial
          color="#334155"
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* Equipment label */}
      <mesh position={[0, 1.6, 1.3]}>
        <planeGeometry args={[3, 0.4]} />
        <meshStandardMaterial
          color="#0f172a"
          emissive="#1e293b"
          emissiveIntensity={0.2}
        />
      </mesh>
      <Text
        position={[0, 1.6, 1.31]}
        fontSize={0.2}
        color="#fbbf24"
        anchorX="center"
        anchorY="middle"
      >
        AHU-{unitId + 1}
      </Text>

      {/* Supply fan assembly */}
      <group ref={fanRef} position={[-1, 0.5, 0]}>
        {/* Fan blades */}
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          return (
            <mesh key={i} rotation={[0, 0, angle]}>
              <boxGeometry args={[0.1, 0.8, 0.05]} />
              <meshStandardMaterial color="#475569" metalness={0.7} />
            </mesh>
          );
        })}
        {/* Fan hub */}
        <mesh>
          <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} />
        </mesh>
      </group>

      {/* Exhaust fan */}
      <group ref={fanRef} position={[1, 0.5, 0]} rotation={[0, Math.PI, 0]}>
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          return (
            <mesh key={i} rotation={[0, 0, angle]}>
              <boxGeometry args={[0.1, 0.8, 0.05]} />
              <meshStandardMaterial color="#475569" metalness={0.7} />
            </mesh>
          );
        })}
        <mesh>
          <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} />
        </mesh>
      </group>

      {/* Filter section (visible through grill) */}
      <mesh position={[0, 0, -1.15]}>
        <boxGeometry args={[3.5, 2.5, 0.3]} />
        <meshStandardMaterial
          color="#64748b"
          transparent
          opacity={0.6}
          wireframe
        />
      </mesh>

      {/* Airflow particles */}
      <points ref={particlesRef} position={[0, 0, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.length / 3}
            array={particles}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          color="#60a5fa"
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>

      {/* Control panel */}
      <mesh position={[1.8, 0, 1.3]} rotation={[0, -Math.PI / 6, 0]}>
        <boxGeometry args={[0.6, 1.2, 0.1]} />
        <meshStandardMaterial
          color="#1e293b"
          metalness={0.5}
          roughness={0.4}
        />
      </mesh>

      {/* Status screen */}
      <mesh position={[1.8, 0.3, 1.35]} rotation={[0, -Math.PI / 6, 0]}>
        <planeGeometry args={[0.5, 0.7]} />
        <meshStandardMaterial
          color="#0c4a6e"
          emissive="#075985"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Status indicators */}
      {[-0.4, -0.2, 0, 0.2, 0.4].map((yOffset, i) => (
        <group key={i} position={[1.8, -0.3 + yOffset, 1.35]} rotation={[0, -Math.PI / 6, 0]}>
          <mesh>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial
              color={i < 4 ? "#22c55e" : "#eab308"}
              toneMapped={false}
            />
          </mesh>
          <pointLight
            color={i < 4 ? "#22c55e" : "#eab308"}
            intensity={0.5}
            distance={0.5}
          />
        </group>
      ))}

      {/* Metrics display */}
      <Html
        position={[1.8, 0.3, 1.4]}
        transform
        distanceFactor={3}
        style={{ width: '120px', pointerEvents: 'none' }}
      >
        <div className="bg-slate-900/95 p-2 rounded border border-cyan-500/30 text-xs font-mono">
          <div className="text-cyan-400 font-bold mb-1">AHU-{unitId + 1}</div>
          <div className="space-y-0.5 text-[10px]">
            <div className="flex justify-between">
              <span className="text-slate-400">Temp:</span>
              <span className="text-green-400">{status.temp}°C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Press:</span>
              <span className="text-green-400">{status.pressure} Pa</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Flow:</span>
              <span className="text-green-400">{status.flow} CFM</span>
            </div>
          </div>
        </div>
      </Html>

      {/* Ductwork connections */}
      <mesh position={[0, 1.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 1, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Vibration isolation mounts */}
      {[[-1.8, -1.5, -1], [1.8, -1.5, -1], [-1.8, -1.5, 1], [1.8, -1.5, 1]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.15, 0.2, 0.3, 8]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
};

// === ELECTRICAL COMPONENTS ===

interface ElectricalPanelProps {
  position: [number, number, number];
  panelId: number;
  circuits?: number;
}

const ElectricalPanel: React.FC<ElectricalPanelProps> = ({
  position,
  panelId,
  circuits = 24
}) => {
  const gaugeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (gaugeRef.current) {
      // Subtle needle movement
      const voltage = 415 + Math.sin(state.clock.elapsedTime * 2 + panelId) * 5;
      const normalizedVoltage = (voltage - 400) / 50; // 400-450V range
      gaugeRef.current.rotation.z = -Math.PI / 4 + normalizedVoltage * Math.PI / 2;
    }
  });

  const status = useMemo(() => {
    return {
      voltage: (415 + panelId * 2).toFixed(1),
      current: (285 + panelId * 15).toFixed(1),
      power: (120 + panelId * 8).toFixed(0),
      frequency: "50.0"
    };
  }, [panelId]);

  return (
    <group position={position}>
      {/* Main panel enclosure */}
      <mesh castShadow>
        <boxGeometry args={[2, 3, 0.4]} />
        <meshStandardMaterial
          color="#1e293b"
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Panel door (open) */}
      <mesh position={[1.1, 0, 0]} rotation={[0, Math.PI / 3, 0]} castShadow>
        <boxGeometry args={[2, 3, 0.05]} />
        <meshStandardMaterial color="#334155" metalness={0.5} />
      </mesh>

      {/* Circuit breakers */}
      {Array.from({ length: circuits }).map((_, i) => {
        const row = Math.floor(i / 2);
        const col = i % 2;
        const isOn = i < circuits - 2; // Last 2 are off

        return (
          <group
            key={i}
            position={[-0.4 + col * 0.8, 1.2 - row * 0.25, 0.25]}
          >
            {/* Breaker body */}
            <mesh>
              <boxGeometry args={[0.3, 0.2, 0.15]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
            {/* Breaker switch */}
            <mesh
              position={[0, 0, 0.08]}
              rotation={[isOn ? -0.3 : 0.3, 0, 0]}
            >
              <boxGeometry args={[0.15, 0.08, 0.02]} />
              <meshStandardMaterial color={isOn ? "#22c55e" : "#ef4444"} />
            </mesh>
            {/* Status LED */}
            <mesh position={[0.1, 0.08, 0.08]}>
              <sphereGeometry args={[0.015, 8, 8]} />
              <meshBasicMaterial
                color={isOn ? "#22c55e" : "#64748b"}
                toneMapped={false}
              />
            </mesh>
          </group>
        );
      })}

      {/* Main bus bars (visible copper) */}
      <mesh position={[0, 1.4, 0.15]}>
        <boxGeometry args={[1.6, 0.08, 0.08]} />
        <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Voltage/current meters */}
      <group position={[0, -1, 0.25]}>
        {/* Voltmeter */}
        <mesh position={[-0.5, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.05, 32]} />
          <meshStandardMaterial color="#0f172a" metalness={0.3} />
        </mesh>
        <mesh position={[-0.5, 0, 0.03]}>
          <circleGeometry args={[0.18, 32]} />
          <meshStandardMaterial
            color="#f1f5f9"
            emissive="#94a3b8"
            emissiveIntensity={0.2}
          />
        </mesh>
        {/* Needle */}
        <mesh ref={gaugeRef} position={[-0.5, 0, 0.04]} rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.02, 0.15, 0.01]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>

        {/* Ammeter */}
        <mesh position={[0.5, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.05, 32]} />
          <meshStandardMaterial color="#0f172a" metalness={0.3} />
        </mesh>
        <mesh position={[0.5, 0, 0.03]}>
          <circleGeometry args={[0.18, 32]} />
          <meshStandardMaterial
            color="#f1f5f9"
            emissive="#94a3b8"
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>

      {/* Panel label */}
      <mesh position={[0, 1.6, 0.21]}>
        <planeGeometry args={[1.5, 0.3]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#fbbf24"
          emissiveIntensity={0.3}
        />
      </mesh>
      <Text
        position={[0, 1.6, 0.22]}
        fontSize={0.15}
        color="#0f172a"
        anchorX="center"
        anchorY="middle"
      >
        MDB-{panelId + 1}
      </Text>

      {/* Digital display */}
      <Html
        position={[0, -0.5, 0.25]}
        transform
        distanceFactor={2}
        style={{ width: '140px', pointerEvents: 'none' }}
      >
        <div className="bg-slate-900 p-2 rounded border border-amber-500/40 text-xs font-mono">
          <div className="text-amber-400 font-bold mb-1 text-center">MDB-{panelId + 1}</div>
          <div className="space-y-0.5 text-[10px]">
            <div className="flex justify-between">
              <span className="text-slate-400">V:</span>
              <span className="text-green-400">{status.voltage}V</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">I:</span>
              <span className="text-green-400">{status.current}A</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">kW:</span>
              <span className="text-green-400">{status.power}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Hz:</span>
              <span className="text-green-400">{status.frequency}</span>
            </div>
          </div>
        </div>
      </Html>

      {/* Warning labels */}
      <mesh position={[0.8, -1.3, 0.21]}>
        <planeGeometry args={[0.4, 0.4]} />
        <meshBasicMaterial color="#eab308" />
      </mesh>
      <Text
        position={[0.8, -1.3, 0.22]}
        fontSize={0.25}
        color="#0f172a"
        anchorX="center"
        anchorY="middle"
      >
        ⚡
      </Text>
    </group>
  );
};

// === WATER TREATMENT COMPONENTS ===

const WaterTreatmentSystem: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const pumpRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (pumpRef.current) {
      pumpRef.current.rotation.y = state.clock.elapsedTime * 3;
    }
  });

  return (
    <group position={position}>
      {/* Main storage tank */}
      <mesh castShadow>
        <cylinderGeometry args={[2.5, 2.5, 5, 32]} />
        <meshPhysicalMaterial
          color="#1e40af"
          transparent
          opacity={0.3}
          roughness={0.1}
          metalness={0.1}
          transmission={0.7}
          thickness={0.8}
        />
      </mesh>

      {/* Tank support structure */}
      {Array.from({ length: 4 }).map((_, i) => {
        const angle = (i / 4) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 2.2, -2.5, Math.sin(angle) * 2.2]}
          >
            <cylinderGeometry args={[0.15, 0.15, 5, 8]} />
            <meshStandardMaterial color="#334155" metalness={0.7} />
          </mesh>
        );
      })}

      {/* Water level indicator */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[2.3, 2.3, 0.1, 32]} />
        <meshStandardMaterial
          color="#3b82f6"
          emissive="#60a5fa"
          emissiveIntensity={0.4}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Level sensors */}
      {[2, 1, 0, -1, -2].map((y, i) => (
        <group key={i} position={[2.6, y, 0]}>
          <mesh>
            <boxGeometry args={[0.15, 0.08, 0.08]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0.1, 0, 0]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial
              color={i <= 2 ? "#22c55e" : "#64748b"}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}

      {/* Filtration units */}
      <group position={[4, -1, 0]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0, i * 1.5, 0]} castShadow>
            <cylinderGeometry args={[0.5, 0.5, 1.2, 16]} />
            <meshStandardMaterial
              color="#475569"
              metalness={0.5}
              roughness={0.4}
            />
          </mesh>
        ))}
        {/* Filter labels */}
        <Html
          position={[0.8, 1.5, 0]}
          transform
          distanceFactor={2}
          style={{ pointerEvents: 'none' }}
        >
          <div className="bg-slate-900/90 px-2 py-1 rounded border border-blue-500/30 text-[10px] font-mono text-blue-400">
            FILTERS
          </div>
        </Html>
      </group>

      {/* Circulation pump */}
      <group ref={pumpRef} position={[-4, -1.5, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.6, 0.6, 1.5, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} />
        </mesh>
        {/* Impeller blades */}
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          return (
            <mesh key={i} rotation={[0, angle, 0]}>
              <boxGeometry args={[0.1, 0.5, 0.05]} />
              <meshStandardMaterial color="#334155" metalness={0.8} />
            </mesh>
          );
        })}
        {/* Motor */}
        <mesh position={[0, 1, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.8, 16]} />
          <meshStandardMaterial color="#0f172a" metalness={0.6} />
        </mesh>
        {/* Status light */}
        <mesh position={[0, 1.5, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#22c55e" toneMapped={false} />
        </mesh>
        <pointLight color="#22c55e" intensity={1} distance={2} />
      </group>

      {/* Piping network */}
      {/* Inlet pipe */}
      <mesh position={[0, 2.8, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 4, 8]} />
        <meshStandardMaterial color="#64748b" metalness={0.8} />
      </mesh>
      {/* Outlet pipe */}
      <mesh position={[0, -2.8, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 4, 8]} />
        <meshStandardMaterial color="#64748b" metalness={0.8} />
      </mesh>

      {/* Control panel */}
      <mesh position={[0, -1, 3]} rotation={[Math.PI / 6, 0, 0]} castShadow>
        <boxGeometry args={[1.5, 2, 0.15]} />
        <meshStandardMaterial color="#1e293b" metalness={0.4} />
      </mesh>
      <mesh position={[0, 0, 3.1]} rotation={[Math.PI / 6, 0, 0]}>
        <planeGeometry args={[1.3, 1.5]} />
        <meshStandardMaterial
          color="#0c4a6e"
          emissive="#075985"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* System metrics */}
      <Html
        position={[0, 0, 3.15]}
        transform
        distanceFactor={2.5}
        rotation={[Math.PI / 6, 0, 0]}
        style={{ width: '140px', pointerEvents: 'none' }}
      >
        <div className="bg-slate-900/95 p-2 rounded border border-cyan-500/30 text-xs font-mono">
          <div className="text-cyan-400 font-bold mb-1 text-center">WATER SYSTEM</div>
          <div className="space-y-0.5 text-[10px]">
            <div className="flex justify-between">
              <span className="text-slate-400">Level:</span>
              <span className="text-green-400">78%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Flow:</span>
              <span className="text-green-400">450 L/min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Pressure:</span>
              <span className="text-green-400">3.2 bar</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Quality:</span>
              <span className="text-green-400">Excellent</span>
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
};

// === BACKUP GENERATOR ===

const BackupGenerator: React.FC<{ position: [number, number, number], genId: number }> = ({
  position,
  genId
}) => {
  const exhaustRef = useRef<THREE.Points>(null);
  const engineRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    // Simulated vibration when running
    if (engineRef.current) {
      engineRef.current.position.y = Math.sin(state.clock.elapsedTime * 40) * 0.005;
    }

    // Exhaust particles (when running)
    if (exhaustRef.current) {
      const positions = exhaustRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += 0.03;
        if (positions[i + 1] > 3) {
          positions[i + 1] = 0;
        }
      }
      exhaustRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const exhaustParticles = useMemo(() => {
    const count = 100;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.3;
      positions[i * 3 + 1] = Math.random() * 3;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
    }
    return positions;
  }, []);

  return (
    <group position={position}>
      {/* Generator enclosure */}
      <mesh ref={engineRef} castShadow>
        <boxGeometry args={[3.5, 2, 1.8]} />
        <meshStandardMaterial
          color="#0f172a"
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* Ventilation grills */}
      {[-0.7, 0, 0.7].map((z, i) => (
        <mesh key={i} position={[1.76, 0, z]} rotation={[0, 0, Math.PI / 2]}>
          <planeGeometry args={[0.8, 3]} />
          <meshBasicMaterial color="#334155" wireframe transparent opacity={0.5} />
        </mesh>
      ))}

      {/* Engine block (visible through maintenance hatch) */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[2, 1.2, 1.2]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Alternator */}
      <mesh position={[-1, 0.2, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 1, 16]} />
        <meshStandardMaterial color="#334155" metalness={0.7} />
      </mesh>

      {/* Fuel tank */}
      <mesh position={[0, -1.3, 0]} castShadow>
        <cylinderGeometry args={[1.5, 1.5, 0.6, 32]} />
        <meshStandardMaterial color="#475569" metalness={0.5} />
      </mesh>

      {/* Fuel level indicator */}
      <mesh position={[1.6, -1.3, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 16]} />
        <meshPhysicalMaterial
          color="#fbbf24"
          transparent
          opacity={0.6}
          emissive="#fbbf24"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Exhaust pipe */}
      <mesh position={[1.8, 0.5, 0.6]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 1, 8]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} />
      </mesh>
      <mesh position={[2.4, 0.5, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 1.5, 8]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} />
      </mesh>

      {/* Exhaust particles (heat shimmer) */}
      <points ref={exhaustRef} position={[2.4, 1.2, 0.6]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={exhaustParticles.length / 3}
            array={exhaustParticles}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#94a3b8"
          transparent
          opacity={0.2}
          sizeAttenuation
        />
      </points>

      {/* Control panel */}
      <mesh position={[-1.76, 0.5, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[0.8, 1.2, 0.1]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[-1.81, 0.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.6, 0.9]} />
        <meshStandardMaterial
          color="#0f172a"
          emissive="#1e293b"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Status indicators */}
      {[0.3, 0.15, 0, -0.15].map((y, i) => (
        <group key={i} position={[-1.82, 0.5 + y, -0.2]} rotation={[0, Math.PI / 2, 0]}>
          <mesh>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial
              color={i === 0 ? "#22c55e" : i === 3 ? "#64748b" : "#eab308"}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}

      {/* Generator label and specs */}
      <Html
        position={[0, 1.3, 0]}
        transform
        distanceFactor={3}
        style={{ width: '150px', pointerEvents: 'none' }}
      >
        <div className="bg-slate-900/95 p-2 rounded border border-amber-500/40 text-xs font-mono">
          <div className="text-amber-400 font-bold mb-1 text-center">GEN-{genId + 1}</div>
          <div className="space-y-0.5 text-[10px]">
            <div className="flex justify-between">
              <span className="text-slate-400">Status:</span>
              <span className="text-green-400">STANDBY</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Power:</span>
              <span className="text-green-400">500 kVA</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Fuel:</span>
              <span className="text-green-400">87%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Runtime:</span>
              <span className="text-green-400">12h</span>
            </div>
          </div>
        </div>
      </Html>

      {/* Warning stripes */}
      <mesh position={[0, 1.05, 0.91]}>
        <planeGeometry args={[3, 0.2]} />
        <meshBasicMaterial color="#fbbf24" />
      </mesh>
      <mesh position={[0, 1.05, -0.91]}>
        <planeGeometry args={[3, 0.2]} />
        <meshBasicMaterial color="#fbbf24" />
      </mesh>
    </group>
  );
};

// === MAINTENANCE ROBOT ===

const MaintenanceRobot: React.FC<{ position: [number, number, number], robotId: number }> = ({
  position,
  robotId
}) => {
  const robotRef = useRef<THREE.Group>(null);
  const scannerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (robotRef.current) {
      // Gentle hovering motion
      robotRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + robotId) * 0.05;
    }

    if (scannerRef.current) {
      // Rotating scanner
      scannerRef.current.rotation.y = state.clock.elapsedTime * 2;
    }
  });

  return (
    <group ref={robotRef} position={position}>
      {/* Main body */}
      <mesh castShadow>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color="#f1f5f9"
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>

      {/* Scanner ring */}
      <mesh ref={scannerRef} position={[0, 0, 0]}>
        <torusGeometry args={[0.35, 0.04, 8, 16]} />
        <meshStandardMaterial
          color="#3b82f6"
          emissive="#3b82f6"
          emissiveIntensity={0.8}
          metalness={0.8}
        />
      </mesh>

      {/* Camera/sensor eye */}
      <mesh position={[0, 0, 0.3]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshBasicMaterial color="#0ea5e9" toneMapped={false} />
      </mesh>
      <pointLight position={[0, 0, 0.4]} color="#0ea5e9" intensity={1} distance={2} />

      {/* Propellers/rotors */}
      {[0, Math.PI / 2, Math.PI, 3 * Math.PI / 2].map((angle, i) => (
        <group key={i} position={[Math.cos(angle) * 0.4, 0.2, Math.sin(angle) * 0.4]}>
          <mesh>
            <cylinderGeometry args={[0.05, 0.05, 0.1, 8]} />
            <meshStandardMaterial color="#334155" metalness={0.6} />
          </mesh>
          <mesh position={[0, 0.06, 0]} rotation={[0, state => state.clock.elapsedTime * 10, 0]}>
            <boxGeometry args={[0.15, 0.02, 0.02]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
        </group>
      ))}

      {/* Status indicators */}
      {[-0.15, 0, 0.15].map((x, i) => (
        <mesh key={i} position={[x, -0.2, 0]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial
            color={i === 1 ? "#22c55e" : "#3b82f6"}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Robot ID label */}
      <Html
        position={[0, -0.5, 0]}
        center
        distanceFactor={1.5}
        style={{ pointerEvents: 'none' }}
      >
        <div className="bg-slate-900/90 px-2 py-1 rounded border border-blue-500/40 text-[10px] font-mono text-blue-400 whitespace-nowrap">
          MAINT-{String(robotId + 1).padStart(2, '0')}
        </div>
      </Html>
    </group>
  );
};

// === ROBOT DOCKING STATION ===

const RobotDockingStation: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <group position={position}>
      {/* Docking platform */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <cylinderGeometry args={[1.5, 1.5, 0.1, 32]} />
        <meshStandardMaterial
          color="#1e293b"
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Charging pads */}
      {Array.from({ length: 4 }).map((_, i) => {
        const angle = (i / 4) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.8, 0.06, Math.sin(angle) * 0.8]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <circleGeometry args={[0.25, 16]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#fbbf24"
              emissiveIntensity={0.5}
            />
          </mesh>
        );
      })}

      {/* Central charging column */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 1, 8]} />
        <meshStandardMaterial color="#334155" metalness={0.7} />
      </mesh>

      {/* Status ring */}
      <mesh position={[0, 1.1, 0]}>
        <torusGeometry args={[0.3, 0.05, 8, 16]} />
        <meshStandardMaterial
          color="#22c55e"
          emissive="#22c55e"
          emissiveIntensity={0.6}
        />
      </mesh>
      <pointLight position={[0, 1.1, 0]} color="#22c55e" intensity={0.8} distance={3} />

      {/* Support legs */}
      {Array.from({ length: 3 }).map((_, i) => {
        const angle = (i / 3) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 1.2, -0.3, Math.sin(angle) * 1.2]}
          >
            <cylinderGeometry args={[0.08, 0.1, 0.6, 8]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
        );
      })}
    </group>
  );
};

// === MAIN MECHANICAL ROOMS COMPONENT ===

const MechanicalRooms: React.FC<MechanicalRoomsProps> = ({
  position,
  showMetrics = true,
  showLabels = true
}) => {
  return (
    <group position={position}>
      {/* HVAC Room */}
      <group position={[0, 0, 0]}>
        {/* Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[20, 15]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.2} />
        </mesh>

        {/* Air handlers */}
        <AirHandlerUnit position={[-7, 1.5, -5]} unitId={0} />
        <AirHandlerUnit position={[7, 1.5, -5]} unitId={1} />
        <AirHandlerUnit position={[-7, 1.5, 5]} unitId={2} />
        <AirHandlerUnit position={[7, 1.5, 5]} unitId={3} />

        {showLabels && (
          <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
            <Text
              position={[0, 6, -8]}
              fontSize={1.2}
              color="#fbbf24"
              anchorX="center"
              anchorY="middle"
            >
              HVAC SYSTEMS
            </Text>
          </Float>
        )}
      </group>

      {/* Electrical Room */}
      <group position={[25, 0, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[15, 12]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.3} />
        </mesh>

        {/* Electrical panels */}
        <ElectricalPanel position={[-5, 1.5, -4]} panelId={0} />
        <ElectricalPanel position={[-5, 1.5, 0]} panelId={1} />
        <ElectricalPanel position={[-5, 1.5, 4]} panelId={2} />
        <ElectricalPanel position={[5, 1.5, -4]} panelId={3} />
        <ElectricalPanel position={[5, 1.5, 0]} panelId={4} />
        <ElectricalPanel position={[5, 1.5, 4]} panelId={5} />

        {showLabels && (
          <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
            <Text
              position={[0, 6, -7]}
              fontSize={1.2}
              color="#fbbf24"
              anchorX="center"
              anchorY="middle"
            >
              ELECTRICAL DISTRIBUTION
            </Text>
          </Float>
        )}
      </group>

      {/* Water Treatment Room */}
      <group position={[-25, 0, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[18, 15]} />
          <meshStandardMaterial color="#1e3a5f" roughness={0.4} metalness={0.2} />
        </mesh>

        <WaterTreatmentSystem position={[0, 2.5, 0]} />

        {showLabels && (
          <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
            <Text
              position={[0, 8, -8]}
              fontSize={1.2}
              color="#fbbf24"
              anchorX="center"
              anchorY="middle"
            >
              WATER TREATMENT
            </Text>
          </Float>
        )}
      </group>

      {/* Generator Room */}
      <group position={[0, 0, 20]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[20, 12]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.5} metalness={0.1} />
        </mesh>

        <BackupGenerator position={[-6, 1, 0]} genId={0} />
        <BackupGenerator position={[6, 1, 0]} genId={1} />

        {showLabels && (
          <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
            <Text
              position={[0, 5, -7]}
              fontSize={1.2}
              color="#fbbf24"
              anchorX="center"
              anchorY="middle"
            >
              BACKUP POWER
            </Text>
          </Float>
        )}
      </group>

      {/* Maintenance Robot Area */}
      <group position={[0, 0, -20]}>
        {/* Robot docking stations */}
        <RobotDockingStation position={[-4, 0, 0]} />
        <RobotDockingStation position={[4, 0, 0]} />

        {/* Active maintenance robots */}
        <MaintenanceRobot position={[-4, 1.5, 0]} robotId={0} />
        <MaintenanceRobot position={[8, 2, 5]} robotId={1} />
        <MaintenanceRobot position={[-8, 2.5, -5]} robotId={2} />

        {showLabels && (
          <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
            <Text
              position={[0, 4, -5]}
              fontSize={1.2}
              color="#3b82f6"
              anchorX="center"
              anchorY="middle"
            >
              MAINTENANCE ROBOTS
            </Text>
          </Float>
        )}
      </group>

      {/* Ambient lighting for mechanical areas */}
      <pointLight position={[0, 8, 0]} color="#f8fafc" intensity={1} distance={25} />
      <pointLight position={[25, 8, 0]} color="#fbbf24" intensity={1.2} distance={20} />
      <pointLight position={[-25, 8, 0]} color="#3b82f6" intensity={0.8} distance={20} />
      <pointLight position={[0, 8, 20]} color="#eab308" intensity={0.9} distance={20} />
    </group>
  );
};

export default MechanicalRooms;
