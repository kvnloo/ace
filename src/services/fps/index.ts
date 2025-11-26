/**
 * FPS Monitoring and Component Batch Management
 *
 * Exports all FPS-related services and integrations
 */

export {
    ComponentBatch,
    ComponentBatchManager,
    componentBatchManager,
    type BatchConfig,
    type BatchState,
    type BatchChangeEvent,
    type BatchChangeCallback
} from './ComponentBatchManager';

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
