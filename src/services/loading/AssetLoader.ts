/**
 * Asset Loader Service
 *
 * Progressive asset loading with phase management and performance monitoring.
 */

import { AssetRegistry } from '../registry/AssetRegistry';
import { DebugContext } from '../../debug/DebugContext';
import {
  LoadingPhase,
  LoadingState,
  AssetLoadStatus,
  LoadingProgress,
  PhaseResult,
  LoadingResult,
  LoadingOptions,
  AssetProgress,
  PhaseProgress,
  LoadingTask,
  AssetCategory
} from './types';
import {
  LOADING_PHASES,
  getPhaseDefinition,
  getNextPhase,
  isPhasePerformanceAcceptable,
  getTotalEstimatedDuration,
  getPhaseForAsset
} from './phases';

/**
 * Default loading options
 */
const DEFAULT_OPTIONS: Required<LoadingOptions> = {
  maxRetries: 2,
  fpsThresholds: new Map([
    [LoadingPhase.ESSENTIAL, 60],
    [LoadingPhase.CORE, 50],
    [LoadingPhase.VISUAL, 45],
    [LoadingPhase.ENHANCED, 40]
  ]),
  autoDegradation: true,
  minimalModeThreshold: 30,
  assetTimeout: 5000,
  phaseTimeout: 30000,
  cancelOnError: false,
  onProgress: () => {},
  onPhaseComplete: () => {}
};

/**
 * AssetLoader Class
 *
 * Manages progressive asset loading with phase-based priority,
 * performance monitoring, and graceful degradation.
 */
export class AssetLoader {
  private registry: AssetRegistry;
  private debugContext: DebugContext;
  private options: Required<LoadingOptions>;

  private state: LoadingState = LoadingState.IDLE;
  private currentPhase?: LoadingPhase;
  private phases: Map<LoadingPhase, PhaseProgress> = new Map();
  private assets: Map<string, AssetProgress> = new Map();
  private tasks: LoadingTask[] = [];
  private startTime: number = 0;
  private cancelled: boolean = false;

  constructor(
    registry: AssetRegistry,
    debugContext: DebugContext,
    options: LoadingOptions = {}
  ) {
    this.registry = registry;
    this.debugContext = debugContext;
    this.options = { ...DEFAULT_OPTIONS, ...options };

    this.initializePhases();
  }

  /**
   * Initialize phase progress tracking
   */
  private initializePhases(): void {
    for (const phaseDef of LOADING_PHASES) {
      this.phases.set(phaseDef.phase, {
        phase: phaseDef.phase,
        totalAssets: phaseDef.assets.length,
        loadedAssets: 0,
        failedAssets: 0,
        skippedAssets: 0,
        targetFPS: phaseDef.targetFPS
      });
    }
  }

  /**
   * Start the loading process
   */
  async start(): Promise<LoadingResult> {
    if (this.state === LoadingState.LOADING) {
      throw new Error('Loading already in progress');
    }

    console.log('🚀 Starting progressive asset loading...');
    this.state = LoadingState.LOADING;
    this.startTime = Date.now();
    this.cancelled = false;

    const completedPhases: LoadingPhase[] = [];
    const failedPhases: LoadingPhase[] = [];

    try {
      for (const phaseDef of LOADING_PHASES) {
        if (this.cancelled) {
          this.state = LoadingState.CANCELLED;
          break;
        }

        console.log(`\n📦 Loading Phase: ${phaseDef.name}`);
        this.currentPhase = phaseDef.phase;

        const result = await this.loadPhase(phaseDef.phase);

        if (result.success) {
          completedPhases.push(phaseDef.phase);
          console.log(`✅ Phase ${phaseDef.name} completed in ${result.duration.toFixed(2)}s`);
          console.log(`   Average FPS: ${result.averageFPS.toFixed(1)}`);
        } else {
          failedPhases.push(phaseDef.phase);
          console.warn(`⚠️ Phase ${phaseDef.name} failed or degraded`);

          if (this.options.cancelOnError) {
            break;
          }
        }

        this.options.onPhaseComplete?.(result);

        // Check if we should skip to minimal mode
        if (
          this.options.autoDegradation &&
          result.averageFPS < this.options.minimalModeThreshold
        ) {
          console.warn('⚡ Performance below threshold, skipping to minimal mode');
          await this.skipToMinimal();
          break;
        }
      }

      this.state = this.cancelled ? LoadingState.CANCELLED : LoadingState.COMPLETED;

      const totalDuration = (Date.now() - this.startTime) / 1000;
      const stats = this.calculateStats();

      const result: LoadingResult = {
        success: failedPhases.length === 0,
        completedPhases,
        failedPhases,
        totalAssets: stats.total,
        loadedAssets: stats.loaded,
        failedAssets: stats.failed,
        skippedAssets: stats.skipped,
        totalDuration,
        finalFPS: this.getCurrentFPS()
      };

      console.log('\n✨ Loading Complete');
      console.log(`   Duration: ${totalDuration.toFixed(2)}s`);
      console.log(`   Assets: ${stats.loaded}/${stats.total} loaded`);
      console.log(`   Final FPS: ${result.finalFPS.toFixed(1)}`);

      return result;
    } catch (error) {
      this.state = LoadingState.ERROR;
      console.error('❌ Loading failed:', error);
      throw error;
    }
  }

  /**
   * Load a specific phase
   */
  async loadPhase(phase: LoadingPhase): Promise<PhaseResult> {
    const phaseDef = getPhaseDefinition(phase);
    const phaseProgress = this.phases.get(phase)!;
    const startTime = Date.now();

    phaseProgress.startTime = startTime;
    phaseProgress.currentFPS = this.getCurrentFPS();

    const loadedAssets: string[] = [];
    const failedAssets: string[] = [];
    const skippedAssets: string[] = [];

    // Create loading tasks for this phase
    const tasks = await this.createPhaseAsks(phase);

    // Sort tasks by priority and dependencies
    const sortedTasks = this.sortTasksByDependencies(tasks);

    // Load assets in order
    for (const task of sortedTasks) {
      if (this.cancelled) break;

      try {
        await this.loadAsset(task.assetId);
        loadedAssets.push(task.assetId);
      } catch (error) {
        console.error(`Failed to load asset ${task.assetId}:`, error);
        failedAssets.push(task.assetId);

        if (this.options.cancelOnError) {
          break;
        }
      }

      // Update progress
      this.emitProgress();
    }

    const endTime = Date.now();
    phaseProgress.endTime = endTime;

    const duration = (endTime - startTime) / 1000;
    const averageFPS = this.getCurrentFPS();
    phaseProgress.currentFPS = averageFPS;

    const success = isPhasePerformanceAcceptable(phase, averageFPS) &&
                    failedAssets.length === 0;

    return {
      phase,
      success,
      loadedAssets,
      failedAssets,
      skippedAssets,
      averageFPS,
      duration
    };
  }

  /**
   * Load assets in a category
   */
  async loadCategory(category: AssetCategory): Promise<void> {
    console.log(`📁 Loading category: ${category}`);

    const assets = this.registry.getAssetsByCategory(category);

    for (const asset of assets) {
      try {
        await this.loadAsset(asset.id);
      } catch (error) {
        console.error(`Failed to load ${asset.id}:`, error);
        if (this.options.cancelOnError) {
          throw error;
        }
      }
    }
  }

  /**
   * Load an individual asset
   */
  async loadAsset(assetId: string): Promise<void> {
    let progress = this.assets.get(assetId);

    if (!progress) {
      const asset = this.registry.getAsset(assetId);
      if (!asset) {
        throw new Error(`Asset not found: ${assetId}`);
      }

      progress = {
        id: assetId,
        category: asset.category as AssetCategory,
        status: AssetLoadStatus.PENDING,
        retries: 0
      };
      this.assets.set(assetId, progress);
    }

    if (progress.status === AssetLoadStatus.LOADED) {
      return; // Already loaded
    }

    progress.status = AssetLoadStatus.LOADING;
    const loadStart = Date.now();

    try {
      // Load with timeout
      await this.loadWithTimeout(assetId, this.options.assetTimeout);

      progress.status = AssetLoadStatus.LOADED;
      progress.loadTime = Date.now() - loadStart;

      // Enable asset in debug context
      this.debugContext.enableAsset(assetId);

      // Update phase progress
      this.updatePhaseProgress(assetId, true);

      console.log(`  ✅ Loaded: ${assetId} (${progress.loadTime}ms)`);
    } catch (error) {
      progress.error = error as Error;

      // Retry logic
      if (progress.retries < this.options.maxRetries) {
        progress.retries++;
        console.warn(`  ⚠️ Retry ${progress.retries}/${this.options.maxRetries}: ${assetId}`);
        return this.loadAsset(assetId); // Recursive retry
      }

      progress.status = AssetLoadStatus.FAILED;
      this.updatePhaseProgress(assetId, false);

      console.error(`  ❌ Failed: ${assetId} after ${progress.retries} retries`);
      throw error;
    }
  }

  /**
   * Get current loading progress
   */
  getProgress(): LoadingProgress {
    const stats = this.calculateStats();
    const totalAssets = Array.from(this.phases.values()).reduce(
      (sum, p) => sum + p.totalAssets,
      0
    );

    const totalProgress = totalAssets > 0
      ? (stats.loaded / totalAssets) * 100
      : 0;

    const elapsedTime = (Date.now() - this.startTime) / 1000;
    const estimatedTotal = getTotalEstimatedDuration();
    const estimatedTimeRemaining = Math.max(0, estimatedTotal - elapsedTime);

    return {
      state: this.state,
      currentPhase: this.currentPhase,
      phases: new Map(this.phases),
      assets: new Map(this.assets),
      totalProgress,
      elapsedTime,
      estimatedTimeRemaining
    };
  }

  /**
   * Cancel loading process
   */
  cancel(): void {
    console.log('🛑 Cancelling loading...');
    this.cancelled = true;
    this.state = LoadingState.CANCELLED;
  }

  /**
   * Skip to minimal mode (only essential phase)
   */
  async skipToMinimal(): Promise<void> {
    console.log('⚡ Skipping to minimal mode...');

    // Load only essential phase
    await this.loadPhase(LoadingPhase.ESSENTIAL);

    // Mark other phases as skipped
    for (const phase of [LoadingPhase.CORE, LoadingPhase.VISUAL, LoadingPhase.ENHANCED]) {
      const phaseProgress = this.phases.get(phase)!;
      phaseProgress.skippedAssets = phaseProgress.totalAssets;

      const phaseDef = getPhaseDefinition(phase);
      for (const assetId of phaseDef.assets) {
        const progress = this.assets.get(assetId);
        if (progress && progress.status === AssetLoadStatus.PENDING) {
          progress.status = AssetLoadStatus.SKIPPED;
        }
      }
    }

    this.state = LoadingState.COMPLETED;
  }

  /**
   * Force load all assets (bypass performance checks)
   */
  async forceLoadAll(): Promise<void> {
    console.log('🔥 Force loading all assets...');

    const originalAutoDegradation = this.options.autoDegradation;
    this.options.autoDegradation = false;

    try {
      await this.start();
    } finally {
      this.options.autoDegradation = originalAutoDegradation;
    }
  }

  // Private helper methods

  /**
   * Create loading tasks for a phase
   */
  private async createPhaseTasks(phase: LoadingPhase): Promise<LoadingTask[]> {
    const phaseDef = getPhaseDefinition(phase);
    const tasks: LoadingTask[] = [];

    for (const assetId of phaseDef.assets) {
      const asset = this.registry.getAsset(assetId);
      if (!asset) {
        console.warn(`Asset not found in registry: ${assetId}`);
        continue;
      }

      tasks.push({
        assetId: asset.id,
        category: asset.category as AssetCategory,
        phase,
        priority: asset.priority || 0,
        dependencies: asset.dependencies || [],
        loadFn: async () => {
          // Placeholder - actual loading happens in loadAsset
        }
      });
    }

    return tasks;
  }

  /**
   * Sort tasks by dependencies and priority
   */
  private sortTasksByDependencies(tasks: LoadingTask[]): LoadingTask[] {
    const sorted: LoadingTask[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const visit = (task: LoadingTask) => {
      if (visited.has(task.assetId)) return;
      if (visiting.has(task.assetId)) {
        console.warn(`Circular dependency detected: ${task.assetId}`);
        return;
      }

      visiting.add(task.assetId);

      // Visit dependencies first
      for (const depId of task.dependencies) {
        const depTask = tasks.find(t => t.assetId === depId);
        if (depTask) {
          visit(depTask);
        }
      }

      visiting.delete(task.assetId);
      visited.add(task.assetId);
      sorted.push(task);
    };

    // Sort by priority first
    const prioritySorted = [...tasks].sort((a, b) => b.priority - a.priority);

    for (const task of prioritySorted) {
      visit(task);
    }

    return sorted;
  }

  /**
   * Load asset with timeout
   */
  private async loadWithTimeout(assetId: string, timeout: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Asset load timeout: ${assetId}`));
      }, timeout);

      // Simulate asset loading - in real implementation, this would
      // interface with THREE.js loaders, etc.
      this.simulateAssetLoad(assetId)
        .then(() => {
          clearTimeout(timer);
          resolve();
        })
        .catch((error) => {
          clearTimeout(timer);
          reject(error);
        });
    });
  }

  /**
   * Simulate asset loading (placeholder for actual implementation)
   */
  private async simulateAssetLoad(assetId: string): Promise<void> {
    // In real implementation, this would:
    // 1. Get asset metadata from registry
    // 2. Load appropriate resource (geometry, texture, etc.)
    // 3. Create THREE.js objects
    // 4. Add to scene
    // 5. Update debug context

    // Simulate load time based on asset type
    const loadTime = Math.random() * 100 + 50;
    await new Promise(resolve => setTimeout(resolve, loadTime));
  }

  /**
   * Update phase progress after asset load
   */
  private updatePhaseProgress(assetId: string, success: boolean): void {
    const phase = getPhaseForAsset(assetId);
    if (!phase) return;

    const phaseProgress = this.phases.get(phase);
    if (!phaseProgress) return;

    if (success) {
      phaseProgress.loadedAssets++;
    } else {
      phaseProgress.failedAssets++;
    }
  }

  /**
   * Calculate loading statistics
   */
  private calculateStats() {
    let total = 0;
    let loaded = 0;
    let failed = 0;
    let skipped = 0;

    for (const progress of this.assets.values()) {
      total++;
      if (progress.status === AssetLoadStatus.LOADED) loaded++;
      if (progress.status === AssetLoadStatus.FAILED) failed++;
      if (progress.status === AssetLoadStatus.SKIPPED) skipped++;
    }

    return { total, loaded, failed, skipped };
  }

  /**
   * Get current FPS (placeholder - should integrate with actual FPS counter)
   */
  private getCurrentFPS(): number {
    // In real implementation, this would read from performance monitor
    // For now, return simulated FPS
    return 60 - (this.assets.size * 0.1);
  }

  /**
   * Emit progress update
   */
  private emitProgress(): void {
    const progress = this.getProgress();
    this.options.onProgress?.(progress);
  }
}
