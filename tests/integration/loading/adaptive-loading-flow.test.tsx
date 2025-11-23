/**
 * Adaptive Loading Flow Integration Tests
 *
 * Tests complete loading sequence with FPS monitoring and quality adjustment
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, act, waitFor } from '@testing-library/react';
import React from 'react';
import { LoadingProvider } from '../../../src/components/LoadingProvider';
import { QualityPresetManager, QualityMode } from '../../../src/services/loading/QualityPresets';
import { LoadingPhase } from '../../../src/services/loading/types';

describe('Adaptive Loading Flow', () => {
  let manager: QualityPresetManager;

  beforeEach(() => {
    localStorage.clear();
    manager = new QualityPresetManager();
    vi.useFakeTimers();
  });

  afterEach(() => {
    manager.stopMonitoring();
    vi.restoreAllMocks();
  });

  describe('High-Performance Device (FPS ≥60)', () => {
    it('should complete all phases successfully', async () => {
      const { result } = renderWithLoading();

      // Simulate high FPS
      const mockFPS = 65;

      await act(async () => {
        result.startLoading();

        // Phase 1: Essential
        await simulatePhaseLoading(result, LoadingPhase.ESSENTIAL, mockFPS);
        expect(manager.getCurrentMode()).toBe(QualityMode.BALANCED);

        // Phase 2: Core
        await simulatePhaseLoading(result, LoadingPhase.CORE, mockFPS);

        // Phase 3: Visual
        await simulatePhaseLoading(result, LoadingPhase.VISUAL, mockFPS);

        // Phase 4: Enhanced
        await simulatePhaseLoading(result, LoadingPhase.ENHANCED, mockFPS);

        result.finishLoading();
      });

      expect(result.overallProgress).toBe(100);
      expect(result.isLoading).toBe(false);
    });

    it('should upgrade to ultra mode', async () => {
      const { result } = renderWithLoading();

      await act(async () => {
        result.startLoading();

        // Record consistently high FPS
        for (let i = 0; i < 10; i++) {
          manager.recordFPS(70);
        }

        // Wait for upgrade cooldown
        vi.advanceTimersByTime(61000);

        await manager.autoAdjust(70);
        expect(manager.getCurrentMode()).toBe(QualityMode.QUALITY);

        // Continue high FPS
        for (let i = 0; i < 10; i++) {
          manager.recordFPS(70);
        }

        vi.advanceTimersByTime(61000);
        await manager.autoAdjust(70);
        expect(manager.getCurrentMode()).toBe(QualityMode.ULTRA);
      });
    });

    it('should complete loading in 8-12 seconds', async () => {
      const { result } = renderWithLoading();
      const startTime = Date.now();

      await act(async () => {
        result.startLoading();

        // Simulate all phases
        await simulatePhaseLoading(result, LoadingPhase.ESSENTIAL, 65);
        await simulatePhaseLoading(result, LoadingPhase.CORE, 65);
        await simulatePhaseLoading(result, LoadingPhase.VISUAL, 65);
        await simulatePhaseLoading(result, LoadingPhase.ENHANCED, 65);

        result.finishLoading();
      });

      const duration = Date.now() - startTime;
      expect(duration).toBeGreaterThanOrEqual(8000);
      expect(duration).toBeLessThanOrEqual(12000);
    });
  });

  describe('Medium-Performance Device (FPS 40-50)', () => {
    it('should load phases 1-3 successfully', async () => {
      const { result } = renderWithLoading();

      await act(async () => {
        result.startLoading();

        // Phases load with acceptable FPS
        await simulatePhaseLoading(result, LoadingPhase.ESSENTIAL, 55);
        await simulatePhaseLoading(result, LoadingPhase.CORE, 48);
        await simulatePhaseLoading(result, LoadingPhase.VISUAL, 42);

        result.finishLoading();
      });

      expect(result.loadedCount).toBeGreaterThan(0);
      expect(manager.getCurrentMode()).toBe(QualityMode.BALANCED);
    });

    it('should recommend balanced mode', async () => {
      const { result } = renderWithLoading();

      await act(async () => {
        result.startLoading();

        // Record medium FPS
        for (let i = 0; i < 10; i++) {
          manager.recordFPS(45);
        }

        vi.advanceTimersByTime(11000);
        await manager.autoAdjust(45);

        // Should maintain balanced mode
        expect(manager.getCurrentMode()).toBe(QualityMode.BALANCED);
      });
    });

    it('should complete loading in 6-8 seconds', async () => {
      const { result } = renderWithLoading();
      const startTime = Date.now();

      await act(async () => {
        result.startLoading();

        await simulatePhaseLoading(result, LoadingPhase.ESSENTIAL, 55);
        await simulatePhaseLoading(result, LoadingPhase.CORE, 48);
        await simulatePhaseLoading(result, LoadingPhase.VISUAL, 42);

        result.finishLoading();
      });

      const duration = Date.now() - startTime;
      expect(duration).toBeGreaterThanOrEqual(6000);
      expect(duration).toBeLessThanOrEqual(8000);
    });
  });

  describe('Low-Performance Device (FPS <30)', () => {
    it('should detect low FPS in phase 1', async () => {
      const { result } = renderWithLoading();

      await act(async () => {
        result.startLoading();

        // Record very low FPS
        for (let i = 0; i < 10; i++) {
          manager.recordFPS(25);
        }

        vi.advanceTimersByTime(11000);
        await manager.autoAdjust(25);

        expect(manager.getCurrentMode()).toBe(QualityMode.MINIMAL);
      });
    });

    it('should recommend minimal mode immediately', async () => {
      const { result } = renderWithLoading();

      await act(async () => {
        result.startLoading();

        await simulatePhaseLoading(result, LoadingPhase.ESSENTIAL, 25);

        // Should downgrade to minimal
        for (let i = 0; i < 10; i++) {
          manager.recordFPS(25);
        }

        vi.advanceTimersByTime(11000);
        await manager.autoAdjust(25);

        expect(manager.getCurrentMode()).toBe(QualityMode.MINIMAL);
      });
    });

    it('should load minimal mode in 2-3 seconds', async () => {
      const { result } = renderWithLoading();
      const startTime = Date.now();

      await act(async () => {
        await manager.applyPreset(QualityMode.MINIMAL);
        result.startLoading();

        await simulatePhaseLoading(result, LoadingPhase.ESSENTIAL, 55);

        result.finishLoading();
      });

      const duration = Date.now() - startTime;
      expect(duration).toBeGreaterThanOrEqual(2000);
      expect(duration).toBeLessThanOrEqual(3000);
    });
  });

  describe('Edge Cases', () => {
    it('should handle user navigation during loading', async () => {
      const { result, unmount } = renderWithLoading();

      await act(async () => {
        result.startLoading();
        await simulatePhaseLoading(result, LoadingPhase.ESSENTIAL, 60);

        // User navigates away
        unmount();

        // Should cleanup properly
        expect(manager.getStatus().monitoring).toBe(false);
      });
    });

    it('should handle network interruption during asset load', async () => {
      const { result } = renderWithLoading();

      await act(async () => {
        result.startLoading();

        // Simulate network error
        result.markAssetError('geometry-tennis-court-1', 'Network timeout');

        // Should continue with other assets
        await waitFor(() => {
          expect(result.assets.some(a => a.error)).toBe(true);
        });
      });
    });

    it('should handle browser tab backgrounded', async () => {
      const { result } = renderWithLoading();

      await act(async () => {
        result.startLoading();

        // Simulate tab backgrounded (FPS drops to 0)
        Object.defineProperty(document, 'hidden', {
          configurable: true,
          get: () => true
        });

        manager.recordFPS(0);

        // Should pause loading or adjust accordingly
        await waitFor(() => {
          expect(manager.getCurrentMode()).toBeDefined();
        });
      });
    });

    it('should handle multiple rapid quality changes', async () => {
      await act(async () => {
        await manager.applyPreset(QualityMode.ULTRA);
        await manager.applyPreset(QualityMode.MINIMAL);
        await manager.applyPreset(QualityMode.BALANCED);

        // Should end on last applied preset
        expect(manager.getCurrentMode()).toBe(QualityMode.BALANCED);
      });
    });

    it('should recover from FPS spike', async () => {
      await act(async () => {
        // Start with good FPS
        for (let i = 0; i < 10; i++) {
          manager.recordFPS(60);
        }

        // Temporary FPS drop (single spike)
        manager.recordFPS(20);

        // FPS recovers
        for (let i = 0; i < 10; i++) {
          manager.recordFPS(60);
        }

        vi.advanceTimersByTime(11000);

        // Should not downgrade due to single spike
        const avgFPS = manager.getStatus().averageFPS;
        expect(avgFPS).toBeGreaterThan(50);
      });
    });

    it('should handle localStorage unavailable', async () => {
      const originalLocalStorage = window.localStorage;

      // Simulate localStorage quota exceeded
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: vi.fn(() => null),
          setItem: vi.fn(() => { throw new Error('QuotaExceededError'); }),
          removeItem: vi.fn(),
          clear: vi.fn()
        },
        writable: true
      });

      const newManager = new QualityPresetManager();

      await act(async () => {
        await newManager.applyPreset(QualityMode.ULTRA);
        // Should not throw
        expect(newManager.getCurrentMode()).toBe(QualityMode.ULTRA);
      });

      // Restore
      Object.defineProperty(window, 'localStorage', {
        value: originalLocalStorage,
        writable: true
      });
    });
  });

  describe('Performance Benchmarks', () => {
    it('should track asset load times', async () => {
      const { result } = renderWithLoading();

      await act(async () => {
        result.startLoading();

        const assets = ['asset-1', 'asset-2', 'asset-3'];
        const startTimes = new Map();

        assets.forEach(id => {
          result.registerAsset({ id, name: id, type: 'model', priority: 'high' });
          startTimes.set(id, Date.now());
        });

        for (const id of assets) {
          await new Promise(resolve => setTimeout(resolve, 100));
          result.markAssetLoaded(id);

          const loadTime = Date.now() - startTimes.get(id)!;
          expect(loadTime).toBeGreaterThan(0);
        }
      });
    });

    it('should measure total loading duration', async () => {
      const { result } = renderWithLoading();

      const startTime = Date.now();

      await act(async () => {
        result.startLoading();

        await simulatePhaseLoading(result, LoadingPhase.ESSENTIAL, 60);
        await simulatePhaseLoading(result, LoadingPhase.CORE, 60);

        result.finishLoading();
      });

      const totalDuration = Date.now() - startTime;
      expect(totalDuration).toBeGreaterThan(0);
    });
  });
});

// Helper Functions

function renderWithLoading() {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <LoadingProvider>{children}</LoadingProvider>
  );

  const { result, unmount } = renderHook(() => useLoading(), { wrapper });

  return { result: result.current, unmount };
}

async function simulatePhaseLoading(
  loadingContext: any,
  phase: LoadingPhase,
  fps: number
): Promise<void> {
  // Simulate FPS monitoring during phase
  for (let i = 0; i < 5; i++) {
    manager.recordFPS(fps);
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Simulate phase completion
  await new Promise(resolve => setTimeout(resolve, 500));
}

// Mock hook for testing
function useLoading() {
  const context = React.useContext(LoadingContext);
  if (!context) throw new Error('useLoading must be used within LoadingProvider');
  return context;
}

const LoadingContext = React.createContext<any>(null);
