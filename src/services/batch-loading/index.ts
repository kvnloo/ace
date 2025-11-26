/**
 * Batch Loading System Exports
 *
 * Central export point for the progressive component loading system.
 */

// Export types with 'export type' for isolatedModules compatibility
export type {
    ComponentDefinition,
    TierConfig,
    ComponentState,
    TierChangeEvent,
    TierChangeCallback,
    ComponentChangeCallback
} from './ComponentBatchManager';

// Export enum and classes normally
export {
    ComponentTier,
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
