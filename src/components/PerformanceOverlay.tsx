import React, { useState } from 'react';
import { Settings, Eye, EyeOff } from 'lucide-react';
import { ShadowQuality } from '../types';

interface PerformanceOverlayProps {
  performanceMode?: 'high' | 'medium' | 'low';
  onPerformanceModeChange?: (mode: 'high' | 'medium' | 'low') => void;
  shadowQuality?: ShadowQuality;
  onShadowQualityChange?: (quality: ShadowQuality) => void;
}

/**
 * PerformanceOverlay Component
 *
 * Provides performance controls overlay for quality and shadow settings.
 * FPS monitoring is handled separately by FPSMonitor component.
 *
 * Features:
 * - Performance mode selector (high/medium/low)
 * - Shadow quality controls
 * - Compact, non-intrusive design
 */
const PerformanceOverlay: React.FC<PerformanceOverlayProps> = ({
  performanceMode = 'high',
  onPerformanceModeChange,
  shadowQuality = 'high',
  onShadowQualityChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  /**
   * Get performance mode description
   */
  const getPerformanceModeDescription = (mode: 'high' | 'medium' | 'low'): string => {
    switch (mode) {
      case 'high':
        return 'All effects, shadows, high quality';
      case 'medium':
        return 'Balanced quality and performance';
      case 'low':
        return 'Maximum FPS, reduced effects';
      default:
        return '';
    }
  };

  return (
    <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 pointer-events-none">
      {/* Performance Controls */}
      <div className="bg-slate-900/90 backdrop-blur-md rounded-xl border border-white/10 pointer-events-auto shadow-2xl overflow-hidden">
        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-white/60" />
            <span className="text-xs font-bold text-white/80 uppercase tracking-wider">
              Performance
            </span>
          </div>
          {isExpanded ? (
            <EyeOff className="w-3 h-3 text-white/60" />
          ) : (
            <Eye className="w-3 h-3 text-white/60" />
          )}
        </button>

        {/* Expanded Controls */}
        {isExpanded && (
          <div className="border-t border-white/10 p-3 space-y-4">
            {/* Performance Mode Selector */}
            {onPerformanceModeChange && (
              <div className="space-y-2">
                <div className="text-xs font-bold text-white/60 uppercase tracking-wider">
                  Quality Mode
                </div>
                <div className="flex gap-1">
                  {(['low', 'medium', 'high'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => onPerformanceModeChange(mode)}
                      className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                        performanceMode === mode
                          ? 'bg-tennis-yellow text-tennis-dark shadow-lg'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-white/50 leading-relaxed">
                  {getPerformanceModeDescription(performanceMode)}
                </p>
              </div>
            )}

            {/* Shadow Quality */}
            {onShadowQualityChange && (
              <div className="space-y-2">
                <div className="text-xs font-bold text-white/60 uppercase tracking-wider">
                  Shadow Quality
                </div>
                <select
                  value={shadowQuality}
                  onChange={(e) => onShadowQualityChange(e.target.value as ShadowQuality)}
                  className="w-full bg-slate-950/50 border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-tennis-yellow transition-colors"
                >
                  <option value="low">Low (Fastest)</option>
                  <option value="medium">Medium (Balanced)</option>
                  <option value="high">High (Best Quality)</option>
                </select>
                <p className="text-xs text-white/50 leading-relaxed">
                  Adjusts shadow resolution. Lower settings significantly improve FPS.
                </p>
              </div>
            )}

            {/* Performance Hint */}
            <div className="pt-2 border-t border-white/5 space-y-2">
              <div className="flex items-start gap-2">
                <div className="text-xs text-white/40 leading-relaxed">
                  <span className="font-bold text-white/60">Tip:</span> Use Low/Medium for laptops or
                  when FPS drops below 30.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="text-xs text-white/40 leading-relaxed">
                  <span className="font-bold text-yellow-400/80">VSync Note:</span> Browser FPS is capped by VSync (~60-144Hz).
                  To disable: <code className="bg-black/30 px-1 rounded text-[10px]">chrome://flags → Disable VSync</code>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceOverlay;
