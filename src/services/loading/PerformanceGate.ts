/**
 * Performance Gate
 *
 * Determines quality modes and asset loading strategies based on measured FPS.
 * Provides recommendations and ensures smooth performance across devices.
 */

export enum QualityMode {
  ULTRA = 'ultra',
  QUALITY = 'quality',
  BALANCED = 'balanced',
  MINIMAL = 'minimal',
  EMERGENCY = 'emergency',
}

export enum LoadingPhase {
  INITIALIZATION = 'initialization',
  COURTS = 'courts',
  LIGHTING = 'lighting',
  ENVIRONMENT = 'environment',
  POST_PROCESSING = 'post_processing',
  COMPLETE = 'complete',
}

export interface PerformanceRecommendation {
  mode: QualityMode;
  reason: string;
  disabledAssets: string[];
  expectedFPS: number;
  canOverride: boolean;
}

export interface FPSThresholds {
  EXCELLENT: number;
  GOOD: number;
  FAIR: number;
  POOR: number;
  CRITICAL: number;
}

export const FPS_THRESHOLDS: FPSThresholds = {
  EXCELLENT: 55,  // All features enabled
  GOOD: 45,       // Most features enabled
  FAIR: 35,       // Balanced mode
  POOR: 25,       // Minimal mode
  CRITICAL: 20,   // Force minimal
};

export interface QualityModeConfig {
  minFPS: number;
  maxFPS: number;
  name: string;
  description: string;
  disabledAssets: string[];
  expectedFPS: number;
  loadingPhases: LoadingPhase[];
}

const QUALITY_MODES: Record<QualityMode, QualityModeConfig> = {
  [QualityMode.ULTRA]: {
    minFPS: FPS_THRESHOLDS.EXCELLENT,
    maxFPS: Infinity,
    name: 'Ultra Quality',
    description: 'All assets loaded with maximum quality',
    disabledAssets: [],
    expectedFPS: 60,
    loadingPhases: [
      LoadingPhase.INITIALIZATION,
      LoadingPhase.COURTS,
      LoadingPhase.LIGHTING,
      LoadingPhase.ENVIRONMENT,
      LoadingPhase.POST_PROCESSING,
      LoadingPhase.COMPLETE,
    ],
  },
  [QualityMode.QUALITY]: {
    minFPS: FPS_THRESHOLDS.GOOD,
    maxFPS: FPS_THRESHOLDS.EXCELLENT - 1,
    name: 'Quality',
    description: 'Most features enabled, some post-processing effects reduced',
    disabledAssets: ['heavy-post-processing', 'advanced-reflections'],
    expectedFPS: 55,
    loadingPhases: [
      LoadingPhase.INITIALIZATION,
      LoadingPhase.COURTS,
      LoadingPhase.LIGHTING,
      LoadingPhase.ENVIRONMENT,
      LoadingPhase.COMPLETE,
    ],
  },
  [QualityMode.BALANCED]: {
    minFPS: FPS_THRESHOLDS.FAIR,
    maxFPS: FPS_THRESHOLDS.GOOD - 1,
    name: 'Balanced',
    description: 'Optimized for smooth performance with good visuals',
    disabledAssets: [
      'grass-high-detail',
      'particle-effects',
      'advanced-shadows',
      'weather-effects',
    ],
    expectedFPS: 50,
    loadingPhases: [
      LoadingPhase.INITIALIZATION,
      LoadingPhase.COURTS,
      LoadingPhase.LIGHTING,
      LoadingPhase.COMPLETE,
    ],
  },
  [QualityMode.MINIMAL]: {
    minFPS: FPS_THRESHOLDS.POOR,
    maxFPS: FPS_THRESHOLDS.FAIR - 1,
    name: 'Minimal',
    description: 'Courts and basic lighting only for maximum performance',
    disabledAssets: [
      'grass-effects',
      'weather-effects',
      'particle-effects',
      'post-processing',
      'advanced-lighting',
      'environment-details',
    ],
    expectedFPS: 45,
    loadingPhases: [
      LoadingPhase.INITIALIZATION,
      LoadingPhase.COURTS,
      LoadingPhase.COMPLETE,
    ],
  },
  [QualityMode.EMERGENCY]: {
    minFPS: 0,
    maxFPS: FPS_THRESHOLDS.POOR - 1,
    name: 'Emergency',
    description: 'Absolute minimum assets for devices struggling to maintain FPS',
    disabledAssets: [
      'grass-effects',
      'weather-effects',
      'particle-effects',
      'post-processing',
      'advanced-lighting',
      'environment-details',
      'dynamic-shadows',
      'ambient-occlusion',
    ],
    expectedFPS: 35,
    loadingPhases: [
      LoadingPhase.INITIALIZATION,
      LoadingPhase.COURTS,
      LoadingPhase.COMPLETE,
    ],
  },
};

const PHASE_FPS_REQUIREMENTS: Record<LoadingPhase, number> = {
  [LoadingPhase.INITIALIZATION]: 30,  // Minimum viable FPS
  [LoadingPhase.COURTS]: 35,          // Core asset loading
  [LoadingPhase.LIGHTING]: 40,        // Lighting effects
  [LoadingPhase.ENVIRONMENT]: 45,     // Grass, weather
  [LoadingPhase.POST_PROCESSING]: 50, // Advanced effects
  [LoadingPhase.COMPLETE]: 55,        // All features
};

export class PerformanceGate {
  private currentMode: QualityMode = QualityMode.BALANCED;
  private overrideEnabled = false;

  /**
   * Check if FPS meets threshold for loading phase
   */
  canProceedToPhase(phase: LoadingPhase, currentFPS: number): boolean {
    // Allow override for user preference
    if (this.overrideEnabled) {
      return true;
    }

    const requiredFPS = PHASE_FPS_REQUIREMENTS[phase];
    return currentFPS >= requiredFPS;
  }

  /**
   * Get performance recommendation based on current FPS
   */
  getRecommendation(currentFPS: number): PerformanceRecommendation {
    const mode = this.determineQualityMode(currentFPS);
    const config = QUALITY_MODES[mode];

    let reason = this.generateReasonText(currentFPS, mode, config);

    return {
      mode,
      reason,
      disabledAssets: config.disabledAssets,
      expectedFPS: config.expectedFPS,
      canOverride: currentFPS >= FPS_THRESHOLDS.POOR,
    };
  }

  /**
   * Determine optimal quality mode from FPS
   */
  determineQualityMode(currentFPS: number): QualityMode {
    // Emergency mode for critically low FPS
    if (currentFPS < FPS_THRESHOLDS.CRITICAL) {
      return QualityMode.EMERGENCY;
    }

    // Find appropriate mode based on FPS
    for (const [mode, config] of Object.entries(QUALITY_MODES)) {
      if (currentFPS >= config.minFPS && currentFPS <= config.maxFPS) {
        return mode as QualityMode;
      }
    }

    // Default to balanced if no match
    return QualityMode.BALANCED;
  }

  /**
   * Check if quality mode is supported at current FPS
   */
  isModeSupported(mode: QualityMode, currentFPS: number): boolean {
    const config = QUALITY_MODES[mode];
    return currentFPS >= config.minFPS;
  }

  /**
   * Get quality mode configuration
   */
  getModeConfig(mode: QualityMode): QualityModeConfig {
    return QUALITY_MODES[mode];
  }

  /**
   * Get all loading phases for a quality mode
   */
  getPhasesForMode(mode: QualityMode): LoadingPhase[] {
    return QUALITY_MODES[mode].loadingPhases;
  }

  /**
   * Set current quality mode (with validation)
   */
  setMode(mode: QualityMode, currentFPS: number): boolean {
    if (!this.isModeSupported(mode, currentFPS) && !this.overrideEnabled) {
      return false;
    }

    this.currentMode = mode;
    return true;
  }

  /**
   * Get current quality mode
   */
  getCurrentMode(): QualityMode {
    return this.currentMode;
  }

  /**
   * Enable/disable user override of recommendations
   */
  setOverride(enabled: boolean): void {
    this.overrideEnabled = enabled;
  }

  /**
   * Check if override is enabled
   */
  isOverrideEnabled(): boolean {
    return this.overrideEnabled;
  }

  /**
   * Get list of all quality modes with their configs
   */
  getAllModes(): Array<{ mode: QualityMode; config: QualityModeConfig }> {
    return Object.entries(QUALITY_MODES).map(([mode, config]) => ({
      mode: mode as QualityMode,
      config,
    }));
  }

  /**
   * Get performance tier name from FPS
   */
  getPerformanceTier(fps: number): string {
    if (fps >= FPS_THRESHOLDS.EXCELLENT) return 'Excellent';
    if (fps >= FPS_THRESHOLDS.GOOD) return 'Good';
    if (fps >= FPS_THRESHOLDS.FAIR) return 'Fair';
    if (fps >= FPS_THRESHOLDS.POOR) return 'Poor';
    if (fps >= FPS_THRESHOLDS.CRITICAL) return 'Critical';
    return 'Emergency';
  }

  /**
   * Generate user-friendly reason text
   */
  private generateReasonText(
    fps: number,
    mode: QualityMode,
    config: QualityModeConfig
  ): string {
    const tier = this.getPerformanceTier(fps);
    const fpsText = Math.round(fps);

    switch (mode) {
      case QualityMode.ULTRA:
        return `Your device is running excellently at ${fpsText} FPS. Ultra Quality mode provides the best visual experience with all assets loaded.`;

      case QualityMode.QUALITY:
        return `Your device is running at ${fpsText} FPS. Quality mode maintains great visuals while ensuring smooth performance. Some advanced post-processing effects are reduced.`;

      case QualityMode.BALANCED:
        return `Your device is running at ${fpsText} FPS. Balanced mode optimizes for smooth performance while keeping good visual quality. Simplified grass and particle effects, but all courts remain visible. Expected FPS: ${config.expectedFPS}-60.`;

      case QualityMode.MINIMAL:
        return `Your device is running at ${fpsText} FPS. Minimal mode is recommended for smooth performance. This disables grass effects and weather but keeps all courts visible with basic lighting. Expected FPS: ${config.expectedFPS}-55.`;

      case QualityMode.EMERGENCY:
        return `Your device is running at ${fpsText} FPS. Emergency mode uses absolute minimum assets for the smoothest possible experience. Only essential court geometry and basic lighting are loaded. Expected FPS: ${config.expectedFPS}+.`;

      default:
        return `Running at ${fpsText} FPS (${tier} performance). ${config.description}`;
    }
  }

  /**
   * Get diagnostic information
   */
  getDiagnostics(): {
    currentMode: QualityMode;
    overrideEnabled: boolean;
    thresholds: FPSThresholds;
    modeConfigs: Record<QualityMode, QualityModeConfig>;
  } {
    return {
      currentMode: this.currentMode,
      overrideEnabled: this.overrideEnabled,
      thresholds: FPS_THRESHOLDS,
      modeConfigs: QUALITY_MODES,
    };
  }
}
