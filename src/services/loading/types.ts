/**
 * Asset Loading Types
 *
 * Type definitions for the progressive asset loading system.
 */

/**
 * Loading phases in order of priority
 */
export enum LoadingPhase {
  ESSENTIAL = 'essential',
  CORE = 'core',
  VISUAL = 'visual',
  ENHANCED = 'enhanced'
}

/**
 * Asset categories for loading
 */
export enum AssetCategory {
  SCENE = 'scene',
  CAMERA = 'camera',
  LIGHTING = 'lighting',
  GEOMETRY = 'geometry',
  MATERIALS = 'materials',
  EFFECTS = 'effects',
  WEATHER = 'weather',
  POSTPROCESSING = 'postprocessing'
}

/**
 * Loading state
 */
export enum LoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  ERROR = 'error'
}

/**
 * Asset load status
 */
export enum AssetLoadStatus {
  PENDING = 'pending',
  LOADING = 'loading',
  LOADED = 'loaded',
  FAILED = 'failed',
  SKIPPED = 'skipped'
}

/**
 * Progress information for a single asset
 */
export interface AssetProgress {
  id: string;
  category: AssetCategory;
  status: AssetLoadStatus;
  retries: number;
  error?: Error;
  loadTime?: number;
}

/**
 * Progress information for a loading phase
 */
export interface PhaseProgress {
  phase: LoadingPhase;
  totalAssets: number;
  loadedAssets: number;
  failedAssets: number;
  skippedAssets: number;
  startTime?: number;
  endTime?: number;
  targetFPS: number;
  currentFPS?: number;
}

/**
 * Overall loading progress
 */
export interface LoadingProgress {
  state: LoadingState;
  currentPhase?: LoadingPhase;
  phases: Map<LoadingPhase, PhaseProgress>;
  assets: Map<string, AssetProgress>;
  totalProgress: number; // 0-100
  elapsedTime: number;
  estimatedTimeRemaining?: number;
}

/**
 * Result of loading a phase
 */
export interface PhaseResult {
  phase: LoadingPhase;
  success: boolean;
  loadedAssets: string[];
  failedAssets: string[];
  skippedAssets: string[];
  averageFPS: number;
  duration: number;
}

/**
 * Result of complete loading process
 */
export interface LoadingResult {
  success: boolean;
  completedPhases: LoadingPhase[];
  failedPhases: LoadingPhase[];
  totalAssets: number;
  loadedAssets: number;
  failedAssets: number;
  skippedAssets: number;
  totalDuration: number;
  finalFPS: number;
}

/**
 * Loading options
 */
export interface LoadingOptions {
  // Maximum retries per asset
  maxRetries?: number;

  // Minimum FPS thresholds per phase
  fpsThresholds?: Map<LoadingPhase, number>;

  // Enable automatic degradation
  autoDegradation?: boolean;

  // Skip to minimal mode on low performance
  minimalModeThreshold?: number;

  // Timeout per asset (ms)
  assetTimeout?: number;

  // Timeout per phase (ms)
  phaseTimeout?: number;

  // Cancel on error
  cancelOnError?: boolean;

  // Progress callback
  onProgress?: (progress: LoadingProgress) => void;

  // Phase complete callback
  onPhaseComplete?: (result: PhaseResult) => void;
}

/**
 * Asset loading task
 */
export interface LoadingTask {
  assetId: string;
  category: AssetCategory;
  phase: LoadingPhase;
  priority: number;
  dependencies: string[];
  loadFn: () => Promise<void>;
}
