import { Page, Locator } from '@playwright/test';

/**
 * Base Page Object Model
 * Provides common functionality for all page objects
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL
   */
  async goto(path: string = '/') {
    await this.page.goto(path);
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Take a screenshot
   */
  async screenshot(name: string) {
    await this.page.screenshot({ path: `tests/e2e/screenshots/${name}.png` });
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(selector: string, timeout: number = 5000) {
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
  }

  /**
   * Get element by test ID
   */
  getByTestId(testId: string): Locator {
    return this.page.getByTestId(testId);
  }

  /**
   * Get element by role
   */
  getByRole(role: 'button' | 'link' | 'heading' | 'textbox' | 'dialog', options?: { name?: string | RegExp }) {
    return this.page.getByRole(role, options);
  }

  /**
   * Wait for API response
   */
  async waitForAPIResponse(urlPattern: string | RegExp, timeout: number = 5000) {
    return await this.page.waitForResponse(
      response => {
        const url = response.url();
        if (typeof urlPattern === 'string') {
          return url.includes(urlPattern);
        }
        return urlPattern.test(url);
      },
      { timeout }
    );
  }

  /**
   * Mock API response
   */
  async mockAPIResponse(url: string | RegExp, response: any) {
    await this.page.route(url, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response)
      });
    });
  }

  /**
   * Simulate network error
   */
  async simulateNetworkError(url: string | RegExp) {
    await this.page.route(url, async route => {
      await route.abort('failed');
    });
  }
}
