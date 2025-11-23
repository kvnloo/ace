import React, { useEffect } from 'react';
import { useFPSMonitorControl } from './FPSMonitorContext';
import FPSMonitor from './FPSMonitor';

/**
 * Global FPS Monitor that persists across page transitions
 * Controlled by FPSMonitorContext
 */
const GlobalFPSMonitor: React.FC = () => {
    const { mode } = useFPSMonitorControl();

    // Only render when transitioning or overlay
    // Embedded mode is handled by the LoadingScreen locally
    if (mode === 'hidden' || mode === 'embedded') {
        return null;
    }

    return (
        <FPSMonitor
            mode={mode === 'transitioning' || mode === 'overlay' ? mode : 'overlay'}
            showFPSMonitor={true}
        />
    );
};

export default GlobalFPSMonitor;
