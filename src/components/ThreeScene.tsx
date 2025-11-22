
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
import Grass from './Grass';
import ClayCourtEffect from './ClayCourtEffect';
import ReceptionArea from './ReceptionArea';
import { getCourtTexture, type CourtSurfaceType } from '../utils/courtTextures';
import { ParkingLot } from './ParkingLot';
import { BMSControlRoom } from './BMSControlRoom';
import RoboticGrassSystem from './RoboticGrassSystem';
import TransportPods from './TransportPods';
import HydroponicsSystem from './HydroponicsSystem';
import MechanicalRooms from './MechanicalRooms';
import LockerRoom from './LockerRoom';

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
    { id: 'level1_mechanical', title: 'L1: Mechanical Systems', description: 'HVAC, Electrical, Water Treatment, Backup Power & Maintenance Robots.', icon: '⚙️', position: [35, 25, -40] },
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
    setAnnotationMode,
    performanceMode,
    setPerformanceMode
}: {
    activeFloor: FloorLevel,
    setActiveFloor: (f: FloorLevel) => void,
    annotationMode: AnnotationMode,
    setAnnotationMode: (m: AnnotationMode) => void,
    performanceMode: 'high' | 'medium' | 'low',
    setPerformanceMode: (m: 'high' | 'medium' | 'low') => void
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

            {/* Performance Mode Selector */}
            <div className="bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-white/10 pointer-events-auto shadow-2xl flex flex-col gap-1">
                <div className="px-4 py-2 text-xs font-bold text-white/40 uppercase tracking-wider border-b border-white/5 mb-1">
                    Performance
                </div>
                <div className="flex gap-1 p-1">
                    {(['low', 'medium', 'high'] as const).map((mode) => (
                        <button
                            key={mode}
                            onClick={() => setPerformanceMode(mode)}
                            className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${performanceMode === mode
                                ? 'bg-tennis-yellow text-tennis-dark shadow-lg'
                                : 'text-white/50 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            {mode}
                        </button>
                    ))}
                </div>
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
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
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

/**
 * BleacherSection - Retractable spectator seating
 *
 * Architectural Decisions:
 * - Low-poly geometry using box meshes for performance (500+ seats total)
 * - Elevated 2m above court level for optimal viewing angles
 * - Each section: 5 rows × 12-15 seats = 60-75 seats
 * - Tiered design with 0.4m rise per row (standard bleacher ergonomics)
 * - Accessible seating integrated at ground level (front row)
 * - Retractable aesthetic suggested through mechanical support structure
 *
 * Performance: ~50 triangles per section × 8 sections = 400 triangles total
 */
interface BleacherSectionProps {
    position: [number, number, number];
    rotation?: [number, number, number];
    rows?: number;
    seatsPerRow?: number;
}

const BleacherSection: React.FC<BleacherSectionProps> = ({
    position,
    rotation = [0, 0, 0],
    rows = 5,
    seatsPerRow = 15
}) => {
    const SEAT_WIDTH = 0.45;
    const SEAT_DEPTH = 0.4;
    const SEAT_HEIGHT = 0.08;
    const ROW_RISE = 0.4;
    const BASE_ELEVATION = 2.0;

    const totalWidth = seatsPerRow * SEAT_WIDTH;
    const totalDepth = rows * SEAT_DEPTH;

    return (
        <group position={position} rotation={rotation}>
            {/* Structural Support Platform */}
            <mesh position={[0, BASE_ELEVATION - 0.2, totalDepth / 2]}>
                <boxGeometry args={[totalWidth + 0.4, 0.4, totalDepth + 0.4]} />
                <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.4} />
            </mesh>

            {/* Support Legs (retractable mechanism aesthetic) */}
            {[0, 0.33, 0.66, 1].map((ratio, i) => (
                <group key={`leg-${i}`}>
                    <mesh position={[-totalWidth / 2 + totalWidth * ratio, BASE_ELEVATION / 2, totalDepth / 4]}>
                        <boxGeometry args={[0.15, BASE_ELEVATION, 0.15]} />
                        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
                    </mesh>
                    <mesh position={[-totalWidth / 2 + totalWidth * ratio, BASE_ELEVATION / 2, (totalDepth * 3) / 4]}>
                        <boxGeometry args={[0.15, BASE_ELEVATION, 0.15]} />
                        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
                    </mesh>
                </group>
            ))}

            {/* Bleacher Rows */}
            {Array.from({ length: rows }).map((_, rowIdx) => {
                const rowY = BASE_ELEVATION + rowIdx * ROW_RISE;
                const rowZ = rowIdx * SEAT_DEPTH;

                return (
                    <group key={`row-${rowIdx}`}>
                        {/* Row Platform (represents bench seating) */}
                        <mesh position={[0, rowY, rowZ + SEAT_DEPTH / 2]}>
                            <boxGeometry args={[totalWidth, SEAT_HEIGHT, SEAT_DEPTH]} />
                            <meshStandardMaterial
                                color={rowIdx === 0 ? "#3b82f6" : "#475569"}
                                roughness={0.6}
                            />
                        </mesh>

                        {/* Backrest */}
                        {rowIdx < rows - 1 && (
                            <mesh position={[0, rowY + 0.35, rowZ + SEAT_DEPTH]}>
                                <boxGeometry args={[totalWidth, 0.6, 0.05]} />
                                <meshStandardMaterial color="#64748b" roughness={0.7} />
                            </mesh>
                        )}

                        {/* Accessible Seating Marker (front row) */}
                        {rowIdx === 0 && (
                            <mesh position={[-totalWidth / 2 + SEAT_WIDTH, rowY + SEAT_HEIGHT + 0.01, rowZ + SEAT_DEPTH / 2]}>
                                <planeGeometry args={[SEAT_WIDTH - 0.05, SEAT_DEPTH - 0.05]} />
                                <meshBasicMaterial color="#3b82f6" transparent opacity={0.8} />
                            </mesh>
                        )}
                    </group>
                );
            })}

            {/* Safety Railing */}
            <mesh position={[0, BASE_ELEVATION + rows * ROW_RISE, totalDepth + 0.2]}>
                <boxGeometry args={[totalWidth, 0.15, 0.1]} />
                <meshStandardMaterial color={BRAND_YELLOW} metalness={0.5} roughness={0.3} />
            </mesh>
        </group>
    );
};

const TennisCourt: React.FC<{ position: [number, number, number], type: 'grass' | 'hard' | 'clay' | 'wood' }> = ({ position, type }) => {
    const colors = { grass: '#4d7c0f', hard: '#3b82f6', clay: '#ea580c', wood: '#d4a373' };

    // Use enhanced ClayCourtEffect for clay courts
    if (type === 'clay') {
        return (
            <group position={position}>
                <ClayCourtEffect position={[0, 0, 0]} width={10} length={22} />
                <Net width={10} />
            </group>
        );
    }

    // Get texture configuration for the court type (wood and hard courts get textures)
    const textureConfig = useMemo(() => getCourtTexture(type as CourtSurfaceType), [type]);

    return (
        <group position={position}>
            {/* Main court surface with textures for wood/hard, color-only for grass */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[10, 22]} />
                <meshStandardMaterial
                    color={textureConfig.color}
                    map={textureConfig.map}
                    normalMap={textureConfig.normalMap}
                    roughnessMap={textureConfig.roughnessMap}
                    roughness={textureConfig.roughness}
                    metalness={textureConfig.metalness || 0}
                />
            </mesh>

            {/* Render grass blades for grass courts */}
            {type === 'grass' && (
                <Grass
                    position={[0, 0.1, 0]}
                    size={[10, 22]}
                    bladeCount={1500}
                    color="#4d7c0f"
                    animated={true}
                />
            )}

            {/* Court lines and boundaries */}
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

// --- 3D Court Label Component ---

const CourtLabel = ({ position, label }: { position: [number, number, number], label: string }) => {
    const [hovered, setHovered] = useState(false);
    useCursor(hovered);

    return (
        <Float
            speed={1.5}
            rotationIntensity={0.1}
            floatIntensity={0.3}
        >
            <group
                position={position}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                {/* Label Background Panel */}
                <mesh position={[0, 0, 0]} castShadow>
                    <boxGeometry args={[16, 4, 0.5]} />
                    <meshStandardMaterial
                        color={hovered ? BRAND_YELLOW : "#1e293b"}
                        metalness={0.3}
                        roughness={0.4}
                        emissive={hovered ? BRAND_YELLOW : "#334155"}
                        emissiveIntensity={hovered ? 0.3 : 0.1}
                    />
                </mesh>

                {/* Accent Strip */}
                <mesh position={[0, 0, 0.3]}>
                    <boxGeometry args={[16, 0.3, 0.1]} />
                    <meshStandardMaterial
                        color={BRAND_YELLOW}
                        emissive={BRAND_YELLOW}
                        emissiveIntensity={0.5}
                    />
                </mesh>

                {/* Label Text */}
                <Text
                    position={[0, 0, 0.3]}
                    fontSize={1.8}
                    color={hovered ? "#0f172a" : "white"}
                    anchorX="center"
                    anchorY="middle"
                    letterSpacing={0.05}
                    outlineWidth={0.05}
                    outlineColor="#000"
                >
                    {label} COURTS
                </Text>

                {/* Support Post */}
                <mesh position={[0, -2.5, 0]}>
                    <cylinderGeometry args={[0.15, 0.15, 5, 8]} />
                    <meshStandardMaterial
                        color="#475569"
                        metalness={0.6}
                        roughness={0.3}
                    />
                </mesh>
            </group>
        </Float>
    );
};

// --- Level 2 Viewing Gallery Components ---

const GlassBarrier: React.FC<{
    position: [number, number, number],
    width: number,
    rotation?: [number, number, number]
}> = ({ position, width, rotation = [0, 0, 0] }) => (
    <group position={position} rotation={rotation}>
        {/* Glass Panel */}
        <mesh position={[0, 1.2, 0]}>
            <boxGeometry args={[width, 2.4, 0.15]} />
            <meshPhysicalMaterial
                color="#e0f2fe"
                transmission={0.92}
                opacity={0.15}
                transparent
                roughness={0.05}
                metalness={0.1}
                thickness={0.5}
                envMapIntensity={1.2}
                clearcoat={1}
                clearcoatRoughness={0.1}
            />
        </mesh>

        {/* Top Rail */}
        <mesh position={[0, 2.4, 0]}>
            <boxGeometry args={[width, 0.1, 0.15]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Bottom Rail */}
        <mesh position={[0, 0, 0]}>
            <boxGeometry args={[width, 0.1, 0.15]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Vertical Support Posts */}
        {Array.from({ length: Math.floor(width / 3) + 1 }).map((_, i) => (
            <mesh key={i} position={[-width / 2 + i * 3, 1.2, 0]}>
                <cylinderGeometry args={[0.04, 0.04, 2.4, 12]} />
                <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.1} />
            </mesh>
        ))}
    </group>
);

const VIPViewingSuite: React.FC<{
    position: [number, number, number],
    rotation?: [number, number, number]
}> = ({ position, rotation = [0, 0, 0] }) => (
    <group position={position} rotation={rotation}>
        {/* Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <planeGeometry args={[8, 6]} />
            <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.1} />
        </mesh>

        {/* Back and Side Walls */}
        <mesh position={[0, 1.5, -3]}>
            <boxGeometry args={[8, 3, 0.2]} />
            <meshStandardMaterial color="#334155" roughness={0.4} />
        </mesh>
        <mesh position={[-4, 1.5, 0]}>
            <boxGeometry args={[0.2, 3, 6]} />
            <meshStandardMaterial color="#334155" roughness={0.4} />
        </mesh>
        <mesh position={[4, 1.5, 0]}>
            <boxGeometry args={[0.2, 3, 6]} />
            <meshStandardMaterial color="#334155" roughness={0.4} />
        </mesh>

        {/* Glass Front (viewing window) */}
        <mesh position={[0, 1.5, 3]}>
            <boxGeometry args={[7.6, 2.8, 0.1]} />
            <meshPhysicalMaterial
                color="#bfdbfe"
                transmission={0.95}
                opacity={0.1}
                transparent
                roughness={0.02}
                metalness={0.05}
                thickness={0.3}
                envMapIntensity={1.5}
            />
        </mesh>

        {/* Ceiling with recessed lighting */}
        <mesh position={[0, 3, 0]}>
            <boxGeometry args={[8, 0.15, 6]} />
            <meshStandardMaterial color="#1e293b" />
        </mesh>

        {/* Accent lighting strips */}
        <pointLight position={[0, 2.8, 0]} intensity={0.8} distance={8} color="#fbbf24" />
        <mesh position={[0, 2.85, 0]}>
            <boxGeometry args={[6, 0.05, 4]} />
            <meshBasicMaterial color="#fbbf24" toneMapped={false} />
        </mesh>

        {/* Seating (simple representation) */}
        {Array.from({ length: 4 }).map((_, i) => (
            <group key={i} position={[-3 + i * 2, 0.4, -1]}>
                <mesh position={[0, 0.2, 0]}>
                    <boxGeometry args={[0.6, 0.4, 0.6]} />
                    <meshStandardMaterial color="#475569" />
                </mesh>
                <mesh position={[0, 0.6, -0.2]}>
                    <boxGeometry args={[0.6, 0.4, 0.1]} />
                    <meshStandardMaterial color="#475569" />
                </mesh>
            </group>
        ))}

        {/* Premium Table */}
        <mesh position={[0, 0.7, 1]}>
            <cylinderGeometry args={[1.2, 1.2, 0.05, 32]} />
            <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.35, 1]}>
            <cylinderGeometry args={[0.08, 0.08, 0.7, 12]} />
            <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.2} />
        </mesh>
    </group>
);

const GlassWalkway: React.FC<{
    position: [number, number, number],
    length: number,
    rotation?: [number, number, number]
}> = ({ position, length, rotation = [0, 0, 0] }) => (
    <group position={position} rotation={rotation}>
        {/* Transparent Glass Floor with grid pattern */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
            <planeGeometry args={[4, length]} />
            <meshPhysicalMaterial
                color="#e0f2fe"
                transmission={0.88}
                opacity={0.25}
                transparent
                roughness={0.08}
                metalness={0.15}
                thickness={0.8}
                envMapIntensity={1.1}
                clearcoat={0.9}
                clearcoatRoughness={0.15}
            />
        </mesh>

        {/* Safety grid pattern */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
            <planeGeometry args={[3.8, length - 0.2]} />
            <meshBasicMaterial color="#cbd5e1" wireframe transparent opacity={0.15} />
        </mesh>

        {/* Structural support underneath */}
        {Array.from({ length: Math.floor(length / 4) + 1 }).map((_, i) => (
            <mesh key={i} position={[0, -0.3, -length / 2 + i * 4]} rotation={[0, 0, Math.PI / 2]}>
                <boxGeometry args={[0.6, 3.5, 0.15]} />
                <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
            </mesh>
        ))}

        {/* LED accent lighting in walkway */}
        {Array.from({ length: Math.floor(length / 6) + 1 }).map((_, i) => (
            <group key={`light-${i}`} position={[0, -0.15, -length / 2 + i * 6]}>
                <pointLight intensity={0.3} distance={6} color="#60a5fa" />
                <mesh>
                    <boxGeometry args={[3.5, 0.05, 0.3]} />
                    <meshBasicMaterial color="#60a5fa" toneMapped={false} opacity={0.6} transparent />
                </mesh>
            </group>
        ))}

        {/* Glass Barriers on both sides */}
        <GlassBarrier position={[2, 0, 0]} width={length} rotation={[0, Math.PI / 2, 0]} />
        <GlassBarrier position={[-2, 0, 0]} width={length} rotation={[0, Math.PI / 2, 0]} />
    </group>
);

// --- Floor Layouts ---

const GroundFloor = ({ active, showMeasurements, showLabels }: { active: boolean, showMeasurements: boolean, showLabels: boolean }) => {
    const courts = [];
    for (let i = 0; i < 24; i++) {
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

    // Calculate position for robotic grass system (on grass courts)
    const grassCourtRow = 2;
    const roboticSystemPosition: [number, number, number] = [0, 0, -40 + grassCourtRow * 26];

    // Row Configuration for Dimensions
    const rowConfigs = [
        { z: -40, label: "HARD" },
        { z: -14, label: "CLAY" },
        { z: 12, label: "GRASS" },
        { z: 38, label: "WOOD" },
    ];

    /**
     * Spectator Seating Layout
     *
     * Strategic placement around perimeter for optimal viewing:
     * - 2 sections at north/south ends (center court viewing)
     * - 4 sections along east/west sides (row viewing)
     * - 2 sections at corners (dual-court viewing)
     *
     * Total capacity: 8 sections × 75 seats = 600 seats
     * Accessible seating: 8 sections × 1 accessible seat = 8 ADA-compliant positions
     */
    const seatingConfig = [
        // North end - center courts viewing (Hard courts)
        { position: [0, 0.1, -60] as [number, number, number], rotation: [0, 0, 0] as [number, number, number], seats: 15 },

        // South end - center courts viewing (Wood courts)
        { position: [0, 0.1, 52] as [number, number, number], rotation: [0, Math.PI, 0] as [number, number, number], seats: 15 },

        // West side - Clay courts viewing
        { position: [-55, 0.1, -14] as [number, number, number], rotation: [0, Math.PI / 2, 0] as [number, number, number], seats: 12 },

        // West side - Grass courts viewing
        { position: [-55, 0.1, 12] as [number, number, number], rotation: [0, Math.PI / 2, 0] as [number, number, number], seats: 12 },

        // East side - Hard courts viewing
        { position: [55, 0.1, -40] as [number, number, number], rotation: [0, -Math.PI / 2, 0] as [number, number, number], seats: 12 },

        // East side - Clay courts viewing
        { position: [55, 0.1, -14] as [number, number, number], rotation: [0, -Math.PI / 2, 0] as [number, number, number], seats: 12 },

        // Northwest corner - dual court viewing
        { position: [-50, 0.1, -50] as [number, number, number], rotation: [0, Math.PI / 4, 0] as [number, number, number], seats: 12 },

        // Northeast corner - dual court viewing
        { position: [50, 0.1, -50] as [number, number, number], rotation: [0, -Math.PI / 4, 0] as [number, number, number], seats: 12 },
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

            {/* Spectator Seating - 8 sections around perimeter */}
            {seatingConfig.map((config, i) => (
                <BleacherSection
                    key={`bleacher-${i}`}
                    position={config.position}
                    rotation={config.rotation}
                    seatsPerRow={config.seats}
                    rows={5}
                />
            ))}

            {/* Reception Area - South Facade Main Entrance */}
            <ReceptionArea showMeasurements={showMeasurements} showLabels={showLabels} />

            {/* Locker Rooms - East & West Ends (25m × 15m each) */}
            {/* East Locker Room - Men's Facilities */}
            <LockerRoom
                position={[57.5, 0, 0]}
                label="MEN'S LOCKER ROOM"
                rotation={Math.PI / 2}
            />

            {/* West Locker Room - Women's Facilities */}
            <LockerRoom
                position={[-57.5, 0, 0]}
                label="WOMEN'S LOCKER ROOM"
                rotation={-Math.PI / 2}
            />

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

            {/* 3D Floating Court Labels */}
            {showLabels && rowConfigs.map((row, i) => (
                <CourtLabel
                    key={`lbl-${i}`}
                    position={[-55, 5, row.z]}
                    label={row.label}
                />
            ))}

            {/* Robotic Grass Management System */}
            <RoboticGrassSystem
                position={roboticSystemPosition}
                robotCount={6}
                showPaths={showMeasurements}
                showStatus={showLabels}
            />
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
            {Array.from({ length: 16 }).map((_, i) => (
                <BadmintonCourt key={`b${i}`} position={[-40 + (i % 4) * 8, 0.1, -30 + Math.floor(i / 4) * 16]} />
            ))}
            {Array.from({ length: 4 }).map((_, i) => (
                <group key={`s${i}`} position={[0, 2, -20 + i * 12]}>
                    <mesh><boxGeometry args={[6, 4, 9]} /><meshPhysicalMaterial transmission={0.6} roughness={0.1} thickness={0.5} color="#fff" /></mesh>
                </group>
            ))}
            {Array.from({ length: 16 }).map((_, i) => (
                <group key={`tt${i}`} position={[35 + (i % 4) * 5, 0.8, -30 + Math.floor(i / 4) * 10]}>
                    <mesh rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[1.5, 2.7]} /><meshStandardMaterial color="#1e3a8a" /></mesh>
                </group>
            ))}

            {/* BMS Control Room */}
            <BMSControlRoom position={[-45, 0.1, 40]} />

            {/* Mechanical & Utility Rooms */}
            <MechanicalRooms
                position={[35, 0.1, -40]}
                showMetrics={showMeasurements}
                showLabels={showMeasurements}
            />

            {/* Control Room Dimensions */}
            {showMeasurements && (
                <group position={[-45, 1, 40]}>
                    <CadDimension
                        start={new THREE.Vector3(-7.5, 0, -5)}
                        end={new THREE.Vector3(7.5, 0, -5)}
                        offsetVec={new THREE.Vector3(0, 0, -2)}
                        label="15m BMS WIDTH"
                    />
                    <CadDimension
                        start={new THREE.Vector3(7.5, 0, -5)}
                        end={new THREE.Vector3(7.5, 0, 5)}
                        offsetVec={new THREE.Vector3(2, 0, 0)}
                        label="10m DEPTH"
                    />
                </group>
            )}
        </group>
    )
}

const LevelTwo = ({ active, showMeasurements }: { active: boolean, showMeasurements: boolean }) => {
    const walkwayWidth = BUILDING_WIDTH - 30;
    const walkwayDepth = BUILDING_DEPTH - 30;

    return (
        <group position={[0, FLOOR_HEIGHT * 2, 0]}>
            <FloorPlate
                position={[0, 0, 0]}
                size={[walkwayWidth, walkwayDepth]}
                level={2}
                isActiveFloor={active}
                showMeasurements={showMeasurements}
            />

            {/* Central Court Area - Pickleball Courts */}
            {Array.from({ length: 8 }).map((_, i) => (
                <group key={`p${i}`} position={[-25 + (i % 4) * 10, 0.1, -15 + Math.floor(i / 4) * 16]}>
                    <mesh rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[6, 12]} /><meshStandardMaterial color="#8b5cf6" /></mesh>
                    <Net width={6} />
                </group>
            ))}

            {/* Heritage Real Tennis Court */}
            <RealTennisCourt position={[30, 0.1, 0]} />

            {/* 360 Glass Walkway System - North Side */}
            <GlassWalkway
                position={[0, 0.1, -walkwayDepth / 2 + 2]}
                length={walkwayWidth - 8}
                rotation={[0, 0, 0]}
            />

            {/* 360 Glass Walkway System - South Side */}
            <GlassWalkway
                position={[0, 0.1, walkwayDepth / 2 - 2]}
                length={walkwayWidth - 8}
                rotation={[0, 0, 0]}
            />

            {/* 360 Glass Walkway System - East Side */}
            <GlassWalkway
                position={[walkwayWidth / 2 - 2, 0.1, 0]}
                length={walkwayDepth - 8}
                rotation={[0, Math.PI / 2, 0]}
            />

            {/* 360 Glass Walkway System - West Side */}
            <GlassWalkway
                position={[-walkwayWidth / 2 + 2, 0.1, 0]}
                length={walkwayDepth - 8}
                rotation={[0, Math.PI / 2, 0]}
            />

            {/* VIP Viewing Suites - Corner Positions */}
            <VIPViewingSuite
                position={[walkwayWidth / 2 - 7, 0.1, walkwayDepth / 2 - 6]}
                rotation={[0, -Math.PI / 4, 0]}
            />
            <VIPViewingSuite
                position={[-walkwayWidth / 2 + 7, 0.1, walkwayDepth / 2 - 6]}
                rotation={[0, Math.PI / 4, 0]}
            />
            <VIPViewingSuite
                position={[walkwayWidth / 2 - 7, 0.1, -walkwayDepth / 2 + 6]}
                rotation={[0, -3 * Math.PI / 4, 0]}
            />
            <VIPViewingSuite
                position={[-walkwayWidth / 2 + 7, 0.1, -walkwayDepth / 2 + 6]}
                rotation={[0, 3 * Math.PI / 4, 0]}
            />

            {/* Additional VIP Suites - Mid-wall Positions */}
            <VIPViewingSuite
                position={[walkwayWidth / 2 - 7, 0.1, 0]}
                rotation={[0, -Math.PI / 2, 0]}
            />
            <VIPViewingSuite
                position={[-walkwayWidth / 2 + 7, 0.1, 0]}
                rotation={[0, Math.PI / 2, 0]}
            />

            {/* Viewing Cutouts in Floor for Ground Floor Visibility */}
            {Array.from({ length: 4 }).map((_, i) => (
                <group key={`viewing-${i}`} position={[-30 + i * 20, 0, -20]}>
                    {/* Transparent viewing window in floor */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
                        <planeGeometry args={[6, 8]} />
                        <meshPhysicalMaterial
                            color="#dbeafe"
                            transmission={0.95}
                            opacity={0.1}
                            transparent
                            roughness={0.02}
                            thickness={0.3}
                        />
                    </mesh>
                    {/* Safety barrier around viewing window */}
                    <GlassBarrier position={[0, 0, 4]} width={6} rotation={[0, 0, 0]} />
                    <GlassBarrier position={[0, 0, -4]} width={6} rotation={[0, 0, 0]} />
                    <GlassBarrier position={[3, 0, 0]} width={8} rotation={[0, Math.PI / 2, 0]} />
                    <GlassBarrier position={[-3, 0, 0]} width={8} rotation={[0, Math.PI / 2, 0]} />
                </group>
            ))}

            {/* Information Kiosks along walkways */}
            {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i / 8) * Math.PI * 2;
                const radius = (walkwayWidth + walkwayDepth) / 4;
                return (
                    <group key={`kiosk-${i}`} position={[Math.cos(angle) * radius * 0.7, 0.8, Math.sin(angle) * radius * 0.7]}>
                        <mesh>
                            <cylinderGeometry args={[0.3, 0.4, 1.6, 6]} />
                            <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.3} />
                        </mesh>
                        <mesh position={[0, 0.9, 0]} rotation={[0, -angle, 0]}>
                            <boxGeometry args={[0.6, 0.8, 0.05]} />
                            <meshStandardMaterial
                                color="#1e293b"
                                emissive="#3b82f6"
                                emissiveIntensity={0.3}
                            />
                        </mesh>
                    </group>
                );
            })}
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
            {/* Vertical Hydroponics Systems - 4 autonomous farming sectors */}
            <HydroponicsSystem
                position={[-30, 0, -20]}
                towerCount={4}
                showMetrics={active}
            />
            <HydroponicsSystem
                position={[30, 0, -20]}
                towerCount={4}
                showMetrics={active}
            />
            <HydroponicsSystem
                position={[-30, 0, 20]}
                towerCount={4}
                showMetrics={active}
            />
            <HydroponicsSystem
                position={[30, 0, 20]}
                towerCount={4}
                showMetrics={active}
            />

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

const CampusGrounds = () => {
    return (
        <group position={[0, -0.1, 0]}>
            {/* Main Plaza Pavement */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[300, 300]} />
                <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
            </mesh>

            {/* Outdoor Courts Feature (from image reference) */}
            <group position={[90, 0.2, 50]}>
                <TennisCourt position={[0, 0, 0]} type="clay" />
                <TennisCourt position={[15, 0, 0]} type="hard" />
                <TennisCourt position={[30, 0, 0]} type="grass" />
            </group>

            {/* Parking Lot - positioned to the left/north side of the facility */}
            <ParkingLot position={[-100, 0.2, -20]} />

            {/* Trees & Landscaping */}
            {Array.from({ length: 15 }).map((_, i) => {
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
    const [performanceMode, setPerformanceMode] = useState<'high' | 'medium' | 'low'>('medium');
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
                performanceMode={performanceMode}
                setPerformanceMode={setPerformanceMode}
            />

            <Canvas
                shadows={performanceMode !== 'low'}
                dpr={performanceMode === 'high' ? [1, 1.5] : 1}
                camera={{ position: [180, 100, 180], fov: 35 }}
                gl={{ antialias: true }}
            >
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

                    {/* Autonomous Transport Pod System */}
                    <TransportPods showRoutes={annotationMode === 'LABELS'} />

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
                ECO-FACILITY VIEWER v3.3 <br />
                INTERACTIVE ARCHITECTURAL MODEL
            </div>
        </div>
    );
};

export default ThreeScene;
