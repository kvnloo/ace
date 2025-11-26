import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useAssetEnabled } from './useAssetEnabled';
import { assetRegistry } from '../utils/debug/assetRegistry';

// Mock the asset registry
vi.mock('../utils/debug/assetRegistry', () => ({
  assetRegistry: {
    isEnabled: vi.fn(),
    get: vi.fn(),
  },
}));

describe('useAssetEnabled', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return initial enabled state', () => {
    vi.mocked(assetRegistry.isEnabled).mockReturnValue(true);
    const { result } = renderHook(() => useAssetEnabled('test-asset'));
    expect(result.current).toBe(true);
  });

  it('should update state when registry changes', () => {
    vi.mocked(assetRegistry.isEnabled).mockReturnValue(false);
    const { result } = renderHook(() => useAssetEnabled('test-asset'));
    expect(result.current).toBe(false);

    // Simulate registry update
    vi.mocked(assetRegistry.isEnabled).mockReturnValue(true);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current).toBe(true);
  });
});
