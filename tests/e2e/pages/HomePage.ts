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
    await this.courtViewButton.click();
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
