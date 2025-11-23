/**
 * Console Monitor Utility
 *
 * Comprehensive error tracking and performance monitoring for 3D rendering
 */

export interface ConsoleError {
  type: 'error' | 'warning' | 'critical';
  message: string;
  stack?: string;
  timestamp: number;
  source?: string;
  category?: 'webgl' | 'asset' | 'component' | 'network' | 'other';
}

export interface PerformanceMetrics {
  fps: number;
  memory: number;
  loadTime: number;
  renderTime: number;
  timestamp: number;
}

class ConsoleMonitor {
  private errors: ConsoleError[] = [];
  private metrics: PerformanceMetrics[] = [];
  private originalConsoleError: typeof console.error;
  private originalConsoleWarn: typeof console.warn;
  private isMonitoring: boolean = false;
  private fpsInterval: NodeJS.Timeout | null = null;
  private lastFrameTime: number = 0;
  private frameCount: number = 0;

  constructor() {
    this.originalConsoleError = console.error;
    this.originalConsoleWarn = console.warn;
  }

  /**
   * Start monitoring console and performance
   */
  start(): void {
    if (this.isMonitoring) return;

    console.log('🔍 Console Monitor: Starting error and performance tracking');
    this.isMonitoring = true;

    // Override console.error
    console.error = (...args: any[]) => {
      this.captureError('error', args);
      this.originalConsoleError.apply(console, args);
    };

    // Override console.warn
    console.warn = (...args: any[]) => {
      this.captureError('warning', args);
      this.originalConsoleWarn.apply(console, args);
    };

    // Monitor WebGL errors
    this.monitorWebGL();

    // Start FPS monitoring
    this.startFPSMonitoring();

    // Monitor memory usage
    this.monitorMemory();
  }

  /**
   * Stop monitoring
   */
  stop(): void {
    if (!this.isMonitoring) return;

    console.log('🔍 Console Monitor: Stopping');
    this.isMonitoring = false;

    // Restore original console methods
    console.error = this.originalConsoleError;
    console.warn = this.originalConsoleWarn;

    // Stop FPS monitoring
    if (this.fpsInterval) {
      clearInterval(this.fpsInterval);
      this.fpsInterval = null;
    }
  }

  /**
   * Capture and categorize errors
   */
  private captureError(type: 'error' | 'warning', args: any[]): void {
    const message = args.map(arg =>
      typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
    ).join(' ');

    const error: ConsoleError = {
      type: type === 'error' ? 'error' : 'warning',
      message,
      timestamp: Date.now(),
      category: this.categorizeError(message)
    };

    // Extract stack trace if available
    if (args[0] instanceof Error) {
      error.stack = args[0].stack;
      error.source = args[0].name;
    }

    // Check for critical errors
    if (this.isCriticalError(message)) {
      error.type = 'critical';
      console.log('🚨 CRITICAL ERROR DETECTED:', message);
    }

    this.errors.push(error);

    // Trigger alert for critical errors
    if (error.type === 'critical') {
      this.handleCriticalError(error);
    }
  }

  /**
   * Categorize error based on content
   */
  private categorizeError(message: string): ConsoleError['category'] {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('webgl') || lowerMessage.includes('three') ||
        lowerMessage.includes('shader') || lowerMessage.includes('renderer')) {
      return 'webgl';
    }

    if (lowerMessage.includes('asset') || lowerMessage.includes('load') ||
        lowerMessage.includes('texture') || lowerMessage.includes('model')) {
      return 'asset';
    }

    if (lowerMessage.includes('component') || lowerMessage.includes('react') ||
        lowerMessage.includes('mount') || lowerMessage.includes('render')) {
      return 'component';
    }

    if (lowerMessage.includes('network') || lowerMessage.includes('fetch') ||
        lowerMessage.includes('xhr') || lowerMessage.includes('cors')) {
      return 'network';
    }

    return 'other';
  }

  /**
   * Check if error is critical
   */
  private isCriticalError(message: string): boolean {
    const criticalPatterns = [
      'webgl context lost',
      'out of memory',
      'maximum call stack',
      'cannot read property',
      'undefined is not',
      'failed to compile shader',
      'webgl: invalid_operation',
      'three.module.js'
    ];

    const lowerMessage = message.toLowerCase();
    return criticalPatterns.some(pattern => lowerMessage.includes(pattern));
  }

  /**
   * Handle critical errors
   */
  private handleCriticalError(error: ConsoleError): void {
    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      // Send to error tracking service
      console.log('📊 Sending critical error to tracking service');
    }

    // Display user-friendly error message
    const errorElement = document.createElement('div');
    errorElement.className = 'fixed top-4 right-4 bg-red-600 text-white p-4 rounded-lg shadow-lg z-50';
    errorElement.innerHTML = `
      <div class="flex items-center gap-2">
        <span>⚠️</span>
        <span>A critical error occurred. Please refresh the page.</span>
      </div>
    `;
    document.body.appendChild(errorElement);

    setTimeout(() => {
      errorElement.remove();
    }, 5000);
  }

  /**
   * Monitor WebGL specific errors
   */
  private monitorWebGL(): void {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
    if (!gl) return;

    // Listen for context lost
    canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      this.captureError('error', ['WebGL context lost']);
    });

    // Listen for context restored
    canvas.addEventListener('webglcontextrestored', () => {
      console.log('✅ WebGL context restored');
    });
  }

  /**
   * Start FPS monitoring
   */
  private startFPSMonitoring(): void {
    let lastTime = performance.now();
    let frames = 0;

    const measureFPS = () => {
      frames++;
      const currentTime = performance.now();

      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frames * 1000) / (currentTime - lastTime));

        this.metrics.push({
          fps,
          memory: this.getMemoryUsage(),
          loadTime: 0,
          renderTime: currentTime - lastTime,
          timestamp: Date.now()
        });

        // Alert on low FPS
        if (fps < 30) {
          console.warn(`⚠️ Low FPS detected: ${fps}`);
        }

        frames = 0;
        lastTime = currentTime;
      }

      if (this.isMonitoring) {
        requestAnimationFrame(measureFPS);
      }
    };

    requestAnimationFrame(measureFPS);
  }

  /**
   * Monitor memory usage
   */
  private monitorMemory(): void {
    if (!performance.memory) return;

    setInterval(() => {
      const memory = this.getMemoryUsage();
      const limit = performance.memory.jsHeapSizeLimit / (1024 * 1024);
      const usage = (memory / limit) * 100;

      if (usage > 80) {
        console.warn(`⚠️ High memory usage: ${usage.toFixed(1)}%`);
      }
    }, 5000);
  }

  /**
   * Get current memory usage in MB
   */
  private getMemoryUsage(): number {
    if (!performance.memory) return 0;
    return Math.round(performance.memory.usedJSHeapSize / (1024 * 1024));
  }

  /**
   * Get error summary
   */
  getErrorSummary(): {
    total: number;
    critical: number;
    errors: number;
    warnings: number;
    byCategory: Record<string, number>;
  } {
    const summary = {
      total: this.errors.length,
      critical: 0,
      errors: 0,
      warnings: 0,
      byCategory: {} as Record<string, number>
    };

    this.errors.forEach(error => {
      if (error.type === 'critical') summary.critical++;
      else if (error.type === 'error') summary.errors++;
      else if (error.type === 'warning') summary.warnings++;

      const category = error.category || 'other';
      summary.byCategory[category] = (summary.byCategory[category] || 0) + 1;
    });

    return summary;
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary(): {
    averageFPS: number;
    minFPS: number;
    maxFPS: number;
    averageMemory: number;
    currentMemory: number;
  } {
    if (this.metrics.length === 0) {
      return {
        averageFPS: 0,
        minFPS: 0,
        maxFPS: 0,
        averageMemory: 0,
        currentMemory: 0
      };
    }

    const fpsList = this.metrics.map(m => m.fps);
    const memoryList = this.metrics.map(m => m.memory);

    return {
      averageFPS: Math.round(fpsList.reduce((a, b) => a + b, 0) / fpsList.length),
      minFPS: Math.min(...fpsList),
      maxFPS: Math.max(...fpsList),
      averageMemory: Math.round(memoryList.reduce((a, b) => a + b, 0) / memoryList.length),
      currentMemory: this.getMemoryUsage()
    };
  }

  /**
   * Clear all tracked data
   */
  clear(): void {
    this.errors = [];
    this.metrics = [];
  }

  /**
   * Export data for analysis
   */
  export(): {
    errors: ConsoleError[];
    metrics: PerformanceMetrics[];
    summary: ReturnType<typeof this.getErrorSummary>;
    performance: ReturnType<typeof this.getPerformanceSummary>;
  } {
    return {
      errors: this.errors,
      metrics: this.metrics,
      summary: this.getErrorSummary(),
      performance: this.getPerformanceSummary()
    };
  }
}

// Create singleton instance
export const consoleMonitor = new ConsoleMonitor();

// Auto-start in development
if (process.env.NODE_ENV === 'development') {
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      consoleMonitor.start();
    });
  }
}

export default consoleMonitor;