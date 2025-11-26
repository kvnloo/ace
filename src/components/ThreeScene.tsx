
import React, { useState, useEffect, useRef, useMemo, lazy, Suspense, useCallback } from 'react';
import { Canvas, useFrame, useThree, invalidate } from '@react-three/fiber';
import { useLoading } from './loading/LoadingProvider';

// Lazy load heavy components for better initial bundle size and performance
const InstancedTennisCourts = lazy(() => import('./InstancedTennisCourts'));
const InstancedTennisCourtsFull = lazy(() => import('./InstancedTennisCourtsFull'));
const InstancedBadmintonCourts = lazy(() => import('./InstancedBadmintonCourts'));
const InstancedPickleballCourts = lazy(() => import('./InstancedPickleballCourts'));
const InstancedFarmRacks = lazy(() => import('./InstancedFarmRacks'));
const InstancedTrees = lazy(() => import('./InstancedTrees'));
import {
    PerformanceMonitor,
    OrbitControls,
    Html,
    Grid,
    PerspectiveCamera,
    Environment,
    Text,
    useCursor,
    ContactShadows,
    Line
} from '@react-three/drei';
import * as THREE from 'three';
import { FeatureData, ShadowQuality } from '../types';
import { Layers, Ruler, Eye, Box, Maximize2 } from 'lucide-react';
import PerformanceOverlay from './PerformanceOverlay';

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
                        className={`text-left px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeFloor === item.id
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

// Shared marker geometry and materials - created once, reused
const markerSphereGeometry = new THREE.SphereGeometry(1.5, 16, 16); // Reduced segments
const markerRingGeometry = new THREE.RingGeometry(1.6, 2, 16); // Reduced segments

const Marker: React.FC<MarkerProps> = ({ position, title, onClick, isSelected, visible }) => {
    const [hovered, setHover] = useState(false);
    useCursor(hovered);

    // Memoize material to prevent recreation
    const sphereMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: isSelected || hovered ? BRAND_YELLOW : "#ffffff",
        emissive: isSelected ? BRAND_YELLOW : "#000",
        emissiveIntensity: 0.8,
        toneMapped: false
    }), [isSelected, hovered]);

    const ringMaterial = useMemo(() => new THREE.MeshBasicMaterial({
        color: isSelected ? BRAND_YELLOW : "#FFF",
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
    }), [isSelected]);

    if (!visible) return null;

    return (
        <group position={position}>
            {/* Removed Float wrapper - saves animation overhead */}
            <mesh
                onClick={(e) => { e.stopPropagation(); onClick(); }}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
                geometry={markerSphereGeometry}
                material={sphereMaterial}
            />
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, -2, 0]}
                geometry={markerRingGeometry}
                material={ringMaterial}
            />
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
            <mesh position={dimStart} rotation={[0, 0, Math.PI / 4]}>
                <boxGeometry args={[0.6, 2.5, 0.1]} />
                <meshBasicMaterial color={lineColor} toneMapped={false} />
            </mesh>
            <mesh position={dimEnd} rotation={[0, 0, Math.PI / 4]}>
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
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
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
            <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
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
                    {Array.from({ length: 6 }).map((_, i) => (
                        <group key={i} position={[-40 + (i % 3) * 40, -0.5, -30 + Math.floor(i / 3) * 60]}>
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
                        start={new THREE.Vector3(-width / 2, 0, depth / 2)}
                        end={new THREE.Vector3(width / 2, 0, depth / 2)}
                        offsetVec={new THREE.Vector3(0, 0, 12)}
                        label={`${width}m WIDTH`}
                    />
                    {/* Depth Dimension */}
                    <CadDimension
                        start={new THREE.Vector3(width / 2, 0, -depth / 2)}
                        end={new THREE.Vector3(width / 2, 0, depth / 2)}
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
        <mesh position={[-width / 2, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 2]} />
            <meshStandardMaterial color="#333" />
        </mesh>
        <mesh position={[width / 2, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 2]} />
            <meshStandardMaterial color="#333" />
        </mesh>
        <mesh position={[0, 0, 0]}>
            <boxGeometry args={[width, 1.8, 0.02]} />
            <meshBasicMaterial color="white" transparent opacity={0.3} wireframe />
        </mesh>
    </group>
)



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

// Removed individual FarmRack and Tree components - now using instanced versions

// --- Decorative Architecture ---

const SolarPanel: React.FC<{ position: [number, number, number], rotation?: [number, number, number] }> = ({ position, rotation = [0, 0, 0] }) => (
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
        <mesh position={[0, 0, args[2] / 2 + 0.1]}>
            <planeGeometry args={[args[0], args[1]]} />
            <meshStandardMaterial color="#16a34a" wireframe transparent opacity={0.2} />
        </mesh>
    </mesh>
)


// --- Floor Layouts ---

const GroundFloor = ({ active, showMeasurements, showLabels }: { active: boolean, showMeasurements: boolean, showLabels: boolean }) => {
    // Pre-compute court configurations for instanced rendering
    const courtConfigs = useMemo(() => {
        const configs: Array<{ position: [number, number, number]; type: 'hard' | 'clay' | 'grass' | 'wood' }> = [];
        for (let i = 0; i < 24; i++) {
            let type: 'hard' | 'clay' | 'grass' | 'wood' = 'hard';
            if (i >= 6 && i < 12) type = 'clay';
            if (i >= 12 && i < 18) type = 'grass';
            if (i >= 18) type = 'wood';
            const row = Math.floor(i / 6);
            const col = i % 6;
            configs.push({
                type,
                position: [-35 + col * 14, 0.1, -40 + row * 26]
            });
        }
        return configs;
    }, []);

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
            {/* Use instanced tennis courts for massive performance gain */}
            <Suspense fallback={null}>
                <InstancedTennisCourtsFull courts={courtConfigs} enableEffects={true} />
            </Suspense>
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

// Pre-compute badminton court positions for instancing
const badmintonCourtConfigs: Array<{ position: [number, number, number] }> = Array.from({ length: 16 }).map((_, i) => ({
    position: [-40 + (i % 4) * 8, 0.1, -30 + Math.floor(i / 4) * 16]
}));

// Shared geometry for table tennis tables
const tableTennisGeometry = new THREE.PlaneGeometry(1.5, 2.7);
const tableTennisMaterial = new THREE.MeshStandardMaterial({ color: '#1e3a8a' });

// Shared geometry for squash courts
const squashGeometry = new THREE.BoxGeometry(6, 4, 9);
const squashMaterial = new THREE.MeshPhysicalMaterial({ transmission: 0.6, roughness: 0.1, thickness: 0.5, color: '#fff' });

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
            {/* Instanced badminton courts - 16 courts in 4 draw calls */}
            <Suspense fallback={null}>
                <InstancedBadmintonCourts courts={badmintonCourtConfigs} />
            </Suspense>
            {/* Squash courts - using shared geometry/material */}
            {Array.from({ length: 4 }).map((_, i) => (
                <group key={`s${i}`} position={[0, 2, -20 + i * 12]}>
                    <mesh geometry={squashGeometry} material={squashMaterial} />
                </group>
            ))}
            {/* Table tennis tables - using shared geometry/material */}
            {Array.from({ length: 16 }).map((_, i) => (
                <mesh
                    key={`tt${i}`}
                    position={[35 + (i % 4) * 5, 0.8, -30 + Math.floor(i / 4) * 10]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    geometry={tableTennisGeometry}
                    material={tableTennisMaterial}
                />
            ))}
        </group>
    )
}

// Pre-compute pickleball court configurations for instancing
const pickleballCourtConfigs: Array<{ position: [number, number, number] }> = Array.from({ length: 8 }).map((_, i) => ({
    position: [-25 + (i % 4) * 10, 0.1, -15 + Math.floor(i / 4) * 16]
}));

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
            {/* Use instanced pickleball courts for performance */}
            <Suspense fallback={null}>
                <InstancedPickleballCourts courts={pickleballCourtConfigs} />
            </Suspense>
            <RealTennisCourt position={[30, 0.1, 0]} />
        </group>
    )
}

// Pre-compute farm rack configurations for instancing
const farmRackConfigs: Array<{ position: [number, number, number] }> = Array.from({ length: 4 }).map((_, i) => ({
    position: [-30 + (i % 2) * 60, 0, -20 + Math.floor(i / 2) * 40]
}));

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
            {/* Use instanced farm racks for performance */}
            <Suspense fallback={null}>
                <InstancedFarmRacks racks={farmRackConfigs} />
            </Suspense>
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
                {Array.from({ length: 8 }).map((_, i) => (
                    <group key={i} position={[-40 + (i % 3) * 40, 0, -40 + Math.floor(i / 3) * 40]}>
                        <SolarPanel position={[0, 0, 0]} rotation={[0, 0, 0]} />
                    </group>
                ))}
            </group>
        </group>
    )
}

// --- Outdoor Environment ---

// Pre-compute outdoor court configs and tree positions once
const outdoorCourtConfigs: Array<{ position: [number, number, number]; type: 'hard' | 'clay' | 'grass' | 'wood' }> = [
    { position: [90, 0.2, 50], type: 'clay' },
    { position: [105, 0.2, 50], type: 'hard' },
    { position: [120, 0.2, 50], type: 'grass' }
];

// Pre-compute tree positions (avoid Math.random in render)
const treePositions: [number, number, number][] = Array.from({ length: 15 }).map((_, i) => {
    const angle = (i / 15) * Math.PI * 2;
    const r = 110 + (i * 1.3) % 20; // Deterministic pseudo-random
    return [Math.cos(angle) * r, 0, Math.sin(angle) * r];
});

// Shared geometry for plaza
const plazaGeometry = new THREE.PlaneGeometry(300, 300);
const plazaMaterial = new THREE.MeshStandardMaterial({ color: '#e2e8f0', roughness: 0.8 });

const CampusGrounds = () => {
    return (
        <group position={[0, -0.1, 0]}>
            {/* Main Plaza Pavement - use shared geometry/material */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow geometry={plazaGeometry} material={plazaMaterial} />

            {/* Outdoor Courts - use instanced rendering */}
            <Suspense fallback={null}>
                <InstancedTennisCourts courts={outdoorCourtConfigs} />
            </Suspense>

            {/* Trees & Landscaping - use instanced rendering */}
            <Suspense fallback={null}>
                <InstancedTrees trees={treePositions.map(pos => ({ position: pos }))} />
            </Suspense>
        </group>
    )
}


// --- Main Scene ---

interface ThreeSceneProps {
    onFeatureSelect: (feature: FeatureData) => void;
    shadowQuality?: ShadowQuality;
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ onFeatureSelect, shadowQuality: initialShadowQuality = 'high' }) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [activeFloor, setActiveFloor] = useState<FloorLevel>('ALL');
    const [performanceMode, setPerformanceMode] = useState<'high' | 'medium' | 'low'>('high');
    const [shadowQuality, setShadowQuality] = useState<ShadowQuality>(initialShadowQuality);
    const [annotationMode, setAnnotationMode] = useState<AnnotationMode>('LABELS');
    const controlsRef = useRef<any>(null);
    const isAnimatingRef = useRef(false);
    const { reportProgress } = useLoading();

    // Configure THREE.DefaultLoadingManager to report progress
    useEffect(() => {
        let totalItems = 0;
        let loadedItems = 0;

        THREE.DefaultLoadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
            totalItems = itemsTotal;
            loadedItems = itemsLoaded;
        };

        THREE.DefaultLoadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
            loadedItems = itemsLoaded;
            totalItems = itemsTotal;
            // Report progress with correct signature: (loaded, total, currentAsset?)
            reportProgress(itemsLoaded, itemsTotal, url);
        };

        THREE.DefaultLoadingManager.onLoad = () => {
            // Report 100% complete with correct signature
            reportProgress(totalItems, totalItems);
        };

        THREE.DefaultLoadingManager.onError = (url) => {
            console.error('Error loading:', url);
        };

        return () => {
            // Reset handlers on unmount
            THREE.DefaultLoadingManager.onStart = () => {};
            THREE.DefaultLoadingManager.onProgress = () => {};
            THREE.DefaultLoadingManager.onLoad = () => {};
            THREE.DefaultLoadingManager.onError = () => {};
        };
    }, [reportProgress]);

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

            <PerformanceOverlay
                performanceMode={performanceMode}
                onPerformanceModeChange={setPerformanceMode}
                shadowQuality={shadowQuality}
                onShadowQualityChange={setShadowQuality}
            />

            <Canvas
                shadows
                dpr={[1, 2]}
                camera={{ position: [180, 100, 180], fov: 35 }}
                performance={{ min: 0.5 }}
                frameloop="always"
                gl={{
                    powerPreference: "high-performance",
                    antialias: true,
                    stencil: false,
                    depth: true,
                }}
            >
                <PerformanceMonitor
                    onIncline={() => {
                        console.log('Performance improving - upgrading quality');
                        setPerformanceMode(prev => {
                            if (prev === 'low') return 'medium';
                            if (prev === 'medium') return 'high';
                            return prev;
                        });
                    }}
                    onDecline={() => {
                        console.log('Performance declining - reducing quality');
                        setPerformanceMode(prev => {
                            if (prev === 'high') {
                                setShadowQuality('medium');
                                return 'medium';
                            }
                            if (prev === 'medium') {
                                setShadowQuality('low');
                                return 'low';
                            }
                            return prev;
                        });
                    }}
                    flipflops={3}
                    factor={0.9}
                    fps={45}
                    ms={22}
                >
                <CameraRig activeFloor={activeFloor} controlsRef={controlsRef} isAnimatingRef={isAnimatingRef} />
                <PerspectiveCamera makeDefault fov={40} />
                <ambientLight intensity={0.4} />

                <directionalLight
                    position={[-80, 150, 100]}
                    intensity={2}
                    castShadow={shadowQuality !== 'low'}
                    shadow-mapSize={
                        shadowQuality === 'high' ? [512, 512] :
                            shadowQuality === 'medium' ? [256, 256] :
                                [256, 256]
                    }
                    shadow-camera-near={50}
                    shadow-camera-far={300}
                >
                    <orthographicCamera attach="shadow-camera" args={[-100, 100, 100, -100, 50, 300]} />
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

                    {shadowQuality !== 'low' && (
                        <ContactShadows
                            position={[0, -0.2, 0]}
                            opacity={shadowQuality === 'high' ? 0.6 : 0.4}
                            scale={400}
                            blur={shadowQuality === 'high' ? 3 : 1.5}
                            far={20}
                            color="#000"
                        />
                    )}
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
            </PerformanceMonitor>

            </Canvas>

            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/50 text-xs pointer-events-none select-none font-mono text-center">
                ECO-FACILITY VIEWER v3.3 <br />
                INTERACTIVE ARCHITECTURAL MODEL
            </div>
        </div>
    );
};

export default ThreeScene;
