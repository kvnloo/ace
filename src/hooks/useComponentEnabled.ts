/**
 * useComponentEnabled Hook
 *
 * React hook for components to check if they should render based on the batch loading system.
 * Components use this to conditionally render based on tier activation and FPS monitoring.
 *
 * @example
 * ```tsx
 * function WeatherSystem() {
 *   const isEnabled = useComponentEnabled('weather-system');
 *
 *   if (!isEnabled) {
 *     return null; // Don't render until enabled by batch system
 *   }
 *
 *   return <WeatherEffects />;
 * }
 * ```
 */

import { useState, useEffect, useCallback } from 'react';
import { componentBatchManager, ComponentTier } from '../services/batch-loading/ComponentBatchManager';

/**
 * Hook to check if a component is enabled and should render
 *
 * @param componentId - Unique component identifier from COMPONENT_DEFINITIONS
 * @returns true if component should render, false otherwise
 */
export function useComponentEnabled(componentId: string): boolean {
  const [enabled, setEnabled] = useState(() =>
    componentBatchManager.isComponentEnabled(componentId)
  );

  useEffect(() => {
    // Initial check
    setEnabled(componentBatchManager.isComponentEnabled(componentId));

    // Subscribe to component changes
    const unsubscribe = componentBatchManager.onComponentChange((id, isEnabled) => {
      if (id === componentId) {
        setEnabled(isEnabled);
      }
    });

    return unsubscribe;
  }, [componentId]);

  return enabled;
}

/**
 * Hook to check if an entire tier is enabled
 *
 * @param tier - The component tier to check
 * @returns true if the entire tier is enabled
 */
export function useTierEnabled(tier: ComponentTier): boolean {
  const [enabled, setEnabled] = useState(() =>
    componentBatchManager.isTierEnabled(tier)
  );

  useEffect(() => {
    // Initial check
    setEnabled(componentBatchManager.isTierEnabled(tier));

    // Subscribe to tier changes
    const unsubscribe = componentBatchManager.onTierChange((event) => {
      if (event.tier === tier) {
        setEnabled(event.enabled);
      }
    });

    return unsubscribe;
  }, [tier]);

  return enabled;
}

/**
 * Hook to check if multiple components are all enabled
 *
 * @param componentIds - Array of component identifiers
 * @returns true if ALL components are enabled
 *
 * @example
 * ```tsx
 * function GrassCourtSystem() {
 *   const allSystemsReady = useComponentsEnabled([
 *     'grass-system',
 *     'robotic-grass',
 *     'court-textures'
 *   ]);
 *
 *   if (!allSystemsReady) return null;
 *   return <ComplexGrassSimulation />;
 * }
 * ```
 */
export function useComponentsEnabled(componentIds: string[]): boolean {
  const [allEnabled, setAllEnabled] = useState(() =>
    componentIds.every(id => componentBatchManager.isComponentEnabled(id))
  );

  useEffect(() => {
    const checkAllEnabled = () => {
      const enabled = componentIds.every(id =>
        componentBatchManager.isComponentEnabled(id)
      );
      setAllEnabled(enabled);
    };

    // Initial check
    checkAllEnabled();

    // Subscribe to component changes
    const unsubscribe = componentBatchManager.onComponentChange((id) => {
      if (componentIds.includes(id)) {
        checkAllEnabled();
      }
    });

    return unsubscribe;
  }, [componentIds.join(',')]);

  return allEnabled;
}

/**
 * Hook to get detailed tier statistics
 *
 * @param tier - The tier to get stats for
 * @returns Statistics about the tier's components
 */
export function useTierStats(tier: ComponentTier) {
  const [stats, setStats] = useState(() =>
    componentBatchManager.getTierStats(tier)
  );

  useEffect(() => {
    const updateStats = () => {
      setStats(componentBatchManager.getTierStats(tier));
    };

    // Initial update
    updateStats();

    // Subscribe to changes
    const unsubscribe = componentBatchManager.onTierChange((event) => {
      if (event.tier === tier) {
        updateStats();
      }
    });

    return unsubscribe;
  }, [tier]);

  return stats;
}

/**
 * Hook for manual component control (for debug panels)
 *
 * @param componentId - Component to control
 * @returns Object with enabled state and toggle functions
 */
export function useComponentControl(componentId: string) {
  const [enabled, setEnabled] = useState(() =>
    componentBatchManager.isComponentEnabled(componentId)
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Subscribe to component changes
    const unsubscribe = componentBatchManager.onComponentChange((id, isEnabled) => {
      if (id === componentId) {
        setEnabled(isEnabled);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [componentId]);

  const enable = useCallback(async () => {
    setLoading(true);
    try {
      await componentBatchManager.enableComponent(componentId);
    } finally {
      setLoading(false);
    }
  }, [componentId]);

  const disable = useCallback(async () => {
    setLoading(true);
    try {
      await componentBatchManager.disableComponent(componentId);
    } finally {
      setLoading(false);
    }
  }, [componentId]);

  const toggle = useCallback(async () => {
    if (enabled) {
      await disable();
    } else {
      await enable();
    }
  }, [enabled, enable, disable]);

  return {
    enabled,
    loading,
    enable,
    disable,
    toggle
  };
}

/**
 * Hook for tier control (for debug panels)
 *
 * @param tier - Tier to control
 * @returns Object with tier state and control functions
 */
export function useTierControl(tier: ComponentTier) {
  const [enabled, setEnabled] = useState(() =>
    componentBatchManager.isTierEnabled(tier)
  );
  const [partial, setPartial] = useState(() =>
    componentBatchManager.isTierPartiallyEnabled(tier)
  );
  const [loading, setLoading] = useState(false);
  const stats = useTierStats(tier);

  useEffect(() => {
    const update = () => {
      setEnabled(componentBatchManager.isTierEnabled(tier));
      setPartial(componentBatchManager.isTierPartiallyEnabled(tier));
      setLoading(false);
    };

    // Subscribe to tier changes
    const unsubscribe = componentBatchManager.onTierChange((event) => {
      if (event.tier === tier) {
        update();
      }
    });

    return unsubscribe;
  }, [tier]);

  const enable = useCallback(async () => {
    setLoading(true);
    try {
      await componentBatchManager.enableTier(tier, 'manual');
    } finally {
      setLoading(false);
    }
  }, [tier]);

  const disable = useCallback(async () => {
    setLoading(true);
    try {
      await componentBatchManager.disableTier(tier, 'manual');
    } finally {
      setLoading(false);
    }
  }, [tier]);

  const toggle = useCallback(async () => {
    if (enabled) {
      await disable();
    } else {
      await enable();
    }
  }, [enabled, enable, disable]);

  return {
    enabled,
    partial,
    loading,
    stats,
    enable,
    disable,
    toggle
  };
}

/**
 * Hook to monitor if a specific component is causing performance issues
 *
 * @param componentId - Component to monitor
 * @returns FPS impact data for the component
 */
export function useComponentPerformance(componentId: string) {
  const [fpsImpact, setFpsImpact] = useState(() =>
    componentBatchManager.getComponentFPSImpact(componentId)
  );

  useEffect(() => {
    // Poll for performance updates
    const interval = setInterval(() => {
      const impact = componentBatchManager.getComponentFPSImpact(componentId);
      setFpsImpact(impact);
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [componentId]);

  return {
    fpsImpact,
    isHighImpact: fpsImpact > 10,
    isMediumImpact: fpsImpact > 5 && fpsImpact <= 10,
    isLowImpact: fpsImpact <= 5
  };
}