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
    // Wait for court list to be visible
    await this.courtList.waitFor({ state: 'visible', timeout: 10000 });

    // Wait a moment for any animations to complete
    await this.page.waitForTimeout(500);

    const courtItems = this.page.getByTestId('court-item');
    // Ensure court items are loaded
    await courtItems.first().waitFor({ state: 'visible', timeout: 10000 });

    // Click with force to handle overlapping UI elements
    await courtItems.nth(index).click({ force: true });
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
  async waitFor3DSceneLoad(timeout: number = 10000) {
    // Wait for the 3D canvas to be in the DOM (it starts with opacity 0)
    const canvas = this.page.getByTestId('3d-canvas');
    await canvas.waitFor({ state: 'attached', timeout });

    // Wait for WebGL context to be ready on 3d-canvas
    await this.page.waitForFunction(
      () => {
        const canvas = document.querySelector('[data-testid="3d-canvas"]') as HTMLCanvasElement;
        if (!canvas) return false;
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        return gl !== null;
      },
      { timeout }
    );

    // Wait for visualization controls to be ready
    await this.page.getByTestId('visualization-settings').waitFor({ state: 'visible', timeout });

    // Small delay for Three.js scene initialization
    await this.page.waitForTimeout(1000);
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
