/**
 * Test Data Generators - Central Export
 *
 * All test data generators for E2E testing.
 * Import from this file to access all generators.
 */

// Court generators
export {
  generateCourt,
  generateCourts,
  generateCourtWithStatus,
  generateRealisticCourtSet,
  generateCourtUpdate,
  generateLargeCourtDataset,
  type Court
} from './court-generator';

// Sensor generators
export {
  generateSensor,
  generateSensorWithStatus,
  generateCourtSensors,
  generateHistoricalData,
  generateSensorAlert,
  streamSensorData,
  generateLargeSensorDataset,
  generateMixedStatusSensors,
  type SensorType,
  type SensorReading
} from './sensor-generator';

// User generators
export {
  generateUser,
  generatePreferences,
  generateStatistics,
  generateUserSession,
  generateSessionActions,
  generateFirstTimeUser,
  generatePowerUser,
  generateAccessibilityUser,
  generateUserBatch,
  type UserRole,
  type Theme,
  type UserPreferences,
  type User,
  type UserSession
} from './user-generator';

// Performance metrics generators
export {
  generateNavigationMetrics,
  generateCoreWebVitals,
  generateResourceMetrics,
  generateRuntimeMetrics,
  generateCustomMetrics,
  generatePerformanceSnapshot,
  generateLighthouseScores,
  generatePerformanceTimeSeries,
  generateMemoryLeakData,
  generateNetworkWaterfall,
  generateFPSData,
  type PerformanceMetrics,
  type NavigationMetrics,
  type CoreWebVitals,
  type ResourceMetrics,
  type RuntimeMetrics,
  type CustomMetrics,
  type LighthouseScores,
  type WaterfallEntry
} from './performance-metrics-faker';

/**
 * Example Usage:
 *
 * ```typescript
 * import {
 *   generateCourts,
 *   generateMixedStatusSensors,
 *   generateUserBatch,
 *   generatePerformanceSnapshot
 * } from '@/tests/e2e/generators';
 *
 * // Generate test data
 * const courts = generateCourts(10);
 * const sensors = generateMixedStatusSensors(20);
 * const users = generateUserBatch(50);
 * const metrics = generatePerformanceSnapshot('good');
 * ```
 */
