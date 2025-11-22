import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, FileText, Copy, Check } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackUI?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  copied: boolean;
}

/**
 * ErrorBoundary Component
 *
 * Production-ready error boundary that catches all React errors and provides:
 * - Full error stack traces with component tree
 * - Automatic error reporting to localStorage
 * - User-friendly fallback UI
 * - Error copy/export functionality
 * - Automatic recovery options
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      copied: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Generate unique error ID
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      hasError: true,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console for development
    console.error('🔴 ErrorBoundary caught error:', error);
    console.error('📍 Component Stack:', errorInfo.componentStack);

    // Update state with full error details
    this.setState({
      error,
      errorInfo
    });

    // Store error in localStorage for persistence
    this.persistError(error, errorInfo);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to DebugLogger if available
    if (window.debugLogger) {
      window.debugLogger.logError({
        type: 'react_error',
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        errorId: this.state.errorId,
        timestamp: Date.now()
      });
    }
  }

  /**
   * Persist error to localStorage for debugging
   */
  private persistError(error: Error, errorInfo: ErrorInfo): void {
    try {
      const errorLog = {
        errorId: this.state.errorId,
        timestamp: new Date().toISOString(),
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        userAgent: navigator.userAgent,
        url: window.location.href,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      };

      // Store in localStorage with size limit
      const existingErrors = this.getStoredErrors();
      existingErrors.unshift(errorLog);

      // Keep only last 10 errors to prevent storage overflow
      const trimmedErrors = existingErrors.slice(0, 10);
      localStorage.setItem('react_errors', JSON.stringify(trimmedErrors));
    } catch (e) {
      console.warn('Failed to persist error to localStorage:', e);
    }
  }

  /**
   * Retrieve stored errors from localStorage
   */
  private getStoredErrors(): any[] {
    try {
      const stored = localStorage.getItem('react_errors');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Copy error details to clipboard
   */
  private copyErrorToClipboard = async (): Promise<void> => {
    const { error, errorInfo, errorId } = this.state;

    const errorReport = `
🔴 Error Report
ID: ${errorId}
Time: ${new Date().toISOString()}

Error Message:
${error?.message}

Stack Trace:
${error?.stack}

Component Stack:
${errorInfo?.componentStack}

Browser: ${navigator.userAgent}
URL: ${window.location.href}
Viewport: ${window.innerWidth}x${window.innerHeight}
`.trim();

    try {
      await navigator.clipboard.writeText(errorReport);
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    } catch (e) {
      console.error('Failed to copy error report:', e);
    }
  };

  /**
   * Download error report as text file
   */
  private downloadErrorReport = (): void => {
    const { error, errorInfo, errorId } = this.state;

    const errorReport = `
Error Report - ${errorId}
Generated: ${new Date().toISOString()}

ERROR DETAILS
=============
Message: ${error?.message}
Type: ${error?.name}

STACK TRACE
===========
${error?.stack}

COMPONENT STACK
===============
${errorInfo?.componentStack}

ENVIRONMENT
===========
User Agent: ${navigator.userAgent}
URL: ${window.location.href}
Screen: ${window.screen.width}x${window.screen.height}
Viewport: ${window.innerWidth}x${window.innerHeight}
`.trim();

    const blob = new Blob([errorReport], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-report-${errorId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /**
   * Attempt to recover from error
   */
  private handleRecover = (): void => {
    // Clear error state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      copied: false
    });

    // Optionally reload the page if recovery fails
    // window.location.reload();
  };

  /**
   * Clear all stored errors
   */
  private clearStoredErrors = (): void => {
    try {
      localStorage.removeItem('react_errors');
      console.log('✅ Cleared stored errors');
    } catch (e) {
      console.error('Failed to clear stored errors:', e);
    }
  };

  render(): ReactNode {
    const { hasError, error, errorInfo, errorId, copied } = this.state;
    const { children, fallbackUI } = this.props;

    if (hasError) {
      // Use custom fallback UI if provided
      if (fallbackUI) {
        return fallbackUI;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900/20 to-slate-900 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-red-500/30 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-white" />
              <div>
                <h1 className="text-xl font-bold text-white">
                  Application Error
                </h1>
                <p className="text-sm text-red-100">
                  Something went wrong in the 3D scene
                </p>
              </div>
            </div>

            {/* Error Details */}
            <div className="p-6 space-y-4">
              {/* Error ID */}
              <div className="bg-slate-700/50 rounded-lg px-4 py-3 border border-slate-600">
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                  Error ID
                </div>
                <div className="font-mono text-sm text-white">
                  {errorId}
                </div>
              </div>

              {/* Error Message */}
              <div className="bg-red-900/20 rounded-lg px-4 py-3 border border-red-500/30">
                <div className="text-xs text-red-300 uppercase tracking-wider mb-2">
                  Error Message
                </div>
                <div className="text-red-100 font-medium">
                  {error?.message || 'Unknown error occurred'}
                </div>
              </div>

              {/* Stack Trace - Collapsible */}
              <details className="bg-slate-700/30 rounded-lg border border-slate-600">
                <summary className="px-4 py-3 cursor-pointer text-sm text-slate-300 hover:text-white font-medium">
                  Stack Trace (Click to expand)
                </summary>
                <div className="px-4 py-3 border-t border-slate-600">
                  <pre className="text-xs text-slate-300 overflow-x-auto whitespace-pre-wrap font-mono max-h-60 overflow-y-auto">
                    {error?.stack}
                  </pre>
                </div>
              </details>

              {/* Component Stack */}
              <details className="bg-slate-700/30 rounded-lg border border-slate-600">
                <summary className="px-4 py-3 cursor-pointer text-sm text-slate-300 hover:text-white font-medium">
                  Component Stack (Click to expand)
                </summary>
                <div className="px-4 py-3 border-t border-slate-600">
                  <pre className="text-xs text-slate-300 overflow-x-auto whitespace-pre-wrap font-mono max-h-60 overflow-y-auto">
                    {errorInfo?.componentStack}
                  </pre>
                </div>
              </details>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4">
                <button
                  onClick={this.handleRecover}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Recovery
                </button>

                <button
                  onClick={this.copyErrorToClipboard}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Report
                    </>
                  )}
                </button>

                <button
                  onClick={this.downloadErrorReport}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Download Report
                </button>
              </div>

              {/* Help Text */}
              <div className="text-xs text-slate-400 pt-2">
                This error has been logged. You can try recovering, or reload the page.
                If the problem persists, please report this issue with the error ID.
              </div>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
