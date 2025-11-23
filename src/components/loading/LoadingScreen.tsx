import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoading } from './LoadingProvider';
import {
  CheckCircle,
  XCircle,
  Loader2,
  Sparkles,
  Zap,
  TrendingUp,
  AlertTriangle,
  Settings,
} from 'lucide-react';
import {
  containerVariants,
  cardVariants,
  progressBarVariants,
  shimmerVariants,
  fpsPulseVariants,
  iconBounceVariants,
  buttonHoverVariants,
  recommendationCardVariants,
  celebrationVariants,
  shakeVariants,
} from './animations';
import './styles.css';

interface LoadingScreenProps {
  onComplete?: () => void;
  minimumDisplayTime?: number;
  showFPSMonitor?: boolean;
  qualityMode?: 'auto' | 'high' | 'medium' | 'low';
}

interface FPSData {
  current: number;
  average: number;
  min: number;
  max: number;
  history: number[];
}

type FPSLevel = 'excellent' | 'good' | 'fair' | 'poor';

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onComplete,
  minimumDisplayTime = 2000,
  showFPSMonitor = true,
  qualityMode = 'auto',
}) => {
  const { assets, overallProgress, loadedCount, totalCount, isLoading, currentPhase } = useLoading();
  const [displayStartTime] = useState(Date.now());
  const [canDismiss, setCanDismiss] = useState(false);

  // Skip loading screen for E2E tests
  const [isTestMode] = useState(() => {
    try {
      return typeof window !== 'undefined' && window.localStorage?.getItem('test-skip-loading') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (isTestMode && onComplete) {
      onComplete();
    }
  }, [isTestMode, onComplete]);
  const [fpsData, setFpsData] = useState<FPSData>({
    current: 0,
    average: 0,
    min: 0,
    max: 0,
    history: [],
  });
  const [showMilestone, setShowMilestone] = useState(false);
  const [lastMilestone, setLastMilestone] = useState(0);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [fpsLevel, setFpsLevel] = useState<FPSLevel>('excellent');
  const [prevFpsLevel, setPrevFpsLevel] = useState<FPSLevel>('excellent');

  // FPS Monitoring
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

        setPrevFpsLevel(fpsLevel);
        setFpsLevel(level);

        // Show recommendation if FPS drops
        if (level === 'fair' || level === 'poor') {
          setShowRecommendation(true);
        }

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
  }, [showFPSMonitor, fpsLevel]);

  // Milestone detection
  useEffect(() => {
    const milestones = [25, 50, 75, 100];
    const currentProgress = Math.round(overallProgress);

    for (const milestone of milestones) {
      if (currentProgress >= milestone && lastMilestone < milestone) {
        setLastMilestone(milestone);
        setShowMilestone(true);
        setTimeout(() => setShowMilestone(false), 2000);
        break;
      }
    }
  }, [overallProgress, lastMilestone]);

  // Minimum display time
  useEffect(() => {
    const timer = setTimeout(() => {
      setCanDismiss(true);
    }, minimumDisplayTime);

    return () => clearTimeout(timer);
  }, [minimumDisplayTime]);

  // Complete handler
  useEffect(() => {
    // Complete when loading finishes and all assets are loaded (or total is 0)
    const assetsComplete = totalCount === 0 || loadedCount === totalCount;
    const shouldComplete = !isLoading && assetsComplete && canDismiss && onComplete;

    if (shouldComplete) {
      const elapsed = Date.now() - displayStartTime;
      const remaining = Math.max(0, minimumDisplayTime - elapsed);

      setTimeout(() => {
        onComplete();
      }, remaining);
    }
  }, [isLoading, loadedCount, totalCount, canDismiss, onComplete, displayStartTime, minimumDisplayTime]);

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

  const getRecommendation = useCallback(() => {
    if (fpsLevel === 'poor') {
      return {
        title: 'Performance Issues Detected',
        description: 'Consider switching to Low quality mode for better performance',
        action: 'Switch to Low Quality',
        icon: Settings,
      };
    } else if (fpsLevel === 'fair') {
      return {
        title: 'Moderate Performance',
        description: 'Medium quality mode recommended for optimal experience',
        action: 'Switch to Medium Quality',
        icon: Zap,
      };
    }
    return null;
  }, [fpsLevel]);

  // Don't render in test mode
  if (isTestMode) {
    return null;
  }

  // Show loading screen if:
  // 1. Currently loading (isLoading = true)
  // 2. Has assets to load (totalCount > 0)
  // 3. Not all assets loaded yet (loadedCount < totalCount)
  // Hide only when loading is complete (all assets loaded or no assets)
  if (!isLoading && (totalCount === 0 || loadedCount === totalCount)) {
    return null;
  }

  const recommendation = getRecommendation();

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      data-testid="loading-screen"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black opacity-90" />

      {/* Content */}
      <motion.div
        variants={cardVariants}
        className="relative w-full max-w-2xl mx-6 z-10"
      >
        {/* Main Card */}
        <div className="glass-card rounded-3xl p-12">
          {/* Header */}
          <div className="mb-8 pb-6 border-b border-white/10">
            <div className="flex items-center justify-between mb-6">
              {/* Title */}
              <div>
                <h2 className="text-3xl font-bold text-white font-['Inter']">
                  Loading{' '}
                  <span className="gradient-text">3D Environment</span>
                </h2>
                <p className="text-gray-200 text-sm mt-2 font-['Inter']">
                  Preparing your experience...
                </p>
              </div>

              {/* Progress */}
              <div className="text-right" data-testid="loading-progress">
                <div className="text-5xl font-bold gradient-text font-['Inter']">
                  {Math.round(overallProgress)}%
                </div>
                <div className="text-xs text-gray-200 mt-1 font-['Inter']">
                  {loadedCount} / {totalCount} assets
                </div>
                <div className="text-xs text-blue-400 mt-1 font-['Inter']" data-testid="loading-phase">
                  {currentPhase}
                </div>
              </div>
            </div>

            {/* Overall Progress Bar */}
            <div className="relative w-full h-3 bg-white/5 rounded-full overflow-hidden" data-testid="loading-progress-bar">
              <motion.div
                className={`absolute inset-y-0 left-0 rounded-full progress-shimmer ${
                  fpsLevel === 'excellent'
                    ? 'progress-gradient-excellent'
                    : fpsLevel === 'good'
                    ? 'progress-gradient-good'
                    : fpsLevel === 'fair'
                    ? 'progress-gradient-fair'
                    : 'progress-gradient-poor'
                }`}
                custom={overallProgress}
                variants={progressBarVariants}
                initial="initial"
                animate="animate"
              />
            </div>
          </div>

          {/* FPS Monitor */}
          {showFPSMonitor && (
            <motion.div
              className="mb-8 pb-6 border-b border-white/10"
              variants={fpsPulseVariants}
              animate={fpsLevel === 'poor' ? 'warning' : 'excellent'}
              data-testid="fps-meter"
            >
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
                  // Calculate height relative to the max FPS in history
                  // This ensures the graph always uses the full height dynamically
                  const maxFps = Math.max(...fpsData.history, 1); // Prevent division by zero
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
            </motion.div>
          )}

          {/* Asset List */}
          <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {assets.map((asset, index) => (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex justify-between items-center border-b border-white/5 pb-3 last:border-0"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Status Icon */}
                    <motion.div
                      className="flex-shrink-0"
                      variants={iconBounceVariants}
                      initial="hidden"
                      animate={asset.loaded ? 'visible' : 'hidden'}
                    >
                      {asset.error ? (
                        <XCircle className="w-5 h-5 text-red-400" />
                      ) : asset.loaded ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                      )}
                    </motion.div>

                    {/* Asset Name */}
                    <span className="text-gray-200 text-sm truncate font-['Inter']">
                      {asset.name}
                    </span>
                  </div>

                  {/* Progress */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {!asset.loaded && !asset.error && (
                      <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-blue-400 rounded-full progress-shimmer"
                          initial={{ width: 0 }}
                          animate={{ width: `${asset.progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    )}
                    <span className="font-mono font-bold text-white text-sm min-w-[4rem] text-right font-['JetBrains_Mono']">
                      {asset.error
                        ? 'Failed'
                        : asset.loaded
                        ? 'Complete'
                        : `${Math.round(asset.progress)}%`}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Milestone Celebration */}
          <AnimatePresence>
            {showMilestone && (
              <motion.div
                className="absolute top-8 right-8 bg-green-500/20 border border-green-500/50 rounded-2xl px-6 py-3"
                variants={celebrationVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-green-400" />
                  <span className="text-white font-bold font-['Inter']">
                    {lastMilestone}% Complete!
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Recommendation Card */}
        <AnimatePresence>
          {showRecommendation && recommendation && (
            <motion.div
              className="mt-6"
              variants={recommendationCardVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              data-testid="fps-recommendation"
            >
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <motion.div
                    className="p-3 rounded-xl bg-amber-500/20"
                    variants={iconBounceVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <recommendation.icon className="w-6 h-6 text-amber-400" />
                  </motion.div>

                  <div className="flex-1">
                    <h3 className="text-white font-bold font-['Inter'] mb-1">
                      {recommendation.title}
                    </h3>
                    <p className="text-gray-200 text-sm font-['Inter'] mb-4">
                      {recommendation.description}
                    </p>

                    <div className="flex gap-2">
                      <motion.button
                        className="button-glow px-4 py-2 bg-amber-500 text-white rounded-lg font-['Inter'] font-semibold"
                        variants={buttonHoverVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => setShowRecommendation(false)}
                        data-testid="apply-recommendation-button"
                      >
                        {recommendation.action}
                      </motion.button>
                      <motion.button
                        className="px-4 py-2 bg-white/10 text-white rounded-lg font-['Inter'] font-semibold hover:bg-white/20"
                        variants={buttonHoverVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => setShowRecommendation(false)}
                        data-testid="continue-loading-button"
                      >
                        Continue Anyway
                      </motion.button>
                    </div>
                  </div>

                  <button
                    className="text-gray-200 hover:text-white transition-colors"
                    onClick={() => setShowRecommendation(false)}
                    aria-label="Dismiss recommendation"
                  >
                    ×
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Loading Spinner (decorative) */}
      <div className="absolute top-8 left-8 loading-spinner" />
    </motion.div>
  );
};

export default LoadingScreen;
