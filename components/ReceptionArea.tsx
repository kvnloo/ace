import React, { useState, useMemo } from 'react';
import { Html, Text, Float, Line } from '@react-three/drei';
import * as THREE from 'three';

const BRAND_YELLOW = "#DFFF4F";
const FLOOR_HEIGHT = 20;

// --- Reception Desk Component ---
const ReceptionDesk: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const [hovered, setHovered] = useState(false);

  // Curved desk shape using CatmullRom curve
  const deskCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-6, 0, 0),
      new THREE.Vector3(-4, 0, -2),
      new THREE.Vector3(0, 0, -2.5),
      new THREE.Vector3(4, 0, -2),
      new THREE.Vector3(6, 0, 0),
    ]);
  }, []);

  return (
    <group position={position}>
      {/* Main Desk Counter - Curved */}
      <mesh
        castShadow
        receiveShadow
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <tubeGeometry args={[deskCurve, 64, 0.8, 8, false]} />
        <meshStandardMaterial
          color={hovered ? BRAND_YELLOW : "#1e293b"}
          roughness={0.3}
          metalness={0.6}
          emissive={hovered ? BRAND_YELLOW : "#334155"}
          emissiveIntensity={hovered ? 0.2 : 0.05}
        />
      </mesh>

      {/* Desk Top Surface */}
      <mesh position={[0, 1.2, -1.2]} rotation={[-0.05, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[12.5, 0.15, 2.8]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.15}
          metalness={0.8}
        />
      </mesh>

      {/* LED Accent Strip under desk */}
      <mesh position={[0, 0.3, -1.2]}>
        <boxGeometry args={[12, 0.05, 2.5]} />
        <meshStandardMaterial
          color={BRAND_YELLOW}
          emissive={BRAND_YELLOW}
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </mesh>
      <pointLight position={[0, 0.3, -1.2]} color={BRAND_YELLOW} intensity={3} distance={8} decay={2} />

      {/* Computer Monitors (3 workstations) */}
      {[-4, 0, 4].map((x, i) => (
        <group key={i} position={[x, 1.35, -1.2]}>
          {/* Monitor Stand */}
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.08, 0.12, 0.6, 16]} />
            <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Monitor Screen */}
          <mesh position={[0, 0.9, -0.2]} rotation={[-0.1, 0, 0]} castShadow>
            <boxGeometry args={[1.2, 0.7, 0.05]} />
            <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.9} />
          </mesh>
          {/* Screen Display */}
          <mesh position={[0, 0.9, -0.17]} rotation={[-0.1, 0, 0]}>
            <planeGeometry args={[1.15, 0.65]} />
            <meshBasicMaterial color="#1e40af" emissive="#1e40af" emissiveIntensity={0.3} />
          </mesh>
        </group>
      ))}

      {/* Logo on desk front */}
      <Text
        position={[0, 0.5, 0.2]}
        fontSize={0.6}
        color={BRAND_YELLOW}
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
        letterSpacing={0.1}
      >
        ACE RECEPTION
      </Text>

      {/* Welcome signage above desk */}
      <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.2}>
        <group position={[0, 3, -2]}>
          <mesh castShadow>
            <boxGeometry args={[10, 1.5, 0.15]} />
            <meshStandardMaterial
              color="#0f172a"
              roughness={0.2}
              metalness={0.7}
            />
          </mesh>
          <Text
            position={[0, 0, 0.1]}
            fontSize={0.8}
            color="white"
            anchorX="center"
            anchorY="middle"
            font="/fonts/inter-bold.woff"
            letterSpacing={0.08}
          >
            WELCOME TO ACE
          </Text>
        </group>
      </Float>
    </group>
  );
};

// --- Self-Service Kiosk Component ---
const CheckInKiosk: React.FC<{ position: [number, number, number], number: number }> = ({ position, number }) => {
  const [active, setActive] = useState(false);

  return (
    <group
      position={position}
      onPointerOver={() => setActive(true)}
      onPointerOut={() => setActive(false)}
    >
      {/* Kiosk Base */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.5, 1, 16]} />
        <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Kiosk Post */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 2, 12]} />
        <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Touch Screen */}
      <group position={[0, 2.2, 0]} rotation={[0, 0, 0]}>
        {/* Screen Frame */}
        <mesh castShadow>
          <boxGeometry args={[1.6, 2.4, 0.08]} />
          <meshStandardMaterial
            color={active ? BRAND_YELLOW : "#1e293b"}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
        {/* Active Screen */}
        <mesh position={[0, 0, 0.05]}>
          <planeGeometry args={[1.5, 2.3]} />
          <meshStandardMaterial
            color={active ? "#3b82f6" : "#0f172a"}
            emissive={active ? "#3b82f6" : "#1e293b"}
            emissiveIntensity={active ? 0.5 : 0.1}
          />
        </mesh>
        {/* Kiosk Number */}
        <Text
          position={[0, 0, 0.06]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-bold.woff"
        >
          {active ? 'TAP TO CHECK IN' : `KIOSK ${number}`}
        </Text>
      </group>

      {/* Status Light */}
      <mesh position={[0, 3.6, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={active ? "#22c55e" : "#64748b"}
          emissive={active ? "#22c55e" : "#000"}
          emissiveIntensity={active ? 1 : 0}
        />
      </mesh>
      {active && <pointLight position={[0, 3.6, 0]} color="#22c55e" intensity={2} distance={3} />}
    </group>
  );
};

// --- Waiting Area Seating ---
const WaitingBench: React.FC<{ position: [number, number, number], rotation?: [number, number, number], seats: number }> = ({
  position,
  rotation = [0, 0, 0],
  seats = 3
}) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Bench Frame */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[seats * 0.8, 0.5, 0.8]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.4} />
      </mesh>

      {/* Individual Seat Cushions */}
      {Array.from({ length: seats }).map((_, i) => (
        <mesh
          key={i}
          position={[-((seats - 1) * 0.8) / 2 + i * 0.8, 0.55, 0]}
          castShadow
        >
          <boxGeometry args={[0.7, 0.1, 0.7]} />
          <meshStandardMaterial color={BRAND_YELLOW} roughness={0.7} metalness={0.1} />
        </mesh>
      ))}

      {/* Backrest */}
      <mesh position={[0, 0.75, -0.35]} castShadow receiveShadow>
        <boxGeometry args={[seats * 0.8, 0.8, 0.1]} />
        <meshStandardMaterial color="#334155" roughness={0.5} metalness={0.5} />
      </mesh>

      {/* Armrests */}
      <mesh position={[-seats * 0.4, 0.5, 0]} castShadow>
        <boxGeometry args={[0.1, 0.6, 0.6]} />
        <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[seats * 0.4, 0.5, 0]} castShadow>
        <boxGeometry args={[0.1, 0.6, 0.6]} />
        <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.6} />
      </mesh>
    </group>
  );
};

// --- Wayfinding Display ---
const WayfindingDisplay: React.FC<{ position: [number, number, number], rotation?: [number, number, number] }> = ({
  position,
  rotation = [0, 0, 0]
}) => {
  const [activeSection, setActiveSection] = useState(0);

  const sections = [
    { level: 'GROUND', name: 'Tennis Arena', icon: '🎾' },
    { level: 'L1', name: 'Racquet Sports', icon: '🏸' },
    { level: 'L2', name: 'Pickleball & Heritage', icon: '🏓' },
    { level: 'L3', name: 'Vertical Farm', icon: '🌱' },
  ];

  return (
    <group position={position} rotation={rotation}>
      {/* Display Stand */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 3, 12]} />
        <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Main Display Panel */}
      <group position={[0, 3.5, 0]}>
        <mesh castShadow>
          <boxGeometry args={[3, 4, 0.1]} />
          <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.9} />
        </mesh>

        {/* Screen Surface */}
        <mesh position={[0, 0, 0.06]}>
          <planeGeometry args={[2.8, 3.8]} />
          <meshStandardMaterial
            color="#1e293b"
            emissive="#1e40af"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Header */}
        <Text
          position={[0, 1.6, 0.07]}
          fontSize={0.25}
          color={BRAND_YELLOW}
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-bold.woff"
          letterSpacing={0.15}
        >
          FACILITY DIRECTORY
        </Text>

        {/* Level Listings */}
        {sections.map((section, i) => (
          <group
            key={i}
            position={[0, 0.9 - i * 0.6, 0.07]}
            onPointerOver={() => setActiveSection(i)}
          >
            <Text
              fontSize={0.18}
              color={activeSection === i ? BRAND_YELLOW : 'white'}
              anchorX="left"
              anchorY="middle"
              position={[-1.2, 0, 0]}
              font="/fonts/inter-bold.woff"
            >
              {section.icon} {section.level}
            </Text>
            <Text
              fontSize={0.14}
              color={activeSection === i ? 'white' : '#94a3b8'}
              anchorX="left"
              anchorY="middle"
              position={[-0.4, 0, 0]}
              font="/fonts/inter-bold.woff"
            >
              {section.name}
            </Text>
          </group>
        ))}
      </group>

      {/* Directional Arrow Base */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 1, 16]} />
        <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.6} />
      </mesh>
    </group>
  );
};

// --- Retail Display Case ---
const RetailDisplay: React.FC<{ position: [number, number, number], rotation?: [number, number, number] }> = ({
  position,
  rotation = [0, 0, 0]
}) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Display Case Base */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 1, 1.5]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Glass Display Top */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 1, 1.5]} />
        <meshPhysicalMaterial
          color="#f8fafc"
          transmission={0.9}
          opacity={0.3}
          transparent
          roughness={0.05}
          metalness={0.1}
          thickness={0.5}
          ior={1.5}
        />
      </mesh>

      {/* Display Items (Racquets, Apparel, etc) */}
      {[-0.8, 0, 0.8].map((x, i) => (
        <group key={i} position={[x, 1.2, 0]}>
          {/* Generic product placeholder */}
          <mesh castShadow>
            <boxGeometry args={[0.4, 0.6, 0.05]} />
            <meshStandardMaterial color={i === 1 ? BRAND_YELLOW : '#3b82f6'} roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* LED Shelf Lighting */}
      <mesh position={[0, 0.95, 0.7]}>
        <boxGeometry args={[2.9, 0.03, 0.03]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
      <pointLight position={[0, 1, 0.7]} color="#ffffff" intensity={5} distance={2.5} decay={2} />

      {/* Price Tag / Label */}
      <Html position={[0, 0.3, 0.8]} center>
        <div className="px-3 py-1.5 bg-black/90 text-tennis-yellow text-xs font-bold border border-tennis-yellow rounded whitespace-nowrap">
          PRO SHOP
        </div>
      </Html>
    </group>
  );
};

// --- Coffee/Refreshment Bar ---
const RefreshmentBar: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <group position={position}>
      {/* Bar Counter */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 1, 1.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.7} />
      </mesh>

      {/* Bar Top */}
      <mesh position={[0, 1.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.1, 0.1, 1.3]} />
        <meshStandardMaterial color="#1e293b" roughness={0.15} metalness={0.85} />
      </mesh>

      {/* Coffee Machine */}
      <group position={[-1.2, 1.3, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.6, 0.8, 0.5]} />
          <meshStandardMaterial color="#374151" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Status Light */}
        <mesh position={[0, 0.45, 0.26]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshStandardMaterial
            color="#22c55e"
            emissive="#22c55e"
            emissiveIntensity={1.5}
          />
        </mesh>
      </group>

      {/* Display Shelves */}
      {[-0.3, 0.3].map((z, i) => (
        <mesh key={i} position={[0.8, 1.5, z]} castShadow>
          <boxGeometry args={[1.5, 0.05, 0.4]} />
          <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.6} />
        </mesh>
      ))}

      {/* Menu Board Above */}
      <mesh position={[0, 2.5, -0.7]} castShadow>
        <boxGeometry args={[3.5, 1.2, 0.08]} />
        <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.7} />
      </mesh>
      <mesh position={[0, 2.5, -0.65]}>
        <planeGeometry args={[3.3, 1.1]} />
        <meshStandardMaterial
          color="#1e293b"
          emissive="#1e40af"
          emissiveIntensity={0.15}
        />
      </mesh>

      <Text
        position={[0, 2.5, -0.6]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        REFRESHMENTS
      </Text>
    </group>
  );
};

// --- Main Reception Area Assembly ---
export const ReceptionArea: React.FC<{
  showMeasurements?: boolean,
  showLabels?: boolean
}> = ({
  showMeasurements = false,
  showLabels = true
}) => {
  // Reception area positioned on south facade, ground floor
  const basePosition: [number, number, number] = [0, 0.1, -55];

  return (
    <group position={basePosition}>
      {/* Floor Surface - Polished */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 15]} />
        <meshStandardMaterial
          color="#f1f5f9"
          roughness={0.1}
          metalness={0.8}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Reception Desk - Central */}
      <ReceptionDesk position={[0, 0, 2]} />

      {/* Check-in Kiosks - Left Side */}
      <group position={[-7, 0, -2]}>
        <CheckInKiosk position={[0, 0, 0]} number={1} />
        <CheckInKiosk position={[2.5, 0, 0]} number={2} />
      </group>

      {/* Waiting Area - Right Side */}
      <group position={[6, 0, -2]}>
        <WaitingBench position={[0, 0, 0]} seats={4} rotation={[0, Math.PI / 2, 0]} />
        <WaitingBench position={[0, 0, 3]} seats={4} rotation={[0, Math.PI / 2, 0]} />

        {/* Coffee Table */}
        <mesh position={[1.5, 0.25, 1.5]} castShadow>
          <cylinderGeometry args={[0.8, 0.8, 0.5, 16]} />
          <meshStandardMaterial color="#334155" roughness={0.2} metalness={0.7} />
        </mesh>
        <mesh position={[1.5, 0.55, 1.5]} castShadow>
          <cylinderGeometry args={[0.9, 0.9, 0.05, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.1} metalness={0.9} />
        </mesh>
      </group>

      {/* Wayfinding Displays - Strategic Positions */}
      <WayfindingDisplay position={[-9, 0, 5]} rotation={[0, Math.PI / 4, 0]} />
      <WayfindingDisplay position={[9, 0, 5]} rotation={[0, -Math.PI / 4, 0]} />

      {/* Retail Area - Back Wall */}
      <group position={[0, 0, 6]}>
        <RetailDisplay position={[-5, 0, 0]} />
        <RetailDisplay position={[0, 0, 0]} />
        <RetailDisplay position={[5, 0, 0]} />

        {/* Retail Signage */}
        <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.15}>
          <group position={[0, 3.5, 0]}>
            <mesh castShadow>
              <boxGeometry args={[8, 1, 0.1]} />
              <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.7} />
            </mesh>
            <Text
              position={[0, 0, 0.08]}
              fontSize={0.5}
              color={BRAND_YELLOW}
              anchorX="center"
              anchorY="middle"
              font="/fonts/inter-bold.woff"
              letterSpacing={0.12}
            >
              ACE PRO SHOP
            </Text>
          </group>
        </Float>
      </group>

      {/* Refreshment Bar - Left Wall */}
      <RefreshmentBar position={[-8, 0, 0]} />

      {/* Ambient Ceiling Lights */}
      {Array.from({ length: 6 }).map((_, i) => (
        <group key={i} position={[-6 + (i % 3) * 6, 5, -4 + Math.floor(i / 3) * 8]}>
          <pointLight intensity={8} distance={12} decay={2} color="#f8fafc" castShadow />
          <mesh>
            <cylinderGeometry args={[0.4, 0.4, 0.1]} />
            <meshBasicMaterial color="white" />
          </mesh>
        </group>
      ))}

      {/* Floor Boundary Markers (if measurements enabled) */}
      {showMeasurements && (
        <group>
          {/* Dimension Lines */}
          <Line
            points={[
              new THREE.Vector3(-10, 0.05, -7.5),
              new THREE.Vector3(10, 0.05, -7.5),
            ]}
            color={BRAND_YELLOW}
            lineWidth={2}
          />
          <Html position={[0, 0.5, -8]} center>
            <div className="px-3 py-1 bg-black/90 text-tennis-yellow text-sm font-mono font-bold border border-tennis-yellow rounded">
              20m WIDTH
            </div>
          </Html>

          <Line
            points={[
              new THREE.Vector3(10.5, 0.05, -7.5),
              new THREE.Vector3(10.5, 0.05, 7.5),
            ]}
            color={BRAND_YELLOW}
            lineWidth={2}
          />
          <Html position={[11.5, 0.5, 0]} center>
            <div className="px-3 py-1 bg-black/90 text-tennis-yellow text-sm font-mono font-bold border border-tennis-yellow rounded">
              15m DEPTH
            </div>
          </Html>

          <Html position={[0, 4.5, 0]} center>
            <div className="px-3 py-1 bg-black/90 text-tennis-yellow text-sm font-mono font-bold border border-tennis-yellow rounded">
              8m HEIGHT
            </div>
          </Html>
        </group>
      )}

      {/* Zone Labels (if labels enabled) */}
      {showLabels && (
        <group>
          <Html position={[0, 1.5, 2]} center>
            <div className="px-4 py-2 bg-slate-900/90 backdrop-blur-md text-white text-sm font-bold border border-white/20 rounded-lg shadow-xl">
              📍 RECEPTION DESK
            </div>
          </Html>
          <Html position={[-7, 1.5, -2]} center>
            <div className="px-4 py-2 bg-slate-900/90 backdrop-blur-md text-white text-sm font-bold border border-white/20 rounded-lg shadow-xl">
              🖥️ CHECK-IN KIOSKS
            </div>
          </Html>
          <Html position={[6, 1.5, 1.5]} center>
            <div className="px-4 py-2 bg-slate-900/90 backdrop-blur-md text-white text-sm font-bold border border-white/20 rounded-lg shadow-xl">
              💺 WAITING AREA
            </div>
          </Html>
          <Html position={[0, 2, 6]} center>
            <div className="px-4 py-2 bg-slate-900/90 backdrop-blur-md text-white text-sm font-bold border border-white/20 rounded-lg shadow-xl">
              🛍️ RETAIL AREA
            </div>
          </Html>
        </group>
      )}

      {/* Entrance Doors - South Facade Connection */}
      <group position={[0, 0, -7]}>
        {/* Double Doors */}
        {[-2, 2].map((x, i) => (
          <mesh key={i} position={[x, 2, 0]} castShadow>
            <boxGeometry args={[1.8, 4, 0.1]} />
            <meshPhysicalMaterial
              color="#1e293b"
              transmission={0.6}
              opacity={0.4}
              transparent
              roughness={0.05}
              metalness={0.8}
              thickness={0.3}
            />
          </mesh>
        ))}

        {/* Door Frame */}
        <mesh position={[0, 2, 0]} castShadow>
          <boxGeometry args={[5, 4.2, 0.3]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Entry Signage Above Doors */}
        <Float speed={1.5} rotationIntensity={0.08} floatIntensity={0.25}>
          <group position={[0, 5, 0.2]}>
            <mesh castShadow>
              <boxGeometry args={[6, 1.2, 0.15]} />
              <meshStandardMaterial
                color="#0f172a"
                roughness={0.2}
                metalness={0.7}
              />
            </mesh>
            <Text
              position={[0, 0, 0.1]}
              fontSize={0.6}
              color={BRAND_YELLOW}
              anchorX="center"
              anchorY="middle"
              font="/fonts/inter-bold.woff"
              letterSpacing={0.15}
            >
              MAIN ENTRANCE
            </Text>
            {/* LED Halo Effect */}
            <pointLight position={[0, 0, 0.5]} color={BRAND_YELLOW} intensity={15} distance={8} decay={2} />
          </group>
        </Float>
      </group>

      {/* Floor Mat/Carpet */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -4]} receiveShadow>
        <planeGeometry args={[12, 6]} />
        <meshStandardMaterial color="#334155" roughness={0.9} />
      </mesh>
    </group>
  );
};

export default ReceptionArea;
