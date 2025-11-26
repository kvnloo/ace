/**
 * Shared Tennis Court Components and Constants
 *
 * Contains common geometry, materials, and helper functions used by
 * both InstancedTennisCourts and InstancedTennisCourtsFull components.
 * Uses proper tennis court dimensions: 23.77m × 10.97m (doubles)
 */

import * as THREE from 'three';

// Tennis court dimensions (official doubles court)
export const COURT_WIDTH = 10.97;   // meters (doubles width)
export const COURT_LENGTH = 23.77;  // meters
export const LINE_WIDTH = 0.05;     // 5cm - standard tennis line width

// Court colors by type (for basic renderer)
export const COURT_COLORS = {
  grass: '#4d7c0f',
  hard: '#3b82f6',
  clay: '#ea580c',
  wood: '#d4a373'
} as const;

export type CourtType = keyof typeof COURT_COLORS;

// Court line specifications (distances from center)
export const TENNIS_LINES = {
  // Baselines (full width at each end)
  baselines: [
    { z: -11.885, width: COURT_WIDTH, isHorizontal: true },
    { z: 11.885, width: COURT_WIDTH, isHorizontal: true }
  ],
  // Doubles sidelines (full length at edges)
  doublesLines: [
    { x: -5.485, length: COURT_LENGTH, isHorizontal: false },
    { x: 5.485, length: COURT_LENGTH, isHorizontal: false }
  ],
  // Singles sidelines (full length, inner)
  singlesLines: [
    { x: -4.115, length: COURT_LENGTH, isHorizontal: false },
    { x: 4.115, length: COURT_LENGTH, isHorizontal: false }
  ],
  // Service lines (singles width at 6.4m from net)
  serviceLines: [
    { z: -6.4, width: 8.23, isHorizontal: true },
    { z: 6.4, width: 8.23, isHorizontal: true }
  ],
  // Center service line (from net to service line)
  centerServiceLine: { x: 0, startZ: -6.4, endZ: 6.4, isHorizontal: false },
  // Center marks (10cm at baselines)
  centerMarks: [
    { x: 0, z: -11.885, length: 0.1, isHorizontal: false },
    { x: 0, z: 11.885, length: 0.1, isHorizontal: false }
  ]
};

// Shared geometry - created once, reused for all instances
export const courtGeometry = new THREE.PlaneGeometry(COURT_WIDTH, COURT_LENGTH);
export const netPoleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
export const netMeshGeometry = new THREE.BoxGeometry(COURT_WIDTH, 1.8, 0.02);

// Shared materials
export const lineMaterial = new THREE.MeshBasicMaterial({
  color: 'white',
  side: THREE.DoubleSide
});
export const netPoleMaterial = new THREE.MeshStandardMaterial({ color: '#333' });
export const netMeshMaterial = new THREE.MeshBasicMaterial({
  color: 'white',
  transparent: true,
  opacity: 0.3,
  wireframe: true
});

/**
 * Creates court line geometries for a single court
 */
export const createCourtLines = (): THREE.BufferGeometry[] => {
  const geometries: THREE.BufferGeometry[] = [];

  // Helper to create horizontal line geometry
  const createHorizontalLine = (z: number, width: number) => {
    const geo = new THREE.PlaneGeometry(width, LINE_WIDTH);
    geo.translate(0, z, 0);
    return geo;
  };

  // Helper to create vertical line geometry
  const createVerticalLine = (x: number, length: number, startZ: number = -length / 2) => {
    const geo = new THREE.PlaneGeometry(LINE_WIDTH, length);
    geo.translate(x, startZ + length / 2, 0);
    return geo;
  };

  // Baselines
  TENNIS_LINES.baselines.forEach(line => {
    geometries.push(createHorizontalLine(line.z, line.width));
  });

  // Doubles sidelines
  TENNIS_LINES.doublesLines.forEach(line => {
    geometries.push(createVerticalLine(line.x, line.length));
  });

  // Singles sidelines
  TENNIS_LINES.singlesLines.forEach(line => {
    geometries.push(createVerticalLine(line.x, line.length));
  });

  // Service lines
  TENNIS_LINES.serviceLines.forEach(line => {
    geometries.push(createHorizontalLine(line.z, line.width));
  });

  // Center service line
  const centerLine = TENNIS_LINES.centerServiceLine;
  const centerGeo = new THREE.PlaneGeometry(LINE_WIDTH, centerLine.endZ - centerLine.startZ);
  centerGeo.translate(centerLine.x, 0, 0);
  geometries.push(centerGeo);

  // Center marks at baselines
  TENNIS_LINES.centerMarks.forEach(mark => {
    const markGeo = new THREE.PlaneGeometry(LINE_WIDTH, mark.length);
    // Position extending inward from baseline
    const direction = mark.z > 0 ? -1 : 1;
    markGeo.translate(mark.x, mark.z + direction * (mark.length / 2), 0);
    geometries.push(markGeo);
  });

  return geometries;
};

// Common court configuration interface
export interface CourtConfig {
  position: [number, number, number];
  type: CourtType;
}
