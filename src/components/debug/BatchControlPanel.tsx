/**
 * Enhanced Batch Control Panel with Tier System
 *
 * UI component for monitoring FPS and controlling component loading tiers.
 * Provides both automatic FPS-based management and manual override controls.
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
  Unlock,
  Layers,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Gauge
} from 'lucide-react';
import { ComponentTier, componentBatchManager, COMPONENT_DEFINITIONS } from '../../services/batch-loading/ComponentBatchManager';
import { fpsBatchController } from '../../services/fps/FPSBatchController';
import { useTierControl, useComponentControl } from '../../hooks/useComponentEnabled';

interface BatchControlPanelProps {
  onClose?: () => void;
  initiallyOpen?: boolean;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

interface TierPanelProps {
  tier: ComponentTier;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const TierPanel: React.FC<TierPanelProps> = ({ tier, isExpanded, onToggleExpand }) => {
  const { enabled, partial, loading, stats, toggle } = useTierControl(tier);
  const tierConfig = componentBatchManager.getTierStats(tier);

  const tierNames = ['Essential', 'Core', 'Visual', 'Enhanced'];
  const tierColors = ['gray', 'blue', 'green', 'purple'];
  const tierIcons = [
    <Eye key="essential" className="w-4 h-4" />,
    <Layers key="core" className="w-4 h-4" />,
    <Zap key="visual" className="w-4 h-4" />,
    <Activity key="enhanced" className="w-4 h-4" />
  ];

  const color = tierColors[tier];
  const components = COMPONENT_DEFINITIONS.filter(c => c.tier === tier);

  return (
    <motion.div
      className={`border rounded-lg overflow-hidden transition-all ${
        enabled ? `bg-${color}-500/10 border-${color}-500/50` : 'bg-slate-800/30 border-slate-700'
      }`}
      layout
    >
      {/* Tier Header */}
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <button
            onClick={onToggleExpand}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          {tierIcons[tier]}

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className={`font-semibold ${enabled ? 'text-white' : 'text-gray-500'}`}>
                Tier {tier}: {tierNames[tier]}
              </span>
              {partial && !enabled && (
                <span className="text-xs text-amber-400">Partial</span>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>{stats.enabled}/{stats.total} components</span>
              <span>~{stats.estimatedCost} FPS</span>
              {tier > 0 && (
                <span className="text-gray-600">Min FPS: {tier === 1 ? 45 : tier === 2 ? 50 : 55}</span>
              )}
            </div>
          </div>
        </div>

        {/* Tier Toggle */}
        {tier > 0 && (
          <button
            onClick={toggle}
            disabled={loading}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              enabled
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? 'Loading...' : enabled ? 'Disable' : 'Enable'}
          </button>
        )}
      </div>

      {/* Component List (Expandable) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="px-3 pb-3 space-y-1"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {components.map(comp => (
              <ComponentRow key={comp.id} componentId={comp.id} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ComponentRow: React.FC<{ componentId: string }> = ({ componentId }) => {
  const { enabled, loading, toggle } = useComponentControl(componentId);
  const definition = COMPONENT_DEFINITIONS.find(c => c.id === componentId);

  if (!definition) return null;

  const categoryIcons = {
    court: '🎾',
    building: '🏢',
    nature: '🌳',
    effect: '✨',
    system: '⚙️',
    mechanical: '🔧'
  };

  return (
    <div className={`flex items-center justify-between p-2 rounded ${
      enabled ? 'bg-slate-700/30' : 'bg-slate-800/30'
    }`}>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-xs">{categoryIcons[definition.category]}</span>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-white truncate">
            {definition.displayName}
          </div>
          <div className="text-xs text-gray-500">
            {definition.estimatedCost} FPS
          </div>
        </div>
        {enabled ? (
          <EyeOff
            className="w-3 h-3 text-gray-500 cursor-pointer hover:text-red-400"
            onClick={toggle}
          />
        ) : (
          <Eye
            className="w-3 h-3 text-gray-500 cursor-pointer hover:text-green-400"
            onClick={toggle}
          />
        )}
      </div>
    </div>
  );
};

export const BatchControlPanel: React.FC<BatchControlPanelProps> = ({
  onClose,
  initiallyOpen = false,
  position = 'bottom-right'
}) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const [currentFPS, setCurrentFPS] = useState(60);
  const [expandedTiers, setExpandedTiers] = useState<Set<ComponentTier>>(new Set());
  const [warnings, setWarnings] = useState<string[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  // Start/stop FPS monitoring
  useEffect(() => {
    if (isMonitoring) {
      fpsBatchController.start();
    } else {
      fpsBatchController.stop();
    }

    return () => {
      fpsBatchController.stop();
    };
  }, [isMonitoring]);

  // Update FPS display
  useEffect(() => {
    const interval = setInterval(() => {
      const fps = fpsBatchController.getFPSMonitor().getCurrentFPS();
      setCurrentFPS(fps);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Listen for warnings
  useEffect(() => {
    const unsubscribe = fpsBatchController.onWarning((warning) => {
      setWarnings(prev => [...prev, warning.message].slice(-3));
    });

    return unsubscribe;
  }, []);

  const toggleTierExpand = (tier: ComponentTier) => {
    setExpandedTiers(prev => {
      const next = new Set(prev);
      if (next.has(tier)) {
        next.delete(tier);
      } else {
        next.add(tier);
      }
      return next;
    });
  };

  const handleAutoAdjust = useCallback(async () => {
    await componentBatchManager.autoAdjustForFPS(currentFPS);
  }, [currentFPS]);

  const getFPSColor = (fps: number): string => {
    if (fps >= 55) return 'text-green-400';
    if (fps >= 50) return 'text-blue-400';
    if (fps >= 45) return 'text-amber-400';
    if (fps >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getFPSStatus = (fps: number): string => {
    if (fps >= 55) return 'Excellent';
    if (fps >= 50) return 'Good';
    if (fps >= 45) return 'Fair';
    if (fps >= 40) return 'Low';
    if (fps >= 25) return 'Poor';
    return 'Critical';
  };

  // Position classes
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  if (!isOpen) {
    return (
      <motion.button
        className={`fixed ${positionClasses[position]} p-4 bg-slate-800 hover:bg-slate-700 rounded-full shadow-lg z-50`}
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
      className={`fixed ${positionClasses[position]} w-96 bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 z-50 overflow-hidden`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      data-testid="batch-control-panel"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4 border-b border-slate-700">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <h3 className="text-white font-semibold">Component Loading</h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white transition-colors text-xl"
            data-testid="close-panel-button"
          >
            ×
          </button>
        </div>

        {/* FPS Display */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Gauge className={`w-5 h-5 ${getFPSColor(currentFPS)}`} />
              <span className="text-gray-400 text-sm">Performance</span>
            </div>
            <div className="text-right">
              <span className={`text-2xl font-bold ${getFPSColor(currentFPS)}`}>
                {Math.round(currentFPS)}
              </span>
              <span className="text-gray-500 text-xs ml-1">FPS</span>
            </div>
          </div>

          {/* FPS Bar */}
          <div className="bg-slate-800 rounded-full h-2 overflow-hidden">
            <motion.div
              className={`h-full ${
                currentFPS >= 55 ? 'bg-green-400' :
                currentFPS >= 50 ? 'bg-blue-400' :
                currentFPS >= 45 ? 'bg-amber-400' :
                currentFPS >= 40 ? 'bg-orange-400' : 'bg-red-400'
              }`}
              initial={{ width: '0%' }}
              animate={{ width: `${Math.min(100, (currentFPS / 60) * 100)}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="flex justify-between items-center mt-1">
            <span className={`text-xs ${getFPSColor(currentFPS)}`}>
              {getFPSStatus(currentFPS)}
            </span>
            <button
              onClick={() => setIsMonitoring(!isMonitoring)}
              className={`text-xs px-2 py-0.5 rounded ${
                isMonitoring
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-gray-500/20 text-gray-400'
              }`}
            >
              {isMonitoring ? 'Monitoring Active' : 'Monitoring Paused'}
            </button>
          </div>
        </div>
      </div>

      {/* Warnings */}
      <AnimatePresence>
        {warnings.length > 0 && (
          <motion.div
            className="p-2 bg-amber-500/10 border-b border-amber-500/20"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            {warnings.map((warning, index) => (
              <div key={index} className="flex items-start gap-2 text-xs text-amber-300 mb-1 last:mb-0">
                <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>{warning}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tier Controls */}
      <div className="p-4 max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-white text-sm font-semibold">Component Tiers</h4>
          <button
            onClick={handleAutoAdjust}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
            data-testid="auto-adjust-button"
          >
            <Activity className="w-3 h-3" />
            Auto-Adjust
          </button>
        </div>

        <div className="space-y-2">
          {[0, 1, 2, 3].map(tier => (
            <TierPanel
              key={tier}
              tier={tier as ComponentTier}
              isExpanded={expandedTiers.has(tier as ComponentTier)}
              onToggleExpand={() => toggleTierExpand(tier as ComponentTier)}
            />
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-slate-800/50 border-t border-slate-700">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-400">
            {componentBatchManager.getEnabledComponents().length} / {COMPONENT_DEFINITIONS.length} components active
          </span>
          <span className="text-gray-400">
            Est. total: {COMPONENT_DEFINITIONS
              .filter(c => componentBatchManager.isComponentEnabled(c.id))
              .reduce((sum, c) => sum + c.estimatedCost, 0)} FPS
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default BatchControlPanel;