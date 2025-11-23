import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Court View Page Object Model
 * Represents the tennis court visualization page
 */
export class CourtViewPage extends BasePage {
  readonly courtCanvas: Locator;
  readonly courtList: Locator;
  readonly courtDetails: Locator;
  readonly courtTitle: Locator;
  readonly loadingIndicator: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.courtCanvas = page.getByTestId('court-canvas');
    this.courtList = page.getByTestId('court-list');
    this.courtDetails = page.getByTestId('court-details');
    this.courtTitle = page.getByTestId('court-title');
    this.loadingIndicator = page.getByTestId('loading-indicator');
    this.errorMessage = page.getByTestId('error-message');
  }

  /**
   * Select a court by index
   */
  async selectCourt(index: number = 0) {
    const courtItems = this.page.getByTestId('court-item');
    await courtItems.nth(index).click();
  }

  /**
   * Select court by name
   */
  async selectCourtByName(name: string) {
    await this.page.getByRole('button', { name }).click();
  }

  /**
   * Wait for 3D scene to load
   */
  async waitFor3DSceneLoad(timeout: number = 5000) {
    await this.courtCanvas.waitFor({ state: 'visible', timeout });
    // Wait for WebGL context to be ready
    await this.page.waitForFunction(
      () => {
        const canvas = document.querySelector('[data-testid="court-canvas"]') as HTMLCanvasElement;
        return canvas && canvas.getContext('webgl2') !== null;
      },
      { timeout }
    );
  }

  /**
   * Get court details text
   */
  async getCourtDetailsText() {
    return await this.courtDetails.textContent();
  }

  /**
   * Verify court is selected
   */
  async verifyCourtSelected(courtName: string) {
    const titleText = await this.courtTitle.textContent();
    return titleText?.includes(courtName) || false;
  }

  /**
   * Check if loading indicator is visible
   */
  async isLoading() {
    return await this.loadingIndicator.isVisible();
  }
}
