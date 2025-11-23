import { test, expect } from '@playwright/test';

/**
 * Loading Screen - Basic E2E Test
 *
 * Tests the basic functionality of the LoadingScreen component:
 * - Appears when clicking "Explore 3D Demo"
 * - Shows FPS counter
 * - Shows asset loading bars
 * - Disappears after loading completes
 * - Canvas becomes visible after loading
 */

test.describe('Loading Screen - Basic Functionality', () => {
  test('shows loading screen with FPS counter and asset bars', async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:3002');

    // Click the "Explore 3D Demo" button
    const exploreButton = page.getByRole('button', { name: /explore 3d demo/i });
    await expect(exploreButton).toBeVisible();
    await exploreButton.click();

    // Loading screen should appear
    const loadingScreen = page.getByTestId('loading-screen');
    await expect(loadingScreen).toBeVisible({ timeout: 5000 });

    // FPS counter should be visible
    const fpsCounter = page.getByTestId('fps-meter');
    await expect(fpsCounter).toBeVisible();

    // Asset loading bars should be visible
    // Check for progress indicators (at least one should be visible)
    const assetList = page.getByTestId('asset-list');
    await expect(assetList).toBeVisible();

    // Check that we have some asset items
    const assetItems = page.locator('[data-testid^="asset-item-"]');
    const count = await assetItems.count();
    expect(count).toBeGreaterThan(0);

    // Wait for loading screen to disappear (max 30 seconds)
    await expect(loadingScreen).not.toBeVisible({ timeout: 30000 });

    // Canvas should now be visible
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
  });

  test('shows increasing progress percentage', async ({ page }) => {
    await page.goto('http://localhost:3002');

    // Click explore button
    const exploreButton = page.getByRole('button', { name: /explore 3d demo/i });
    await exploreButton.click();

    // Wait for loading screen
    const loadingScreen = page.getByTestId('loading-screen');
    await expect(loadingScreen).toBeVisible({ timeout: 5000 });

    // Get initial progress
    const progressDisplay = page.getByTestId('loading-progress');
    await expect(progressDisplay).toBeVisible();

    const initialText = await progressDisplay.textContent();
    const initialProgress = parseInt(initialText?.match(/\d+/)?.[0] || '0');

    // Wait a bit and check that progress has increased
    await page.waitForTimeout(2000);
    const midText = await progressDisplay.textContent();
    const midProgress = parseInt(midText?.match(/\d+/)?.[0] || '0');

    expect(midProgress).toBeGreaterThanOrEqual(initialProgress);

    // Eventually should reach 100%
    await expect(progressDisplay).toContainText('100%', { timeout: 30000 });
  });

  test('displays phase information', async ({ page }) => {
    await page.goto('http://localhost:3002');

    // Click explore button
    const exploreButton = page.getByRole('button', { name: /explore 3d demo/i });
    await exploreButton.click();

    // Wait for loading screen
    const loadingScreen = page.getByTestId('loading-screen');
    await expect(loadingScreen).toBeVisible({ timeout: 5000 });

    // Should show phase information (Essential, Core, Visual, or Enhanced)
    const phaseDisplay = page.getByTestId('loading-phase');
    await expect(phaseDisplay).toBeVisible();

    const phaseText = await phaseDisplay.textContent();
    expect(phaseText).toMatch(/Essential|Core|Visual|Enhanced/);
  });

  test('completes loading within reasonable time', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('http://localhost:3002');

    // Click explore button
    const exploreButton = page.getByRole('button', { name: /explore 3d demo/i });
    await exploreButton.click();

    // Wait for loading screen to appear
    const loadingScreen = page.getByTestId('loading-screen');
    await expect(loadingScreen).toBeVisible({ timeout: 5000 });

    // Wait for loading to complete
    await expect(loadingScreen).not.toBeVisible({ timeout: 30000 });

    const loadTime = Date.now() - startTime;

    // Should complete within 30 seconds
    expect(loadTime).toBeLessThan(30000);

    // Canvas should be visible
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
  });
});
