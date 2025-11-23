import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { CourtViewPage } from '../pages/CourtViewPage';
import { VisualizationPage } from '../pages/VisualizationPage';
import { mockCourtData, mockCourtDetails } from '../fixtures/courtData';
import { mockHeatMapData, mockWeatherEffects, mockCameraPresets } from '../fixtures/visualizationData';
import { mockAPI, waitForWebGL } from '../helpers/testHelpers';

/**
 * E2E Tests: Visualization Controls
 *
 * Critical testing for 3D visualization and interactive controls
 * Target: <5s test execution per scenario
 */

test.describe('Visualization Controls', () => {
  let homePage: HomePage;
  let courtViewPage: CourtViewPage;
  let vizPage: VisualizationPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    courtViewPage = new CourtViewPage(page);
    vizPage = new VisualizationPage(page);

    // Mock API responses
    await mockAPI(page, '**/api/courts', mockCourtData);
    await mockAPI(page, '**/api/courts/**', mockCourtDetails);
    await mockAPI(page, '**/api/heatmap/**', mockHeatMapData);
    await mockAPI(page, '**/api/weather/effects', mockWeatherEffects);

    // Navigate to court view with 3D visualization
    await homePage.navigate();
    await homePage.goToCourtView();
    await courtViewPage.selectCourt(0);
    await courtViewPage.waitFor3DSceneLoad();
  });

  test('should access 3D visualization', async ({ page }) => {
    // Verify 3D canvas is visible
    await expect(vizPage.canvas3D).toBeVisible();

    // Verify WebGL context
    await waitForWebGL(page, '[data-testid="3d-canvas"]');

    // Verify visualization controls are present
    await expect(vizPage.cameraControls).toBeVisible();
    await expect(vizPage.heatMapToggle).toBeVisible();
    await expect(vizPage.weatherToggle).toBeVisible();

    // Take snapshot
    await expect(page).toHaveScreenshot('visualization-initial.png');
  });

  test('should toggle heat map overlay', async ({ page }) => {
    // Initial state - heat map off
    let heatMapActive = await vizPage.isHeatMapActive();
    expect(heatMapActive).toBeFalsy();

    // Toggle heat map on
    await vizPage.toggleHeatMap();
    await page.waitForTimeout(500); // Wait for animation

    // Verify heat map is active
    heatMapActive = await vizPage.isHeatMapActive();
    expect(heatMapActive).toBeTruthy();

    // Take snapshot with heat map
    await vizPage.takeSnapshot('heatmap-active');

    // Toggle heat map off
    await vizPage.toggleHeatMap();
    await page.waitForTimeout(500);

    // Verify heat map is inactive
    heatMapActive = await vizPage.isHeatMapActive();
    expect(heatMapActive).toBeFalsy();
  });

  test('should change camera angle', async ({ page }) => {
    // Test top view
    await vizPage.changeCameraAngle('top');
    await page.waitForTimeout(500); // Wait for camera transition

    let currentAngle = await vizPage.getCurrentCameraAngle();
    expect(currentAngle).toBe('top');
    await vizPage.takeSnapshot('camera-top');

    // Test side view
    await vizPage.changeCameraAngle('side');
    await page.waitForTimeout(500);

    currentAngle = await vizPage.getCurrentCameraAngle();
    expect(currentAngle).toBe('side');
    await vizPage.takeSnapshot('camera-side');

    // Test perspective view
    await vizPage.changeCameraAngle('perspective');
    await page.waitForTimeout(500);

    currentAngle = await vizPage.getCurrentCameraAngle();
    expect(currentAngle).toBe('perspective');
    await vizPage.takeSnapshot('camera-perspective');
  });

  test('should toggle weather effects', async ({ page }) => {
    // Initial state - weather off
    let weatherActive = await vizPage.isWeatherActive();
    expect(weatherActive).toBeFalsy();

    // Toggle weather on
    await vizPage.toggleWeather();
    await page.waitForTimeout(500);

    // Verify weather is active
    weatherActive = await vizPage.isWeatherActive();
    expect(weatherActive).toBeTruthy();

    // Take snapshot with weather effects
    await vizPage.takeSnapshot('weather-active');

    // Toggle weather off
    await vizPage.toggleWeather();
    await page.waitForTimeout(500);

    // Verify weather is inactive
    weatherActive = await vizPage.isWeatherActive();
    expect(weatherActive).toBeFalsy();
  });

  test('should respond to all UI controls', async ({ page }) => {
    // Test zoom controls
    await vizPage.zoom('in');
    await page.waitForTimeout(300);
    await vizPage.zoom('in');
    await page.waitForTimeout(300);

    await vizPage.zoom('out');
    await page.waitForTimeout(300);

    // Test heat map toggle
    await vizPage.toggleHeatMap();
    await page.waitForTimeout(300);

    // Test weather toggle
    await vizPage.toggleWeather();
    await page.waitForTimeout(300);

    // Test camera angle change
    await vizPage.changeCameraAngle('side');
    await page.waitForTimeout(300);

    // All controls should still be responsive
    await expect(vizPage.heatMapToggle).toBeEnabled();
    await expect(vizPage.weatherToggle).toBeEnabled();
    await expect(vizPage.cameraControls).toBeVisible();

    // Take final snapshot
    await vizPage.takeSnapshot('all-controls-tested');
  });

  test('should reset view to default', async ({ page }) => {
    // Make several changes
    await vizPage.toggleHeatMap();
    await vizPage.toggleWeather();
    await vizPage.changeCameraAngle('side');
    await vizPage.zoom('in');
    await vizPage.zoom('in');

    await page.waitForTimeout(500);

    // Reset view
    await vizPage.resetView();
    await page.waitForTimeout(1000); // Wait for reset animation

    // Verify controls are reset
    const heatMapActive = await vizPage.isHeatMapActive();
    const weatherActive = await vizPage.isWeatherActive();
    const cameraAngle = await vizPage.getCurrentCameraAngle();

    expect(heatMapActive).toBeFalsy();
    expect(weatherActive).toBeFalsy();
    expect(cameraAngle).toBe('perspective'); // Default view

    // Take snapshot of reset state
    await vizPage.takeSnapshot('view-reset');
  });

  test('should handle mouse drag for camera rotation', async ({ page }) => {
    // Get canvas bounds
    const canvasBounds = await vizPage.canvas3D.boundingBox();
    if (!canvasBounds) throw new Error('Canvas not found');

    const centerX = canvasBounds.x + canvasBounds.width / 2;
    const centerY = canvasBounds.y + canvasBounds.height / 2;

    // Drag to rotate camera
    await vizPage.dragCanvas(
      centerX,
      centerY,
      centerX + 100,
      centerY + 50
    );

    await page.waitForTimeout(500);

    // Verify canvas is still visible and responsive
    await expect(vizPage.canvas3D).toBeVisible();

    // Take snapshot after rotation
    await vizPage.takeSnapshot('camera-rotated');
  });

  test('should maintain 3D rendering performance', async ({ page }) => {
    const startTime = Date.now();

    // Perform multiple operations
    await vizPage.toggleHeatMap();
    await vizPage.changeCameraAngle('top');
    await vizPage.zoom('in');
    await vizPage.toggleWeather();

    const operationTime = Date.now() - startTime;

    // All operations should complete quickly
    expect(operationTime).toBeLessThan(3000);

    // Scene should still render correctly
    await waitForWebGL(page, '[data-testid="3d-canvas"]');
    await expect(vizPage.canvas3D).toBeVisible();

    console.log(`Visualization operations completed in ${operationTime}ms`);
  });

  test('should handle rapid control changes', async ({ page }) => {
    // Rapidly toggle controls
    for (let i = 0; i < 5; i++) {
      await vizPage.toggleHeatMap();
      await page.waitForTimeout(100);
      await vizPage.toggleHeatMap();
      await page.waitForTimeout(100);
    }

    // Verify UI is still responsive
    await expect(vizPage.heatMapToggle).toBeEnabled();
    await expect(vizPage.canvas3D).toBeVisible();

    // Verify WebGL context is still valid
    await waitForWebGL(page, '[data-testid="3d-canvas"]');
  });
});

test.describe('Visualization Controls - Mobile Viewport', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should work on mobile devices', async ({ page }) => {
    const homePage = new HomePage(page);
    const courtViewPage = new CourtViewPage(page);
    const vizPage = new VisualizationPage(page);

    await mockAPI(page, '**/api/courts', mockCourtData);
    await mockAPI(page, '**/api/courts/**', mockCourtDetails);

    await homePage.navigate();
    await homePage.goToCourtView();
    await courtViewPage.selectCourt(0);
    await courtViewPage.waitFor3DSceneLoad();

    // Verify mobile visualization
    await expect(vizPage.canvas3D).toBeVisible();

    // Test mobile controls
    await vizPage.toggleHeatMap();
    await page.waitForTimeout(500);

    const heatMapActive = await vizPage.isHeatMapActive();
    expect(heatMapActive).toBeTruthy();

    // Take mobile screenshot
    await expect(page).toHaveScreenshot('visualization-mobile.png');
  });

  test('should support touch gestures for camera control', async ({ page }) => {
    const homePage = new HomePage(page);
    const courtViewPage = new CourtViewPage(page);
    const vizPage = new VisualizationPage(page);

    await mockAPI(page, '**/api/courts', mockCourtData);
    await mockAPI(page, '**/api/courts/**', mockCourtDetails);

    await homePage.navigate();
    await homePage.goToCourtView();
    await courtViewPage.selectCourt(0);
    await courtViewPage.waitFor3DSceneLoad();

    // Simulate touch drag
    const canvasBounds = await vizPage.canvas3D.boundingBox();
    if (!canvasBounds) throw new Error('Canvas not found');

    await page.touchscreen.tap(
      canvasBounds.x + canvasBounds.width / 2,
      canvasBounds.y + canvasBounds.height / 2
    );

    // Verify canvas is responsive
    await expect(vizPage.canvas3D).toBeVisible();
  });
});
