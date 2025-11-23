/**
 * TennisCourt Component
 *
 * Reusable tennis court component with configurable surface type.
 * Used by AssetLoader for dynamic court instantiation.
 *
 * Features:
 * - Multiple surface types (hard, clay, grass, wood)
 * - Regulation dimensions (23.77m x 10.97m)
 * - Court line markings
 * - Net with physics-ready mesh
 * - PBR materials with texture support
 */

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { getCourtTexture, type CourtSurfaceType } from '../utils/courtTextures';

/**
 * Tennis court regulation dimensions (ITF standards)
 */
const COURT_DIMENSIONS = {
  width: 23.77, // meters (78 feet)
  length: 10.97, // meters (36 feet)
  netHeight: 0.914, // meters at center (3 feet)
  netHeightPost: 1.07, // meters at posts (3.5 feet)
  lineWidth: 0.05 // meters (2 inches)
};

export interface TennisCourtProps {
  /** Position of court center in 3D space */
  position?: [number, number, number];

  /** Court surface material type */
  courtType?: CourtSurfaceType;

  /** Show regulation line markings */
  showLines?: boolean;

  /** Show tennis net */
  showNet?: boolean;

  /** Court identifier for multi-court scenes */
  courtId?: string;

  /** Enable shadows on court surface */
  receiveShadows?: boolean;
}

/**
 * TennisCourt Component
 *
 * Renders a regulation tennis court with configurable surface and features.
 */
export default function TennisCourt({
  position = [0, 0, 0],
  courtType = 'hard',
  showLines = true,
  showNet = true,
  courtId = 'court-1',
  receiveShadows = true
}: TennisCourtProps) {

  // Get surface texture/material
  const surfaceMaterial = useMemo(() => {
    const texture = getCourtTexture(courtType);

    return new THREE.MeshStandardMaterial({
      map: texture,
      roughness: courtType === 'clay' ? 0.9 : 0.6,
      metalness: 0.0,
      color: courtType === 'clay' ? '#D2691E' : '#2C5F2D',
    });
  }, [courtType]);

  // Court line material (white)
  const lineMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95
    }),
    []
  );

  // Net material
  const netMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: 0x333333,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
      wireframe: false
    }),
    []
  );

  // Court surface mesh
  const courtSurface = useMemo(() => (
    <mesh
      position={[position[0], position[1], position[2]]}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow={receiveShadows}
    >
      <planeGeometry args={[COURT_DIMENSIONS.width, COURT_DIMENSIONS.length]} />
      <primitive object={surfaceMaterial} attach="material" />
    </mesh>
  ), [position, surfaceMaterial, receiveShadows]);

  // Court lines (baseline, service lines, sidelines, center)
  const courtLines = useMemo(() => {
    if (!showLines) return null;

    const lines = [];
    const y = position[1] + 0.01; // Slightly above surface to prevent z-fighting

    // Baselines (end lines)
    const baselineLength = COURT_DIMENSIONS.length;
    lines.push(
      <mesh
        key="baseline-1"
        position={[
          position[0] - COURT_DIMENSIONS.width / 2,
          y,
          position[2]
        ]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[COURT_DIMENSIONS.lineWidth, baselineLength]} />
        <primitive object={lineMaterial} attach="material" />
      </mesh>
    );

    lines.push(
      <mesh
        key="baseline-2"
        position={[
          position[0] + COURT_DIMENSIONS.width / 2,
          y,
          position[2]
        ]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[COURT_DIMENSIONS.lineWidth, baselineLength]} />
        <primitive object={lineMaterial} attach="material" />
      </mesh>
    );

    // Sidelines
    const sidelineLength = COURT_DIMENSIONS.width;
    lines.push(
      <mesh
        key="sideline-1"
        position={[
          position[0],
          y,
          position[2] - baselineLength / 2
        ]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      >
        <planeGeometry args={[COURT_DIMENSIONS.lineWidth, sidelineLength]} />
        <primitive object={lineMaterial} attach="material" />
      </mesh>
    );

    lines.push(
      <mesh
        key="sideline-2"
        position={[
          position[0],
          y,
          position[2] + baselineLength / 2
        ]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      >
        <planeGeometry args={[COURT_DIMENSIONS.lineWidth, sidelineLength]} />
        <primitive object={lineMaterial} attach="material" />
      </mesh>
    );

    // Service lines
    const serviceLineX = COURT_DIMENSIONS.width * 0.25;
    lines.push(
      <mesh
        key="service-line-1"
        position={[
          position[0] - serviceLineX,
          y,
          position[2]
        ]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[COURT_DIMENSIONS.lineWidth, baselineLength]} />
        <primitive object={lineMaterial} attach="material" />
      </mesh>
    );

    lines.push(
      <mesh
        key="service-line-2"
        position={[
          position[0] + serviceLineX,
          y,
          position[2]
        ]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[COURT_DIMENSIONS.lineWidth, baselineLength]} />
        <primitive object={lineMaterial} attach="material" />
      </mesh>
    );

    // Center service line
    lines.push(
      <mesh
        key="center-line"
        position={[position[0], y, position[2]]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      >
        <planeGeometry args={[
          COURT_DIMENSIONS.lineWidth,
          COURT_DIMENSIONS.width / 2
        ]} />
        <primitive object={lineMaterial} attach="material" />
      </mesh>
    );

    return <group name={`${courtId}-lines`}>{lines}</group>;
  }, [showLines, position, lineMaterial, courtId]);

  // Tennis net
  const net = useMemo(() => {
    if (!showNet) return null;

    const netWidth = COURT_DIMENSIONS.length + 1; // Slightly wider than court
    const netHeight = COURT_DIMENSIONS.netHeight;

    return (
      <group name={`${courtId}-net`} position={[position[0], position[1] + netHeight / 2, position[2]]}>
        {/* Net mesh */}
        <mesh castShadow receiveShadow>
          <planeGeometry args={[netWidth, netHeight, 32, 16]} />
          <primitive object={netMaterial} attach="material" />
        </mesh>

        {/* Net posts */}
        <mesh
          position={[0, netHeight / 2, -netWidth / 2]}
          castShadow
        >
          <cylinderGeometry args={[0.05, 0.05, COURT_DIMENSIONS.netHeightPost, 16]} />
          <meshStandardMaterial color="#333333" />
        </mesh>

        <mesh
          position={[0, netHeight / 2, netWidth / 2]}
          castShadow
        >
          <cylinderGeometry args={[0.05, 0.05, COURT_DIMENSIONS.netHeightPost, 16]} />
          <meshStandardMaterial color="#333333" />
        </mesh>

        {/* Net cable at top */}
        <mesh
          position={[0, netHeight, 0]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.01, 0.01, netWidth, 8]} />
          <meshStandardMaterial color="#555555" />
        </mesh>
      </group>
    );
  }, [showNet, position, netMaterial, courtId]);

  return (
    <group name={`tennis-court-${courtId}`}>
      {courtSurface}
      {courtLines}
      {net}
    </group>
  );
}

/**
 * Export component reference for AssetLoader
 */
export { TennisCourt };
