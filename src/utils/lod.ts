import * as THREE from 'three';

/**
 * Simple LOD configuration for performance optimization
 */
export interface LODConfig {
  /** Distance thresholds for detail levels */
  distances: [number, number, number]; // [high, medium, low]
  /** Current camera distance */
  cameraDistance: number;
}

/**
 * Get LOD level based on camera distance
 * @returns 0 = high detail, 1 = medium, 2 = low
 */
export const getLODLevel = (distance: number, config: LODConfig = {
  distances: [50, 150, 300],
  cameraDistance: distance
}): number => {
  if (distance < config.distances[0]) return 0; // High detail
  if (distance < config.distances[1]) return 1; // Medium detail
  return 2; // Low detail
};

/**
 * Get grass blade count based on LOD level
 */
export const getGrassBladeCount = (lodLevel: number): number => {
  const counts = [500, 200, 50]; // High, medium, low
  return counts[lodLevel] || counts[2];
};

/**
 * Get particle count based on LOD level
 */
export const getParticleCount = (lodLevel: number): number => {
  const counts = [100, 30, 0]; // High, medium, low (0 = disabled)
  return counts[lodLevel] || counts[2];
};

/**
 * Should render effects at this LOD level?
 */
export const shouldRenderEffects = (lodLevel: number): boolean => {
  return lodLevel < 2; // Only at high and medium detail
};
