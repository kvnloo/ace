import React from 'react';
import { motion } from 'framer-motion';
import { WifiOff, RefreshCw, Server } from 'lucide-react';

interface OfflineFallbackProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

/**
 * OfflineFallback Component
 *
 * Full-page fallback displayed when the application cannot load due to network issues.
 * Can also be used as a component-level fallback for features requiring internet connectivity.
 *
 * Features:
 * - Beautiful offline UI matching brand aesthetics
 * - Customizable title and message
 * - Retry functionality
 * - Responsive design
 * - Engaging animations
 *
 * Usage:
 * <OfflineFallback /> - Default offline message
 * <OfflineFallback title="Custom Title" message="Custom message" onRetry={handleRetry} />
 */
const OfflineFallback: React.FC<OfflineFallbackProps> = ({
  title = 'No Internet Connection',
  message = "It looks like you're offline. Please check your internet connection and try again.",
  onRetry,
}) => {
  const handleRetry = (): void => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div className="max-w-2xl w-full">
        {/* Animated Offline Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            {/* Outer pulse ring */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-full bg-orange-500/30 blur-xl"
            />
            {/* Icon container */}
            <div className="relative w-24 h-24 rounded-full bg-orange-500/20 border-2 border-orange-500 flex items-center justify-center">
              <WifiOff className="w-12 h-12 text-orange-500" />
            </div>
          </div>
        </motion.div>

        {/* Offline Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">{title}</h1>
          <p className="text-xl text-gray-400 mb-6">{message}</p>

          {/* Status indicators */}
          <div className="flex items-center justify-center gap-8 mt-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <span className="text-gray-500">Network: Offline</span>
            </div>
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-gray-600" />
              <span className="text-gray-500">Waiting for connection...</span>
            </div>
          </div>
        </motion.div>

        {/* Retry Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center"
        >
          <button
            onClick={handleRetry}
            className="px-8 py-4 bg-tennis-yellow text-tennis-dark font-bold rounded-full hover:bg-white transition-all flex items-center gap-2 group shadow-lg hover:shadow-tennis-yellow/20"
          >
            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            Try Again
          </button>
        </motion.div>

        {/* Helpful Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 p-6 bg-white/5 border border-white/10 rounded-2xl"
        >
          <h3 className="text-lg font-bold mb-4 text-tennis-yellow">Troubleshooting Tips</h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-2 flex-shrink-0" />
              <span>Check your WiFi or mobile data connection</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-2 flex-shrink-0" />
              <span>Try turning airplane mode off and on</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-2 flex-shrink-0" />
              <span>Restart your router if using WiFi</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-tennis-yellow mt-2 flex-shrink-0" />
              <span>Check if other websites or apps are working</span>
            </li>
          </ul>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center text-xs text-gray-600"
        >
          <p>LawnTech Dynamics • Autonomous Tennis Facility</p>
        </motion.div>
      </div>
    </div>
  );
};

export default OfflineFallback;
