/**
 * Type declarations for error logging system
 */

declare global {
  interface Window {
    /**
     * Global debug logger API
     *
     * Available when DebugLogger component is mounted with enabled=true
     *
     * @example
     * // Log custom error
     * window.debugLogger?.logError({
     *   type: 'three_js_error',
     *   message: 'Failed to load texture',
     *   data: { url: '/texture.png' },
     *   stack: new Error().stack
     * });
     */
    debugLogger?: {
      /**
       * Log an error
       */
      logError: (data: {
        type: string;
        message: string;
        data?: any;
        stack?: string;
      }) => void;

      /**
       * Log a warning
       */
      logWarn: (data: {
        type: string;
        message: string;
        data?: any;
      }) => void;

      /**
       * Log informational message
       */
      logInfo: (data: {
        type: string;
        message: string;
        data?: any;
      }) => void;

      /**
       * Clear all logs from memory and localStorage
       */
      clearLogs: () => void;

      /**
       * Get all stored log entries
       */
      getLogs: () => LogEntry[];
    };
  }
}

/**
 * Log severity levels
 */
export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

/**
 * Structured log entry
 */
export interface LogEntry {
  /** Unique log identifier */
  id: string;

  /** Unix timestamp (milliseconds) */
  timestamp: number;

  /** Log severity level */
  level: LogLevel;

  /** Log category/type */
  type: string;

  /** Log message */
  message: string;

  /** Optional stack trace */
  stack?: string;

  /** Additional structured data */
  data?: any;
}

/**
 * Real-time performance metrics
 */
export interface PerformanceMetrics {
  /** Frames per second */
  fps: number;

  /** JavaScript heap memory usage (MB) */
  memory: number;

  /** Time to render last frame (ms) */
  frameTime: number;

  /** Whether WebGL context is currently lost */
  webglContextLost: boolean;
}

/**
 * Stored error report structure
 */
export interface ErrorReport {
  /** Unique error identifier */
  errorId: string;

  /** ISO timestamp */
  timestamp: string;

  /** Error message */
  message: string;

  /** JavaScript stack trace */
  stack?: string;

  /** React component stack */
  componentStack?: string;

  /** User agent string */
  userAgent: string;

  /** Current URL */
  url: string;

  /** Viewport dimensions */
  viewport: {
    width: number;
    height: number;
  };
}

export {};
