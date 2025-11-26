import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Safe debug hook - works without DebugContext
const useSafeDebug = () => {
  try {
    const { useDebug } = require('../contexts/DebugContext');
    return useDebug();
  } catch {
    return {
      registerAsset: () => {},
      isAssetEnabled: () => true
    };
  }
};

interface ClayCourtEffectProps {
  position: [number, number, number];
  width?: number;
  length?: number;
}

/**
 * Clay Court Component with Realistic Texture and Particle Effects
 *
 * Features:
 * - Custom texture with noise for realistic clay appearance
 * - Roughness and normal map for depth
 * - Animated dust particles for dynamic effect
 * - Performance-optimized particle system
 */
const ClayCourtEffect: React.FC<ClayCourtEffectProps> = ({
  position,
  width = 10,
  length = 22
}) => {
  const { registerAsset, isAssetEnabled } = useSafeDebug();
  const particlesRef = useRef<THREE.Points>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);
  const normalMapRef = useRef<THREE.CanvasTexture | null>(null);
  const roughnessMapRef = useRef<THREE.CanvasTexture | null>(null);

  // Register debug asset
  useEffect(() => {
    registerAsset({
      id: 'clay-court-particles',
      name: 'Clay Court Dust Particles',
      type: 'effects',
      enabled: true,
      performanceCost: 3,
      dependencies: []
    });
  }, [registerAsset]);

  // Generate clay texture using canvas
  const clayTexture = useMemo(() => {
    if (textureRef.current) return textureRef.current;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    // Base clay color with variation
    const baseColor = '#ea580c';
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add noise texture for realism
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 40;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise * 0.6));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise * 0.4));
    }

    ctx.putImageData(imageData, 0, 0);

    // Add subtle dirt patches
    for (let i = 0; i < 80; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = Math.random() * 20 + 5;

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, 'rgba(200, 70, 10, 0.3)');
      gradient.addColorStop(1, 'rgba(200, 70, 10, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);

    textureRef.current = texture;
    return texture;
  }, []);

  // Generate normal map for surface detail
  const normalMap = useMemo(() => {
    if (normalMapRef.current) return normalMapRef.current;

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    ctx.fillStyle = '#8080ff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 100; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = Math.random() * 8 + 2;

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, 'rgba(140, 140, 255, 0.4)');
      gradient.addColorStop(1, 'rgba(128, 128, 255, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);

    normalMapRef.current = texture;
    return texture;
  }, []);

  // Generate roughness map
  const roughnessMap = useMemo(() => {
    if (roughnessMapRef.current) return roughnessMapRef.current;

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    ctx.fillStyle = '#cccccc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 60;
      const val = Math.max(150, Math.min(255, 200 + noise));
      data[i] = val;
      data[i + 1] = val;
      data[i + 2] = val;
    }

    ctx.putImageData(imageData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);

    roughnessMapRef.current = texture;
    return texture;
  }, []);

  // Create particle system for dust effect
  const particles = useMemo(() => {
    const particleCount = 150;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const lifetimes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      positions[i3] = (Math.random() - 0.5) * width;
      positions[i3 + 1] = Math.random() * 0.5;
      positions[i3 + 2] = (Math.random() - 0.5) * length;

      velocities[i3] = (Math.random() - 0.5) * 0.01;
      velocities[i3 + 1] = Math.random() * 0.02 + 0.01;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;

      sizes[i] = Math.random() * 0.15 + 0.05;
      lifetimes[i] = Math.random() * Math.PI * 2;
    }

    return { positions, velocities, sizes, lifetimes };
  }, [width, length]);

  // Animate particles
  useFrame((_, delta) => {
    if (!particlesRef.current || !isAssetEnabled('clay-court-particles')) return;

    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    const particleCount = positions.length / 3;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      particles.lifetimes[i] += delta;

      positions[i3] += particles.velocities[i3];
      positions[i3 + 1] += particles.velocities[i3 + 1];
      positions[i3 + 2] += particles.velocities[i3 + 2];

      if (positions[i3 + 1] > 2 ||
          Math.abs(positions[i3]) > width / 2 ||
          Math.abs(positions[i3 + 2]) > length / 2) {
        positions[i3] = (Math.random() - 0.5) * width;
        positions[i3 + 1] = 0.1;
        positions[i3 + 2] = (Math.random() - 0.5) * length;
        particles.lifetimes[i] = 0;
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group position={position}>
      {/* Clay Court Surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial
          color="#ea580c"
          map={clayTexture}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(0.3, 0.3)}
          roughnessMap={roughnessMap}
          roughness={0.95}
          metalness={0}
        />
      </mesh>

      {/* Court Lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[width * 0.8, length * 0.9]} />
        <meshBasicMaterial color="white" wireframe transparent opacity={0.8} />
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[width * 0.78, length * 0.88]} />
          <meshBasicMaterial color="#ea580c" />
        </mesh>
      </mesh>

      {/* Dust Particles */}
      {isAssetEnabled('clay-court-particles') && (
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particles.positions.length / 3}
              array={particles.positions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-size"
              count={particles.sizes.length}
              array={particles.sizes}
              itemSize={1}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.1}
            color="#d97706"
            transparent
            opacity={0.3}
            sizeAttenuation
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}
    </group>
  );
};

export default ClayCourtEffect;
