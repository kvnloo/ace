/**
 * React Hook for FPS Batch Controller
 *
 * Provides easy integration of FPS monitoring and batch management
 * in React components.
 */

import { useEffect, useState, useCallback } from 'react';
import { FPSBatchController } from '../services/fps/FPSBatchController';
import { ComponentBatch } from '../services/fps/ComponentBatchManager';
import { WarningEvent } from '../services/fps/FPSBatchController';

export interface FPSBatchControllerState {
  currentFPS: number;
  averageFPS: number;
  enabledBatches: ComponentBatch[];
  disabledBatches: ComponentBatch[];
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
    enabledBatches: [ComponentBatch.COURTS_ONLY],
    disabledBatches: [],
    warnings: [],
    isMonitoring: false
  });

  // Update FPS
  useEffect(() => {
    const interval = setInterval(() => {
      const fpsMonitor = controllerInstance.getFPSMonitor();
      const stats = fpsMonitor.getStats();
      const batchManager = controllerInstance.getBatchManager();

      setState(prev => ({
        ...prev,
        currentFPS: stats.current,
        averageFPS: stats.average,
        enabledBatches: batchManager.getEnabledBatches(),
        disabledBatches: batchManager.getDisabledBatches()
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

  const enableBatch = useCallback(async (batch: ComponentBatch) => {
    return controllerInstance.enableBatch(batch);
  }, [controllerInstance]);

  const disableBatch = useCallback(async (batch: ComponentBatch) => {
    return controllerInstance.disableBatch(batch);
  }, [controllerInstance]);

  const clearManualOverrides = useCallback(() => {
    controllerInstance.clearManualOverrides();
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
      enableBatch,
      disableBatch,
      clearManualOverrides,
      dismissWarning,
      clearWarnings
    }
  };
};
