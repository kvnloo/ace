/**
 * Debug Panel Components
 * Comprehensive 3D asset debugging and performance monitoring
 */

export { default as DebugPanel } from './DebugPanel';
export { AssetToggle } from './AssetToggle';
export { PerformanceChart } from './PerformanceChart';
export { PresetSelector } from './PresetSelector';

export type {
  Asset3D,
  AssetPerformanceCost,
  AssetStatus,
  PerformanceMetrics,
  PerAssetMetrics,
  DebugPreset,
  PerformanceReport
} from './types';

export { DEFAULT_PRESETS } from './types';
