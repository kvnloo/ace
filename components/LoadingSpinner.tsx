import React from 'react';
import { Loader2, Layers, MessageSquare, FileText } from 'lucide-react';

/**
 * Props for LoadingSpinner component
 * @interface LoadingSpinnerProps
 * @property {string} variant - The loading variant/context (determines icon and message)
 *   - 'default': Generic loading spinner
 *   - 'threeScene': Loading 3D facility viewer
 *   - 'aiChat': Loading AI chat service
 *   - 'specifications': Loading specifications page
 */
interface LoadingSpinnerProps {
  variant?: 'default' | 'threeScene' | 'aiChat' | 'specifications';
}

/**
 * LoadingSpinner Component - Contextual loading indicator
 *
 * A reusable loading spinner with multiple variants that display
 * context-appropriate messages and animations based on what's being loaded.
 *
 * Features:
 * - 4 variants with context-specific messages
 * - Animated loading bar
 * - Pulsing/spinning/bouncing icon animations
 * - Centered layout with descriptive text
 * - Smooth fade-in animation
 * - Responsive design for all screen sizes
 *
 * The component is designed to be placed in sections or pages that are
 * loading content, replacing the actual content while the data loads.
 *
 * @component
 * @example
 * ```tsx
 * // Default generic loading spinner
 * <LoadingSpinner />
 * ```
 *
 * @example
 * ```tsx
 * // Context-specific variant for 3D scene loading
 * <LoadingSpinner variant="threeScene" />
 * ```
 *
 * @example
 * ```tsx
 * // Conditionally show spinner based on loading state
 * {isLoading ? <LoadingSpinner variant="aiChat" /> : <ChatContent />}
 * ```
 *
 * @param {LoadingSpinnerProps} props - Component props
 * @param {string} [props.variant='default'] - The loading context variant
 * @returns {React.ReactElement} Animated loading spinner
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ variant = 'default' }) => {
  /**
   * Variant configurations with icons, text, and subtext
   * Each variant uses different animation styles (spin, pulse, bounce)
   * and provides context-specific messaging
   */
  const variants = {
    default: {
      icon: <Loader2 className="w-8 h-8 animate-spin text-tennis-yellow" />,
      text: 'Loading...',
      subtext: 'Please wait',
    },
    threeScene: {
      icon: <Layers className="w-8 h-8 text-tennis-yellow animate-pulse" />,
      text: 'Building 3D Environment',
      subtext: 'Loading facility model and textures',
    },
    aiChat: {
      icon: <MessageSquare className="w-8 h-8 text-tennis-yellow animate-bounce" />,
      text: 'Initializing AI Concierge',
      subtext: 'Connecting to chat service',
    },
    specifications: {
      icon: <FileText className="w-8 h-8 text-tennis-yellow animate-pulse" />,
      text: 'Loading Specifications',
      subtext: 'Preparing facility blueprints',
    },
  };

  /** Get the configuration for the selected variant */
  const config = variants[variant];

  return (
    <div
      className="w-full h-full min-h-[400px] flex items-center justify-center bg-slate-950"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-4 px-6 py-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
        <div className="relative">
          {config.icon}
          <div className="absolute inset-0 animate-ping opacity-20" aria-hidden="true">
            <Loader2 className="w-8 h-8 text-tennis-yellow" />
          </div>
        </div>

        <div className="text-center space-y-1">
          <h2 className="text-lg font-bold text-white">{config.text}</h2>
          <p className="text-sm text-gray-400">{config.subtext}</p>
        </div>

        {/* Animated progress bar */}
        <div
          className="w-48 h-1 bg-white/10 rounded-full overflow-hidden"
          role="progressbar"
          aria-label="Loading progress"
          aria-valuenow={undefined}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="h-full bg-tennis-yellow rounded-full animate-[loading_1.5s_ease-in-out_infinite]" />
        </div>

        {/* Screen reader only text */}
        <span className="sr-only">
          {config.text}. {config.subtext}. Please wait.
        </span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
