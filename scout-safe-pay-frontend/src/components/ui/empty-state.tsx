'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  actionOnClick?: () => void;
  secondaryActionLabel?: string;
  secondaryActionHref?: string;
  secondaryActionOnClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal';
  children?: ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  actionOnClick,
  secondaryActionLabel,
  secondaryActionHref,
  secondaryActionOnClick,
  className,
  size = 'md',
  variant = 'default',
  children,
}: EmptyStateProps) {
  const sizeClasses = {
    sm: {
      container: 'py-8 px-4',
      icon: 'w-16 h-16',
      iconBg: 'w-20 h-20',
      iconSize: 'w-8 h-8',
      title: 'text-lg',
      description: 'text-sm',
      padding: 'px-4 py-2',
    },
    md: {
      container: 'py-16 px-4',
      icon: 'w-24 h-24',
      iconBg: 'w-28 h-28',
      iconSize: 'w-12 h-12',
      title: 'text-2xl',
      description: 'text-base',
      padding: 'px-8 py-3',
    },
    lg: {
      container: 'py-24 px-6',
      icon: 'w-32 h-32',
      iconBg: 'w-36 h-36',
      iconSize: 'w-16 h-16',
      title: 'text-3xl',
      description: 'text-lg',
      padding: 'px-10 py-4',
    },
  };

  const sizes = sizeClasses[size];

  return (
    <div
      className={cn(
        'text-center animate-fade-in',
        sizes.container,
        className
      )}
      role="status"
      aria-live="polite"
    >
      {/* Icon */}
      {variant === 'default' ? (
        <div className={cn(
          'mx-auto bg-gradient-to-br from-blue-50 to-orange-50 rounded-full flex items-center justify-center mb-6 animate-scale-in',
          sizes.iconBg
        )}>
          <Icon className={cn(sizes.iconSize, 'text-blue-900')} strokeWidth={1.5} aria-hidden="true" />
        </div>
      ) : (
        <div className="flex justify-center mb-6 animate-scale-in">
          <Icon className={cn(sizes.iconSize, 'text-gray-400')} strokeWidth={1.5} aria-hidden="true" />
        </div>
      )}

      {/* Title */}
      <h3 className={cn(
        'font-bold text-gray-900 mb-3 animate-slide-up animation-delay-200',
        sizes.title
      )}>
        {title}
      </h3>

      {/* Description */}
      <p className={cn(
        'text-gray-600 max-w-md mx-auto mb-8 animate-slide-up animation-delay-400',
        sizes.description
      )}>
        {description}
      </p>

      {/* Custom Children Content */}
      {children && (
        <div className="animate-slide-up animation-delay-600 mb-8">
          {children}
        </div>
      )}

      {/* Action Buttons */}
      {(actionLabel && (actionHref || actionOnClick)) && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center animate-slide-up animation-delay-600">
          {/* Primary Action */}
          {actionHref ? (
            <Link
              href={actionHref}
              className={cn(
                'inline-flex items-center gap-2 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2',
                sizes.padding
              )}
            >
              {actionLabel}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          ) : (
            <button
              onClick={actionOnClick}
              className={cn(
                'inline-flex items-center gap-2 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2',
                sizes.padding
              )}
            >
              {actionLabel}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          )}

          {/* Secondary Action */}
          {secondaryActionLabel && (secondaryActionHref || secondaryActionOnClick) && (
            <>
              {secondaryActionHref ? (
                <Link
                  href={secondaryActionHref}
                  className={cn(
                    'inline-flex items-center gap-2 bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2',
                    sizes.padding
                  )}
                >
                  {secondaryActionLabel}
                </Link>
              ) : (
                <button
                  onClick={secondaryActionOnClick}
                  className={cn(
                    'inline-flex items-center gap-2 bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2',
                    sizes.padding
                  )}
                >
                  {secondaryActionLabel}
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default EmptyState;
