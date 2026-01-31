'use client';

import React from 'react';
import Link from 'next/link';

interface SkipLinkProps {
  href?: string;
  label?: string;
  className?: string;
}

/**
 * SkipLink Component
 * 
 * Provides a skip navigation link that allows keyboard users to skip 
 * repetitive navigation and jump directly to the main content.
 * 
 * - Hidden by default
 * - Visible on keyboard focus
 * - WCAG 2.1 Level A requirement
 */
export function SkipLink({ 
  href = '#main-content', 
  label = 'Skip to main content',
  className = ''
}: SkipLinkProps) {
  return (
    <Link
      href={href}
      className={`
        sr-only focus:not-sr-only
        focus:fixed focus:top-4 focus:left-4 focus:z-[9999]
        focus:px-6 focus:py-3
        focus:bg-primary-900 focus:text-white
        focus:rounded-lg focus:shadow-xl
        focus:outline-none focus:ring-4 focus:ring-primary-300
        font-semibold text-sm
        transition-all duration-200
        ${className}
      `}
      onClick={(e) => {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Set focus to the target element
          if (target instanceof HTMLElement) {
            target.setAttribute('tabindex', '-1');
            target.focus();
          }
        }
      }}
    >
      {label}
    </Link>
  );
}

/**
 * VisuallyHidden Component
 * 
 * Hides content visually but keeps it accessible to screen readers
 */
export function VisuallyHidden({ 
  children, 
  as: Component = 'span' 
}: { 
  children: React.ReactNode; 
  as?: keyof React.JSX.IntrinsicElements;
}) {
  return (
    <Component className="sr-only">
      {children}
    </Component>
  );
}

/**
 * FocusableIcon Component
 * 
 * Wrapper for icon buttons to ensure proper accessibility
 */
interface FocusableIconProps {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export function FocusableIcon({
  children,
  label,
  onClick,
  className = '',
  disabled = false,
}: FocusableIconProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`
        inline-flex items-center justify-center
        min-w-[44px] min-h-[44px]
        rounded-lg
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        hover:bg-gray-100
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
      <VisuallyHidden>{label}</VisuallyHidden>
    </button>
  );
}

/**
 * LiveRegion Component
 * 
 * Announces dynamic content changes to screen readers
 */
interface LiveRegionProps {
  children: React.ReactNode;
  politeness?: 'polite' | 'assertive' | 'off';
  atomic?: boolean;
  className?: string;
}

export function LiveRegion({
  children,
  politeness = 'polite',
  atomic = true,
  className = '',
}: LiveRegionProps) {
  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic={atomic}
      className={className}
    >
      {children}
    </div>
  );
}

/**
 * ProgressAnnouncer Component
 * 
 * Announces progress updates to screen readers
 */
interface ProgressAnnouncerProps {
  value: number;
  max?: number;
  label?: string;
  showVisual?: boolean;
  className?: string;
}

export function ProgressAnnouncer({
  value,
  max = 100,
  label = 'Progress',
  showVisual = false,
  className = '',
}: ProgressAnnouncerProps) {
  const percentage = Math.round((value / max) * 100);

  return (
    <div className={className}>
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
        className={showVisual ? '' : 'sr-only'}
      >
        {showVisual ? (
          <div className="relative">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{label}</span>
              <span className="text-sm font-medium text-gray-700">{percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        ) : (
          `${label}: ${percentage}%`
        )}
      </div>
    </div>
  );
}

export default SkipLink;
