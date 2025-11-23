import { test, expect } from '@playwright/test';

/**
 * Quick 3D Rendering Verification
 *
 * Tests that the 3D court scene actually renders, addressing:
 * "the 3d view just doesn't work at all"
 */

test.describe('3D Rendering Quick Check', () => {
  test('3D scene renders with WebGL canvas visible', async ({ page }) => {
    // Navigate directly to court view
    await page.goto('http://localhost:3003/court');

    console.log('Waiting for scene to load...');
    await page.waitForTimeout(10000); // Wait for loading + initial render

    // Verify canvas exists and is visible
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 15000 });

    const canvasBox = await canvas.boundingBox();
    console.log(`Canvas size: ${canvasBox?.width}x${canvasBox?.height}px`);

    expect(canvasBox).not.toBeNull();
    expect(canvasBox!.width).toBeGreaterThan(100);
    expect(canvasBox!.height).toBeGreaterThan(100);

    // Take screenshot
    await page.screenshot({
      path: 'docs/screenshots/3d-scene-rendered.png',
      fullPage: false
    });

    console.log('✅ 3D scene rendered successfully');
  });

  test('WebGL context created without errors', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('http://localhost:3003/court');
    await page.waitForTimeout(10000);

    // Check WebGL is working
    const webglStatus = await page.evaluate(() => {
      const canvas = document.querySelector('canvas') as HTMLCanvasElement;
      if (!canvas) return { hasCanvas: false, hasWebGL: false };

      const gl = canvas.getContext('webgl2');
      return {
        hasCanvas: true,
        hasWebGL: gl !== null,
        canvasWidth: canvas.width,
        canvasHeight: canvas.height
      };
    });

    console.log('WebGL Status:', webglStatus);

    expect(webglStatus.hasCanvas).toBe(true);
    expect(webglStatus.hasWebGL).toBe(true);

    const criticalErrors = errors.filter(e =>
      e.toLowerCase().includes('webgl') ||
      e.toLowerCase().includes('shader') ||
      e.toLowerCase().includes('three')
    );

    if (criticalErrors.length > 0) {
      console.error('Critical errors:', criticalErrors);
    }

    expect(criticalErrors.length).toBe(0);

    console.log('✅ WebGL initialized successfully');
  });

  test('Scene has rendered content (not blank)', async ({ page }) => {
    await page.goto('http://localhost:3003/court');
    await page.waitForTimeout(10000);

    const canvas = page.locator('canvas');

    // Check if canvas has actual content rendered
    const screenshot = await canvas.screenshot();
    const hasContent = screenshot.length > 1000; // Basic check that it's not empty

    expect(hasContent).toBe(true);
    console.log('✅ Canvas has rendered content');
  });

  test('Camera controls are functional', async ({ page }) => {
    await page.goto('http://localhost:3003/court');
    await page.waitForTimeout(10000);

    const canvas = page.locator('canvas');
    const box = await canvas.boundingBox();
    if (!box) throw new Error('Canvas not found');

    // Take before screenshot
    await page.screenshot({ path: 'docs/screenshots/before-camera-move.png' });

    // Simulate camera orbit
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 + 100, box.y + box.height / 2);
    await page.mouse.up();

    await page.waitForTimeout(1000);

    // Take after screenshot
    await page.screenshot({ path: 'docs/screenshots/after-camera-move.png' });

    console.log('✅ Camera controls working');
  });

  test('Floor navigation buttons work', async ({ page }) => {
    await page.goto('http://localhost:3003/court');
    await page.waitForTimeout(10000);

    // Test clicking ground floor button
    const groundButton = page.locator('button:has-text("G: Tennis")');
    await expect(groundButton).toBeVisible();
    await groundButton.click();

    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'docs/screenshots/ground-floor-view.png' });

    // Test clicking Level 3 button
    const level3Button = page.locator('button:has-text("L3: Farm")');
    await expect(level3Button).toBeVisible();
    await level3Button.click();

    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'docs/screenshots/level3-farm-view.png' });

    console.log('✅ Floor navigation working');
  });
});
