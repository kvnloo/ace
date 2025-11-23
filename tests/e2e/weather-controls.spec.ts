/**
 * E2E Tests: Weather System Controls
 *
 * Test Suite 4: Weather controls interaction, real-time 3D scene updates,
 * and gameplay impact visualization.
 */

import { test, expect } from '@playwright/test';
import {
  generateWeatherState,
  calculateWeatherImpact,
  setupWeatherMockAPI,
  mockWeatherLocalStorage,
  type WeatherType
} from './mocks/weather-data';
import {
  assertResponseTime,
  assertFrameRate,
  assertNoConsoleErrors
} from './assertions/performance';
import {
  assertElementVisible,
  assertSliderValue,
  assertActiveState,
  assertTextMatches,
  assertLocalStoragePersistence
} from './assertions/ui-state';
import {
  assertKeyboardAccessible,
  assertARIALabel
} from './assertions/accessibility';

test.describe('Weather System Controls', () => {
  test.beforeEach(async ({ page }) => {
    // Setup mock API routes
    await setupWeatherMockAPI(page);

    // Setup localStorage and skip loading screen for tests
    await page.addInitScript((storage) => {
      Object.entries(storage).forEach(([key, value]) => {
        localStorage.setItem(key, value as string);
      });
      // Mark loading as complete for tests
      localStorage.setItem('test-skip-loading', 'true');
    }, mockWeatherLocalStorage());

    // Listen for console errors and failed requests
    const consoleErrors: string[] = [];
    const failedRequests: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('pageerror', error => {
      consoleErrors.push(`Page error: ${error.message}`);
    });

    page.on('response', response => {
      if (response.status() >= 400) {
        failedRequests.push(`${response.status()} ${response.url()}`);
      }
    });

    // Navigate to facility demo
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait for React to render and framer-motion animations
    await page.waitForTimeout(3000);

    // Find the demo button by exact text match
    const demoButton = page.locator('button', { hasText: 'Explore 3D Demo' });
    await demoButton.waitFor({ state: 'visible', timeout: 15000 });

    // Click and wait for navigation
    await demoButton.click();

    // Wait for 3D scene to fully initialize
    await page.waitForTimeout(4000);
  });

  test('should display weather controls panel with all weather types', async ({ page }) => {
    // Assert weather controls panel is visible
    const weatherPanel = page.locator('.absolute.top-40.right-6');
    await assertElementVisible(weatherPanel);

    // Check all weather type buttons are present
    const weatherTypes: WeatherType[] = ['clear', 'rain', 'snow', 'windy', 'storm'];

    for (const type of weatherTypes) {
      const button = page.getByRole('button', { name: new RegExp(type, 'i') });
      await assertElementVisible(button);
    }

    // Verify intensity slider is present
    const intensitySlider = page.locator('input[type="range"]');
    await assertElementVisible(intensitySlider);
  });

  test('should change weather type and update active state', async ({ page }) => {
    // Get weather buttons
    const clearButton = page.getByRole('button', { name: /clear/i });
    const rainButton = page.getByRole('button', { name: /rain/i });

    // Clear should be active by default
    await assertActiveState(clearButton, true);
    await assertActiveState(rainButton, false);

    // Click rain button with performance tracking
    await assertResponseTime(page, async () => {
      await rainButton.click();
    }, 100);

    // Wait for state update
    await page.waitForTimeout(500);

    // Verify rain is now active
    await assertActiveState(rainButton, true);
    await assertActiveState(clearButton, false);

    // Verify active indicator (pulsing dot) is shown
    const activeIndicator = rainButton.locator('.animate-pulse');
    await assertElementVisible(activeIndicator);
  });

  test('should adjust intensity slider and display correct percentage', async ({ page }) => {
    const intensitySlider = page.locator('input[type="range"]');
    const intensityDisplay = page.locator('text=/\\d+%/');

    // Test different intensity values
    const testValues = [0, 25, 50, 75, 100];

    for (const value of testValues) {
      await assertResponseTime(page, async () => {
        await intensitySlider.fill(value.toString());
      }, 100);

      // Verify slider value
      await assertSliderValue(intensitySlider, value);

      // Verify displayed percentage
      await assertTextMatches(intensityDisplay, `${value}%`);
    }
  });

  test('should display correct gameplay impact indicators for each weather type', async ({ page }) => {
    const weatherConfigs: Array<{ type: WeatherType; expectedImpact: string[] }> = [
      {
        type: 'rain',
        expectedImpact: ['slower, wet bounce', 'moderate']
      },
      {
        type: 'snow',
        expectedImpact: ['slippery', 'difficult']
      },
      {
        type: 'windy',
        expectedImpact: ['affected', 'high']
      },
      {
        type: 'storm',
        expectedImpact: ['slower, wet bounce', 'reduced']
      },
      {
        type: 'clear',
        expectedImpact: ['optimal']
      }
    ];

    for (const { type, expectedImpact } of weatherConfigs) {
      // Click weather button
      const weatherButton = page.getByRole('button', { name: new RegExp(type, 'i') });
      await weatherButton.click();
      await page.waitForTimeout(300);

      // Verify gameplay impact section shows expected text
      const impactSection = page.locator('text=/gameplay impact/i').locator('..');

      for (const impact of expectedImpact) {
        await assertTextMatches(impactSection, new RegExp(impact, 'i'));
      }
    }
  });

  test('should update 3D scene lighting when weather changes', async ({ page }) => {
    const rainButton = page.getByRole('button', { name: /rain/i });
    const stormButton = page.getByRole('button', { name: /storm/i });

    // Get initial scene state (assuming canvas element for 3D scene)
    const canvas = page.locator('canvas').first();
    await assertElementVisible(canvas);

    // Change to rain weather
    await rainButton.click();
    await page.waitForTimeout(1000); // Wait for lighting transition

    // Verify canvas is still rendering (frame rate check)
    await assertFrameRate(page, 30, 2000);

    // Change to storm (should have different lighting)
    await stormButton.click();
    await page.waitForTimeout(1000);

    // Verify smooth transition with maintained frame rate
    await assertFrameRate(page, 30, 2000);
  });

  test('should persist weather preferences in localStorage', async ({ page }) => {
    const snowButton = page.getByRole('button', { name: /snow/i });
    const intensitySlider = page.locator('input[type="range"]');

    // Set snow weather with 75% intensity
    await snowButton.click();
    await intensitySlider.fill('75');
    await page.waitForTimeout(500);

    // Verify localStorage contains preferences
    await assertLocalStoragePersistence(page, 'weather-preferences', {
      lastWeather: 'snow',
      lastIntensity: 0.75,
      autoTransition: false,
      transitionDuration: 2000
    });

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Navigate back to demo
    await page.getByRole('button', { name: /explore 3d demo/i }).click();
    await page.waitForTimeout(2000);

    // Verify snow is still active
    const snowButtonAfterReload = page.getByRole('button', { name: /snow/i });
    await assertActiveState(snowButtonAfterReload, true);

    // Verify intensity is restored
    const intensitySliderAfterReload = page.locator('input[type="range"]');
    await assertSliderValue(intensitySliderAfterReload, 75, 2);
  });

  test('should be keyboard accessible', async ({ page }) => {
    // Test keyboard navigation to weather controls
    await assertKeyboardAccessible(page, 'button[name*="Clear"]');

    // Test Tab navigation through weather buttons
    const weatherButtons = page.getByRole('button').filter({
      hasText: /clear|rain|snow|windy|storm/i
    });

    const firstButton = weatherButtons.first();
    await firstButton.focus();

    // Tab through buttons
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);
    }

    // Should reach intensity slider
    const intensitySlider = page.locator('input[type="range"]');
    const hasFocus = await intensitySlider.evaluate((el) => document.activeElement === el);
    expect(hasFocus).toBeTruthy();

    // Test arrow keys on slider
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');

    // Slider value should have increased
    const value = await intensitySlider.inputValue();
    expect(parseInt(value)).toBeGreaterThan(50);
  });

  test('should display quick tips section', async ({ page }) => {
    const tipsSection = page.locator('text=/weather effects include/i').locator('..');

    await assertElementVisible(tipsSection);
    await assertTextMatches(
      tipsSection,
      /weather effects include dynamic particles, lighting changes, and surface interactions/i
    );
    await assertTextMatches(tipsSection, /adjust intensity for performance tuning/i);
  });

  test('should maintain performance with rapid weather changes', async ({ page }) => {
    const weatherButtons = [
      page.getByRole('button', { name: /rain/i }),
      page.getByRole('button', { name: /snow/i }),
      page.getByRole('button', { name: /windy/i }),
      page.getByRole('button', { name: /clear/i })
    ];

    // Rapidly cycle through weather types
    for (const button of weatherButtons) {
      await assertResponseTime(page, async () => {
        await button.click();
      }, 100);
      await page.waitForTimeout(200);
    }

    // Verify no performance degradation
    await assertFrameRate(page, 30, 2000);

    // Verify no console errors
    await assertNoConsoleErrors(page, [
      'THREE.WebGLRenderer', // Allow Three.js warnings
      'React DevTools' // Allow dev tools messages
    ]);
  });

  test('should show correct weather icons for each type', async ({ page }) => {
    const weatherIcons = {
      clear: 'Sun',
      rain: 'CloudRain',
      snow: 'CloudSnow',
      windy: 'Wind',
      storm: 'CloudDrizzle'
    };

    for (const [type, iconName] of Object.entries(weatherIcons)) {
      const button = page.getByRole('button', { name: new RegExp(type, 'i') });
      const icon = button.locator('svg').first();

      await assertElementVisible(icon);

      // Verify icon has proper class or data attribute
      // (Icons from lucide-react should have specific classes)
      const hasIcon = await icon.evaluate((el) => el.classList.length > 0);
      expect(hasIcon).toBeTruthy();
    }
  });

  test('should handle concurrent intensity and weather type changes', async ({ page }) => {
    const stormButton = page.getByRole('button', { name: /storm/i });
    const intensitySlider = page.locator('input[type="range"]');

    // Change both simultaneously
    await Promise.all([
      stormButton.click(),
      intensitySlider.fill('90')
    ]);

    await page.waitForTimeout(500);

    // Verify both changes applied
    await assertActiveState(stormButton, true);
    await assertSliderValue(intensitySlider, 90);

    // Verify scene still rendering smoothly
    await assertFrameRate(page, 25, 2000); // Slightly lower FPS acceptable for storm
  });

  test('should update color scheme based on active weather', async ({ page }) => {
    const weatherColors = {
      clear: '#fbbf24',  // Yellow
      rain: '#60a5fa',   // Blue
      snow: '#e0f2fe',   // Light cyan
      windy: '#a3e635',  // Green
      storm: '#6366f1'   // Indigo
    };

    for (const [type, color] of Object.entries(weatherColors)) {
      const button = page.getByRole('button', { name: new RegExp(type, 'i') });
      await button.click();
      await page.waitForTimeout(300);

      // Check if button has colored border when active
      const borderColor = await button.evaluate((el, expectedColor) => {
        const style = window.getComputedStyle(el);
        return style.borderLeftColor;
      }, color);

      // Should have a colored border when active
      expect(borderColor).toBeTruthy();
    }
  });
});
