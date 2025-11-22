import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, OrbitControls } from '@react-three/drei';

// Simple rotating box to test if Three.js works at all
function RotatingBox() {
  const meshRef = useRef<any>();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta;
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#DFFF4F" />
    </mesh>
  );
}

const TestScene: React.FC = () => {
  console.log('TestScene rendering');

  return (
    <div style={{ width: '100%', height: '100%', background: '#1a1a2e' }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <RotatingBox />
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default TestScene;