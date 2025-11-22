import React, { useEffect, useState, useRef } from 'react';
import { Bug, X, Download, Trash2, Eye, EyeOff, Activity, AlertCircle } from 'lucide-react';

/**
 * Log Entry Type Definitions
 */
type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogEntry {
  id: string;
  timestamp: number;
  level: LogLevel;
  type: string;
  message: string;
  stack?: string;
  data?: any;
}

interface PerformanceMetrics {
  fps: number;
  memory: number;
  frameTime: number;
  webglContextLost: boolean;
}

interface DebugLoggerProps {
  enabled?: boolean;
  maxLogs?: number;
  persistLogs?: boolean;
  showPerformance?: boolean;
}

/**
 * DebugLogger Component
 *
 * Comprehensive debug overlay for production/development that:
 * - Intercepts console.error and console.warn
 * - Tracks Three.js/WebGL errors
 * - Monitors performance (FPS, memory, frame time)
 * - Logs to localStorage for persistence
 * - Provides visual debug overlay
 * - Detects WebGL context loss
 */
const DebugLogger: React.FC<DebugLoggerProps> = ({
  enabled = true,
  maxLogs = 100,
  persistLogs = true,
  showPerformance = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [performance, setPerformance] = useState<PerformanceMetrics>({
    fps: 0,
    memory: 0,
    frameTime: 0,
    webglContextLost: false
  });

  const logsRef = useRef<LogEntry[]>([]);
  const originalConsoleRef = useRef({
    error: console.error,
    warn: console.warn,
    log: console.log
  });
  const frameCountRef = useRef(0);
  const lastFrameTimeRef = useRef(performance.now());
  const fpsUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Add log entry
   */
  const addLog = (level: LogLevel, type: string, message: string, data?: any, stack?: string) => {
    const logEntry: LogEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      level,
      type,
      message,
      stack,
      data
    };

    logsRef.current = [logEntry, ...logsRef.current].slice(0, maxLogs);
    setLogs([...logsRef.current]);

    // Persist to localStorage if enabled
    if (persistLogs) {
      try {
        localStorage.setItem('debug_logs', JSON.stringify(logsRef.current));
      } catch (e) {
        console.warn('Failed to persist logs:', e);
      }
    }
  };

  /**
   * Setup console interceptors
   */
  useEffect(() => {
    if (!enabled) return;

    // Intercept console.error
    console.error = (...args: any[]) => {
      originalConsoleRef.current.error(...args);

      const message = args.map(arg =>
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');

      const stack = args.find(arg => arg instanceof Error)?.stack;

      addLog('error', 'console_error', message, args, stack);
    };

    // Intercept console.warn
    console.warn = (...args: any[]) => {
      originalConsoleRef.current.warn(...args);

      const message = args.map(arg =>
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');

      addLog('warn', 'console_warn', message, args);
    };

    // Restore original console methods on cleanup
    return () => {
      console.error = originalConsoleRef.current.error;
      console.warn = originalConsoleRef.current.warn;
    };
  }, [enabled]);

  /**
   * Setup global error handlers
   */
  useEffect(() => {
    if (!enabled) return;

    // Window error handler
    const handleWindowError = (event: ErrorEvent) => {
      addLog('error', 'window_error', event.message, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      }, event.error?.stack);
    };

    // Unhandled promise rejection handler
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      addLog('error', 'unhandled_rejection', String(event.reason), {
        reason: event.reason
      }, event.reason?.stack);
    };

    window.addEventListener('error', handleWindowError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleWindowError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [enabled]);

  /**
   * Setup WebGL context loss detection
   */
  useEffect(() => {
    if (!enabled) return;

    const handleWebGLContextLost = (event: Event) => {
      event.preventDefault();
      addLog('error', 'webgl_context_lost', 'WebGL context was lost', {
        statusMessage: (event as WebGLContextEvent).statusMessage
      });
      setPerformance(prev => ({ ...prev, webglContextLost: true }));
    };

    const handleWebGLContextRestored = () => {
      addLog('info', 'webgl_context_restored', 'WebGL context was restored');
      setPerformance(prev => ({ ...prev, webglContextLost: false }));
    };

    // Find canvas elements and attach listeners
    const canvases = document.querySelectorAll('canvas');
    canvases.forEach(canvas => {
      canvas.addEventListener('webglcontextlost', handleWebGLContextLost);
      canvas.addEventListener('webglcontextrestored', handleWebGLContextRestored);
    });

    return () => {
      canvases.forEach(canvas => {
        canvas.removeEventListener('webglcontextlost', handleWebGLContextLost);
        canvas.removeEventListener('webglcontextrestored', handleWebGLContextRestored);
      });
    };
  }, [enabled]);

  /**
   * Performance monitoring (FPS, memory)
   */
  useEffect(() => {
    if (!enabled || !showPerformance) return;

    // FPS tracking
    const trackFrame = () => {
      const now = performance.now();
      const delta = now - lastFrameTimeRef.current;

      frameCountRef.current++;
      lastFrameTimeRef.current = now;

      // Update frame time
      setPerformance(prev => ({ ...prev, frameTime: delta }));

      requestAnimationFrame(trackFrame);
    };

    const frameId = requestAnimationFrame(trackFrame);

    // FPS calculation (every second)
    fpsUpdateIntervalRef.current = setInterval(() => {
      const fps = frameCountRef.current;
      frameCountRef.current = 0;

      // Memory usage (if available)
      const memory = (performance as any).memory?.usedJSHeapSize
        ? Math.round((performance as any).memory.usedJSHeapSize / 1048576)
        : 0;

      setPerformance(prev => ({ ...prev, fps, memory }));

      // Log performance warnings
      if (fps < 30) {
        addLog('warn', 'performance', `Low FPS detected: ${fps}`, { fps });
      }
    }, 1000);

    return () => {
      cancelAnimationFrame(frameId);
      if (fpsUpdateIntervalRef.current) {
        clearInterval(fpsUpdateIntervalRef.current);
      }
    };
  }, [enabled, showPerformance]);

  /**
   * Load persisted logs on mount
   */
  useEffect(() => {
    if (!persistLogs) return;

    try {
      const stored = localStorage.getItem('debug_logs');
      if (stored) {
        const parsedLogs = JSON.parse(stored);
        logsRef.current = parsedLogs;
        setLogs(parsedLogs);
      }
    } catch (e) {
      console.warn('Failed to load persisted logs:', e);
    }
  }, []);

  /**
   * Expose global debug logger API
   */
  useEffect(() => {
    if (!enabled) return;

    window.debugLogger = {
      logError: (data: any) => addLog('error', data.type || 'custom', data.message, data, data.stack),
      logWarn: (data: any) => addLog('warn', data.type || 'custom', data.message, data),
      logInfo: (data: any) => addLog('info', data.type || 'custom', data.message, data),
      clearLogs: () => {
        logsRef.current = [];
        setLogs([]);
        localStorage.removeItem('debug_logs');
      },
      getLogs: () => logsRef.current
    };

    return () => {
      delete window.debugLogger;
    };
  }, [enabled]);

  /**
   * Clear all logs
   */
  const handleClearLogs = () => {
    logsRef.current = [];
    setLogs([]);
    if (persistLogs) {
      localStorage.removeItem('debug_logs');
    }
  };

  /**
   * Download logs as JSON
   */
  const handleDownloadLogs = () => {
    const logData = {
      exportedAt: new Date().toISOString(),
      performance: performance,
      logs: logsRef.current
    };

    const blob = new Blob([JSON.stringify(logData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debug-logs-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /**
   * Get color based on log level
   */
  const getLevelColor = (level: LogLevel): string => {
    switch (level) {
      case 'error': return 'text-red-400 bg-red-900/20 border-red-500/30';
      case 'warn': return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30';
      case 'info': return 'text-blue-400 bg-blue-900/20 border-blue-500/30';
      case 'debug': return 'text-slate-400 bg-slate-900/20 border-slate-500/30';
      default: return 'text-slate-400 bg-slate-900/20 border-slate-500/30';
    }
  };

  if (!enabled) return null;

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-6 right-6 z-50 bg-slate-800 hover:bg-slate-700 text-white p-3 rounded-full shadow-lg border border-slate-600 transition-all"
        title="Toggle Debug Logger"
      >
        {isVisible ? <EyeOff className="w-5 h-5" /> : <Bug className="w-5 h-5" />}
      </button>

      {/* Performance HUD (always visible when enabled) */}
      {showPerformance && (
        <div className="fixed top-6 right-6 z-40 bg-slate-900/90 backdrop-blur-sm rounded-lg shadow-lg border border-slate-700 p-3 min-w-[180px]">
          <div className="flex items-center gap-2 mb-2 text-slate-300 text-xs font-bold uppercase tracking-wider">
            <Activity className="w-3 h-3" />
            Performance
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">FPS:</span>
              <span className={`font-mono font-bold ${performance.fps < 30 ? 'text-red-400' : performance.fps < 50 ? 'text-yellow-400' : 'text-green-400'}`}>
                {performance.fps}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400">Frame:</span>
              <span className="text-slate-300 font-mono">
                {performance.frameTime.toFixed(2)}ms
              </span>
            </div>

            {performance.memory > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Memory:</span>
                <span className="text-slate-300 font-mono">
                  {performance.memory}MB
                </span>
              </div>
            )}

            {performance.webglContextLost && (
              <div className="flex items-center gap-1 text-red-400 pt-1 border-t border-slate-700">
                <AlertCircle className="w-3 h-3" />
                <span className="font-medium">WebGL Lost</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Debug Overlay Panel */}
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-6">
          <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-4xl max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <Bug className="w-5 h-5 text-purple-400" />
                <div>
                  <h2 className="text-lg font-bold text-white">Debug Logger</h2>
                  <p className="text-xs text-slate-400">
                    {logs.length} entries
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadLogs}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                  title="Download logs"
                >
                  <Download className="w-4 h-4 text-slate-400" />
                </button>
                <button
                  onClick={handleClearLogs}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                  title="Clear logs"
                >
                  <Trash2 className="w-4 h-4 text-slate-400" />
                </button>
                <button
                  onClick={() => setIsVisible(false)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                  title="Close"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Logs Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {logs.length === 0 ? (
                <div className="text-center text-slate-500 py-12">
                  <Bug className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No logs yet</p>
                  <p className="text-xs mt-1">Errors and warnings will appear here</p>
                </div>
              ) : (
                logs.map(log => (
                  <div
                    key={log.id}
                    className={`rounded-lg border p-3 ${getLevelColor(log.level)}`}
                  >
                    {/* Log Header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider">
                          {log.level}
                        </span>
                        <span className="text-xs text-slate-500">•</span>
                        <span className="text-xs text-slate-400">
                          {log.type}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 font-mono">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>

                    {/* Log Message */}
                    <div className="text-sm font-medium mb-2">
                      {log.message}
                    </div>

                    {/* Stack Trace */}
                    {log.stack && (
                      <details className="mt-2">
                        <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-300">
                          Stack trace
                        </summary>
                        <pre className="mt-2 text-xs text-slate-400 overflow-x-auto whitespace-pre-wrap font-mono bg-slate-950/50 p-2 rounded border border-slate-700">
                          {log.stack}
                        </pre>
                      </details>
                    )}

                    {/* Additional Data */}
                    {log.data && (
                      <details className="mt-2">
                        <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-300">
                          Additional data
                        </summary>
                        <pre className="mt-2 text-xs text-slate-400 overflow-x-auto whitespace-pre-wrap font-mono bg-slate-950/50 p-2 rounded border border-slate-700">
                          {JSON.stringify(log.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DebugLogger;

/**
 * Global type declarations for window.debugLogger
 */
declare global {
  interface Window {
    debugLogger?: {
      logError: (data: any) => void;
      logWarn: (data: any) => void;
      logInfo: (data: any) => void;
      clearLogs: () => void;
      getLogs: () => LogEntry[];
    };
  }
}
