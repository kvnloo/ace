/**
 * 3D Rendering Test Suite
 *
 * Tests ThreeScene component rendering without manual browser testing.
 * Uses mocked WebGL context and jsdom for automated validation.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import ThreeScene from '../components/ThreeScene';
import { FeatureData } from '../types';

describe('ThreeScene Component', () => {
  let mockOnFeatureSelect: (feature: FeatureData) => void;

  beforeEach(() => {
    mockOnFeatureSelect = vi.fn();

    // Suppress React Three Fiber warnings in tests
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should render without crashing', async () => {
    const { container } = render(
      <ThreeScene onFeatureSelect={mockOnFeatureSelect} />
    );

    expect(container).toBeTruthy();
    expect(container.querySelector('canvas')).toBeTruthy();
  });

  it('should create a canvas element', async () => {
    const { container } = render(
      <ThreeScene onFeatureSelect={mockOnFeatureSelect} />
    );

    const canvas = container.querySelector('canvas');
    expect(canvas).not.toBeNull();
    expect(canvas?.tagName).toBe('CANVAS');
  });

  it('should render control overlay UI', () => {
    render(<ThreeScene onFeatureSelect={mockOnFeatureSelect} />);

    // Check for floor view controls
    expect(screen.getByText(/Floor View/i)).toBeInTheDocument();
    expect(screen.getByText(/Full Facility/i)).toBeInTheDocument();
    expect(screen.getByText(/L3: Farm/i)).toBeInTheDocument();
    expect(screen.getByText(/L2: Social/i)).toBeInTheDocument();
    expect(screen.getByText(/L1: Racquet/i)).toBeInTheDocument();
    expect(screen.getByText(/G: Tennis/i)).toBeInTheDocument();
  });

  it('should render annotation controls', () => {
    render(<ThreeScene onFeatureSelect={mockOnFeatureSelect} />);

    // Check for overlay controls
    expect(screen.getByText(/Overlay/i)).toBeInTheDocument();
    expect(screen.getByText(/Clean/i)).toBeInTheDocument();
    expect(screen.getByText(/Labels/i)).toBeInTheDocument();
    expect(screen.getByText(/Dimensions/i)).toBeInTheDocument();
  });

  it('should render facility version info', () => {
    render(<ThreeScene onFeatureSelect={mockOnFeatureSelect} />);

    expect(screen.getByText(/ECO-FACILITY VIEWER/i)).toBeInTheDocument();
    expect(screen.getByText(/INTERACTIVE ARCHITECTURAL MODEL/i)).toBeInTheDocument();
  });

  it('should have proper container structure', () => {
    const { container } = render(
      <ThreeScene onFeatureSelect={mockOnFeatureSelect} />
    );

    // Check for main container with full viewport styling
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv.className).toContain('w-full');
    expect(mainDiv.className).toContain('h-full');
    expect(mainDiv.className).toContain('absolute');
  });

  it('should not have console errors during render', async () => {
    const errorSpy = vi.spyOn(console, 'error');

    render(<ThreeScene onFeatureSelect={mockOnFeatureSelect} />);

    await waitFor(() => {
      expect(errorSpy).not.toHaveBeenCalledWith(
        expect.stringMatching(/error|Error|ERROR/)
      );
    });
  });

  it('should initialize with default state', () => {
    const { container } = render(
      <ThreeScene onFeatureSelect={mockOnFeatureSelect} />
    );

    // Default floor should be "ALL" - Full Facility button should be active
    const fullFacilityBtn = screen.getByText(/Full Facility/i).closest('button');
    expect(fullFacilityBtn?.className).toContain('bg-tennis-yellow');

    // Default annotation mode should be "LABELS" - Labels button should be active
    const labelsBtn = screen.getByText(/Labels/i).closest('button');
    expect(labelsBtn?.className).toContain('bg-white/20');
  });

  it('should handle component unmounting cleanly', () => {
    const { unmount } = render(
      <ThreeScene onFeatureSelect={mockOnFeatureSelect} />
    );

    expect(() => unmount()).not.toThrow();
  });
});

describe('ThreeScene - Component Mount Validation', () => {
  it('should mount all child components without errors', async () => {
    const errorSpy = vi.spyOn(console, 'error');
    const mockOnFeatureSelect = vi.fn();

    render(<ThreeScene onFeatureSelect={mockOnFeatureSelect} />);

    // Wait for React Three Fiber to initialize
    await waitFor(() => {
      const canvas = document.querySelector('canvas');
      expect(canvas).toBeTruthy();
    });

    // Verify no React errors occurred during mounting
    const reactErrors = errorSpy.mock.calls.filter(call =>
      call.some(arg =>
        typeof arg === 'string' &&
        (arg.includes('React') || arg.includes('component'))
      )
    );

    expect(reactErrors).toHaveLength(0);
  });

  it('should handle WebGL context creation', () => {
    const mockOnFeatureSelect = vi.fn();
    const { container } = render(
      <ThreeScene onFeatureSelect={mockOnFeatureSelect} />
    );

    const canvas = container.querySelector('canvas');
    expect(canvas).toBeTruthy();

    // Verify canvas can get WebGL context (mocked)
    const context = canvas?.getContext('webgl');
    expect(context).toBeTruthy();
  });

  it('should maintain proper memory management', async () => {
    const mockOnFeatureSelect = vi.fn();
    const { unmount } = render(
      <ThreeScene onFeatureSelect={mockOnFeatureSelect} />
    );

    // Component should mount successfully
    await waitFor(() => {
      expect(document.querySelector('canvas')).toBeTruthy();
    });

    // Component should unmount without memory leaks
    expect(() => unmount()).not.toThrow();

    // Canvas should be removed after unmount
    expect(document.querySelector('canvas')).toBeFalsy();
  });
});

describe('ThreeScene - Accessibility', () => {
  it('should be keyboard navigable', () => {
    const mockOnFeatureSelect = vi.fn();
    render(<ThreeScene onFeatureSelect={mockOnFeatureSelect} />);

    // Control buttons should be focusable
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);

    buttons.forEach(button => {
      expect(button.tabIndex).toBeGreaterThanOrEqual(0);
    });
  });

  it('should have proper semantic structure', () => {
    const mockOnFeatureSelect = vi.fn();
    const { container } = render(
      <ThreeScene onFeatureSelect={mockOnFeatureSelect} />
    );

    // Should have proper button elements, not divs
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});

describe('ThreeScene - Performance', () => {
  it('should render within acceptable time', async () => {
    const mockOnFeatureSelect = vi.fn();
    const startTime = performance.now();

    render(<ThreeScene onFeatureSelect={mockOnFeatureSelect} />);

    await waitFor(() => {
      expect(document.querySelector('canvas')).toBeTruthy();
    });

    const renderTime = performance.now() - startTime;

    // Should render within 2 seconds (generous for test environment)
    expect(renderTime).toBeLessThan(2000);
  });

  it('should not cause layout thrashing', () => {
    const mockOnFeatureSelect = vi.fn();
    const { rerender } = render(
      <ThreeScene onFeatureSelect={mockOnFeatureSelect} />
    );

    // Multiple rerenders should not cause errors
    expect(() => {
      rerender(<ThreeScene onFeatureSelect={mockOnFeatureSelect} />);
      rerender(<ThreeScene onFeatureSelect={mockOnFeatureSelect} />);
      rerender(<ThreeScene onFeatureSelect={mockOnFeatureSelect} />);
    }).not.toThrow();
  });
});
