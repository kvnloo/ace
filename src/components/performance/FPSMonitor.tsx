import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import {
  fpsPulseVariants,
} from '../loading/animations';

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
  className?: string;
}

const FPSMonitor: React.FC<FPSMonitorProps> = ({
  showFPSMonitor = true,
  mode = 'embedded',
  onTransitionComplete,
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

  // FPS Monitoring logic copied from LoadingScreen (lines 85-147)
  useEffect(() => {
    if (!showFPSMonitor) return;

    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrameId: number;

    const measureFPS = () => {
      const currentTime = performance.now();
      const delta = currentTime - lastTime;

      if (delta >= 1000) {
        const fps = Math.round((frameCount * 1000) / delta);

        setFpsData((prev) => {
          const newHistory = [...prev.history, fps].slice(-30);
          const average = Math.round(
            newHistory.reduce((a, b) => a + b, 0) / newHistory.length
          );
          const min = Math.min(...newHistory);
          const max = Math.max(...newHistory);

          return {
            current: fps,
            average,
            min,
            max,
            history: newHistory,
          };
        });

        // Determine FPS level
        const level: FPSLevel =
          fps >= 55
            ? 'excellent'
            : fps >= 40
            ? 'good'
            : fps >= 25
            ? 'fair'
            : 'poor';

        setFpsLevel(level);

        frameCount = 0;
        lastTime = currentTime;
      }

      frameCount++;
      animationFrameId = requestAnimationFrame(measureFPS);
    };

    animationFrameId = requestAnimationFrame(measureFPS);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [showFPSMonitor]);

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

  // Render FPS Monitor - copied from LoadingScreen (lines 337-418)
  return (
    <motion.div
      className={`${className} ${mode === 'overlay' ? 'fixed top-20 right-4 z-50' : ''}`}
      variants={fpsPulseVariants}
      animate={fpsLevel === 'poor' ? 'warning' : 'excellent'}
      data-testid="fps-meter"
      initial={mode === 'transitioning' ? { scale: 1, opacity: 1 } : false}
      transition={
        mode === 'transitioning'
          ? {
              duration: 1.2,
              ease: [0.22, 1, 0.36, 1],
            }
          : undefined
      }
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
          className="glass-card rounded-2xl p-4 min-w-[200px]"
          animate={
            mode === 'transitioning'
              ? {
                  scale: [1, 1.1, 0.6],
                  y: [0, -20, 0],
                }
              : {}
          }
          transition={{
            duration: 1.2,
            ease: [0.22, 1, 0.36, 1],
          }}
          onAnimationComplete={() => {
            if (mode === 'transitioning') {
              onTransitionComplete?.();
            }
          }}
        >
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

          {/* Compact graph for overlay */}
          <div className="mt-3 h-10 flex items-end gap-0.5 justify-start">
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
        </motion.div>
      )}
    </motion.div>
  );
};

export default FPSMonitor;