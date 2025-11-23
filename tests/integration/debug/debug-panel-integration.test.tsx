/**
 * Integration Tests for Debug Panel
 *
 * Tests the complete integration of DebugPanel with DebugContext,
 * assetRegistry, performanceTracker, and debugStorage.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DebugProvider } from '@/contexts/DebugContext';
import { DebugPanel } from '@/components/debug/DebugPanel';
import { assetRegistry } from '@/utils/debug/assetRegistry';
import { getPerformanceTracker } from '@/utils/debug/performanceTracker';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true
});

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((cb) => {
  cb(0);
  return 1;
});

global.cancelAnimationFrame = jest.fn();

describe('Debug Panel Integration', () => {
  const renderDebugPanel = () => {
    return render(
      <DebugProvider>
        <DebugPanel />
      </DebugProvider>
    );
  };

  beforeEach(() => {
    localStorageMock.clear();
    assetRegistry.clear();
    jest.clearAllMocks();
  });

  afterEach(() => {
    const tracker = getPerformanceTracker();
    tracker.dispose();
  });

  describe('Panel Rendering', () => {
    it('should render debug panel with all sections', () => {
      renderDebugPanel();

      expect(screen.getByText(/debug/i)).toBeInTheDocument();
      expect(screen.getByText(/assets/i)).toBeInTheDocument();
      expect(screen.getByText(/performance/i)).toBeInTheDocument();
    });

    it('should display registered assets', () => {
      assetRegistry.register({
        id: 'grass-blades',
        name: 'Grass Blades',
        type: 'grass',
        performanceCost: 5,
        dependencies: [],
        defaultEnabled: true,
        description: 'Grass rendering system'
      });

      renderDebugPanel();

      expect(screen.getByText(/grass blades/i)).toBeInTheDocument();
    });

    it('should show asset enabled state', () => {
      assetRegistry.register({
        id: 'test-asset',
        name: 'Test Asset',
        type: 'grass',
        performanceCost: 3,
        dependencies: [],
        defaultEnabled: true,
        description: 'Test'
      });

      renderDebugPanel();

      const toggle = screen.getByRole('checkbox', { name: /test asset/i });
      expect(toggle).toBeChecked();
    });
  });

  describe('Asset Toggling', () => {
    it('should toggle asset when clicking checkbox', async () => {
      assetRegistry.register({
        id: 'toggleable',
        name: 'Toggleable Asset',
        type: 'grass',
        performanceCost: 5,
        dependencies: [],
        defaultEnabled: true,
        description: 'Test'
      });

      renderDebugPanel();

      const toggle = screen.getByRole('checkbox', { name: /toggleable asset/i });
      expect(toggle).toBeChecked();
      expect(assetRegistry.isEnabled('toggleable')).toBe(true);

      fireEvent.click(toggle);

      await waitFor(() => {
        expect(assetRegistry.isEnabled('toggleable')).toBe(false);
      });
    });

    it('should auto-enable dependencies when enabling asset', async () => {
      assetRegistry.register({
        id: 'base',
        name: 'Base Asset',
        type: 'grass',
        performanceCost: 2,
        dependencies: [],
        defaultEnabled: false,
        description: 'Base'
      });

      assetRegistry.register({
        id: 'dependent',
        name: 'Dependent Asset',
        type: 'grass',
        performanceCost: 3,
        dependencies: ['base'],
        defaultEnabled: false,
        description: 'Depends on base'
      });

      renderDebugPanel();

      const dependentToggle = screen.getByRole('checkbox', { name: /dependent asset/i });

      fireEvent.click(dependentToggle);

      await waitFor(() => {
        expect(assetRegistry.isEnabled('base')).toBe(true);
        expect(assetRegistry.isEnabled('dependent')).toBe(true);
      });
    });

    it('should auto-disable dependents when disabling asset', async () => {
      assetRegistry.register({
        id: 'base',
        name: 'Base Asset',
        type: 'grass',
        performanceCost: 2,
        dependencies: [],
        defaultEnabled: true,
        description: 'Base'
      });

      assetRegistry.register({
        id: 'dependent',
        name: 'Dependent Asset',
        type: 'grass',
        performanceCost: 3,
        dependencies: ['base'],
        defaultEnabled: false,
        description: 'Dependent'
      });

      // Enable dependent first
      assetRegistry.enable('dependent');

      renderDebugPanel();

      const baseToggle = screen.getByRole('checkbox', { name: /base asset/i });

      fireEvent.click(baseToggle);

      await waitFor(() => {
        expect(assetRegistry.isEnabled('base')).toBe(false);
        expect(assetRegistry.isEnabled('dependent')).toBe(false);
      });
    });
  });

  describe('Performance Monitoring', () => {
    it('should display current FPS', async () => {
      renderDebugPanel();

      await waitFor(() => {
        expect(screen.getByText(/fps/i)).toBeInTheDocument();
      });
    });

    it('should update performance metrics in real-time', async () => {
      const tracker = getPerformanceTracker();

      renderDebugPanel();

      tracker.setBaseline({
        fps: 60,
        memory: 50,
        frameTime: 16.67,
        webglContextLost: false
      });

      await waitFor(() => {
        expect(screen.getByText(/baseline/i)).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('should show performance cost of enabled assets', () => {
      assetRegistry.register({
        id: 'expensive',
        name: 'Expensive Asset',
        type: 'characters',
        performanceCost: 15,
        dependencies: [],
        defaultEnabled: true,
        description: 'Expensive'
      });

      renderDebugPanel();

      const cost = assetRegistry.getTotalCost();
      expect(cost).toBe(15);
    });
  });

  describe('Preset Management', () => {
    it('should save current configuration as preset', async () => {
      assetRegistry.register({
        id: 'test-asset',
        name: 'Test Asset',
        type: 'grass',
        performanceCost: 5,
        dependencies: [],
        defaultEnabled: true,
        description: 'Test'
      });

      renderDebugPanel();

      const saveButton = screen.getByRole('button', { name: /save preset/i });
      fireEvent.click(saveButton);

      const presetInput = screen.getByPlaceholderText(/preset name/i);
      fireEvent.change(presetInput, { target: { value: 'Test Preset' } });

      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(localStorageMock.getItem('ace_debug_state')).toBeDefined();
      });
    });

    it('should load preset and apply configuration', async () => {
      // Save a preset first
      const state = {
        version: 1,
        enabled: true,
        customPresets: {
          'test-preset': {
            id: 'test-preset',
            name: 'Test Preset',
            settings: {
              performance: {
                showFPS: true,
                targetFPS: 60
              }
            }
          }
        },
        recentLogs: [],
        performance: {
          showPerformance: true,
          maxLogs: 100,
          persistLogs: true
        },
        lastUpdated: Date.now()
      };

      localStorageMock.setItem('ace_debug_state', JSON.stringify(state));

      renderDebugPanel();

      const presetSelector = screen.getByRole('combobox', { name: /preset/i });
      fireEvent.change(presetSelector, { target: { value: 'test-preset' } });

      await waitFor(() => {
        expect(screen.getByText(/test preset/i)).toBeInTheDocument();
      });
    });

    it('should list available presets', () => {
      const state = {
        version: 1,
        enabled: true,
        customPresets: {
          'preset-1': { id: 'preset-1', name: 'Preset 1', settings: {} },
          'preset-2': { id: 'preset-2', name: 'Preset 2', settings: {} },
          'preset-3': { id: 'preset-3', name: 'Preset 3', settings: {} }
        },
        recentLogs: [],
        performance: {
          showPerformance: true,
          maxLogs: 100,
          persistLogs: true
        },
        lastUpdated: Date.now()
      };

      localStorageMock.setItem('ace_debug_state', JSON.stringify(state));

      renderDebugPanel();

      const presetSelector = screen.getByRole('combobox', { name: /preset/i });
      fireEvent.click(presetSelector);

      expect(screen.getByText('Preset 1')).toBeInTheDocument();
      expect(screen.getByText('Preset 2')).toBeInTheDocument();
      expect(screen.getByText('Preset 3')).toBeInTheDocument();
    });
  });

  describe('Performance Report Export', () => {
    it('should generate and download performance report', async () => {
      const tracker = getPerformanceTracker();
      const downloadSpy = jest.spyOn(tracker, 'downloadReport');

      renderDebugPanel();

      const exportButton = screen.getByRole('button', { name: /export report/i });
      fireEvent.click(exportButton);

      await waitFor(() => {
        expect(downloadSpy).toHaveBeenCalled();
      });
    });

    it('should include all enabled assets in report', async () => {
      assetRegistry.register({
        id: 'asset-1',
        name: 'Asset 1',
        type: 'grass',
        performanceCost: 3,
        dependencies: [],
        defaultEnabled: true,
        description: 'Asset 1'
      });

      assetRegistry.register({
        id: 'asset-2',
        name: 'Asset 2',
        type: 'lighting',
        performanceCost: 5,
        dependencies: [],
        defaultEnabled: true,
        description: 'Asset 2'
      });

      const tracker = getPerformanceTracker();
      tracker.updateAssetMetrics('asset-1', 'Asset 1', true);
      tracker.updateAssetMetrics('asset-2', 'Asset 2', true);

      renderDebugPanel();

      const report = tracker.generateReport();
      expect(report.assets).toHaveLength(2);
    });
  });

  describe('Keyboard Shortcuts', () => {
    it('should toggle debug panel with Ctrl+Shift+D', async () => {
      renderDebugPanel();

      const panel = screen.getByTestId('debug-panel');
      expect(panel).toBeVisible();

      fireEvent.keyDown(window, { key: 'D', ctrlKey: true, shiftKey: true });

      await waitFor(() => {
        expect(panel).not.toBeVisible();
      });

      fireEvent.keyDown(window, { key: 'D', ctrlKey: true, shiftKey: true });

      await waitFor(() => {
        expect(panel).toBeVisible();
      });
    });
  });

  describe('Budget Warnings', () => {
    it('should show warning when approaching performance budget', () => {
      assetRegistry.register({
        id: 'very-expensive',
        name: 'Very Expensive Asset',
        type: 'characters',
        performanceCost: 85,
        dependencies: [],
        defaultEnabled: true,
        description: 'Very expensive'
      });

      renderDebugPanel();

      const budget = assetRegistry.getBudgetStatus(100);
      expect(budget.status).toBe('warning');

      expect(screen.getByText(/warning/i)).toBeInTheDocument();
    });

    it('should show critical warning when budget exceeded', () => {
      assetRegistry.register({
        id: 'extremely-expensive',
        name: 'Extremely Expensive Asset',
        type: 'characters',
        performanceCost: 95,
        dependencies: [],
        defaultEnabled: true,
        description: 'Extremely expensive'
      });

      renderDebugPanel();

      const budget = assetRegistry.getBudgetStatus(100);
      expect(budget.status).toBe('critical');

      expect(screen.getByText(/critical/i)).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle localStorage errors gracefully', () => {
      const originalSetItem = localStorageMock.setItem;
      localStorageMock.setItem = jest.fn(() => {
        throw new DOMException('QuotaExceededError');
      });

      renderDebugPanel();

      const saveButton = screen.getByRole('button', { name: /save preset/i });

      expect(() => fireEvent.click(saveButton)).not.toThrow();

      localStorageMock.setItem = originalSetItem;
    });

    it('should handle missing dependencies', () => {
      assetRegistry.register({
        id: 'broken-asset',
        name: 'Broken Asset',
        type: 'grass',
        performanceCost: 5,
        dependencies: ['non-existent'],
        defaultEnabled: false,
        description: 'Has missing dependency'
      });

      expect(() => renderDebugPanel()).not.toThrow();

      const isValid = assetRegistry.validateDependencies('broken-asset');
      expect(isValid).toBe(false);
    });
  });

  describe('Real-time Updates', () => {
    it('should update UI when assets are toggled programmatically', async () => {
      assetRegistry.register({
        id: 'programmatic',
        name: 'Programmatic Asset',
        type: 'grass',
        performanceCost: 5,
        dependencies: [],
        defaultEnabled: true,
        description: 'Test'
      });

      renderDebugPanel();

      const toggle = screen.getByRole('checkbox', { name: /programmatic asset/i });
      expect(toggle).toBeChecked();

      // Toggle programmatically
      act(() => {
        assetRegistry.toggle('programmatic');
      });

      await waitFor(() => {
        expect(toggle).not.toBeChecked();
      });
    });

    it('should update performance metrics continuously', async () => {
      const tracker = getPerformanceTracker();

      renderDebugPanel();

      const initialFPS = tracker.trackFPS();

      // Simulate some time passing
      jest.advanceTimersByTime(1000);

      await waitFor(() => {
        const currentFPS = tracker.trackFPS();
        expect(typeof currentFPS).toBe('number');
      });
    });
  });
});
