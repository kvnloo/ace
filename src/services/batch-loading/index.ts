/**
 * Batch Loading System Exports
 *
 * Central export point for the progressive component loading system.
 */

export {
    ComponentTier,
    ComponentDefinition,
    TierConfig,
    ComponentState,
    TierChangeEvent,
    TierChangeCallback,
    ComponentChangeCallback,
    COMPONENT_DEFINITIONS,
    ComponentBatchManager,
    componentBatchManager
} from './ComponentBatchManager';

// Re-export FPS controller for convenience
export { fpsBatchController } from '../fps/FPSBatchController';

// Re-export hooks
export {
    useComponentEnabled,
    useComponentsEnabled,
    useTierEnabled,
    useTierStats,
    useComponentControl,
    useTierControl,
    useComponentPerformance
} from '../../hooks/useComponentEnabled';

// Re-export UI components
export { BatchControlPanel } from '../../components/debug/BatchControlPanel';
