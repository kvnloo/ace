/**
 * FPS Monitor
 *
 * Real-time frame rate monitoring with stability detection and performance analysis.
 * Tracks FPS over time and provides insights into rendering performance.
 */

export interface FPSStats {
    current: number;
    average: number;
    min: number;
    max: number;
    variance: number;
    isStable: boolean;
}

export interface FPSChangeEvent {
    previousFPS: number;
    currentFPS: number;
    delta: number;
    timestamp: number;
}

export type FPSChangeCallback = (event: FPSChangeEvent) => void;

export class FPSMonitor {
    private isMonitoring = false;
    private animationFrameId: number | null = null;
    private lastFrameTime = 0;
    private fpsHistory: number[] = [];
    private readonly maxHistorySize = 300; // 5 seconds at 60 FPS
    private changeCallbacks: FPSChangeCallback[] = [];
    private readonly significantChangeThreshold = 10; // FPS change to trigger callback

    /**
     * Start monitoring frame rate
     */
    start(): void {
        if (this.isMonitoring) {
            return;
        }

        this.isMonitoring = true;
        this.lastFrameTime = performance.now();
        this.fpsHistory = [];
        this.measureFrame();
    }

    /**
     * Stop monitoring frame rate
     */
    stop(): void {
        if (!this.isMonitoring) {
            return;
        }

        this.isMonitoring = false;
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    /**
     * Get current instantaneous FPS
     */
    getCurrentFPS(): number {
        if (this.fpsHistory.length === 0) {
            return 0;
        }
        return this.fpsHistory[this.fpsHistory.length - 1];
    }

    /**
     * Get average FPS over last N frames
     * @param frames Number of frames to average (default: 60)
     */
    getAverageFPS(frames = 60): number {
        if (this.fpsHistory.length === 0) {
            return 0;
        }

        const samplesToUse = Math.min(frames, this.fpsHistory.length);
        const recentFrames = this.fpsHistory.slice(-samplesToUse);
        const sum = recentFrames.reduce((acc, fps) => acc + fps, 0);
        return sum / samplesToUse;
    }

    /**
     * Wait for FPS to stabilize, then measure average
     * @param stabilizationTime Time to wait for stabilization in ms (default: 1000)
     * @param measurementFrames Number of frames to measure after stabilization (default: 120)
     */
    async measureStableFPS(
        stabilizationTime = 1000,
        measurementFrames = 120
    ): Promise<number> {
        // Wait for stabilization
        await new Promise(resolve => setTimeout(resolve, stabilizationTime));

        // Clear history to get fresh measurement
        this.fpsHistory = [];

        // Wait until we have enough frames
        return new Promise((resolve) => {
            const checkFrames = () => {
                if (this.fpsHistory.length >= measurementFrames) {
                    resolve(this.getAverageFPS(measurementFrames));
                } else {
                    requestAnimationFrame(checkFrames);
                }
            };
            checkFrames();
        });
    }

    /**
     * Get complete FPS history
     */
    getFPSHistory(): number[] {
        return [...this.fpsHistory];
    }

    /**
     * Check if FPS is stable (variance < 10%)
     */
    isStable(): boolean {
        if (this.fpsHistory.length < 30) {
            return false; // Need enough samples
        }

        const stats = this.getStats();
        const varianceThreshold = stats.average * 0.1; // 10% of average
        return stats.variance < varianceThreshold;
    }

    /**
     * Get comprehensive FPS statistics
     */
    getStats(): FPSStats {
        if (this.fpsHistory.length === 0) {
            return {
                current: 0,
                average: 0,
                min: 0,
                max: 0,
                variance: 0,
                isStable: false,
            };
        }

        const current = this.getCurrentFPS();
        const average = this.getAverageFPS(this.fpsHistory.length);
        const min = Math.min(...this.fpsHistory);
        const max = Math.max(...this.fpsHistory);

        // Calculate variance
        const squaredDiffs = this.fpsHistory.map(fps => Math.pow(fps - average, 2));
        const variance = Math.sqrt(
            squaredDiffs.reduce((acc, val) => acc + val, 0) / this.fpsHistory.length
        );

        return {
            current,
            average,
            min,
            max,
            variance,
            isStable: this.isStable(),
        };
    }

    /**
     * Register callback for significant FPS changes
     */
    onSignificantChange(callback: FPSChangeCallback): () => void {
        this.changeCallbacks.push(callback);
        return () => {
            const index = this.changeCallbacks.indexOf(callback);
            if (index > -1) {
                this.changeCallbacks.splice(index, 1);
            }
        };
    }

    /**
     * Internal frame measurement loop
     */
    private measureFrame = (): void => {
        if (!this.isMonitoring) {
            return;
        }

        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastFrameTime;

        if (deltaTime > 0) {
            const fps = 1000 / deltaTime;
            const previousFPS = this.getCurrentFPS();

            // Add to history
            this.fpsHistory.push(fps);
            if (this.fpsHistory.length > this.maxHistorySize) {
                this.fpsHistory.shift();
            }

            // Check for significant changes
            if (previousFPS > 0) {
                const delta = Math.abs(fps - previousFPS);
                if (delta >= this.significantChangeThreshold) {
                    this.notifySignificantChange(previousFPS, fps);
                }
            }
        }

        this.lastFrameTime = currentTime;
        this.animationFrameId = requestAnimationFrame(this.measureFrame);
    };

    /**
     * Notify callbacks of significant FPS changes
     */
    private notifySignificantChange(previousFPS: number, currentFPS: number): void {
        const event: FPSChangeEvent = {
            previousFPS,
            currentFPS,
            delta: currentFPS - previousFPS,
            timestamp: performance.now(),
        };

        this.changeCallbacks.forEach(callback => {
            try {
                callback(event);
            } catch (error) {
                console.error('Error in FPS change callback:', error);
            }
        });
    }

    /**
     * Reset all monitoring data
     */
    reset(): void {
        this.fpsHistory = [];
        this.lastFrameTime = performance.now();
    }

    /**
     * Get diagnostic information
     */
    getDiagnostics(): {
        monitoring: boolean;
        historySize: number;
        stats: FPSStats;
        callbackCount: number;
    } {
        return {
            monitoring: this.isMonitoring,
            historySize: this.fpsHistory.length,
            stats: this.getStats(),
            callbackCount: this.changeCallbacks.length,
        };
    }
}
