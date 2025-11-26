import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Bug,
  X,
  Minimize2,
  Maximize2,
  Download,
  RotateCcw,
  Power,
  PowerOff,
  Move,
  Info
} from 'lucide-react';
import { AssetToggle } from './AssetToggle';
import { PerformanceChart } from './PerformanceChart';
import { PresetSelector } from './PresetSelector';
import type {
  Asset3D,
  PerformanceMetrics,
  PerAssetMetrics,
  DebugPreset,
  PerformanceReport,
} from './types';
import { DEFAULT_PRESETS } from './types';
import { ShadowQuality } from '../../types';

interface DebugPanelProps {
  assets?: Asset3D[];
  onAssetToggle?: (assetId: string, enabled: boolean) => void;
  onPresetApply?: (presetId: string) => void;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  shadowQuality?: ShadowQuality;
  onShadowQualityChange?: (quality: ShadowQuality) => void;
}

/**
 * Comprehensive 3D Performance Debug Panel
 *
 * Features:
 * - Draggable & resizable panel
 * - Asset enable/disable controls
 * - Real-time performance metrics
 * - FPS history graph
 * - Preset configurations
 * - Performance report export
 * - Keyboard shortcuts
 */
const DebugPanel: React.FC<DebugPanelProps> = ({
  assets = [],
  onAssetToggle,
  onPresetApply,
  initialPosition = { x: window.innerWidth - 520, y: window.innerHeight - 600 },
  initialSize = { width: 500, height: 580 },
  shadowQuality = 'high',
  onShadowQualityChange
}) => {
  // Panel state
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);

  // Asset management
  const [internalAssets, setInternalAssets] = useState<Asset3D[]>(assets);
  const [presets, setPresets] = useState<DebugPreset[]>(
    DEFAULT_PRESETS as unknown as DebugPreset[]
  );
  const [currentPreset, setCurrentPreset] = useState<string>('production');

  // Performance tracking
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memory: 0,
    renderTime: 0,
    frameHistory: [],
    timestamp: Date.now()
  });
  const [baselineMetrics, setBaselineMetrics] = useState<PerformanceMetrics | undefined>();
  const [perAssetMetrics, setPerAssetMetrics] = useState<PerAssetMetrics>({});

  // Refs
  const panelRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const isResizingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const frameCountRef = useRef(0);
  const lastFrameTimeRef = useRef(performance.now());

  /**
   * Performance monitoring loop
   */
  useEffect(() => {
    let animationFrameId: number;
    let fpsInterval: NodeJS.Timeout;

    const trackFrame = () => {
      const now = performance.now();
      const delta = now - lastFrameTimeRef.current;

      frameCountRef.current++;
      lastFrameTimeRef.current = now;

      setMetrics(prev => ({
        ...prev,
        renderTime: delta,
        frameHistory: [...prev.frameHistory.slice(-59), prev.fps] // Keep last 60
      }));

      animationFrameId = requestAnimationFrame(trackFrame);
    };

    // FPS calculation (every second)
    fpsInterval = setInterval(() => {
      const fps = frameCountRef.current;
      frameCountRef.current = 0;

      const memory = (performance as any).memory?.usedJSHeapSize
        ? Math.round((performance as any).memory.usedJSHeapSize / 1048576)
        : 0;

      setMetrics(prev => ({
        ...prev,
        fps,
        memory,
        timestamp: Date.now()
      }));
    }, 1000);

    animationFrameId = requestAnimationFrame(trackFrame);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(fpsInterval);
    };
  }, []);

  /**
   * Keyboard shortcuts
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+D: Toggle panel
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setIsVisible(prev => !prev);
      }
      // Ctrl+Shift+A: Enable all
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        handleEnableAll();
      }
      // Ctrl+Shift+N: Disable all
      if (e.ctrlKey && e.shiftKey && e.key === 'N') {
        e.preventDefault();
        handleDisableAll();
      }
      // Ctrl+Shift+R: Reset
      if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        handleReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [internalAssets]);

  /**
   * Drag functionality
   */
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.no-drag')) return;

    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        setPosition({
          x: e.clientX - dragStartRef.current.x,
          y: e.clientY - dragStartRef.current.y
        });
      }
      if (isResizingRef.current) {
        setSize({
          width: Math.max(400, e.clientX - position.x),
          height: Math.max(400, e.clientY - position.y)
        });
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      isResizingRef.current = false;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [position]);

  /**
   * Asset toggle handler
   */
  const handleAssetToggle = useCallback((assetId: string, enabled: boolean) => {
    setInternalAssets(prev =>
      prev.map(asset =>
        asset.id === assetId ? { ...asset, enabled } : asset
      )
    );
    onAssetToggle?.(assetId, enabled);
  }, [onAssetToggle]);

  /**
   * Bulk actions
   */
  const handleEnableAll = () => {
    setInternalAssets(prev => prev.map(asset => ({ ...asset, enabled: true })));
  };

  const handleDisableAll = () => {
    setInternalAssets(prev => prev.map(asset => ({ ...asset, enabled: false })));
  };

  const handleReset = () => {
    setInternalAssets(assets);
    setMetrics(prev => ({ ...prev, frameHistory: [] }));
    setBaselineMetrics(undefined);
  };

  /**
   * Preset management
   */
  const handlePresetSelect = (presetId: string) => {
    const preset = presets.find(p => p.id === presetId);
    if (!preset) return;

    setCurrentPreset(presetId);

    // Apply preset asset states
    if (Object.keys(preset.assetStates).length > 0) {
      setInternalAssets(prev =>
        prev.map(asset => ({
          ...asset,
          enabled: preset.assetStates[asset.id] ?? asset.enabled
        }))
      );
    }

    // Special preset behaviors
    if (presetId === 'baseline') {
      handleDisableAll();
      setBaselineMetrics(metrics);
    } else if (presetId === 'production') {
      handleEnableAll();
    }

    onPresetApply?.(presetId);
  };

  const handlePresetSave = (name: string, description: string) => {
    const newPreset: DebugPreset = {
      id: `custom_${Date.now()}`,
      name,
      description,
      assetStates: Object.fromEntries(
        internalAssets.map(asset => [asset.id, asset.enabled])
      )
    };
    setPresets(prev => [...prev, newPreset]);
  };

  const handlePresetDelete = (presetId: string) => {
    setPresets(prev => prev.filter(p => p.id !== presetId));
  };

  /**
   * Export performance report
   */
  const handleExportReport = () => {
    const report: PerformanceReport = {
      timestamp: new Date().toISOString(),
      duration: Math.round((Date.now() - metrics.timestamp) / 1000),
      metrics: {
        avgFps: Math.round(
          metrics.frameHistory.reduce((a, b) => a + b, 0) / metrics.frameHistory.length
        ),
        minFps: Math.min(...metrics.frameHistory),
        maxFps: Math.max(...metrics.frameHistory),
        avgMemory: metrics.memory,
        peakMemory: metrics.memory // Could track peak over time
      },
      assets: perAssetMetrics,
      presetUsed: currentPreset
    };

    // Export as JSON
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-report-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Sync external assets
  useEffect(() => {
    setInternalAssets(assets);
  }, [assets]);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-6 right-6 z-[9999] bg-slate-800 hover:bg-slate-700 text-white p-4 rounded-full shadow-lg border border-slate-600 transition-all"
        title="Toggle Debug Panel (Ctrl+Shift+D)"
      >
        <Bug className="w-6 h-6" />
      </button>
    );
  }

  if (isMinimized) {
    return (
      <div
        className="fixed bottom-6 right-6 z-[9999] bg-slate-900/95 backdrop-blur-md rounded-lg border border-slate-700 shadow-xl"
        style={{ width: '280px' }}
      >
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <Bug className="w-4 h-4 text-purple-400" />
            <span className="text-white font-bold text-sm">3D Performance Debugger</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(false)}
              className="p-1 hover:bg-slate-800 rounded transition-colors"
              title="Maximize"
            >
              <Maximize2 className="w-4 h-4 text-slate-400" />
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-slate-800 rounded transition-colors"
              title="Close"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
        <div className="px-3 pb-3 flex items-center justify-between text-sm">
          <span className="text-slate-400">FPS:</span>
          <span className={`font-mono font-bold ${metrics.fps >= 60 ? 'text-green-400' :
            metrics.fps >= 30 ? 'text-yellow-400' :
              'text-red-400'
            }`}>
            {metrics.fps}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={panelRef}
      className="fixed z-[9999] bg-slate-900/95 backdrop-blur-md rounded-lg border border-slate-700 shadow-2xl flex flex-col"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`
      }}
    >
      {/* Header - Draggable */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-slate-700 cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <Bug className="w-5 h-5 text-purple-400" />
          <div>
            <h2 className="text-white font-bold text-sm">3D Performance Debugger</h2>
            <p className="text-xs text-slate-400">
              {internalAssets.filter(a => a.enabled).length}/{internalAssets.length} assets enabled
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 no-drag">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 hover:bg-slate-800 rounded transition-colors"
            title="Minimize"
          >
            <Minimize2 className="w-4 h-4 text-slate-400" />
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1.5 hover:bg-slate-800 rounded transition-colors"
            title="Close (Ctrl+Shift+D)"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-drag">
        {/* Performance Metrics */}
        <PerformanceChart
          metrics={metrics}
          baselineMetrics={baselineMetrics}
        />

        {/* Preset Selector */}
        <PresetSelector
          presets={presets}
          currentPreset={currentPreset}
          onPresetSelect={handlePresetSelect}
          onPresetSave={handlePresetSave}
          onPresetDelete={handlePresetDelete}
        />

        {/* Rendering Settings */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Rendering Settings
          </h3>
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-300">Shadow Quality</span>
              </div>
              <select
                value={shadowQuality}
                onChange={(e) => onShadowQualityChange?.(e.target.value as ShadowQuality)}
                className="bg-slate-900 border border-slate-600 text-white text-sm rounded px-2 py-1 focus:outline-none focus:border-blue-500"
              >
                <option value="low">Low (Fastest)</option>
                <option value="medium">Medium (Balanced)</option>
                <option value="high">High (Best Quality)</option>
              </select>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Adjusts shadow map resolution and soft shadow quality. Lower settings improve performance significantly.
            </p>
          </div>
        </div>

        {/* Asset Controls */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Asset Controls
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handleEnableAll}
                className="flex items-center gap-1 px-2 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 text-xs rounded border border-green-500/30 transition-colors"
                title="Enable All (Ctrl+Shift+A)"
              >
                <Power className="w-3 h-3" />
                All On
              </button>
              <button
                onClick={handleDisableAll}
                className="flex items-center gap-1 px-2 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs rounded border border-red-500/30 transition-colors"
                title="Disable All (Ctrl+Shift+N)"
              >
                <PowerOff className="w-3 h-3" />
                All Off
              </button>
            </div>
          </div>

          {/* Asset List */}
          <div className="space-y-2">
            {internalAssets.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No assets registered</p>
                <p className="text-xs mt-1">Assets will appear here when added</p>
              </div>
            ) : (
              internalAssets.map(asset => (
                <AssetToggle
                  key={asset.id}
                  asset={asset}
                  onToggle={handleAssetToggle}
                />
              ))
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-slate-700">
          <button
            onClick={handleExportReport}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-sm font-medium rounded border border-blue-500/30 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <button
            onClick={handleReset}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded border border-slate-600 transition-colors"
            title="Reset (Ctrl+Shift+R)"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        {/* Keyboard Shortcuts Help */}
        <div className="text-xs text-slate-500 space-y-1 pt-2 border-t border-slate-800">
          <p className="font-bold text-slate-400 mb-2">Keyboard Shortcuts:</p>
          <p><kbd className="bg-slate-800 px-1 rounded">Ctrl+Shift+D</kbd> Toggle Panel</p>
          <p><kbd className="bg-slate-800 px-1 rounded">Ctrl+Shift+A</kbd> Enable All</p>
          <p><kbd className="bg-slate-800 px-1 rounded">Ctrl+Shift+N</kbd> Disable All</p>
          <p><kbd className="bg-slate-800 px-1 rounded">Ctrl+Shift+R</kbd> Reset</p>
        </div>
      </div>

      {/* Resize Handle */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
        onMouseDown={(e) => {
          e.preventDefault();
          isResizingRef.current = true;
        }}
      >
        <Move className="w-3 h-3 text-slate-600 absolute bottom-0.5 right-0.5" />
      </div>
    </div>
  );
};

export default DebugPanel;
