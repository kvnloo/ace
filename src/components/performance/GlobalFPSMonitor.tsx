import React, { useEffect } from 'react';
import { useFPSMonitorControl } from './FPSMonitorContext';
import FPSMonitor from './FPSMonitor';

/**
 * Global FPS Monitor that persists across page transitions
 * Controlled by FPSMonitorContext
 *
 * This component handles the FPS monitor during transition and overlay states.
 * The embedded state is handled locally within LoadingScreen.
 */
const GlobalFPSMonitor: React.FC = () => {
    const { mode } = useFPSMonitorControl();

    // Only render when transitioning or in overlay mode
    // Embedded mode is handled by the LoadingScreen locally
    // Hidden mode means FPS monitor is completely disabled
    if (mode === 'hidden' || mode === 'embedded') {
        return null;
    }

    console.log('[GlobalFPSMonitor] Rendering with mode:', mode);

    return (
        <FPSMonitor
            mode={mode}
            showFPSMonitor={true}
        />
    );
};

export default GlobalFPSMonitor;
