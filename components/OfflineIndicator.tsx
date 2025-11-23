import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi } from 'lucide-react';

/**
 * OfflineIndicator Component
 *
 * Displays a notification banner when the user loses internet connectivity.
 * Automatically detects network status changes and shows/hides accordingly.
 *
 * Features:
 * - Real-time network status monitoring
 * - Smooth animations with Framer Motion
 * - Brand-consistent styling
 * - Non-intrusive placement
 * - Auto-dismiss when connection restored
 */
const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showReconnected, setShowReconnected] = useState<boolean>(false);

  useEffect(() => {
    // Handler for when connection is lost
    const handleOffline = (): void => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    // Handler for when connection is restored
    const handleOnline = (): void => {
      setIsOnline(true);
      setShowReconnected(true);

      // Hide the "reconnected" message after 3 seconds
      setTimeout(() => {
        setShowReconnected(false);
      }, 3000);
    };

    // Add event listeners
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return (
    <>
      {/* Offline Banner */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
          >
            <div className="mx-auto max-w-7xl px-6 py-3">
              <div className="pointer-events-auto bg-red-500/90 backdrop-blur-lg border border-red-400/50 rounded-full px-6 py-3 shadow-2xl">
                <div className="flex items-center justify-center gap-3 text-white">
                  <WifiOff className="w-5 h-5 animate-pulse" />
                  <p className="text-sm font-bold">
                    You are currently offline. Some features may be unavailable.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reconnected Banner */}
      <AnimatePresence>
        {isOnline && showReconnected && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
          >
            <div className="mx-auto max-w-7xl px-6 py-3">
              <div className="pointer-events-auto bg-green-500/90 backdrop-blur-lg border border-green-400/50 rounded-full px-6 py-3 shadow-2xl">
                <div className="flex items-center justify-center gap-3 text-white">
                  <Wifi className="w-5 h-5" />
                  <p className="text-sm font-bold">Back online! All features are now available.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default OfflineIndicator;
