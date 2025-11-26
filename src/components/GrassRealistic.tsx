import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree, extend } from '@react-three/fiber';
import * as THREE from 'three';

interface GrassRealisticProps {
  position: [number, number, number];
  size: [number, number];
  bladeCount?: number;
  color?: string;
  animated?: boolean;
  performanceMode?: 'high' | 'medium' | 'low';
}

/**
 * Realistic Grass Component with tapered blade geometry
 *
 * Based on research from:
 * - Breath of the Wild style grass (5-vertex blades)
 * - Codrops fluffy grass tutorial
 * - three.js forum instanced grass examples
 *
 * Key features:
 * - Tapered blade shape (wider at base, pointed at tip)
 * - Vertex colors for animation control (black=static, white=moves)
 * - Custom shader material for wind animation
 * - Instanced rendering for performance
 */

// Custom grass blade geometry - 5 vertices forming a tapered blade
function createGrassBladeGeometry(): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry();

  // Blade dimensions
  const bladeWidth = 0.08;  // Width at base
  const bladeHeight = 1.0;  // Full height
  const midHeight = 0.5;    // Height of middle vertices
  const midWidth = bladeWidth * 0.6; // Narrower in middle

  // 5 vertices: 2 bottom, 2 middle, 1 top
  // Arranged as a triangle strip for proper rendering
  const vertices = new Float32Array([
    // Bottom left
    -bladeWidth / 2, 0, 0,
    // Bottom right
    bladeWidth / 2, 0, 0,
    // Middle left
    -midWidth / 2, midHeight, 0,
    // Middle right
    midWidth / 2, midHeight, 0,
    // Top (single point)
    0, bladeHeight, 0,
  ]);

  // Indices for triangles (3 triangles to form the blade)
  const indices = new Uint16Array([
    0, 1, 2,  // Bottom-left triangle
    1, 3, 2,  // Bottom-right triangle
    2, 3, 4,  // Top triangle
  ]);

  // Vertex colors for animation control
  // Black (0) = static, Gray (0.5) = moderate movement, White (1) = maximum movement
  const colors = new Float32Array([
    0, 0, 0,      // Bottom left - black (static)
    0, 0, 0,      // Bottom right - black (static)
    0.4, 0.4, 0.4, // Middle left - gray (moderate)
    0.4, 0.4, 0.4, // Middle right - gray (moderate)
    1, 1, 1,      // Top - white (maximum movement)
  ]);

  // UVs for potential texture mapping
  const uvs = new Float32Array([
    0, 0,
    1, 0,
    0, 0.5,
    1, 0.5,
    0.5, 1,
  ]);

  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  geometry.computeVertexNormals();

  return geometry;
}

// Custom shader material for wind animation
const grassVertexShader = `
  uniform float uTime;
  uniform float uWindStrength;

  attribute vec3 color;

  varying vec3 vColor;
  varying vec2 vUv;
  varying float vWindFactor;

  void main() {
    vColor = color;
    vUv = uv;

    // Use vertex color (grayscale) as wind factor
    // Black vertices don't move, white vertices move most
    vWindFactor = color.r;

    vec3 pos = position;

    // Wind displacement based on vertex color (animation weight)
    // Only affects vertices with color > 0 (middle and top)
    if (vWindFactor > 0.0) {
      // Primary wave - large slow movement
      float wave1 = sin(uTime * 1.5 + pos.x * 2.0 + pos.z * 2.0) * uWindStrength;
      // Secondary wave - smaller faster movement for natural feel
      float wave2 = sin(uTime * 3.0 + pos.x * 4.0) * uWindStrength * 0.3;
      // Tertiary wave - adds rustling effect
      float wave3 = sin(uTime * 5.0 + pos.z * 6.0) * uWindStrength * 0.1;

      float totalWind = (wave1 + wave2 + wave3) * vWindFactor;

      pos.x += totalWind;
      pos.z += totalWind * 0.5;
    }

    vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const grassFragmentShader = `
  uniform vec3 uBaseColor;
  uniform vec3 uTipColor;

  varying vec3 vColor;
  varying vec2 vUv;
  varying float vWindFactor;

  void main() {
    // Gradient from base color to tip color based on height (UV.y)
    vec3 finalColor = mix(uBaseColor, uTipColor, vUv.y * 0.7);

    // Slight color variation based on wind factor for depth
    finalColor *= (0.9 + vWindFactor * 0.1);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

const GrassRealistic: React.FC<GrassRealisticProps> = ({
  position,
  size,
  bladeCount = 2000,
  color = '#4d7c0f',
  animated = true,
  performanceMode = 'medium'
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { camera } = useThree();

  // Adjust blade count based on performance mode
  const optimizedBladeCount = useMemo(() => {
    const modifiers = {
      high: 1.0,
      medium: 0.6,
      low: 0.3
    };
    return Math.floor(bladeCount * modifiers[performanceMode]);
  }, [bladeCount, performanceMode]);

  // Create grass blade geometry (reused for all instances)
  const geometry = useMemo(() => createGrassBladeGeometry(), []);

  // Create shader material with uniforms
  const material = useMemo(() => {
    const baseColor = new THREE.Color(color);
    // Tip color is slightly lighter/yellower
    const tipColor = new THREE.Color(color).offsetHSL(0.05, 0, 0.15);

    return new THREE.ShaderMaterial({
      vertexShader: grassVertexShader,
      fragmentShader: grassFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uWindStrength: { value: 0.15 },
        uBaseColor: { value: baseColor },
        uTipColor: { value: tipColor },
      },
      side: THREE.DoubleSide,
    });
  }, [color]);

  // Generate grass blade instances
  const grassData = useMemo(() => {
    const instances = [];
    const [width, depth] = size;

    for (let i = 0; i < optimizedBladeCount; i++) {
      const x = (Math.random() - 0.5) * width;
      const z = (Math.random() - 0.5) * depth;
      const height = 0.6 + Math.random() * 0.5; // Vary height 60%-110%
      const rotation = Math.random() * Math.PI * 2; // Random facing direction
      const lean = (Math.random() - 0.5) * 0.3; // Slight random lean
      const scale = 0.8 + Math.random() * 0.4; // Width variation

      instances.push({
        position: [x, 0, z] as [number, number, number],
        rotation,
        height,
        scale,
        lean,
        phase: Math.random() * Math.PI * 2, // For wind desync
      });
    }

    return instances;
  }, [size, optimizedBladeCount]);

  // Apply transforms to instances
  useEffect(() => {
    if (!meshRef.current) return;

    const tempObject = new THREE.Object3D();

    grassData.forEach((blade, i) => {
      const [x, y, z] = blade.position;
      tempObject.position.set(x, y, z);
      tempObject.rotation.set(blade.lean, blade.rotation, 0);
      tempObject.scale.set(blade.scale, blade.height, blade.scale);
      tempObject.updateMatrix();

      meshRef.current!.setMatrixAt(i, tempObject.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [grassData]);

  // Animate wind
  useFrame((state) => {
    if (!animated || !material.uniforms) return;

    // Update time uniform for shader animation
    material.uniforms.uTime.value = state.clock.elapsedTime;

    // Adjust wind strength based on performance mode
    const windStrengths = {
      high: 0.15,
      medium: 0.1,
      low: 0.05
    };
    material.uniforms.uWindStrength.value = windStrengths[performanceMode];
  });

  return (
    <group position={position}>
      <instancedMesh
        ref={meshRef}
        args={[geometry, material, optimizedBladeCount]}
        castShadow={performanceMode === 'high'}
        receiveShadow
        frustumCulled={true}
      />
    </group>
  );
};

export default GrassRealistic;
