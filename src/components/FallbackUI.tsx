/**
 * FallbackUI Component
 *
 * Displays a user-friendly fallback UI when 3D assets fail to load.
 * Shows simplified building mesh only with clear messaging.
 */

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface FallbackUIProps {
  error?: Error;
  onRetry?: () => void;
  showBuilding?: boolean;
}

/**
 * Fallback UI component shown when asset loading fails
 *
 * @param error - The error that caused the fallback
 * @param onRetry - Callback to retry loading
 * @param showBuilding - Whether minimal building mesh is visible
 */
export const FallbackUI: React.FC<FallbackUIProps> = ({
  error,
  onRetry,
  showBuilding = true
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm"
    >
      <div className="max-w-md mx-4 p-8 bg-slate-900/90 border border-yellow-500/30 rounded-2xl shadow-2xl">
        {/* Warning Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-white text-center mb-4">
          Limited View Mode
        </h2>

        {/* Message */}
        <p className="text-gray-300 text-center mb-6 leading-relaxed">
          {showBuilding
            ? "Some 3D assets couldn't load. Showing simplified court view."
            : "Unable to load 3D visualization. Please check your connection and try again."
          }
        </p>

        {/* Error Details (if available) */}
        {error && (
          <details className="mb-6 p-4 bg-slate-950/50 rounded-lg border border-slate-700">
            <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-300 transition-colors">
              Technical Details
            </summary>
            <p className="text-xs text-gray-500 mt-2 font-mono">
              {error.message}
            </p>
          </details>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex-1 px-6 py-3 bg-yellow-500 text-slate-950 font-bold rounded-lg hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2 group"
            >
              <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              Retry Loading
            </button>
          )}
          <button
            onClick={() => window.location.href = '/'}
            className="flex-1 px-6 py-3 bg-slate-700 text-white font-bold rounded-lg hover:bg-slate-600 transition-colors"
          >
            Back to Home
          </button>
        </div>

        {/* Status Indicator */}
        {showBuilding && (
          <div className="mt-6 pt-6 border-t border-slate-700">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>Minimal visualization active</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FallbackUI;
