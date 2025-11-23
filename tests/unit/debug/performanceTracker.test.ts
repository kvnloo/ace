/**
 * Unit Tests for PerformanceTracker
 *
 * Tests FPS tracking, memory monitoring, render timers,
 * baseline comparisons, delta calculations, and report generation.
 */

import { PerformanceTracker, PerformanceMetrics } from '@/utils/debug/performanceTracker';

// Mock performance.now()
const mockNow = jest.fn();
global.performance.now = mockNow;

// Mock requestAnimationFrame
let rafCallback: FrameRequestCallback | null = null;
global.requestAnimationFrame = jest.fn((cb) => {
  rafCallback = cb;
  return 1;
});

global.cancelAnimationFrame = jest.fn();

// Mock performance.memory
Object.defineProperty(global.performance, 'memory', {
  writable: true,
  value: {
    usedJSHeapSize: 50 * 1048576, // 50MB
    totalJSHeapSize: 100 * 1048576,
    jsHeapSizeLimit: 200 * 1048576
  }
});

describe('PerformanceTracker', () => {
  let tracker: PerformanceTracker;
  let currentTime = 0;

  beforeEach(() => {
    currentTime = 0;
    mockNow.mockImplementation(() => currentTime);
    tracker = new PerformanceTracker();
  });

  afterEach(() => {
    tracker.dispose();
    jest.clearAllMocks();
  });

  describe('FPS Tracking', () => {
    it('should start FPS tracking on initialization', () => {
      expect(requestAnimationFrame).toHaveBeenCalled();
    });

    it('should calculate FPS based on frame count', () => {
      // Simulate 60 frames in 1 second
      for (let i = 0; i < 60; i++) {
        currentTime += 16.67; // ~60fps
        if (rafCallback) rafCallback(currentTime);
      }

      currentTime += 1000; // Complete 1 second
      if (rafCallback) rafCallback(currentTime);

      const fps = tracker.trackFPS();
      expect(fps).toBeGreaterThan(0);
      expect(fps).toBeLessThanOrEqual(60);
    });

    it('should calculate average FPS over specified duration', () => {
      // Simulate multiple seconds of frames
      for (let second = 0; second < 5; second++) {
        for (let frame = 0; frame < 60; frame++) {
          currentTime += 16.67;
          if (rafCallback) rafCallback(currentTime);
        }
        currentTime = (second + 1) * 1000;
        if (rafCallback) rafCallback(currentTime);
      }

      const avgFPS = tracker.getAverageFPS(3);
      expect(avgFPS).toBeGreaterThan(0);
      expect(avgFPS).toBeLessThanOrEqual(60);
    });

    it('should handle zero duration for average FPS', () => {
      const avgFPS = tracker.getAverageFPS(0);
      expect(avgFPS).toBe(0);
    });
  });

  describe('Memory Tracking', () => {
    it('should get current memory usage in MB', () => {
      const memory = tracker.getMemoryUsage();
      expect(memory).toBe(50); // 50MB from mock
    });

    it('should track memory delta for assets', () => {
      const initialDelta = tracker.trackMemoryDelta('test-asset');
      expect(initialDelta).toBe(0); // First measurement

      // Simulate memory increase
      (global.performance as any).memory.usedJSHeapSize = 60 * 1048576; // 60MB

      const delta = tracker.trackMemoryDelta('test-asset');
      expect(delta).toBe(10); // 60 - 50 = 10MB
    });

    it('should handle missing performance.memory gracefully', () => {
      // Remove memory API
      const originalMemory = (global.performance as any).memory;
      delete (global.performance as any).memory;

      const memory = tracker.getMemoryUsage();
      expect(memory).toBe(0);

      // Restore
      (global.performance as any).memory = originalMemory;
    });
  });

  describe('Render Timers', () => {
    it('should start and end render timer', () => {
      currentTime = 1000;
      tracker.startRenderTimer('asset-1');

      currentTime = 1016.67; // 16.67ms later
      const duration = tracker.endRenderTimer('asset-1');

      expect(duration).toBeCloseTo(16.67, 1);
    });

    it('should return 0 for non-existent timer', () => {
      const duration = tracker.endRenderTimer('non-existent');
      expect(duration).toBe(0);
    });

    it('should track multiple asset render times', () => {
      currentTime = 1000;
      tracker.startRenderTimer('asset-1');
      tracker.startRenderTimer('asset-2');

      currentTime = 1010;
      const duration1 = tracker.endRenderTimer('asset-1');

      currentTime = 1020;
      const duration2 = tracker.endRenderTimer('asset-2');

      expect(duration1).toBeCloseTo(10, 1);
      expect(duration2).toBeCloseTo(20, 1);
    });
  });

  describe('Baseline and Delta Calculations', () => {
    it('should set performance baseline', () => {
      const baselineMetrics: PerformanceMetrics = {
        fps: 60,
        memory: 50,
        frameTime: 16.67,
        webglContextLost: false
      };

      tracker.setBaseline(baselineMetrics);

      const current = tracker.getCurrentMetrics();
      const delta = tracker.compareToBaseline(current);

      expect(delta).toBeDefined();
      expect(delta.fpsDelta).toBeDefined();
      expect(delta.memoryDelta).toBeDefined();
    });

    it('should calculate FPS delta correctly', () => {
      tracker.setBaseline({
        fps: 60,
        memory: 50,
        frameTime: 16.67,
        webglContextLost: false
      });

      const current: PerformanceMetrics = {
        fps: 50,
        memory: 50,
        frameTime: 20,
        webglContextLost: false
      };

      const delta = tracker.compareToBaseline(current);

      expect(delta.fpsDelta).toBe(-10); // 50 - 60
      expect(delta.fpsChangePercent).toBeCloseTo(-16.67, 1); // -10/60 * 100
    });

    it('should calculate memory delta correctly', () => {
      tracker.setBaseline({
        fps: 60,
        memory: 50,
        frameTime: 16.67,
        webglContextLost: false
      });

      const current: PerformanceMetrics = {
        fps: 60,
        memory: 75,
        frameTime: 16.67,
        webglContextLost: false
      };

      const delta = tracker.compareToBaseline(current);

      expect(delta.memoryDelta).toBe(25); // 75 - 50
      expect(delta.memoryChangePercent).toBe(50); // 25/50 * 100
    });

    it('should calculate impact score', () => {
      tracker.setBaseline({
        fps: 60,
        memory: 50,
        frameTime: 16.67,
        webglContextLost: false
      });

      // Bad performance: lower FPS, higher memory, higher frame time
      const badCurrent: PerformanceMetrics = {
        fps: 30,
        memory: 100,
        frameTime: 33.34,
        webglContextLost: false
      };

      const badDelta = tracker.compareToBaseline(badCurrent);
      expect(badDelta.impactScore).toBeLessThan(0); // Negative impact

      // Good performance: same or better
      const goodCurrent: PerformanceMetrics = {
        fps: 60,
        memory: 50,
        frameTime: 16.67,
        webglContextLost: false
      };

      const goodDelta = tracker.compareToBaseline(goodCurrent);
      expect(goodDelta.impactScore).toBeGreaterThanOrEqual(0);
    });

    it('should warn when no baseline is set', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      const current = tracker.getCurrentMetrics();
      tracker.compareToBaseline(current);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('No baseline set')
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Asset Performance Metrics', () => {
    it('should update asset metrics', () => {
      tracker.setBaseline({
        fps: 60,
        memory: 50,
        frameTime: 16.67,
        webglContextLost: false
      });

      tracker.updateAssetMetrics('test-asset', 'Test Asset', true);

      const report = tracker.generateReport();
      const asset = report.assets.find(a => a.id === 'test-asset');

      expect(asset).toBeDefined();
      expect(asset?.name).toBe('Test Asset');
      expect(asset?.enabled).toBe(true);
    });

    it('should preserve render time when updating metrics', () => {
      currentTime = 1000;
      tracker.startRenderTimer('test-asset');
      currentTime = 1020;
      tracker.endRenderTimer('test-asset');

      tracker.updateAssetMetrics('test-asset', 'Test Asset', true);

      const report = tracker.generateReport();
      const asset = report.assets.find(a => a.id === 'test-asset');

      expect(asset?.renderTime).toBeCloseTo(20, 1);
    });
  });

  describe('Performance Report Generation', () => {
    beforeEach(() => {
      tracker.setBaseline({
        fps: 60,
        memory: 50,
        frameTime: 16.67,
        webglContextLost: false
      });
    });

    it('should generate comprehensive report', () => {
      tracker.updateAssetMetrics('asset-1', 'Asset 1', true);
      tracker.updateAssetMetrics('asset-2', 'Asset 2', true);

      const report = tracker.generateReport();

      expect(report.timestamp).toBeDefined();
      expect(report.baseline).toBeDefined();
      expect(report.current).toBeDefined();
      expect(report.assets).toHaveLength(2);
      expect(report.recommendations).toBeDefined();
      expect(report.system).toBeDefined();
    });

    it('should rank assets by performance impact', () => {
      // Create assets with different impacts
      tracker.setBaseline({
        fps: 60,
        memory: 50,
        frameTime: 16.67,
        webglContextLost: false
      });

      tracker.updateAssetMetrics('expensive', 'Expensive Asset', true);
      tracker.updateAssetMetrics('cheap', 'Cheap Asset', true);

      const report = tracker.generateReport();

      expect(report.assets[0].rank).toBe(1);
      expect(report.assets[1].rank).toBe(2);
    });

    it('should include system information', () => {
      const report = tracker.generateReport();

      expect(report.system.userAgent).toBeDefined();
      expect(report.system.platform).toBeDefined();
      expect(report.system.cores).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Performance Recommendations', () => {
    beforeEach(() => {
      tracker.setBaseline({
        fps: 60,
        memory: 50,
        frameTime: 16.67,
        webglContextLost: false
      });
    });

    it('should recommend disabling assets when FPS is low', () => {
      // Simulate low FPS
      for (let i = 0; i < 30; i++) {
        currentTime += 33.34; // ~30fps
        if (rafCallback) rafCallback(currentTime);
      }
      currentTime += 1000;
      if (rafCallback) rafCallback(currentTime);

      tracker.updateAssetMetrics('expensive', 'Expensive Asset', true);

      const report = tracker.generateReport();

      expect(report.recommendations).toContain(
        expect.stringContaining('FPS below')
      );
    });

    it('should warn about high memory usage', () => {
      (global.performance as any).memory.usedJSHeapSize = 600 * 1048576; // 600MB

      const report = tracker.generateReport();

      expect(report.recommendations).toContain(
        expect.stringContaining('memory usage')
      );
    });

    it('should identify expensive assets', () => {
      currentTime = 1000;
      tracker.startRenderTimer('slow-asset');
      currentTime = 1050; // 50ms render time
      tracker.endRenderTimer('slow-asset');

      tracker.updateAssetMetrics('slow-asset', 'Slow Asset', true);

      const report = tracker.generateReport();

      expect(report.recommendations).toContain(
        expect.stringContaining('Slow render times')
      );
    });

    it('should show positive message when performance is optimal', () => {
      const report = tracker.generateReport();

      expect(report.recommendations).toContain(
        expect.stringContaining('optimal')
      );
    });
  });

  describe('Export and Download', () => {
    it('should export report as JSON string', () => {
      tracker.setBaseline({
        fps: 60,
        memory: 50,
        frameTime: 16.67,
        webglContextLost: false
      });

      const json = tracker.exportReport();
      const parsed = JSON.parse(json);

      expect(parsed.timestamp).toBeDefined();
      expect(parsed.baseline).toBeDefined();
      expect(parsed.current).toBeDefined();
    });

    it('should download report as JSON file', () => {
      const createElementSpy = jest.spyOn(document, 'createElement');
      const createObjectURLSpy = jest.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock');
      const revokeObjectURLSpy = jest.spyOn(URL, 'revokeObjectURL').mockImplementation();

      tracker.downloadReport();

      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(createObjectURLSpy).toHaveBeenCalled();
      expect(revokeObjectURLSpy).toHaveBeenCalled();

      createObjectURLSpy.mockRestore();
      revokeObjectURLSpy.mockRestore();
    });
  });

  describe('Cleanup', () => {
    it('should cancel animation frame on dispose', () => {
      tracker.dispose();
      expect(cancelAnimationFrame).toHaveBeenCalled();
    });

    it('should clear timers and metrics on dispose', () => {
      tracker.startRenderTimer('test');
      tracker.updateAssetMetrics('test', 'Test', true);

      tracker.dispose();

      // After dispose, metrics should be cleared
      const report = tracker.generateReport();
      expect(report.assets).toHaveLength(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle division by zero in calculations', () => {
      tracker.setBaseline({
        fps: 0,
        memory: 0,
        frameTime: 0,
        webglContextLost: false
      });

      const current = tracker.getCurrentMetrics();
      const delta = tracker.compareToBaseline(current);

      expect(delta.fpsChangePercent).toBe(0);
      expect(delta.memoryChangePercent).toBe(0);
      expect(delta.frameTimeChangePercent).toBe(0);
    });

    it('should clamp impact score between -100 and 100', () => {
      tracker.setBaseline({
        fps: 60,
        memory: 10,
        frameTime: 16.67,
        webglContextLost: false
      });

      const extremeCurrent: PerformanceMetrics = {
        fps: 1,
        memory: 1000,
        frameTime: 1000,
        webglContextLost: false
      };

      const delta = tracker.compareToBaseline(extremeCurrent);

      expect(delta.impactScore).toBeGreaterThanOrEqual(-100);
      expect(delta.impactScore).toBeLessThanOrEqual(100);
    });
  });
});
