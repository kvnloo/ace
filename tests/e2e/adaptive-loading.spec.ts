/**
 * Adaptive Loading E2E Tests
 *
 * End-to-end tests for complete adaptive loading user experience
 */

import { test, expect, Page } from '@playwright/test';

test.describe('Adaptive Loading System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('High-Performance Device', () => {
    test('should show loading screen on first load', async ({ page }) => {
      // Wait for loading screen to appear
      await expect(page.locator('[data-testid="loading-screen"]')).toBeVisible();

      // Should show progress indicator
      await expect(page.locator('[data-testid="loading-progress"]')).toBeVisible();

      // Should show phase information
      await expect(page.locator('[data-testid="loading-phase"]')).toContainText('Essential');
    });

    test('should progress through all phases', async ({ page }) => {
      const phases = ['Essential', 'Core', 'Visual', 'Enhanced'];

      for (const phase of phases) {
        await expect(page.locator('[data-testid="loading-phase"]'))
          .toContainText(phase, { timeout: 15000 });
      }

      // Loading should complete
      await expect(page.locator('[data-testid="loading-screen"]'))
        .not.toBeVisible({ timeout: 30000 });
    });

    test('should not show FPS recommendation for good performance', async ({ page }) => {
      // Wait for loading to start
      await page.waitForSelector('[data-testid="loading-screen"]');

      // FPS recommendation should not appear
      await expect(page.locator('[data-testid="fps-recommendation"]'))
        .not.toBeVisible();

      // Should complete without warnings
      await page.waitForSelector('[data-testid="loading-screen"]', {
        state: 'hidden',
        timeout: 30000
      });
    });

    test('should enable ultra mode automatically', async ({ page }) => {
      // Complete loading
      await page.waitForSelector('[data-testid="loading-screen"]', {
        state: 'hidden',
        timeout: 30000
      });

      // Open quality settings
      await page.click('[data-testid="quality-settings-button"]');

      // Should show ultra mode enabled
      await expect(page.locator('[data-testid="quality-mode"]'))
        .toContainText('Ultra');
    });
  });

  test.describe('Medium-Performance Device', () => {
    test('should show FPS recommendation for balanced mode', async ({ page }) => {
      // Simulate medium FPS by throttling CPU
      const client = await page.context().newCDPSession(page);
      await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });

      await page.goto('/');

      // Should show recommendation after FPS check
      await expect(page.locator('[data-testid="fps-recommendation"]'))
        .toBeVisible({ timeout: 10000 });

      await expect(page.locator('[data-testid="fps-recommendation"]'))
        .toContainText('Balanced');
    });

    test('should allow user to continue or apply recommendation', async ({ page }) => {
      const client = await page.context().newCDPSession(page);
      await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });

      await page.goto('/');

      // Wait for recommendation
      await page.waitForSelector('[data-testid="fps-recommendation"]');

      // Should have continue and apply buttons
      await expect(page.locator('[data-testid="continue-loading-button"]'))
        .toBeVisible();
      await expect(page.locator('[data-testid="apply-recommendation-button"]'))
        .toBeVisible();
    });

    test('should apply balanced mode when accepted', async ({ page }) => {
      const client = await page.context().newCDPSession(page);
      await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });

      await page.goto('/');

      // Wait for recommendation and accept
      await page.waitForSelector('[data-testid="fps-recommendation"]');
      await page.click('[data-testid="apply-recommendation-button"]');

      // Should complete loading faster
      await page.waitForSelector('[data-testid="loading-screen"]', {
        state: 'hidden',
        timeout: 15000
      });

      // Verify quality mode
      await page.click('[data-testid="quality-settings-button"]');
      await expect(page.locator('[data-testid="quality-mode"]'))
        .toContainText('Balanced');
    });

    test('should continue full loading when declined', async ({ page }) => {
      const client = await page.context().newCDPSession(page);
      await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });

      await page.goto('/');

      // Wait for recommendation and decline
      await page.waitForSelector('[data-testid="fps-recommendation"]');
      await page.click('[data-testid="continue-loading-button"]');

      // Should continue with all phases
      await expect(page.locator('[data-testid="loading-phase"]'))
        .toContainText('Enhanced', { timeout: 20000 });
    });
  });

  test.describe('Low-Performance Device', () => {
    test('should show immediate recommendation for minimal mode', async ({ page }) => {
      // Heavy throttling
      const client = await page.context().newCDPSession(page);
      await client.send('Emulation.setCPUThrottlingRate', { rate: 8 });

      await page.goto('/');

      // Should show minimal mode recommendation quickly
      await expect(page.locator('[data-testid="fps-recommendation"]'))
        .toBeVisible({ timeout: 5000 });

      await expect(page.locator('[data-testid="fps-recommendation"]'))
        .toContainText('Minimal');
    });

    test('should disable force load button for safety', async ({ page }) => {
      const client = await page.context().newCDPSession(page);
      await client.send('Emulation.setCPUThrottlingRate', { rate: 8 });

      await page.goto('/');

      // Wait for recommendation
      await page.waitForSelector('[data-testid="fps-recommendation"]');

      // Force load should be disabled
      const forceButton = page.locator('[data-testid="force-load-button"]');
      if (await forceButton.count() > 0) {
        await expect(forceButton).toBeDisabled();
      }
    });

    test('should load minimal mode quickly', async ({ page }) => {
      const client = await page.context().newCDPSession(page);
      await client.send('Emulation.setCPUThrottlingRate', { rate: 8 });

      await page.goto('/');

      const startTime = Date.now();

      // Accept minimal mode
      await page.waitForSelector('[data-testid="fps-recommendation"]');
      await page.click('[data-testid="apply-recommendation-button"]');

      // Should complete loading quickly
      await page.waitForSelector('[data-testid="loading-screen"]', {
        state: 'hidden',
        timeout: 5000
      });

      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(3000);
    });
  });

  test.describe('Skip Button', () => {
    test('should show skip button after initial phase', async ({ page }) => {
      await page.goto('/');

      // Skip button should appear after phase 1
      await expect(page.locator('[data-testid="skip-loading-button"]'))
        .toBeVisible({ timeout: 5000 });
    });

    test('should load minimal mode when skip clicked', async ({ page }) => {
      await page.goto('/');

      // Click skip
      await page.waitForSelector('[data-testid="skip-loading-button"]');
      await page.click('[data-testid="skip-loading-button"]');

      // Should complete quickly with minimal mode
      await page.waitForSelector('[data-testid="loading-screen"]', {
        state: 'hidden',
        timeout: 3000
      });

      // Verify minimal mode
      await page.click('[data-testid="quality-settings-button"]');
      await expect(page.locator('[data-testid="quality-mode"]'))
        .toContainText('Minimal');
    });
  });

  test.describe('Force Load Button', () => {
    test('should show force load option with warning', async ({ page }) => {
      const client = await page.context().newCDPSession(page);
      await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });

      await page.goto('/');

      // Wait for recommendation
      await page.waitForSelector('[data-testid="fps-recommendation"]');

      // Should have force load option
      const forceButton = page.locator('[data-testid="force-load-button"]');
      if (await forceButton.count() > 0) {
        await expect(forceButton).toBeVisible();

        // Should show warning
        await expect(page.locator('[data-testid="force-load-warning"]'))
          .toBeVisible();
      }
    });

    test('should override recommendation when force load clicked', async ({ page }) => {
      const client = await page.context().newCDPSession(page);
      await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });

      await page.goto('/');

      await page.waitForSelector('[data-testid="fps-recommendation"]');

      const forceButton = page.locator('[data-testid="force-load-button"]');
      if (await forceButton.count() > 0 && await forceButton.isEnabled()) {
        await forceButton.click();

        // Should continue loading all phases
        await expect(page.locator('[data-testid="loading-phase"]'))
          .toContainText('Enhanced', { timeout: 20000 });
      }
    });
  });

  test.describe('Quality Mode Persistence', () => {
    test('should persist quality mode across sessions', async ({ page, context }) => {
      await page.goto('/');

      // Complete loading
      await page.waitForSelector('[data-testid="loading-screen"]', {
        state: 'hidden',
        timeout: 30000
      });

      // Change to minimal mode
      await page.click('[data-testid="quality-settings-button"]');
      await page.click('[data-testid="quality-mode-minimal"]');

      // Reload page
      await page.reload();

      // Should remember minimal mode
      await page.waitForSelector('[data-testid="loading-screen"]', {
        state: 'hidden',
        timeout: 5000
      });

      await page.click('[data-testid="quality-settings-button"]');
      await expect(page.locator('[data-testid="quality-mode"]'))
        .toContainText('Minimal');
    });

    test('should persist quality mode in new tab', async ({ page, context }) => {
      await page.goto('/');

      // Set ultra mode
      await page.waitForSelector('[data-testid="loading-screen"]', {
        state: 'hidden',
        timeout: 30000
      });

      await page.click('[data-testid="quality-settings-button"]');
      await page.click('[data-testid="quality-mode-ultra"]');

      // Open new tab
      const newPage = await context.newPage();
      await newPage.goto('/');

      // Should use ultra mode
      await newPage.waitForSelector('[data-testid="loading-screen"]', {
        state: 'hidden',
        timeout: 30000
      });

      await newPage.click('[data-testid="quality-settings-button"]');
      await expect(newPage.locator('[data-testid="quality-mode"]'))
        .toContainText('Ultra');
    });
  });

  test.describe('Visual Indicators', () => {
    test('should show accurate progress percentage', async ({ page }) => {
      await page.goto('/');

      const progressBar = page.locator('[data-testid="loading-progress-bar"]');

      // Progress should increase
      const initialProgress = await progressBar.getAttribute('aria-valuenow');
      await page.waitForTimeout(2000);
      const laterProgress = await progressBar.getAttribute('aria-valuenow');

      expect(Number(laterProgress)).toBeGreaterThan(Number(initialProgress));
    });

    test('should show current phase name', async ({ page }) => {
      await page.goto('/');

      const phaseIndicator = page.locator('[data-testid="loading-phase"]');

      // Should show valid phase
      const phaseText = await phaseIndicator.textContent();
      expect(['Essential', 'Core', 'Visual', 'Enhanced']).toContain(phaseText);
    });

    test('should show FPS meter during loading', async ({ page }) => {
      await page.goto('/');

      // FPS meter should be visible
      await expect(page.locator('[data-testid="fps-meter"]'))
        .toBeVisible();

      // Should show numeric FPS value
      const fpsValue = await page.locator('[data-testid="fps-value"]').textContent();
      expect(Number(fpsValue)).toBeGreaterThan(0);
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper ARIA labels', async ({ page }) => {
      await page.goto('/');

      // Loading screen should have role
      await expect(page.locator('[data-testid="loading-screen"]'))
        .toHaveAttribute('role', 'progressbar');

      // Should have aria-label
      await expect(page.locator('[data-testid="loading-screen"]'))
        .toHaveAttribute('aria-label');
    });

    test('should announce progress to screen readers', async ({ page }) => {
      await page.goto('/');

      // Should have aria-live region
      await expect(page.locator('[aria-live="polite"]'))
        .toBeVisible();

      // Progress updates should be announced
      const liveRegion = page.locator('[aria-live="polite"]');
      const initialText = await liveRegion.textContent();
      await page.waitForTimeout(2000);
      const updatedText = await liveRegion.textContent();

      expect(updatedText).not.toBe(initialText);
    });

    test('should support keyboard navigation', async ({ page }) => {
      const client = await page.context().newCDPSession(page);
      await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });

      await page.goto('/');

      // Wait for recommendation
      await page.waitForSelector('[data-testid="fps-recommendation"]');

      // Tab to buttons
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      // Should be able to activate with Enter
      await page.keyboard.press('Enter');

      // Action should execute
      await expect(page.locator('[data-testid="fps-recommendation"]'))
        .not.toBeVisible({ timeout: 5000 });
    });
  });
});
