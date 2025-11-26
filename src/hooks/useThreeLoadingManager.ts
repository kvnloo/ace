import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Options for configuring the THREE.js LoadingManager hook
 */
export interface UseThreeLoadingManagerOptions {
  /**
   * Called when each item starts loading
   * @param loaded - Number of items loaded so far
   * @param total - Total number of items to load
   * @param url - URL of the item being loaded
   */
  onProgress?: (loaded: number, total: number, url: string) => void;

  /**
   * Called when all items have finished loading
   */
  onComplete?: () => void;

  /**
   * Called when an item fails to load
   * @param url - URL of the item that failed to load
   */
  onError?: (url: string) => void;

  /**
   * Called when loading starts
   * @param url - URL of the first item being loaded
   * @param loaded - Number of items loaded (always 0 at start)
   * @param total - Total number of items to load
   */
  onStart?: (url: string, loaded: number, total: number) => void;
}

/**
 * Custom hook that creates and manages a THREE.js LoadingManager
 *
 * This hook creates a singleton LoadingManager instance that persists across renders
 * and properly integrates with React's lifecycle. It provides callbacks for all
 * loading events and ensures cleanup on unmount.
 *
 * @param options - Configuration options for the loading manager
 * @returns THREE.LoadingManager instance
 *
 * @example
 * ```tsx
 * const loadingManager = useThreeLoadingManager({
 *   onProgress: (loaded, total, url) => {
 *     console.log(`Loading ${url}: ${loaded}/${total}`);
 *   },
 *   onComplete: () => {
 *     console.log('All assets loaded');
 *   },
 *   onError: (url) => {
 *     console.error(`Failed to load: ${url}`);
 *   }
 * });
 *
 * // Use the manager with THREE.js loaders
 * const gltfLoader = new GLTFLoader(loadingManager);
 * ```
 */
export function useThreeLoadingManager(
  options: UseThreeLoadingManagerOptions = {}
): THREE.LoadingManager {
  const { onProgress, onComplete, onError, onStart } = options;

  // Store the LoadingManager in a ref to maintain singleton behavior
  const managerRef = useRef<THREE.LoadingManager | null>(null);

  // Store callback refs to avoid recreating the manager on callback changes
  const callbacksRef = useRef(options);

  // Update callback refs when they change
  useEffect(() => {
    callbacksRef.current = options;
  }, [options]);

  // Create the LoadingManager only once
  if (!managerRef.current) {
    managerRef.current = new THREE.LoadingManager(
      // onLoad callback - called when all items finish loading
      () => {
        if (callbacksRef.current.onComplete) {
          callbacksRef.current.onComplete();
        }
      },

      // onProgress callback - called after each item loads
      (url: string, loaded: number, total: number) => {
        if (callbacksRef.current.onProgress) {
          callbacksRef.current.onProgress(loaded, total, url);
        }
      },

      // onError callback - called when an item fails to load
      (url: string) => {
        if (callbacksRef.current.onError) {
          callbacksRef.current.onError(url);
        }
      }
    );

    // Set onStart callback separately as it's not in the constructor
    managerRef.current.onStart = (url: string, loaded: number, total: number) => {
      if (callbacksRef.current.onStart) {
        callbacksRef.current.onStart(url, loaded, total);
      }
    };
  }

  // Cleanup on unmount - reset the manager
  useEffect(() => {
    return () => {
      // Note: THREE.LoadingManager doesn't have a dispose method
      // but we can reset the reference to allow garbage collection
      if (managerRef.current) {
        // Clear all callbacks to prevent memory leaks
        managerRef.current.onLoad = () => {};
        managerRef.current.onProgress = () => {};
        managerRef.current.onError = () => {};
        managerRef.current.onStart = () => {};
      }
    };
  }, []);

  return managerRef.current;
}

/**
 * Helper hook that creates a LoadingManager with automatic progress reporting
 * to a progress callback (e.g., for use with LoadingProvider)
 *
 * @param setProgress - Function to update progress (0-100)
 * @param onComplete - Optional callback when loading completes
 * @returns THREE.LoadingManager instance
 *
 * @example
 * ```tsx
 * const { setProgress, setComplete } = useLoading();
 * const loadingManager = useThreeLoadingManagerWithProgress(
 *   (progress) => setProgress(progress),
 *   () => setComplete(true)
 * );
 * ```
 */
export function useThreeLoadingManagerWithProgress(
  setProgress: (progress: number) => void,
  onComplete?: () => void
): THREE.LoadingManager {
  return useThreeLoadingManager({
    onProgress: (loaded, total) => {
      // Calculate percentage (0-100)
      const progress = total > 0 ? Math.round((loaded / total) * 100) : 0;
      setProgress(progress);
    },
    onComplete,
    onError: (url) => {
      console.error(`[LoadingManager] Failed to load asset: ${url}`);
    },
    onStart: (url, loaded, total) => {
      console.log(`[LoadingManager] Started loading: ${url} (${loaded}/${total})`);
    }
  });
}
