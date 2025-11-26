/**
 * React Hook for FPS Batch Controller
 *
 * Provides easy integration of FPS monitoring and batch management
 * in React components.
 */

import { useEffect, useState, useCallback } from 'react';
import { FPSBatchController, WarningEvent } from '../services/fps/FPSBatchController';
import { ComponentTier } from '../services/batch-loading/ComponentBatchManager';

export interface FPSBatchControllerState {
    currentFPS: number;
    averageFPS: number;
    enabledComponents: string[];
    enabledTiers: number[];
    warnings: WarningEvent[];
    isMonitoring: boolean;
}

export const useFPSBatchController = (
    controller?: FPSBatchController,
    autoStart = true
) => {
    const [controllerInstance] = useState(() => controller || new FPSBatchController());
    const [state, setState] = useState<FPSBatchControllerState>({
        currentFPS: 60,
        averageFPS: 60,
        enabledComponents: [],
        enabledTiers: [ComponentTier.ESSENTIAL],
        warnings: [],
        isMonitoring: false
    });

    // Update FPS
    useEffect(() => {
        const interval = setInterval(() => {
            const fpsMonitor = controllerInstance.getFPSMonitor();
            const stats = fpsMonitor.getStats();
            const batchManager = controllerInstance.getBatchManager();

            // Get enabled tiers
            const enabledTiers: number[] = [];
            for (let tier = ComponentTier.ESSENTIAL; tier <= ComponentTier.ENHANCED; tier++) {
                if (batchManager.isTierEnabled(tier as ComponentTier)) {
                    enabledTiers.push(tier);
                }
            }

            setState(prev => ({
                ...prev,
                currentFPS: stats.current,
                averageFPS: stats.average,
                enabledComponents: batchManager.getEnabledComponents(),
                enabledTiers
            }));
        }, 100);

        return () => clearInterval(interval);
    }, [controllerInstance]);

    // Listen for warnings
    useEffect(() => {
        const unsubscribe = controllerInstance.onWarning((warning) => {
            setState(prev => ({
                ...prev,
                warnings: [...prev.warnings, warning].slice(-10) // Keep last 10
            }));
        });

        return unsubscribe;
    }, [controllerInstance]);

    // Auto-start monitoring
    useEffect(() => {
        if (autoStart) {
            controllerInstance.start();
            setState(prev => ({ ...prev, isMonitoring: true }));

            return () => {
                controllerInstance.stop();
                setState(prev => ({ ...prev, isMonitoring: false }));
            };
        }
    }, [controllerInstance, autoStart]);

    const startMonitoring = useCallback(() => {
        controllerInstance.start();
        setState(prev => ({ ...prev, isMonitoring: true }));
    }, [controllerInstance]);

    const stopMonitoring = useCallback(() => {
        controllerInstance.stop();
        setState(prev => ({ ...prev, isMonitoring: false }));
    }, [controllerInstance]);

    const enableTier = useCallback(async (tier: ComponentTier) => {
        return controllerInstance.enableTier(tier);
    }, [controllerInstance]);

    const disableTier = useCallback(async (tier: ComponentTier) => {
        return controllerInstance.disableTier(tier);
    }, [controllerInstance]);

    const enableComponent = useCallback(async (componentId: string) => {
        return controllerInstance.enableComponent(componentId);
    }, [controllerInstance]);

    const disableComponent = useCallback(async (componentId: string) => {
        return controllerInstance.disableComponent(componentId);
    }, [controllerInstance]);

    const dismissWarning = useCallback((index: number) => {
        setState(prev => ({
            ...prev,
            warnings: prev.warnings.filter((_, i) => i !== index)
        }));
    }, []);

    const clearWarnings = useCallback(() => {
        setState(prev => ({ ...prev, warnings: [] }));
    }, []);

    return {
        controller: controllerInstance,
        state,
        actions: {
            startMonitoring,
            stopMonitoring,
            enableTier,
            disableTier,
            enableComponent,
            disableComponent,
            dismissWarning,
            clearWarnings
        }
    };
};
