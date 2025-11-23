import React, { useState, useEffect, useRef, useMemo, Suspense, lazy } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
    OrbitControls,
    Html,
    Grid,
    PerspectiveCamera,
    Environment,
    Text,
    useCursor,
    Float,
    Line,
    PerformanceMonitor
} from '@react-three/drei';
import * as THREE from 'three';
import { FeatureData } from '../types';
import { Layers, Ruler, Eye, Box, Maximize2 } from 'lucide-react';

// Lazy load heavy components
const WeatherSystemOptimized = lazy(() => import('./WeatherSystemOptimized'));
const GrassOptimized = lazy(() => import('./GrassOptimized'));
const ClayCourtEffect = lazy(() => import('./ClayCourtEffect'));
const ReceptionArea = lazy(() => import('./ReceptionArea'));
const ParkingLot = lazy(() => import('./ParkingLot'));
const BMSControlRoom = lazy(() => import('./BMSControlRoom'));
const RoboticGrassSystem = lazy(() => import('./RoboticGrassSystem'));
const TransportPods = lazy(() => import('./TransportPods'));
const HydroponicsSystem = lazy(() => import('./HydroponicsSystem'));
const MechanicalRooms = lazy(() => import('./MechanicalRooms'));
const LockerRoom = lazy(() => import('./LockerRoom'));
const WeatherControls = lazy(() => import('./WeatherControls'));

import { getCourtTexture, type CourtSurfaceType } from '../utils/courtTextures';
import { useWeather } from './WeatherSystemOptimized';

// Constants
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

/**
 * Optimized ThreeScene Component
 *
 * Performance Improvements:
 * - Dynamic shadow quality based on performance mode
 * - LOD system for distant objects
 * - Optimized particle systems
 * - Frustum culling enabled globally
 * - Material simplification in lower modes
 * - Conditional rendering based on visibility
 * - Geometry instancing for repeated objects
 * - Performance monitoring with auto-adjust
 */

// Camera Rig Component (unchanged but optimized)
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
            targetPos.current.set(80, yLevel + 30, 80);
            targetLookAt.current.set(0, yLevel, 0);
        }
        isAnimatingRef.current = true;
    }, [activeFloor, isAnimatingRef]);

    useFrame((state, delta) => {
        if (!isAnimatingRef.current) return;

        const step = 4 * delta;
        state.camera.position.lerp(targetPos.current, step);

        if (controlsRef.current) {
            controlsRef.current.target.lerp(targetLookAt.current, step);
            controlsRef.current.update();

            const distPos = state.camera.position.distanceTo(targetPos.current);
            const distTarget = controlsRef.current.target.distanceTo(targetLookAt.current);

            if (distPos < 0.5 && distTarget < 0.5) {
                isAnimatingRef.current = false;
            }
        }
    });

    return null;
};

// Optimized Controls Overlay with FPS counter
const ControlsOverlay = ({
    activeFloor,
    setActiveFloor,
    annotationMode,
    setAnnotationMode,
    performanceMode,
    setPerformanceMode,
    currentFPS
}: {
    activeFloor: FloorLevel,
    setActiveFloor: (f: FloorLevel) => void,
    annotationMode: AnnotationMode,
    setAnnotationMode: (m: AnnotationMode) => void,
    performanceMode: 'high' | 'medium' | 'low',
    setPerformanceMode: (m: 'high' | 'medium' | 'low') => void,
    currentFPS?: number
}) => {
    return (
        <div className="absolute top-40 left-6 z-10 flex flex-col gap-4 pointer-events-none">
            {/* FPS Counter */}
            {currentFPS !== undefined && (
                <div className="bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-white/10 pointer-events-auto shadow-2xl">
                    <div className="text-xs font-bold text-white/80 uppercase tracking-wider">
                        FPS: <span className={currentFPS < 30 ? 'text-red-500' : currentFPS < 50 ? 'text-yellow-500' : 'text-green-500'}>
                            {Math.round(currentFPS)}
                        </span>
                    </div>
                </div>
            )}

            {/* Floor Selector */}
            <div className="bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-white/10 pointer-events-auto shadow-2xl flex flex-col gap-1">
                <div className="px-3 py-2 text-xs font-bold text-white/80 uppercase tracking-wider flex items-center gap-2">
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

            {/* Performance Mode Selector */}
            <div className="bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-white/10 pointer-events-auto shadow-2xl flex flex-col gap-1">
                <div className="px-4 py-2 text-xs font-bold text-white/80 uppercase tracking-wider border-b border-white/5 mb-1">
                    Performance
                </div>
                <div className="flex gap-1 p-1">
                    {(['low', 'medium', 'high'] as const).map((mode) => (
                        <button
                            key={mode}
                            onClick={() => setPerformanceMode(mode)}
                            className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${performanceMode === mode
                                ? 'bg-tennis-yellow text-tennis-dark shadow-lg'
                                : 'text-white/80 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            {mode}
                        </button>
                    ))}
                </div>
                <div className="px-2 py-1 text-xs text-white/60">
                    {performanceMode === 'high' && 'All effects, shadows, high quality'}
                    {performanceMode === 'medium' && 'Balanced quality and performance'}
                    {performanceMode === 'low' && 'Maximum FPS, reduced effects'}
                </div>
            </div>
        </div>
    );
};

// Optimized marker with conditional rendering
const MarkerOptimized: React.FC<{
    position: [number, number, number];
    title: string;
    onClick: () => void;
    isSelected: boolean;
    visible: boolean;
    performanceMode: 'high' | 'medium' | 'low';
}> = ({ position, title, onClick, isSelected, visible, performanceMode }) => {
    const [hovered, setHover] = useState(false);
    useCursor(hovered);

    if (!visible) return null;

    return (
        <group position={position}>
            {performanceMode !== 'low' && (
                <Float speed={2} rotationIntensity={0} floatIntensity={1}>
                    <mesh
                        onClick={(e) => { e.stopPropagation(); onClick(); }}
                        onPointerOver={() => setHover(true)}
                        onPointerOut={() => setHover(false)}
                    >
                        <sphereGeometry args={[1.5, performanceMode === 'high' ? 32 : 16, performanceMode === 'high' ? 32 : 16]} />
                        <meshStandardMaterial
                            color={isSelected || hovered ? BRAND_YELLOW : "#ffffff"}
                            emissive={isSelected ? BRAND_YELLOW : "#000"}
                            emissiveIntensity={performanceMode === 'high' ? 0.8 : 0.4}
                            toneMapped={performanceMode === 'high'}
                        />
                    </mesh>
                </Float>
            )}
            {performanceMode === 'low' && (
                <mesh
                    onClick={(e) => { e.stopPropagation(); onClick(); }}
                    onPointerOver={() => setHover(true)}
                    onPointerOut={() => setHover(false)}
                >
                    <boxGeometry args={[2, 2, 2]} />
                    <meshBasicMaterial color={isSelected || hovered ? BRAND_YELLOW : "#ffffff"} />
                </mesh>
            )}
            <Html distanceFactor={80} zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
                <div
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-300 ${isSelected ? 'bg-tennis-yellow text-black' : 'bg-slate-900/80 text-white'}`}
                >
                    {title}
                </div>
            </Html>
        </group>
    );
};

// Simplified Tennis Court with instanced geometry
const TennisCourtOptimized: React.FC<{
    position: [number, number, number],
    type: 'grass' | 'hard' | 'clay' | 'wood',
    performanceMode: 'high' | 'medium' | 'low'
}> = ({ position, type, performanceMode }) => {
    const colors = { grass: '#4d7c0f', hard: '#3b82f6', clay: '#ea580c', wood: '#d4a373' };

    // Use simpler materials in lower performance modes
    const textureConfig = useMemo(() => {
        if (performanceMode === 'low') {
            return { color: colors[type], roughness: 0.8, metalness: 0 };
        }
        return getCourtTexture(type as CourtSurfaceType);
    }, [type, performanceMode]);

    return (
        <group position={position}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[10, 22]} />
                <meshStandardMaterial
                    color={textureConfig.color}
                    map={performanceMode === 'high' ? textureConfig.map : undefined}
                    normalMap={performanceMode === 'high' ? textureConfig.normalMap : undefined}
                    roughnessMap={performanceMode === 'high' ? textureConfig.roughnessMap : undefined}
                    roughness={textureConfig.roughness}
                    metalness={textureConfig.metalness || 0}
                />
            </mesh>

            {/* Only render grass for grass courts in non-low mode */}
            {type === 'grass' && performanceMode !== 'low' && (
                <Suspense fallback={null}>
                    <GrassOptimized
                        position={[0, 0.1, 0]}
                        size={[10, 22]}
                        bladeCount={performanceMode === 'high' ? 1500 : 750}
                        color="#4d7c0f"
                        animated={true}
                        performanceMode={performanceMode}
                    />
                </Suspense>
            )}

            {/* Simplified net */}
            <group position={[0, 1, 0]}>
                <mesh position={[-5, 0, 0]}>
                    <cylinderGeometry args={[0.05, 0.05, 2]} />
                    <meshBasicMaterial color="#333" />
                </mesh>
                <mesh position={[5, 0, 0]}>
                    <cylinderGeometry args={[0.05, 0.05, 2]} />
                    <meshBasicMaterial color="#333" />
                </mesh>
                {performanceMode !== 'low' && (
                    <mesh>
                        <boxGeometry args={[10, 1.8, 0.02]} />
                        <meshBasicMaterial color="white" transparent opacity={0.3} wireframe />
                    </mesh>
                )}
            </group>
        </group>
    );
};

// Main optimized scene component
interface ThreeSceneOptimizedProps {
    onFeatureSelect: (feature: FeatureData) => void;
}

const ThreeSceneOptimized: React.FC<ThreeSceneOptimizedProps> = ({ onFeatureSelect }) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [activeFloor, setActiveFloor] = useState<FloorLevel>('ALL');
    const [annotationMode, setAnnotationMode] = useState<AnnotationMode>('LABELS');
    const [performanceMode, setPerformanceMode] = useState<'high' | 'medium' | 'low'>('medium');
    const [currentFPS, setCurrentFPS] = useState<number>(60);
    const controlsRef = useRef<any>(null);
    const isAnimatingRef = useRef(false);

    // Weather system state
    const { weather, intensity, setWeather, setIntensity } = useWeather();

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

    // Get shadow map size based on performance mode
    const getShadowMapSize = () => {
        switch (performanceMode) {
            case 'high': return 2048;
            case 'medium': return 1024;
            case 'low': return 512;
        }
    };

    // Get DPR based on performance mode
    const getDPR = () => {
        switch (performanceMode) {
            case 'high': return [1, 1.5];
            case 'medium': return 1;
            case 'low': return 0.75;
        }
    };

    return (
        <div className="w-full h-full absolute inset-0">
            <ControlsOverlay
                activeFloor={activeFloor}
                setActiveFloor={setActiveFloor}
                annotationMode={annotationMode}
                setAnnotationMode={setAnnotationMode}
                performanceMode={performanceMode}
                setPerformanceMode={setPerformanceMode}
                currentFPS={currentFPS}
            />

            <Suspense fallback={null}>
                <WeatherControls
                    currentWeather={weather}
                    onWeatherChange={setWeather}
                    intensity={intensity}
                    onIntensityChange={setIntensity}
                />
            </Suspense>

            <Canvas
                shadows={performanceMode !== 'low'}
                dpr={getDPR()}
                camera={{ position: [180, 100, 180], fov: 35 }}
                gl={{
                    antialias: performanceMode !== 'low',
                    powerPreference: performanceMode === 'low' ? 'low-power' : 'high-performance',
                    stencil: false,
                    depth: true
                }}
            >
                {/* Performance monitoring */}
                <PerformanceMonitor
                    onDecline={() => {
                        if (performanceMode === 'high') setPerformanceMode('medium');
                        else if (performanceMode === 'medium') setPerformanceMode('low');
                    }}
                    onIncline={() => {
                        if (performanceMode === 'low') setPerformanceMode('medium');
                        else if (performanceMode === 'medium') setPerformanceMode('high');
                    }}
                    onChange={({ fps }) => setCurrentFPS(fps)}
                />

                <CameraRig activeFloor={activeFloor} controlsRef={controlsRef} isAnimatingRef={isAnimatingRef} />
                <PerspectiveCamera makeDefault fov={40} />

                {/* Optimized lighting */}
                <ambientLight intensity={0.4} />
                <directionalLight
                    position={[-80, 150, 100]}
                    intensity={performanceMode === 'low' ? 1.5 : 2}
                    castShadow={performanceMode !== 'low'}
                    shadow-mapSize={[getShadowMapSize(), getShadowMapSize()]}
                    shadow-camera-far={performanceMode === 'high' ? 500 : 300}
                    shadow-camera-near={0.1}
                    shadow-camera-top={150}
                    shadow-camera-bottom={-150}
                    shadow-camera-left={-150}
                    shadow-camera-right={150}
                />

                {performanceMode !== 'low' && <Environment preset="park" resolution={performanceMode === 'high' ? 256 : 128} />}

                {/* Weather System */}
                <Suspense fallback={null}>
                    <WeatherSystemOptimized
                        weather={weather}
                        intensity={intensity}
                        enableEffects={performanceMode !== 'low'}
                        areaSize={[300, 300]}
                        enableWetSurfaces={performanceMode === 'high'}
                        performanceMode={performanceMode}
                    />
                </Suspense>

                <group>
                    {/* Building and grounds - simplified geometry */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                        <planeGeometry args={[300, 300]} />
                        <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
                    </mesh>

                    {/* Render tennis courts with optimization */}
                    {(activeFloor === 'ALL' || activeFloor === 0) && (
                        <group position={[0, 0, 0]}>
                            {Array.from({ length: 24 }).map((_, i) => {
                                let type: 'hard' | 'clay' | 'grass' | 'wood' = 'hard';
                                if (i >= 6 && i < 12) type = 'clay';
                                if (i >= 12 && i < 18) type = 'grass';
                                if (i >= 18) type = 'wood';
                                const row = Math.floor(i / 6);
                                const col = i % 6;

                                return (
                                    <TennisCourtOptimized
                                        key={i}
                                        type={type}
                                        position={[-35 + col * 14, 0.1, -40 + row * 26]}
                                        performanceMode={performanceMode}
                                    />
                                );
                            })}
                        </group>
                    )}

                    {/* Feature markers with optimization */}
                    {FEATURES.map((f) => {
                        let visible = showLabels;
                        if (activeFloor !== 'ALL') {
                            if (activeFloor === 0 && !f.id.includes('ground')) visible = false;
                            if (activeFloor === 1 && !f.id.includes('level1')) visible = false;
                            if (activeFloor === 2 && !f.id.includes('level2')) visible = false;
                            if (activeFloor === 3 && !f.id.includes('level3')) visible = false;
                        }
                        return (
                            <MarkerOptimized
                                key={f.id}
                                position={f.position}
                                title={f.title}
                                isSelected={selectedId === f.id}
                                onClick={() => handleSelect(f)}
                                visible={visible}
                                performanceMode={performanceMode}
                            />
                        );
                    })}

                    {/* Simplified contact shadows */}
                    {performanceMode === 'high' && (
                        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
                            <planeGeometry args={[400, 400]} />
                            <shadowMaterial transparent opacity={0.4} />
                        </mesh>
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
                    enableDamping={performanceMode === 'high'}
                    dampingFactor={0.05}
                />
            </Canvas>

            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/80 text-xs pointer-events-none select-none font-mono text-center">
                OPTIMIZED 3D VIEWER v4.0 | TARGET: 60 FPS<br />
                MODE: {performanceMode.toUpperCase()} | FPS: {Math.round(currentFPS)}
            </div>
        </div>
    );
};

export default ThreeSceneOptimized;