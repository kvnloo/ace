import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Minimize2,
  Maximize2,
} from 'lucide-react';
import { getPerformanceTracker } from '../../utils/debug/performanceTracker';

// Copied from LoadingScreen.tsx
interface FPSData {
  current: number;
  average: number;
  min: number;
  max: number;
  history: number[];
}

type FPSLevel = 'excellent' | 'good' | 'fair' | 'poor';

interface FPSMonitorProps {
  showFPSMonitor?: boolean;
  mode?: 'embedded' | 'overlay' | 'transitioning';
  onTransitionComplete?: () => void;
  onFpsLevelChange?: (level: FPSLevel) => void;
  className?: string;
}

const FPSMonitor: React.FC<FPSMonitorProps> = ({
  showFPSMonitor = true,
  mode = 'embedded',
  onTransitionComplete,
  onFpsLevelChange,
  className = ''
}) => {
  // State copied from LoadingScreen
  const [fpsData, setFpsData] = useState<FPSData>({
    current: 0,
    average: 0,
    min: 0,
    max: 0,
    history: [],
  });
  const [fpsLevel, setFpsLevel] = useState<FPSLevel>('excellent');
  const isPortalMode = mode === 'overlay' || mode === 'transitioning';
  const [isMinimized, setIsMinimized] = useState(false);

  const elementRef = useRef<HTMLDivElement>(null);

  // Toggle minimize state
  const toggleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(!isMinimized);
  };

  // FPS Monitoring using global PerformanceTracker
  useEffect(() => {
    if (!showFPSMonitor) return;

    const tracker = getPerformanceTracker();
    let animationFrameId: number;

    const updateFPS = () => {
      const fps = tracker.trackFPS();
      const avgFPS = tracker.getAverageFPS(5); // 5 second average

      setFpsData((prev) => {
        const newHistory = [...prev.history, fps].slice(-30);
        const min = Math.min(...newHistory);
        const max = Math.max(...newHistory);

        return {
          current: fps,
          average: avgFPS,
          min,
          max,
          history: newHistory,
        };
      });

      const level: FPSLevel =
        fps >= 55
          ? 'excellent'
          : fps >= 40
            ? 'good'
            : fps >= 25
              ? 'fair'
              : 'poor';

      // Update FPS level state
      setFpsLevel(level);

      animationFrameId = requestAnimationFrame(updateFPS);
    };

    animationFrameId = requestAnimationFrame(updateFPS);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [showFPSMonitor]);

  // Notify parent of FPS level changes (in separate effect to avoid setState during render)
  const prevFpsLevelRef = useRef<FPSLevel | null>(null);
  useEffect(() => {
    if (onFpsLevelChange && fpsLevel !== prevFpsLevelRef.current) {
      prevFpsLevelRef.current = fpsLevel;
      onFpsLevelChange(fpsLevel);
    }
  }, [fpsLevel, onFpsLevelChange]);

  // Helper functions copied from LoadingScreen
  const getFPSColor = useCallback((level: FPSLevel) => {
    const colors = {
      excellent: '#10b981',
      good: '#3b82f6',
      fair: '#f59e0b',
      poor: '#ef4444',
    };
    return colors[level];
  }, []);

  const getFPSIcon = useCallback((level: FPSLevel) => {
    const icons = {
      excellent: Sparkles,
      good: TrendingUp,
      fair: AlertTriangle,
      poor: AlertTriangle,
    };
    const Icon = icons[level];
    return <Icon className="w-6 h-6" />;
  }, []);

  if (!showFPSMonitor) return null;

  // Render FPS Monitor - with Portal support for overlay/transitioning
  const monitorContent = (
    <motion.div
      layoutId="fps-monitor-shared"
      ref={elementRef}
      className={`${className} ${isPortalMode ? 'fixed bottom-24 right-6 z-50' : ''}`}
      data-testid="fps-meter"
      layout
      transition={{
        layout: {
          type: "spring",
          stiffness: 200,
          damping: 25,
          duration: 0.8
        },
        scale: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        opacity: { duration: 0.4 }
      }}
      initial={mode === 'transitioning' ? {
        scale: 1,
        opacity: 1
      } : undefined}
      animate={
        mode === 'transitioning'
          ? {
            scale: 0.7, // Shrink as it moves to corner
            opacity: 1,
          }
          : mode === 'overlay'
            ? {
              scale: 1,
              opacity: 1
            }
            : {
              scale: 1,
              opacity: 1
            }
      }
      style={isPortalMode ? { pointerEvents: 'auto', willChange: 'transform' } : undefined}
    >
      {mode === 'embedded' ? (
        // Embedded mode - original layout from LoadingScreen
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-xl fps-${fpsLevel}`}
                style={{ color: getFPSColor(fpsLevel) }}
              >
                {getFPSIcon(fpsLevel)}
              </div>
              <div>
                <div className="text-white font-['Inter'] font-semibold">
                  Performance
                </div>
                <div className="text-xs text-gray-200 font-['Inter']">
                  {fpsLevel === 'excellent'
                    ? 'Excellent'
                    : fpsLevel === 'good'
                      ? 'Good'
                      : fpsLevel === 'fair'
                        ? 'Fair'
                        : 'Poor'}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div
                className="text-5xl font-bold font-['JetBrains_Mono']"
                style={{ color: getFPSColor(fpsLevel) }}
                data-testid="fps-value"
              >
                {fpsData.current}
              </div>
              <div className="text-xs text-gray-200 font-['Inter']">
                FPS
              </div>
            </div>
          </div>

          {/* FPS Statistics Row */}
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="bg-white/5 rounded-lg py-1.5 px-2">
              <div className="text-lg font-bold font-['JetBrains_Mono'] text-blue-400">{fpsData.average}</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider">Avg</div>
            </div>
            <div className="bg-white/5 rounded-lg py-1.5 px-2">
              <div className="text-lg font-bold font-['JetBrains_Mono'] text-red-400">{fpsData.min || '--'}</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider">Min</div>
            </div>
            <div className="bg-white/5 rounded-lg py-1.5 px-2">
              <div className="text-lg font-bold font-['JetBrains_Mono'] text-green-400">{fpsData.max || '--'}</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider">Max</div>
            </div>
          </div>

          {/* Mini FPS Graph */}
          <div className="mt-4 h-16 flex items-end gap-1 justify-start">
            {fpsData.history.map((fps, index) => {
              const maxFps = Math.max(...fpsData.history, 1);
              const heightPercentage = (fps / maxFps) * 100;
              return (
                <motion.div
                  key={index}
                  className="rounded-t"
                  style={{
                    width: '8px',
                    minWidth: '8px',
                    height: `${heightPercentage}%`,
                    maxHeight: '100%',
                    backgroundColor: getFPSColor(
                      fps >= 55
                        ? 'excellent'
                        : fps >= 40
                          ? 'good'
                          : fps >= 25
                            ? 'fair'
                            : 'poor'
                    ),
                    opacity: 0.3 + (index / fpsData.history.length) * 0.7,
                  }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.3 }}
                />
              );
            })}
          </div>
        </>
      ) : (
        // Overlay mode - compact floating design
        <motion.div
          className={`glass-card rounded-2xl ${isMinimized ? 'p-2' : 'p-4'} min-w-[${isMinimized ? 'auto' : '200px'}] transition-all duration-300`}
          initial={mode === 'transitioning' ? { scale: 1, opacity: 1 } : undefined}
          animate={
            mode === 'transitioning'
              ? {
                scale: 0.8,
                opacity: 1,
              }
              : mode === 'overlay'
                ? {
                  scale: 1,
                  opacity: 1,
                }
                : {}
          }
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          onAnimationComplete={() => {
            if (mode === 'transitioning') {
              console.log('[FPSMonitor] Transition animation complete');
              onTransitionComplete?.();
            }
          }}
        >
          {isMinimized ? (
            // Minimized View
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={toggleMinimize}
            >
              <div
                className="p-1.5 rounded-lg"
                style={{
                  backgroundColor: getFPSColor(fpsLevel) + '20',
                  color: getFPSColor(fpsLevel)
                }}
              >
                {getFPSIcon(fpsLevel)}
              </div>
              <div
                className="text-lg font-bold font-['JetBrains_Mono']"
                style={{ color: getFPSColor(fpsLevel) }}
              >
                {fpsData.current}
              </div>
            </div>
          ) : (
            // Expanded View
            <>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className="p-2 rounded-lg"
                    style={{
                      backgroundColor: getFPSColor(fpsLevel) + '20',
                      color: getFPSColor(fpsLevel)
                    }}
                  >
                    {getFPSIcon(fpsLevel)}
                  </div>

                  {/* Minimize Button */}
                  <button
                    onClick={toggleMinimize}
                    className="p-1 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <Minimize2 className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                <div className="text-right">
                  <div
                    className="text-3xl font-bold font-['JetBrains_Mono']"
                    style={{ color: getFPSColor(fpsLevel) }}
                  >
                    {fpsData.current}
                  </div>
                  <div className="text-xs text-gray-300 font-['Inter']">
                    FPS
                  </div>
                </div>
              </div>

              {/* FPS Statistics Row - Compact */}
              <div className="mt-2 flex justify-between text-[10px] text-gray-400 px-1">
                <span>Avg: <span className="text-blue-400 font-['JetBrains_Mono']">{fpsData.average}</span></span>
                <span>Min: <span className="text-red-400 font-['JetBrains_Mono']">{fpsData.min || '--'}</span></span>
                <span>Max: <span className="text-green-400 font-['JetBrains_Mono']">{fpsData.max || '--'}</span></span>
              </div>

              {/* Compact graph for overlay */}
              <div className="mt-2 h-10 flex items-end gap-0.5 justify-start">
                {fpsData.history.slice(-20).map((fps, index) => {
                  const maxFps = Math.max(...fpsData.history, 1);
                  const heightPercentage = (fps / maxFps) * 100;
                  return (
                    <div
                      key={index}
                      className="rounded-t flex-1"
                      style={{
                        height: `${heightPercentage}%`,
                        backgroundColor: getFPSColor(
                          fps >= 55
                            ? 'excellent'
                            : fps >= 40
                              ? 'good'
                              : fps >= 25
                                ? 'fair'
                                : 'poor'
                        ),
                        opacity: 0.3 + (index / 20) * 0.7,
                      }}
                    />
                  );
                })}
              </div>
            </>
          )}
        </motion.div>
      )}
    </motion.div>
  );

  // Render FPS Monitor
  // Use portal for overlay/transitioning modes to escape parent z-index/opacity
  if (isPortalMode && typeof document !== 'undefined') {
    return createPortal(monitorContent, document.body);
  }

  return monitorContent;
};

export default FPSMonitor;