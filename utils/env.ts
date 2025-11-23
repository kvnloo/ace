/**
 * Environment Variable Validation Module
 *
 * Provides type-safe access to environment variables with:
 * - Compile-time type checking
 * - Runtime validation
 * - Clear, developer-friendly error messages
 * - Support for optional and required variables
 *
 * Usage:
 *   import { env } from './utils/env';
 *   const apiKey = env.GEMINI_API_KEY;
 */

/**
 * Type definition for all environment variables
 * This ensures all env vars are explicitly defined and typed
 */
interface EnvironmentVariables {
  // API Configuration
  GEMINI_API_KEY?: string;
  VITE_BASE_PATH?: string;

  // Application Configuration
  NODE_ENV: 'development' | 'production' | 'test';

  // Feature Flags (optional)
  VITE_DEBUG_MODE?: string;
  VITE_ANALYTICS_ENABLED?: string;
}

/**
 * Parsed and validated environment variables
 * Provides typed access with fallback defaults
 */
class EnvironmentValidator {
  private variables: EnvironmentVariables;
  private errors: string[] = [];
  private warnings: string[] = [];

  constructor() {
    this.variables = this.parseEnvironment();
  }

  /**
   * Parse environment variables from process.env
   */
  private parseEnvironment(): EnvironmentVariables {
    return {
      GEMINI_API_KEY: process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY,
      VITE_BASE_PATH: process.env.VITE_BASE_PATH || '/',
      NODE_ENV: (process.env.NODE_ENV as EnvironmentVariables['NODE_ENV']) || 'development',
      VITE_DEBUG_MODE: process.env.VITE_DEBUG_MODE,
      VITE_ANALYTICS_ENABLED: process.env.VITE_ANALYTICS_ENABLED,
    };
  }

  /**
   * Validate required environment variables
   * Called at application startup
   */
  validate(): void {
    this.errors = [];
    this.warnings = [];

    // Warn if GEMINI_API_KEY is missing in production
    if (!this.variables.GEMINI_API_KEY) {
      if (this.variables.NODE_ENV === 'production') {
        this.errors.push(
          'GEMINI_API_KEY is required in production. ' +
            'Set VITE_GEMINI_API_KEY in your environment or .env.local file.'
        );
      } else {
        this.warnings.push(
          'GEMINI_API_KEY is not set. AI chat features will not work. ' +
            'Set VITE_GEMINI_API_KEY in .env.local to enable.'
        );
      }
    }

    // Check NODE_ENV is valid
    const validEnvs = ['development', 'production', 'test'];
    if (!validEnvs.includes(this.variables.NODE_ENV)) {
      this.errors.push(
        `Invalid NODE_ENV: ${this.variables.NODE_ENV}. ` +
          `Must be one of: ${validEnvs.join(', ')}`
      );
    }

    // Print validation results
    this.printResults();

    // Fail fast if there are critical errors
    if (this.errors.length > 0) {
      const errorMessage =
        'Environment validation failed:\n' +
        this.errors.map((e) => `  ✗ ${e}`).join('\n') +
        '\n\nPlease fix the above issues and restart the application.';

      throw new Error(errorMessage);
    }
  }

  /**
   * Print validation results to console
   */
  private printResults(): void {
    const isDev = typeof window === 'undefined' ? process.env.NODE_ENV === 'development' : false;

    if (this.errors.length > 0) {
      console.error(
        '%c[ENV] Validation Errors',
        'color: #ef4444; font-weight: bold; font-size: 12px;'
      );
      this.errors.forEach((error) => {
        console.error(`%c✗ ${error}`, 'color: #ef4444;');
      });
    }

    if (this.warnings.length > 0 && isDev) {
      console.warn(
        '%c[ENV] Validation Warnings',
        'color: #f59e0b; font-weight: bold; font-size: 12px;'
      );
      this.warnings.forEach((warning) => {
        console.warn(`%c⚠ ${warning}`, 'color: #f59e0b;');
      });
    }

    if (this.errors.length === 0 && isDev) {
      console.log(
        '%c✓ Environment variables validated successfully',
        'color: #10b981; font-weight: bold; font-size: 12px;'
      );
    }
  }

  /**
   * Get a specific environment variable with type safety
   */
  get<K extends keyof EnvironmentVariables>(key: K): EnvironmentVariables[K] {
    return this.variables[key];
  }

  /**
   * Get all environment variables (excluding sensitive ones in logs)
   */
  getAll(): Partial<EnvironmentVariables> {
    const safe = { ...this.variables };
    // Don't log API keys
    if (safe.GEMINI_API_KEY) {
      safe.GEMINI_API_KEY = '***hidden***' as any;
    }
    return safe;
  }

  /**
   * Check if a variable is set
   */
  has(key: keyof EnvironmentVariables): boolean {
    return this.variables[key] !== undefined;
  }

  /**
   * Getter for GEMINI_API_KEY
   */
  get GEMINI_API_KEY(): string | undefined {
    return this.variables.GEMINI_API_KEY;
  }

  /**
   * Getter for VITE_BASE_PATH with fallback to '/'
   */
  get VITE_BASE_PATH(): string {
    return this.variables.VITE_BASE_PATH || '/';
  }

  /**
   * Getter for NODE_ENV
   */
  get NODE_ENV(): 'development' | 'production' | 'test' {
    return this.variables.NODE_ENV;
  }

  /**
   * Getter for debug mode flag
   */
  get DEBUG_MODE(): boolean {
    const value = this.variables.VITE_DEBUG_MODE;
    return value === 'true' || value === '1';
  }

  /**
   * Getter for analytics enabled flag
   */
  get ANALYTICS_ENABLED(): boolean {
    const value = this.variables.VITE_ANALYTICS_ENABLED;
    // Default to true in production, false in development
    if (value === undefined) {
      return this.NODE_ENV === 'production';
    }
    return value === 'true' || value === '1';
  }

  /**
   * Check if we're in development mode
   */
  isDevelopment(): boolean {
    return this.NODE_ENV === 'development';
  }

  /**
   * Check if we're in production mode
   */
  isProduction(): boolean {
    return this.NODE_ENV === 'production';
  }
}

/**
 * Singleton instance of environment validator
 * Ensures validation runs only once at application startup
 */
let instance: EnvironmentValidator | null = null;

/**
 * Initialize and return the environment validator
 * This should be called once at application startup before any code that uses env variables
 */
export function initializeEnvironment(): EnvironmentValidator {
  if (instance === null) {
    instance = new EnvironmentValidator();
    instance.validate();
  }
  return instance;
}

/**
 * Get the environment validator instance
 * Must call initializeEnvironment() first
 */
export function getEnvironment(): EnvironmentValidator {
  if (instance === null) {
    throw new Error(
      'Environment not initialized. Call initializeEnvironment() before accessing env variables.'
    );
  }
  return instance;
}

/**
 * Convenience export for the environment instance
 * Use this for type-safe access to environment variables
 *
 * Example:
 *   import { env } from './utils/env';
 *   const apiKey = env.GEMINI_API_KEY;
 */
export const env: EnvironmentValidator = new Proxy(new EnvironmentValidator(), {
  get(target, prop: string | symbol) {
    if (instance === null) {
      instance = initializeEnvironment();
    }
    return Reflect.get(instance || target, prop);
  },
});

/**
 * Export for backwards compatibility and direct validation calls
 */
export default {
  initializeEnvironment,
  getEnvironment,
  env,
};
