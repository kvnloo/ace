/**
 * Quality Presets Unit Tests
 *
 * Tests quality preset configurations and automatic quality adjustments
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  QualityMode,
  QualityPresetManager,
  QUALITY_PRESETS,
  QualityChangeEvent
} from '../../../src/services/loading/QualityPresets';

describe('QualityPresets', () => {
  describe('QUALITY_PRESETS', () => {
    it('should have all quality modes defined', () => {
      expect(QUALITY_PRESETS[QualityMode.EMERGENCY]).toBeDefined();
      expect(QUALITY_PRESETS[QualityMode.MINIMAL]).toBeDefined();
      expect(QUALITY_PRESETS[QualityMode.BALANCED]).toBeDefined();
      expect(QUALITY_PRESETS[QualityMode.QUALITY]).toBeDefined();
      expect(QUALITY_PRESETS[QualityMode.ULTRA]).toBeDefined();
    });

    it('should have valid target FPS ranges', () => {
      Object.values(QUALITY_PRESETS).forEach(preset => {
        expect(preset.targetFPS.min).toBeGreaterThan(0);
        expect(preset.targetFPS.max).toBeGreaterThanOrEqual(preset.targetFPS.min);
      });
    });

    it('should have increasing quality levels', () => {
      const emergency = QUALITY_PRESETS[QualityMode.EMERGENCY];
      const minimal = QUALITY_PRESETS[QualityMode.MINIMAL];
      const balanced = QUALITY_PRESETS[QualityMode.BALANCED];
      const quality = QUALITY_PRESETS[QualityMode.QUALITY];
      const ultra = QUALITY_PRESETS[QualityMode.ULTRA];

      // More enabled assets = higher quality
      expect(minimal.enabledAssets.length).toBeGreaterThan(emergency.enabledAssets.length);
      expect(balanced.enabledAssets.length).toBeGreaterThan(minimal.enabledAssets.length);
      expect(quality.enabledAssets.length).toBeGreaterThan(balanced.enabledAssets.length);
      expect(ultra.enabledAssets.length).toBeGreaterThan(quality.enabledAssets.length);
    });

    it('should have emergency mode with minimal settings', () => {
      const emergency = QUALITY_PRESETS[QualityMode.EMERGENCY];
      expect(emergency.settings.shadowQuality).toBe('off');
      expect(emergency.settings.grassDensity).toBe(0);
      expect(emergency.settings.particleCount).toBe(0);
      expect(emergency.settings.postProcessing).toBe(false);
      expect(emergency.settings.weatherEffects).toBe(false);
    });

    it('should have ultra mode with maximum settings', () => {
      const ultra = QUALITY_PRESETS[QualityMode.ULTRA];
      expect(ultra.settings.shadowQuality).toBe('high');
      expect(ultra.settings.grassDensity).toBe(1.0);
      expect(ultra.settings.particleCount).toBeGreaterThan(0);
      expect(ultra.settings.postProcessing).toBe(true);
      expect(ultra.settings.weatherEffects).toBe(true);
    });
  });

  describe('QualityPresetManager', () => {
    let manager: QualityPresetManager;
    let changeEvents: QualityChangeEvent[] = [];

    beforeEach(() => {
      localStorage.clear();
      changeEvents = [];
      manager = new QualityPresetManager();
      manager.onChange((event) => changeEvents.push(event));
    });

    afterEach(() => {
      manager.stopMonitoring();
    });

    describe('Initialization', () => {
      it('should initialize with balanced mode by default', () => {
        expect(manager.getCurrentMode()).toBe(QualityMode.BALANCED);
      });

      it('should load saved mode from localStorage', () => {
        localStorage.setItem('qualityMode', QualityMode.ULTRA);
        const newManager = new QualityPresetManager();
        expect(newManager.getCurrentMode()).toBe(QualityMode.ULTRA);
      });

      it('should fall back to balanced if localStorage has invalid mode', () => {
        localStorage.setItem('qualityMode', 'invalid-mode');
        const newManager = new QualityPresetManager();
        expect(newManager.getCurrentMode()).toBe(QualityMode.BALANCED);
      });
    });

    describe('Preset Management', () => {
      it('should get current preset', () => {
        const preset = manager.getCurrentPreset();
        expect(preset.mode).toBe(QualityMode.BALANCED);
        expect(preset.name).toBe('Balanced');
      });

      it('should get preset by mode', () => {
        const preset = manager.getPreset(QualityMode.ULTRA);
        expect(preset.mode).toBe(QualityMode.ULTRA);
        expect(preset.name).toBe('Ultra');
      });

      it('should get all presets', () => {
        const presets = manager.getAllPresets();
        expect(presets).toHaveLength(5);
      });

      it('should get preset by name', () => {
        const preset = manager.getPresetByName('Ultra');
        expect(preset?.mode).toBe(QualityMode.ULTRA);
      });

      it('should return undefined for invalid preset name', () => {
        const preset = manager.getPresetByName('NonExistent');
        expect(preset).toBeUndefined();
      });
    });

    describe('Quality Changes', () => {
      it('should apply preset and emit change event', async () => {
        await manager.applyPreset(QualityMode.ULTRA, 'manual');

        expect(manager.getCurrentMode()).toBe(QualityMode.ULTRA);
        expect(changeEvents).toHaveLength(1);
        expect(changeEvents[0]).toMatchObject({
          from: QualityMode.BALANCED,
          to: QualityMode.ULTRA,
          reason: 'manual'
        });
      });

      it('should save mode to localStorage', async () => {
        await manager.applyPreset(QualityMode.MINIMAL, 'manual');
        expect(localStorage.getItem('qualityMode')).toBe(QualityMode.MINIMAL);
      });

      it('should not emit event if mode unchanged', async () => {
        await manager.applyPreset(QualityMode.BALANCED, 'manual');
        expect(changeEvents).toHaveLength(0);
      });
    });

    describe('Upgrade/Downgrade', () => {
      it('should check if can upgrade', () => {
        expect(manager.canUpgrade()).toBe(true);

        manager.applyPreset(QualityMode.ULTRA);
        expect(manager.canUpgrade()).toBe(false);
      });

      it('should check if can downgrade', () => {
        expect(manager.canDowngrade()).toBe(true);

        manager.applyPreset(QualityMode.EMERGENCY);
        expect(manager.canDowngrade()).toBe(false);
      });

      it('should upgrade quality', async () => {
        await manager.upgradeQuality();
        expect(manager.getCurrentMode()).toBe(QualityMode.QUALITY);
      });

      it('should downgrade quality', async () => {
        await manager.downgradeQuality();
        expect(manager.getCurrentMode()).toBe(QualityMode.MINIMAL);
      });

      it('should not upgrade beyond ultra', async () => {
        await manager.applyPreset(QualityMode.ULTRA);
        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        await manager.upgradeQuality();
        expect(manager.getCurrentMode()).toBe(QualityMode.ULTRA);
        expect(consoleSpy).toHaveBeenCalledWith('Already at maximum quality');

        consoleSpy.mockRestore();
      });

      it('should not downgrade below emergency', async () => {
        await manager.applyPreset(QualityMode.EMERGENCY);
        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        await manager.downgradeQuality();
        expect(manager.getCurrentMode()).toBe(QualityMode.EMERGENCY);
        expect(consoleSpy).toHaveBeenCalledWith('Already at minimum quality');

        consoleSpy.mockRestore();
      });
    });

    describe('FPS Tracking', () => {
      it('should record FPS values', () => {
        manager.recordFPS(60);
        manager.recordFPS(58);
        manager.recordFPS(62);

        const status = manager.getStatus();
        expect(status.averageFPS).toBeCloseTo(60, 1);
      });

      it('should maintain FPS history size limit', () => {
        for (let i = 0; i < 20; i++) {
          manager.recordFPS(60);
        }

        // History should be limited to 10 (HISTORY_SIZE)
        const status = manager.getStatus();
        expect(status.averageFPS).toBe(60);
      });

      it('should handle empty FPS history', () => {
        const status = manager.getStatus();
        expect(status.averageFPS).toBe(60); // Default
      });
    });

    describe('Auto-Adjustment', () => {
      beforeEach(() => {
        vi.useFakeTimers();
      });

      afterEach(() => {
        vi.restoreAllMocks();
      });

      it('should downgrade on sustained low FPS', async () => {
        // Record low FPS values
        for (let i = 0; i < 10; i++) {
          manager.recordFPS(30); // Below balanced min (40)
        }

        // Wait for stability time
        vi.advanceTimersByTime(11000);

        await manager.autoAdjust(30);
        expect(manager.getCurrentMode()).toBe(QualityMode.MINIMAL);
      });

      it('should upgrade on sustained high FPS', async () => {
        // Start at minimal
        await manager.applyPreset(QualityMode.MINIMAL);

        // Record high FPS values
        for (let i = 0; i < 10; i++) {
          manager.recordFPS(70); // Above minimal max + 10
        }

        // Wait for cooldown
        vi.advanceTimersByTime(61000);

        await manager.autoAdjust(70);
        expect(manager.getCurrentMode()).toBe(QualityMode.BALANCED);
      });

      it('should respect downgrade stability time', async () => {
        manager.recordFPS(30);

        // Immediate check should not downgrade
        await manager.autoAdjust(30);
        expect(manager.getCurrentMode()).toBe(QualityMode.BALANCED);

        // After stability time, should downgrade
        vi.advanceTimersByTime(11000);
        for (let i = 0; i < 10; i++) {
          manager.recordFPS(30);
        }
        await manager.autoAdjust(30);
        expect(manager.getCurrentMode()).toBe(QualityMode.MINIMAL);
      });

      it('should respect upgrade cooldown', async () => {
        await manager.applyPreset(QualityMode.MINIMAL);

        for (let i = 0; i < 10; i++) {
          manager.recordFPS(70);
        }

        // Immediate upgrade should not happen
        await manager.autoAdjust(70);
        expect(manager.getCurrentMode()).toBe(QualityMode.MINIMAL);

        // After cooldown, should upgrade
        vi.advanceTimersByTime(61000);
        await manager.autoAdjust(70);
        expect(manager.getCurrentMode()).toBe(QualityMode.BALANCED);
      });

      it('should reset FPS history after quality change', async () => {
        for (let i = 0; i < 10; i++) {
          manager.recordFPS(30);
        }

        vi.advanceTimersByTime(11000);
        await manager.autoAdjust(30);

        // History should be reset
        const status = manager.getStatus();
        expect(status.averageFPS).toBe(60); // Default for empty history
      });
    });

    describe('Monitoring', () => {
      beforeEach(() => {
        vi.useFakeTimers();
      });

      afterEach(() => {
        vi.restoreAllMocks();
      });

      it('should start monitoring', () => {
        const getFPS = vi.fn(() => 60);
        manager.startMonitoring(getFPS);

        const status = manager.getStatus();
        expect(status.monitoring).toBe(true);
      });

      it('should stop monitoring', () => {
        const getFPS = vi.fn(() => 60);
        manager.startMonitoring(getFPS);
        manager.stopMonitoring();

        const status = manager.getStatus();
        expect(status.monitoring).toBe(false);
      });

      it('should call getFPS at intervals', () => {
        const getFPS = vi.fn(() => 60);
        manager.startMonitoring(getFPS);

        vi.advanceTimersByTime(5000);
        expect(getFPS).toHaveBeenCalledTimes(1);

        vi.advanceTimersByTime(5000);
        expect(getFPS).toHaveBeenCalledTimes(2);
      });

      it('should stop previous monitoring when starting new', () => {
        const getFPS1 = vi.fn(() => 60);
        const getFPS2 = vi.fn(() => 60);

        manager.startMonitoring(getFPS1);
        manager.startMonitoring(getFPS2);

        vi.advanceTimersByTime(5000);
        expect(getFPS1).not.toHaveBeenCalled();
        expect(getFPS2).toHaveBeenCalled();
      });
    });

    describe('Event Listeners', () => {
      it('should notify listeners on change', async () => {
        const listener = vi.fn();
        manager.onChange(listener);

        await manager.applyPreset(QualityMode.ULTRA);

        expect(listener).toHaveBeenCalledWith({
          from: QualityMode.BALANCED,
          to: QualityMode.ULTRA,
          reason: 'manual',
          timestamp: expect.any(Number)
        });
      });

      it('should support multiple listeners', async () => {
        const listener1 = vi.fn();
        const listener2 = vi.fn();

        manager.onChange(listener1);
        manager.onChange(listener2);

        await manager.applyPreset(QualityMode.MINIMAL);

        expect(listener1).toHaveBeenCalled();
        expect(listener2).toHaveBeenCalled();
      });

      it('should remove listener when unsubscribe called', async () => {
        const listener = vi.fn();
        const unsubscribe = manager.onChange(listener);

        unsubscribe();
        await manager.applyPreset(QualityMode.ULTRA);

        expect(listener).not.toHaveBeenCalled();
      });

      it('should handle listener errors gracefully', async () => {
        const errorListener = vi.fn(() => { throw new Error('Listener error'); });
        const goodListener = vi.fn();
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        manager.onChange(errorListener);
        manager.onChange(goodListener);

        await manager.applyPreset(QualityMode.MINIMAL);

        expect(errorListener).toHaveBeenCalled();
        expect(goodListener).toHaveBeenCalled();
        expect(consoleSpy).toHaveBeenCalled();

        consoleSpy.mockRestore();
      });
    });

    describe('Status', () => {
      it('should return complete status', () => {
        const status = manager.getStatus();

        expect(status).toMatchObject({
          currentMode: QualityMode.BALANCED,
          currentPreset: QUALITY_PRESETS[QualityMode.BALANCED],
          averageFPS: expect.any(Number),
          canUpgrade: true,
          canDowngrade: true,
          monitoring: false
        });
      });
    });
  });
});
