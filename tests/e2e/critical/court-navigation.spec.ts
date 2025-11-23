import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { CourtViewPage } from '../pages/CourtViewPage';
import { mockCourtData, mockCourtDetails } from '../fixtures/courtData';
import { mockAPI, measurePerformance, waitForWebGL } from '../helpers/testHelpers';
import { ConsoleMonitor } from '../helpers/consoleMonitor';

/**
 * E2E Tests: Court Navigation Flow
 *
 * Critical user journey testing for navigating courts and viewing details
 * Target: <5s test execution per scenario
 */

test.describe('Court Navigation Flow', () => {
  let homePage: HomePage;
  let courtViewPage: CourtViewPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    courtViewPage = new CourtViewPage(page);

    // Mock API responses for faster tests
    await mockAPI(page, '**/api/courts', mockCourtData);
    await mockAPI(page, '**/api/courts/**', mockCourtDetails);

    // Navigate to home page
    await homePage.navigate();
  });

  test('should navigate from home to court view', async ({ page }) => {
    const monitor = new ConsoleMonitor(page);

    // Verify home page is loaded
    await homePage.verifyPageLoaded();
    await expect(homePage.logo).toBeVisible();

    // Navigate to court view
    await homePage.goToCourtView();

    // Verify navigation occurred
    await expect(page).toHaveURL(/.*court/);
    await expect(courtViewPage.courtList).toBeVisible();

    // Take snapshot for visual regression
    await expect(page).toHaveScreenshot('court-view-page.png');

    // Assert no console errors
    monitor.assertNoErrors();
  });

  test('should select tennis court and view details', async ({ page }) => {
    const monitor = new ConsoleMonitor(page);

    // Navigate to court view
    await homePage.goToCourtView();
    await courtViewPage.courtList.waitFor({ state: 'visible' });

    // Select first court
    await courtViewPage.selectCourt(0);

    // Verify court details are displayed
    await expect(courtViewPage.courtDetails).toBeVisible();
    await expect(courtViewPage.courtTitle).toContainText('Tennis Court');

    // Verify court details content
    const detailsText = await courtViewPage.getCourtDetailsText();
    expect(detailsText).toContain('hard'); // surface type
    expect(detailsText).toContain('available'); // status

    // Assert no console errors
    monitor.assertNoErrors();
  });

  test('should load 3D visualization within 5 seconds', async ({ page }) => {
    const monitor = new ConsoleMonitor(page);

    // Navigate to court view and select court
    await homePage.goToCourtView();
    await courtViewPage.selectCourt(0);

    // Start measuring ONLY 3D scene load time
    const startTime = Date.now();

    // Wait for 3D scene to load
    await courtViewPage.waitFor3DSceneLoad(5000);

    // Measure 3D load time specifically
    const sceneLoadTime = Date.now() - startTime;

    // Verify 3D scene loaded
    await expect(courtViewPage.courtCanvas).toBeVisible();

    // Performance assertion: 3D scene must load in under 5 seconds
    expect(sceneLoadTime).toBeLessThan(5000);

    console.log(`3D scene loaded in ${sceneLoadTime}ms`);

    // Verify WebGL context is initialized
    await waitForWebGL(page, '[data-testid="court-canvas"]');

    // Assert no console errors
    monitor.assertNoErrors();
  });

  test('should display court information accurately', async ({ page }) => {
    const monitor = new ConsoleMonitor(page);

    await homePage.goToCourtView();

    // Select court by name
    await courtViewPage.selectCourtByName('Tennis Court 1');

    // Verify correct court is selected
    const isSelected = await courtViewPage.verifyCourtSelected('Tennis Court 1');
    expect(isSelected).toBeTruthy();

    // Verify court details contain expected information
    const details = await courtViewPage.getCourtDetailsText();
    expect(details).toContain('Professional grade surface');
    expect(details).toContain('LED lighting system');

    // Assert no console errors
    monitor.assertNoErrors();
  });

  test('should handle court selection transitions smoothly', async ({ page }) => {
    const monitor = new ConsoleMonitor(page);

    await homePage.goToCourtView();

    // Select first court
    await courtViewPage.selectCourt(0);
    await expect(courtViewPage.courtCanvas).toBeVisible();
    await expect(courtViewPage.courtTitle).toBeVisible();
    const firstCourtTitle = await courtViewPage.courtTitle.textContent();

    // Switch to second court
    await courtViewPage.selectCourt(1);
    await page.waitForTimeout(800); // Wait for transition and loading

    // Verify court changed
    await expect(courtViewPage.courtTitle).toBeVisible();
    const secondCourtTitle = await courtViewPage.courtTitle.textContent();
    expect(secondCourtTitle).not.toBe(firstCourtTitle);

    // 3D canvas should still be visible
    await expect(courtViewPage.courtCanvas).toBeVisible();

    // Assert no console errors
    monitor.assertNoErrors();
  });

  test('should show loading state during data fetch', async ({ page }) => {
    // Delay API response to test loading state
    await page.route('**/api/courts/**', async (route) => {
      await page.waitForTimeout(1000);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockCourtDetails)
      });
    });

    await homePage.goToCourtView();
    await courtViewPage.selectCourt(0);

    // Loading indicator should be visible
    const isLoading = await courtViewPage.isLoading();
    expect(isLoading).toBeTruthy();

    // Wait for loading to complete
    await courtViewPage.courtDetails.waitFor({ state: 'visible', timeout: 5000 });

    // Loading indicator should be hidden
    await expect(courtViewPage.loadingIndicator).not.toBeVisible();
  });

  test('should maintain performance metrics', async ({ page }) => {
    await homePage.goToCourtView();
    await courtViewPage.selectCourt(0);
    await courtViewPage.waitFor3DSceneLoad();

    // Measure page performance
    const perf = await measurePerformance(page);

    // Performance assertions (relaxed for complex SPA with 3D rendering)
    expect(perf.pageLoadTime).toBeLessThan(10000); // Total page load (including navigation + 3D)
    expect(perf.renderTime).toBeLessThan(5000); // DOM render time (relaxed for 3D scene)

    console.log('Performance metrics:', perf);
  });
});

test.describe('Court Navigation - Mobile Viewport', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should navigate courts on mobile device', async ({ page }) => {
    const homePage = new HomePage(page);
    const courtViewPage = new CourtViewPage(page);

    await mockAPI(page, '**/api/courts', mockCourtData);
    await mockAPI(page, '**/api/courts/**', mockCourtDetails);

    await homePage.navigate();
    await homePage.goToCourtView();

    // Verify mobile layout
    await expect(courtViewPage.courtList).toBeVisible();

    // Select court
    await courtViewPage.selectCourt(0);

    // Verify 3D scene loads on mobile
    await courtViewPage.waitFor3DSceneLoad();
    await expect(courtViewPage.courtCanvas).toBeVisible();

    // Take mobile screenshot
    await expect(page).toHaveScreenshot('court-view-mobile.png');
  });
});
