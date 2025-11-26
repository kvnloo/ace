import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { LoadingProvider } from '../../src/components/loading/LoadingProvider';
import LoadingScreen from '../../src/components/loading/LoadingScreen';
import { FPSMonitorProvider } from '../../src/components/performance/FPSMonitorContext';

// Mock asset registry with realistic behavior
class MockAssetRegistry {
  private loaded = 0;
  private total = 20;
  private assets: Map<string, any> = new Map();

  registerAsset(id: string, phase: string, category: string) {
    this.assets.set(id, { id, phase, category, status: 'pending', retries: 0 });
  }

  markAssetLoaded(id: string) {
    const asset = this.assets.get(id);
    if (asset) {
      asset.status = 'loaded';
      this.loaded++;
    }
  }

  getLoadedCount() {
    return this.loaded;
  }

  getTotalCount() {
    return this.total;
  }

  getProgress() {
    return (this.loaded / this.total) * 100;
  }

  getAssetsByPhase(phase?: string) {
    return Array.from(this.assets.values()).filter(
      (a) => !phase || a.phase === phase
    );
  }

  getAll() {
    return Array.from(this.assets.values());
  }

  simulateLoading(count: number) {
    const ids = Array.from(this.assets.keys());
    for (let i = 0; i < Math.min(count, ids.length); i++) {
      this.markAssetLoaded(ids[i]);
    }
  }
}

describe('Loading Workflow Integration', () => {
  let mockRegistry: MockAssetRegistry;

  beforeEach(() => {
    mockRegistry = new MockAssetRegistry();
    // Register mock assets
    for (let i = 0; i < 20; i++) {
      mockRegistry.registerAsset(
        `asset-${i}`,
        i < 5 ? 'essential' : i < 10 ? 'core' : i < 15 ? 'visual' : 'enhanced',
        i % 2 === 0 ? 'scene' : 'geometry'
      );
    }
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  const renderLoadingWorkflow = (onComplete: () => void) => {
    return render(
      <FPSMonitorProvider>
        <LoadingProvider registry={mockRegistry}>
          <LoadingScreen onComplete={onComplete} minimumDisplayTime={1000} />
        </LoadingProvider>
      </FPSMonitorProvider>
    );
  };

  it('should complete full loading workflow', async () => {
    const onComplete = vi.fn();
    renderLoadingWorkflow(onComplete);

    // Simulate progressive loading
    mockRegistry.simulateLoading(5); // Load essential assets
    vi.advanceTimersByTime(300);

    mockRegistry.simulateLoading(5); // Load core assets
    vi.advanceTimersByTime(300);

    mockRegistry.simulateLoading(10); // Load remaining assets
    vi.advanceTimersByTime(500);

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  it('should track loading progress correctly', async () => {
    const onComplete = vi.fn();
    renderLoadingWorkflow(onComplete);

    expect(mockRegistry.getProgress()).toBe(0);

    mockRegistry.simulateLoading(10);
    expect(mockRegistry.getProgress()).toBe(50);

    mockRegistry.simulateLoading(10);
    expect(mockRegistry.getProgress()).toBe(100);

    vi.advanceTimersByTime(1200);

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalled();
    });
  });

  it('should respect minimum display time', async () => {
    const onComplete = vi.fn();
    const minimumTime = 2000;

    render(
      <FPSMonitorProvider>
        <LoadingProvider registry={mockRegistry}>
          <LoadingScreen onComplete={onComplete} minimumDisplayTime={minimumTime} />
        </LoadingProvider>
      </FPSMonitorProvider>
    );

    // Instantly load everything
    mockRegistry.simulateLoading(20);

    vi.advanceTimersByTime(minimumTime - 100);
    expect(onComplete).not.toHaveBeenCalled();

    vi.advanceTimersByTime(200);

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalled();
    });
  });

  it('should handle phased loading correctly', async () => {
    const onComplete = vi.fn();
    renderLoadingWorkflow(onComplete);

    // Load essential phase
    const essentialAssets = mockRegistry.getAssetsByPhase('essential');
    expect(essentialAssets.length).toBe(5);

    mockRegistry.simulateLoading(5);
    vi.advanceTimersByTime(300);

    expect(mockRegistry.getLoadedCount()).toBe(5);

    // Load core phase
    mockRegistry.simulateLoading(5);
    vi.advanceTimersByTime(300);

    expect(mockRegistry.getLoadedCount()).toBe(10);

    // Complete loading
    mockRegistry.simulateLoading(10);
    vi.advanceTimersByTime(500);

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalled();
    });
  });

  it('should provide accurate progress updates', () => {
    const onComplete = vi.fn();
    renderLoadingWorkflow(onComplete);

    const checkpoints = [0, 5, 10, 15, 20];

    checkpoints.forEach((count) => {
      mockRegistry.loaded = count;
      const progress = mockRegistry.getProgress();
      expect(progress).toBe((count / 20) * 100);
    });
  });

  it('should handle rapid asset loading', async () => {
    const onComplete = vi.fn();
    renderLoadingWorkflow(onComplete);

    // Load all assets rapidly
    for (let i = 0; i < 20; i++) {
      mockRegistry.simulateLoading(1);
      vi.advanceTimersByTime(10);
    }

    expect(mockRegistry.getProgress()).toBe(100);

    vi.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalled();
    });
  });

  it('should integrate with FPS monitoring during load', async () => {
    const onComplete = vi.fn();

    const { container } = render(
      <FPSMonitorProvider>
        <LoadingProvider registry={mockRegistry}>
          <LoadingScreen onComplete={onComplete} minimumDisplayTime={1000} showFPSMonitor={true} />
        </LoadingProvider>
      </FPSMonitorProvider>
    );

    mockRegistry.simulateLoading(20);
    vi.advanceTimersByTime(1200);

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalled();
    });

    expect(container).toBeDefined();
  });

  it('should handle empty asset registry', async () => {
    const emptyRegistry = new MockAssetRegistry();
    emptyRegistry['total'] = 0;
    emptyRegistry['loaded'] = 0;

    const onComplete = vi.fn();

    render(
      <FPSMonitorProvider>
        <LoadingProvider registry={emptyRegistry}>
          <LoadingScreen onComplete={onComplete} minimumDisplayTime={100} />
        </LoadingProvider>
      </FPSMonitorProvider>
    );

    vi.advanceTimersByTime(200);

    // Should complete even with no assets
    await waitFor(() => {
      expect(onComplete).toHaveBeenCalled();
    });
  });

  it('should maintain loading state consistency', () => {
    const onComplete = vi.fn();
    renderLoadingWorkflow(onComplete);

    // Verify initial state
    expect(mockRegistry.getLoadedCount()).toBe(0);
    expect(mockRegistry.getTotalCount()).toBe(20);

    // Load some assets
    mockRegistry.simulateLoading(7);

    expect(mockRegistry.getLoadedCount()).toBe(7);
    expect(mockRegistry.getTotalCount()).toBe(20);
    expect(mockRegistry.getProgress()).toBe(35);
  });

  it('should complete within reasonable time bounds', async () => {
    const onComplete = vi.fn();
    const startTime = Date.now();

    renderLoadingWorkflow(onComplete);

    mockRegistry.simulateLoading(20);
    vi.advanceTimersByTime(1200);

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalled();
    });

    // Should complete within a reasonable time
    const duration = Date.now() - startTime;
    expect(duration).toBeLessThan(5000);
  });
});
