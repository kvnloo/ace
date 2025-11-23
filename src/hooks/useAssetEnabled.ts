/**
 * useAssetEnabled Hook
 *
 * React hook for components to check if they should render based on AssetLoader state.
 * Components use this to conditionally render based on progressive loading phases.
 *
 * @example
 * ```tsx
 * function TennisCourt({ id = 'tennis-court-1' }) {
 *   const isEnabled = useAssetEnabled(id);
 *
 *   if (!isEnabled) {
 *     return null; // Don't render until enabled by loading system
 *   }
 *
 *   return <mesh>...</mesh>;
 * }
 * ```
 */

import { useState, useEffect, useMemo } from 'react';
import { assetRegistry } from '../utils/debug/assetRegistry';

/**
 * Hook to check if an asset is enabled and should render
 *
 * @param assetId - Unique asset identifier from assetDefinitions
 * @returns true if asset should render, false otherwise
 */
export function useAssetEnabled(assetId: string): boolean {
  const [enabled, setEnabled] = useState(() => assetRegistry.isEnabled(assetId));

  useEffect(() => {
    // Initial check
    const initialState = assetRegistry.isEnabled(assetId);
    setEnabled(initialState);

    // Poll for changes (AssetLoader enables assets progressively)
    // In a production app, this would subscribe to registry events
    const interval = setInterval(() => {
      const currentState = assetRegistry.isEnabled(assetId);
      if (currentState !== enabled) {
        setEnabled(currentState);
      }
    }, 100); // Check every 100ms during loading

    return () => clearInterval(interval);
  }, [assetId]);

  return enabled;
}

/**
 * Hook to check if multiple assets are all enabled
 *
 * @param assetIds - Array of asset identifiers
 * @returns true if ALL assets are enabled
 *
 * @example
 * ```tsx
 * function CourtLines() {
 *   const allCourtsReady = useAssetsEnabled([
 *     'tennis-court-1',
 *     'tennis-court-2',
 *     'tennis-court-3',
 *     'tennis-court-4'
 *   ]);
 *
 *   if (!allCourtsReady) return null;
 *   return <CourtLineMarkings />;
 * }
 * ```
 */
export function useAssetsEnabled(assetIds: string[]): boolean {
  const [allEnabled, setAllEnabled] = useState(() =>
    assetIds.every(id => assetRegistry.isEnabled(id))
  );

  useEffect(() => {
    const checkEnabled = () => {
      const enabled = assetIds.every(id => assetRegistry.isEnabled(id));
      setAllEnabled(enabled);
    };

    checkEnabled();

    const interval = setInterval(checkEnabled, 100);
    return () => clearInterval(interval);
  }, [assetIds.join(',')]);

  return allEnabled;
}

/**
 * Hook to get detailed asset state (for debugging/UI)
 *
 * @param assetId - Asset identifier
 * @returns Asset state object with enabled status and metadata
 */
export function useAssetState(assetId: string) {
  const [state, setState] = useState(() => ({
    enabled: assetRegistry.isEnabled(assetId),
    asset: assetRegistry.get(assetId)
  }));

  useEffect(() => {
    const updateState = () => {
      setState({
        enabled: assetRegistry.isEnabled(assetId),
        asset: assetRegistry.get(assetId)
      });
    };

    updateState();

    const interval = setInterval(updateState, 100);
    return () => clearInterval(interval);
  }, [assetId]);

  return state;
}
