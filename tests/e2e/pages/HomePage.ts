import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Home Page Object Model
 * Represents the landing page of the ACE facility
 */
export class HomePage extends BasePage {
  readonly navigationMenu: Locator;
  readonly courtViewButton: Locator;
  readonly aiChatButton: Locator;
  readonly logo: Locator;
  readonly welcomeMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.navigationMenu = page.getByTestId('navigation-menu');
    this.courtViewButton = page.getByRole('button', { name: /court view/i });
    this.aiChatButton = page.getByTestId('ai-chat-toggle');
    this.logo = page.getByTestId('ace-logo');
    this.welcomeMessage = page.getByRole('heading', { name: /welcome/i });
  }

  /**
   * Navigate to home page
   */
  async navigate() {
    await this.goto('/');
    await this.waitForLoad();
  }

  /**
   * Navigate to court view
   */
  async goToCourtView() {
    // Check if we're on mobile (Court View button hidden in hamburger menu)
    const viewport = this.page.viewportSize();
    const isMobile = viewport ? viewport.width < 768 : false;

    if (isMobile) {
      // Open mobile menu first
      const menuButton = this.page.getByRole('button', { name: /menu/i });
      await menuButton.click({ timeout: 5000, noWaitAfter: true });
      await this.page.waitForTimeout(300); // Wait for menu animation
    }

    // Click Court View button (SPA - no page navigation event)
    await Promise.all([
      this.page.waitForURL(/.*court/, { timeout: 10000 }),
      this.courtViewButton.click({ timeout: 5000, noWaitAfter: true })
    ]);

    // Wait for court list to appear (component mount + animation)
    await this.page.getByTestId('court-list').waitFor({ state: 'visible', timeout: 15000 });
  }

  /**
   * Open AI chat
   */
  async openAIChat() {
    await this.aiChatButton.click();
  }

  /**
   * Verify page is loaded
   */
  async verifyPageLoaded() {
    await this.logo.waitFor({ state: 'visible' });
  }
}
