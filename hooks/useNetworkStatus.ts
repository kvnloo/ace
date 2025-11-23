import { useState, useEffect } from 'react';

/**
 * Network status information
 */
export interface NetworkStatus {
  isOnline: boolean;
  wasOffline: boolean;
  downlink?: number; // Effective bandwidth estimate in Mb/s (if available)
  effectiveType?: string; // Network type: 'slow-2g', '2g', '3g', or '4g' (if available)
  saveData?: boolean; // Whether user has requested reduced data usage (if available)
}

/**
 * Custom hook to detect and monitor network status
 *
 * Features:
 * - Real-time online/offline detection
 * - Tracks if user was previously offline
 * - Provides network quality information when available
 * - Cross-browser compatible
 *
 * @returns NetworkStatus object with current network state
 *
 * @example
 * const { isOnline, wasOffline } = useNetworkStatus();
 *
 * if (!isOnline) {
 *   return <OfflineFallback />;
 * }
 */
const useNetworkStatus = (): NetworkStatus => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>(() => {
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    return {
      isOnline,
      wasOffline: false,
    };
  });

  useEffect(() => {
    // Get additional network information if available
    const getNetworkInfo = (): Partial<NetworkStatus> => {
      // @ts-ignore - Network Information API is not fully standardized
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

      if (connection) {
        return {
          downlink: connection.downlink,
          effectiveType: connection.effectiveType,
          saveData: connection.saveData,
        };
      }

      return {};
    };

    // Update network status
    const updateNetworkStatus = (isOnline: boolean): void => {
      setNetworkStatus((prev) => ({
        isOnline,
        wasOffline: prev.wasOffline || !isOnline,
        ...getNetworkInfo(),
      }));
    };

    // Event handlers
    const handleOnline = (): void => {
      updateNetworkStatus(true);
    };

    const handleOffline = (): void => {
      updateNetworkStatus(false);
    };

    // Network Information API change handler
    const handleConnectionChange = (): void => {
      setNetworkStatus((prev) => ({
        ...prev,
        ...getNetworkInfo(),
      }));
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen to connection changes if available
    // @ts-ignore - Network Information API
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      connection.addEventListener('change', handleConnectionChange);
    }

    // Initial network info
    setNetworkStatus((prev) => ({
      ...prev,
      ...getNetworkInfo(),
    }));

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);

      if (connection) {
        connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, []);

  return networkStatus;
};

export default useNetworkStatus;
