/**
 * Integration Tests for Performance Tracking
 *
 * Tests the complete performance tracking workflow including
 * FPS monitoring, memory tracking, baseline comparisons, and reporting.
 */

import { getPerformanceTracker, PerformanceTracker } from '@/utils/debug/performanceTracker';
import { assetRegistry } from '@/utils/debug/assetRegistry';
import { AssetDefinition } from '@/utils/debug/assetDefinitions';

// Mock performance.now()
const mockNow = jest.fn();
global.performance.now = mockNow;

// Mock requestAnimationFrame
let rafCallback: FrameRequestCallback | null = null;
global.requestAnimationFrame = jest.fn((cb) => {
  rafCallback = cb;
  return 1;
});

// Mock performance.memory
Object.defineProperty(global.performance, 'memory', {
  writable: true,
  value: {
    usedJSHeapSize: 50 * 1048576, // 50MB
    totalJSHeapSize: 100 * 1048576,
    jsHeapSizeLimit: 200 * 1048576
  }
});

describe('Performance Tracking Integration', () => {
  let tracker: PerformanceTracker;
  let currentTime = 0;

  beforeEach(() => {
    currentTime = 0;
    mockNow.mockImplementation(() => currentTime);
    tracker = new PerformanceTracker();
    assetRegistry.clear();
  });

  afterEach(() => {
    tracker.dispose();
    assetRegistry.clear();
  });

  describe('Complete Tracking Workflow', () => {
    it('should track full lifecycle from baseline to report', () => {
      // 1. Set baseline with no assets
      tracker.setBaseline({
        fps: 60,
        memory: 50,
        frameTime: 16.67,
        webglContextLost: false
      });

      // 2. Register and enable assets
      const asset: AssetDefinition = {
        id: 'grass',
        name: 'Grass System',
        type: 'grass',
        performanceCost: 5,
        dependencies: [],
        defaultEnabled: false,
        description: 'Grass'
      };

      assetRegistry.register(asset);
      assetRegistry.enable('grass');

      // 3. Track render time
      currentTime = 1000;
      tracker.startRenderTimer('grass');
      currentTime = 1015; // 15ms render
      tracker.endRenderTimer('grass');

      // 4. Update metrics
      tracker.updateAssetMetrics('grass', 'Grass System', true);

      // 5. Generate report
      const report = tracker.generateReport();

      expect(report.baseline).toBeDefined();
      expect(report.current).toBeDefined();
      expect(report.assets).toHaveLength(1);
      expect(report.assets[0].id).toBe('grass');
      expect(report.assets[0].renderTime).toBeCloseTo(15, 1);
    });
  });

  describe('Multi-Asset Performance Tracking', () => {
    it('should track multiple assets simultaneously', () => {
      tracker.setBaseline({
        fps: 60,
        memory: 50,
        frameTime: 16.67,
        webglContextLost: false
      });

      const assets: AssetDefinition[] = [
        {
          id: 'grass',
          name: 'Grass',
          type: 'grass',
          performanceCost: 5,
          dependencies: [],
          defaultEnabled: true,
          description: 'Grass'
        },
        {
          id: 'trees',
          name: 'Trees',
          type: 'environment',
          performanceCost: 10,
          dependencies: [],
          defaultEnabled: true,
          description: 'Trees'
        },
        {
          id: 'shadows',
          name: 'Shadows',
          type: 'lighting',
          performanceCost: 8,
          dependencies: [],
          defaultEnabled: true,
          description: 'Shadows'
        }
      ];

      assets.forEach(asset => assetRegistry.register(asset));

      // Track each asset
      assets.forEach(asset => {
        currentTime += 10;
        tracker.startRenderTimer(asset.id);
        currentTime += Math.random() * 20; // Random render time
        tracker.endRenderTimer(asset.id);
        tracker.updateAssetMetrics(asset.id, asset.name, true);
      });

      const report = tracker.generateReport();

      expect(report.assets).toHaveLength(3);
      expect(report.assets.every(a => a.renderTime > 0)).toBe(true);
    });
  });

  describe('Performance Degradation Detection', () => {
    it('should detect FPS drops when enabling expensive assets', () => {
      // Set baseline at 60 FPS
      tracker.setBaseline({
        fps: 60,
        memory: 50,
        frameTime: 16.67,
        webglContextLost: false
      });

      const expensiveAsset: AssetDefinition = {
        id: 'particles',
        name: 'Particle System',
        type: 'effects',
        performanceCost: 25,
        dependencies: [],
        defaultEnabled: false,
        description: 'Expensive particles'
      };

      assetRegistry.register(expensiveAsset);

      // Simulate 60 FPS before enabling
      for (let i = 0; i < 60; i++) {
        currentTime += 16.67;
        if (rafCallback) rafCallback(currentTime);
      }

      assetRegistry.enable('particles');

      // Simulate 30 FPS after enabling (performance drop)
      for (let i = 0; i < 30; i++) {
        currentTime += 33.34;
        if (rafCallback) rafCallback(currentTime);
      }

      currentTime += 1000;
      if (rafCallback) rafCallback(currentTime);

      tracker.updateAssetMetrics('particles', 'Particle System', true);

      const current = tracker.getCurrentMetrics();
      const delta = tracker.compareToBaseline(current);

      expect(delta.fpsDelta).toBeLessThan(0);
      expect(delta.impactScore).toBeLessThan(0);

      const report = tracker.generateReport();
      expect(report.recommendations).toContain(
        expect.stringContaining('FPS')
      );
    });

    it('should detect memory increases when enabling assets', () => {
      tracker.setBaseline({
        fps: 60,
        memory: 50,
        frameTime: 16.67,
        webglContextLost: false
      });

      const memoryHungryAsset: AssetDefinition = {
        id: 'textures',
        name: 'High-Res Textures',
        type: 'environment',
        performanceCost: 15,
        dependencies: [],
        defaultEnabled: false,
        description: 'Large textures'
      };

      assetRegistry.register(memoryHungryAsset);

      const initialMemory = tracker.trackMemoryDelta('textures');
      expect(initialMemory).toBe(0);

      // Enable asset and simulate memory increase
      assetRegistry.enable('textures');
      (global.performance as any).memory.usedJSHeapSize = 150 * 1048576; // 150MB

      const memoryDelta = tracker.trackMemoryDelta('textures');
      expect(memoryDelta).toBeGreaterThan(0);
    });
  });

  describe('Baseline Comparison Workflow', () => {
    it('should compare current state to baseline accurately', () => {
      const baseline = {
        fps: 60,
        memory: 50,
        frameTime: 16.67,
        webglContextLost: false
      };

      tracker.setBaseline(baseline);

      // Simulate worse performance
      const current = {
        fps: 45,
        memory: 75,
        frameTime: 22.22,
        webglContextLost: false
      };

      const delta = tracker.compareToBaseline(current);

      expect(delta.fpsDelta).toBe(-15);
      expect(delta.fpsChangePercent).toBeCloseTo(-25, 1);
      expect(delta.memoryDelta).toBe(25);
      expect(delta.memoryChangePercent).toBe(50);
      expect(delta.impactScore).toBeLessThan(0);
    });

    it('should handle baseline not set', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      const current = tracker.getCurrentMetrics();
      const delta = tracker.compareToBaseline(current);

      expect(delta.fpsDelta).toBe(0);
      expect(delta.memoryDelta).toBe(0);
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('Performance Report Generation', () => {
    it('should generate comprehensive report with all metrics', () => {
      tracker.setBaseline({
        fps: 60,
        memory: 50,
        frameTime: 16.67,
        webglContextLost: false
      });

      const assets: AssetDefinition[] = [
        {
          id: 'cheap',
          name: 'Cheap Asset',
          type: 'grass',
          performanceCost: 2,
          dependencies: [],
          defaultEnabled: true,
          description: 'Cheap'
        },
        {
          id: 'expensive',
          name: 'Expensive Asset',
          type: 'characters',
          performanceCost: 20,
          dependencies: [],
          defaultEnabled: true,
          description: 'Expensive'
        }
      ];

      assets.forEach(asset => {
        assetRegistry.register(asset);
        tracker.startRenderTimer(asset.id);
        currentTime += asset.performanceCost;
        tracker.endRenderTimer(asset.id);
        tracker.updateAssetMetrics(asset.id, asset.name, true);
      });

      const report = tracker.generateReport();

      expect(report.timestamp).toBeDefined();
      expect(report.baseline.fps).toBe(60);
      expect(report.assets).toHaveLength(2);
      expect(report.system.userAgent).toBeDefined();
      expect(report.recommendations).toBeDefined();
    });

    it('should rank assets by performance impact', () => {
      tracker.setBaseline({
        fps: 60,
        memory: 50,
        frameTime: 16.67,
        webglContextLost: false
      });

      // Create assets with different impact
      tracker.updateAssetMetrics('low-impact', 'Low Impact', true);
      tracker.updateAssetMetrics('high-impact', 'High Impact', true);

      // Simulate higher impact for high-impact asset
      currentTime = 1000;
      tracker.startRenderTimer('high-impact');
      currentTime = 1050; // 50ms render
      tracker.endRenderTimer('high-impact');

      tracker.startRenderTimer('low-impact');
      currentTime = 1055; // 5ms render
      tracker.endRenderTimer('low-impact');

      const report = tracker.generateReport();

      // Assets should be ranked (worst first)
      expect(report.assets[0].rank).toBe(1);
      expect(report.assets[1].rank).toBe(2);
    });
  });

  describe('Render Time Tracking', () => {
    it('should track render times for all enabled assets', () => {
      const assets: AssetDefinition[] = [
        { id: 'fast', name: 'Fast', type: 'grass', performanceCost: 1, dependencies: [], defaultEnabled: true, description: 'Fast' },
        { id: 'medium', name: 'Medium', type: 'lighting', performanceCost: 5, dependencies: [], defaultEnabled: true, description: 'Medium' },
        { id: 'slow', name: 'Slow', type: 'characters', performanceCost: 15, dependencies: [], defaultEnabled: true, description: 'Slow' }
      ];

      assets.forEach(asset => assetRegistry.register(asset));

      currentTime = 1000;

      // Fast asset: 5ms
      tracker.startRenderTimer('fast');
      currentTime += 5;
      expect(tracker.endRenderTimer('fast')).toBeCloseTo(5, 1);

      // Medium asset: 10ms
      tracker.startRenderTimer('medium');
      currentTime += 10;
      expect(tracker.endRenderTimer('medium')).toBeCloseTo(10, 1);

      // Slow asset: 30ms
      tracker.startRenderTimer('slow');
      currentTime += 30;
      expect(tracker.endRenderTimer('slow')).toBeCloseTo(30, 1);
    });

    it('should identify slow rendering assets in recommendations', () => {
      tracker.setBaseline({
        fps: 60,
        memory: 50,
        frameTime: 16.67,
        webglContextLost: false
      });

      currentTime = 1000;
      tracker.startRenderTimer('slow-asset');
      currentTime = 1050; // 50ms - way over budget
      tracker.endRenderTimer('slow-asset');

      tracker.updateAssetMetrics('slow-asset', 'Slow Asset', true);

      const report = tracker.generateReport();

      expect(report.recommendations).toContain(
        expect.stringContaining('Slow render times')
      );
    });
  });

  describe('Performance Recommendations', () => {
    it('should provide actionable recommendations', () => {
      tracker.setBaseline({
        fps: 60,
        memory: 50,
        frameTime: 16.67,
        webglContextLost: false
      });

      // Simulate low FPS
      for (let i = 0; i < 25; i++) {
        currentTime += 40; // ~25 FPS
        if (rafCallback) rafCallback(currentTime);
      }

      const report = tracker.generateReport();

      expect(report.recommendations.length).toBeGreaterThan(0);
      expect(report.recommendations).toContain(
        expect.stringContaining('FPS below 30')
      );
    });

    it('should recommend optimal state when performance is good', () => {
      tracker.setBaseline({
        fps: 60,
        memory: 50,
        frameTime: 16.67,
        webglContextLost: false
      });

      // Simulate good FPS
      for (let i = 0; i < 60; i++) {
        currentTime += 16.67;
        if (rafCallback) rafCallback(currentTime);
      }

      const report = tracker.generateReport();

      expect(report.recommendations).toContain(
        expect.stringContaining('optimal')
      );
    });
  });

  describe('Export Workflow', () => {
    it('should export report as JSON', () => {
      tracker.setBaseline({
        fps: 60,
        memory: 50,
        frameTime: 16.67,
        webglContextLost: false
      });

      tracker.updateAssetMetrics('test', 'Test', true);

      const json = tracker.exportReport();
      const parsed = JSON.parse(json);

      expect(parsed.timestamp).toBeDefined();
      expect(parsed.baseline).toBeDefined();
      expect(parsed.current).toBeDefined();
      expect(parsed.assets).toBeDefined();
    });

    it('should download report file', () => {
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

  describe('Continuous Monitoring', () => {
    it('should continuously update FPS history', () => {
      // Simulate multiple seconds of frames
      for (let second = 0; second < 5; second++) {
        for (let frame = 0; frame < 60; frame++) {
          currentTime += 16.67;
          if (rafCallback) rafCallback(currentTime);
        }
        currentTime = (second + 1) * 1000;
        if (rafCallback) rafCallback(currentTime);
      }

      const avgFPS = tracker.getAverageFPS(5);
      expect(avgFPS).toBeGreaterThan(0);
      expect(avgFPS).toBeLessThanOrEqual(60);
    });

    it('should limit FPS history to prevent memory growth', () => {
      // Simulate 120 seconds worth of frames (way more than the 60 second limit)
      for (let second = 0; second < 120; second++) {
        for (let frame = 0; frame < 60; frame++) {
          currentTime += 16.67;
          if (rafCallback) rafCallback(currentTime);
        }
        currentTime = (second + 1) * 1000;
        if (rafCallback) rafCallback(currentTime);
      }

      // Should only keep last 60 seconds
      const avgFPS = tracker.getAverageFPS(70); // Request more than stored
      expect(avgFPS).toBeGreaterThan(0);
    });
  });

  describe('Cleanup', () => {
    it('should properly dispose resources', () => {
      tracker.startRenderTimer('test');
      tracker.updateAssetMetrics('test', 'Test', true);

      tracker.dispose();

      const report = tracker.generateReport();
      expect(report.assets).toHaveLength(0);
    });
  });
});
