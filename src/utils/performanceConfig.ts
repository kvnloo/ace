/**
 * Performance configuration for 3D scene optimization
 * Target: 540fps
 */

export type PerformanceMode = 'ultra' | 'high' | 'medium' | 'low';

export interface PerformanceConfig {
  shadowMapSize: number;
  shadowsEnabled: boolean;
  grassBladeCount: number;
  particleCount: number;
  maxLights: number;
  antialias: boolean;
  pixelRatio: number;
}

export const getPerformanceConfig = (mode: PerformanceMode): PerformanceConfig => {
  const configs: Record<PerformanceMode, PerformanceConfig> = {
    ultra: {
      shadowMapSize: 2048,
      shadowsEnabled: true,
      grassBladeCount: 500,
      particleCount: 1000,
      maxLights: 10,
      antialias: true,
      pixelRatio: 2,
    },
    high: {
      shadowMapSize: 1024,
      shadowsEnabled: true,
      grassBladeCount: 300,
      particleCount: 500,
      maxLights: 6,
      antialias: true,
      pixelRatio: 1.5,
    },
    medium: {
      shadowMapSize: 512,
      shadowsEnabled: true,
      grassBladeCount: 150,
      particleCount: 200,
      maxLights: 4,
      antialias: false,
      pixelRatio: 1,
    },
    low: {
      shadowMapSize: 256,
      shadowsEnabled: false,
      grassBladeCount: 50,
      particleCount: 50,
      maxLights: 2,
      antialias: false,
      pixelRatio: 0.75,
    },
  };
  return configs[mode];
};

export const detectOptimalMode = (fps: number): PerformanceMode => {
  if (fps >= 500) return 'ultra';
  if (fps >= 300) return 'high';
  if (fps >= 120) return 'medium';
  return 'low';
};
