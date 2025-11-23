/**
 * Loading Phase Definitions
 *
 * Defines the progressive loading phases and their asset requirements.
 */

import { LoadingPhase, AssetCategory } from './types';

/**
 * Phase definition
 */
export interface PhaseDefinition {
  phase: LoadingPhase;
  name: string;
  description: string;
  targetFPS: number;
  estimatedDuration: number; // seconds
  categories: AssetCategory[];
  assets: string[];
}

/**
 * Phase 1: Essential (1-2 seconds)
 * - Scene container
 * - Camera system
 * - Basic ambient lighting
 * - Ground plane
 * Target: 60 FPS baseline
 */
export const ESSENTIAL_PHASE: PhaseDefinition = {
  phase: LoadingPhase.ESSENTIAL,
  name: 'Essential',
  description: 'Core scene setup and camera system',
  targetFPS: 60,
  estimatedDuration: 2,
  categories: [
    AssetCategory.SCENE,
    AssetCategory.CAMERA,
    AssetCategory.LIGHTING,
    AssetCategory.GEOMETRY
  ],
  assets: [
    'scene-container',
    'camera-main',
    'camera-controller',
    'light-ambient',
    'geometry-ground-plane'
  ]
};

/**
 * Phase 2: Core (3-5 seconds)
 * - Tennis courts (all 4)
 * - Court lines and nets
 * - Basic building structures
 * Target: ≥50 FPS
 */
export const CORE_PHASE: PhaseDefinition = {
  phase: LoadingPhase.CORE,
  name: 'Core',
  description: 'Tennis courts and essential structures',
  targetFPS: 50,
  estimatedDuration: 5,
  categories: [
    AssetCategory.GEOMETRY,
    AssetCategory.MATERIALS
  ],
  assets: [
    'geometry-tennis-court-1',
    'geometry-tennis-court-2',
    'geometry-tennis-court-3',
    'geometry-tennis-court-4',
    'geometry-court-lines',
    'geometry-court-nets',
    'geometry-building-main',
    'geometry-building-clubhouse',
    'material-court-surface',
    'material-court-lines',
    'material-net'
  ]
};

/**
 * Phase 3: Visual (5-8 seconds)
 * - Grass system (simplified if FPS < 50)
 * - Additional lighting (directional, spots)
 * - Weather system (basic)
 * Target: ≥45 FPS
 */
export const VISUAL_PHASE: PhaseDefinition = {
  phase: LoadingPhase.VISUAL,
  name: 'Visual',
  description: 'Enhanced visuals and lighting',
  targetFPS: 45,
  estimatedDuration: 8,
  categories: [
    AssetCategory.GEOMETRY,
    AssetCategory.LIGHTING,
    AssetCategory.MATERIALS,
    AssetCategory.WEATHER
  ],
  assets: [
    'geometry-grass-system',
    'light-directional-sun',
    'light-spot-court-1',
    'light-spot-court-2',
    'light-spot-court-3',
    'light-spot-court-4',
    'weather-system-basic',
    'material-grass',
    'material-building'
  ]
};

/**
 * Phase 4: Enhanced (8-12 seconds)
 * - Particle effects
 * - Post-processing
 * - Advanced weather
 * - Dynamic shadows
 * Target: ≥40 FPS
 */
export const ENHANCED_PHASE: PhaseDefinition = {
  phase: LoadingPhase.ENHANCED,
  name: 'Enhanced',
  description: 'Advanced effects and post-processing',
  targetFPS: 40,
  estimatedDuration: 12,
  categories: [
    AssetCategory.EFFECTS,
    AssetCategory.POSTPROCESSING,
    AssetCategory.WEATHER
  ],
  assets: [
    'effects-particles-dust',
    'effects-particles-rain',
    'effects-shadows-dynamic',
    'postprocessing-bloom',
    'postprocessing-ssao',
    'postprocessing-tone-mapping',
    'weather-system-advanced',
    'weather-wind',
    'weather-clouds'
  ]
};

/**
 * All phase definitions in loading order
 */
export const LOADING_PHASES: PhaseDefinition[] = [
  ESSENTIAL_PHASE,
  CORE_PHASE,
  VISUAL_PHASE,
  ENHANCED_PHASE
];

/**
 * Get phase definition by phase enum
 */
export function getPhaseDefinition(phase: LoadingPhase): PhaseDefinition {
  const definition = LOADING_PHASES.find(p => p.phase === phase);
  if (!definition) {
    throw new Error(`Phase definition not found: ${phase}`);
  }
  return definition;
}

/**
 * Get next phase in sequence
 */
export function getNextPhase(currentPhase: LoadingPhase): LoadingPhase | null {
  const currentIndex = LOADING_PHASES.findIndex(p => p.phase === currentPhase);
  if (currentIndex === -1 || currentIndex === LOADING_PHASES.length - 1) {
    return null;
  }
  return LOADING_PHASES[currentIndex + 1].phase;
}

/**
 * Get previous phase in sequence
 */
export function getPreviousPhase(currentPhase: LoadingPhase): LoadingPhase | null {
  const currentIndex = LOADING_PHASES.findIndex(p => p.phase === currentPhase);
  if (currentIndex <= 0) {
    return null;
  }
  return LOADING_PHASES[currentIndex - 1].phase;
}

/**
 * Check if phase is complete based on FPS threshold
 */
export function isPhasePerformanceAcceptable(
  phase: LoadingPhase,
  currentFPS: number
): boolean {
  const definition = getPhaseDefinition(phase);
  return currentFPS >= definition.targetFPS;
}

/**
 * Get total estimated loading time
 */
export function getTotalEstimatedDuration(): number {
  return LOADING_PHASES.reduce((total, phase) => total + phase.estimatedDuration, 0);
}

/**
 * Get phase by asset ID
 */
export function getPhaseForAsset(assetId: string): LoadingPhase | null {
  for (const phase of LOADING_PHASES) {
    if (phase.assets.includes(assetId)) {
      return phase.phase;
    }
  }
  return null;
}
