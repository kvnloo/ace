/**
 * Batch Control Panel
 *
 * UI component for manual control of component batches and FPS monitoring display.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  BarChart3,
  Lock,
  Unlock
} from 'lucide-react';
import {
  ComponentBatch,
  BatchState,
  BatchConfig
} from '../../services/fps/ComponentBatchManager';
import { FPSBatchController } from '../../services/fps/FPSBatchController';
import { WarningEvent } from '../../services/fps/FPSBatchController';

interface BatchControlPanelProps {
  controller: FPSBatchController;
  onClose?: () => void;
  initiallyOpen?: boolean;
}

interface BatchUIState extends BatchState {
  config: BatchConfig;
  loading?: boolean;
}

export const BatchControlPanel: React.FC<BatchControlPanelProps> = ({
  controller,
  onClose,
  initiallyOpen = false
}) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const [currentFPS, setCurrentFPS] = useState(60);
  const [batches, setBatches] = useState<BatchUIState[]>([]);
  const [warnings, setWarnings] = useState<WarningEvent[]>([]);
  const [showCorrelations, setShowCorrelations] = useState(false);

  // Update FPS display
  useEffect(() => {
    const interval = setInterval(() => {
      const fps = controller.getFPSMonitor().getCurrentFPS();
      setCurrentFPS(fps);
    }, 100);

    return () => clearInterval(interval);
  }, [controller]);

  // Update batch states
  useEffect(() => {
    const updateBatches = () => {
      const batchManager = controller.getBatchManager();
      const allBatches = Object.values(ComponentBatch).map(batch => {
        const state = batchManager.getBatchState(batch)!;
        const config = batchManager.getBatchConfig(batch);
        return { ...state, config };
      });
      setBatches(allBatches);
    };

    updateBatches();

    // Subscribe to batch changes
    const unsubscribe = controller.getBatchManager().onBatchChange(() => {
      updateBatches();
    });

    return unsubscribe;
  }, [controller]);

  // Listen for warnings
  useEffect(() => {
    const unsubscribe = controller.onWarning((warning) => {
      setWarnings(prev => [...prev, warning].slice(-5)); // Keep last 5 warnings
    });

    return unsubscribe;
  }, [controller]);

  const handleToggleBatch = useCallback(async (batch: ComponentBatch, enabled: boolean) => {
    const batchState = batches.find(b => b.batch === batch);
    if (!batchState) return;

    // Update UI to show loading
    setBatches(prev => prev.map(b =>
      b.batch === batch ? { ...b, loading: true } : b
    ));

    try {
      if (enabled) {
        await controller.enableBatch(batch);
      } else {
        await controller.disableBatch(batch);
      }
    } finally {
      // Loading state will be cleared by batch change event
      setBatches(prev => prev.map(b =>
        b.batch === batch ? { ...b, loading: false } : b
      ));
    }
  }, [controller, batches]);

  const handleClearOverrides = useCallback(() => {
    controller.clearManualOverrides();
  }, [controller]);

  const getFPSColor = (fps: number): string => {
    if (fps >= 55) return 'text-green-400';
    if (fps >= 40) return 'text-blue-400';
    if (fps >= 25) return 'text-amber-400';
    return 'text-red-400';
  };

  const getBatchIcon = (batch: BatchUIState) => {
    if (batch.loading) {
      return <Activity className="w-4 h-4 animate-spin" />;
    }
    if (batch.enabled) {
      return <CheckCircle className="w-4 h-4 text-green-400" />;
    }
    return <XCircle className="w-4 h-4 text-gray-500" />;
  };

  const dismissWarning = (index: number) => {
    setWarnings(prev => prev.filter((_, i) => i !== index));
  };

  if (!isOpen) {
    return (
      <motion.button
        className="fixed bottom-6 right-6 p-4 bg-slate-800 hover:bg-slate-700 rounded-full shadow-lg z-50"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        data-testid="batch-control-toggle"
      >
        <Settings className="w-6 h-6 text-white" />
      </motion.button>
    );
  }

  return (
    <motion.div
      className="fixed bottom-6 right-6 w-96 bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 z-50 overflow-hidden"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      data-testid="batch-control-panel"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4 border-b border-slate-700">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-400" />
            <h3 className="text-white font-semibold">Performance Control</h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white transition-colors"
            data-testid="close-panel-button"
          >
            ×
          </button>
        </div>

        {/* FPS Display */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className={`w-5 h-5 ${getFPSColor(currentFPS)}`} />
            <span className="text-gray-400 text-sm">Current FPS</span>
          </div>
          <span className={`text-2xl font-bold ${getFPSColor(currentFPS)}`}>
            {Math.round(currentFPS)}
          </span>
        </div>
      </div>

      {/* Warnings */}
      <AnimatePresence>
        {warnings.length > 0 && (
          <motion.div
            className="p-3 bg-amber-500/10 border-b border-amber-500/20"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            {warnings.map((warning, index) => (
              <motion.div
                key={warning.timestamp}
                className="flex items-start gap-2 mb-2 last:mb-0"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
              >
                <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-amber-200 text-xs">{warning.message}</p>
                  {warning.recommendedAction && (
                    <p className="text-amber-300/60 text-xs mt-1">
                      {warning.recommendedAction}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => dismissWarning(index)}
                  className="text-amber-400/60 hover:text-amber-400 text-xs"
                >
                  ×
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Batch Controls */}
      <div className="p-4 max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-white text-sm font-semibold">Component Batches</h4>
          <div className="flex gap-2">
            <button
              onClick={handleClearOverrides}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
              data-testid="clear-overrides-button"
            >
              <Unlock className="w-3 h-3" />
              Clear Locks
            </button>
            <button
              onClick={() => setShowCorrelations(!showCorrelations)}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
              data-testid="show-correlations-button"
            >
              <BarChart3 className="w-3 h-3" />
              {showCorrelations ? 'Hide' : 'Show'} Stats
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {batches.map(batch => {
            const correlation = controller.getCorrelation(batch.batch);
            const canToggle = batch.batch !== ComponentBatch.COURTS_ONLY;

            return (
              <motion.div
                key={batch.batch}
                className={`p-3 rounded-lg border transition-colors ${
                  batch.enabled
                    ? 'bg-slate-800/50 border-slate-600'
                    : 'bg-slate-800/20 border-slate-700'
                }`}
                layout
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    {getBatchIcon(batch)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${
                          batch.enabled ? 'text-white' : 'text-gray-500'
                        }`}>
                          {batch.config.description}
                        </span>
                        {batch.manualOverride && (
                          <Lock className="w-3 h-3 text-blue-400" />
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        Est. cost: {batch.config.estimatedCost} FPS
                      </span>
                    </div>
                  </div>

                  {canToggle && (
                    <button
                      onClick={() => handleToggleBatch(batch.batch, !batch.enabled)}
                      disabled={batch.loading}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        batch.enabled
                          ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                          : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                      data-testid={`toggle-batch-${batch.batch}`}
                    >
                      {batch.loading ? 'Loading...' : batch.enabled ? 'Disable' : 'Enable'}
                    </button>
                  )}
                </div>

                {/* Correlation Stats */}
                {showCorrelations && correlation && (
                  <motion.div
                    className="mt-2 pt-2 border-t border-slate-700 text-xs text-gray-400"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="flex justify-between">
                      <span>Avg Impact:</span>
                      <span className={correlation.averageImpact > 0 ? 'text-red-400' : 'text-green-400'}>
                        {correlation.averageImpact > 0 ? '-' : '+'}
                        {Math.abs(Math.round(correlation.averageImpact))} FPS
                      </span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span>Samples:</span>
                      <span>{correlation.sampleCount}</span>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-slate-800/50 border-t border-slate-700">
        <p className="text-xs text-gray-400 text-center">
          Auto-adjust enabled • Monitoring active
        </p>
      </div>
    </motion.div>
  );
};

export default BatchControlPanel;
