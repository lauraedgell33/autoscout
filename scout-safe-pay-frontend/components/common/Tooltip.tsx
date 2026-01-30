'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  maxWidth?: number;
}

const positionClasses = {
  top: 'bottom-full mb-2',
  bottom: 'top-full mt-2',
  left: 'right-full mr-2',
  right: 'left-full ml-2',
};

const arrowClasses = {
  top: 'top-full left-1/2 -translate-x-1/2 border-t-gray-900',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-900',
  left: 'left-full top-1/2 -translate-y-1/2 border-l-gray-900',
  right: 'right-full top-1/2 -translate-y-1/2 border-r-gray-900',
};

export function Tooltip({
  content,
  children,
  position = 'top',
  delay = 0.2,
  maxWidth = 200,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setShowTooltip(true);
      setIsVisible(true);
    }, delay * 1000);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
    setShowTooltip(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute ${positionClasses[position]} z-50 pointer-events-none`}
            style={{ maxWidth }}
          >
            <div className="bg-gray-900 text-white text-sm rounded-lg px-3 py-2 whitespace-normal break-words shadow-lg">
              {content}

              {/* Arrow */}
              <div
                className={`absolute w-2 h-2 bg-gray-900 ${arrowClasses[position]}`}
                style={{
                  clipPath: position === 'top'
                    ? 'polygon(50% 0%, 0% 100%, 100% 100%)'
                    : position === 'bottom'
                    ? 'polygon(0% 0%, 50% 100%, 100% 0%)'
                    : position === 'left'
                    ? 'polygon(100% 0%, 0% 50%, 100% 100%)'
                    : 'polygon(0% 0%, 100% 50%, 0% 100%)',
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Tooltip;
