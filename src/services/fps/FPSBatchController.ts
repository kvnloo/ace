/**
 * FPS Batch Controller
 *
 * Integrates FPS monitoring with component batch management.
 * Automatically adjusts component loading based on real-time FPS metrics.
 */

import { FPSMonitor, FPSChangeEvent } from '../loading/FPSMonitor';
import {
  ComponentBatchManager,
  ComponentBatch,
  BatchChangeEvent
} from './ComponentBatchManager';

export interface FPSThreshold {
  fps: number;
  action: 'downgrade' | 'upgrade' | 'emergency';
  targetBatches?: ComponentBatch[];
}

export interface WarningEvent {
  type: 'fps_low' | 'fps_critical' | 'batch_disabled' | 'emergency_mode';
  message: string;
  currentFPS: number;
  threshold: number;
  timestamp: number;
  recommendedAction?: string;
}

export type WarningCallback = (event: WarningEvent) => void;

export interface FPSBatchCorrelation {
  batch: ComponentBatch;
  enabledFPS: number[];
  disabledFPS: number[];
  averageImpact: number;
  sampleCount: number;
}

export class FPSBatchController {
  private fpsMonitor: FPSMonitor;
  private batchManager: ComponentBatchManager;
  private warningCallbacks: WarningCallback[] = [];
  private isMonitoring = false;
  private checkInterval: number | null = null;
  private correlationData = new Map<ComponentBatch, FPSBatchCorrelation>();

  // FPS thresholds
  private readonly CRITICAL_FPS = 25;
  private readonly LOW_FPS = 40;
  private readonly STABLE_FPS = 55;
  private readonly CHECK_INTERVAL_MS = 1000; // Check every second

  // Stability tracking
  private consecutiveLowFPS = 0;
  private consecutiveHighFPS = 0;
  private readonly STABILITY_THRESHOLD = 3; // Require 3 consecutive samples

  constructor(
    fpsMonitor?: FPSMonitor,
    batchManager?: ComponentBatchManager
  ) {
    this.fpsMonitor = fpsMonitor || new FPSMonitor();
    this.batchManager = batchManager || new ComponentBatchManager();

    this.setupMonitoringCallbacks();
  }

  /**
   * Setup callbacks for monitoring
   */
  private setupMonitoringCallbacks(): void {
    // Monitor FPS changes
    this.fpsMonitor.onSignificantChange((event: FPSChangeEvent) => {
      this.handleFPSChange(event);
    });

    // Monitor batch changes
    this.batchManager.onBatchChange((event: BatchChangeEvent) => {
      this.handleBatchChange(event);
    });
  }

  /**
   * Start integrated monitoring
   */
  start(): void {
    if (this.isMonitoring) {
      return;
    }

    this.isMonitoring = true;
    this.fpsMonitor.start();

    // Periodic check for FPS thresholds
    this.checkInterval = window.setInterval(() => {
      this.checkFPSThresholds();
    }, this.CHECK_INTERVAL_MS);

    console.log('🎯 FPS Batch Controller started');
  }

  /**
   * Stop monitoring
   */
  stop(): void {
    if (!this.isMonitoring) {
      return;
    }

    this.isMonitoring = false;
    this.fpsMonitor.stop();

    if (this.checkInterval !== null) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }

    console.log('🛑 FPS Batch Controller stopped');
  }

  /**
   * Check FPS thresholds and take action
   */
  private checkFPSThresholds(): void {
    const stats = this.fpsMonitor.getStats();
    const currentFPS = stats.average;

    // Critical FPS - emergency mode
    if (currentFPS < this.CRITICAL_FPS) {
      this.consecutiveLowFPS++;
      this.consecutiveHighFPS = 0;

      if (this.consecutiveLowFPS >= this.STABILITY_THRESHOLD) {
        this.handleCriticalFPS(currentFPS);
      }
    }
    // Low FPS - downgrade
    else if (currentFPS < this.LOW_FPS) {
      this.consecutiveLowFPS++;
      this.consecutiveHighFPS = 0;

      if (this.consecutiveLowFPS >= this.STABILITY_THRESHOLD) {
        this.handleLowFPS(currentFPS);
      }
    }
    // Stable high FPS - potential upgrade
    else if (currentFPS >= this.STABLE_FPS) {
      this.consecutiveHighFPS++;
      this.consecutiveLowFPS = 0;

      if (this.consecutiveHighFPS >= this.STABILITY_THRESHOLD * 2) {
        this.handleHighFPS(currentFPS);
      }
    }
    // Normal range - reset counters
    else {
      this.consecutiveLowFPS = 0;
      this.consecutiveHighFPS = 0;
    }

    // Record FPS for all enabled batches
    this.recordCurrentFPS(currentFPS);
  }

  /**
   * Handle critical FPS (< 25)
   */
  private async handleCriticalFPS(currentFPS: number): Promise<void> {
    console.error(`🚨 CRITICAL FPS: ${currentFPS.toFixed(1)} - Activating emergency mode`);

    this.emitWarning({
      type: 'fps_critical',
      message: 'Critical FPS detected - switching to emergency mode',
      currentFPS,
      threshold: this.CRITICAL_FPS,
      timestamp: Date.now(),
      recommendedAction: 'All non-essential components will be disabled'
    });

    await this.batchManager.emergencyMode(currentFPS);
    this.consecutiveLowFPS = 0; // Reset after action
  }

  /**
   * Handle low FPS (< 40)
   */
  private async handleLowFPS(currentFPS: number): Promise<void> {
    console.warn(`⚠️ LOW FPS: ${currentFPS.toFixed(1)} - Downgrading batches`);

    this.emitWarning({
      type: 'fps_low',
      message: 'Low FPS detected - disabling performance-heavy components',
      currentFPS,
      threshold: this.LOW_FPS,
      timestamp: Date.now(),
      recommendedAction: 'Non-essential batches will be disabled'
    });

    const disabled = await this.batchManager.downgradeToTargetFPS(
      this.LOW_FPS,
      currentFPS
    );

    if (disabled.length > 0) {
      this.emitWarning({
        type: 'batch_disabled',
        message: `Disabled ${disabled.length} component batch(es) to improve performance`,
        currentFPS,
        threshold: this.LOW_FPS,
        timestamp: Date.now()
      });
    }

    this.consecutiveLowFPS = 0; // Reset after action
  }

  /**
   * Handle high stable FPS (>= 55)
   */
  private async handleHighFPS(currentFPS: number): Promise<void> {
    console.log(`✨ HIGH FPS: ${currentFPS.toFixed(1)} - Attempting upgrade`);

    const enabled = await this.batchManager.upgradeWithAvailableFPS(
      currentFPS,
      this.STABLE_FPS
    );

    if (enabled.length > 0) {
      console.log(`✅ Enabled ${enabled.length} additional batch(es)`);
    }

    this.consecutiveHighFPS = 0; // Reset after action
  }

  /**
   * Handle FPS change events
   */
  private handleFPSChange(event: FPSChangeEvent): void {
    const delta = event.delta;
    const currentFPS = event.currentFPS;

    // Significant drop
    if (delta < -15) {
      console.warn(`📉 Significant FPS drop: ${delta.toFixed(1)} (now ${currentFPS.toFixed(1)})`);
    }
    // Significant gain
    else if (delta > 15) {
      console.log(`📈 Significant FPS gain: ${delta.toFixed(1)} (now ${currentFPS.toFixed(1)})`);
    }
  }

  /**
   * Handle batch change events
   */
  private handleBatchChange(event: BatchChangeEvent): void {
    const { batch, enabled, reason, currentFPS } = event;
    const config = this.batchManager.getBatchConfig(batch);

    console.log(
      `🔄 Batch ${enabled ? 'enabled' : 'disabled'}: ${batch} (${config.description}) - Reason: ${reason}, FPS: ${currentFPS.toFixed(1)}`
    );

    // Update correlation data
    this.updateCorrelation(batch, currentFPS, enabled);
  }

  /**
   * Record current FPS for all enabled batches
   */
  private recordCurrentFPS(fps: number): void {
    const enabled = this.batchManager.getEnabledBatches();
    enabled.forEach(batch => {
      this.batchManager.recordBatchFPS(batch, fps);
    });
  }

  /**
   * Update FPS-to-batch correlation data
   */
  private updateCorrelation(
    batch: ComponentBatch,
    fps: number,
    enabled: boolean
  ): void {
    if (!this.correlationData.has(batch)) {
      this.correlationData.set(batch, {
        batch,
        enabledFPS: [],
        disabledFPS: [],
        averageImpact: 0,
        sampleCount: 0
      });
    }

    const correlation = this.correlationData.get(batch)!;

    if (enabled) {
      correlation.enabledFPS.push(fps);
    } else {
      correlation.disabledFPS.push(fps);
    }

    correlation.sampleCount++;

    // Calculate average impact
    if (correlation.enabledFPS.length > 0 && correlation.disabledFPS.length > 0) {
      const avgEnabled = correlation.enabledFPS.reduce((a, b) => a + b, 0) / correlation.enabledFPS.length;
      const avgDisabled = correlation.disabledFPS.reduce((a, b) => a + b, 0) / correlation.disabledFPS.length;
      correlation.averageImpact = avgDisabled - avgEnabled;
    }

    // Keep last 50 samples for each state
    if (correlation.enabledFPS.length > 50) {
      correlation.enabledFPS.shift();
    }
    if (correlation.disabledFPS.length > 50) {
      correlation.disabledFPS.shift();
    }
  }

  /**
   * Get FPS-to-batch correlation data
   */
  getCorrelation(batch: ComponentBatch): FPSBatchCorrelation | undefined {
    return this.correlationData.get(batch);
  }

  /**
   * Get all correlation data
   */
  getAllCorrelations(): FPSBatchCorrelation[] {
    return Array.from(this.correlationData.values());
  }

  /**
   * Export correlation data for analysis
   */
  exportCorrelationData(): Record<string, FPSBatchCorrelation> {
    const data: Record<string, FPSBatchCorrelation> = {};
    this.correlationData.forEach((correlation, batch) => {
      data[batch] = correlation;
    });
    return data;
  }

  /**
   * Get FPS monitor instance
   */
  getFPSMonitor(): FPSMonitor {
    return this.fpsMonitor;
  }

  /**
   * Get batch manager instance
   */
  getBatchManager(): ComponentBatchManager {
    return this.batchManager;
  }

  /**
   * Register warning callback
   */
  onWarning(callback: WarningCallback): () => void {
    this.warningCallbacks.push(callback);
    return () => {
      const index = this.warningCallbacks.indexOf(callback);
      if (index > -1) {
        this.warningCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Emit warning to callbacks
   */
  private emitWarning(event: WarningEvent): void {
    this.warningCallbacks.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('Error in warning callback:', error);
      }
    });
  }

  /**
   * Manually enable a batch
   */
  async enableBatch(batch: ComponentBatch): Promise<boolean> {
    const currentFPS = this.fpsMonitor.getCurrentFPS();
    return this.batchManager.enableBatch(batch, 'manual', currentFPS);
  }

  /**
   * Manually disable a batch
   */
  async disableBatch(batch: ComponentBatch): Promise<boolean> {
    const currentFPS = this.fpsMonitor.getCurrentFPS();
    return this.batchManager.disableBatch(batch, 'manual', currentFPS);
  }

  /**
   * Clear all manual overrides
   */
  clearManualOverrides(): void {
    this.batchManager.clearManualOverrides();
  }

  /**
   * Get comprehensive diagnostics
   */
  getDiagnostics(): {
    monitoring: boolean;
    fps: ReturnType<FPSMonitor['getDiagnostics']>;
    batches: ReturnType<ComponentBatchManager['getDiagnostics']>;
    thresholds: {
      critical: number;
      low: number;
      stable: number;
    };
    stability: {
      consecutiveLow: number;
      consecutiveHigh: number;
      threshold: number;
    };
    correlations: number;
  } {
    return {
      monitoring: this.isMonitoring,
      fps: this.fpsMonitor.getDiagnostics(),
      batches: this.batchManager.getDiagnostics(),
      thresholds: {
        critical: this.CRITICAL_FPS,
        low: this.LOW_FPS,
        stable: this.STABLE_FPS
      },
      stability: {
        consecutiveLow: this.consecutiveLowFPS,
        consecutiveHigh: this.consecutiveHighFPS,
        threshold: this.STABILITY_THRESHOLD
      },
      correlations: this.correlationData.size
    };
  }

  /**
   * Reset all data
   */
  reset(): void {
    this.fpsMonitor.reset();
    this.batchManager.reset();
    this.correlationData.clear();
    this.consecutiveLowFPS = 0;
    this.consecutiveHighFPS = 0;
  }
}

// Export singleton instance
export const fpsBatchController = new FPSBatchController();
