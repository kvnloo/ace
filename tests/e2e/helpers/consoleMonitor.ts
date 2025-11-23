import { Page } from '@playwright/test';

/**
 * Console Monitor Helper - Enhanced Version
 *
 * Comprehensive browser console monitoring for errors, warnings, and issues.
 * Detects console errors, unhandled promise rejections, network failures, WebGL issues,
 * and more. Provides detailed categorization and reporting for test validation.
 */

export interface ErrorCategory {
  type: 'asset' | 'component' | 'threejs' | 'webgl' | 'network' | 'script' | 'promise' | 'runtime' | 'memory' | '3d-render' | 'other';
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  url?: string;
  stack?: string;
  timestamp: number;
  context?: Record<string, any>;
}

export class ConsoleMonitor {
  private errors: string[] = [];
  private warnings: string[] = [];
  private logs: Array<{ type: string; text: string; timestamp: number; location?: string }> = [];
  private categorizedErrors: ErrorCategory[] = [];
  private networkErrors: Array<{ url: string; status: number; statusText: string; timestamp: number }> = [];
  private unhandledPromiseRejections: Array<{ reason: string; promise?: any; timestamp: number }> = [];
  private performanceIssues: Array<{ type: string; message: string; timestamp: number }> = [];
  private webGLWarnings: string[] = [];
  private memoryWarnings: string[] = [];
  private isMonitoring: boolean = false;

  constructor(private page: Page) {
    this.isMonitoring = true;
    this.setupMonitoring();
  }

  private setupMonitoring(): void {
    // Capture console messages with enhanced detail
    this.page.on('console', (msg) => {
      const type = msg.type();
      const text = msg.text();
      const timestamp = Date.now();
      const location = msg.location();
      const url = location?.url;
      const lineNumber = location?.lineNumber;
      const columnNumber = location?.columnNumber;

      // Record all console messages for debugging with location info
      this.logs.push({
        type,
        text,
        timestamp,
        location: url ? `${url}:${lineNumber}:${columnNumber}` : undefined
      });

      if (type === 'error') {
        // Filter out known noise
        if (!this.isKnownNoise(text)) {
          this.errors.push(text);

          // Categorize the error with context
          const category = this.categorizeError(text, url, undefined, {
            lineNumber,
            columnNumber
          });
          this.categorizedErrors.push(category);
        }
      } else if (type === 'warning') {
        if (!this.isKnownNoise(text)) {
          this.warnings.push(text);

          // Check for specific warning types
          if (text.toLowerCase().includes('webgl')) {
            this.webGLWarnings.push(text);
          }
          if (text.toLowerCase().includes('memory') || text.toLowerCase().includes('leak')) {
            this.memoryWarnings.push(text);
          }
        }
      }
    });

    // Capture page errors (unhandled exceptions)
    this.page.on('pageerror', (error) => {
      const errorText = `Unhandled exception: ${error.message}`;
      if (!this.isKnownNoise(errorText)) {
        this.errors.push(errorText);

        // Categorize page error as runtime error
        const category = this.categorizeError(errorText, undefined, error.stack);
        this.categorizedErrors.push(category);
      }
      this.logs.push({ type: 'pageerror', text: errorText, timestamp: Date.now() });
    });

    // Capture unhandled promise rejections
    this.page.evaluateOnNewDocument(() => {
      window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
      });
    });

    // Capture network errors with enhanced detail
    this.page.on('response', (response) => {
      const timestamp = Date.now();
      const url = response.url();
      const status = response.status();

      if (!response.ok()) {
        this.networkErrors.push({
          url,
          status,
          statusText: response.statusText(),
          timestamp
        });

        // Categorize critical resource failures
        if (url.match(/\.(js|css|wasm|glb|gltf|bin|png|jpg|jpeg|webp)$/i)) {
          const isScript = url.match(/\.(js|wasm)$/i);
          const is3DAsset = url.match(/\.(glb|gltf|bin)$/i);
          const errorText = `Failed to load ${url}: ${status} ${response.statusText()}`;

          this.errors.push(errorText);
          this.categorizedErrors.push({
            type: is3DAsset ? '3d-render' : 'asset',
            severity: isScript || is3DAsset ? 'critical' : 'high',
            message: errorText,
            url,
            timestamp,
            context: { status, statusText: response.statusText() }
          });
        }
      }
    });

    // Monitor for request failures
    this.page.on('requestfailed', (request) => {
      const url = request.url();
      const failure = request.failure();
      if (failure && !this.isKnownNoise(failure.errorText)) {
        const errorText = `Request failed: ${url} - ${failure.errorText}`;
        this.errors.push(errorText);
        this.categorizedErrors.push({
          type: 'network',
          severity: url.match(/\.(js|css|wasm)$/i) ? 'critical' : 'high',
          message: errorText,
          url,
          timestamp: Date.now(),
          context: { failureReason: failure.errorText }
        });
      }
    });

    // Inject performance monitoring
    this.page.evaluateOnNewDocument(() => {
      // Monitor for long tasks and jank
      if ('PerformanceObserver' in window) {
        try {
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.duration > 50) {  // Long task threshold
                console.warn(`Long task detected: ${entry.duration}ms`, entry.name);
              }
            }
          });
          observer.observe({ entryTypes: ['longtask'] });
        } catch (e) {
          // Some browsers don't support longtask
        }
      }

      // Monitor memory if available
      if ('performance' in window && 'memory' in (performance as any)) {
        const checkMemory = () => {
          const memory = (performance as any).memory;
          const usedHeap = memory.usedJSHeapSize;
          const totalHeap = memory.totalJSHeapSize;
          const limit = memory.jsHeapSizeLimit;

          const usage = (usedHeap / limit) * 100;
          if (usage > 80) {
            console.warn(`High memory usage: ${usage.toFixed(1)}% of heap limit`);
          }
        };
        // Check memory periodically
        setInterval(checkMemory, 5000);
      }
    });
  }

  /**
   * Categorize an error for better reporting with enhanced detection
   */
  private categorizeError(text: string, url?: string, stack?: string, context?: Record<string, any>): ErrorCategory {
    const message = text.toLowerCase();

    // Unhandled promise rejections
    if (message.includes('unhandled promise rejection') ||
        message.includes('unhandledrejection')) {
      return {
        type: 'promise',
        severity: 'critical',
        message: text,
        url,
        stack,
        timestamp: Date.now(),
        context
      };
    }

    // 3D rendering and WebGL errors
    if (message.includes('3d') ||
        message.includes('court') ||
        message.includes('scene') ||
        message.includes('renderer') ||
        message.includes('canvas')) {
      return {
        type: '3d-render',
        severity: 'critical',
        message: text,
        url,
        stack,
        timestamp: Date.now(),
        context
      };
    }

    // Asset loading errors
    if (message.includes('failed to load') ||
        message.includes('404') ||
        message.includes('failed to fetch') ||
        message.includes('net::err') ||
        message.includes('cors')) {
      const isModel = message.includes('.glb') || message.includes('.gltf') || message.includes('.bin');
      return {
        type: isModel ? '3d-render' : 'asset',
        severity: message.includes('.js') || message.includes('.wasm') || isModel ? 'critical' : 'high',
        message: text,
        url,
        stack,
        timestamp: Date.now(),
        context
      };
    }

    // Component/React errors
    if (message.includes('react') ||
        message.includes('component') ||
        message.includes('hook') ||
        message.includes('render') ||
        message.includes('hydration')) {
      return {
        type: 'component',
        severity: message.includes('unhandled') || message.includes('hydration') ? 'critical' : 'high',
        message: text,
        url,
        stack,
        timestamp: Date.now(),
        context
      };
    }

    // Three.js errors
    if (message.includes('three') ||
        message.includes('webglrenderer') ||
        message.includes('shader') ||
        message.includes('geometry') ||
        message.includes('material')) {
      return {
        type: 'threejs',
        severity: 'high',
        message: text,
        url,
        stack,
        timestamp: Date.now(),
        context
      };
    }

    // WebGL errors
    if (message.includes('webgl') ||
        message.includes('gl.') ||
        message.includes('context lost') ||
        message.includes('shader compilation')) {
      return {
        type: 'webgl',
        severity: 'critical',
        message: text,
        url,
        stack,
        timestamp: Date.now(),
        context
      };
    }

    // Memory errors
    if (message.includes('memory') ||
        message.includes('heap') ||
        message.includes('leak') ||
        message.includes('out of memory')) {
      return {
        type: 'memory',
        severity: 'critical',
        message: text,
        url,
        stack,
        timestamp: Date.now(),
        context
      };
    }

    // Runtime errors
    if (message.includes('unhandled exception') ||
        message.includes('uncaught') ||
        message.includes('runtime error')) {
      return {
        type: 'runtime',
        severity: 'critical',
        message: text,
        url,
        stack,
        timestamp: Date.now(),
        context
      };
    }

    // Network errors
    if (message.includes('network') ||
        message.includes('fetch failed') ||
        message.includes('timeout')) {
      return {
        type: 'network',
        severity: message.includes('timeout') ? 'high' : 'medium',
        message: text,
        url,
        stack,
        timestamp: Date.now(),
        context
      };
    }

    // Script errors
    if (message.includes('script error') ||
        message.includes('syntaxerror') ||
        message.includes('referenceerror') ||
        message.includes('typeerror')) {
      return {
        type: 'script',
        severity: 'critical',
        message: text,
        url,
        stack,
        timestamp: Date.now(),
        context
      };
    }

    // Default categorization
    return {
      type: 'other',
      severity: message.includes('unhandled') || message.includes('exception') || message.includes('fatal') ? 'high' : 'medium',
      message: text,
      url,
      stack,
      timestamp: Date.now(),
      context
    };
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
   * Get categorized errors for analysis
   */
  getCategorizedErrors(): ErrorCategory[] {
    return [...this.categorizedErrors];
  }

  /**
   * Get network errors
   */
  getNetworkErrors(): Array<{ url: string; status: number; statusText: string; timestamp: number }> {
    return [...this.networkErrors];
  }

  /**
   * Get unhandled promise rejections
   */
  getUnhandledPromiseRejections(): Array<{ reason: string; promise?: any; timestamp: number }> {
    return [...this.unhandledPromiseRejections];
  }

  /**
   * Get WebGL warnings
   */
  getWebGLWarnings(): string[] {
    return [...this.webGLWarnings];
  }

  /**
   * Get memory warnings
   */
  getMemoryWarnings(): string[] {
    return [...this.memoryWarnings];
  }

  /**
   * Check for 3D rendering errors
   */
  has3DRenderErrors(): boolean {
    return this.categorizedErrors.some(err => err.type === '3d-render');
  }

  /**
   * Assert no 3D rendering errors
   */
  assertNo3DRenderErrors(): void {
    const renderErrors = this.getErrorsByCategory('3d-render');
    if (renderErrors.length > 0) {
      const report = renderErrors.map((err, idx) =>
        `  ${idx + 1}. [${err.severity.toUpperCase()}] ${err.message}${err.url ? ` (${err.url})` : ''}`
      ).join('\n');
      throw new Error(`3D rendering errors found:\n${report}`);
    }
  }

  /**
   * Check for promise errors
   */
  hasPromiseErrors(): boolean {
    return this.categorizedErrors.some(err => err.type === 'promise');
  }

  /**
   * Assert no unhandled promise rejections
   */
  assertNoPromiseRejections(): void {
    const promiseErrors = this.getErrorsByCategory('promise');
    if (promiseErrors.length > 0) {
      const report = promiseErrors.map((err, idx) =>
        `  ${idx + 1}. ${err.message}`
      ).join('\n');
      throw new Error(`Unhandled promise rejections found:\n${report}`);
    }
  }

  /**
   * Assert no memory errors
   */
  assertNoMemoryErrors(): void {
    const memoryErrors = this.getErrorsByCategory('memory');
    if (memoryErrors.length > 0) {
      const report = memoryErrors.map((err, idx) =>
        `  ${idx + 1}. ${err.message}`
      ).join('\n');
      throw new Error(`Memory errors found:\n${report}`);
    }
  }

  /**
   * Assert no runtime errors
   */
  assertNoRuntimeErrors(): void {
    const runtimeErrors = this.getErrorsByCategory('runtime');
    if (runtimeErrors.length > 0) {
      const report = runtimeErrors.map((err, idx) =>
        `  ${idx + 1}. ${err.message}${err.stack ? '\n     Stack: ' + err.stack.substring(0, 200) : ''}`
      ).join('\n');
      throw new Error(`Runtime errors found:\n${report}`);
    }
  }

  /**
   * Get errors by category
   */
  getErrorsByCategory(category: ErrorCategory['type']): ErrorCategory[] {
    return this.categorizedErrors.filter(err => err.type === category);
  }

  /**
   * Get errors by severity
   */
  getErrorsBySeverity(severity: ErrorCategory['severity']): ErrorCategory[] {
    return this.categorizedErrors.filter(err => err.severity === severity);
  }

  /**
   * Check for specific error categories
   */
  hasAssetErrors(): boolean {
    return this.categorizedErrors.some(err => err.type === 'asset');
  }

  hasComponentErrors(): boolean {
    return this.categorizedErrors.some(err => err.type === 'component');
  }

  hasThreeJSErrors(): boolean {
    return this.categorizedErrors.some(err => err.type === 'threejs');
  }

  hasWebGLErrors(): boolean {
    return this.categorizedErrors.some(err => err.type === 'webgl');
  }

  hasCriticalErrors(): boolean {
    return this.categorizedErrors.some(err => err.severity === 'critical');
  }

  /**
   * Assert no errors by category
   */
  assertNoAssetErrors(): void {
    const assetErrors = this.getErrorsByCategory('asset');
    if (assetErrors.length > 0) {
      const report = assetErrors.map((err, idx) =>
        `  ${idx + 1}. [${err.severity.toUpperCase()}] ${err.message}`
      ).join('\n');
      throw new Error(`Asset loading errors found:\n${report}`);
    }
  }

  assertNoComponentErrors(): void {
    const componentErrors = this.getErrorsByCategory('component');
    if (componentErrors.length > 0) {
      const report = componentErrors.map((err, idx) =>
        `  ${idx + 1}. [${err.severity.toUpperCase()}] ${err.message}`
      ).join('\n');
      throw new Error(`Component errors found:\n${report}`);
    }
  }

  assertNoThreeJSErrors(): void {
    const threejsErrors = this.getErrorsByCategory('threejs');
    if (threejsErrors.length > 0) {
      const report = threejsErrors.map((err, idx) =>
        `  ${idx + 1}. [${err.severity.toUpperCase()}] ${err.message}`
      ).join('\n');
      throw new Error(`Three.js errors found:\n${report}`);
    }
  }

  assertNoWebGLErrors(): void {
    const webglErrors = this.getErrorsByCategory('webgl');
    if (webglErrors.length > 0) {
      const report = webglErrors.map((err, idx) =>
        `  ${idx + 1}. [${err.severity.toUpperCase()}] ${err.message}`
      ).join('\n');
      throw new Error(`WebGL errors found:\n${report}`);
    }
  }

  assertNoCriticalErrors(): void {
    const criticalErrors = this.getErrorsBySeverity('critical');
    if (criticalErrors.length > 0) {
      const report = criticalErrors.map((err, idx) =>
        `  ${idx + 1}. [${err.type.toUpperCase()}] ${err.message}`
      ).join('\n');
      throw new Error(`Critical errors found:\n${report}`);
    }
  }

  /**
   * Print summary for debugging
   */
  printSummary(): void {
    console.log('\n=== Console Monitor Summary ===');
    console.log(`Errors: ${this.errors.length}`);
    console.log(`Warnings: ${this.warnings.length}`);
    console.log(`Total logs: ${this.logs.length}`);
    console.log(`Network Errors: ${this.networkErrors.length}`);

    if (this.categorizedErrors.length > 0) {
      console.log('\nCategorized Errors:');
      const byCategory: Record<string, number> = {};
      const bySeverity: Record<string, number> = {};

      this.categorizedErrors.forEach(err => {
        byCategory[err.type] = (byCategory[err.type] || 0) + 1;
        bySeverity[err.severity] = (bySeverity[err.severity] || 0) + 1;
      });

      console.log('  By Category:', byCategory);
      console.log('  By Severity:', bySeverity);
    }

    if (this.errors.length > 0) {
      console.log('\nErrors:');
      this.errors.forEach((err, idx) => console.log(`  ${idx + 1}. ${err}`));
    }

    if (this.warnings.length > 0) {
      console.log('\nWarnings:');
      this.warnings.forEach((warn, idx) => console.log(`  ${idx + 1}. ${warn}`));
    }

    if (this.networkErrors.length > 0) {
      console.log('\nNetwork Errors:');
      this.networkErrors.forEach((err, idx) =>
        console.log(`  ${idx + 1}. ${err.status} ${err.statusText} - ${err.url}`)
      );
    }

    console.log('==============================\n');
  }

  /**
   * Get detailed error report for debugging
   */
  getDetailedReport(): string {
    const lines: string[] = [
      '=== Console Monitor Detailed Report ===',
      `Total Errors: ${this.errors.length}`,
      `Total Warnings: ${this.warnings.length}`,
      `Network Errors: ${this.networkErrors.length}`,
      ''
    ];

    if (this.categorizedErrors.length > 0) {
      lines.push('Categorized Errors:');
      this.categorizedErrors.forEach((err, idx) => {
        lines.push(`  ${idx + 1}. [${err.type.toUpperCase()}] [${err.severity.toUpperCase()}]`);
        lines.push(`     Message: ${err.message}`);
        if (err.url) lines.push(`     URL: ${err.url}`);
        if (err.stack) lines.push(`     Stack: ${err.stack.substring(0, 100)}...`);
        lines.push('');
      });
    }

    if (this.networkErrors.length > 0) {
      lines.push('Network Errors:');
      this.networkErrors.forEach((err, idx) => {
        lines.push(`  ${idx + 1}. ${err.status} ${err.statusText}`);
        lines.push(`     URL: ${err.url}`);
      });
    }

    lines.push('======================================');
    return lines.join('\n');
  }
}

/**
 * Convenience function to create and attach console monitor
 */
export function createConsoleMonitor(page: Page): ConsoleMonitor {
  return new ConsoleMonitor(page);
}
