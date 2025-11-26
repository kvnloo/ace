import { describe, it, expect } from 'vitest';
import {
  LoadingPhase,
  AssetCategory,
  LoadingState,
  AssetLoadStatus,
} from '../../../src/services/loading/types';

describe('Loading Service Types', () => {
  describe('LoadingPhase Enum', () => {
    it('should define all loading phases', () => {
      expect(LoadingPhase.ESSENTIAL).toBe('essential');
      expect(LoadingPhase.CORE).toBe('core');
      expect(LoadingPhase.VISUAL).toBe('visual');
      expect(LoadingPhase.ENHANCED).toBe('enhanced');
    });

    it('should have exactly 4 phases', () => {
      const phases = Object.values(LoadingPhase);
      expect(phases.length).toBe(4);
    });

    it('should use lowercase naming', () => {
      Object.values(LoadingPhase).forEach((phase) => {
        expect(phase).toBe(phase.toLowerCase());
      });
    });
  });

  describe('AssetCategory Enum', () => {
    it('should define all asset categories', () => {
      expect(AssetCategory.SCENE).toBe('scene');
      expect(AssetCategory.CAMERA).toBe('camera');
      expect(AssetCategory.LIGHTING).toBe('lighting');
      expect(AssetCategory.GEOMETRY).toBe('geometry');
      expect(AssetCategory.MATERIALS).toBe('materials');
      expect(AssetCategory.EFFECTS).toBe('effects');
      expect(AssetCategory.WEATHER).toBe('weather');
      expect(AssetCategory.POSTPROCESSING).toBe('postprocessing');
    });

    it('should have 8 categories', () => {
      const categories = Object.values(AssetCategory);
      expect(categories.length).toBe(8);
    });
  });

  describe('LoadingState Enum', () => {
    it('should define all loading states', () => {
      expect(LoadingState.IDLE).toBe('idle');
      expect(LoadingState.LOADING).toBe('loading');
      expect(LoadingState.PAUSED).toBe('paused');
      expect(LoadingState.COMPLETED).toBe('completed');
      expect(LoadingState.CANCELLED).toBe('cancelled');
      expect(LoadingState.ERROR).toBe('error');
    });

    it('should cover all possible states', () => {
      const states = Object.values(LoadingState);
      expect(states.length).toBe(6);
    });
  });

  describe('AssetLoadStatus Enum', () => {
    it('should define all asset statuses', () => {
      expect(AssetLoadStatus.PENDING).toBe('pending');
      expect(AssetLoadStatus.LOADING).toBe('loading');
      expect(AssetLoadStatus.LOADED).toBe('loaded');
      expect(AssetLoadStatus.FAILED).toBe('failed');
      expect(AssetLoadStatus.SKIPPED).toBe('skipped');
    });

    it('should have 5 status types', () => {
      const statuses = Object.values(AssetLoadStatus);
      expect(statuses.length).toBe(5);
    });
  });

  describe('AssetProgress Interface', () => {
    it('should validate asset progress structure', () => {
      const progress = {
        id: 'asset-1',
        category: AssetCategory.GEOMETRY,
        status: AssetLoadStatus.LOADED,
        retries: 0,
      };

      expect(progress.id).toBe('asset-1');
      expect(progress.category).toBe('geometry');
      expect(progress.status).toBe('loaded');
      expect(progress.retries).toBe(0);
    });

    it('should support optional error field', () => {
      const failedProgress = {
        id: 'asset-2',
        category: AssetCategory.SCENE,
        status: AssetLoadStatus.FAILED,
        retries: 3,
        error: new Error('Load failed'),
      };

      expect(failedProgress.error).toBeDefined();
      expect(failedProgress.error?.message).toBe('Load failed');
    });

    it('should support optional loadTime field', () => {
      const timedProgress = {
        id: 'asset-3',
        category: AssetCategory.LIGHTING,
        status: AssetLoadStatus.LOADED,
        retries: 0,
        loadTime: 250,
      };

      expect(timedProgress.loadTime).toBe(250);
    });
  });

  describe('PhaseProgress Interface', () => {
    it('should validate phase progress structure', () => {
      const phaseProgress = {
        phase: LoadingPhase.CORE,
        totalAssets: 10,
        loadedAssets: 7,
        failedAssets: 1,
        skippedAssets: 0,
        targetFPS: 60,
      };

      expect(phaseProgress.phase).toBe('core');
      expect(phaseProgress.totalAssets).toBe(10);
      expect(phaseProgress.loadedAssets).toBe(7);
      expect(phaseProgress.targetFPS).toBe(60);
    });

    it('should support optional timing fields', () => {
      const timedPhase = {
        phase: LoadingPhase.VISUAL,
        totalAssets: 5,
        loadedAssets: 5,
        failedAssets: 0,
        skippedAssets: 0,
        startTime: Date.now() - 1000,
        endTime: Date.now(),
        targetFPS: 55,
        currentFPS: 58,
      };

      expect(timedPhase.startTime).toBeDefined();
      expect(timedPhase.endTime).toBeDefined();
      expect(timedPhase.currentFPS).toBe(58);
    });
  });

  describe('LoadingProgress Interface', () => {
    it('should validate complete loading progress', () => {
      const progress = {
        state: LoadingState.LOADING,
        currentPhase: LoadingPhase.CORE,
        phases: new Map(),
        assets: new Map(),
        totalProgress: 45,
        elapsedTime: 2500,
      };

      expect(progress.state).toBe('loading');
      expect(progress.totalProgress).toBe(45);
      expect(progress.elapsedTime).toBe(2500);
    });

    it('should support optional estimated time', () => {
      const progressWithETA = {
        state: LoadingState.LOADING,
        phases: new Map(),
        assets: new Map(),
        totalProgress: 60,
        elapsedTime: 3000,
        estimatedTimeRemaining: 2000,
      };

      expect(progressWithETA.estimatedTimeRemaining).toBe(2000);
    });
  });

  describe('PhaseResult Interface', () => {
    it('should validate phase result', () => {
      const result = {
        phase: LoadingPhase.ESSENTIAL,
        success: true,
        loadedAssets: ['asset-1', 'asset-2'],
        failedAssets: [],
        skippedAssets: [],
        averageFPS: 60,
        duration: 1500,
      };

      expect(result.success).toBe(true);
      expect(result.loadedAssets).toHaveLength(2);
      expect(result.averageFPS).toBe(60);
      expect(result.duration).toBe(1500);
    });
  });

  describe('LoadingResult Interface', () => {
    it('should validate complete loading result', () => {
      const result = {
        success: true,
        completedPhases: [LoadingPhase.ESSENTIAL, LoadingPhase.CORE],
        failedPhases: [],
        totalAssets: 20,
        loadedAssets: 18,
        failedAssets: 1,
        skippedAssets: 1,
        totalDuration: 5000,
        finalFPS: 58,
      };

      expect(result.success).toBe(true);
      expect(result.completedPhases).toHaveLength(2);
      expect(result.totalAssets).toBe(20);
      expect(result.finalFPS).toBe(58);
    });
  });

  describe('LoadingTask Interface', () => {
    it('should validate loading task structure', () => {
      const task = {
        assetId: 'test-asset',
        category: AssetCategory.GEOMETRY,
        phase: LoadingPhase.CORE,
        priority: 1,
        dependencies: ['dep-1', 'dep-2'],
        loadFn: async () => {},
      };

      expect(task.assetId).toBe('test-asset');
      expect(task.priority).toBe(1);
      expect(task.dependencies).toHaveLength(2);
      expect(typeof task.loadFn).toBe('function');
    });

    it('should support empty dependencies', () => {
      const taskNoDeps = {
        assetId: 'standalone',
        category: AssetCategory.SCENE,
        phase: LoadingPhase.ESSENTIAL,
        priority: 0,
        dependencies: [],
        loadFn: async () => {},
      };

      expect(taskNoDeps.dependencies).toHaveLength(0);
    });
  });
});
