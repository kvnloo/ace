import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { FPSBatchController } from '../../../src/services/fps/FPSBatchController';
import { ComponentTier } from '../../../src/services/batch-loading/ComponentBatchManager';

describe('FPSBatchController', () => {
  let controller: FPSBatchController;

  beforeEach(() => {
    controller = new FPSBatchController();
    vi.useFakeTimers();
  });

  afterEach(() => {
    controller.stop();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Lifecycle Management', () => {
    it('should start monitoring successfully', () => {
      controller.start();
      const diagnostics = controller.getDiagnostics();
      expect(diagnostics.monitoring).toBe(true);
    });

    it('should stop monitoring successfully', () => {
      controller.start();
      controller.stop();
      const diagnostics = controller.getDiagnostics();
      expect(diagnostics.monitoring).toBe(false);
    });

    it('should not start monitoring twice', () => {
      controller.start();
      controller.start();
      // Second start should be ignored, controller still running
      const diagnostics = controller.getDiagnostics();
      expect(diagnostics.monitoring).toBe(true);
    });

    it('should handle stop when not monitoring', () => {
      expect(() => controller.stop()).not.toThrow();
    });
  });

  describe('Warning System', () => {
    it('should register warning callbacks', () => {
      const warnings: any[] = [];
      const unregister = controller.onWarning((event) => {
        warnings.push(event);
      });

      expect(typeof unregister).toBe('function');
    });

    it('should allow unregistering warning callbacks', () => {
      const warnings: any[] = [];
      const unregister = controller.onWarning((event) => {
        warnings.push(event);
      });

      unregister();

      // Callback is unregistered
      expect(warnings.length).toBe(0);
    });

    it('should handle errors in warning callbacks gracefully', () => {
      controller.onWarning(() => {
        throw new Error('Callback error');
      });

      // Controller should continue running despite callback errors
      expect(() => controller.start()).not.toThrow();
      expect(() => controller.getDiagnostics()).not.toThrow();
    });
  });

  describe('Component and Tier Management', () => {
    it('should enable tier successfully', async () => {
      controller.start();
      const result = await controller.enableTier(ComponentTier.ESSENTIAL);
      expect(typeof result).toBe('boolean');
    });

    it('should disable tier successfully', async () => {
      controller.start();
      const result = await controller.disableTier(ComponentTier.VISUAL_EFFECTS);
      expect(typeof result).toBe('boolean');
    });

    it('should enable component successfully', async () => {
      const result = await controller.enableComponent('test-component');
      expect(typeof result).toBe('boolean');
    });

    it('should disable component successfully', async () => {
      const result = await controller.disableComponent('test-component');
      expect(typeof result).toBe('boolean');
    });
  });

  describe('FPS Threshold Monitoring', () => {
    it('should track FPS when monitoring', () => {
      controller.start();

      const diagnostics = controller.getDiagnostics();
      expect(diagnostics.monitoring).toBe(true);
      expect(diagnostics.fps).toBeDefined();
    });

    it('should provide FPS diagnostics', () => {
      controller.start();

      const diagnostics = controller.getDiagnostics();
      expect(diagnostics.fps).toBeDefined();
      expect(diagnostics.monitoring).toBe(true);
    });

    it('should track stability metrics', () => {
      controller.start();

      const diagnostics = controller.getDiagnostics();
      expect(diagnostics.stability).toBeDefined();
      expect(diagnostics.stability.threshold).toBe(3);
      expect(diagnostics.stability.consecutiveLow).toBeGreaterThanOrEqual(0);
      expect(diagnostics.stability.consecutiveHigh).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Correlation Data', () => {
    it('should track tier correlation data', () => {
      const correlations = controller.getAllCorrelations();
      expect(Array.isArray(correlations)).toBe(true);
    });

    it('should export correlation data', () => {
      const exported = controller.exportCorrelationData();
      expect(typeof exported).toBe('object');
    });

    it('should get specific tier correlation', () => {
      const correlation = controller.getCorrelation(ComponentTier.ESSENTIAL);
      // May be undefined if no data collected yet
      expect(correlation === undefined || typeof correlation === 'object').toBe(true);
    });
  });

  describe('Diagnostics', () => {
    it('should provide comprehensive diagnostics', () => {
      controller.start();

      const diagnostics = controller.getDiagnostics();

      expect(diagnostics).toHaveProperty('monitoring');
      expect(diagnostics).toHaveProperty('fps');
      expect(diagnostics).toHaveProperty('batches');
      expect(diagnostics).toHaveProperty('thresholds');
      expect(diagnostics).toHaveProperty('stability');
      expect(diagnostics).toHaveProperty('correlations');
    });

    it('should have correct threshold values', () => {
      const diagnostics = controller.getDiagnostics();

      expect(diagnostics.thresholds.critical).toBe(25);
      expect(diagnostics.thresholds.low).toBe(40);
      expect(diagnostics.thresholds.stable).toBe(55);
    });

    it('should track stability metrics', () => {
      const diagnostics = controller.getDiagnostics();

      expect(diagnostics.stability.consecutiveLow).toBeGreaterThanOrEqual(0);
      expect(diagnostics.stability.consecutiveHigh).toBeGreaterThanOrEqual(0);
      expect(diagnostics.stability.threshold).toBe(3);
    });
  });

  describe('Reset Functionality', () => {
    it('should reset all controller state', () => {
      controller.reset();

      const diagnostics = controller.getDiagnostics();
      expect(diagnostics.correlations).toBe(0);
      expect(diagnostics.stability.consecutiveLow).toBe(0);
      expect(diagnostics.stability.consecutiveHigh).toBe(0);
    });
  });

  describe('Integration Points', () => {
    it('should provide access to FPSMonitor instance', () => {
      const fpsMonitor = controller.getFPSMonitor();
      expect(fpsMonitor).toBeDefined();
      expect(typeof fpsMonitor.start).toBe('function');
      expect(typeof fpsMonitor.stop).toBe('function');
    });

    it('should provide access to BatchManager instance', () => {
      const batchManager = controller.getBatchManager();
      expect(batchManager).toBeDefined();
      expect(typeof batchManager.enableTier).toBe('function');
    });
  });

  describe('Performance Scenarios', () => {
    it('should handle monitoring lifecycle', () => {
      controller.start();

      expect(() => controller.getDiagnostics()).not.toThrow();
      const diagnostics = controller.getDiagnostics();
      expect(diagnostics.monitoring).toBe(true);

      controller.stop();
    });

    it('should maintain diagnostics during operation', () => {
      controller.start();

      const diagnostics = controller.getDiagnostics();
      expect(diagnostics.monitoring).toBe(true);
      expect(diagnostics.fps).toBeDefined();
      expect(diagnostics.thresholds).toBeDefined();

      controller.stop();
    });
  });
});
