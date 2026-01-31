'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

/**
 * Easing curves (typed as tuples to satisfy Framer Motion's Easing types)
 */
const easeOut = [0.16, 1, 0.3, 1] as const;
const easeIn = [0.7, 0, 0.84, 0] as const;

/**
 * Page transition variants
 */
const pageVariants = {
  initial: { 
    opacity: 0, 
    y: 20 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3,
      ease: easeOut
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: 0.2,
      ease: easeIn
    }
  }
};

/**
 * Fade transition variants (simpler, faster)
 */
const fadeVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: 0.2 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.15 }
  }
};

/**
 * Slide transition variants
 */
const slideVariants = {
  initial: { 
    opacity: 0, 
    x: -20 
  },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.3,
      ease: easeOut
    }
  },
  exit: { 
    opacity: 0, 
    x: 20,
    transition: {
      duration: 0.2,
      ease: easeIn
    }
  }
};

interface PageTransitionProps {
  children: React.ReactNode;
  variant?: 'default' | 'fade' | 'slide';
  className?: string;
}

/**
 * PageTransition Component
 * 
 * Provides smooth page transitions using Framer Motion
 * Respects prefers-reduced-motion user preference
 * 
 * @param children - The page content to animate
 * @param variant - The animation variant to use
 * @param className - Additional CSS classes
 */
export function PageTransition({ 
  children, 
  variant = 'default',
  className = '' 
}: PageTransitionProps) {
  const pathname = usePathname();
  
  const variants = {
    default: pageVariants,
    fade: fadeVariants,
    slide: slideVariants
  }[variant];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * FadeIn Component
 * Simple fade-in animation for individual elements
 */
export function FadeIn({ 
  children, 
  delay = 0,
  duration = 0.3,
  className = '' 
}: { 
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * SlideIn Component
 * Slide-in animation for individual elements
 */
export function SlideIn({ 
  children, 
  direction = 'up',
  delay = 0,
  duration = 0.3,
  className = '' 
}: { 
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const directionMap = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directionMap[direction] }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration, delay, ease: easeOut }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * ScaleIn Component
 * Scale-in animation for individual elements
 */
export function ScaleIn({ 
  children, 
  delay = 0,
  duration = 0.3,
  className = '' 
}: { 
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration, delay, ease: easeOut }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger Children Component
 * Animates children with a stagger effect
 */
export function StaggerChildren({ 
  children,
  staggerDelay = 0.1,
  className = ''
}: { 
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
