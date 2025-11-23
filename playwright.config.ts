import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Testing Configuration for ACE Facility
 *
 * This configuration sets up cross-browser testing for a React + Three.js application
 * with optimizations for fast test execution and reliable CI/CD integration.
 *
 * Includes visual regression testing with snapshot management.
 */
export default defineConfig({
  // Test directory
  testDir: './tests/e2e',

  // Maximum time one test can run (extended for 3D loading)
  timeout: 90 * 1000,

  // Expect timeout for assertions
  expect: {
    timeout: 10000, // Extended for 3D rendering checks
    // Visual regression tolerance settings
    toHaveScreenshot: {
      // Maximum allowed pixel difference (0.2%)
      maxDiffPixelRatio: 0.002,
      // Animation settling time
      animations: 'disabled',
      // Screenshot options
      scale: 'css',
    },
  },

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI (can enable later if stable)
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use
  reporter: [
    ['html', { outputFolder: 'tests/e2e/reports/html' }],
    ['json', { outputFile: 'tests/e2e/reports/results.json' }],
    ['list']
  ],

  // Snapshot path configuration
  snapshotPathTemplate: '{testDir}/__snapshots__/{testFilePath}/{arg}{ext}',

  // Shared settings for all the projects below
  use: {
    // Base URL for tests (Vite default port)
    baseURL: 'http://localhost:5173',

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure
    video: 'retain-on-failure',

    // Viewport size
    viewport: { width: 1920, height: 1080 },

    // Emulate media features
    colorScheme: 'dark',

    // Ignore HTTPS errors
    ignoreHTTPSErrors: true,

    // Timeout for navigation (extended for asset loading)
    navigationTimeout: 30 * 1000,

    // Timeout for action (extended for 3D interactions)
    actionTimeout: 30 * 1000,
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Mobile viewports
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },

    // Visual regression specific project (chromium only for consistency)
    {
      name: 'visual-regression',
      testMatch: /.*\.visual\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        // Ensure consistent rendering for visual tests
        deviceScaleFactor: 1,
        hasTouch: false,
      },
    },
  ],

  // Web server configuration
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
