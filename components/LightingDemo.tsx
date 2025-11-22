/**
 * LightingDemo.tsx
 *
 * Demonstration component showing the LightingSystem in action
 * Can be used for testing and showcasing lighting capabilities
 */

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid } from '@react-three/drei';
import { LightingSystem } from './LightingSystem';
import * as THREE from 'three';

/**
 * Simple tennis court for demonstration
 */
const DemoTennisCourt: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <group position={position}>
      {/* Court surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 22]} />
        <meshStandardMaterial color="#3b82f6" roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Court lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[8, 20]} />
        <meshBasicMaterial color="white" wireframe transparent opacity={0.8} />
      </mesh>

      {/* Net */}
      <group position={[0, 1, 0]}>
        <mesh position={[-5, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 2]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        <mesh position={[5, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 2]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[10, 1.8, 0.02]} />
          <meshBasicMaterial color="white" transparent opacity={0.3} wireframe />
        </mesh>
      </group>
    </group>
  );
};

/**
 * Building outline for context
 */
const DemoBuilding: React.FC = () => {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[140, 120]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>

      {/* Building frame */}
      <lineSegments>
        <edgesGeometry
          attach="geometry"
          args={[new THREE.BoxGeometry(140, 80, 120)]}
        />
        <lineBasicMaterial attach="material" color="#ffffff" opacity={0.3} transparent />
      </lineSegments>

      {/* Multiple courts */}
      {Array.from({ length: 24 }).map((_, i) => {
        const row = Math.floor(i / 6);
        const col = i % 6;
        return (
          <DemoTennisCourt
            key={i}
            position={[-35 + col * 14, 0.1, -40 + row * 26]}
          />
        );
      })}
    </group>
  );
};

/**
 * Main demo component
 */
export const LightingDemo: React.FC = () => {
  return (
    <div className="w-full h-screen bg-slate-950">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[180, 100, 180]} fov={40} />

        {/* Demo scene */}
        <DemoBuilding />

        {/* Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]} receiveShadow>
          <planeGeometry args={[300, 300]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>

        {/* Grid helper */}
        <Grid
          args={[300, 300]}
          cellSize={10}
          cellThickness={0.5}
          cellColor="#374151"
          sectionSize={50}
          sectionThickness={1}
          sectionColor="#4b5563"
          fadeDistance={400}
          fadeStrength={1}
          followCamera={false}
        />

        {/* Lighting System */}
        <LightingSystem showControls={true} />

        {/* Camera controls */}
        <OrbitControls
          enablePan
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={20}
          maxDistance={400}
          makeDefault
        />
      </Canvas>

      {/* Info overlay */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70 text-xs pointer-events-none select-none font-mono text-center">
        LIGHTING SYSTEM DEMONSTRATION
        <br />
        Use controls to adjust time of day, lighting modes, and atmosphere
      </div>
    </div>
  );
};

export default LightingDemo;
