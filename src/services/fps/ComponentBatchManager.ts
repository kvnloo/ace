/**
 * Component Batch Manager
 *
 * Manages progressive loading/unloading of 3D scene components in batches
 * based on performance metrics and user preferences.
 */

export enum ComponentBatch {
  COURTS_ONLY = 'courts_only',
  BUILDINGS = 'buildings',
  GRASS = 'grass',
  TREES = 'trees',
  PARTICLES = 'particles',
  WEATHER = 'weather',
  POST_PROCESSING = 'post_processing',
  SHADOWS = 'shadows',
  REFLECTIONS = 'reflections'
}

export interface BatchConfig {
  batch: ComponentBatch;
  priority: number;
  estimatedCost: number; // Expected FPS impact
  dependencies: ComponentBatch[];
  assets: string[];
  description: string;
}

export interface BatchState {
  batch: ComponentBatch;
  enabled: boolean;
  loadedAt?: number;
  disabledAt?: number;
  manualOverride: boolean;
}

export interface BatchChangeEvent {
  batch: ComponentBatch;
  enabled: boolean;
  reason: 'auto' | 'manual' | 'fps_threshold' | 'emergency';
  timestamp: number;
  currentFPS: number;
}

export type BatchChangeCallback = (event: BatchChangeEvent) => void;

const BATCH_CONFIGS: Record<ComponentBatch, BatchConfig> = {
  [ComponentBatch.COURTS_ONLY]: {
    batch: ComponentBatch.COURTS_ONLY,
    priority: 0,
    estimatedCost: 0,
    dependencies: [],
    assets: ['courts', 'court-geometry', 'court-textures'],
    description: 'Essential court geometry only'
  },
  [ComponentBatch.BUILDINGS]: {
    batch: ComponentBatch.BUILDINGS,
    priority: 1,
    estimatedCost: 5,
    dependencies: [ComponentBatch.COURTS_ONLY],
    assets: ['buildings', 'building-geometry', 'building-textures'],
    description: 'Surrounding buildings and structures'
  },
  [ComponentBatch.GRASS]: {
    batch: ComponentBatch.GRASS,
    priority: 2,
    estimatedCost: 10,
    dependencies: [ComponentBatch.COURTS_ONLY],
    assets: ['grass', 'grass-low', 'grass-medium', 'grass-high'],
    description: 'Grass and ground cover'
  },
  [ComponentBatch.TREES]: {
    batch: ComponentBatch.TREES,
    priority: 3,
    estimatedCost: 8,
    dependencies: [ComponentBatch.COURTS_ONLY],
    assets: ['trees', 'foliage', 'vegetation'],
    description: 'Trees and foliage'
  },
  [ComponentBatch.SHADOWS]: {
    batch: ComponentBatch.SHADOWS,
    priority: 4,
    estimatedCost: 12,
    dependencies: [ComponentBatch.COURTS_ONLY],
    assets: ['shadows', 'shadow-maps'],
    description: 'Dynamic shadows'
  },
  [ComponentBatch.WEATHER]: {
    batch: ComponentBatch.WEATHER,
    priority: 5,
    estimatedCost: 7,
    dependencies: [ComponentBatch.COURTS_ONLY],
    assets: ['weather', 'weather-effects', 'sky'],
    description: 'Weather and atmospheric effects'
  },
  [ComponentBatch.PARTICLES]: {
    batch: ComponentBatch.PARTICLES,
    priority: 6,
    estimatedCost: 15,
    dependencies: [ComponentBatch.COURTS_ONLY],
    assets: ['particles', 'particle-systems'],
    description: 'Particle effects'
  },
  [ComponentBatch.POST_PROCESSING]: {
    batch: ComponentBatch.POST_PROCESSING,
    priority: 7,
    estimatedCost: 10,
    dependencies: [ComponentBatch.COURTS_ONLY],
    assets: ['post-processing', 'bloom', 'ao', 'ssao'],
    description: 'Post-processing effects'
  },
  [ComponentBatch.REFLECTIONS]: {
    batch: ComponentBatch.REFLECTIONS,
    priority: 8,
    estimatedCost: 18,
    dependencies: [ComponentBatch.COURTS_ONLY, ComponentBatch.BUILDINGS],
    assets: ['reflections', 'reflection-probes', 'ssr'],
    description: 'Reflections and advanced lighting'
  }
};

export class ComponentBatchManager {
  private batchStates = new Map<ComponentBatch, BatchState>();
  private changeCallbacks: BatchChangeCallback[] = [];
  private loadOrderHistory: ComponentBatch[] = [];
  private performanceHistory: Map<ComponentBatch, number[]> = new Map();

  constructor() {
    this.initializeBatchStates();
  }

  /**
   * Initialize all batches as disabled except courts
   */
  private initializeBatchStates(): void {
    Object.values(ComponentBatch).forEach(batch => {
      this.batchStates.set(batch, {
        batch,
        enabled: batch === ComponentBatch.COURTS_ONLY,
        manualOverride: false
      });
    });
  }

  /**
   * Enable a component batch
   */
  async enableBatch(
    batch: ComponentBatch,
    reason: BatchChangeEvent['reason'] = 'manual',
    currentFPS = 60
  ): Promise<boolean> {
    const state = this.batchStates.get(batch);
    if (!state || state.enabled) {
      return false;
    }

    // Check dependencies
    const config = BATCH_CONFIGS[batch];
    for (const dep of config.dependencies) {
      const depState = this.batchStates.get(dep);
      if (!depState?.enabled) {
        console.warn(`Cannot enable ${batch}: dependency ${dep} not enabled`);
        return false;
      }
    }

    // Update state
    state.enabled = true;
    state.loadedAt = Date.now();
    if (reason === 'manual') {
      state.manualOverride = true;
    }

    this.loadOrderHistory.push(batch);
    this.notifyChange({ batch, enabled: true, reason, timestamp: Date.now(), currentFPS });

    console.log(`✅ Enabled batch: ${batch} (${config.description})`);
    return true;
  }

  /**
   * Disable a component batch
   */
  async disableBatch(
    batch: ComponentBatch,
    reason: BatchChangeEvent['reason'] = 'manual',
    currentFPS = 60
  ): Promise<boolean> {
    // Cannot disable courts_only
    if (batch === ComponentBatch.COURTS_ONLY) {
      console.warn('Cannot disable COURTS_ONLY batch');
      return false;
    }

    const state = this.batchStates.get(batch);
    if (!state || !state.enabled) {
      return false;
    }

    // Disable dependent batches first
    const dependents = this.getDependentBatches(batch);
    for (const dep of dependents) {
      await this.disableBatch(dep, reason, currentFPS);
    }

    // Update state
    state.enabled = false;
    state.disabledAt = Date.now();
    if (reason === 'manual') {
      state.manualOverride = true;
    }

    this.notifyChange({ batch, enabled: false, reason, timestamp: Date.now(), currentFPS });

    const config = BATCH_CONFIGS[batch];
    console.log(`❌ Disabled batch: ${batch} (${config.description})`);
    return true;
  }

  /**
   * Get batches that depend on a given batch
   */
  private getDependentBatches(batch: ComponentBatch): ComponentBatch[] {
    return Object.values(ComponentBatch).filter(b => {
      const config = BATCH_CONFIGS[b];
      return config.dependencies.includes(batch);
    });
  }

  /**
   * Disable batches until target FPS is achievable
   */
  async downgradeToTargetFPS(targetFPS: number, currentFPS: number): Promise<ComponentBatch[]> {
    const disabled: ComponentBatch[] = [];
    const enabledBatches = this.getEnabledBatches()
      .filter(b => b !== ComponentBatch.COURTS_ONLY)
      .sort((a, b) => BATCH_CONFIGS[b].priority - BATCH_CONFIGS[a].priority); // Highest priority first

    for (const batch of enabledBatches) {
      const state = this.batchStates.get(batch);
      if (state?.manualOverride) {
        console.log(`⚠️ Skipping ${batch} - manual override enabled`);
        continue;
      }

      const estimatedGain = BATCH_CONFIGS[batch].estimatedCost;
      await this.disableBatch(batch, 'fps_threshold', currentFPS);
      disabled.push(batch);

      // Estimate if we've recovered enough FPS
      if (currentFPS + estimatedGain >= targetFPS) {
        break;
      }
    }

    return disabled;
  }

  /**
   * Enable batches progressively based on available FPS headroom
   */
  async upgradeWithAvailableFPS(currentFPS: number, targetFPS = 60): Promise<ComponentBatch[]> {
    const enabled: ComponentBatch[] = [];
    const availableHeadroom = currentFPS - targetFPS;

    if (availableHeadroom < 5) {
      return enabled; // Not enough headroom
    }

    const disabledBatches = this.getDisabledBatches()
      .sort((a, b) => BATCH_CONFIGS[a].priority - BATCH_CONFIGS[b].priority); // Lowest priority first

    let usedHeadroom = 0;
    for (const batch of disabledBatches) {
      const state = this.batchStates.get(batch);
      if (state?.manualOverride) {
        continue;
      }

      const estimatedCost = BATCH_CONFIGS[batch].estimatedCost;
      if (usedHeadroom + estimatedCost <= availableHeadroom) {
        const success = await this.enableBatch(batch, 'auto', currentFPS);
        if (success) {
          enabled.push(batch);
          usedHeadroom += estimatedCost;
        }
      }
    }

    return enabled;
  }

  /**
   * Emergency mode - disable all non-essential batches
   */
  async emergencyMode(currentFPS: number): Promise<void> {
    console.warn('🚨 EMERGENCY MODE ACTIVATED - Disabling all non-essential batches');

    const batches = Object.values(ComponentBatch).filter(b => b !== ComponentBatch.COURTS_ONLY);
    for (const batch of batches) {
      await this.disableBatch(batch, 'emergency', currentFPS);
    }
  }

  /**
   * Get currently enabled batches
   */
  getEnabledBatches(): ComponentBatch[] {
    return Array.from(this.batchStates.entries())
      .filter(([_, state]) => state.enabled)
      .map(([batch]) => batch);
  }

  /**
   * Get currently disabled batches
   */
  getDisabledBatches(): ComponentBatch[] {
    return Array.from(this.batchStates.entries())
      .filter(([_, state]) => !state.enabled)
      .map(([batch]) => batch);
  }

  /**
   * Get batch state
   */
  getBatchState(batch: ComponentBatch): BatchState | undefined {
    return this.batchStates.get(batch);
  }

  /**
   * Get batch configuration
   */
  getBatchConfig(batch: ComponentBatch): BatchConfig {
    return BATCH_CONFIGS[batch];
  }

  /**
   * Get all batch configurations
   */
  getAllBatchConfigs(): BatchConfig[] {
    return Object.values(BATCH_CONFIGS);
  }

  /**
   * Record FPS for a batch (for correlation tracking)
   */
  recordBatchFPS(batch: ComponentBatch, fps: number): void {
    if (!this.performanceHistory.has(batch)) {
      this.performanceHistory.set(batch, []);
    }

    const history = this.performanceHistory.get(batch)!;
    history.push(fps);

    // Keep last 100 samples
    if (history.length > 100) {
      history.shift();
    }
  }

  /**
   * Get average FPS impact of a batch
   */
  getAverageFPSImpact(batch: ComponentBatch): number {
    const history = this.performanceHistory.get(batch);
    if (!history || history.length === 0) {
      return BATCH_CONFIGS[batch].estimatedCost;
    }

    const sum = history.reduce((acc, fps) => acc + fps, 0);
    return sum / history.length;
  }

  /**
   * Get load order history
   */
  getLoadOrderHistory(): ComponentBatch[] {
    return [...this.loadOrderHistory];
  }

  /**
   * Clear manual overrides
   */
  clearManualOverrides(): void {
    this.batchStates.forEach(state => {
      state.manualOverride = false;
    });
  }

  /**
   * Register callback for batch changes
   */
  onBatchChange(callback: BatchChangeCallback): () => void {
    this.changeCallbacks.push(callback);
    return () => {
      const index = this.changeCallbacks.indexOf(callback);
      if (index > -1) {
        this.changeCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Notify callbacks of batch changes
   */
  private notifyChange(event: BatchChangeEvent): void {
    this.changeCallbacks.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('Error in batch change callback:', error);
      }
    });
  }

  /**
   * Get diagnostic information
   */
  getDiagnostics(): {
    enabled: ComponentBatch[];
    disabled: ComponentBatch[];
    manualOverrides: ComponentBatch[];
    loadOrder: ComponentBatch[];
    callbackCount: number;
  } {
    return {
      enabled: this.getEnabledBatches(),
      disabled: this.getDisabledBatches(),
      manualOverrides: Array.from(this.batchStates.entries())
        .filter(([_, state]) => state.manualOverride)
        .map(([batch]) => batch),
      loadOrder: this.loadOrderHistory,
      callbackCount: this.changeCallbacks.length
    };
  }

  /**
   * Reset to default state
   */
  reset(): void {
    this.initializeBatchStates();
    this.loadOrderHistory = [];
    this.performanceHistory.clear();
  }
}

// Export singleton instance
export const componentBatchManager = new ComponentBatchManager();
