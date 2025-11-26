/**
 * Loading Phases Unit Tests
 *
 * Tests phase definitions and phase progression logic
 */

import { describe, it, expect } from 'vitest';
import {
  LoadingPhase,
  AssetCategory
} from '../../../src/services/loading/types';
import {
  ESSENTIAL_PHASE,
  CORE_PHASE,
  VISUAL_PHASE,
  ENHANCED_PHASE,
  LOADING_PHASES,
  getPhaseDefinition,
  getNextPhase,
  getPreviousPhase,
  isPhasePerformanceAcceptable,
  getTotalEstimatedDuration,
  getPhaseForAsset
} from '../../../src/services/loading/phases';

describe('Loading Phases', () => {
  describe('Phase Definitions', () => {
    it('should have all phases defined', () => {
      expect(ESSENTIAL_PHASE).toBeDefined();
      expect(CORE_PHASE).toBeDefined();
      expect(VISUAL_PHASE).toBeDefined();
      expect(ENHANCED_PHASE).toBeDefined();
    });

    it('should have correct phase order in LOADING_PHASES', () => {
      expect(LOADING_PHASES).toHaveLength(4);
      expect(LOADING_PHASES[0].phase).toBe(LoadingPhase.ESSENTIAL);
      expect(LOADING_PHASES[1].phase).toBe(LoadingPhase.CORE);
      expect(LOADING_PHASES[2].phase).toBe(LoadingPhase.VISUAL);
      expect(LOADING_PHASES[3].phase).toBe(LoadingPhase.ENHANCED);
    });

    it('should have decreasing target FPS across phases', () => {
      expect(ESSENTIAL_PHASE.targetFPS).toBeGreaterThan(CORE_PHASE.targetFPS);
      expect(CORE_PHASE.targetFPS).toBeGreaterThan(VISUAL_PHASE.targetFPS);
      expect(VISUAL_PHASE.targetFPS).toBeGreaterThan(ENHANCED_PHASE.targetFPS);
    });

    it('should have increasing estimated duration across phases', () => {
      expect(CORE_PHASE.estimatedDuration).toBeGreaterThan(ESSENTIAL_PHASE.estimatedDuration);
      expect(VISUAL_PHASE.estimatedDuration).toBeGreaterThan(CORE_PHASE.estimatedDuration);
      expect(ENHANCED_PHASE.estimatedDuration).toBeGreaterThan(VISUAL_PHASE.estimatedDuration);
    });

    it('should have valid asset categories', () => {
      const validCategories = Object.values(AssetCategory);

      LOADING_PHASES.forEach(phase => {
        phase.categories.forEach(category => {
          expect(validCategories).toContain(category);
        });
      });
    });

    it('should have non-empty asset lists', () => {
      LOADING_PHASES.forEach(phase => {
        expect(phase.assets.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Essential Phase', () => {
    it('should load critical systems first', () => {
      expect(ESSENTIAL_PHASE.categories).toContain(AssetCategory.SCENE);
      expect(ESSENTIAL_PHASE.categories).toContain(AssetCategory.CAMERA);
      expect(ESSENTIAL_PHASE.categories).toContain(AssetCategory.LIGHTING);
      expect(ESSENTIAL_PHASE.categories).toContain(AssetCategory.GEOMETRY);
    });

    it('should have highest target FPS', () => {
      expect(ESSENTIAL_PHASE.targetFPS).toBe(60);
    });

    it('should have shortest estimated duration', () => {
      expect(ESSENTIAL_PHASE.estimatedDuration).toBe(2);
    });

    it('should include scene container', () => {
      expect(ESSENTIAL_PHASE.assets).toContain('scene-container');
    });

    it('should include camera system', () => {
      expect(ESSENTIAL_PHASE.assets).toContain('camera-main');
      expect(ESSENTIAL_PHASE.assets).toContain('camera-controller');
    });

    it('should include basic lighting', () => {
      expect(ESSENTIAL_PHASE.assets).toContain('light-ambient');
    });
  });

  describe('Core Phase', () => {
    it('should load tennis courts', () => {
      expect(CORE_PHASE.assets).toContain('geometry-tennis-court-1');
      expect(CORE_PHASE.assets).toContain('geometry-tennis-court-2');
      expect(CORE_PHASE.assets).toContain('geometry-tennis-court-3');
      expect(CORE_PHASE.assets).toContain('geometry-tennis-court-4');
    });

    it('should include court details', () => {
      expect(CORE_PHASE.assets).toContain('geometry-court-lines');
      expect(CORE_PHASE.assets).toContain('geometry-court-nets');
    });

    it('should have geometry and materials categories', () => {
      expect(CORE_PHASE.categories).toContain(AssetCategory.GEOMETRY);
      expect(CORE_PHASE.categories).toContain(AssetCategory.MATERIALS);
    });
  });

  describe('Visual Phase', () => {
    it('should include grass system', () => {
      expect(VISUAL_PHASE.assets).toContain('geometry-grass-system');
    });

    it('should include enhanced lighting', () => {
      expect(VISUAL_PHASE.assets).toContain('light-directional-sun');
      expect(VISUAL_PHASE.assets).toContain('light-spot-court-1');
      expect(VISUAL_PHASE.assets).toContain('light-spot-court-2');
    });

    it('should include weather system', () => {
      expect(VISUAL_PHASE.assets).toContain('weather-system-basic');
    });

    it('should have weather category', () => {
      expect(VISUAL_PHASE.categories).toContain(AssetCategory.WEATHER);
    });
  });

  describe('Enhanced Phase', () => {
    it('should include particle effects', () => {
      expect(ENHANCED_PHASE.assets).toContain('effects-particles-dust');
      expect(ENHANCED_PHASE.assets).toContain('effects-particles-rain');
    });

    it('should include post-processing effects', () => {
      expect(ENHANCED_PHASE.assets).toContain('postprocessing-bloom');
      expect(ENHANCED_PHASE.assets).toContain('postprocessing-ssao');
      expect(ENHANCED_PHASE.assets).toContain('postprocessing-tone-mapping');
    });

    it('should include advanced weather', () => {
      expect(ENHANCED_PHASE.assets).toContain('weather-system-advanced');
      expect(ENHANCED_PHASE.assets).toContain('weather-wind');
      expect(ENHANCED_PHASE.assets).toContain('weather-clouds');
    });

    it('should have effects and post-processing categories', () => {
      expect(ENHANCED_PHASE.categories).toContain(AssetCategory.EFFECTS);
      expect(ENHANCED_PHASE.categories).toContain(AssetCategory.POSTPROCESSING);
    });

    it('should have lowest target FPS', () => {
      expect(ENHANCED_PHASE.targetFPS).toBe(40);
    });
  });

  describe('Helper Functions', () => {
    describe('getPhaseDefinition', () => {
      it('should return correct phase definition', () => {
        const definition = getPhaseDefinition(LoadingPhase.CORE);
        expect(definition).toEqual(CORE_PHASE);
      });

      it('should throw for invalid phase', () => {
        expect(() => {
          getPhaseDefinition('invalid' as LoadingPhase);
        }).toThrow('Phase definition not found');
      });
    });

    describe('getNextPhase', () => {
      it('should return next phase in sequence', () => {
        expect(getNextPhase(LoadingPhase.ESSENTIAL)).toBe(LoadingPhase.CORE);
        expect(getNextPhase(LoadingPhase.CORE)).toBe(LoadingPhase.VISUAL);
        expect(getNextPhase(LoadingPhase.VISUAL)).toBe(LoadingPhase.ENHANCED);
      });

      it('should return null for last phase', () => {
        expect(getNextPhase(LoadingPhase.ENHANCED)).toBeNull();
      });

      it('should return null for invalid phase', () => {
        expect(getNextPhase('invalid' as LoadingPhase)).toBeNull();
      });
    });

    describe('getPreviousPhase', () => {
      it('should return previous phase in sequence', () => {
        expect(getPreviousPhase(LoadingPhase.ENHANCED)).toBe(LoadingPhase.VISUAL);
        expect(getPreviousPhase(LoadingPhase.VISUAL)).toBe(LoadingPhase.CORE);
        expect(getPreviousPhase(LoadingPhase.CORE)).toBe(LoadingPhase.ESSENTIAL);
      });

      it('should return null for first phase', () => {
        expect(getPreviousPhase(LoadingPhase.ESSENTIAL)).toBeNull();
      });

      it('should return null for invalid phase', () => {
        expect(getPreviousPhase('invalid' as LoadingPhase)).toBeNull();
      });
    });

    describe('isPhasePerformanceAcceptable', () => {
      it('should return true when FPS meets target', () => {
        expect(isPhasePerformanceAcceptable(LoadingPhase.ESSENTIAL, 60)).toBe(true);
        expect(isPhasePerformanceAcceptable(LoadingPhase.CORE, 50)).toBe(true);
        expect(isPhasePerformanceAcceptable(LoadingPhase.VISUAL, 45)).toBe(true);
      });

      it('should return true when FPS exceeds target', () => {
        expect(isPhasePerformanceAcceptable(LoadingPhase.ESSENTIAL, 70)).toBe(true);
        expect(isPhasePerformanceAcceptable(LoadingPhase.CORE, 60)).toBe(true);
      });

      it('should return false when FPS below target', () => {
        expect(isPhasePerformanceAcceptable(LoadingPhase.ESSENTIAL, 50)).toBe(false);
        expect(isPhasePerformanceAcceptable(LoadingPhase.CORE, 40)).toBe(false);
        expect(isPhasePerformanceAcceptable(LoadingPhase.VISUAL, 30)).toBe(false);
      });
    });

    describe('getTotalEstimatedDuration', () => {
      it('should sum all phase durations', () => {
        const total = getTotalEstimatedDuration();
        const expected = ESSENTIAL_PHASE.estimatedDuration +
                        CORE_PHASE.estimatedDuration +
                        VISUAL_PHASE.estimatedDuration +
                        ENHANCED_PHASE.estimatedDuration;
        expect(total).toBe(expected);
      });

      it('should return correct total', () => {
        expect(getTotalEstimatedDuration()).toBe(27); // 2 + 5 + 8 + 12
      });
    });

    describe('getPhaseForAsset', () => {
      it('should return correct phase for asset', () => {
        expect(getPhaseForAsset('scene-container')).toBe(LoadingPhase.ESSENTIAL);
        expect(getPhaseForAsset('geometry-tennis-court-1')).toBe(LoadingPhase.CORE);
        expect(getPhaseForAsset('geometry-grass-system')).toBe(LoadingPhase.VISUAL);
        expect(getPhaseForAsset('postprocessing-bloom')).toBe(LoadingPhase.ENHANCED);
      });

      it('should return null for unknown asset', () => {
        expect(getPhaseForAsset('unknown-asset')).toBeNull();
      });
    });
  });

  describe('Phase Consistency', () => {
    it('should have unique asset IDs across all phases', () => {
      const allAssets = LOADING_PHASES.flatMap(phase => phase.assets);
      const uniqueAssets = new Set(allAssets);
      expect(uniqueAssets.size).toBe(allAssets.length);
    });

    it('should have proper naming convention for assets', () => {
      LOADING_PHASES.forEach(phase => {
        phase.assets.forEach(asset => {
          // Should be kebab-case
          expect(asset).toMatch(/^[a-z-]+$/);

          // Should have category prefix
          const hasValidPrefix = [
            'scene-', 'camera-', 'light-', 'geometry-',
            'material-', 'effects-', 'weather-', 'postprocessing-'
          ].some(prefix => asset.startsWith(prefix));
          expect(hasValidPrefix).toBe(true);
        });
      });
    });

    it('should have increasing asset counts', () => {
      const assetCounts = LOADING_PHASES.map(phase => phase.assets.length);

      // Each phase should have more assets than previous or same
      for (let i = 1; i < assetCounts.length; i++) {
        expect(assetCounts[i]).toBeGreaterThanOrEqual(assetCounts[i - 1]);
      }
    });
  });
});
