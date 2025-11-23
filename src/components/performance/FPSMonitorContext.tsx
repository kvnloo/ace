import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type FPSMonitorMode = 'embedded' | 'overlay' | 'transitioning' | 'hidden';

interface FPSMonitorContextType {
    mode: FPSMonitorMode;
    setMode: (mode: FPSMonitorMode) => void;
    startTransition: () => void;
}

const FPSMonitorContext = createContext<FPSMonitorContextType | null>(null);

export const useFPSMonitorControl = () => {
    const context = useContext(FPSMonitorContext);
    if (!context) {
        throw new Error('useFPSMonitorControl must be used within FPSMonitorProvider');
    }
    return context;
};

interface FPSMonitorProviderProps {
    children: ReactNode;
}

export const FPSMonitorProvider: React.FC<FPSMonitorProviderProps> = ({ children }) => {
    const [mode, setMode] = useState<FPSMonitorMode>('hidden');

    const startTransition = useCallback(() => {
        // Embedded → Transitioning → Overlay
        setMode('transitioning');
        setTimeout(() => {
            setMode('overlay');
        }, 1200); // Match transition duration
    }, []);

    return (
        <FPSMonitorContext.Provider value={{ mode, setMode, startTransition }}>
            {children}
        </FPSMonitorContext.Provider>
    );
};
