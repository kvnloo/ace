
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Html, 
  Grid, 
  PerspectiveCamera, 
  Environment, 
  Text,
  useCursor,
  ContactShadows,
  Float,
  Line
} from '@react-three/drei';
import * as THREE from 'three';
import { FeatureData } from '../types';
import { Layers, Ruler, Eye, Box, Maximize2 } from 'lucide-react';

// --- Types & Constants ---

type AnnotationMode = 'NONE' | 'LABELS' | 'MEASUREMENTS';
type FloorLevel = 'ALL' | 0 | 1 | 2 | 3;

const FLOOR_HEIGHT = 20;
const BUILDING_WIDTH = 140;
const BUILDING_DEPTH = 120;
const BRAND_YELLOW = "#DFFF4F";

const FEATURES: FeatureData[] = [
  { id: 'ground_tennis', title: 'Ground: Tennis Arena', description: '24 Courts: 6 Hard, 6 Clay, 6 Grass, 6 Wood.', icon: '🎾', position: [0, 5, 20] },
  { id: 'level1_racquet', title: 'L1: Racquet Mezzanine', description: '16 Badminton, 4 Squash, 16 Table Tennis.', icon: '🏸', position: [-20, 25, 0] },
  { id: 'level2_social', title: 'L2: Pickleball & Heritage', description: '8 Pickleball courts and 1 Real Tennis court.', icon: '🏓', position: [20, 45, 0] },
  { id: 'level3_farm', title: 'L3: Vertical Grass Lab', description: '4x 500sqm Autonomous Farming Sectors.', icon: '🌱', position: [0, 65, 0] },
  { id: 'outdoor_plaza', title: 'Outdoor Plaza', description: 'Public courts and relaxation zones.', icon: '🌳', position: [80, 0, 80] },
];

// --- Helper Components ---

const CameraRig = ({ 
    activeFloor, 
    controlsRef, 
    isAnimatingRef 
}: { 
    activeFloor: FloorLevel, 
    controlsRef: React.RefObject<any>, 
    isAnimatingRef: React.MutableRefObject<boolean> 
}) => {
    const targetPos = useRef(new THREE.Vector3(180, 120, 180));
    const targetLookAt = useRef(new THREE.Vector3(0, 40, 0));
  
    useEffect(() => {
      if (activeFloor === 'ALL') {
        targetPos.current.set(180, 120, 180);
        targetLookAt.current.set(0, 40, 0);
      } else {
        const yLevel = activeFloor * FLOOR_HEIGHT;
        // Zoom in closer and match height, coming from a slightly lower angle for immersion
        targetPos.current.set(80, yLevel + 30, 80);
        targetLookAt.current.set(0, yLevel, 0);
      }
      // Start animating whenever the active floor changes
      isAnimatingRef.current = true;
    }, [activeFloor, isAnimatingRef]);
  
    useFrame((state, delta) => {
      // Only animate if the flag is true (user hasn't interrupted)
      if (!isAnimatingRef.current) return;

      const step = 4 * delta; // Animation speed

      // Smoothly interpolate camera position
      state.camera.position.lerp(targetPos.current, step);
      
      // Smoothly interpolate controls target if available
      if (controlsRef.current) {
        controlsRef.current.target.lerp(targetLookAt.current, step);
        controlsRef.current.update();

        // Check if we are close enough to stop animating to save resources/logic
        const distPos = state.camera.position.distanceTo(targetPos.current);
        const distTarget = controlsRef.current.target.distanceTo(targetLookAt.current);
        
        if (distPos < 0.5 && distTarget < 0.5) {
            isAnimatingRef.current = false;
        }
      }
    });
  
    return null;
};

// --- UI Components ---

const ControlsOverlay = ({ 
  activeFloor, 
  setActiveFloor, 
  annotationMode, 
  setAnnotationMode 
}: { 
  activeFloor: FloorLevel, 
  setActiveFloor: (f: FloorLevel) => void,
  annotationMode: AnnotationMode,
  setAnnotationMode: (m: AnnotationMode) => void
}) => {
  return (
    <div className="absolute top-40 left-6 z-10 flex flex-col gap-4 pointer-events-none">
      
      {/* Floor Selector */}
      <div className="bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-white/10 pointer-events-auto shadow-2xl flex flex-col gap-1">
        <div className="px-3 py-2 text-xs font-bold text-white/50 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-3 h-3" /> Floor View
        </div>
        {[
          { id: 3, label: 'L3: Farm' },
          { id: 2, label: 'L2: Social' },
          { id: 1, label: 'L1: Racquet' },
          { id: 0, label: 'G: Tennis' },
          { id: 'ALL', label: 'Full Facility' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveFloor(item.id as FloorLevel)}
            className={`text-left px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeFloor === item.id 
                ? 'bg-tennis-yellow text-tennis-dark shadow-lg' 
                : 'text-white hover:bg-white/10'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Annotation Toggles */}
      <div className="bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-white/10 pointer-events-auto shadow-2xl flex flex-col gap-1">
        <div className="px-3 py-2 text-xs font-bold text-white/50 uppercase tracking-wider flex items-center gap-2">
           <Eye className="w-3 h-3" /> Overlay
        </div>
        <button
            onClick={() => setAnnotationMode('NONE')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${annotationMode === 'NONE' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'}`}
        >
            <Box className="w-4 h-4" /> Clean
        </button>
        <button
            onClick={() => setAnnotationMode('LABELS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${annotationMode === 'LABELS' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'}`}
        >
            <Maximize2 className="w-4 h-4" /> Labels
        </button>
        <button
            onClick={() => setAnnotationMode('MEASUREMENTS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${annotationMode === 'MEASUREMENTS' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'}`}
        >
            <Ruler className="w-4 h-4" /> Dimensions
        </button>
      </div>
    </div>
  );
};

// --- 3D Components ---

interface MarkerProps {
  position: [number, number, number];
  title: string;
  onClick: () => void;
  isSelected: boolean;
  visible: boolean;
}

const Marker: React.FC<MarkerProps> = ({ position, title, onClick, isSelected, visible }) => {
  const [hovered, setHover] = useState(false);
  useCursor(hovered);

  if (!visible) return null;

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0} floatIntensity={1}>
        <mesh 
            onClick={(e) => { e.stopPropagation(); onClick(); }} 
            onPointerOver={() => setHover(true)} 
            onPointerOut={() => setHover(false)}
        >
            <sphereGeometry args={[1.5, 32, 32]} />
            <meshStandardMaterial 
            color={isSelected || hovered ? BRAND_YELLOW : "#ffffff"} 
            emissive={isSelected ? BRAND_YELLOW : "#000"} 
            emissiveIntensity={0.8}
            toneMapped={false}
            />
        </mesh>
      </Float>
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, -2, 0]}>
         <ringGeometry args={[1.6, 2, 32]} />
         <meshBasicMaterial color={isSelected ? BRAND_YELLOW : "#FFF"} transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      <Html distanceFactor={80} zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
        <div 
          className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${isSelected ? 'bg-tennis-yellow text-black scale-110 shadow-[0_0_20px_rgba(223,255,79,0.6)]' : 'bg-slate-900/80 text-white backdrop-blur-md border border-white/20'}`}
        >
          <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-black animate-pulse' : 'bg-tennis-yellow'}`} />
          {title}
        </div>
      </Html>
    </group>
  );
};

const CadDimension = ({ 
    start, 
    end, 
    offsetVec, 
    label 
}: { 
    start: THREE.Vector3, 
    end: THREE.Vector3, 
    offsetVec: THREE.Vector3, 
    label: string 
}) => {
    // Calculate positions in 3D space
    const dimStart = start.clone().add(offsetVec);
    const dimEnd = end.clone().add(offsetVec);
    
    // Extension lines (going slightly past the dimension line)
    const extOverlap = offsetVec.clone().normalize().multiplyScalar(2);
    const ext1End = dimStart.clone().add(extOverlap);
    const ext2End = dimEnd.clone().add(extOverlap);

    // Center for text
    const midPoint = dimStart.clone().add(dimEnd).multiplyScalar(0.5);

    const lineColor = BRAND_YELLOW;

    return (
        <group>
            {/* Extension Lines */}
            <Line points={[start, ext1End]} color={lineColor} opacity={0.3} transparent lineWidth={1} />
            <Line points={[end, ext2End]} color={lineColor} opacity={0.3} transparent lineWidth={1} />
            
            {/* Main Dimension Line */}
            <Line points={[dimStart, dimEnd]} color={lineColor} opacity={1} transparent lineWidth={3} />

            {/* Tick Marks at ends (45 degree slashes) */}
            <mesh position={dimStart} rotation={[0, 0, Math.PI/4]}>
                <boxGeometry args={[0.6, 2.5, 0.1]} />
                <meshBasicMaterial color={lineColor} toneMapped={false} />
            </mesh>
            <mesh position={dimEnd} rotation={[0, 0, Math.PI/4]}>
                <boxGeometry args={[0.6, 2.5, 0.1]} />
                <meshBasicMaterial color={lineColor} toneMapped={false} />
            </mesh>

            {/* Label */}
            <Html position={midPoint} center zIndexRange={[50, 0]} transform sprite>
                <div className="px-4 py-2 bg-black/90 text-lg font-mono font-bold text-tennis-yellow border-2 border-tennis-yellow whitespace-nowrap tracking-widest shadow-[0_0_15px_rgba(223,255,79,0.3)] rounded-md">
                    {label}
                </div>
            </Html>
        </group>
    )
}


// --- Architectural Elements ---

const FloorRibbon = ({ width, depth }: { width: number, depth: number }) => {
    // Creates a smooth white rounded edge around the floor plate
    const shape = useMemo(() => {
        const s = new THREE.Shape();
        const r = 4; // Corner radius
        const w = width / 2;
        const d = depth / 2;
        s.moveTo(-w + r, -d);
        s.lineTo(w - r, -d);
        s.quadraticCurveTo(w, -d, w, -d + r);
        s.lineTo(w, d - r);
        s.quadraticCurveTo(w, d, w - r, d);
        s.lineTo(-w + r, d);
        s.quadraticCurveTo(-w, d, -w, d - r);
        s.lineTo(-w, -d + r);
        s.quadraticCurveTo(-w, -d, -w + r, -d);
        return s;
    }, [width, depth]);

    const extrudeSettings = {
        depth: 1.2, // Height of the ribbon
        bevelEnabled: true,
        bevelThickness: 0.2,
        bevelSize: 0.2,
        bevelSegments: 4
    };

    return (
        <mesh rotation={[Math.PI/2, 0, 0]} position={[0, -0.5, 0]}>
            <extrudeGeometry args={[shape, extrudeSettings]} />
            <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.1} />
        </mesh>
    )
}

const FloorPlate = ({ 
    position, 
    size, 
    level, 
    isActiveFloor, 
    showMeasurements 
}: { 
    position: [number, number, number], 
    size: [number, number], 
    level: number, 
    isActiveFloor: boolean,
    showMeasurements: boolean
}) => {
  const isGround = level === 0;
  
  // Calculations for dimensions
  const width = size[0];
  const depth = size[1];
  
  return (
    <group position={position}>
      {/* Main Floor Surface */}
      <mesh receiveShadow rotation={[-Math.PI/2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial 
            color={isGround ? "#0f172a" : "#f1f5f9"} 
            roughness={0.5} 
            metalness={0.1} 
        />
      </mesh>

      {/* Futuristic Edge Ribbon */}
      <FloorRibbon width={width + 2} depth={depth + 2} />

      {/* Ceiling (Only visible if looking at this floor specifically) */}
      {isActiveFloor && (
          <group position={[0, FLOOR_HEIGHT - 1, 0]}>
               <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[width, depth]} />
                    <meshStandardMaterial color="#f8fafc" emissive="#fff" emissiveIntensity={0.1} />
               </mesh>
               {/* Ceiling Lights */}
               {Array.from({length: 6}).map((_, i) => (
                   <group key={i} position={[-40 + (i%3)*40, -0.5, -30 + Math.floor(i/3)*60]}>
                       <pointLight intensity={0.6} distance={40} decay={2} color="#fff" />
                       <mesh>
                           <cylinderGeometry args={[1, 1, 0.2]} />
                           <meshBasicMaterial color="white" />
                       </mesh>
                   </group>
               ))}
          </group>
      )}

      {/* CAD Dimensions for the whole floor */}
      {showMeasurements && (
          <group position={[0, 1.5, 0]}>
              {/* Width Dimension */}
              <CadDimension 
                start={new THREE.Vector3(-width/2, 0, depth/2)} 
                end={new THREE.Vector3(width/2, 0, depth/2)} 
                offsetVec={new THREE.Vector3(0, 0, 12)} 
                label={`${width}m WIDTH`} 
              />
              {/* Depth Dimension */}
              <CadDimension 
                start={new THREE.Vector3(width/2, 0, -depth/2)} 
                end={new THREE.Vector3(width/2, 0, depth/2)} 
                offsetVec={new THREE.Vector3(12, 0, 0)} 
                label={`${depth}m DEPTH`} 
              />
          </group>
      )}
    </group>
  );
};

// --- Specific Sport Meshes ---

const Net = ({ width }: { width: number }) => (
    <group position={[0, 1, 0]}>
        <mesh position={[-width/2, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 2]} />
            <meshStandardMaterial color="#333" />
        </mesh>
        <mesh position={[width/2, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 2]} />
            <meshStandardMaterial color="#333" />
        </mesh>
        <mesh position={[0, 0, 0]}>
             <boxGeometry args={[width, 1.8, 0.02]} />
             <meshBasicMaterial color="white" transparent opacity={0.3} wireframe />
        </mesh>
    </group>
)

const TennisCourt: React.FC<{ position: [number, number, number], type: 'grass' | 'hard' | 'clay' | 'wood' }> = ({ position, type }) => {
    const colors = { grass: '#4d7c0f', hard: '#3b82f6', clay: '#ea580c', wood: '#d4a373' };
    return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 22]} />
        <meshStandardMaterial color={colors[type]} roughness={type === 'wood' ? 0.2 : 0.8} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[8, 20]} />
        <meshBasicMaterial color="white" wireframe={false} transparent opacity={0.8} />
        <mesh position={[0, 0, 0.01]}>
             <planeGeometry args={[7.8, 19.8]} />
             <meshBasicMaterial color={colors[type]} />
        </mesh>
      </mesh>
      <Net width={10} />
    </group>
  );
};

const BadmintonCourt: React.FC<{ position: [number, number, number] }> = ({ position }) => (
    <group position={position}>
       <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[6, 13]} />
          <meshStandardMaterial color="#059669" />
        </mesh>
        <Net width={6} />
    </group>
  );

const RealTennisCourt: React.FC<{ position: [number, number, number] }> = ({ position }) => (
    <group position={position}>
         <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[12, 24]} />
            <meshStandardMaterial color="#44403c" />
        </mesh>
        <mesh position={[-5, 2, 0]} rotation={[0, 0, 0]}>
            <boxGeometry args={[2, 4, 24]} />
            <meshStandardMaterial color="#1c1917" />
        </mesh>
        <mesh position={[5, 2, 0]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.5, 4, 24]} />
            <meshStandardMaterial color="#1c1917" />
        </mesh>
        <Net width={10} />
    </group>
);

const FarmRack: React.FC<{ position: [number, number, number] }> = ({ position }) => (
    <group position={position}>
        <mesh position={[0, 2, 0]}>
            <boxGeometry args={[30, 4, 10]} />
            <meshStandardMaterial color="#334155" wireframe />
        </mesh>
        {[0.5, 1.5, 2.5, 3.5].map((y, i) => (
            <mesh key={i} position={[0, y, 0]}>
                <boxGeometry args={[29, 0.2, 9]} />
                <meshStandardMaterial color="#22c55e" />
            </mesh>
        ))}
        <pointLight position={[0, 4, 0]} color="#a855f7" intensity={2} distance={15} />
    </group>
)

const Tree: React.FC<{ position: [number, number, number] }> = ({ position }) => (
    <group position={position}>
        <mesh position={[0, 2, 0]}>
            <cylinderGeometry args={[0.2, 0.5, 4]} />
            <meshStandardMaterial color="#78350f" />
        </mesh>
        <mesh position={[0, 4, 0]}>
            <dodecahedronGeometry args={[2]} />
            <meshStandardMaterial color="#15803d" roughness={0.8} />
        </mesh>
    </group>
)

// --- Decorative Architecture ---

const SolarPanel: React.FC<{ position: [number, number, number], rotation?: [number, number, number] }> = ({ position, rotation = [0,0,0] }) => (
    <group position={position} rotation={rotation}>
        <mesh rotation={[-0.2, 0, 0]}>
            <boxGeometry args={[4, 0.2, 6]} />
            <meshStandardMaterial color="#020617" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh rotation={[-0.2, 0, 0]} position={[0, 0.11, 0]}>
            <planeGeometry args={[3.8, 5.8]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.1} />
        </mesh>
    </group>
)

const OrganicStructure = () => {
    const curves = useMemo(() => {
        // Zaha Hadid inspired fluid curves wrapping the building
        const c1 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-75, 0, 65),
            new THREE.Vector3(-85, 20, 65),
            new THREE.Vector3(-75, 40, 55),
            new THREE.Vector3(-65, 80, 50),
        ]);
        
        const c2 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(75, 0, 65),
            new THREE.Vector3(85, 20, 65),
            new THREE.Vector3(75, 40, 55),
            new THREE.Vector3(65, 80, 50),
        ]);

        const c3 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-75, 0, -65),
            new THREE.Vector3(-85, 20, -65),
            new THREE.Vector3(-75, 40, -55),
            new THREE.Vector3(-65, 80, -50),
        ]);
        
        const c4 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(75, 0, -65),
            new THREE.Vector3(85, 20, -65),
            new THREE.Vector3(75, 40, -55),
            new THREE.Vector3(65, 80, -50),
        ]);

        // Roof arches
        const roofArch1 = new THREE.CatmullRomCurve3([
             new THREE.Vector3(-65, 80, 50),
             new THREE.Vector3(0, 90, 0),
             new THREE.Vector3(65, 80, -50),
        ]);
         const roofArch2 = new THREE.CatmullRomCurve3([
             new THREE.Vector3(65, 80, 50),
             new THREE.Vector3(0, 90, 0),
             new THREE.Vector3(-65, 80, -50),
        ]);

        return [c1, c2, c3, c4, roofArch1, roofArch2];
    }, []);

    return (
        <group>
            {curves.map((curve, i) => (
                <mesh key={i} castShadow receiveShadow>
                    <tubeGeometry args={[curve, 64, 2, 8, false]} />
                    <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
                </mesh>
            ))}
        </group>
    );
}

const GreenWallBlock: React.FC<{ position: [number, number, number], args: [number, number, number] }> = ({ position, args }) => (
    <mesh position={position}>
        <boxGeometry args={args} />
        <meshStandardMaterial color="#15803d" roughness={1} />
        {/* Texture simulated with noise or particles in a real app, here simple color */}
        <mesh position={[0, 0, args[2]/2 + 0.1]}>
             <planeGeometry args={[args[0], args[1]]} />
             <meshStandardMaterial color="#16a34a" wireframe transparent opacity={0.2} />
        </mesh>
    </mesh>
)


// --- Floor Layouts ---

const GroundFloor = ({ active, showMeasurements, showLabels }: { active: boolean, showMeasurements: boolean, showLabels: boolean }) => {
    const courts = [];
    for(let i=0; i<24; i++) {
        let type: 'hard' | 'clay' | 'grass' | 'wood' = 'hard';
        if (i >= 6 && i < 12) type = 'clay';
        if (i >= 12 && i < 18) type = 'grass';
        if (i >= 18) type = 'wood';
        const row = Math.floor(i / 6);
        const col = i % 6;
        courts.push(
            <TennisCourt 
                key={i} 
                type={type} 
                position={[-35 + col * 14, 0.1, -40 + row * 26]} 
            />
        );
    }

    // Row Configuration for Dimensions
    const rowConfigs = [
        { z: -40, label: "HARD" },
        { z: -14, label: "CLAY" },
        { z: 12, label: "GRASS" },
        { z: 38, label: "WOOD" },
    ];

    return (
        <group position={[0, 0, 0]}>
            <FloorPlate 
                position={[0, 0, 0]} 
                size={[BUILDING_WIDTH - 10, BUILDING_DEPTH - 10]} 
                level={0} 
                isActiveFloor={active}
                showMeasurements={showMeasurements}
            />
            {courts}
            {/* Pro Shop Area */}
            <mesh position={[0, 3, 55]} castShadow>
                <boxGeometry args={[20, 6, 8]} />
                <meshStandardMaterial color="#0f172a" />
            </mesh>

             {/* Per-Cluster Dimensions */}
             {showMeasurements && rowConfigs.map((row, i) => (
                <group key={i}>
                    {/* Cluster Width (spanning all 6 courts) */}
                    <CadDimension 
                        start={new THREE.Vector3(-40, 0.5, row.z - 12)} 
                        end={new THREE.Vector3(40, 0.5, row.z - 12)} 
                        offsetVec={new THREE.Vector3(0, 0, -3)} 
                        label={`${row.label} 80m`} 
                    />
                    
                    {/* Single Court Dims (Leftmost court) */}
                    <CadDimension 
                        start={new THREE.Vector3(-40, 0.5, row.z + 11)} 
                        end={new THREE.Vector3(-30, 0.5, row.z + 11)} 
                        offsetVec={new THREE.Vector3(0, 0, 2)} 
                        label="10m" 
                    />
                    <CadDimension 
                        start={new THREE.Vector3(-30, 0.5, row.z - 11)} 
                        end={new THREE.Vector3(-30, 0.5, row.z + 11)} 
                        offsetVec={new THREE.Vector3(2, 0, 0)} 
                        label="22m" 
                    />
                </group>
            ))}

            {/* Explicit Labels */}
            {showLabels && rowConfigs.map((row, i) => (
                <Text
                    key={`lbl-${i}`}
                    position={[-55, 1, row.z]}
                    rotation={[-Math.PI / 2, 0, Math.PI / 2]}
                    fontSize={4}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0.1}
                    outlineColor="#000"
                >
                    {row.label} COURTS
                </Text>
            ))}
        </group>
    )
}

const LevelOne = ({ active, showMeasurements }: { active: boolean, showMeasurements: boolean }) => {
    return (
        <group position={[0, FLOOR_HEIGHT, 0]}>
            <FloorPlate 
                position={[0, 0, 0]} 
                size={[BUILDING_WIDTH - 20, BUILDING_DEPTH - 20]} 
                level={1} 
                isActiveFloor={active}
                showMeasurements={showMeasurements}
            />
            {Array.from({length:16}).map((_, i) => (
                <BadmintonCourt key={`b${i}`} position={[-40 + (i%4)*8, 0.1, -30 + Math.floor(i/4)*16]} />
            ))}
            {Array.from({length:4}).map((_, i) => (
                <group key={`s${i}`} position={[0, 2, -20 + i*12]}>
                    <mesh><boxGeometry args={[6, 4, 9]} /><meshPhysicalMaterial transmission={0.6} roughness={0.1} thickness={0.5} color="#fff" /></mesh>
                </group>
            ))}
            {Array.from({length:16}).map((_, i) => (
                 <group key={`tt${i}`} position={[35 + (i%4)*5, 0.8, -30 + Math.floor(i/4)*10]}>
                    <mesh rotation={[-Math.PI/2, 0, 0]}><planeGeometry args={[1.5, 2.7]} /><meshStandardMaterial color="#1e3a8a" /></mesh>
                </group>
            ))}
        </group>
    )
}

const LevelTwo = ({ active, showMeasurements }: { active: boolean, showMeasurements: boolean }) => {
    return (
        <group position={[0, FLOOR_HEIGHT * 2, 0]}>
            <FloorPlate 
                position={[0, 0, 0]} 
                size={[BUILDING_WIDTH - 30, BUILDING_DEPTH - 30]} 
                level={2} 
                isActiveFloor={active}
                showMeasurements={showMeasurements}
            />
            {Array.from({length:8}).map((_, i) => (
               <group key={`p${i}`} position={[-25 + (i%4)*10, 0.1, -15 + Math.floor(i/4)*16]}>
                    <mesh rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[6, 12]} /><meshStandardMaterial color="#8b5cf6" /></mesh>
                    <Net width={6} />
               </group>
            ))}
            <RealTennisCourt position={[30, 0.1, 0]} />
        </group>
    )
}

const LevelThree = ({ active, showMeasurements }: { active: boolean, showMeasurements: boolean }) => {
    return (
         <group position={[0, FLOOR_HEIGHT * 3, 0]}>
            <FloorPlate 
                position={[0, 0, 0]} 
                size={[BUILDING_WIDTH - 20, BUILDING_DEPTH - 20]} 
                level={3} 
                isActiveFloor={active}
                showMeasurements={showMeasurements}
            />
            {Array.from({length:4}).map((_, i) => (
                <FarmRack key={`f${i}`} position={[-30 + (i%2)*60, 0, -20 + Math.floor(i/2)*40]} />
            ))}
             {/* External Green Facades attached to this level */}
             <GreenWallBlock position={[-60, 10, 0]} args={[2, 18, 80]} />
             <GreenWallBlock position={[60, 10, 0]} args={[2, 18, 80]} />
             <GreenWallBlock position={[0, 10, -50]} args={[100, 18, 2]} />
             <GreenWallBlock position={[0, 10, 50]} args={[100, 18, 2]} />
        </group>
    )
}

const BuildingShell = ({ activeFloor }: { activeFloor: FloorLevel }) => {
    const isInternalView = activeFloor !== 'ALL';

    return (
        <group>
            <OrganicStructure />

            {/* Glass Facade Wrap */}
            {!isInternalView && (
                <group position={[0, 40, 0]}>
                     <mesh>
                        <boxGeometry args={[BUILDING_WIDTH - 5, 80, BUILDING_DEPTH - 5]} />
                        <meshPhysicalMaterial 
                            color="#e2e8f0"
                            transmission={0.8}
                            opacity={0.3}
                            transparent
                            roughness={0.1}
                            metalness={0.1}
                            thickness={0.5}
                            side={THREE.DoubleSide}
                        />
                     </mesh>
                </group>
            )}

            {/* Solar Roof */}
            <group position={[0, FLOOR_HEIGHT * 4 + 1, 0]}>
                {Array.from({length: 8}).map((_, i) => (
                    <group key={i} position={[-40 + (i%3)*40, 0, -40 + Math.floor(i/3)*40]}>
                         <SolarPanel position={[0, 0, 0]} rotation={[0, 0, 0]} />
                    </group>
                ))}
            </group>
        </group>
    )
}

// --- Outdoor Environment ---

const CampusGrounds = () => {
    return (
        <group position={[0, -0.1, 0]}>
            {/* Main Plaza Pavement */}
            <mesh rotation={[-Math.PI/2, 0, 0]} receiveShadow>
                <planeGeometry args={[300, 300]} />
                <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
            </mesh>

            {/* Outdoor Courts Feature (from image reference) */}
            <group position={[90, 0.2, 50]}>
                <TennisCourt position={[0, 0, 0]} type="clay" />
                <TennisCourt position={[15, 0, 0]} type="hard" />
                <TennisCourt position={[30, 0, 0]} type="grass" />
            </group>
            
            {/* Trees & Landscaping */}
            {Array.from({length: 15}).map((_, i) => {
                const angle = (i / 15) * Math.PI * 2;
                const r = 110 + Math.random() * 20;
                return <Tree key={i} position={[Math.cos(angle) * r, 0, Math.sin(angle) * r]} />
            })}
        </group>
    )
}


// --- Main Scene ---

interface ThreeSceneProps {
  onFeatureSelect: (feature: FeatureData) => void;
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ onFeatureSelect }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeFloor, setActiveFloor] = useState<FloorLevel>('ALL');
  const [annotationMode, setAnnotationMode] = useState<AnnotationMode>('LABELS');
  const controlsRef = useRef<any>(null);
  const isAnimatingRef = useRef(false);

  const handleSelect = (feature: FeatureData) => {
    setSelectedId(feature.id);
    onFeatureSelect(feature);
    
    if (feature.id.includes('ground')) setActiveFloor(0);
    if (feature.id.includes('level1')) setActiveFloor(1);
    if (feature.id.includes('level2')) setActiveFloor(2);
    if (feature.id.includes('level3')) setActiveFloor(3);
  };

  const showLabels = annotationMode === 'LABELS';
  const showMeasurements = annotationMode === 'MEASUREMENTS';

  return (
    <div className="w-full h-full absolute inset-0">
      <ControlsOverlay 
        activeFloor={activeFloor} 
        setActiveFloor={setActiveFloor} 
        annotationMode={annotationMode}
        setAnnotationMode={setAnnotationMode}
      />

      <Canvas shadows dpr={[1, 1.5]} camera={{ position: [180, 100, 180], fov: 35 }}>
        <CameraRig activeFloor={activeFloor} controlsRef={controlsRef} isAnimatingRef={isAnimatingRef} />
        <PerspectiveCamera makeDefault fov={40} />
        <ambientLight intensity={0.4} />
        <directionalLight 
            position={[-80, 150, 100]} 
            intensity={2} 
            castShadow 
            shadow-mapSize={[2048, 2048]}
        >
            <orthographicCamera attach="shadow-camera" args={[-150, 150, 150, -150]} />
        </directionalLight>
        <Environment preset="park" />

        <group>
            <BuildingShell activeFloor={activeFloor} />
            <CampusGrounds />
            
            {(activeFloor === 'ALL' || activeFloor === 0) && <GroundFloor active={activeFloor === 0} showMeasurements={showMeasurements} showLabels={showLabels} />}
            {(activeFloor === 'ALL' || activeFloor === 1) && <LevelOne active={activeFloor === 1} showMeasurements={showMeasurements} />}
            {(activeFloor === 'ALL' || activeFloor === 2) && <LevelTwo active={activeFloor === 2} showMeasurements={showMeasurements} />}
            {(activeFloor === 'ALL' || activeFloor === 3) && <LevelThree active={activeFloor === 3} showMeasurements={showMeasurements} />}

            {FEATURES.map((f) => {
                let visible = showLabels;
                if (activeFloor !== 'ALL') {
                    if (activeFloor === 0 && !f.id.includes('ground')) visible = false;
                    if (activeFloor === 1 && !f.id.includes('level1')) visible = false;
                    if (activeFloor === 2 && !f.id.includes('level2')) visible = false;
                    if (activeFloor === 3 && !f.id.includes('level3')) visible = false;
                }
                return (
                    <Marker 
                        key={f.id} 
                        position={f.position} 
                        title={f.title} 
                        isSelected={selectedId === f.id}
                        onClick={() => handleSelect(f)}
                        visible={visible}
                    />
                )
            })}

           <ContactShadows position={[0, -0.2, 0]} opacity={0.6} scale={400} blur={3} far={20} color="#000" />
        </group>
        
        <OrbitControls 
          ref={controlsRef}
          enablePan={true} 
          minPolarAngle={0} 
          maxPolarAngle={Math.PI / 2.1}
          minDistance={20}
          maxDistance={400}
          makeDefault
          onStart={() => { isAnimatingRef.current = false; }}
        />
      </Canvas>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/50 text-xs pointer-events-none select-none font-mono text-center">
        ECO-FACILITY VIEWER v3.3 <br/>
        INTERACTIVE ARCHITECTURAL MODEL
      </div>
    </div>
  );
};

export default ThreeScene;
