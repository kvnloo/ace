/**
 * useAssetEnabled Hook
 *
 * React hook for components to check if they should render based on AssetLoader state.
 * Components use this to conditionally render based on progressive loading phases.
 */

import { useState, useEffect } from 'react';
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
    }, [assetId, enabled]);

    return enabled;
}
