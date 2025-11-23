import { test, expect } from '@playwright/test';

/**
 * Visual Regression Tests - BMS Dashboard
 *
 * Tests visual consistency of Building Management System dashboard.
 * Captures sensor data displays, charts, and control panels.
 */

test.describe('BMS Dashboard Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Open BMS panel if available
    const bmsButton = page.locator('[aria-label*="BMS"]').or(
      page.locator('button:has-text("BMS")')
    ).first();

    if (await bmsButton.count() > 0) {
      await bmsButton.click();
      await page.waitForTimeout(1000);
    }

    // Disable animations for consistent screenshots
    await page.addStyleTag({
      content: '*, *::before, *::after { animation: none !important; transition: none !important; }'
    });
  });

  test('dashboard overview matches baseline', async ({ page }) => {
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('bms-dashboard-overview.png', {
      maxDiffPixels: 150,
      threshold: 0.2,
    });
  });

  test('sensor data panel matches baseline', async ({ page }) => {
    // Focus on sensor data section
    const sensorPanel = page.locator('[data-testid="sensor-panel"]').or(
      page.locator('text=/sensors|monitoring/i').first()
    );

    if (await sensorPanel.count() > 0) {
      await sensorPanel.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      await expect(sensorPanel).toHaveScreenshot('bms-sensor-panel.png', {
        maxDiffPixels: 100,
        threshold: 0.2,
      });
    } else {
      // Capture full page if specific panel not found
      await expect(page).toHaveScreenshot('bms-sensor-panel.png', {
        maxDiffPixels: 150,
        threshold: 0.2,
      });
    }
  });

  test('irrigation controls match baseline', async ({ page }) => {
    const irrigationTab = page.locator('text=/irrigation/i').first();

    if (await irrigationTab.count() > 0) {
      await irrigationTab.click();
      await page.waitForTimeout(500);
    }

    await expect(page).toHaveScreenshot('bms-irrigation-controls.png', {
      maxDiffPixels: 120,
      threshold: 0.2,
    });
  });

  test('environmental data display matches baseline', async ({ page }) => {
    const envTab = page.locator('text=/environment|climate/i').first();

    if (await envTab.count() > 0) {
      await envTab.click();
      await page.waitForTimeout(500);
    }

    await expect(page).toHaveScreenshot('bms-environmental-data.png', {
      maxDiffPixels: 120,
      threshold: 0.2,
    });
  });

  test('alert notifications match baseline', async ({ page }) => {
    // Look for alerts section
    const alertsSection = page.locator('[data-testid="alerts"]').or(
      page.locator('text=/alerts|notifications/i').first()
    );

    if (await alertsSection.count() > 0) {
      await alertsSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      await expect(alertsSection).toHaveScreenshot('bms-alerts.png', {
        maxDiffPixels: 100,
        threshold: 0.2,
      });
    } else {
      // Skip if no alerts section
      test.skip();
    }
  });

  test('historical data charts match baseline', async ({ page }) => {
    const chartsTab = page.locator('text=/history|charts|analytics/i').first();

    if (await chartsTab.count() > 0) {
      await chartsTab.click();
      await page.waitForTimeout(1000); // Wait for chart rendering
    }

    await expect(page).toHaveScreenshot('bms-historical-charts.png', {
      maxDiffPixels: 200,
      threshold: 0.3, // Higher tolerance for charts
    });
  });

  test('system status indicators match baseline', async ({ page }) => {
    const statusSection = page.locator('[data-testid="system-status"]').or(
      page.locator('text=/status|health/i').first()
    );

    if (await statusSection.count() > 0) {
      await statusSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
    }

    await expect(page).toHaveScreenshot('bms-system-status.png', {
      maxDiffPixels: 100,
      threshold: 0.2,
    });
  });
});
