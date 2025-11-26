/**
 * Performance Tracker for Per-Asset Monitoring
 *
 * Provides comprehensive performance tracking including:
 * - FPS monitoring
 * - Memory usage tracking
 * - Per-asset render time
 * - Baseline comparison
 * - Performance delta analysis
 * - GPU metrics (when available)
 */

/**
 * Core performance metrics
 */
export interface PerformanceMetrics {
  /** Frames per second */
  fps: number;

  /** JavaScript heap memory usage (MB) */
  memory: number;

  /** Time to render last frame (ms) */
  frameTime: number;

  /** Whether WebGL context is currently lost */
  webglContextLost: boolean;

  /** GPU metrics (if available) */
  gpu?: {
    renderer: string;
    vendor: string;
    maxTextureSize: number;
    drawCallsPerFrame?: number;
    trianglesPerFrame?: number;
  };
}

/**
 * Performance delta comparison
 */
export interface PerformanceDelta {
  /** FPS change (absolute) */
  fpsDelta: number;

  /** FPS change (percentage) */
  fpsChangePercent: number;

  /** Memory change (MB) */
  memoryDelta: number;

  /** Memory change (percentage) */
  memoryChangePercent: number;

  /** Frame time change (ms) */
  frameTimeDelta: number;

  /** Frame time change (percentage) */
  frameTimeChangePercent: number;

  /** Overall performance impact score (-100 to 100) */
  impactScore: number;
}

/**
 * Per-asset performance metrics
 */
export interface AssetPerformanceMetrics {
  /** Asset identifier */
  id: string;

  /** Asset name */
  name: string;

  /** Whether asset is currently enabled */
  enabled: boolean;

  /** Current performance metrics */
  metrics: PerformanceMetrics;

  /** Delta from baseline */
  delta: PerformanceDelta;

  /** Performance cost rank (1 = most expensive) */
  rank: number;

  /** Render time for this asset (ms) */
  renderTime: number;

  /** Memory allocated to this asset (MB) */
  memoryAllocation: number;
}

/**
 * Complete performance report
 */
export interface PerformanceReport {
  /** Report timestamp */
  timestamp: string;

  /** Baseline metrics (no assets enabled) */
  baseline: PerformanceMetrics;

  /** Current overall metrics */
  current: PerformanceMetrics;

  /** Per-asset breakdown */
  assets: AssetPerformanceMetrics[];

  /** Performance recommendations */
  recommendations: string[];

  /** System information */
  system: {
    userAgent: string;
    platform: string;
    cores: number;
    deviceMemory?: number;
  };
}

/**
 * FPS tracking data
 */
interface FPSTracker {
  frameCount: number;
  lastTime: number;
  lastFrameTime: number;
  fpsHistory: number[];
  currentFPS: number;
  instantFPS: number;
  fpsBuffer: number[];
}

/**
 * Render timer data
 */
interface RenderTimer {
  startTime: number;
  endTime?: number;
  duration?: number;
}

/**
 * Performance Tracker Class
 *
 * Main class for tracking and analyzing performance metrics
 */
export class PerformanceTracker {
  private baseline: PerformanceMetrics | null = null;
  private fpsTracker: FPSTracker;
  private renderTimers: Map<string, RenderTimer> = new Map();
  private assetMetrics: Map<string, AssetPerformanceMetrics> = new Map();
  private animationFrameId: number | null = null;
  private memoryCheckInterval: NodeJS.Timeout | null = null;
  private webglContext: WebGLRenderingContext | null = null;
  private gpuInfo: PerformanceMetrics['gpu'] | null = null;

  constructor() {
    this.fpsTracker = {
      frameCount: 0,
      lastTime: performance.now(),
      lastFrameTime: performance.now(),
      fpsHistory: [],
      currentFPS: 0,
      instantFPS: 0,
      fpsBuffer: []
    };

    // Start FPS tracking
    this.startFPSTracking();

    // Start memory tracking
    this.startMemoryTracking();

    // Detect GPU info
    this.detectGPUInfo();
  }

  /**
   * Start FPS tracking using requestAnimationFrame
   * Uses per-frame timing for accurate high-refresh rate monitoring
   */
  private startFPSTracking(): void {
    const trackFrame = () => {
      const now = performance.now();

      // Per-frame timing for accurate FPS calculation
      const frameDelta = now - this.fpsTracker.lastFrameTime;
      this.fpsTracker.lastFrameTime = now;

      // Calculate instant FPS from frame delta (avoid division by zero)
      if (frameDelta > 0) {
        this.fpsTracker.instantFPS = Math.round(1000 / frameDelta);

        // Add to rolling buffer for smoothed average
        this.fpsTracker.fpsBuffer.push(this.fpsTracker.instantFPS);

        // Keep buffer at 10 frames for smooth average (updates ~60x/sec at 60fps)
        if (this.fpsTracker.fpsBuffer.length > 10) {
          this.fpsTracker.fpsBuffer.shift();
        }

        // Calculate smoothed FPS from buffer
        const sum = this.fpsTracker.fpsBuffer.reduce((a, b) => a + b, 0);
        this.fpsTracker.currentFPS = Math.round(sum / this.fpsTracker.fpsBuffer.length);
      }

      this.fpsTracker.frameCount++;
      const delta = now - this.fpsTracker.lastTime;

      // Update history every 100ms for responsive graphs (10x faster than before)
      if (delta >= 100) {
        this.fpsTracker.fpsHistory.push(this.fpsTracker.currentFPS);

        // Keep last 300 samples (30 seconds at 100ms intervals)
        if (this.fpsTracker.fpsHistory.length > 300) {
          this.fpsTracker.fpsHistory.shift();
        }

        this.fpsTracker.frameCount = 0;
        this.fpsTracker.lastTime = now;
      }

      this.animationFrameId = requestAnimationFrame(trackFrame);
    };

    this.animationFrameId = requestAnimationFrame(trackFrame);
  }

  /**
   * Start memory usage tracking
   */
  private startMemoryTracking(): void {
    this.memoryCheckInterval = setInterval(() => {
      // Memory tracking happens via getMemoryUsage()
    }, 1000);
  }

  /**
   * Detect GPU information from WebGL context
   */
  private detectGPUInfo(): void {
    try {
      const canvas = document.createElement('canvas');
      const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;

      if (!gl) return;

      this.webglContext = gl;

      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');

      this.gpuInfo = {
        renderer: debugInfo
          ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
          : 'Unknown',
        vendor: debugInfo
          ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
          : 'Unknown',
        maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE)
      };
    } catch (error) {
      console.warn('Failed to detect GPU info:', error);
    }
  }

  /**
   * Track current FPS (smoothed average over last 10 frames)
   */
  public trackFPS(): number {
    return this.fpsTracker.currentFPS;
  }

  /**
   * Get instant FPS (per-frame calculation, more responsive)
   */
  public getInstantFPS(): number {
    return this.fpsTracker.instantFPS;
  }

  /**
   * Get average FPS over specified duration (seconds)
   * @param duration Duration in seconds (default: 5)
   */
  public getAverageFPS(duration: number = 5): number {
    const samples = Math.min(duration, this.fpsTracker.fpsHistory.length);
    if (samples === 0) return 0;

    const recentSamples = this.fpsTracker.fpsHistory.slice(-samples);
    const sum = recentSamples.reduce((acc, fps) => acc + fps, 0);

    return Math.round(sum / samples);
  }

  /**
   * Get current memory usage in MB
   */
  public getMemoryUsage(): number {
    if ('memory' in performance && (performance as any).memory) {
      const memoryInfo = (performance as any).memory;
      return Math.round(memoryInfo.usedJSHeapSize / 1048576); // Convert to MB
    }
    return 0;
  }

  /**
   * Track memory delta for a specific asset
   * Call before and after enabling asset to measure impact
   */
  public trackMemoryDelta(assetId: string): number {
    const currentMemory = this.getMemoryUsage();

    const asset = this.assetMetrics.get(assetId);
    if (!asset) {
      // First measurement - store baseline
      this.assetMetrics.set(assetId, {
        id: assetId,
        name: assetId,
        enabled: false,
        metrics: this.getCurrentMetrics(),
        delta: this.createEmptyDelta(),
        rank: 0,
        renderTime: 0,
        memoryAllocation: currentMemory
      });
      return 0;
    }

    // Calculate delta
    const memoryDelta = currentMemory - asset.memoryAllocation;
    asset.memoryAllocation = currentMemory;

    return memoryDelta;
  }

  /**
   * Start render timer for an asset
   */
  public startRenderTimer(assetId: string): void {
    this.renderTimers.set(assetId, {
      startTime: performance.now()
    });
  }

  /**
   * End render timer for an asset and return duration
   */
  public endRenderTimer(assetId: string): number {
    const timer = this.renderTimers.get(assetId);

    if (!timer) {
      console.warn(`No render timer found for asset: ${assetId}`);
      return 0;
    }

    const endTime = performance.now();
    const duration = endTime - timer.startTime;

    timer.endTime = endTime;
    timer.duration = duration;

    // Update asset metrics
    const asset = this.assetMetrics.get(assetId);
    if (asset) {
      asset.renderTime = duration;
    }

    return duration;
  }

  /**
   * Set performance baseline (typically with no assets enabled)
   */
  public setBaseline(metrics?: PerformanceMetrics): void {
    this.baseline = metrics || this.getCurrentMetrics();
    console.log('Performance baseline set:', this.baseline);
  }

  /**
   * Compare current metrics to baseline
   */
  public compareToBaseline(current: PerformanceMetrics): PerformanceDelta {
    if (!this.baseline) {
      console.warn('No baseline set. Call setBaseline() first.');
      return this.createEmptyDelta();
    }

    return this.calculateDelta(this.baseline, current);
  }

  /**
   * Get current performance metrics
   */
  public getCurrentMetrics(): PerformanceMetrics {
    return {
      fps: this.trackFPS(),
      memory: this.getMemoryUsage(),
      frameTime: this.getAverageFrameTime(),
      webglContextLost: this.isWebGLContextLost(),
      gpu: this.gpuInfo || undefined
    };
  }

  /**
   * Get average frame time from FPS
   */
  private getAverageFrameTime(): number {
    const fps = this.trackFPS();
    return fps > 0 ? 1000 / fps : 0;
  }

  /**
   * Check if WebGL context is lost
   */
  private isWebGLContextLost(): boolean {
    if (!this.webglContext) return false;
    return this.webglContext.isContextLost();
  }

  /**
   * Calculate performance delta between two metrics
   */
  private calculateDelta(baseline: PerformanceMetrics, current: PerformanceMetrics): PerformanceDelta {
    const fpsDelta = current.fps - baseline.fps;
    const fpsChangePercent = baseline.fps > 0
      ? (fpsDelta / baseline.fps) * 100
      : 0;

    const memoryDelta = current.memory - baseline.memory;
    const memoryChangePercent = baseline.memory > 0
      ? (memoryDelta / baseline.memory) * 100
      : 0;

    const frameTimeDelta = current.frameTime - baseline.frameTime;
    const frameTimeChangePercent = baseline.frameTime > 0
      ? (frameTimeDelta / baseline.frameTime) * 100
      : 0;

    // Calculate impact score (-100 to 100)
    // Negative FPS change is bad, positive memory/frameTime change is bad
    const fpsImpact = fpsChangePercent;
    const memoryImpact = -memoryChangePercent / 2; // Memory less critical
    const frameTimeImpact = -frameTimeChangePercent;

    const impactScore = Math.max(-100, Math.min(100,
      (fpsImpact + memoryImpact + frameTimeImpact) / 3
    ));

    return {
      fpsDelta,
      fpsChangePercent,
      memoryDelta,
      memoryChangePercent,
      frameTimeDelta,
      frameTimeChangePercent,
      impactScore
    };
  }

  /**
   * Create empty delta (for initialization)
   */
  private createEmptyDelta(): PerformanceDelta {
    return {
      fpsDelta: 0,
      fpsChangePercent: 0,
      memoryDelta: 0,
      memoryChangePercent: 0,
      frameTimeDelta: 0,
      frameTimeChangePercent: 0,
      impactScore: 0
    };
  }

  /**
   * Update asset metrics
   */
  public updateAssetMetrics(assetId: string, name: string, enabled: boolean): void {
    const current = this.getCurrentMetrics();
    const delta = this.baseline
      ? this.calculateDelta(this.baseline, current)
      : this.createEmptyDelta();

    const existingAsset = this.assetMetrics.get(assetId);
    const renderTime = existingAsset?.renderTime || 0;
    const memoryAllocation = existingAsset?.memoryAllocation || current.memory;

    this.assetMetrics.set(assetId, {
      id: assetId,
      name,
      enabled,
      metrics: current,
      delta,
      rank: 0, // Will be calculated in generateReport
      renderTime,
      memoryAllocation
    });
  }

  /**
   * Generate comprehensive performance report
   */
  public generateReport(): PerformanceReport {
    const current = this.getCurrentMetrics();
    const assets = Array.from(this.assetMetrics.values());

    // Rank assets by performance impact (worst first)
    const rankedAssets = assets
      .sort((a, b) => a.delta.impactScore - b.delta.impactScore)
      .map((asset, index) => ({
        ...asset,
        rank: index + 1
      }));

    // Generate recommendations
    const recommendations = this.generateRecommendations(rankedAssets, current);

    // Get system information
    const system = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      cores: navigator.hardwareConcurrency || 0,
      deviceMemory: (navigator as any).deviceMemory
    };

    return {
      timestamp: new Date().toISOString(),
      baseline: this.baseline || this.createEmptyMetrics(),
      current,
      assets: rankedAssets,
      recommendations,
      system
    };
  }

  /**
   * Generate performance recommendations
   */
  private generateRecommendations(
    assets: AssetPerformanceMetrics[],
    current: PerformanceMetrics
  ): string[] {
    const recommendations: string[] = [];

    // Check overall FPS
    if (current.fps < 30) {
      recommendations.push('⚠️ Critical: FPS below 30. Consider disabling expensive assets.');
    } else if (current.fps < 50) {
      recommendations.push('⚠️ Warning: FPS below 50. Performance optimization recommended.');
    }

    // Check memory usage
    if (current.memory > 500) {
      recommendations.push('⚠️ High memory usage detected (>500MB). Consider reducing asset quality.');
    }

    // Check WebGL context
    if (current.webglContextLost) {
      recommendations.push('🚨 Critical: WebGL context lost. Reduce GPU load immediately.');
    }

    // Identify expensive assets
    const expensiveAssets = assets
      .filter(a => a.enabled && a.delta.impactScore < -10)
      .slice(0, 3);

    if (expensiveAssets.length > 0) {
      recommendations.push(
        `💰 Top expensive assets: ${expensiveAssets.map(a => a.name).join(', ')}`
      );
    }

    // Check render times
    const slowRenderAssets = assets
      .filter(a => a.enabled && a.renderTime > 16.67) // More than 1 frame at 60fps
      .slice(0, 3);

    if (slowRenderAssets.length > 0) {
      recommendations.push(
        `🐌 Slow render times: ${slowRenderAssets.map(a => `${a.name} (${a.renderTime.toFixed(2)}ms)`).join(', ')}`
      );
    }

    // Baseline comparison
    if (this.baseline) {
      const baselineDelta = this.calculateDelta(this.baseline, current);

      if (baselineDelta.fpsChangePercent < -20) {
        recommendations.push(`📉 FPS dropped ${Math.abs(baselineDelta.fpsChangePercent).toFixed(1)}% from baseline`);
      }

      if (baselineDelta.memoryChangePercent > 50) {
        recommendations.push(`📈 Memory increased ${baselineDelta.memoryChangePercent.toFixed(1)}% from baseline`);
      }
    }

    if (recommendations.length === 0) {
      recommendations.push('✅ Performance is optimal');
    }

    return recommendations;
  }

  /**
   * Create empty metrics (for initialization)
   */
  private createEmptyMetrics(): PerformanceMetrics {
    return {
      fps: 0,
      memory: 0,
      frameTime: 0,
      webglContextLost: false
    };
  }

  /**
   * Export report as JSON
   */
  public exportReport(): string {
    const report = this.generateReport();
    return JSON.stringify(report, null, 2);
  }

  /**
   * Download report as JSON file
   */
  public downloadReport(): void {
    const report = this.exportReport();
    const blob = new Blob([report], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-report-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Clean up resources
   */
  public dispose(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    if (this.memoryCheckInterval !== null) {
      clearInterval(this.memoryCheckInterval);
    }

    this.renderTimers.clear();
    this.assetMetrics.clear();
  }
}

/**
 * Create singleton instance for easy access
 */
let globalTracker: PerformanceTracker | null = null;

/**
 * Get or create global performance tracker instance
 */
export function getPerformanceTracker(): PerformanceTracker {
  if (!globalTracker) {
    globalTracker = new PerformanceTracker();
  }
  return globalTracker;
}

/**
 * Dispose global performance tracker
 */
export function disposePerformanceTracker(): void {
  if (globalTracker) {
    globalTracker.dispose();
    globalTracker = null;
  }
}

export default PerformanceTracker;
