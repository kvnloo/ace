/**
 * Type definitions for loading screen components
 */

export type FPSLevel = 'excellent' | 'good' | 'fair' | 'poor';

export type QualityMode = 'auto' | 'high' | 'medium' | 'low';

export interface FPSData {
  current: number;
  average: number;
  min: number;
  max: number;
  history: number[];
}

export interface Recommendation {
  title: string;
  description: string;
  action: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface LoadingScreenProps {
  /** Callback when loading completes */
  onComplete?: () => void;

  /** Minimum time to display loading screen (ms) */
  minimumDisplayTime?: number;

  /** Show FPS monitor and performance stats */
  showFPSMonitor?: boolean;

  /** Quality mode for rendering */
  qualityMode?: QualityMode;

  /** Custom theme colors */
  theme?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
  };

  /** Enable accessibility features */
  accessibility?: {
    reducedMotion?: boolean;
    highContrast?: boolean;
    screenReaderAnnouncements?: boolean;
  };
}

export interface MilestoneConfig {
  value: number;
  label: string;
  color: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface AnimationConfig {
  enableParticles?: boolean;
  enableShimmer?: boolean;
  enablePulse?: boolean;
  enableCelebration?: boolean;
}

export interface PerformanceThresholds {
  excellent: number;
  good: number;
  fair: number;
  poor: number;
}

export const DEFAULT_FPS_THRESHOLDS: PerformanceThresholds = {
  excellent: 55,
  good: 40,
  fair: 25,
  poor: 0,
};

export const DEFAULT_MILESTONES: MilestoneConfig[] = [
  { value: 25, label: '25% Complete', color: '#3b82f6' },
  { value: 50, label: 'Halfway There!', color: '#10b981' },
  { value: 75, label: '75% Complete', color: '#f59e0b' },
  { value: 100, label: 'Complete!', color: '#10b981' },
];
