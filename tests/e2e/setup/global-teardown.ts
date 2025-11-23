import { FullConfig } from '@playwright/test';

/**
 * Global teardown runs once after all tests complete
 * Use for cleanup operations
 */
async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global teardown...');

  // Add cleanup logic here if needed
  // Example: clear test data, stop services, etc.

  console.log('✅ Global teardown completed');
}

export default globalTeardown;
