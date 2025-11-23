import React from 'react';
import { Power, AlertTriangle, GitBranch } from 'lucide-react';
import type { Asset3D } from './types';

interface AssetToggleProps {
  asset: Asset3D;
  onToggle: (assetId: string, enabled: boolean) => void;
  disabled?: boolean;
}

/**
 * Individual asset toggle control with performance indicators
 */
export const AssetToggle: React.FC<AssetToggleProps> = ({
  asset,
  onToggle,
  disabled = false
}) => {
  const getCostColor = (cost: Asset3D['performanceCost']) => {
    switch (cost) {
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
  };

  const getCostBadge = (cost: Asset3D['performanceCost']) => {
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full border ${getCostColor(cost)} font-medium`}>
        {cost.toUpperCase()}
      </span>
    );
  };

  return (
    <div
      className={`
        group relative flex items-center justify-between p-3 rounded-lg border
        transition-all duration-200
        ${asset.enabled
          ? 'bg-slate-800/50 border-green-500/30 hover:bg-slate-800/70'
          : 'bg-slate-900/30 border-slate-700/50 hover:bg-slate-900/50'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      onClick={() => !disabled && onToggle(asset.id, !asset.enabled)}
    >
      <div className="flex items-center gap-3 flex-1">
        {/* Toggle Switch */}
        <button
          className={`
            relative w-11 h-6 rounded-full transition-colors duration-200
            ${asset.enabled ? 'bg-green-500' : 'bg-slate-600'}
            ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
          `}
          onClick={(e) => {
            e.stopPropagation();
            if (!disabled) onToggle(asset.id, !asset.enabled);
          }}
          disabled={disabled}
        >
          <span
            className={`
              absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white
              transition-transform duration-200
              ${asset.enabled ? 'translate-x-5' : 'translate-x-0'}
            `}
          />
        </button>

        {/* Asset Name & Status */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Power
              className={`w-4 h-4 ${asset.enabled ? 'text-green-400' : 'text-slate-500'}`}
            />
            <span className={`font-medium ${asset.enabled ? 'text-white' : 'text-slate-400'}`}>
              {asset.name}
            </span>
          </div>

          {/* Dependencies */}
          {asset.dependencies.length > 0 && (
            <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
              <GitBranch className="w-3 h-3" />
              <span>Depends on: {asset.dependencies.join(', ')}</span>
            </div>
          )}
        </div>

        {/* Performance Cost Badge */}
        <div className="flex items-center gap-2">
          {getCostBadge(asset.performanceCost)}
        </div>
      </div>

      {/* Performance Metrics (when enabled) */}
      {asset.enabled && asset.renderTime !== undefined && (
        <div className="absolute right-3 top-full mt-1 bg-slate-900/95 border border-slate-700 rounded-lg p-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="text-xs space-y-1 whitespace-nowrap">
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Render:</span>
              <span className="text-white font-mono">{asset.renderTime.toFixed(2)}ms</span>
            </div>
            {asset.memoryUsage !== undefined && (
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">Memory:</span>
                <span className="text-white font-mono">{asset.memoryUsage.toFixed(1)}MB</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Warning for high-cost assets */}
      {asset.performanceCost === 'high' && asset.enabled && (
        <div className="absolute -top-1 -right-1">
          <AlertTriangle className="w-4 h-4 text-orange-400" />
        </div>
      )}
    </div>
  );
};
