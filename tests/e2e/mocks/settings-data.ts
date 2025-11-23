/**
 * Settings Mock Data Generators
 *
 * Provides realistic mock data for user preferences, display settings,
 * and configuration tests.
 */

export interface DisplayPreferences {
  theme: 'light' | 'dark' | 'auto';
  colorScheme: 'default' | 'high-contrast' | 'colorblind';
  fontSize: 'small' | 'medium' | 'large';
  animationsEnabled: boolean;
  reducedMotion: boolean;
  contrast: number; // 0-100
}

export interface PerformanceSettings {
  quality: 'low' | 'medium' | 'high' | 'ultra';
  particleCount: number;
  shadowQuality: 'off' | 'low' | 'medium' | 'high';
  antialiasing: boolean;
  vSync: boolean;
  fpsLimit: number;
}

export interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  desktop: boolean;
  email: boolean;
  categories: {
    system: boolean;
    alerts: boolean;
    updates: boolean;
    maintenance: boolean;
  };
  frequency: 'immediate' | 'hourly' | 'daily';
}

export interface PrivacySettings {
  analyticsEnabled: boolean;
  crashReportsEnabled: boolean;
  usageDataEnabled: boolean;
  locationTracking: boolean;
  cookiesEnabled: boolean;
}

export interface Settings {
  display: DisplayPreferences;
  performance: PerformanceSettings;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  lastModified: number;
  version: string;
}

/**
 * Generate default settings
 */
export function generateDefaultSettings(): Settings {
  return {
    display: {
      theme: 'dark',
      colorScheme: 'default',
      fontSize: 'medium',
      animationsEnabled: true,
      reducedMotion: false,
      contrast: 50
    },
    performance: {
      quality: 'high',
      particleCount: 1000,
      shadowQuality: 'medium',
      antialiasing: true,
      vSync: true,
      fpsLimit: 60
    },
    notifications: {
      enabled: true,
      sound: true,
      desktop: true,
      email: false,
      categories: {
        system: true,
        alerts: true,
        updates: true,
        maintenance: false
      },
      frequency: 'immediate'
    },
    privacy: {
      analyticsEnabled: true,
      crashReportsEnabled: true,
      usageDataEnabled: true,
      locationTracking: false,
      cookiesEnabled: true
    },
    lastModified: Date.now(),
    version: '1.0.0'
  };
}

/**
 * Generate high performance settings preset
 */
export function generateHighPerformanceSettings(): Settings {
  const settings = generateDefaultSettings();
  return {
    ...settings,
    display: {
      ...settings.display,
      animationsEnabled: false,
      reducedMotion: true
    },
    performance: {
      quality: 'low',
      particleCount: 100,
      shadowQuality: 'off',
      antialiasing: false,
      vSync: false,
      fpsLimit: 120
    }
  };
}

/**
 * Generate accessibility-focused settings
 */
export function generateAccessibilitySettings(): Settings {
  const settings = generateDefaultSettings();
  return {
    ...settings,
    display: {
      theme: 'dark',
      colorScheme: 'high-contrast',
      fontSize: 'large',
      animationsEnabled: false,
      reducedMotion: true,
      contrast: 100
    }
  };
}

/**
 * Mock localStorage for settings persistence
 */
export function mockSettingsLocalStorage(customSettings?: Partial<Settings>) {
  const settings = customSettings
    ? { ...generateDefaultSettings(), ...customSettings }
    : generateDefaultSettings();

  return {
    'app-settings': JSON.stringify(settings),
    'settings-version': '1.0.0',
    'settings-last-sync': Date.now().toString()
  };
}

/**
 * Validate settings structure
 */
export function validateSettings(settings: any): boolean {
  const requiredFields = ['display', 'performance', 'notifications', 'privacy'];
  return requiredFields.every(field => field in settings);
}

/**
 * Generate settings change event
 */
export function generateSettingsChangeEvent(
  category: keyof Settings,
  key: string,
  oldValue: any,
  newValue: any
) {
  return {
    type: 'settings-change',
    category,
    key,
    oldValue,
    newValue,
    timestamp: Date.now(),
    userId: 'test-user'
  };
}

/**
 * Setup settings API mock routes
 */
export function setupSettingsMockAPI(page: any) {
  let currentSettings: Settings = generateDefaultSettings();

  return page.route('**/api/settings/**', (route: any) => {
    const url = route.request().url();
    const method = route.request().method();

    if (url.includes('/get') && method === 'GET') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(currentSettings)
      });
    } else if (url.includes('/update') && method === 'POST') {
      const updates = route.request().postDataJSON();
      currentSettings = {
        ...currentSettings,
        ...updates,
        lastModified: Date.now()
      };
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(currentSettings)
      });
    } else if (url.includes('/reset') && method === 'POST') {
      currentSettings = generateDefaultSettings();
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(currentSettings)
      });
    } else if (url.includes('/presets')) {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          default: generateDefaultSettings(),
          highPerformance: generateHighPerformanceSettings(),
          accessibility: generateAccessibilitySettings()
        })
      });
    } else {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(currentSettings)
      });
    }
  });
}

/**
 * Generate test scenarios for settings
 */
export const settingsTestScenarios = {
  performanceMode: {
    description: 'Switch to high performance mode',
    initial: generateDefaultSettings(),
    changes: { performance: { quality: 'low', particleCount: 100 } },
    expected: generateHighPerformanceSettings()
  },
  darkMode: {
    description: 'Toggle dark mode',
    initial: { ...generateDefaultSettings(), display: { ...generateDefaultSettings().display, theme: 'light' } },
    changes: { display: { theme: 'dark' } },
    expected: generateDefaultSettings()
  },
  notifications: {
    description: 'Disable all notifications',
    initial: generateDefaultSettings(),
    changes: { notifications: { enabled: false } },
    expected: { ...generateDefaultSettings(), notifications: { ...generateDefaultSettings().notifications, enabled: false } }
  }
};
