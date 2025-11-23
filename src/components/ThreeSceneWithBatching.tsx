/**
 * ThreeScene with Batch Component Loading
 *
 * This is an example of how to integrate the batch loading system with the existing ThreeScene.
 * Components are conditionally rendered based on their tier and enabled state.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { useComponentEnabled, useComponentsEnabled } from '../hooks/useComponentEnabled';
import { ComponentTier } from '../services/batch-loading/ComponentBatchManager';
import { BatchControlPanel } from './debug/BatchControlPanel';
import { fpsBatchController } from '../services/fps/FPSBatchController';

// Import existing components
import Grass from './Grass';
import ClayCourtEffect from './ClayCourtEffect';
import ReceptionArea from './ReceptionArea';
import { ParkingLot } from './ParkingLot';
import { BMSControlRoom } from './BMSControlRoom';
import RoboticGrassSystem from './RoboticGrassSystem';
import TransportPods from './TransportPods';
import HydroponicsSystem from './HydroponicsSystem';
import MechanicalRooms from './MechanicalRooms';
import LockerRoom from './LockerRoom';
import WeatherSystem, { useWeather } from './WeatherSystem';
import WeatherControls from './WeatherControls';

// Wrapper components that check if they should render
const ConditionalGrass: React.FC<{ position: [number, number, number], size: [number, number] }> = ({ position, size }) => {
  const isEnabled = useComponentEnabled('grass-system');
  if (!isEnabled) return null;
  return <Grass position={position} size={size} bladeCount={1500} color="#4d7c0f" animated={true} />;
};

const ConditionalWeatherSystem: React.FC = () => {
  const isEnabled = useComponentEnabled('weather-system');
  const { weather, intensity } = useWeather();

  if (!isEnabled) return null;

  return (
    <WeatherSystem
      weather={weather}
      intensity={intensity}
      enableEffects={true}
      areaSize={[300, 300]}
      enableWetSurfaces={true}
    />
  );
};

const ConditionalClayCourtEffect: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const isEnabled = useComponentEnabled('clay-court-effect');
  if (!isEnabled) return null;
  return <ClayCourtEffect position={position} width={10} length={22} />;
};

const ConditionalTransportPods: React.FC = () => {
  const isEnabled = useComponentEnabled('transport-pods');
  if (!isEnabled) return null;
  return <TransportPods showRoutes={true} />;
};

const ConditionalRoboticGrass: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const isEnabled = useComponentsEnabled(['robotic-grass', 'grass-system']);
  if (!isEnabled) return null;
  return <RoboticGrassSystem position={position} robotCount={6} showPaths={true} showStatus={true} />;
};

const ConditionalShadows: React.FC = () => {
  const isEnabled = useComponentEnabled('shadows');
  if (!isEnabled) return null;
  return <ContactShadows position={[0, -0.2, 0]} opacity={0.6} scale={400} blur={3} far={20} color="#000" />;
};

const ConditionalBuildingShell: React.FC = () => {
  const isEnabled = useComponentEnabled('building-shell');
  if (!isEnabled) return null;

  return (
    <group>
      {/* Simplified building shell */}
      <mesh position={[0, 40, 0]}>
        <boxGeometry args={[140, 80, 120]} />
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
  );
};

const ConditionalParkingLot: React.FC = () => {
  const isEnabled = useComponentEnabled('parking-lot');
  if (!isEnabled) return null;
  return <ParkingLot position={[-100, 0.2, -20]} />;
};

const ConditionalTrees: React.FC = () => {
  const isEnabled = useComponentEnabled('trees');
  if (!isEnabled) return null;

  return (
    <group>
      {Array.from({ length: 15 }).map((_, i) => {
        const angle = (i / 15) * Math.PI * 2;
        const r = 110 + Math.random() * 20;
        return (
          <group key={i} position={[Math.cos(angle) * r, 0, Math.sin(angle) * r]}>
            <mesh position={[0, 2, 0]}>
              <cylinderGeometry args={[0.2, 0.5, 4]} />
              <meshStandardMaterial color="#78350f" />
            </mesh>
            <mesh position={[0, 4, 0]}>
              <dodecahedronGeometry args={[2]} />
              <meshStandardMaterial color="#15803d" roughness={0.8} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

// Main scene component with batch loading
export const ThreeSceneWithBatching: React.FC = () => {
  const [showDebugPanel, setShowDebugPanel] = useState(true);

  // Start FPS monitoring when component mounts
  useEffect(() => {
    fpsBatchController.start();

    // Subscribe to warnings
    const unsubscribe = fpsBatchController.onWarning((warning) => {
      console.warn(`FPS Warning: ${warning.message}`);
    });

    return () => {
      fpsBatchController.stop();
      unsubscribe();
    };
  }, []);

  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas
        shadows={useComponentEnabled('shadows')}
        dpr={1}
        camera={{ position: [180, 100, 180], fov: 35 }}
        gl={{ antialias: true }}
      >
        <PerspectiveCamera makeDefault fov={40} />

        {/* Essential Tier (Always On) */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[-80, 150, 100]}
          intensity={2}
          castShadow={useComponentEnabled('shadows')}
          shadow-mapSize={[2048, 2048]}
        >
          <orthographicCamera attach="shadow-camera" args={[-150, 150, 150, -150]} />
        </directionalLight>
        <Environment preset="park" />

        {/* Basic Court Geometry (Essential) */}
        <group>
          {/* Tennis Courts - Always rendered */}
          {Array.from({ length: 24 }).map((_, i) => {
            const row = Math.floor(i / 6);
            const col = i % 6;
            const type = i < 6 ? 'hard' : i < 12 ? 'clay' : i < 18 ? 'grass' : 'wood';

            return (
              <group key={i} position={[-35 + col * 14, 0.1, -40 + row * 26]}>
                <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                  <planeGeometry args={[10, 22]} />
                  <meshStandardMaterial color={
                    type === 'hard' ? '#3b82f6' :
                    type === 'clay' ? '#ea580c' :
                    type === 'grass' ? '#4d7c0f' : '#d4a373'
                  } />
                </mesh>

                {/* Clay court effect (Enhanced tier) */}
                {type === 'clay' && <ConditionalClayCourtEffect position={[0, 0, 0]} />}

                {/* Grass (Visual tier) */}
                {type === 'grass' && <ConditionalGrass position={[0, 0.1, 0]} size={[10, 22]} />}
              </group>
            );
          })}
        </group>

        {/* Core Tier Components */}
        <ConditionalBuildingShell />

        {/* Visual Tier Components */}
        <ConditionalParkingLot />
        <ConditionalTrees />
        <ConditionalShadows />

        {/* Enhanced Tier Components */}
        <ConditionalWeatherSystem />
        <ConditionalTransportPods />
        <ConditionalRoboticGrass position={[0, 0, 12]} />

        {/* Camera Controls (Essential) */}
        <OrbitControls
          enablePan={true}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={20}
          maxDistance={400}
          makeDefault
        />
      </Canvas>

      {/* Debug Control Panel */}
      {showDebugPanel && (
        <BatchControlPanel
          initiallyOpen={true}
          position="bottom-right"
          onClose={() => setShowDebugPanel(false)}
        />
      )}

      {/* Toggle Debug Panel Button */}
      {!showDebugPanel && (
        <button
          className="fixed bottom-6 right-6 p-3 bg-slate-800 hover:bg-slate-700 rounded-full shadow-lg z-40"
          onClick={() => setShowDebugPanel(true)}
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      )}

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/80 text-xs pointer-events-none select-none font-mono text-center">
        BATCH LOADING DEMO v1.0<br />
        Components load progressively based on FPS
      </div>
    </div>
  );
};

export default ThreeSceneWithBatching;