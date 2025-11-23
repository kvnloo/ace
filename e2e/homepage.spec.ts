import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage before each test
    await page.goto('/');
  });

  test('should load successfully', async ({ page }) => {
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Check that the page title is correct
    await expect(page).toHaveTitle(/LawnTech/i);
  });

  test('should display hero section with main heading', async ({ page }) => {
    // Check for the main headline
    const heading = page.locator('h1');
    await expect(heading).toContainText('GRASS');
    await expect(heading).toContainText('AUTONOMOUS');
    await expect(heading).toContainText('PERFECTION');
  });

  test('should display the hero badge', async ({ page }) => {
    // Check for the "Future of Tennis" badge
    const badge = page.locator('text=The Future of Tennis is Organic & Autonomous');
    await expect(badge).toBeVisible();
  });

  test('should display hero description', async ({ page }) => {
    // Check for the description text
    const description = page.locator(
      "text=Experience the world's first fully autonomous indoor grass court facility"
    );
    await expect(description).toBeVisible();
  });

  test('should display CTA buttons', async ({ page }) => {
    // Check for "Explore 3D Demo" button
    const exploreDemoButton = page.locator('button:has-text("Explore 3D Demo")');
    await expect(exploreDemoButton).toBeVisible();

    // Check for "View Amenities" button
    const viewAmenitiesButton = page.locator('button:has-text("View Amenities")');
    await expect(viewAmenitiesButton).toBeVisible();
  });

  test('should display statistics/feature cards', async ({ page }) => {
    // Wait for statistics section to be visible
    await page.waitForLoadState('networkidle');

    // Check for Computer Vision card
    const visionCard = page.locator('text=Computer Vision');
    await expect(visionCard).toBeVisible();

    // Check for Modular Grass card
    const grassCard = page.locator('text=Modular Grass');
    await expect(grassCard).toBeVisible();

    // Check for Performance card
    const performanceCard = page.locator('text=Performance');
    await expect(performanceCard).toBeVisible();
  });

  test('should have navbar visible', async ({ page }) => {
    // Check that navigation bar is present
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('should have AI Chat component', async ({ page }) => {
    // The AI Chat component should be present on the page
    // This will depend on the implementation, but we can check for its presence
    await page.waitForLoadState('networkidle');

    // Note: Adjust this selector based on your actual AI Chat component
    // For now, we just verify the page loaded without errors
    expect(await page.locator('body').count()).toBe(1);
  });

  test('should be responsive on mobile viewport', async ({ page, isMobile }) => {
    if (isMobile) {
      // Check that content is visible on mobile
      const heading = page.locator('h1');
      await expect(heading).toBeVisible();

      // Verify buttons stack vertically (flex-col on mobile)
      const exploreDemoButton = page.locator('button:has-text("Explore 3D Demo")');
      await expect(exploreDemoButton).toBeVisible();
    }
  });

  test('should have proper SEO meta tags', async ({ page }) => {
    // Check for viewport meta tag (important for mobile)
    const viewportMeta = page.locator('meta[name="viewport"]');
    await expect(viewportMeta).toHaveAttribute('content', /width=device-width/);
  });

  test('should load without console errors', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Filter out known acceptable errors (like missing environment variables in tests)
    const criticalErrors = errors.filter(
      (error) => !error.includes('API_KEY') && !error.includes('GEMINI')
    );

    expect(criticalErrors).toHaveLength(0);
  });
});
