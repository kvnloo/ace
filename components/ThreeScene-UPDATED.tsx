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
import { Layers, Ruler, Eye, Box, Maximize2, Cloud, Sun, Users, Activity, Thermometer } from 'lucide-react';
import Grass from './Grass';
import ClayCourtEffect from './ClayCourtEffect';
import ReceptionArea from './ReceptionArea';
import { getCourtTexture, type CourtSurfaceType } from '../src/utils/courtTextures';
import { ParkingLot } from './ParkingLot';
import { BMSControlRoom } from './BMSControlRoom';
import LockerRoom from './LockerRoom';

// === EXISTING IMPORTS (PHASE 1) ===
import RoboticGrassSystem from './RoboticGrassSystem';
import TransportPods from './TransportPods';
import HydroponicsSystem from './HydroponicsSystem';
import MechanicalRooms from './MechanicalRooms';

// === NEW IMPORTS (PHASE 2) ===
// APEX Health Facility
import BiometricLab from './BiometricLab';
import MovementStudio from './MovementStudio';
import RecoverySuite from './RecoverySuite';
import CognitiveLab from './CognitiveLab';

// Analytics & Data Visualization
import PerformanceMetrics from './PerformanceMetrics';
import HeatMapOverlay from './HeatMapOverlay';
import AnalyticsDashboard from './AnalyticsDashboard';

// Advanced Visual Features
import CharacterSystem from './CharacterSystem';
import LightingSystem from './LightingSystem';
import WeatherSystem, { useWeather } from './WeatherSystem';

// Infrastructure
import SupportSpaces from './SupportSpaces';

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
  { id: 'level2_apex', title: 'L2: APEX Health Facility', description: 'Biometric Lab, Movement Studio, Recovery Suite, Cognitive Lab.', icon: '🧬', position: [-30, 45, 0] },
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

// Enhanced Controls Overlay with new toggles
const ControlsOverlay = ({ activeFloor, setActiveFloor, annotationMode, setAnnotationMode, systemToggles, setSystemToggles, weather, setWeather, lightingMode, setLightingMode }) => (
  <div className="absolute top-4 right-4 z-50 bg-black/20 backdrop-blur-md rounded-xl p-4 border border-white/10">
    {/* Floor Controls */}
    <div className="space-y-2">
      <div className="text-xs font-mono text-white/50 uppercase tracking-wider">Floor View</div>
      <div className="flex flex-col gap-2">
        {['ALL', 0, 1, 2, 3].map((floor) => (
          <button
            key={floor}
            onClick={() => setActiveFloor(floor as FloorLevel)}
            className={`px-3 py-2 rounded-lg font-mono text-xs transition-all ${
              activeFloor === floor
              ? 'bg-yellow-400 text-black font-bold shadow-lg'
              : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Box className="w-3 h-3 inline mr-2" />
            {floor === 'ALL' ? 'All Floors' : `Level ${floor}`}
          </button>
        ))}
      </div>
    </div>

    <div className="h-px bg-white/20 my-4" />

    {/* Annotation Controls */}
    <div className="space-y-2">
      <div className="text-xs font-mono text-white/50 uppercase tracking-wider">Annotations</div>
      <div className="flex flex-col gap-2">
        <button
          onClick={() => setAnnotationMode(annotationMode === 'LABELS' ? 'NONE' : 'LABELS')}
          className={`px-3 py-2 rounded-lg font-mono text-xs transition-all ${
            annotationMode === 'LABELS'
            ? 'bg-white text-black'
            : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          <Eye className="w-3 h-3 inline mr-2" />
          Labels
        </button>
        <button
          onClick={() => setAnnotationMode(annotationMode === 'MEASUREMENTS' ? 'NONE' : 'MEASUREMENTS')}
          className={`px-3 py-2 rounded-lg font-mono text-xs transition-all ${
            annotationMode === 'MEASUREMENTS'
            ? 'bg-white text-black'
            : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          <Ruler className="w-3 h-3 inline mr-2" />
          Dimensions
        </button>
      </div>
    </div>

    <div className="h-px bg-white/20 my-4" />

    {/* System Toggles */}
    <div className="space-y-2">
      <div className="text-xs font-mono text-white/50 uppercase tracking-wider">Systems</div>
      <div className="flex flex-col gap-2">
        <button
          onClick={() => setSystemToggles({...systemToggles, robots: !systemToggles.robots})}
          className={`px-3 py-2 rounded-lg font-mono text-xs transition-all ${
            systemToggles.robots
            ? 'bg-green-400 text-black'
            : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          🤖 Robots
        </button>
        <button
          onClick={() => setSystemToggles({...systemToggles, transport: !systemToggles.transport})}
          className={`px-3 py-2 rounded-lg font-mono text-xs transition-all ${
            systemToggles.transport
            ? 'bg-blue-400 text-black'
            : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          🚊 Transport
        </button>
        <button
          onClick={() => setSystemToggles({...systemToggles, characters: !systemToggles.characters})}
          className={`px-3 py-2 rounded-lg font-mono text-xs transition-all ${
            systemToggles.characters
            ? 'bg-purple-400 text-black'
            : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          <Users className="w-3 h-3 inline mr-2" />
          Characters
        </button>
        <button
          onClick={() => setSystemToggles({...systemToggles, heatMap: !systemToggles.heatMap})}
          className={`px-3 py-2 rounded-lg font-mono text-xs transition-all ${
            systemToggles.heatMap
            ? 'bg-red-400 text-black'
            : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          <Thermometer className="w-3 h-3 inline mr-2" />
          Heat Map
        </button>
        <button
          onClick={() => setSystemToggles({...systemToggles, metrics: !systemToggles.metrics})}
          className={`px-3 py-2 rounded-lg font-mono text-xs transition-all ${
            systemToggles.metrics
            ? 'bg-cyan-400 text-black'
            : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          <Activity className="w-3 h-3 inline mr-2" />
          Metrics
        </button>
        <button
          onClick={() => setSystemToggles({...systemToggles, analytics: !systemToggles.analytics})}
          className={`px-3 py-2 rounded-lg font-mono text-xs transition-all ${
            systemToggles.analytics
            ? 'bg-indigo-400 text-black'
            : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          📊 Analytics
        </button>
      </div>
    </div>

    <div className="h-px bg-white/20 my-4" />

    {/* Environment Controls */}
    <div className="space-y-2">
      <div className="text-xs font-mono text-white/50 uppercase tracking-wider">Environment</div>
      <div className="flex flex-col gap-2">
        {/* Weather Selector */}
        <select
          value={weather}
          onChange={(e) => setWeather(e.target.value)}
          className="px-3 py-2 rounded-lg font-mono text-xs bg-white/10 text-white border border-white/20"
        >
          <option value="clear">☀️ Clear</option>
          <option value="rain">🌧️ Rain</option>
          <option value="snow">❄️ Snow</option>
          <option value="windy">💨 Windy</option>
          <option value="storm">⛈️ Storm</option>
        </select>

        {/* Lighting Mode */}
        <select
          value={lightingMode}
          onChange={(e) => setLightingMode(e.target.value)}
          className="px-3 py-2 rounded-lg font-mono text-xs bg-white/10 text-white border border-white/20"
        >
          <option value="dawn">🌅 Dawn</option>
          <option value="day">☀️ Day</option>
          <option value="dusk">🌇 Dusk</option>
          <option value="night">🌙 Night</option>
        </select>
      </div>
    </div>
  </div>
);

// [Copy all existing components like TennisCourt, FloorPlate, etc. from original file - omitted for brevity]
// [Include all the existing level components, building components, etc.]

// === MAIN COMPONENT ===
interface ThreeSceneProps {
  onFeatureSelect: (feature: FeatureData) => void;
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ onFeatureSelect }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeFloor, setActiveFloor] = useState<FloorLevel>('ALL');
  const [annotationMode, setAnnotationMode] = useState<AnnotationMode>('LABELS');
  const controlsRef = useRef<any>(null);
  const isAnimatingRef = useRef(false);

  // New state for toggling systems
  const [systemToggles, setSystemToggles] = useState({
    robots: true,
    transport: true,
    characters: true,
    heatMap: false,
    metrics: true,
    analytics: false
  });

  // Weather and lighting state
  const [weather, setWeather] = useState('clear');
  const [lightingMode, setLightingMode] = useState('day');
  const [weatherIntensity, setWeatherIntensity] = useState(0.8);

  // Generate court positions for character system and heat maps
  const courtPositions = useMemo(() => {
    const positions: Array<[number, number, number]> = [];
    // Ground floor courts
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 6; col++) {
        positions.push([
          (col - 2.5) * 13,
          0,
          (row - 1.5) * 25
        ]);
      }
    }
    return positions;
  }, []);

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
      {/* Enhanced Controls Overlay */}
      <ControlsOverlay
        activeFloor={activeFloor}
        setActiveFloor={setActiveFloor}
        annotationMode={annotationMode}
        setAnnotationMode={setAnnotationMode}
        systemToggles={systemToggles}
        setSystemToggles={setSystemToggles}
        weather={weather}
        setWeather={setWeather}
        lightingMode={lightingMode}
        setLightingMode={setLightingMode}
      />

      {/* Performance Metrics Overlay */}
      {systemToggles.metrics && <PerformanceMetrics />}

      {/* Analytics Dashboard Overlay */}
      {systemToggles.analytics && <AnalyticsDashboard />}

      <Canvas shadows dpr={[1, 1.5]} camera={{ position: [180, 100, 180], fov: 35 }}>
        <CameraRig activeFloor={activeFloor} controlsRef={controlsRef} isAnimatingRef={isAnimatingRef} />
        <PerspectiveCamera makeDefault fov={40} />

        {/* Advanced Lighting System */}
        <LightingSystem mode={lightingMode} />

        {/* Weather Effects */}
        <WeatherSystem weather={weather} intensity={weatherIntensity} areaSize={[300, 300]} />

        <Environment preset="park" />

        <group>
            <BuildingShell activeFloor={activeFloor} />
            <CampusGrounds />

            {/* Ground Floor with all courts and facilities */}
            {(activeFloor === 'ALL' || activeFloor === 0) && (
              <group>
                <GroundFloor active={activeFloor === 0} showMeasurements={showMeasurements} showLabels={showLabels} />

                {/* Robotic Grass Management */}
                {systemToggles.robots && (
                  <RoboticGrassSystem
                    position={[0, 0, 25]}
                    robotCount={6}
                    showLabels={showLabels}
                  />
                )}

                {/* Heat Map Overlay for courts */}
                {systemToggles.heatMap && (
                  <HeatMapOverlay
                    courts={courtPositions}
                    opacity={0.7}
                  />
                )}

                {/* Support Spaces */}
                <SupportSpaces />
              </group>
            )}

            {/* Level 1 - Racquet Sports & Mechanical */}
            {(activeFloor === 'ALL' || activeFloor === 1) && (
              <group>
                <LevelOne active={activeFloor === 1} showMeasurements={showMeasurements} />

                {/* Mechanical Rooms */}
                <MechanicalRooms />
              </group>
            )}

            {/* Level 2 - Social Sports & APEX Health */}
            {(activeFloor === 'ALL' || activeFloor === 2) && (
              <group position={[0, 40, 0]}>
                <LevelTwo active={activeFloor === 2} showMeasurements={showMeasurements} />

                {/* APEX Health Facility */}
                <group position={[-30, 0, 0]}>
                  <BiometricLab />
                  <MovementStudio position={[20, 0, 0]} />
                  <RecoverySuite position={[0, 0, 20]} />
                  <CognitiveLab position={[20, 0, 20]} />
                </group>
              </group>
            )}

            {/* Level 3 - Vertical Farming */}
            {(activeFloor === 'ALL' || activeFloor === 3) && (
              <group>
                <LevelThree active={activeFloor === 3} showMeasurements={showMeasurements} />

                {/* Hydroponics System */}
                <HydroponicsSystem />
              </group>
            )}

            {/* Autonomous Transport Pod System (all levels) */}
            {systemToggles.transport && (
              <TransportPods showRoutes={annotationMode === 'LABELS'} />
            )}

            {/* Character Animation System */}
            {systemToggles.characters && (
              <CharacterSystem
                courts={courtPositions}
                enabled={true}
              />
            )}

            {/* Feature Markers */}
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
        ACE FACILITY v4.0 - APEX EDITION <br/>
        INTERACTIVE ARCHITECTURAL MODEL <br/>
        {systemToggles.characters && <span className="text-purple-400">283 CHARACTERS</span>} •
        {systemToggles.robots && <span className="text-green-400"> 6 ROBOTS</span>} •
        {systemToggles.transport && <span className="text-blue-400"> 8 PODS</span>}
      </div>
    </div>
  );
};

export default ThreeScene;