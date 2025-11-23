import React, { useMemo } from 'react';
import { Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { PerformanceMetrics } from './types';

interface PerformanceChartProps {
  metrics: PerformanceMetrics;
  baselineMetrics?: PerformanceMetrics;
  height?: number;
}

/**
 * Real-time performance metrics visualization
 */
export const PerformanceChart: React.FC<PerformanceChartProps> = ({
  metrics,
  baselineMetrics,
  height = 120
}) => {
  const { fps, memory, renderTime, frameHistory } = metrics;

  // Calculate FPS trend
  const fpsTrend = useMemo(() => {
    if (frameHistory.length < 10) return 0;
    const recent = frameHistory.slice(-10);
    const older = frameHistory.slice(-20, -10);
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
    return recentAvg - olderAvg;
  }, [frameHistory]);

  // Calculate performance delta vs baseline
  const performanceDelta = useMemo(() => {
    if (!baselineMetrics) return null;
    return {
      fps: fps - baselineMetrics.fps,
      memory: memory - baselineMetrics.memory,
      renderTime: renderTime - baselineMetrics.renderTime
    };
  }, [fps, memory, renderTime, baselineMetrics]);

  const getFPSColor = (value: number) => {
    if (value >= 60) return 'text-green-400';
    if (value >= 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getTrendIcon = (delta: number) => {
    if (delta > 0.5) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (delta < -0.5) return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-slate-400" />;
  };

  // Generate SVG path for FPS history
  const generatePath = () => {
    if (frameHistory.length < 2) return '';

    const maxFPS = 120;
    const width = 100; // percentage
    const points = frameHistory.slice(-60); // Last 60 frames
    const step = width / (points.length - 1);

    return points
      .map((fps, i) => {
        const x = i * step;
        const y = height - (fps / maxFPS) * height;
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  };

  return (
    <div className="space-y-4">
      {/* Main Metrics Grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* FPS Display */}
        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 uppercase tracking-wider">FPS</span>
            {getTrendIcon(fpsTrend)}
          </div>
          <div className={`text-3xl font-bold font-mono ${getFPSColor(fps)}`}>
            {fps}
          </div>
          {performanceDelta && (
            <div className="text-xs mt-1">
              <span className={performanceDelta.fps >= 0 ? 'text-green-400' : 'text-red-400'}>
                {performanceDelta.fps >= 0 ? '+' : ''}{performanceDelta.fps.toFixed(1)} vs baseline
              </span>
            </div>
          )}
        </div>

        {/* Memory Display */}
        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 uppercase tracking-wider">Memory</span>
            <Activity className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-blue-400">
            {memory}
            <span className="text-lg text-slate-400 ml-1">MB</span>
          </div>
          {performanceDelta && (
            <div className="text-xs mt-1">
              <span className={performanceDelta.memory <= 0 ? 'text-green-400' : 'text-red-400'}>
                {performanceDelta.memory >= 0 ? '+' : ''}{performanceDelta.memory.toFixed(1)} MB
              </span>
            </div>
          )}
        </div>

        {/* Render Time Display */}
        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 uppercase tracking-wider">Frame Time</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-purple-400">
            {renderTime.toFixed(1)}
            <span className="text-lg text-slate-400 ml-1">ms</span>
          </div>
          {performanceDelta && (
            <div className="text-xs mt-1">
              <span className={performanceDelta.renderTime <= 0 ? 'text-green-400' : 'text-red-400'}>
                {performanceDelta.renderTime >= 0 ? '+' : ''}{performanceDelta.renderTime.toFixed(1)} ms
              </span>
            </div>
          )}
        </div>
      </div>

      {/* FPS History Graph */}
      <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-slate-400 uppercase tracking-wider">FPS History (60 frames)</span>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <span className="text-slate-400">&lt;30</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
              <span className="text-slate-400">30-60</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-slate-400">&gt;60</span>
            </div>
          </div>
        </div>

        {/* SVG Graph */}
        <div className="relative" style={{ height: `${height}px` }}>
          <svg
            className="w-full h-full"
            viewBox={`0 0 100 ${height}`}
            preserveAspectRatio="none"
          >
            {/* Grid lines */}
            {[0, 30, 60, 90, 120].map((fps) => (
              <line
                key={fps}
                x1="0"
                y1={height - (fps / 120) * height}
                x2="100"
                y2={height - (fps / 120) * height}
                stroke="rgb(51, 65, 85)"
                strokeWidth="0.5"
                strokeDasharray="2,2"
              />
            ))}

            {/* FPS line */}
            {frameHistory.length > 1 && (
              <path
                d={generatePath()}
                fill="none"
                stroke="rgb(34, 197, 94)"
                strokeWidth="2"
                className="transition-all duration-100"
              />
            )}

            {/* Performance thresholds */}
            <line
              x1="0"
              y1={height - (60 / 120) * height}
              x2="100"
              y2={height - (60 / 120) * height}
              stroke="rgb(34, 197, 94)"
              strokeWidth="1"
              opacity="0.3"
            />
            <line
              x1="0"
              y1={height - (30 / 120) * height}
              x2="100"
              y2={height - (30 / 120) * height}
              stroke="rgb(234, 179, 8)"
              strokeWidth="1"
              opacity="0.3"
            />
          </svg>

          {/* Y-axis labels */}
          <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-between text-xs text-slate-500 pointer-events-none pr-2">
            <span>120</span>
            <span>90</span>
            <span>60</span>
            <span>30</span>
            <span>0</span>
          </div>
        </div>
      </div>
    </div>
  );
};
