import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Visualization Page Object Model
 * Represents the 3D visualization and controls
 */
export class VisualizationPage extends BasePage {
  readonly canvas3D: Locator;
  readonly heatMapToggle: Locator;
  readonly weatherToggle: Locator;
  readonly cameraControls: Locator;
  readonly viewModeButtons: Locator;
  readonly zoomControls: Locator;
  readonly resetButton: Locator;
  readonly settingsPanel: Locator;

  constructor(page: Page) {
    super(page);
    this.canvas3D = page.getByTestId('3d-canvas');
    this.heatMapToggle = page.getByTestId('heatmap-toggle');
    this.weatherToggle = page.getByTestId('weather-toggle');
    this.cameraControls = page.getByTestId('camera-controls');
    this.viewModeButtons = page.getByTestId('view-mode');
    this.zoomControls = page.getByTestId('zoom-controls');
    this.resetButton = page.getByTestId('reset-view');
    this.settingsPanel = page.getByTestId('visualization-settings');
  }

  /**
   * Toggle heat map overlay
   */
  async toggleHeatMap() {
    await this.heatMapToggle.click();
  }

  /**
   * Toggle weather effects
   */
  async toggleWeather() {
    await this.weatherToggle.click();
  }

  /**
   * Change camera angle
   */
  async changeCameraAngle(angle: 'top' | 'side' | 'perspective') {
    await this.page.getByTestId(`camera-${angle}`).click();
  }

  /**
   * Zoom in/out
   */
  async zoom(direction: 'in' | 'out') {
    await this.page.getByTestId(`zoom-${direction}`).click();
  }

  /**
   * Reset view to default
   */
  async resetView() {
    await this.resetButton.click();
  }

  /**
   * Wait for 3D scene to render
   */
  async waitFor3DRender(timeout: number = 5000) {
    await this.canvas3D.waitFor({ state: 'visible', timeout });
    // Wait for WebGL initialization
    await this.page.waitForFunction(
      () => {
        const canvas = document.querySelector('[data-testid="3d-canvas"]') as HTMLCanvasElement;
        if (!canvas) return false;
        const gl = canvas.getContext('webgl2');
        return gl !== null;
      },
      { timeout }
    );
  }

  /**
   * Verify heat map is active
   */
  async isHeatMapActive() {
    const toggleState = await this.heatMapToggle.getAttribute('aria-pressed');
    return toggleState === 'true';
  }

  /**
   * Verify weather effects are active
   */
  async isWeatherActive() {
    const toggleState = await this.weatherToggle.getAttribute('aria-pressed');
    return toggleState === 'true';
  }

  /**
   * Get current camera angle
   */
  async getCurrentCameraAngle() {
    const activeButton = this.cameraControls.locator('[aria-pressed="true"]');
    return await activeButton.getAttribute('data-angle');
  }

  /**
   * Perform mouse drag on canvas (for camera rotation)
   */
  async dragCanvas(startX: number, startY: number, endX: number, endY: number) {
    await this.canvas3D.hover();
    await this.page.mouse.move(startX, startY);
    await this.page.mouse.down();
    await this.page.mouse.move(endX, endY);
    await this.page.mouse.up();
  }

  /**
   * Take visual snapshot
   */
  async takeSnapshot(name: string) {
    await this.canvas3D.screenshot({ path: `tests/e2e/screenshots/${name}.png` });
  }
}
