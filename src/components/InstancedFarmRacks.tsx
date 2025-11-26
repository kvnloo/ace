/**
 * InstancedFarmRacks Component
 *
 * High-performance vertical farm with ACTUAL GRASS growing on hydroponic trays.
 * This is a grass nursery that grows turf for the tennis courts below.
 * Features: Metal rack structure, soil trays, LED grow lights, and dense grass blades.
 */

import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RackConfig {
    position: [number, number, number];
}

interface InstancedFarmRacksProps {
    racks: RackConfig[];
}

// Shared geometries - created once at module level
const rackPostGeometry = new THREE.BoxGeometry(0.15, 10, 0.15); // Vertical posts
const rackBeamGeometry = new THREE.BoxGeometry(20, 0.1, 0.1); // Horizontal beams
const trayGeometry = new THREE.BoxGeometry(18, 0.3, 4); // Growing trays with soil depth
const soilGeometry = new THREE.BoxGeometry(17.8, 0.15, 3.8); // Soil surface
const ledStripGeometry = new THREE.BoxGeometry(17, 0.08, 0.15); // LED bars

// Create grass blade geometry for farm grass
const createFarmGrassGeometry = (): THREE.BufferGeometry => {
  const geometry = new THREE.BufferGeometry();
  const bladeWidth = 0.008; // 8mm - thicker mature grass
  const bladeHeight = 0.18; // 18cm - ready for harvest
  const midHeight = 0.09; // Halfway point
  const midWidth = bladeWidth * 0.5;

  const vertices = new Float32Array([
    -bladeWidth / 2, 0, 0,
    bladeWidth / 2, 0, 0,
    -midWidth / 2, midHeight, 0,
    midWidth / 2, midHeight, 0,
    0, bladeHeight, 0,
  ]);

  const indices = new Uint16Array([0, 1, 2, 1, 3, 2, 2, 3, 4]);
  const colors = new Float32Array([0, 0, 0, 0, 0, 0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1, 1, 1]);

  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  geometry.computeVertexNormals();

  return geometry;
};

// Shared materials
const frameMaterial = new THREE.MeshStandardMaterial({
    color: '#1f2937', // Dark metal frame
    metalness: 0.8,
    roughness: 0.3
});

const trayMaterial = new THREE.MeshStandardMaterial({
    color: '#4b5563', // Dark grey plastic trays
    roughness: 0.8,
    metalness: 0.1
});

const soilMaterial = new THREE.MeshStandardMaterial({
    color: '#3d2817', // Rich dark soil
    roughness: 1.0,
    metalness: 0
});

const ledMaterial = new THREE.MeshStandardMaterial({
    color: '#ec4899', // Pink/purple grow light
    emissive: '#ec4899',
    emissiveIntensity: 2.0,
    toneMapped: false
});

// Grass shader for wind animation
const grassVertexShader = `
  uniform float uTime;
  attribute vec3 color;
  varying vec3 vColor;
  varying float vHeight;

  void main() {
    vColor = color;
    vHeight = color.r;

    vec3 pos = position;

    // Gentle sway for indoor grass
    if (vHeight > 0.0) {
      float wave = sin(uTime * 2.0 + pos.x * 10.0 + pos.z * 10.0) * 0.02 * vHeight;
      pos.x += wave;
    }

    vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const grassFragmentShader = `
  uniform vec3 uBaseColor;
  uniform vec3 uTipColor;
  varying vec3 vColor;
  varying float vHeight;

  void main() {
    // Vibrant young grass - bright green with yellow tips
    vec3 finalColor = mix(uBaseColor, uTipColor, vHeight * 0.8);
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

/**
 * Main component - renders all farm racks with grass growing on them
 */
const InstancedFarmRacks: React.FC<InstancedFarmRacksProps> = ({ racks }) => {
    console.log(`[InstancedFarmRacks] Rendering with ${racks.length} racks`);

    return (
        <group>
            {/* Metal rack structure */}
            <InstancedRackFrames racks={racks} />

            {/* Growing trays with soil */}
            <InstancedGrowingTrays racks={racks} />

            {/* Soil surface on trays */}
            <InstancedSoil racks={racks} />

            {/* LED grow lights */}
            <InstancedLEDStrips racks={racks} />

            {/* ACTUAL GRASS growing on each tray */}
            <FarmGrass racks={racks} />
        </group>
    );
};

/**
 * Renders rack frame structure - 4 corner posts + horizontal beams
 */
const InstancedRackFrames: React.FC<{ racks: RackConfig[] }> = ({ racks }) => {
    const postRef = useRef<THREE.InstancedMesh>(null);
    const beamRef = useRef<THREE.InstancedMesh>(null);

    useEffect(() => {
        if (!postRef.current || !beamRef.current) return;

        const tempMatrix = new THREE.Matrix4();
        const quaternion = new THREE.Quaternion();
        const beamRotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));

        let postIndex = 0;
        let beamIndex = 0;

        racks.forEach((rack) => {
            const [x, y, z] = rack.position;
            const halfWidth = 9;
            const halfDepth = 12;

            // 4 corner posts per rack
            const postPositions = [
                [x - halfWidth, y + 5, z - halfDepth],
                [x + halfWidth, y + 5, z - halfDepth],
                [x - halfWidth, y + 5, z + halfDepth],
                [x + halfWidth, y + 5, z + halfDepth],
            ];

            postPositions.forEach(([px, py, pz]) => {
                tempMatrix.compose(
                    new THREE.Vector3(px, py, pz),
                    quaternion,
                    new THREE.Vector3(1, 1, 1)
                );
                postRef.current!.setMatrixAt(postIndex++, tempMatrix);
            });

            // Horizontal beams at each level (5 levels)
            for (let level = 0; level < 5; level++) {
                const beamY = y + 1 + level * 2;
                // Front and back beams
                tempMatrix.compose(
                    new THREE.Vector3(x, beamY, z - halfDepth),
                    beamRotation,
                    new THREE.Vector3(1, 1, 1)
                );
                beamRef.current!.setMatrixAt(beamIndex++, tempMatrix);

                tempMatrix.compose(
                    new THREE.Vector3(x, beamY, z + halfDepth),
                    beamRotation,
                    new THREE.Vector3(1, 1, 1)
                );
                beamRef.current!.setMatrixAt(beamIndex++, tempMatrix);
            }
        });

        postRef.current.instanceMatrix.needsUpdate = true;
        beamRef.current.instanceMatrix.needsUpdate = true;
    }, [racks]);

    return (
        <>
            <instancedMesh
                ref={postRef}
                args={[rackPostGeometry, frameMaterial, racks.length * 4]}
                castShadow
                frustumCulled={true}
            />
            <instancedMesh
                ref={beamRef}
                args={[rackBeamGeometry, frameMaterial, racks.length * 10]}
                castShadow
                frustumCulled={true}
            />
        </>
    );
};

/**
 * Growing trays - 5 levels x 3 trays per level per rack
 */
const InstancedGrowingTrays: React.FC<{ racks: RackConfig[] }> = ({ racks }) => {
    const ref = useRef<THREE.InstancedMesh>(null);
    const levelsPerRack = 5;
    const traysPerLevel = 3;
    const traysPerRack = levelsPerRack * traysPerLevel;

    useEffect(() => {
        if (!ref.current) return;

        const tempMatrix = new THREE.Matrix4();
        const quaternion = new THREE.Quaternion();
        let trayIndex = 0;

        racks.forEach((rack) => {
            const [x, y, z] = rack.position;

            for (let level = 0; level < levelsPerRack; level++) {
                const trayY = y + 0.85 + level * 2;

                // 3 trays per level, spaced along z-axis
                for (let t = 0; t < traysPerLevel; t++) {
                    const trayZ = z - 8 + t * 8;

                    tempMatrix.compose(
                        new THREE.Vector3(x, trayY, trayZ),
                        quaternion,
                        new THREE.Vector3(1, 1, 1)
                    );
                    ref.current!.setMatrixAt(trayIndex++, tempMatrix);
                }
            }
        });

        ref.current.instanceMatrix.needsUpdate = true;
    }, [racks]);

    return (
        <instancedMesh
            ref={ref}
            args={[trayGeometry, trayMaterial, racks.length * traysPerRack]}
            receiveShadow
            frustumCulled={true}
        />
    );
};

/**
 * Soil surface on top of each tray
 */
const InstancedSoil: React.FC<{ racks: RackConfig[] }> = ({ racks }) => {
    const ref = useRef<THREE.InstancedMesh>(null);
    const levelsPerRack = 5;
    const traysPerLevel = 3;
    const soilPerRack = levelsPerRack * traysPerLevel;

    useEffect(() => {
        if (!ref.current) return;

        const tempMatrix = new THREE.Matrix4();
        const quaternion = new THREE.Quaternion();
        let soilIndex = 0;

        racks.forEach((rack) => {
            const [x, y, z] = rack.position;

            for (let level = 0; level < levelsPerRack; level++) {
                const soilY = y + 1.0 + level * 2; // Slightly above tray

                for (let t = 0; t < traysPerLevel; t++) {
                    const soilZ = z - 8 + t * 8;

                    tempMatrix.compose(
                        new THREE.Vector3(x, soilY, soilZ),
                        quaternion,
                        new THREE.Vector3(1, 1, 1)
                    );
                    ref.current!.setMatrixAt(soilIndex++, tempMatrix);
                }
            }
        });

        ref.current.instanceMatrix.needsUpdate = true;
    }, [racks]);

    return (
        <instancedMesh
            ref={ref}
            args={[soilGeometry, soilMaterial, racks.length * soilPerRack]}
            receiveShadow
            frustumCulled={true}
        />
    );
};

/**
 * Renders all LED lighting strips using a single instanced mesh
 * 15 LED strips per rack (5 levels x 3 trays), positioned directly above each tray
 * Mimics real vertical farm design with grow lights on underside of shelf above
 */
const InstancedLEDStrips: React.FC<{ racks: RackConfig[] }> = ({ racks }) => {
    const ref = useRef<THREE.InstancedMesh>(null);
    const levelsPerRack = 5;
    const traysPerLevel = 3;
    const ledsPerRack = levelsPerRack * traysPerLevel; // 15 LEDs per rack

    useEffect(() => {
        if (!ref.current) return;

        const tempMatrix = new THREE.Matrix4();
        const scale = new THREE.Vector3(1, 1, 1);
        const quaternion = new THREE.Quaternion();
        let ledIndex = 0;

        racks.forEach((rack) => {
            const [x, y, z] = rack.position;

            // Create LED for each tray (5 levels x 3 trays)
            for (let level = 0; level < levelsPerRack; level++) {
                const ledY = y + 1.38 + (level * 2); // 0.3m above grass surface

                // 3 LEDs per level, one centered above each tray
                for (let t = 0; t < traysPerLevel; t++) {
                    const ledZ = z - 8 + t * 8; // Match tray z-positions

                    tempMatrix.compose(
                        new THREE.Vector3(x, ledY, ledZ), // Centered above each tray
                        quaternion,
                        scale
                    );
                    ref.current!.setMatrixAt(ledIndex++, tempMatrix);
                }
            }
        });

        ref.current.instanceMatrix.needsUpdate = true;
    }, [racks]);

    return (
        <instancedMesh
            ref={ref}
            args={[ledStripGeometry, ledMaterial, racks.length * ledsPerRack]}
            frustumCulled={true}
        />
    );
};

/**
 * FarmGrass - Renders dense grass blades on each growing tray
 * Uses instanced mesh with custom shader for wind animation
 * ~5000 blades per tray = 75,000 blades per rack (5 levels x 3 trays x 5000)
 */
const FarmGrass: React.FC<{ racks: RackConfig[] }> = ({ racks }) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const levelsPerRack = 5;
    const traysPerLevel = 3;
    const bladesPerTray = 5000; // Dense grass coverage
    const totalTrays = racks.length * levelsPerRack * traysPerLevel;
    const totalBlades = totalTrays * bladesPerTray;

    // Create grass geometry once
    const grassGeometry = useMemo(() => createFarmGrassGeometry(), []);

    // Create grass shader material
    const grassMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            vertexShader: grassVertexShader,
            fragmentShader: grassFragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uBaseColor: { value: new THREE.Color('#166534') }, // Darker green - mature grass
                uTipColor: { value: new THREE.Color('#22c55e') }, // Lighter green - growing tips
            },
            side: THREE.DoubleSide,
        });
    }, []);

    // Generate grass blade positions for all trays
    const grassPositions = useMemo(() => {
        const positions: { x: number; y: number; z: number; rotation: number; scale: number }[] = [];
        const trayWidth = 17.5;
        const trayDepth = 3.6;

        // Seeded random for consistency
        let seed = 12345;
        const random = () => {
            seed = (seed * 1103515245 + 12345) & 0x7fffffff;
            return seed / 0x7fffffff;
        };

        racks.forEach((rack) => {
            const [rx, ry, rz] = rack.position;

            for (let level = 0; level < levelsPerRack; level++) {
                const baseY = ry + 1.08 + level * 2; // Just above soil

                for (let t = 0; t < traysPerLevel; t++) {
                    const trayZ = rz - 8 + t * 8;

                    // Generate grass blades for this tray
                    for (let b = 0; b < bladesPerTray; b++) {
                        positions.push({
                            x: rx + (random() - 0.5) * trayWidth,
                            y: baseY,
                            z: trayZ + (random() - 0.5) * trayDepth,
                            rotation: random() * Math.PI * 2,
                            scale: 0.8 + random() * 0.4, // 80%-120% height variation
                        });
                    }
                }
            }
        });

        console.log(`[FarmGrass] Generated ${positions.length.toLocaleString()} grass blades across ${totalTrays} trays`);
        return positions;
    }, [racks, totalTrays]);

    // Apply transforms to instances
    useEffect(() => {
        if (!meshRef.current) return;

        const tempObject = new THREE.Object3D();

        grassPositions.forEach((blade, i) => {
            tempObject.position.set(blade.x, blade.y, blade.z);
            tempObject.rotation.set(0, blade.rotation, 0);
            tempObject.scale.set(1, blade.scale, 1);
            tempObject.updateMatrix();
            meshRef.current!.setMatrixAt(i, tempObject.matrix);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
    }, [grassPositions]);

    // Animate wind
    useFrame((state) => {
        if (grassMaterial.uniforms) {
            grassMaterial.uniforms.uTime.value = state.clock.elapsedTime;
        }
    });

    return (
        <instancedMesh
            ref={meshRef}
            args={[grassGeometry, grassMaterial, totalBlades]}
            frustumCulled={true}
        />
    );
};

export default InstancedFarmRacks;
