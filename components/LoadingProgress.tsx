import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoading } from './LoadingProvider';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface LoadingProgressProps {
  onComplete?: () => void;
  minimumDisplayTime?: number; // milliseconds
}

const LoadingProgress: React.FC<LoadingProgressProps> = ({
  onComplete,
  minimumDisplayTime = 1500
}) => {
  const { assets, overallProgress, loadedCount, totalCount, isLoading } = useLoading();
  const [displayStartTime] = useState(Date.now());
  const [canDismiss, setCanDismiss] = useState(false);

  useEffect(() => {
    // Enforce minimum display time
    const timer = setTimeout(() => {
      setCanDismiss(true);
    }, minimumDisplayTime);

    return () => clearTimeout(timer);
  }, [minimumDisplayTime]);

  useEffect(() => {
    // Check if loading is complete and minimum time has passed
    if (loadedCount === totalCount && totalCount > 0 && canDismiss && onComplete) {
      const elapsed = Date.now() - displayStartTime;
      const remaining = Math.max(0, minimumDisplayTime - elapsed);

      setTimeout(() => {
        onComplete();
      }, remaining);
    }
  }, [loadedCount, totalCount, canDismiss, onComplete, displayStartTime, minimumDisplayTime]);

  if (!isLoading && totalCount === 0) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950"
      data-testid="loading-progress"
      data-progress={Math.round(overallProgress)}
      data-loaded={loadedCount}
      data-total={totalCount}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-2xl mx-6"
      >
        {/* Main Card */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">

          {/* Header */}
          <div className="mb-8 pb-6 border-b border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Loading <span className="text-tennis-yellow">3D Environment</span>
              </h2>
              <div className="text-right">
                <div className="text-3xl font-bold text-tennis-yellow">
                  {Math.round(overallProgress)}%
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {loadedCount} / {totalCount} assets
                </div>
              </div>
            </div>

            {/* Overall Progress Bar */}
            <div className="relative w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-tennis-yellow rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Asset List */}
          <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {assets.map((asset, index) => (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex justify-between items-center border-b border-white/5 pb-3 last:border-0"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Status Icon */}
                    <div className="flex-shrink-0">
                      {asset.error ? (
                        <XCircle className="w-4 h-4 text-red-400" />
                      ) : asset.loaded ? (
                        <CheckCircle className="w-4 h-4 text-white/20" />
                      ) : (
                        <Loader2 className="w-4 h-4 text-tennis-yellow animate-spin" />
                      )}
                    </div>

                    {/* Asset Name */}
                    <span className="text-gray-400 text-sm truncate">
                      {asset.name}
                    </span>
                  </div>

                  {/* Status/Progress */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {!asset.loaded && !asset.error && (
                      <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-tennis-yellow rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${asset.progress}%` }}
                          transition={{ duration: 0.2 }}
                        />
                      </div>
                    )}
                    <span className="font-mono font-bold text-white text-sm min-w-[4rem] text-right">
                      {asset.error ? 'Failed' : asset.loaded ? 'Complete' : `${Math.round(asset.progress)}%`}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default LoadingProgress;
