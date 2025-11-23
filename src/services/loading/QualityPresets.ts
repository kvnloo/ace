/**
 * Quality preset configurations for adaptive performance management
 */

export enum QualityMode {
  EMERGENCY = 'emergency',
  MINIMAL = 'minimal',
  BALANCED = 'balanced',
  QUALITY = 'quality',
  ULTRA = 'ultra'
}

export interface QualitySettings {
  shadowQuality: 'off' | 'low' | 'medium' | 'high';
  grassDensity: number; // 0-1
  particleCount: number;
  postProcessing: boolean;
  weatherEffects: boolean;
  lodDistance: number; // meters
}

export interface QualityPreset {
  mode: QualityMode;
  name: string;
  description: string;
  enabledAssets: string[];
  disabledAssets: string[];
  settings: QualitySettings;
  targetFPS: { min: number; max: number };
  estimatedMemory: number; // MB
}

export const QUALITY_PRESETS: Record<QualityMode, QualityPreset> = {
  [QualityMode.EMERGENCY]: {
    mode: QualityMode.EMERGENCY,
    name: 'Emergency',
    description: 'Minimal rendering for critical performance recovery',
    enabledAssets: ['courts'],
    disabledAssets: [
      'buildings',
      'grass',
      'trees',
      'particles',
      'weather',
      'postProcessing',
      'shadows',
      'reflections'
    ],
    settings: {
      shadowQuality: 'off',
      grassDensity: 0,
      particleCount: 0,
      postProcessing: false,
      weatherEffects: false,
      lodDistance: 50
    },
    targetFPS: { min: 60, max: 120 },
    estimatedMemory: 128
  },

  [QualityMode.MINIMAL]: {
    mode: QualityMode.MINIMAL,
    name: 'Minimal',
    description: 'Basic scene with essential elements only',
    enabledAssets: ['courts', 'buildings'],
    disabledAssets: [
      'grass',
      'trees',
      'particles',
      'weather',
      'postProcessing',
      'shadows',
      'reflections'
    ],
    settings: {
      shadowQuality: 'off',
      grassDensity: 0,
      particleCount: 0,
      postProcessing: false,
      weatherEffects: false,
      lodDistance: 75
    },
    targetFPS: { min: 50, max: 55 },
    estimatedMemory: 256
  },

  [QualityMode.BALANCED]: {
    mode: QualityMode.BALANCED,
    name: 'Balanced',
    description: 'Good balance between performance and visuals',
    enabledAssets: ['courts', 'buildings', 'grass'],
    disabledAssets: [
      'particles',
      'reflections',
      'trees'
    ],
    settings: {
      shadowQuality: 'low',
      grassDensity: 0.3,
      particleCount: 0,
      postProcessing: false,
      weatherEffects: true,
      lodDistance: 100
    },
    targetFPS: { min: 40, max: 45 },
    estimatedMemory: 512
  },

  [QualityMode.QUALITY]: {
    mode: QualityMode.QUALITY,
    name: 'Quality',
    description: 'High visual quality with good performance',
    enabledAssets: ['courts', 'buildings', 'grass', 'trees', 'weather'],
    disabledAssets: ['particles'],
    settings: {
      shadowQuality: 'medium',
      grassDensity: 0.7,
      particleCount: 0,
      postProcessing: true,
      weatherEffects: true,
      lodDistance: 150
    },
    targetFPS: { min: 45, max: 50 },
    estimatedMemory: 768
  },

  [QualityMode.ULTRA]: {
    mode: QualityMode.ULTRA,
    name: 'Ultra',
    description: 'Maximum visual quality with all effects enabled',
    enabledAssets: [
      'courts',
      'buildings',
      'grass',
      'trees',
      'particles',
      'weather',
      'postProcessing',
      'shadows',
      'reflections'
    ],
    disabledAssets: [],
    settings: {
      shadowQuality: 'high',
      grassDensity: 1.0,
      particleCount: 1000,
      postProcessing: true,
      weatherEffects: true,
      lodDistance: 200
    },
    targetFPS: { min: 55, max: 60 },
    estimatedMemory: 1024
  }
};

export interface QualityChangeEvent {
  from: QualityMode;
  to: QualityMode;
  reason: 'manual' | 'auto_downgrade' | 'auto_upgrade';
  timestamp: number;
}

export class QualityPresetManager {
  private currentMode: QualityMode = QualityMode.BALANCED;
  private fpsHistory: number[] = [];
  private lastUpgradeTime: number = 0;
  private lastDowngradeTime: number = 0;
  private readonly HISTORY_SIZE = 10;
  private readonly UPGRADE_COOLDOWN = 60000; // 1 minute
  private readonly DOWNGRADE_STABILITY_TIME = 10000; // 10 seconds
  private readonly UPGRADE_STABILITY_TIME = 30000; // 30 seconds
  private readonly FPS_CHECK_INTERVAL = 5000; // 5 seconds
  private monitoringInterval: NodeJS.Timeout | null = null;
  private eventListeners: ((event: QualityChangeEvent) => void)[] = [];

  constructor() {
    this.loadSavedMode();
  }

  private loadSavedMode(): void {
    try {
      const saved = localStorage.getItem('qualityMode');
      if (saved && Object.values(QualityMode).includes(saved as QualityMode)) {
        this.currentMode = saved as QualityMode;
      }
    } catch (error) {
      console.warn('Failed to load saved quality mode:', error);
    }
  }

  private saveMode(): void {
    try {
      localStorage.setItem('qualityMode', this.currentMode);
    } catch (error) {
      console.warn('Failed to save quality mode:', error);
    }
  }

  getPreset(mode: QualityMode): QualityPreset {
    return QUALITY_PRESETS[mode];
  }

  getCurrentPreset(): QualityPreset {
    return QUALITY_PRESETS[this.currentMode];
  }

  getCurrentMode(): QualityMode {
    return this.currentMode;
  }

  async applyPreset(mode: QualityMode, reason: QualityChangeEvent['reason'] = 'manual'): Promise<void> {
    const oldMode = this.currentMode;
    if (oldMode === mode) {
      return;
    }

    const preset = QUALITY_PRESETS[mode];
    console.log(`Applying quality preset: ${preset.name}`);

    // Emit change event
    this.emitChange({
      from: oldMode,
      to: mode,
      reason,
      timestamp: Date.now()
    });

    this.currentMode = mode;
    this.saveMode();

    // Apply settings (AssetRegistry integration would happen here)
    await this.applySettings(preset);
  }

  private async applySettings(preset: QualityPreset): Promise<void> {
    // This would integrate with AssetRegistry and scene settings
    console.log('Applying quality settings:', {
      mode: preset.mode,
      enabledAssets: preset.enabledAssets,
      settings: preset.settings
    });

    // TODO: Integrate with AssetRegistry
    // AssetRegistry.enableAssets(preset.enabledAssets);
    // AssetRegistry.disableAssets(preset.disabledAssets);

    // TODO: Apply scene settings
    // scene.setShadowQuality(preset.settings.shadowQuality);
    // grass.setDensity(preset.settings.grassDensity);
    // particles.setMaxCount(preset.settings.particleCount);
    // postProcessing.setEnabled(preset.settings.postProcessing);
    // weather.setEnabled(preset.settings.weatherEffects);
    // lod.setDistance(preset.settings.lodDistance);
  }

  canUpgrade(): boolean {
    const modes = Object.values(QualityMode);
    const currentIndex = modes.indexOf(this.currentMode);
    return currentIndex < modes.length - 1;
  }

  canDowngrade(): boolean {
    const modes = Object.values(QualityMode);
    const currentIndex = modes.indexOf(this.currentMode);
    return currentIndex > 0;
  }

  async upgradeQuality(): Promise<void> {
    if (!this.canUpgrade()) {
      console.warn('Already at maximum quality');
      return;
    }

    const modes = Object.values(QualityMode);
    const currentIndex = modes.indexOf(this.currentMode);
    const newMode = modes[currentIndex + 1];

    this.lastUpgradeTime = Date.now();
    await this.applyPreset(newMode, 'auto_upgrade');
  }

  async downgradeQuality(): Promise<void> {
    if (!this.canDowngrade()) {
      console.warn('Already at minimum quality');
      return;
    }

    const modes = Object.values(QualityMode);
    const currentIndex = modes.indexOf(this.currentMode);
    const newMode = modes[currentIndex - 1];

    this.lastDowngradeTime = Date.now();
    await this.applyPreset(newMode, 'auto_downgrade');
  }

  recordFPS(fps: number): void {
    this.fpsHistory.push(fps);
    if (this.fpsHistory.length > this.HISTORY_SIZE) {
      this.fpsHistory.shift();
    }
  }

  private getAverageFPS(): number {
    if (this.fpsHistory.length === 0) return 60;
    return this.fpsHistory.reduce((sum, fps) => sum + fps, 0) / this.fpsHistory.length;
  }

  private shouldDowngrade(): boolean {
    const preset = this.getCurrentPreset();
    const avgFPS = this.getAverageFPS();
    const timeSinceLastDowngrade = Date.now() - this.lastDowngradeTime;

    // Need stable low FPS for DOWNGRADE_STABILITY_TIME
    if (timeSinceLastDowngrade < this.DOWNGRADE_STABILITY_TIME) {
      return false;
    }

    return avgFPS < preset.targetFPS.min && this.canDowngrade();
  }

  private shouldUpgrade(): boolean {
    const preset = this.getCurrentPreset();
    const avgFPS = this.getAverageFPS();
    const timeSinceLastUpgrade = Date.now() - this.lastUpgradeTime;

    // Respect upgrade cooldown
    if (timeSinceLastUpgrade < this.UPGRADE_COOLDOWN) {
      return false;
    }

    // Need stable high FPS for UPGRADE_STABILITY_TIME
    if (this.fpsHistory.length < this.HISTORY_SIZE) {
      return false;
    }

    // All recent FPS samples should be above threshold
    const threshold = preset.targetFPS.max + 10;
    const allAboveThreshold = this.fpsHistory.every(fps => fps >= threshold);

    return allAboveThreshold && this.canUpgrade();
  }

  async autoAdjust(fps: number): Promise<void> {
    this.recordFPS(fps);

    if (this.shouldDowngrade()) {
      console.log(`Auto-downgrading quality (avg FPS: ${this.getAverageFPS().toFixed(1)})`);
      await this.downgradeQuality();
      this.fpsHistory = []; // Reset history after change
    } else if (this.shouldUpgrade()) {
      console.log(`Auto-upgrading quality (avg FPS: ${this.getAverageFPS().toFixed(1)})`);
      await this.upgradeQuality();
      this.fpsHistory = []; // Reset history after change
    }
  }

  startMonitoring(getFPS: () => number): void {
    if (this.monitoringInterval) {
      this.stopMonitoring();
    }

    this.monitoringInterval = setInterval(() => {
      const fps = getFPS();
      this.autoAdjust(fps);
    }, this.FPS_CHECK_INTERVAL);

    console.log('Quality monitoring started');
  }

  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      console.log('Quality monitoring stopped');
    }
  }

  onChange(listener: (event: QualityChangeEvent) => void): () => void {
    this.eventListeners.push(listener);
    return () => {
      const index = this.eventListeners.indexOf(listener);
      if (index > -1) {
        this.eventListeners.splice(index, 1);
      }
    };
  }

  private emitChange(event: QualityChangeEvent): void {
    this.eventListeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in quality change listener:', error);
      }
    });
  }

  getAllPresets(): QualityPreset[] {
    return Object.values(QUALITY_PRESETS);
  }

  getPresetByName(name: string): QualityPreset | undefined {
    return Object.values(QUALITY_PRESETS).find(
      preset => preset.name.toLowerCase() === name.toLowerCase()
    );
  }

  getStatus(): {
    currentMode: QualityMode;
    currentPreset: QualityPreset;
    averageFPS: number;
    canUpgrade: boolean;
    canDowngrade: boolean;
    monitoring: boolean;
  } {
    return {
      currentMode: this.currentMode,
      currentPreset: this.getCurrentPreset(),
      averageFPS: this.getAverageFPS(),
      canUpgrade: this.canUpgrade(),
      canDowngrade: this.canDowngrade(),
      monitoring: this.monitoringInterval !== null
    };
  }
}

// Export singleton instance
export const qualityPresetManager = new QualityPresetManager();
