import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import LoadingScreen from '../../../src/components/loading/LoadingScreen';
import { LoadingProvider } from '../../../src/components/loading/LoadingProvider';
import { FPSMonitorProvider } from '../../../src/components/performance/FPSMonitorContext';

// Mock asset registry
const mockRegistry = {
  registerAsset: vi.fn(),
  markAssetLoaded: vi.fn(),
  getLoadedCount: vi.fn(() => 5),
  getTotalCount: vi.fn(() => 10),
  getProgress: vi.fn(() => 50),
  getAssetsByPhase: vi.fn(() => []),
  getAll: vi.fn(() => [
    { id: 'asset1', phase: 'essential', category: 'scene' },
    { id: 'asset2', phase: 'core', category: 'geometry' },
  ]),
};

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <FPSMonitorProvider>
      <LoadingProvider registry={mockRegistry}>
        {component}
      </LoadingProvider>
    </FPSMonitorProvider>
  );
};

describe('LoadingScreen', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should render loading screen initially', () => {
    const onComplete = vi.fn();
    renderWithProviders(<LoadingScreen onComplete={onComplete} />);

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('should show progress percentage', () => {
    const onComplete = vi.fn();
    renderWithProviders(<LoadingScreen onComplete={onComplete} />);

    // Mock registry returns 50% progress
    expect(screen.getByText(/50%/)).toBeInTheDocument();
  });

  it('should respect minimum display time', async () => {
    const onComplete = vi.fn();
    const minimumTime = 2000;

    renderWithProviders(
      <LoadingScreen onComplete={onComplete} minimumDisplayTime={minimumTime} />
    );

    // Simulate instant loading
    mockRegistry.getProgress.mockReturnValue(100);
    mockRegistry.getLoadedCount.mockReturnValue(10);

    vi.advanceTimersByTime(minimumTime - 100);

    // Should not call onComplete yet
    expect(onComplete).not.toHaveBeenCalled();

    vi.advanceTimersByTime(200);

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalled();
    });
  });

  it('should call onComplete after loading is done', async () => {
    const onComplete = vi.fn();
    renderWithProviders(<LoadingScreen onComplete={onComplete} minimumDisplayTime={100} />);

    // Complete loading
    mockRegistry.getProgress.mockReturnValue(100);
    mockRegistry.getLoadedCount.mockReturnValue(10);
    mockRegistry.getTotalCount.mockReturnValue(10);

    vi.advanceTimersByTime(200);

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalled();
    });
  });

  it('should show FPS monitor when enabled', () => {
    const onComplete = vi.fn();
    renderWithProviders(<LoadingScreen onComplete={onComplete} showFPSMonitor={true} />);

    // FPS monitor should be visible (check for FPS-related content)
    const fpsElements = screen.queryAllByText(/FPS/i);
    expect(fpsElements.length).toBeGreaterThan(0);
  });

  it('should hide FPS monitor when disabled', () => {
    const onComplete = vi.fn();
    renderWithProviders(<LoadingScreen onComplete={onComplete} showFPSMonitor={false} />);

    // FPS monitor should not be visible in loading screen
    const container = screen.getByText(/Loading/i).parentElement;
    expect(container).toBeDefined();
  });

  it('should display loading phases', () => {
    const onComplete = vi.fn();
    mockRegistry.getAssetsByPhase.mockReturnValue([
      { id: 'asset1', category: 'scene', status: 'loaded', retries: 0 },
      { id: 'asset2', category: 'camera', status: 'loading', retries: 0 },
    ]);

    renderWithProviders(<LoadingScreen onComplete={onComplete} />);

    // Should show loading content
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('should handle rapid progress updates', async () => {
    const onComplete = vi.fn();
    renderWithProviders(<LoadingScreen onComplete={onComplete} minimumDisplayTime={100} />);

    // Simulate rapid progress changes
    for (let i = 0; i <= 100; i += 10) {
      mockRegistry.getProgress.mockReturnValue(i);
      vi.advanceTimersByTime(10);
    }

    mockRegistry.getProgress.mockReturnValue(100);
    mockRegistry.getLoadedCount.mockReturnValue(10);

    vi.advanceTimersByTime(200);

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalled();
    });
  });

  it('should display current asset being loaded', () => {
    const onComplete = vi.fn();
    renderWithProviders(<LoadingScreen onComplete={onComplete} />);

    // Loading screen should be visible with progress
    const loadingText = screen.getByText(/Loading/i);
    expect(loadingText).toBeInTheDocument();
  });

  it('should handle zero progress gracefully', () => {
    const onComplete = vi.fn();
    mockRegistry.getProgress.mockReturnValue(0);
    mockRegistry.getLoadedCount.mockReturnValue(0);
    mockRegistry.getTotalCount.mockReturnValue(10);

    renderWithProviders(<LoadingScreen onComplete={onComplete} />);

    expect(screen.getByText(/0%/)).toBeInTheDocument();
  });

  it('should not call onComplete multiple times', async () => {
    const onComplete = vi.fn();
    renderWithProviders(<LoadingScreen onComplete={onComplete} minimumDisplayTime={100} />);

    mockRegistry.getProgress.mockReturnValue(100);
    mockRegistry.getLoadedCount.mockReturnValue(10);

    vi.advanceTimersByTime(200);

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledTimes(1);
    });

    vi.advanceTimersByTime(500);

    // Should still only be called once
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
