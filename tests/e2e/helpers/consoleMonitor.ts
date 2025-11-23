import { Page } from '@playwright/test';

/**
 * Console Monitor Helper
 *
 * Monitors browser console for errors and warnings during test execution.
 * Filters out known noise and provides assertion methods for test validation.
 */
export class ConsoleMonitor {
  private errors: string[] = [];
  private warnings: string[] = [];
  private logs: Array<{ type: string; text: string; timestamp: number }> = [];

  constructor(private page: Page) {
    page.on('console', (msg) => {
      const type = msg.type();
      const text = msg.text();
      const timestamp = Date.now();

      // Record all console messages for debugging
      this.logs.push({ type, text, timestamp });

      if (type === 'error') {
        // Filter out known noise
        if (!this.isKnownNoise(text)) {
          this.errors.push(text);
        }
      } else if (type === 'warning') {
        if (!this.isKnownNoise(text)) {
          this.warnings.push(text);
        }
      }
    });

    // Also capture page errors (unhandled exceptions)
    page.on('pageerror', (error) => {
      const errorText = `Unhandled exception: ${error.message}`;
      if (!this.isKnownNoise(errorText)) {
        this.errors.push(errorText);
      }
      this.logs.push({ type: 'pageerror', text: errorText, timestamp: Date.now() });
    });
  }

  /**
   * Filter out known noise patterns that are acceptable
   */
  private isKnownNoise(text: string): boolean {
    const noisePatterns = [
      // React DevTools
      /Download the React DevTools/,
      /react-refresh/,
      /react devtools/i,

      // Browser extensions
      /Extension/,
      /chrome-extension/,

      // Known development warnings
      /webpack/i,
      /hmr/i,

      // Vite specific
      /vite/i,

      // Three.js development warnings (not errors)
      /THREE\.WebGLProgram/,

      // Known acceptable warnings
      /ResizeObserver loop/,
    ];

    return noisePatterns.some(pattern => pattern.test(text));
  }

  /**
   * Get all captured errors
   */
  getErrors(): string[] {
    return [...this.errors];
  }

  /**
   * Get all captured warnings
   */
  getWarnings(): string[] {
    return [...this.warnings];
  }

  /**
   * Get all console logs for debugging
   */
  getAllLogs(): Array<{ type: string; text: string; timestamp: number }> {
    return [...this.logs];
  }

  /**
   * Assert that no console errors occurred during test
   * @throws Error if console errors were found
   */
  assertNoErrors(): void {
    if (this.errors.length > 0) {
      const errorReport = this.errors.map((err, idx) => `  ${idx + 1}. ${err}`).join('\n');
      throw new Error(`Console errors found:\n${errorReport}`);
    }
  }

  /**
   * Assert that no warnings occurred during test
   * @throws Error if console warnings were found
   */
  assertNoWarnings(): void {
    if (this.warnings.length > 0) {
      const warningReport = this.warnings.map((warn, idx) => `  ${idx + 1}. ${warn}`).join('\n');
      throw new Error(`Console warnings found:\n${warningReport}`);
    }
  }

  /**
   * Assert maximum number of errors allowed
   */
  assertMaxErrors(maxCount: number): void {
    if (this.errors.length > maxCount) {
      throw new Error(`Too many console errors: ${this.errors.length} (max: ${maxCount})`);
    }
  }

  /**
   * Clear all captured messages (useful for multi-step tests)
   */
  clear(): void {
    this.errors = [];
    this.warnings = [];
    this.logs = [];
  }

  /**
   * Get error count
   */
  getErrorCount(): number {
    return this.errors.length;
  }

  /**
   * Get warning count
   */
  getWarningCount(): number {
    return this.warnings.length;
  }

  /**
   * Check if specific error message exists
   */
  hasError(pattern: string | RegExp): boolean {
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    return this.errors.some(err => regex.test(err));
  }

  /**
   * Print summary for debugging
   */
  printSummary(): void {
    console.log('\n=== Console Monitor Summary ===');
    console.log(`Errors: ${this.errors.length}`);
    console.log(`Warnings: ${this.warnings.length}`);
    console.log(`Total logs: ${this.logs.length}`);

    if (this.errors.length > 0) {
      console.log('\nErrors:');
      this.errors.forEach((err, idx) => console.log(`  ${idx + 1}. ${err}`));
    }

    if (this.warnings.length > 0) {
      console.log('\nWarnings:');
      this.warnings.forEach((warn, idx) => console.log(`  ${idx + 1}. ${warn}`));
    }
    console.log('==============================\n');
  }
}

/**
 * Convenience function to create and attach console monitor
 */
export function createConsoleMonitor(page: Page): ConsoleMonitor {
  return new ConsoleMonitor(page);
}
