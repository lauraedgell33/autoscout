'use client';

import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from './useMediaQuery';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * useScrollAnimation Hook
 * 
 * Detects when an element enters the viewport and triggers animations
 * Respects user's motion preferences
 * 
 * @param options - Configuration options
 * @returns ref to attach to element and isVisible state
 * 
 * @example
 * const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
 * <div ref={ref} className={isVisible ? 'animate-fade-in' : 'opacity-0'}>
 *   Content
 * </div>
 */
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollAnimationOptions = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true
  } = options;

  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // If user prefers reduced motion, make visible immediately
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    // Check if IntersectionObserver is supported
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          
          // If triggerOnce is true, disconnect after first trigger
          if (triggerOnce) {
            observer.disconnect();
          }
        } else if (!triggerOnce) {
          // If triggerOnce is false, hide when out of viewport
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, prefersReducedMotion]);

  return { ref, isVisible };
}

/**
 * useScrollProgress Hook
 * 
 * Tracks scroll progress of the page (0 to 1)
 * Useful for progress bars and parallax effects
 * 
 * @returns scroll progress value between 0 and 1
 */
export function useScrollProgress(): number {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      const maxScroll = documentHeight - windowHeight;
      const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;
      
      setScrollProgress(Math.min(Math.max(progress, 0), 1));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollProgress;
}

/**
 * useScrollDirection Hook
 * 
 * Detects scroll direction (up or down)
 * Useful for hiding/showing headers on scroll
 * 
 * @returns 'up' | 'down' | null
 */
export function useScrollDirection(): 'up' | 'down' | null {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.pageYOffset;
      
      if (currentScrollY > lastScrollY.current) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY.current) {
        setScrollDirection('up');
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollDirection;
}

/**
 * useIsScrolled Hook
 * 
 * Returns true when page is scrolled past a threshold
 * Useful for changing header styles on scroll
 * 
 * @param threshold - Scroll position threshold in pixels (default: 50)
 * @returns boolean
 */
export function useIsScrolled(threshold: number = 50): boolean {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return isScrolled;
}

/**
 * useParallax Hook
 * 
 * Creates parallax effect based on scroll position
 * 
 * @param speed - Parallax speed multiplier (default: 0.5)
 * @returns transform value to apply to element
 */
export function useParallax(speed: number = 0.5): string {
  const [offset, setOffset] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleScroll = () => {
      setOffset(window.pageYOffset * speed);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, prefersReducedMotion]);

  return prefersReducedMotion ? '' : `translateY(${offset}px)`;
}
