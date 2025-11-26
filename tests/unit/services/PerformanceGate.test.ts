import { describe, it, expect, beforeEach } from 'vitest';
import {
  PerformanceGate,
  QualityMode,
  LoadingPhase,
  FPS_THRESHOLDS,
} from '../../../src/services/loading/PerformanceGate';

describe('PerformanceGate', () => {
  let gate: PerformanceGate;

  beforeEach(() => {
    gate = new PerformanceGate();
  });

  describe('Quality Mode Determination', () => {
    it('should return ULTRA mode for excellent FPS', () => {
      const mode = gate.determineQualityMode(60);
      expect(mode).toBe(QualityMode.ULTRA);
    });

    it('should return QUALITY mode for good FPS', () => {
      const mode = gate.determineQualityMode(50);
      expect(mode).toBe(QualityMode.QUALITY);
    });

    it('should return BALANCED mode for fair FPS', () => {
      const mode = gate.determineQualityMode(40);
      expect(mode).toBe(QualityMode.BALANCED);
    });

    it('should return MINIMAL mode for poor FPS', () => {
      const mode = gate.determineQualityMode(30);
      expect(mode).toBe(QualityMode.MINIMAL);
    });

    it('should return EMERGENCY mode for critical FPS', () => {
      const mode = gate.determineQualityMode(15);
      expect(mode).toBe(QualityMode.EMERGENCY);
    });

    it('should handle edge case at threshold boundaries', () => {
      expect(gate.determineQualityMode(FPS_THRESHOLDS.EXCELLENT)).toBe(QualityMode.ULTRA);
      expect(gate.determineQualityMode(FPS_THRESHOLDS.GOOD)).toBe(QualityMode.QUALITY);
      expect(gate.determineQualityMode(FPS_THRESHOLDS.FAIR)).toBe(QualityMode.BALANCED);
      expect(gate.determineQualityMode(FPS_THRESHOLDS.POOR)).toBe(QualityMode.MINIMAL);
      expect(gate.determineQualityMode(FPS_THRESHOLDS.CRITICAL)).toBe(QualityMode.EMERGENCY);
    });
  });

  describe('Mode Support Validation', () => {
    it('should allow ULTRA mode only for excellent FPS', () => {
      expect(gate.isModeSupported(QualityMode.ULTRA, 60)).toBe(true);
      expect(gate.isModeSupported(QualityMode.ULTRA, 50)).toBe(false);
      expect(gate.isModeSupported(QualityMode.ULTRA, 30)).toBe(false);
    });

    it('should allow MINIMAL mode for all valid FPS ranges', () => {
      expect(gate.isModeSupported(QualityMode.MINIMAL, 60)).toBe(true);
      expect(gate.isModeSupported(QualityMode.MINIMAL, 40)).toBe(true);
      expect(gate.isModeSupported(QualityMode.MINIMAL, 25)).toBe(true);
    });

    it('should not allow modes below minimum FPS threshold', () => {
      expect(gate.isModeSupported(QualityMode.BALANCED, 30)).toBe(false);
      expect(gate.isModeSupported(QualityMode.QUALITY, 40)).toBe(false);
    });
  });

  describe('Performance Recommendations', () => {
    it('should provide recommendation with correct mode', () => {
      const recommendation = gate.getRecommendation(50);
      expect(recommendation.mode).toBe(QualityMode.QUALITY);
      expect(recommendation.reason).toContain('50 FPS');
      expect(recommendation.expectedFPS).toBeGreaterThan(0);
      expect(recommendation.disabledAssets).toBeDefined();
    });

    it('should allow override for acceptable FPS', () => {
      const recommendation = gate.getRecommendation(30);
      expect(recommendation.canOverride).toBe(true);
    });

    it('should not allow override for critical FPS', () => {
      const recommendation = gate.getRecommendation(15);
      expect(recommendation.canOverride).toBe(false);
    });

    it('should include disabled assets in recommendation', () => {
      const recommendation = gate.getRecommendation(30);
      expect(Array.isArray(recommendation.disabledAssets)).toBe(true);
    });

    it('should provide user-friendly reason text', () => {
      const recommendation = gate.getRecommendation(45);
      expect(recommendation.reason).toBeTruthy();
      expect(recommendation.reason.length).toBeGreaterThan(20);
      expect(recommendation.reason).toContain('FPS');
    });
  });

  describe('Loading Phase Gating', () => {
    it('should allow essential phases at minimum FPS', () => {
      const canProceed = gate.canProceedToPhase(LoadingPhase.INITIALIZATION, 30);
      expect(canProceed).toBe(true);
    });

    it('should block advanced phases at low FPS', () => {
      const canProceed = gate.canProceedToPhase(LoadingPhase.POST_PROCESSING, 35);
      expect(canProceed).toBe(false);
    });

    it('should allow all phases at excellent FPS', () => {
      const phases = [
        LoadingPhase.INITIALIZATION,
        LoadingPhase.COURTS,
        LoadingPhase.LIGHTING,
        LoadingPhase.ENVIRONMENT,
        LoadingPhase.POST_PROCESSING,
      ];

      phases.forEach((phase) => {
        expect(gate.canProceedToPhase(phase, 60)).toBe(true);
      });
    });

    it('should respect override setting', () => {
      gate.setOverride(true);
      expect(gate.canProceedToPhase(LoadingPhase.POST_PROCESSING, 25)).toBe(true);

      gate.setOverride(false);
      expect(gate.canProceedToPhase(LoadingPhase.POST_PROCESSING, 25)).toBe(false);
    });
  });

  describe('Mode Management', () => {
    it('should set mode when FPS supports it', () => {
      const success = gate.setMode(QualityMode.QUALITY, 50);
      expect(success).toBe(true);
      expect(gate.getCurrentMode()).toBe(QualityMode.QUALITY);
    });

    it('should reject mode when FPS is insufficient', () => {
      const success = gate.setMode(QualityMode.ULTRA, 40);
      expect(success).toBe(false);
      expect(gate.getCurrentMode()).not.toBe(QualityMode.ULTRA);
    });

    it('should allow mode setting with override enabled', () => {
      gate.setOverride(true);
      const success = gate.setMode(QualityMode.ULTRA, 30);
      expect(success).toBe(true);
      expect(gate.getCurrentMode()).toBe(QualityMode.ULTRA);
    });

    it('should track override state correctly', () => {
      expect(gate.isOverrideEnabled()).toBe(false);
      gate.setOverride(true);
      expect(gate.isOverrideEnabled()).toBe(true);
      gate.setOverride(false);
      expect(gate.isOverrideEnabled()).toBe(false);
    });
  });

  describe('Mode Configuration', () => {
    it('should return valid configuration for all modes', () => {
      const modes = [
        QualityMode.ULTRA,
        QualityMode.QUALITY,
        QualityMode.BALANCED,
        QualityMode.MINIMAL,
        QualityMode.EMERGENCY,
      ];

      modes.forEach((mode) => {
        const config = gate.getModeConfig(mode);
        expect(config).toBeDefined();
        expect(config.name).toBeTruthy();
        expect(config.description).toBeTruthy();
        expect(config.minFPS).toBeGreaterThanOrEqual(0);
        expect(config.expectedFPS).toBeGreaterThan(0);
        expect(Array.isArray(config.disabledAssets)).toBe(true);
        expect(Array.isArray(config.loadingPhases)).toBe(true);
      });
    });

    it('should return appropriate loading phases per mode', () => {
      const ultraPhases = gate.getPhasesForMode(QualityMode.ULTRA);
      const minimalPhases = gate.getPhasesForMode(QualityMode.MINIMAL);

      expect(ultraPhases.length).toBeGreaterThan(minimalPhases.length);
      expect(minimalPhases).toContain(LoadingPhase.INITIALIZATION);
      expect(minimalPhases).toContain(LoadingPhase.COURTS);
    });

    it('should list all available modes', () => {
      const allModes = gate.getAllModes();
      expect(allModes.length).toBe(5);
      allModes.forEach((item) => {
        expect(item.mode).toBeDefined();
        expect(item.config).toBeDefined();
      });
    });
  });

  describe('Performance Tier Classification', () => {
    it('should classify FPS into correct tiers', () => {
      expect(gate.getPerformanceTier(60)).toBe('Excellent');
      expect(gate.getPerformanceTier(50)).toBe('Good');
      expect(gate.getPerformanceTier(40)).toBe('Fair');
      expect(gate.getPerformanceTier(30)).toBe('Poor');
      expect(gate.getPerformanceTier(22)).toBe('Critical');
      expect(gate.getPerformanceTier(15)).toBe('Emergency');
    });

    it('should handle edge cases in tier boundaries', () => {
      expect(gate.getPerformanceTier(FPS_THRESHOLDS.EXCELLENT)).toBe('Excellent');
      expect(gate.getPerformanceTier(FPS_THRESHOLDS.GOOD)).toBe('Good');
      expect(gate.getPerformanceTier(FPS_THRESHOLDS.CRITICAL)).toBe('Critical');
    });
  });

  describe('Diagnostics', () => {
    it('should provide comprehensive diagnostic information', () => {
      gate.setMode(QualityMode.BALANCED, 45);
      gate.setOverride(true);

      const diagnostics = gate.getDiagnostics();

      expect(diagnostics.currentMode).toBe(QualityMode.BALANCED);
      expect(diagnostics.overrideEnabled).toBe(true);
      expect(diagnostics.thresholds).toEqual(FPS_THRESHOLDS);
      expect(diagnostics.modeConfigs).toBeDefined();
      expect(Object.keys(diagnostics.modeConfigs).length).toBe(5);
    });

    it('should include all quality modes in diagnostics', () => {
      const diagnostics = gate.getDiagnostics();
      const modes = Object.keys(diagnostics.modeConfigs);

      expect(modes).toContain(QualityMode.ULTRA);
      expect(modes).toContain(QualityMode.QUALITY);
      expect(modes).toContain(QualityMode.BALANCED);
      expect(modes).toContain(QualityMode.MINIMAL);
      expect(modes).toContain(QualityMode.EMERGENCY);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle zero FPS gracefully', () => {
      const mode = gate.determineQualityMode(0);
      expect(mode).toBe(QualityMode.EMERGENCY);
    });

    it('should handle negative FPS values', () => {
      const mode = gate.determineQualityMode(-10);
      expect(mode).toBe(QualityMode.EMERGENCY);
    });

    it('should handle extremely high FPS values', () => {
      const mode = gate.determineQualityMode(240);
      expect(mode).toBe(QualityMode.ULTRA);
    });

    it('should handle fractional FPS values correctly', () => {
      expect(gate.determineQualityMode(44.9)).toBe(QualityMode.BALANCED);
      expect(gate.determineQualityMode(55.1)).toBe(QualityMode.ULTRA);
    });
  });
});
