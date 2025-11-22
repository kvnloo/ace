import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import HeatMapOverlay from './HeatMapOverlay';

/**
 * Minimal Heat Map Example
 *
 * Simple demonstration showing basic heat map functionality.
 * Perfect for quick testing and understanding core features.
 */

const SimpleCourt: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const courtWidth = 10;
  const courtLength = 22;

  return (
    <group position={position}>
      {/* Court surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[courtWidth, courtLength]} />
        <meshStandardMaterial color="#3b82f6" roughness={0.7} />
      </mesh>

      {/* Court lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[8.23, 21]} />
        <meshBasicMaterial color="white" wireframe opacity={0.8} transparent />
      </mesh>

      {/* Net posts */}
      <mesh position={[-5, 1, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 2]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[5, 1, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 2]} />
        <meshStandardMaterial color="#333" />
      </mesh>

      {/* Net */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[10, 1.8, 0.02]} />
        <meshBasicMaterial color="white" transparent opacity={0.3} wireframe />
      </mesh>
    </group>
  );
};

const HeatMapExample: React.FC = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0f172a' }}>
      {/* Header */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: '20px',
          background: 'rgba(15, 23, 42, 0.9)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          zIndex: 10,
        }}
      >
        <h1 style={{ color: '#DFFF4F', margin: 0, fontSize: '24px' }}>
          Heat Map Visualization Example
        </h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.5)', margin: '5px 0 0 0', fontSize: '14px' }}>
          Interactive court analytics with pattern detection
        </p>
      </div>

      {/* Instructions */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          background: 'rgba(15, 23, 42, 0.95)',
          padding: '15px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'white',
          fontSize: '12px',
          maxWidth: '300px',
          zIndex: 10,
        }}
      >
        <h3 style={{ margin: '0 0 10px 0', color: '#DFFF4F' }}>Controls</h3>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li>Click and drag to rotate view</li>
          <li>Scroll to zoom in/out</li>
          <li>Use control panel to adjust settings</li>
          <li>Toggle data types to see different patterns</li>
          <li>Play/pause timeline for historical playback</li>
        </ul>
      </div>

      {/* 3D Scene */}
      <Canvas shadows dpr={[1, 1.5]}>
        <PerspectiveCamera makeDefault position={[15, 20, 15]} fov={50} />

        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[20, 30, 20]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />

        {/* Environment */}
        <Environment preset="sunset" />

        {/* Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>

        {/* Tennis Court */}
        <SimpleCourt position={[0, 0, 0]} />

        {/* Heat Map Overlay */}
        <HeatMapOverlay
          position={[0, 0, 0]}
          courtWidth={10}
          courtLength={22}
          courtId="example_court"
          courtType="hard"
          initialMode="historical"
          initialDataType="player_position"
          showControls={true}
          onPatternDetected={(pattern) => {
            console.log('Pattern detected:', pattern);
          }}
        />

        {/* Camera controls */}
        <OrbitControls
          enablePan={true}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.2}
          minDistance={10}
          maxDistance={60}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
};

export default HeatMapExample;
