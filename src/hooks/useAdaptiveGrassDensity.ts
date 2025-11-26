/**
 * Adaptive Grass Density Hook
 *
 * Dynamically adjusts grass blade count based on real-time FPS performance.
 * Uses real-world grass density as a reference point and scales based on GPU capability.
 *
 * Real-world reference:
 * - Actual grass: ~2,500 blades/sq ft (source: Oklahoma Museum of Natural History)
 * - Tennis court: 78ft x 36ft = 2,808 sq ft
 * - Realistic total: ~7,000,000 blades per court (not feasible for real-time)
 *
 * Our approach:
 * - Start with a baseline density
 * - Measure FPS over calibration period
 * - Exponentially increase density while FPS stays above target
 * - Use logarithmic scaling to approximate visual density
 */

import { useState, useEffect, useRef, useCallback } from 'react';

interface AdaptiveGrassDensityConfig {
  /** Target FPS to maintain (default: 60) */
  targetFPS?: number;
  /** Minimum acceptable FPS before reducing density */
  minFPS?: number;
  /** Starting blade count per court */
  initialDensity?: number;
  /** Maximum blade count per court (GPU limit) */
  maxDensity?: number;
  /** Calibration duration in ms */
  calibrationDuration?: number;
  /** Court dimensions [width, depth] in units */
  courtSize?: [number, number];
}

interface DensityState {
  bladeCount: number;
  isCalibrating: boolean;
  currentFPS: number;
  densityMultiplier: number;
  realisticPercentage: number; // How close to real grass density
}

// Real-world grass constants
const REAL_BLADES_PER_SQ_FT = 2500;
const TENNIS_COURT_SQ_FT = 2808; // 78ft x 36ft
const REAL_BLADES_PER_COURT = REAL_BLADES_PER_SQ_FT * TENNIS_COURT_SQ_FT; // ~7 million

/**
 * Calculate optimal grass density based on FPS performance
 */
export function useAdaptiveGrassDensity(config: AdaptiveGrassDensityConfig = {}): DensityState & {
  reportFPS: (fps: number) => void;
  recalibrate: () => void;
} {
  const {
    targetFPS = 60,
    minFPS = 45,
    initialDensity = 5000,
    maxDensity = 100000, // 100k blades max per court
    calibrationDuration = 3000,
    courtSize = [10, 22],
  } = config;

  const [state, setState] = useState<DensityState>({
    bladeCount: initialDensity,
    isCalibrating: true,
    currentFPS: 60,
    densityMultiplier: 1,
    realisticPercentage: (initialDensity / REAL_BLADES_PER_COURT) * 100,
  });

  const fpsHistory = useRef<number[]>([]);
  const calibrationPhase = useRef<'measuring' | 'increasing' | 'stable'>('measuring');
  const calibrationStart = useRef<number>(Date.now());
  const lastDensityChange = useRef<number>(Date.now());

  /**
   * Calculate average FPS from recent samples
   */
  const getAverageFPS = useCallback(() => {
    if (fpsHistory.current.length === 0) return 60;
    const recent = fpsHistory.current.slice(-30); // Last 30 samples (~0.5 sec at 60fps)
    return recent.reduce((a, b) => a + b, 0) / recent.length;
  }, []);

  /**
   * Report current FPS - called every frame
   */
  const reportFPS = useCallback((fps: number) => {
    fpsHistory.current.push(fps);

    // Keep only last 120 samples (2 seconds at 60fps)
    if (fpsHistory.current.length > 120) {
      fpsHistory.current.shift();
    }

    const avgFPS = getAverageFPS();
    const now = Date.now();
    const timeSinceStart = now - calibrationStart.current;
    const timeSinceChange = now - lastDensityChange.current;

    setState(prev => {
      // Update current FPS display
      const newState = { ...prev, currentFPS: Math.round(avgFPS) };

      // Still in initial calibration period
      if (timeSinceStart < calibrationDuration) {
        return { ...newState, isCalibrating: true };
      }

      // Need at least 500ms between density changes for stability
      if (timeSinceChange < 500) {
        return newState;
      }

      // Adaptive density algorithm
      if (avgFPS >= targetFPS && prev.bladeCount < maxDensity) {
        // FPS is good, try increasing density
        // Use exponential growth: multiply by 1.5 each step
        const headroom = avgFPS - targetFPS;
        const growthFactor = headroom > 30 ? 1.8 : headroom > 15 ? 1.5 : 1.2;
        const newDensity = Math.min(
          Math.round(prev.bladeCount * growthFactor),
          maxDensity
        );

        if (newDensity !== prev.bladeCount) {
          lastDensityChange.current = now;
          console.log(`[GrassDensity] FPS: ${avgFPS.toFixed(1)} - Increasing density: ${prev.bladeCount} → ${newDensity}`);

          return {
            ...newState,
            bladeCount: newDensity,
            densityMultiplier: newDensity / initialDensity,
            realisticPercentage: (newDensity / REAL_BLADES_PER_COURT) * 100,
            isCalibrating: true,
          };
        }
      } else if (avgFPS < minFPS && prev.bladeCount > initialDensity) {
        // FPS dropped too low, reduce density
        const reductionFactor = avgFPS < 30 ? 0.5 : 0.7;
        const newDensity = Math.max(
          Math.round(prev.bladeCount * reductionFactor),
          initialDensity
        );

        if (newDensity !== prev.bladeCount) {
          lastDensityChange.current = now;
          console.log(`[GrassDensity] FPS: ${avgFPS.toFixed(1)} - Reducing density: ${prev.bladeCount} → ${newDensity}`);

          return {
            ...newState,
            bladeCount: newDensity,
            densityMultiplier: newDensity / initialDensity,
            realisticPercentage: (newDensity / REAL_BLADES_PER_COURT) * 100,
            isCalibrating: true,
          };
        }
      }

      // Stable - no change needed
      return { ...newState, isCalibrating: false };
    });
  }, [targetFPS, minFPS, initialDensity, maxDensity, calibrationDuration, getAverageFPS]);

  /**
   * Force recalibration
   */
  const recalibrate = useCallback(() => {
    calibrationStart.current = Date.now();
    fpsHistory.current = [];
    setState(prev => ({
      ...prev,
      bladeCount: initialDensity,
      isCalibrating: true,
      densityMultiplier: 1,
      realisticPercentage: (initialDensity / REAL_BLADES_PER_COURT) * 100,
    }));
  }, [initialDensity]);

  return {
    ...state,
    reportFPS,
    recalibrate,
  };
}

/**
 * Calculate visually-optimal grass density for a given area
 * Uses perceptual density curve - humans can't distinguish individual blades past ~50k/court
 */
export function calculateOptimalDensity(
  areaWidth: number,
  areaDepth: number,
  performanceMode: 'low' | 'medium' | 'high' | 'ultra' = 'high'
): number {
  const area = areaWidth * areaDepth;

  // Base density per unit area
  const baseDensityPerUnit = {
    low: 100,      // ~22,000 per court
    medium: 200,   // ~44,000 per court
    high: 400,     // ~88,000 per court
    ultra: 800,    // ~176,000 per court
  }[performanceMode];

  return Math.round(area * baseDensityPerUnit);
}

/**
 * Get grass density statistics
 */
export function getGrassDensityStats(bladeCount: number, courtSize: [number, number]) {
  const [width, depth] = courtSize;
  const area = width * depth;

  return {
    totalBlades: bladeCount,
    bladesPerUnit: Math.round(bladeCount / area),
    realisticPercentage: ((bladeCount / REAL_BLADES_PER_COURT) * 100).toFixed(3),
    visualDensityLevel:
      bladeCount < 10000 ? 'sparse' :
      bladeCount < 30000 ? 'light' :
      bladeCount < 60000 ? 'medium' :
      bladeCount < 100000 ? 'dense' : 'very dense',
  };
}

export default useAdaptiveGrassDensity;
