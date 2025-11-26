/**
 * InstancedTennisCourtsFull Component
 *
 * High-performance tennis courts with surface-specific visual effects.
 * Combines InstancedMesh batching with optimized grass/texture rendering.
 * Uses proper tennis court dimensions: 23.77m × 10.97m (doubles)
 * Target: 540fps with visual enhancement
 */

import React, { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import GrassAdaptive from './GrassAdaptive';
import { getCourtTexture, type CourtSurfaceType } from '../utils/courtTextures';
import {
  COURT_WIDTH,
  COURT_LENGTH,
  courtGeometry,
  netPoleGeometry,
  netMeshGeometry,
  lineMaterial,
  netPoleMaterial,
  netMeshMaterial,
  createCourtLines
} from './tennis/shared';

interface CourtConfig {
  position: [number, number, number];
  type: CourtSurfaceType;
}

interface InstancedTennisCourtsFullProps {
  courts: CourtConfig[];
  /** Enable visual effects like grass blades (default: true) */
  enableEffects?: boolean;
}

/**
 * Main component - renders all courts with visual effects
 */
const InstancedTennisCourtsFull: React.FC<InstancedTennisCourtsFullProps> = ({
  courts,
  enableEffects = true
}) => {
  // Group courts by surface type for batching
  const courtsByType = useMemo(() => {
    const grouped: Record<CourtSurfaceType, CourtConfig[]> = {
      grass: [],
      hard: [],
      clay: [],
      wood: []
    };
    courts.forEach(court => {
      grouped[court.type].push(court);
    });
    return grouped;
  }, [courts]);

  // Pre-compute materials with textures for each court type
  const courtMaterials = useMemo(() => {
    const materials: Record<CourtSurfaceType, THREE.MeshStandardMaterial> = {} as any;

    (['grass', 'hard', 'clay', 'wood'] as CourtSurfaceType[]).forEach(type => {
      const textureConfig = getCourtTexture(type);
      const material = new THREE.MeshStandardMaterial({
        color: textureConfig.color,
        map: textureConfig.map,
        normalMap: textureConfig.normalMap,
        roughness: textureConfig.roughness,
        metalness: textureConfig.metalness || 0
      });
      material.needsUpdate = true;
      materials[type] = material;
    });

    return materials;
  }, []);

  return (
    <group>
      {/* Render instanced meshes for each court type */}
      {(['grass', 'hard', 'clay', 'wood'] as CourtSurfaceType[]).map(type => {
        const typeCourts = courtsByType[type];
        if (typeCourts.length === 0) return null;

        return (
          <InstancedCourtType
            key={type}
            type={type}
            courts={typeCourts}
            material={courtMaterials[type]}
            enableEffects={enableEffects}
          />
        );
      })}

      {/* Single instanced mesh for ALL net poles */}
      <InstancedNetPoles courts={courts} />

      {/* Single instanced mesh for ALL nets */}
      <InstancedNets courts={courts} />
    </group>
  );
};

/**
 * Renders all courts of a single type with surface-specific effects
 */
const InstancedCourtType: React.FC<{
  type: CourtSurfaceType;
  courts: CourtConfig[];
  material: THREE.MeshStandardMaterial;
  enableEffects: boolean;
}> = ({ type, courts, material, enableEffects }) => {
  const courtRef = useRef<THREE.InstancedMesh>(null);

  // Pre-create court line geometries
  const lineGeometries = useMemo(() => createCourtLines(), []);

  useEffect(() => {
    if (!courtRef.current) return;

    const tempMatrix = new THREE.Matrix4();
    const rotation = new THREE.Euler(-Math.PI / 2, 0, 0);
    const quaternion = new THREE.Quaternion().setFromEuler(rotation);

    courts.forEach((court, i) => {
      const [x, y, z] = court.position;

      // Main court surface
      tempMatrix.compose(
        new THREE.Vector3(x, y, z),
        quaternion,
        new THREE.Vector3(1, 1, 1)
      );
      courtRef.current!.setMatrixAt(i, tempMatrix);
    });

    courtRef.current.instanceMatrix.needsUpdate = true;
  }, [courts]);

  const count = courts.length;

  return (
    <group>
      {/* Main court surface with texture */}
      <instancedMesh
        ref={courtRef}
        args={[courtGeometry, material, count]}
        receiveShadow
        frustumCulled
      />

      {/* Court lines for each court - clay courts need lines above the overlay */}
      {courts.map((court, courtIndex) => {
        const [x, y, z] = court.position;
        // Clay overlay is at y+0.02, so clay lines must be at y+0.03 to be visible
        const lineYOffset = type === 'clay' ? 0.03 : 0.01;
        return (
          <group
            key={`lines-${courtIndex}`}
            position={[x, y + lineYOffset, z]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            {lineGeometries.map((geometry, lineIndex) => (
              <mesh
                key={`line-${courtIndex}-${lineIndex}`}
                geometry={geometry}
                material={lineMaterial}
              />
            ))}
          </group>
        );
      })}

      {/* Surface-specific visual effects */}
      {enableEffects && type === 'grass' && (
        <GrassEffects courts={courts} />
      )}

      {enableEffects && type === 'clay' && (
        <ClayEffects courts={courts} />
      )}
    </group>
  );
};

// Constants
const REAL_BLADES_PER_COURT = 7_000_000;

interface GrassDensityState {
  courtIndex: number;
  density: number;
  fps: number;
}

/**
 * Grass surface effects - FPS-adaptive grass blade rendering
 *
 * Real-world reference:
 * - Tennis court: 78ft x 36ft = 2,808 sq ft
 * - Real grass: ~2,500 blades/sq ft = ~7 million blades per court
 * - Our adaptive system: 50k-500k blades (0.7%-7% of real density)
 *
 * The adaptive algorithm starts at 50k blades and exponentially
 * increases density while FPS remains above target (60fps).
 */
const GrassEffects: React.FC<{ courts: CourtConfig[] }> = ({ courts }) => {
  const [densities, setDensities] = useState<GrassDensityState[]>([]);
  const [phase, setPhase] = useState<'init' | 'burst' | 'monitor'>('init');

  const handleDensityChange = useCallback((courtIndex: number, density: number, fps: number, newPhase: 'init' | 'burst' | 'monitor') => {
    setDensities(prev => {
      const existing = prev.findIndex(d => d.courtIndex === courtIndex);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { courtIndex, density, fps };
        return updated;
      }
      return [...prev, { courtIndex, density, fps }];
    });
    setPhase(newPhase);
  }, []);

  const totalBlades = densities.reduce((sum, d) => sum + d.density, 0);
  const avgFPS = densities.length > 0 ? densities.reduce((sum, d) => sum + d.fps, 0) / densities.length : 0;
  const percentReal = densities.length > 0 ? (totalBlades / (REAL_BLADES_PER_COURT * densities.length)) * 100 : 0;

  const phaseColors: Record<string, string> = {
    init: '#fbbf24',
    burst: '#22c55e',
    monitor: '#3b82f6',
  };

  return (
    <>
      {courts.map((court, i) => {
        const [x, y, z] = court.position;
        return (
          <GrassAdaptive
            key={`grass-${i}`}
            position={[x, y + 0.02, z]}
            size={[COURT_WIDTH, COURT_LENGTH]}
            color="#4d7c0f"
            animated={true}
            targetFPS={60}
            initialDensity={50000}
            maxDensity={500000}
            onDensityChange={(density, fps, newPhase) => {
              handleDensityChange(i, density, fps, newPhase);
            }}
          />
        );
      })}

      {/* Grass Density Monitor - positioned in 3D space but renders as HTML overlay */}
      <Html
        position={[0, 15, 0]}
        center
        style={{
          position: 'fixed',
          top: '100px',
          right: '20px',
          left: 'auto',
          transform: 'none',
        }}
        calculatePosition={() => [window.innerWidth - 240, 100, 0]}
      >
        <div
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            padding: '16px',
            fontFamily: 'monospace',
            fontSize: '12px',
            color: '#fff',
            minWidth: '200px',
            backdropFilter: 'blur(8px)',
            pointerEvents: 'none',
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px',
            paddingBottom: '8px',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}>
            <span style={{ fontSize: '16px' }}>🌿</span>
            <span style={{ fontWeight: 'bold', fontSize: '14px' }}>GRASS DENSITY</span>
            <span
              style={{
                marginLeft: 'auto',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: 'bold',
                backgroundColor: phaseColors[phase],
                color: phase === 'init' ? '#000' : '#fff',
                textTransform: 'uppercase',
              }}
            >
              {phase}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#9ca3af' }}>Total Blades:</span>
              <span style={{ color: '#22c55e', fontWeight: 'bold' }}>
                {totalBlades.toLocaleString()}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#9ca3af' }}>Per Court:</span>
              <span style={{ color: '#fbbf24' }}>
                {densities.length > 0
                  ? Math.round(totalBlades / densities.length).toLocaleString()
                  : '50,000'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#9ca3af' }}>% of Real:</span>
              <span style={{ color: '#60a5fa' }}>
                {percentReal.toFixed(3)}%
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#9ca3af' }}>Avg FPS:</span>
              <span style={{ color: avgFPS > 60 ? '#22c55e' : avgFPS > 30 ? '#fbbf24' : '#ef4444' }}>
                {avgFPS > 0 ? avgFPS.toFixed(0) : '--'}
              </span>
            </div>

            <div style={{
              marginTop: '8px',
              paddingTop: '8px',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              fontSize: '10px',
              color: '#6b7280'
            }}>
              Real grass: ~7M blades/court
            </div>
          </div>
        </div>
      </Html>
    </>
  );
};

/**
 * Clay surface effects - authentic Roland Garros terre battue texture
 * Includes rake marks, granular variation, and realistic coloring
 */
const ClayEffects: React.FC<{ courts: CourtConfig[] }> = ({ courts }) => {
  // Generate realistic clay texture - authentic terre battue red-brown
  const clayMaterial = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // Authentic terre battue base color (Roland Garros red-brown)
    ctx.fillStyle = '#b85a3a';
    ctx.fillRect(0, 0, 256, 256);

    // Add horizontal rake marks (maintenance pattern)
    ctx.strokeStyle = 'rgba(160, 70, 45, 0.4)';
    ctx.lineWidth = 1;
    for (let y = 0; y < 256; y += 4) {
      ctx.beginPath();
      ctx.moveTo(0, y + (Math.random() - 0.5) * 0.5);
      ctx.lineTo(256, y + (Math.random() - 0.5) * 0.5);
      ctx.stroke();
    }

    // Add granular texture with more color variation
    for (let i = 0; i < 500; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const size = Math.random() * 2;
      const brightness = Math.random() * 30 - 15;

      // More varied granule colors - from light tan to dark brown
      const r = 184 + brightness + (Math.random() - 0.5) * 20;
      const g = 90 + brightness * 0.6 + (Math.random() - 0.5) * 15;
      const b = 58 + brightness * 0.4 + (Math.random() - 0.5) * 10;

      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.3 + Math.random() * 0.4})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Add subtle wear patterns (darker areas where players move)
    const gradient = ctx.createRadialGradient(128, 200, 0, 128, 200, 80);
    gradient.addColorStop(0, 'rgba(100, 50, 30, 0.15)');
    gradient.addColorStop(1, 'rgba(100, 50, 30, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 6);

    return new THREE.MeshStandardMaterial({
      map: texture,
      color: '#b85a3a',
      roughness: 0.95,
      metalness: 0
    });
  }, []);

  const overlayGeometry = useMemo(() => new THREE.PlaneGeometry(COURT_WIDTH - 0.2, COURT_LENGTH - 0.2), []);

  return (
    <>
      {courts.map((court, i) => {
        const [x, y, z] = court.position;
        return (
          <mesh
            key={`clay-${i}`}
            position={[x, y + 0.02, z]}
            rotation={[-Math.PI / 2, 0, 0]}
            geometry={overlayGeometry}
            material={clayMaterial}
            frustumCulled={true}
          />
        );
      })}
    </>
  );
};

/**
 * Renders all net poles using a single instanced mesh
 */
const InstancedNetPoles: React.FC<{ courts: CourtConfig[] }> = ({ courts }) => {
  const ref = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    if (!ref.current) return;

    const tempMatrix = new THREE.Matrix4();
    const scale = new THREE.Vector3(1, 1, 1);
    const quaternion = new THREE.Quaternion();

    courts.forEach((court, i) => {
      const [x, y, z] = court.position;

      // Left pole (at doubles sideline)
      tempMatrix.compose(
        new THREE.Vector3(x - COURT_WIDTH / 2, y + 1, z),
        quaternion,
        scale
      );
      ref.current!.setMatrixAt(i * 2, tempMatrix);

      // Right pole (at doubles sideline)
      tempMatrix.compose(
        new THREE.Vector3(x + COURT_WIDTH / 2, y + 1, z),
        quaternion,
        scale
      );
      ref.current!.setMatrixAt(i * 2 + 1, tempMatrix);
    });

    ref.current.instanceMatrix.needsUpdate = true;
  }, [courts]);

  return (
    <instancedMesh
      ref={ref}
      args={[netPoleGeometry, netPoleMaterial, courts.length * 2]}
      frustumCulled
    />
  );
};

/**
 * Renders all nets using a single instanced mesh
 */
const InstancedNets: React.FC<{ courts: CourtConfig[] }> = ({ courts }) => {
  const ref = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    if (!ref.current) return;

    const tempMatrix = new THREE.Matrix4();
    const scale = new THREE.Vector3(1, 1, 1);
    const quaternion = new THREE.Quaternion();

    courts.forEach((court, i) => {
      const [x, y, z] = court.position;

      // Net height is 1.8m, position center at y + 0.9 so bottom sits on court surface
      tempMatrix.compose(
        new THREE.Vector3(x, y + 0.9, z),
        quaternion,
        scale
      );
      ref.current!.setMatrixAt(i, tempMatrix);
    });

    ref.current.instanceMatrix.needsUpdate = true;
  }, [courts]);

  return (
    <instancedMesh
      ref={ref}
      args={[netMeshGeometry, netMeshMaterial, courts.length]}
      frustumCulled
    />
  );
};

export default InstancedTennisCourtsFull;
