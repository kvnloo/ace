import { chromium, FullConfig } from '@playwright/test';

/**
 * Global setup runs once before all tests
 * Use for expensive operations like authentication, database seeding, etc.
 */
async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global E2E test setup...');

  // Example: Pre-warm the application
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    const baseURL = config.projects[0].use.baseURL || 'http://localhost:3000';
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    console.log('✅ Application pre-warmed successfully');
  } catch (error) {
    console.error('❌ Failed to pre-warm application:', error);
  } finally {
    await browser.close();
  }

  console.log('✅ Global setup completed');
}

export default globalSetup;
