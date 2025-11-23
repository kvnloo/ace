import { test, expect, Page } from '@playwright/test';

/**
 * Asset Loading Experience E2E Tests
 *
 * Tests the user experience of asset loading including:
 * - Loading phase progression
 * - FPS monitoring
 * - Quality recommendations
 * - Performance-based adaptations
 */

// Helper to wait for loading to start
async function waitForLoadingStart(page: Page) {
  await page.waitForSelector('[data-testid="loading-phase"]', { timeout: 10000 });
}

// Helper to get current phase text
async function getCurrentPhase(page: Page): Promise<string> {
  const phaseElement = page.locator('[data-testid="loading-phase"]');
  return await phaseElement.textContent() || '';
}

// Helper to get current FPS
async function getCurrentFPS(page: Page): Promise<number> {
  const fpsElement = page.locator('[data-testid="fps-meter"]');
  const fpsText = await fpsElement.textContent() || '0';
  return parseInt(fpsText.replace(/[^\d]/g, ''), 10);
}

// Helper to check if recommendation is visible
async function isRecommendationVisible(page: Page): Promise<boolean> {
  const recommendation = page.locator('[data-testid="quality-recommendation"]');
  return await recommendation.isVisible().catch(() => false);
}

// Helper to throttle CPU (simulate low performance)
async function throttleCPU(page: Page, rate: number) {
  const client = await page.context().newCDPSession(page);
  await client.send('Emulation.setCPUThrottlingRate', { rate });
}

// Helper to check for console errors
function setupConsoleErrorTracking(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  return errors;
}

test.describe('Asset Loading Experience', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to the loading page
    await page.goto('/');
  });

  test('Scenario 1: High-Performance Device - Complete Loading', async ({ page }) => {
    const consoleErrors = setupConsoleErrorTracking(page);

    // Wait for loading to start
    await waitForLoadingStart(page);

    // Track phases we see
    const phasesObserved = new Set<string>();
    const expectedPhases = ['Essential', 'Core', 'Visual', 'Enhanced'];

    // Monitor loading progression
    let previousPhase = '';
    let loadingComplete = false;

    while (!loadingComplete) {
      const currentPhase = await getCurrentPhase(page);

      if (currentPhase && currentPhase !== previousPhase) {
        console.log(`Phase transition: ${previousPhase} → ${currentPhase}`);
        phasesObserved.add(currentPhase);
        previousPhase = currentPhase;
      }

      // Check if loading completed
      const loadingElement = await page.locator('[data-testid="loading-phase"]').count();
      if (loadingElement === 0) {
        loadingComplete = true;
        break;
      }

      // Check FPS is healthy
      const fps = await getCurrentFPS(page);
      expect(fps, 'FPS should stay above 40 on high-performance device').toBeGreaterThanOrEqual(40);

      // Verify no recommendations appear
      const hasRecommendation = await isRecommendationVisible(page);
      expect(hasRecommendation, 'No quality recommendations should appear').toBe(false);

      await page.waitForTimeout(500);
    }

    // Verify all phases were observed
    expectedPhases.forEach(phase => {
      expect(phasesObserved.has(phase), `Phase "${phase}" should be observed`).toBe(true);
    });

    // Verify smooth transitions (no console errors)
    expect(consoleErrors, 'No console errors during loading').toHaveLength(0);

    console.log('✅ High-performance loading completed successfully');
  });

  test('Scenario 2: Low-Performance Device - Quality Recommendation', async ({ page }) => {
    const consoleErrors = setupConsoleErrorTracking(page);

    // Simulate low-performance device (4x CPU throttling)
    await throttleCPU(page, 4);

    await waitForLoadingStart(page);

    let recommendationAppeared = false;
    let currentPhase = '';

    // Monitor until recommendation appears or loading completes
    const maxAttempts = 60; // 30 seconds max
    let attempts = 0;

    while (attempts < maxAttempts) {
      currentPhase = await getCurrentPhase(page);
      const fps = await getCurrentFPS(page);

      console.log(`Phase: ${currentPhase}, FPS: ${fps}`);

      // Check if recommendation appeared
      const hasRecommendation = await isRecommendationVisible(page);

      if (hasRecommendation && !recommendationAppeared) {
        recommendationAppeared = true;
        console.log('✅ Quality recommendation appeared');

        // Verify recommendation content
        const recommendationText = await page.locator('[data-testid="quality-recommendation"]').textContent();
        expect(recommendationText, 'Recommendation should suggest Medium Quality').toContain('Medium Quality');

        // Verify action buttons are present
        const applyButton = page.locator('[data-testid="apply-recommendation"]');
        const continueButton = page.locator('[data-testid="continue-without-change"]');

        await expect(applyButton, 'Apply button should be visible').toBeVisible();
        await expect(continueButton, 'Continue button should be visible').toBeVisible();

        // Test applying recommendation
        await applyButton.click();

        // Verify recommendation dismissed
        await page.waitForTimeout(500);
        const stillVisible = await isRecommendationVisible(page);
        expect(stillVisible, 'Recommendation should be dismissed after applying').toBe(false);

        // Verify Enhanced phase is skipped
        await page.waitForTimeout(2000);
        const finalPhase = await getCurrentPhase(page);
        expect(finalPhase, 'Enhanced phase should be skipped').not.toBe('Enhanced');

        break;
      }

      // Check if we're in Visual phase (when FPS typically drops)
      if (currentPhase.includes('Visual') && fps < 40) {
        // FPS dropped as expected, recommendation should appear soon
        console.log('⚠️ FPS drop detected in Visual phase');
      }

      attempts++;
      await page.waitForTimeout(500);
    }

    expect(recommendationAppeared, 'Quality recommendation should appear when FPS drops').toBe(true);
    expect(consoleErrors, 'No console errors during loading').toHaveLength(0);
  });

  test('Scenario 3: Very Low Performance - Urgent Recommendation', async ({ page }) => {
    const consoleErrors = setupConsoleErrorTracking(page);

    // Simulate very low-performance device (10x CPU throttling)
    await throttleCPU(page, 10);

    await waitForLoadingStart(page);

    let urgentRecommendationAppeared = false;
    let autoApplied = false;

    const maxAttempts = 60;
    let attempts = 0;

    while (attempts < maxAttempts) {
      const currentPhase = await getCurrentPhase(page);
      const fps = await getCurrentFPS(page);

      console.log(`Phase: ${currentPhase}, FPS: ${fps}`);

      const hasRecommendation = await isRecommendationVisible(page);

      if (hasRecommendation && !urgentRecommendationAppeared) {
        urgentRecommendationAppeared = true;
        console.log('⚠️ Urgent quality recommendation appeared');

        // Verify urgent recommendation content
        const recommendationText = await page.locator('[data-testid="quality-recommendation"]').textContent();
        expect(recommendationText, 'Should recommend Low Quality').toContain('Low Quality');
        expect(recommendationText, 'Should indicate performance is critical').toContain('Performance Critical');

        // Wait to see if it auto-applies (10 second timeout)
        console.log('⏳ Waiting for auto-apply timeout...');

        // Check every second for 11 seconds
        for (let i = 0; i < 11; i++) {
          await page.waitForTimeout(1000);
          const stillVisible = await isRecommendationVisible(page);

          if (!stillVisible) {
            autoApplied = true;
            console.log(`✅ Auto-applied after ${i + 1} seconds`);
            break;
          }
        }

        break;
      }

      // Very low FPS should trigger urgent recommendation
      if (fps > 0 && fps < 25) {
        console.log('🔴 Critical FPS detected, urgent recommendation expected');
      }

      attempts++;
      await page.waitForTimeout(500);
    }

    expect(urgentRecommendationAppeared, 'Urgent recommendation should appear for very low FPS').toBe(true);
    expect(autoApplied, 'Recommendation should auto-apply after timeout').toBe(true);

    // Verify Essential mode is active
    await page.waitForTimeout(1000);
    const loadingStillActive = await page.locator('[data-testid="loading-phase"]').count();

    if (loadingStillActive > 0) {
      const finalPhase = await getCurrentPhase(page);
      expect(finalPhase, 'Should stay in Essential or Core mode').toMatch(/Essential|Core/);
    }

    expect(consoleErrors, 'No console errors during loading').toHaveLength(0);
  });

  test('Phase Transitions are Smooth', async ({ page }) => {
    const consoleErrors = setupConsoleErrorTracking(page);

    await waitForLoadingStart(page);

    const phaseTransitions: Array<{ from: string; to: string; timestamp: number }> = [];
    let previousPhase = '';
    let loadingComplete = false;

    const startTime = Date.now();

    while (!loadingComplete && (Date.now() - startTime < 30000)) {
      const currentPhase = await getCurrentPhase(page);

      if (currentPhase && currentPhase !== previousPhase && previousPhase) {
        phaseTransitions.push({
          from: previousPhase,
          to: currentPhase,
          timestamp: Date.now() - startTime
        });
        console.log(`Transition: ${previousPhase} → ${currentPhase} at ${Date.now() - startTime}ms`);
      }

      previousPhase = currentPhase;

      const loadingElement = await page.locator('[data-testid="loading-phase"]').count();
      if (loadingElement === 0) {
        loadingComplete = true;
      }

      await page.waitForTimeout(100);
    }

    // Verify we had transitions
    expect(phaseTransitions.length, 'Should have multiple phase transitions').toBeGreaterThan(0);

    // Verify transitions are in correct order
    const expectedOrder = ['Essential', 'Core', 'Visual', 'Enhanced'];
    let previousIndex = -1;

    phaseTransitions.forEach(transition => {
      const fromIndex = expectedOrder.indexOf(transition.from);
      const toIndex = expectedOrder.indexOf(transition.to);

      expect(toIndex, `Transition to "${transition.to}" should be valid phase`).toBeGreaterThanOrEqual(0);
      expect(toIndex, `Phase should progress forward: ${transition.from} → ${transition.to}`).toBeGreaterThan(fromIndex);

      previousIndex = toIndex;
    });

    // Verify no console errors during transitions
    expect(consoleErrors, 'No console errors during phase transitions').toHaveLength(0);

    console.log('✅ Phase transitions completed smoothly');
  });

  test('FPS Meter Updates Continuously', async ({ page }) => {
    await waitForLoadingStart(page);

    const fpsSamples: number[] = [];
    const sampleCount = 10;

    // Collect FPS samples
    for (let i = 0; i < sampleCount; i++) {
      const fps = await getCurrentFPS(page);
      fpsSamples.push(fps);
      console.log(`FPS sample ${i + 1}: ${fps}`);
      await page.waitForTimeout(500);
    }

    // Verify FPS values are reasonable
    fpsSamples.forEach((fps, index) => {
      expect(fps, `FPS sample ${index + 1} should be >= 0`).toBeGreaterThanOrEqual(0);
      expect(fps, `FPS sample ${index + 1} should be <= 120`).toBeLessThanOrEqual(120);
    });

    // Verify FPS is updating (not stuck at same value)
    const uniqueFPSValues = new Set(fpsSamples).size;
    expect(uniqueFPSValues, 'FPS should update with different values').toBeGreaterThan(1);

    console.log(`✅ FPS meter updated with ${uniqueFPSValues} unique values`);
  });

  test('User Can Dismiss Recommendation', async ({ page }) => {
    // Simulate moderate throttling to trigger recommendation
    await throttleCPU(page, 6);

    await waitForLoadingStart(page);

    let recommendationAppeared = false;
    const maxAttempts = 40;
    let attempts = 0;

    while (attempts < maxAttempts && !recommendationAppeared) {
      recommendationAppeared = await isRecommendationVisible(page);

      if (recommendationAppeared) {
        console.log('✅ Recommendation appeared');

        // Click "Continue" button
        const continueButton = page.locator('[data-testid="continue-without-change"]');
        await expect(continueButton, 'Continue button should be visible').toBeVisible();
        await continueButton.click();

        // Verify recommendation dismissed
        await page.waitForTimeout(500);
        const stillVisible = await isRecommendationVisible(page);
        expect(stillVisible, 'Recommendation should be dismissed after clicking Continue').toBe(false);

        console.log('✅ User successfully dismissed recommendation');
        break;
      }

      attempts++;
      await page.waitForTimeout(500);
    }

    expect(recommendationAppeared, 'Recommendation should appear to test dismissal').toBe(true);
  });

  test('Loading Completes Without Errors', async ({ page }) => {
    const consoleErrors = setupConsoleErrorTracking(page);
    const consoleWarnings: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'warning') {
        consoleWarnings.push(msg.text());
      }
    });

    await waitForLoadingStart(page);

    // Wait for loading to complete or timeout
    await page.waitForFunction(
      () => {
        const loadingElement = document.querySelector('[data-testid="loading-phase"]');
        return loadingElement === null;
      },
      { timeout: 60000 }
    );

    console.log('✅ Loading completed');

    // Check console for errors
    expect(consoleErrors, 'Should have no console errors').toHaveLength(0);

    // Log warnings (if any) but don't fail test
    if (consoleWarnings.length > 0) {
      console.log('⚠️ Console warnings:', consoleWarnings);
    }

    // Verify we're on the main application view
    const loadingElement = await page.locator('[data-testid="loading-phase"]').count();
    expect(loadingElement, 'Loading UI should be removed').toBe(0);
  });

  test('Visual Progress Indicator Works', async ({ page }) => {
    await waitForLoadingStart(page);

    // Check for progress indicator
    const progressBar = page.locator('[data-testid="loading-progress"]');
    await expect(progressBar, 'Progress indicator should be visible').toBeVisible();

    // Track progress values
    const progressValues: number[] = [];

    for (let i = 0; i < 10; i++) {
      const progressText = await progressBar.getAttribute('aria-valuenow');
      if (progressText) {
        const progress = parseInt(progressText, 10);
        progressValues.push(progress);
        console.log(`Progress: ${progress}%`);
      }
      await page.waitForTimeout(500);
    }

    // Verify progress increases
    expect(progressValues.length, 'Should capture progress values').toBeGreaterThan(0);

    const firstProgress = progressValues[0];
    const lastProgress = progressValues[progressValues.length - 1];

    expect(lastProgress, 'Progress should increase over time').toBeGreaterThanOrEqual(firstProgress);

    console.log(`✅ Progress increased from ${firstProgress}% to ${lastProgress}%`);
  });
});
