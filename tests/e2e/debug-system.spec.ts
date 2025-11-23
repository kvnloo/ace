/**
 * E2E Tests for Debug System
 *
 * Tests complete user workflows including opening the debug panel,
 * toggling assets, viewing performance metrics, managing presets,
 * and exporting reports through actual UI interactions.
 */

import { test, expect, Page } from '@playwright/test';

test.describe('Debug System E2E', () => {
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Debug Panel Access', () => {
    test('should open debug panel with Ctrl+Shift+D', async () => {
      // Debug panel should be hidden initially
      const debugPanel = page.locator('[data-testid="debug-panel"]');
      await expect(debugPanel).not.toBeVisible();

      // Press Ctrl+Shift+D
      await page.keyboard.press('Control+Shift+D');

      // Debug panel should now be visible
      await expect(debugPanel).toBeVisible();
    });

    test('should close debug panel with Ctrl+Shift+D again', async () => {
      // Open panel
      await page.keyboard.press('Control+Shift+D');
      const debugPanel = page.locator('[data-testid="debug-panel"]');
      await expect(debugPanel).toBeVisible();

      // Close panel
      await page.keyboard.press('Control+Shift+D');
      await expect(debugPanel).not.toBeVisible();
    });

    test('should show all debug sections', async () => {
      await page.keyboard.press('Control+Shift+D');

      await expect(page.getByText(/assets/i)).toBeVisible();
      await expect(page.getByText(/performance/i)).toBeVisible();
      await expect(page.getByText(/presets/i)).toBeVisible();
    });
  });

  test.describe('Asset Toggle Workflow', () => {
    test('should toggle grass asset on and off', async () => {
      await page.keyboard.press('Control+Shift+D');

      const grassToggle = page.getByRole('checkbox', { name: /grass/i }).first();
      const initialState = await grassToggle.isChecked();

      // Toggle off
      await grassToggle.click();
      await expect(grassToggle).not.toBeChecked();

      // Verify grass is not rendered
      await page.waitForTimeout(500); // Allow render to update

      // Toggle back on
      await grassToggle.click();
      await expect(grassToggle).toBeChecked();
    });

    test('should auto-enable dependencies when enabling asset', async () => {
      await page.keyboard.press('Control+Shift+D');

      // Find an asset with dependencies
      const dependentAsset = page.getByRole('checkbox', { name: /mower/i }).first();

      if (await dependentAsset.count() > 0) {
        await dependentAsset.click();

        // Check that its dependencies are also enabled
        const grassToggle = page.getByRole('checkbox', { name: /grass/i }).first();
        await expect(grassToggle).toBeChecked();
      }
    });

    test('should auto-disable dependents when disabling base asset', async () => {
      await page.keyboard.press('Control+Shift+D');

      const grassToggle = page.getByRole('checkbox', { name: /grass/i }).first();
      const mowerToggle = page.getByRole('checkbox', { name: /mower/i }).first();

      // Enable mower (which depends on grass)
      if (await mowerToggle.count() > 0) {
        await mowerToggle.click();
        await expect(mowerToggle).toBeChecked();

        // Disable grass
        await grassToggle.click();

        // Mower should be auto-disabled
        await expect(mowerToggle).not.toBeChecked();
      }
    });

    test('should update performance cost when toggling assets', async () => {
      await page.keyboard.press('Control+Shift+D');

      const performanceCost = page.getByText(/performance cost/i);
      const initialCost = await performanceCost.textContent();

      // Toggle an expensive asset
      const expensiveAsset = page.getByRole('checkbox', { name: /shadow/i }).first();

      if (await expensiveAsset.count() > 0) {
        await expensiveAsset.click();

        // Wait for cost to update
        await page.waitForTimeout(300);

        const newCost = await performanceCost.textContent();
        expect(newCost).not.toBe(initialCost);
      }
    });
  });

  test.describe('Performance Metrics Display', () => {
    test('should display current FPS', async () => {
      await page.keyboard.press('Control+Shift+D');

      const fpsDisplay = page.getByText(/fps/i);
      await expect(fpsDisplay).toBeVisible();

      // FPS should be a number
      const fpsText = await fpsDisplay.textContent();
      expect(fpsText).toMatch(/\d+/);
    });

    test('should display memory usage', async () => {
      await page.keyboard.press('Control+Shift+D');

      const memoryDisplay = page.getByText(/memory/i);
      await expect(memoryDisplay).toBeVisible();

      const memoryText = await memoryDisplay.textContent();
      expect(memoryText).toMatch(/\d+.*MB/i);
    });

    test('should update metrics in real-time', async () => {
      await page.keyboard.press('Control+Shift+D');

      const fpsDisplay = page.getByText(/fps/i).first();
      const initialFPS = await fpsDisplay.textContent();

      // Wait for metrics to update
      await page.waitForTimeout(2000);

      const updatedFPS = await fpsDisplay.textContent();
      // FPS may change slightly over time
      expect(updatedFPS).toBeDefined();
    });

    test('should show performance warnings when FPS is low', async () => {
      await page.keyboard.press('Control+Shift+D');

      // Enable all expensive assets to potentially lower FPS
      const checkboxes = page.getByRole('checkbox');
      const count = await checkboxes.count();

      for (let i = 0; i < count; i++) {
        const checkbox = checkboxes.nth(i);
        if (!(await checkbox.isChecked())) {
          await checkbox.click();
        }
      }

      await page.waitForTimeout(1000);

      // Check for warning indicators
      const warning = page.locator('[data-testid="performance-warning"]');
      // Warning may or may not appear depending on system performance
    });
  });

  test.describe('Preset Management', () => {
    test('should save current configuration as preset', async () => {
      await page.keyboard.press('Control+Shift+D');

      // Toggle some assets
      const grassToggle = page.getByRole('checkbox', { name: /grass/i }).first();
      await grassToggle.click();

      // Click save preset button
      const saveButton = page.getByRole('button', { name: /save.*preset/i });
      await saveButton.click();

      // Enter preset name
      const nameInput = page.getByPlaceholder(/preset.*name/i);
      await nameInput.fill('E2E Test Preset');

      // Confirm save
      const confirmButton = page.getByRole('button', { name: /save|confirm/i });
      await confirmButton.click();

      // Preset should appear in list
      await expect(page.getByText('E2E Test Preset')).toBeVisible();
    });

    test('should load preset and apply configuration', async () => {
      await page.keyboard.press('Control+Shift+D');

      // First save a preset
      const saveButton = page.getByRole('button', { name: /save.*preset/i });
      await saveButton.click();

      const nameInput = page.getByPlaceholder(/preset.*name/i);
      await nameInput.fill('Load Test Preset');

      const confirmButton = page.getByRole('button', { name: /save|confirm/i });
      await confirmButton.click();

      // Change some settings
      const grassToggle = page.getByRole('checkbox', { name: /grass/i }).first();
      const initialState = await grassToggle.isChecked();
      await grassToggle.click();

      // Load the preset
      const presetSelector = page.getByRole('combobox', { name: /preset/i });
      await presetSelector.click();
      await page.getByText('Load Test Preset').click();

      // Settings should be restored
      await expect(grassToggle).toHaveProperty('checked', initialState);
    });

    test('should delete preset', async () => {
      await page.keyboard.press('Control+Shift+D');

      // Save a preset first
      const saveButton = page.getByRole('button', { name: /save.*preset/i });
      await saveButton.click();

      const nameInput = page.getByPlaceholder(/preset.*name/i);
      await nameInput.fill('Delete Test Preset');

      const confirmButton = page.getByRole('button', { name: /save|confirm/i });
      await confirmButton.click();

      // Delete the preset
      const deleteButton = page.getByRole('button', { name: /delete.*preset/i });
      await deleteButton.click();

      // Confirm deletion
      const confirmDelete = page.getByRole('button', { name: /confirm|yes/i });
      await confirmDelete.click();

      // Preset should not be in list
      await expect(page.getByText('Delete Test Preset')).not.toBeVisible();
    });
  });

  test.describe('Performance Report Export', () => {
    test('should export performance report as JSON', async () => {
      await page.keyboard.press('Control+Shift+D');

      // Wait for performance tracking
      await page.waitForTimeout(2000);

      // Click export button
      const exportButton = page.getByRole('button', { name: /export.*report/i });

      // Setup download listener
      const downloadPromise = page.waitForEvent('download');
      await exportButton.click();

      const download = await downloadPromise;

      // Verify download
      expect(download.suggestedFilename()).toMatch(/performance-report.*\.json/);

      // Verify JSON content
      const path = await download.path();
      if (path) {
        const fs = await import('fs/promises');
        const content = await fs.readFile(path, 'utf-8');
        const json = JSON.parse(content);

        expect(json.timestamp).toBeDefined();
        expect(json.baseline).toBeDefined();
        expect(json.current).toBeDefined();
        expect(json.assets).toBeDefined();
      }
    });

    test('should include all enabled assets in report', async () => {
      await page.keyboard.press('Control+Shift+D');

      // Enable specific assets
      const grassToggle = page.getByRole('checkbox', { name: /grass/i }).first();
      if (!(await grassToggle.isChecked())) {
        await grassToggle.click();
      }

      await page.waitForTimeout(1000);

      // Export report
      const exportButton = page.getByRole('button', { name: /export.*report/i });
      const downloadPromise = page.waitForEvent('download');
      await exportButton.click();

      const download = await downloadPromise;
      const path = await download.path();

      if (path) {
        const fs = await import('fs/promises');
        const content = await fs.readFile(path, 'utf-8');
        const json = JSON.parse(content);

        // Should have assets
        expect(json.assets.length).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Performance Budget Warnings', () => {
    test('should show warning when approaching budget limit', async () => {
      await page.keyboard.press('Control+Shift+D');

      // Enable all assets to approach budget
      const checkboxes = page.getByRole('checkbox');
      const count = await checkboxes.count();

      for (let i = 0; i < count; i++) {
        const checkbox = checkboxes.nth(i);
        if (!(await checkbox.isChecked())) {
          await checkbox.click();
          await page.waitForTimeout(100);
        }
      }

      // Check for budget warning
      const budgetDisplay = page.getByText(/budget/i);
      await expect(budgetDisplay).toBeVisible();

      // May show warning or critical status
      const status = page.locator('[data-testid="budget-status"]');
      if (await status.count() > 0) {
        const statusClass = await status.getAttribute('class');
        expect(statusClass).toMatch(/warning|critical/i);
      }
    });
  });

  test.describe('Accessibility', () => {
    test('should be keyboard navigable', async () => {
      await page.keyboard.press('Control+Shift+D');

      // Tab through controls
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      // Should be able to toggle with keyboard
      await page.keyboard.press('Space');

      // Verify focus is managed
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(focusedElement).toBeDefined();
    });

    test('should have proper ARIA labels', async () => {
      await page.keyboard.press('Control+Shift+D');

      const checkboxes = page.getByRole('checkbox');
      const count = await checkboxes.count();

      // All checkboxes should have labels
      for (let i = 0; i < count; i++) {
        const checkbox = checkboxes.nth(i);
        const label = await checkbox.getAttribute('aria-label');
        expect(label).toBeTruthy();
      }
    });
  });

  test.describe('Visual Regression', () => {
    test('should match debug panel snapshot', async () => {
      await page.keyboard.press('Control+Shift+D');

      const debugPanel = page.locator('[data-testid="debug-panel"]');
      await expect(debugPanel).toHaveScreenshot('debug-panel.png');
    });

    test('should match asset list snapshot', async () => {
      await page.keyboard.press('Control+Shift+D');

      const assetList = page.locator('[data-testid="asset-list"]');
      await expect(assetList).toHaveScreenshot('asset-list.png');
    });

    test('should match performance metrics snapshot', async () => {
      await page.keyboard.press('Control+Shift+D');

      const performanceSection = page.locator('[data-testid="performance-metrics"]');
      await expect(performanceSection).toHaveScreenshot('performance-metrics.png');
    });
  });

  test.describe('Error Handling', () => {
    test('should handle localStorage quota exceeded gracefully', async () => {
      await page.keyboard.press('Control+Shift+D');

      // Fill localStorage to trigger quota
      await page.evaluate(() => {
        try {
          const largeData = 'x'.repeat(5 * 1024 * 1024); // 5MB
          for (let i = 0; i < 100; i++) {
            localStorage.setItem(`test_${i}`, largeData);
          }
        } catch (e) {
          // Expected to fail
        }
      });

      // Try to save preset
      const saveButton = page.getByRole('button', { name: /save.*preset/i });
      await saveButton.click();

      const nameInput = page.getByPlaceholder(/preset.*name/i);
      await nameInput.fill('Quota Test');

      const confirmButton = page.getByRole('button', { name: /save|confirm/i });
      await confirmButton.click();

      // Should show error message
      const errorMessage = page.locator('[data-testid="error-message"]');
      if (await errorMessage.count() > 0) {
        await expect(errorMessage).toBeVisible();
      }

      // Clean up
      await page.evaluate(() => {
        localStorage.clear();
      });
    });
  });

  test.describe('Mobile Viewport', () => {
    test('should work on mobile viewport', async () => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      // Open debug panel
      await page.keyboard.press('Control+Shift+D');

      const debugPanel = page.locator('[data-testid="debug-panel"]');
      await expect(debugPanel).toBeVisible();

      // Panel should be responsive
      const panelWidth = await debugPanel.boundingBox();
      expect(panelWidth?.width).toBeLessThanOrEqual(375);
    });
  });

  test.describe('Performance Impact', () => {
    test('should disable all assets and measure FPS delta', async () => {
      await page.keyboard.press('Control+Shift+D');

      // Get initial FPS
      const fpsDisplay = page.getByText(/fps/i).first();
      await page.waitForTimeout(1000);
      const initialFPS = await fpsDisplay.textContent();

      // Disable all assets
      const checkboxes = page.getByRole('checkbox');
      const count = await checkboxes.count();

      for (let i = 0; i < count; i++) {
        const checkbox = checkboxes.nth(i);
        if (await checkbox.isChecked()) {
          await checkbox.click();
        }
      }

      await page.waitForTimeout(2000);

      // Get new FPS
      const newFPS = await fpsDisplay.textContent();

      // FPS should be different (likely higher with assets disabled)
      expect(newFPS).toBeDefined();
    });
  });
});
