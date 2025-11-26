/**
 * FPS Batch Controller
 *
 * Integrates FPS monitoring with component batch management.
 * Automatically adjusts component loading based on real-time FPS metrics.
 */

import { FPSMonitor, FPSChangeEvent } from '../loading/FPSMonitor';
import {
    ComponentBatchManager,
    ComponentTier,
    TierChangeEvent
} from '../batch-loading/ComponentBatchManager';

export interface FPSThreshold {
    fps: number;
    action: 'downgrade' | 'upgrade' | 'emergency';
    targetTiers?: ComponentTier[];
}

export interface WarningEvent {
    type: 'fps_low' | 'fps_critical' | 'tier_disabled' | 'emergency_mode';
    message: string;
    currentFPS: number;
    threshold: number;
    timestamp: number;
    recommendedAction?: string;
}

export type WarningCallback = (event: WarningEvent) => void;

export interface FPSBatchCorrelation {
    tier: ComponentTier;
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
    private correlationData = new Map<ComponentTier, FPSBatchCorrelation>();

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

        // Monitor tier changes
        this.batchManager.onTierChange((event: TierChangeEvent) => {
            this.handleTierChange(event);
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
            recommendedAction: 'Non-essential tiers will be disabled'
        });

        // Auto-adjust tiers based on FPS
        await this.batchManager.autoAdjustForFPS(currentFPS);

        this.consecutiveLowFPS = 0; // Reset after action
    }

    /**
     * Handle high stable FPS (>= 55)
     */
    private async handleHighFPS(currentFPS: number): Promise<void> {
        console.log(`✨ HIGH FPS: ${currentFPS.toFixed(1)} - Attempting upgrade`);

        // Auto-adjust tiers based on FPS
        await this.batchManager.autoAdjustForFPS(currentFPS);

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
     * Handle tier change events
     */
    private handleTierChange(event: TierChangeEvent): void {
        const { tier, enabled, reason, currentFPS } = event;

        console.log(
            `🔄 Tier ${tier} ${enabled ? 'enabled' : 'disabled'} - Reason: ${reason}, FPS: ${currentFPS.toFixed(1)}`
        );

        // Update correlation data
        this.updateCorrelation(tier, currentFPS, enabled);
    }

    /**
     * Record current FPS for all enabled components
     */
    private recordCurrentFPS(fps: number): void {
        const enabled = this.batchManager.getEnabledComponents();
        enabled.forEach(componentId => {
            this.batchManager.recordComponentFPS(componentId, fps);
        });
    }

    /**
     * Update FPS-to-tier correlation data
     */
    private updateCorrelation(
        tier: ComponentTier,
        fps: number,
        enabled: boolean
    ): void {
        if (!this.correlationData.has(tier)) {
            this.correlationData.set(tier, {
                tier,
                enabledFPS: [],
                disabledFPS: [],
                averageImpact: 0,
                sampleCount: 0
            });
        }

        const correlation = this.correlationData.get(tier)!;

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
     * Get FPS-to-tier correlation data
     */
    getCorrelation(tier: ComponentTier): FPSBatchCorrelation | undefined {
        return this.correlationData.get(tier);
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
        this.correlationData.forEach((correlation, tier) => {
            data[`tier_${tier}`] = correlation;
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
     * Manually enable a tier
     */
    async enableTier(tier: ComponentTier): Promise<boolean> {
        const currentFPS = this.fpsMonitor.getCurrentFPS();
        return this.batchManager.enableTier(tier, 'manual', currentFPS);
    }

    /**
     * Manually disable a tier
     */
    async disableTier(tier: ComponentTier): Promise<boolean> {
        const currentFPS = this.fpsMonitor.getCurrentFPS();
        return this.batchManager.disableTier(tier, 'manual', currentFPS);
    }

    /**
     * Enable a specific component
     */
    async enableComponent(componentId: string): Promise<boolean> {
        return this.batchManager.enableComponent(componentId, true);
    }

    /**
     * Disable a specific component
     */
    async disableComponent(componentId: string): Promise<boolean> {
        return this.batchManager.disableComponent(componentId, true);
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
