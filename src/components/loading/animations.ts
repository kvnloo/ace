import { Variants } from 'framer-motion';

/**
 * Framer Motion animation variants for premium loading screen
 */

// Container animations
export const containerVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1], // Custom easing
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// Card slide-up animation
export const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
      mass: 1,
    },
  },
};

// Progress bar fill animation
export const progressBarVariants: Variants = {
  initial: {
    width: '0%',
    opacity: 0,
  },
  animate: (progress: number) => ({
    width: `${progress}%`,
    opacity: 1,
    transition: {
      width: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
      opacity: {
        duration: 0.3,
      },
    },
  }),
};

// Shimmer effect for progress bars
export const shimmerVariants: Variants = {
  animate: {
    x: ['-100%', '100%'],
    transition: {
      repeat: Infinity,
      duration: 2,
      ease: 'linear',
    },
  },
};

// FPS indicator pulse
export const fpsPulseVariants: Variants = {
  excellent: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  warning: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Icon bounce-in animation
export const iconBounceVariants: Variants = {
  hidden: {
    scale: 0,
    rotate: -180,
  },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
    },
  },
};

// Button hover animation
export const buttonHoverVariants = {
  rest: {
    scale: 1,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  hover: {
    scale: 1.05,
    boxShadow: '0 10px 20px rgba(16, 185, 129, 0.3)',
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  tap: {
    scale: 0.95,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
};

// Loading spinner rotation
export const spinnerVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// Milestone celebration (confetti)
export const celebrationVariants: Variants = {
  hidden: {
    scale: 0,
    opacity: 0,
  },
  visible: {
    scale: [0, 1.2, 1],
    opacity: [0, 1, 0],
    y: [-20, -60],
    transition: {
      duration: 1.5,
      ease: 'easeOut',
    },
  },
};

// Recommendation card slide-up
export const recommendationCardVariants: Variants = {
  hidden: {
    y: 100,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20,
    },
  },
};

// Text fade-in with stagger
export const textStaggerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

// FPS graph bar animation
export const graphBarVariants: Variants = {
  initial: {
    scaleY: 0,
    opacity: 0,
  },
  animate: (height: number) => ({
    scaleY: height,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

// Glow pulse effect
export const glowPulseVariants: Variants = {
  animate: {
    boxShadow: [
      '0 0 20px rgba(16, 185, 129, 0.3)',
      '0 0 40px rgba(16, 185, 129, 0.5)',
      '0 0 20px rgba(16, 185, 129, 0.3)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Shake animation for warnings
export const shakeVariants: Variants = {
  shake: {
    x: [-10, 10, -10, 10, 0],
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    },
  },
};
