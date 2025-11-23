/**
 * Performance Comparison and Testing System
 *
 * Automated performance testing framework for comparing different asset configurations
 * in the 3D scene. Measures FPS, memory usage, and provides recommendations for
 * optimization based on empirical data.
 *
 * @module PerformanceComparison
 */

import { PerformanceMetrics } from '../../types/debug';

/**
 * Performance test result for a specific configuration
 */
export interface PerformanceTestResult {
  /** Configuration name/description */
  name: string;

  /** Performance metrics after stabilization */
  metrics: PerformanceMetrics;

  /** Additional metadata about the test */
  metadata: {
    /** Timestamp when test was run */
    timestamp: number;

    /** Test duration in milliseconds */
    duration: number;

    /** Number of frames measured */
    frameCount: number;

    /** Assets enabled during this test */
    enabledAssets: string[];
  };
}

/**
 * Comparison between baseline and test configuration
 */
export interface PerformanceComparison {
  /** Test configuration name */
  name: string;

  /** Test results */
  result: PerformanceTestResult;

  /** Delta from baseline */
  delta: {
    fps: number;
    memory: number;
    frameTime: number;
  };

  /** Performance impact assessment */
  impact: 'minimal' | 'moderate' | 'significant' | 'severe';
}

/**
 * Full performance test report with recommendations
 */
export interface PerformanceTestReport {
  /** When the test suite was run */
  timestamp: number;

  /** Total test duration */
  totalDuration: number;

  /** Baseline performance (no assets) */
  baseline: PerformanceTestResult;

  /** Individual asset tests */
  individualTests: PerformanceComparison[];

  /** Asset combination tests */
  combinationTests: PerformanceComparison[];

  /** Full scene test */
  fullScene: PerformanceComparison;

  /** Performance recommendations */
  recommendations: PerformanceRecommendation[];
}

/**
 * Performance optimization recommendation
 */
export interface PerformanceRecommendation {
  /** Recommendation category */
  category: 'optimize' | 'safe' | 'budget' | 'combination';

  /** Priority level */
  priority: 'critical' | 'high' | 'medium' | 'low';

  /** Recommendation text */
  message: string;

  /** Supporting data */
  data?: any;
}

/**
 * Asset configuration for testing
 */
export interface AssetConfiguration {
  /** Configuration name */
  name: string;

  /** Assets to enable */
  assets: string[];

  /** Optional callback to enable assets */
  enableFn?: () => Promise<void>;

  /** Optional callback to disable assets */
  disableFn?: () => Promise<void>;
}

/**
 * Performance test options
 */
export interface TestOptions {
  /** Time to wait for stabilization (ms) */
  stabilizationTime?: number;

  /** Number of frames to measure */
  measurementFrames?: number;

  /** Number of measurement passes */
  measurementPasses?: number;

  /** Custom asset configurations */
  customConfigurations?: AssetConfiguration[];
}

/**
 * Performance metrics snapshot
 */
interface MetricsSnapshot {
  fps: number;
  memory: number;
  frameTime: number;
  timestamp: number;
}

/**
 * Automated Performance Test Runner
 *
 * Systematically tests different asset configurations and measures performance
 * impact. Generates comparison reports and optimization recommendations.
 */
export class PerformanceTestRunner {
  private options: Required<TestOptions>;
  private snapshots: MetricsSnapshot[] = [];

  constructor(options: TestOptions = {}) {
    this.options = {
      stabilizationTime: options.stabilizationTime ?? 3000,
      measurementFrames: options.measurementFrames ?? 60,
      measurementPasses: options.measurementPasses ?? 3,
      customConfigurations: options.customConfigurations ?? []
    };
  }

  /**
   * Run baseline test with no assets enabled
   */
  async runBaseline(): Promise<PerformanceMetrics> {
    console.log('📊 Running baseline performance test...');

    // Wait for stabilization
    await this.waitForStabilization();

    // Measure performance
    const metrics = await this.measurePerformance('Baseline');

    console.log(`✅ Baseline: FPS ${metrics.fps.toFixed(1)}, Memory ${metrics.memory.toFixed(1)}MB`);

    return metrics;
  }

  /**
   * Test each asset individually
   */
  async runIndividualAssetTests(): Promise<Map<string, PerformanceMetrics>> {
    console.log('🔍 Running individual asset tests...');

    const results = new Map<string, PerformanceMetrics>();
    const assetNames = this.getAvailableAssets();

    for (const assetName of assetNames) {
      console.log(`  Testing: ${assetName}...`);

      // Enable single asset
      await this.enableAsset(assetName);

      // Wait and measure
      await this.waitForStabilization();
      const metrics = await this.measurePerformance(assetName);

      results.set(assetName, metrics);

      // Disable asset
      await this.disableAsset(assetName);

      console.log(`    ✓ FPS ${metrics.fps.toFixed(1)}, Memory ${metrics.memory.toFixed(1)}MB`);
    }

    return results;
  }

  /**
   * Test asset combinations
   */
  async runCombinationTests(combinations: string[][]): Promise<PerformanceMetrics[]> {
    console.log('🔗 Running combination tests...');

    const results: PerformanceMetrics[] = [];

    for (let i = 0; i < combinations.length; i++) {
      const combo = combinations[i];
      console.log(`  Testing combination ${i + 1}/${combinations.length}: ${combo.join(' + ')}...`);

      // Enable all assets in combination
      for (const assetName of combo) {
        await this.enableAsset(assetName);
      }

      // Wait and measure
      await this.waitForStabilization();
      const metrics = await this.measurePerformance(combo.join(' + '));

      results.push(metrics);

      // Disable all assets
      for (const assetName of combo) {
        await this.disableAsset(assetName);
      }

      console.log(`    ✓ FPS ${metrics.fps.toFixed(1)}, Memory ${metrics.memory.toFixed(1)}MB`);
    }

    return results;
  }

  /**
   * Run full test suite
   */
  async runFullTestSuite(): Promise<PerformanceTestReport> {
    const startTime = Date.now();
    console.log('🚀 Starting full performance test suite...\n');

    // 1. Baseline test
    const baselineMetrics = await this.runBaseline();
    const baseline: PerformanceTestResult = {
      name: 'Baseline (Empty Scene)',
      metrics: baselineMetrics,
      metadata: {
        timestamp: Date.now(),
        duration: 0,
        frameCount: this.options.measurementFrames,
        enabledAssets: []
      }
    };

    console.log('\n');

    // 2. Individual asset tests
    const individualResults = await this.runIndividualAssetTests();
    const individualTests: PerformanceComparison[] = Array.from(individualResults.entries()).map(
      ([name, metrics]) => this.createComparison(name, metrics, [name], baseline.metrics)
    );

    console.log('\n');

    // 3. Test asset pairs (identify interaction costs)
    const assetNames = this.getAvailableAssets();
    const pairs = this.generateAssetPairs(assetNames);
    const pairResults = await this.runCombinationTests(pairs);
    const combinationTests: PerformanceComparison[] = pairResults.map((metrics, idx) =>
      this.createComparison(
        pairs[idx].join(' + '),
        metrics,
        pairs[idx],
        baseline.metrics
      )
    );

    console.log('\n');

    // 4. Full scene test
    console.log('🌍 Running full scene test...');
    for (const asset of assetNames) {
      await this.enableAsset(asset);
    }
    await this.waitForStabilization();
    const fullSceneMetrics = await this.measurePerformance('Full Scene');
    const fullScene = this.createComparison(
      'Full Scene',
      fullSceneMetrics,
      assetNames,
      baseline.metrics
    );

    // Disable all assets
    for (const asset of assetNames) {
      await this.disableAsset(asset);
    }

    console.log(`✅ Full scene: FPS ${fullSceneMetrics.fps.toFixed(1)}, Memory ${fullSceneMetrics.memory.toFixed(1)}MB\n`);

    // Generate recommendations
    const recommendations = this.generateRecommendations(
      baseline.metrics,
      individualTests,
      combinationTests,
      fullScene
    );

    const totalDuration = Date.now() - startTime;

    const report: PerformanceTestReport = {
      timestamp: startTime,
      totalDuration,
      baseline,
      individualTests,
      combinationTests,
      fullScene,
      recommendations
    };

    console.log('✨ Performance test suite completed!\n');
    this.printReport(report);

    return report;
  }

  /**
   * Wait for scene stabilization
   */
  private async waitForStabilization(): Promise<void> {
    return new Promise(resolve => {
      setTimeout(resolve, this.options.stabilizationTime);
    });
  }

  /**
   * Measure performance over multiple frames and passes
   */
  private async measurePerformance(label: string): Promise<PerformanceMetrics> {
    const allMeasurements: PerformanceMetrics[] = [];

    for (let pass = 0; pass < this.options.measurementPasses; pass++) {
      const frames: MetricsSnapshot[] = [];

      // Measure frames
      for (let i = 0; i < this.options.measurementFrames; i++) {
        await this.waitForFrame();
        frames.push(this.captureMetrics());
      }

      // Calculate average for this pass
      const avgMetrics = this.calculateAverageMetrics(frames);
      allMeasurements.push(avgMetrics);

      // Small delay between passes
      if (pass < this.options.measurementPasses - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    // Return median of all passes to reduce outliers
    return this.calculateMedianMetrics(allMeasurements);
  }

  /**
   * Wait for next animation frame
   */
  private waitForFrame(): Promise<void> {
    return new Promise(resolve => {
      requestAnimationFrame(() => resolve());
    });
  }

  /**
   * Capture current performance metrics
   */
  private captureMetrics(): MetricsSnapshot {
    const now = performance.now();

    // Calculate FPS from last snapshot
    let fps = 60; // Default
    if (this.snapshots.length > 0) {
      const lastSnapshot = this.snapshots[this.snapshots.length - 1];
      const deltaTime = now - lastSnapshot.timestamp;
      fps = deltaTime > 0 ? 1000 / deltaTime : 60;
    }

    // Get memory usage
    const memory = (performance as any).memory
      ? (performance as any).memory.usedJSHeapSize / (1024 * 1024)
      : 0;

    const snapshot: MetricsSnapshot = {
      fps,
      memory,
      frameTime: 1000 / fps,
      timestamp: now
    };

    this.snapshots.push(snapshot);

    return snapshot;
  }

  /**
   * Calculate average metrics from snapshots
   */
  private calculateAverageMetrics(snapshots: MetricsSnapshot[]): PerformanceMetrics {
    const sum = snapshots.reduce(
      (acc, s) => ({
        fps: acc.fps + s.fps,
        memory: acc.memory + s.memory,
        frameTime: acc.frameTime + s.frameTime
      }),
      { fps: 0, memory: 0, frameTime: 0 }
    );

    const count = snapshots.length;

    return {
      fps: sum.fps / count,
      memory: sum.memory / count,
      frameTime: sum.frameTime / count,
      webglContextLost: false
    };
  }

  /**
   * Calculate median metrics to reduce outliers
   */
  private calculateMedianMetrics(measurements: PerformanceMetrics[]): PerformanceMetrics {
    const sorted = {
      fps: measurements.map(m => m.fps).sort((a, b) => a - b),
      memory: measurements.map(m => m.memory).sort((a, b) => a - b),
      frameTime: measurements.map(m => m.frameTime).sort((a, b) => a - b)
    };

    const midIdx = Math.floor(measurements.length / 2);

    return {
      fps: sorted.fps[midIdx],
      memory: sorted.memory[midIdx],
      frameTime: sorted.frameTime[midIdx],
      webglContextLost: false
    };
  }

  /**
   * Create performance comparison
   */
  private createComparison(
    name: string,
    metrics: PerformanceMetrics,
    assets: string[],
    baseline: PerformanceMetrics
  ): PerformanceComparison {
    const delta = {
      fps: metrics.fps - baseline.fps,
      memory: metrics.memory - baseline.memory,
      frameTime: metrics.frameTime - baseline.frameTime
    };

    // Determine impact level
    let impact: PerformanceComparison['impact'] = 'minimal';
    const fpsLoss = Math.abs(delta.fps);

    if (fpsLoss > 20) {
      impact = 'severe';
    } else if (fpsLoss > 10) {
      impact = 'significant';
    } else if (fpsLoss > 5) {
      impact = 'moderate';
    }

    return {
      name,
      result: {
        name,
        metrics,
        metadata: {
          timestamp: Date.now(),
          duration: 0,
          frameCount: this.options.measurementFrames,
          enabledAssets: assets
        }
      },
      delta,
      impact
    };
  }

  /**
   * Generate asset pairs for combination testing
   */
  private generateAssetPairs(assets: string[]): string[][] {
    const pairs: string[][] = [];

    for (let i = 0; i < assets.length; i++) {
      for (let j = i + 1; j < assets.length; j++) {
        pairs.push([assets[i], assets[j]]);
      }
    }

    return pairs;
  }

  /**
   * Generate optimization recommendations
   */
  private generateRecommendations(
    baseline: PerformanceMetrics,
    individualTests: PerformanceComparison[],
    combinationTests: PerformanceComparison[],
    fullScene: PerformanceComparison
  ): PerformanceRecommendation[] {
    const recommendations: PerformanceRecommendation[] = [];

    // Find assets with biggest performance cost
    const highCostAssets = individualTests
      .filter(t => t.impact === 'severe' || t.impact === 'significant')
      .sort((a, b) => b.delta.fps - a.delta.fps);

    if (highCostAssets.length > 0) {
      recommendations.push({
        category: 'optimize',
        priority: 'critical',
        message: `Assets requiring optimization: ${highCostAssets.map(a => a.name).join(', ')}`,
        data: { assets: highCostAssets }
      });
    }

    // Find safe combinations
    const safeCombos = combinationTests.filter(t => t.impact === 'minimal');
    if (safeCombos.length > 0) {
      recommendations.push({
        category: 'safe',
        priority: 'low',
        message: `Safe asset combinations with minimal performance impact: ${safeCombos.slice(0, 3).map(c => c.name).join(', ')}`,
        data: { combinations: safeCombos }
      });
    }

    // Performance budget allocation
    const totalFpsLoss = Math.abs(fullScene.delta.fps);
    const budgetPerAsset = totalFpsLoss / individualTests.length;

    recommendations.push({
      category: 'budget',
      priority: 'high',
      message: `Performance budget: ${budgetPerAsset.toFixed(1)} FPS per asset on average`,
      data: {
        totalBudget: totalFpsLoss,
        perAssetBudget: budgetPerAsset,
        exceedingBudget: individualTests.filter(t => Math.abs(t.delta.fps) > budgetPerAsset * 1.5)
      }
    });

    // Target FPS analysis
    if (fullScene.result.metrics.fps < 30) {
      recommendations.push({
        category: 'optimize',
        priority: 'critical',
        message: 'Full scene FPS below 30 - critical optimization needed',
        data: { currentFps: fullScene.result.metrics.fps }
      });
    } else if (fullScene.result.metrics.fps < 45) {
      recommendations.push({
        category: 'optimize',
        priority: 'high',
        message: 'Full scene FPS below 45 - optimization recommended',
        data: { currentFps: fullScene.result.metrics.fps }
      });
    }

    return recommendations;
  }

  /**
   * Print formatted report to console
   */
  private printReport(report: PerformanceTestReport): void {
    console.log('═══════════════════════════════════════════════════════');
    console.log('          PERFORMANCE COMPARISON REPORT');
    console.log('═══════════════════════════════════════════════════════\n');

    // Baseline
    console.log('📊 BASELINE');
    console.log('───────────────────────────────────────────────────────');
    this.printMetrics(report.baseline.metrics);
    console.log('');

    // Individual tests
    console.log('🔍 INDIVIDUAL ASSET PERFORMANCE');
    console.log('───────────────────────────────────────────────────────');
    for (const test of report.individualTests) {
      this.printComparison(test, report.baseline.metrics);
    }
    console.log('');

    // Full scene
    console.log('🌍 FULL SCENE PERFORMANCE');
    console.log('───────────────────────────────────────────────────────');
    this.printComparison(report.fullScene, report.baseline.metrics);
    console.log('');

    // Recommendations
    console.log('💡 RECOMMENDATIONS');
    console.log('───────────────────────────────────────────────────────');
    for (const rec of report.recommendations) {
      const icon = rec.priority === 'critical' ? '🚨' : rec.priority === 'high' ? '⚠️' : 'ℹ️';
      console.log(`${icon} [${rec.priority.toUpperCase()}] ${rec.message}`);
    }
    console.log('');

    console.log('═══════════════════════════════════════════════════════');
    console.log(`Test duration: ${(report.totalDuration / 1000).toFixed(1)}s`);
    console.log('═══════════════════════════════════════════════════════\n');
  }

  /**
   * Print performance metrics
   */
  private printMetrics(metrics: PerformanceMetrics): void {
    console.log(`  FPS:       ${metrics.fps.toFixed(1)}`);
    console.log(`  Memory:    ${metrics.memory.toFixed(1)} MB`);
    console.log(`  Frame Time: ${metrics.frameTime.toFixed(2)} ms`);
  }

  /**
   * Print performance comparison
   */
  private printComparison(comparison: PerformanceComparison, baseline: PerformanceMetrics): void {
    const { name, result, delta, impact } = comparison;

    // Impact indicator
    const indicator = impact === 'severe' ? '🔴' :
                     impact === 'significant' ? '🟠' :
                     impact === 'moderate' ? '🟡' : '🟢';

    console.log(`${indicator} ${name}`);
    console.log(`  FPS:    ${result.metrics.fps.toFixed(1)} (Δ ${this.formatDelta(delta.fps)} FPS)`);
    console.log(`  Memory: ${result.metrics.memory.toFixed(1)} MB (Δ ${this.formatDelta(delta.memory)} MB)`);
    console.log(`  Impact: ${impact.toUpperCase()}`);
    console.log('');
  }

  /**
   * Format delta value with sign
   */
  private formatDelta(value: number): string {
    return value >= 0 ? `+${value.toFixed(1)}` : value.toFixed(1);
  }

  /**
   * Get list of available assets (mock implementation)
   * Override this method with actual asset detection
   */
  protected getAvailableAssets(): string[] {
    // This should be overridden with actual asset detection
    return [
      'Courts',
      'Grass',
      'Lighting',
      'Reception',
      'Parking',
      'Hydroponics',
      'Mechanical',
      'Weather'
    ];
  }

  /**
   * Enable asset (mock implementation)
   * Override with actual asset enabling logic
   */
  protected async enableAsset(name: string): Promise<void> {
    // Mock implementation - override in subclass
    console.log(`  [Mock] Enabling asset: ${name}`);
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  /**
   * Disable asset (mock implementation)
   * Override with actual asset disabling logic
   */
  protected async disableAsset(name: string): Promise<void> {
    // Mock implementation - override in subclass
    console.log(`  [Mock] Disabling asset: ${name}`);
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

/**
 * Generate comparison table string
 */
export function generateComparisonTable(report: PerformanceTestReport): string {
  const lines: string[] = [];

  lines.push('Asset Performance Comparison');
  lines.push('============================');
  lines.push('');

  // Baseline
  const baseline = report.baseline.metrics;
  lines.push(`Baseline:     FPS: ${baseline.fps.toFixed(1).padEnd(6)} Memory: ${baseline.memory.toFixed(1).padEnd(6)}MB`);

  // Individual tests
  for (const test of report.individualTests) {
    const { name, result, delta, impact } = test;
    const indicator = impact === 'severe' || impact === 'significant' ? '⚠️ ' : '   ';

    lines.push(
      `+ ${name.padEnd(15)} FPS: ${result.metrics.fps.toFixed(1).padEnd(6)} ` +
      `Memory: ${result.metrics.memory.toFixed(1).padEnd(6)}MB ` +
      `(Δ ${delta.fps >= 0 ? '+' : ''}${delta.fps.toFixed(1)} FPS, ` +
      `${delta.memory >= 0 ? '+' : ''}${delta.memory.toFixed(1)}MB) ${indicator}`
    );
  }

  lines.push('');

  // Full scene
  const fullScene = report.fullScene;
  lines.push(
    `Full Scene:   FPS: ${fullScene.result.metrics.fps.toFixed(1).padEnd(6)} ` +
    `Memory: ${fullScene.result.metrics.memory.toFixed(1).padEnd(6)}MB ` +
    `(Δ ${fullScene.delta.fps >= 0 ? '+' : ''}${fullScene.delta.fps.toFixed(1)} FPS, ` +
    `${fullScene.delta.memory >= 0 ? '+' : ''}${fullScene.delta.memory.toFixed(1)}MB)`
  );

  return lines.join('\n');
}

/**
 * Export report to JSON
 */
export function exportReportJSON(report: PerformanceTestReport): string {
  return JSON.stringify(report, null, 2);
}

/**
 * Save report to localStorage
 */
export function saveReportToStorage(report: PerformanceTestReport, key: string = 'performance-report'): void {
  try {
    localStorage.setItem(key, exportReportJSON(report));
    console.log(`✅ Report saved to localStorage: ${key}`);
  } catch (error) {
    console.error('❌ Failed to save report:', error);
  }
}

/**
 * Load report from localStorage
 */
export function loadReportFromStorage(key: string = 'performance-report'): PerformanceTestReport | null {
  try {
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data) as PerformanceTestReport;
    }
  } catch (error) {
    console.error('❌ Failed to load report:', error);
  }
  return null;
}
