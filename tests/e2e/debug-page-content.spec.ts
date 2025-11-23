import { test } from '@playwright/test';

test('Debug what actually shows on court page', async ({ page }) => {
  await page.goto('http://localhost:3003/court');

  console.log('URL:', page.url());

  // Wait a bit for any loading
  await page.waitForTimeout(5000);

  // Get page title
  const title = await page.title();
  console.log('Page title:', title);

  // Get all visible elements
  const body = await page.locator('body').innerHTML();
  console.log('Body HTML (first 2000 chars):', body.substring(0, 2000));

  // Check for canvas
  const canvasCount = await page.locator('canvas').count();
  console.log('Canvas count:', canvasCount);

  // Check for loading screen
  const loadingScreen = await page.locator('text=Loading').count();
  console.log('Loading screen count:', loadingScreen);

  // Check for any error messages
  const errorMessages = await page.locator('text=/error|failed|not found/i').count();
  console.log('Error message count:', errorMessages);

  // Take screenshot
  await page.screenshot({ path: 'docs/screenshots/debug-page-state.png', fullPage: true });

  // Get console logs
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  // Wait longer and check again
  await page.waitForTimeout(10000);

  const canvasCount2 = await page.locator('canvas').count();
  console.log('Canvas count after 15 total seconds:', canvasCount2);

  // Final screenshot
  await page.screenshot({ path: 'docs/screenshots/debug-page-state-after-wait.png', fullPage: true });
});
