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
  iconBounceVariants,
  buttonHoverVariants,
  recommendationCardVariants,
  celebrationVariants,
  shakeVariants,
} from './animations';
import './styles.css';
import FPSMonitor from '../performance/FPSMonitor';
import { useFPSMonitorControl } from '../performance/FPSMonitorContext';

interface LoadingScreenProps {
  onComplete?: () => void;
  minimumDisplayTime?: number;
  showFPSMonitor?: boolean;
  qualityMode?: 'auto' | 'high' | 'medium' | 'low';
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onComplete,
  minimumDisplayTime = 2000,
  showFPSMonitor = true,
  qualityMode = 'auto',
}) => {
  const { assets, overallProgress, loadedCount, totalCount, isLoading, currentPhase } = useLoading();
  const { setMode: setFPSMode, startTransition } = useFPSMonitorControl();
  const [displayStartTime] = useState(Date.now());
  const [canDismiss, setCanDismiss] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [showErrorUI, setShowErrorUI] = useState(false);

  // Set initial FPS mode
  useEffect(() => {
    if (showFPSMonitor) {
      setFPSMode('embedded');
    }
  }, [showFPSMonitor, setFPSMode]);

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

  const [showMilestone, setShowMilestone] = useState(false);
  const [lastMilestone, setLastMilestone] = useState(0);

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

  // CRITICAL FIX: Loading timeout fallback (max 10 seconds)
  useEffect(() => {
    console.log('[LoadingScreen] Starting timeout timer (10s)');
    const timeoutTimer = setTimeout(() => {
      console.warn('[LoadingScreen] Loading timeout reached - forcing completion');
      setLoadingTimeout(true);
      if (onComplete) {
        console.log('[LoadingScreen] Calling onComplete() due to timeout');
        // Ensure FPS monitor transitions even on timeout
        if (showFPSMonitor) {
          startTransition();
        }
        onComplete();
      }
    }, 10000); // 10 second maximum wait

    return () => clearTimeout(timeoutTimer);
  }, [onComplete]);

  // Complete handler
  useEffect(() => {
    // Complete when loading finishes and all assets are loaded (or total is 0)
    const assetsComplete = totalCount === 0 || loadedCount === totalCount;
    const shouldComplete = !isLoading && assetsComplete && canDismiss && onComplete;

    if (shouldComplete) {
      const elapsed = Date.now() - displayStartTime;
      const remaining = Math.max(0, minimumDisplayTime - elapsed);

      setTimeout(() => {
        // Trigger FPS monitor transition before unmounting
        if (showFPSMonitor) {
          startTransition();
        }

        // Small delay to allow GlobalFPSMonitor to mount and grab layoutId
        // before we unmount the embedded one
        setTimeout(() => {
          onComplete();
        }, 100);
      }, remaining);
    }
  }, [isLoading, loadedCount, totalCount, canDismiss, onComplete, displayStartTime, minimumDisplayTime, showFPSMonitor, startTransition]);


  // Don't render in test mode
  if (isTestMode) {
    console.log('[LoadingScreen] Test mode - skipping render');
    return null;
  }

  // CRITICAL FIX: Hide loading screen on timeout
  if (loadingTimeout) {
    console.log('[LoadingScreen] Timeout reached - hiding loading screen');
    return null;
  }

  // Show loading screen if:
  // 1. Currently loading (isLoading = true)
  // 2. Has assets to load (totalCount > 0)
  // 3. Not all assets loaded yet (loadedCount < totalCount)
  // Hide only when loading is complete (all assets loaded or no assets)
  if (!isLoading && (totalCount === 0 || loadedCount === totalCount)) {
    console.log('[LoadingScreen] Loading complete - hiding loading screen');
    return null;
  }

  console.log(`[LoadingScreen] Rendering: ${loadedCount}/${totalCount} assets, ${Math.round(overallProgress)}% progress`);

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
                className="absolute inset-y-0 left-0 rounded-full progress-shimmer progress-gradient-excellent"
                custom={overallProgress}
                variants={progressBarVariants}
                initial="initial"
                animate="animate"
              />
            </div>
          </div>

          {/* FPS Monitor */}
          {showFPSMonitor && (
            <FPSMonitor
              mode="embedded"
              className="mb-8 pb-6 border-b border-white/10"
            />
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

        {/* Loading Spinner (decorative) */}
        <div className="absolute top-8 left-8 loading-spinner" />
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen;
