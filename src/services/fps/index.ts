/**
 * FPS Monitoring and Component Batch Management
 *
 * Exports all FPS-related services and integrations
 */

// Re-export ComponentBatchManager from batch-loading service
export {
    ComponentBatchManager,
    componentBatchManager,
    ComponentTier,
    COMPONENT_DEFINITIONS
} from '../batch-loading/ComponentBatchManager';

export type {
    ComponentDefinition,
    TierConfig,
    ComponentState,
    TierChangeEvent,
    TierChangeCallback,
    ComponentChangeCallback
} from '../batch-loading/ComponentBatchManager';

export {
    FPSBatchController,
    fpsBatchController,
    type FPSThreshold,
    type WarningEvent,
    type WarningCallback,
    type FPSBatchCorrelation
} from './FPSBatchController';

// Re-export FPS Monitor from loading services
export {
    FPSMonitor,
    type FPSStats,
    type FPSChangeEvent,
    type FPSChangeCallback
} from '../loading/FPSMonitor';
