/**
 * PageContainer - Main wrapper for all pages
 * Provides consistent padding, max-width, and layout
 */
'use client';

import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
  padding?: 'sm' | 'md' | 'lg';
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = '',
  size = 'lg',
  padding = 'lg',
}) => {
  const sizeClasses = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    full: 'max-w-full',
  };

  const paddingClasses = {
    sm: 'px-4 sm:px-6 py-6 sm:py-8',
    md: 'px-4 sm:px-6 lg:px-8 py-8 sm:py-12',
    lg: 'px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20',
  };

  return (
    <div className={`${sizeClasses[size]} mx-auto ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
};

/**
 * SectionLayout - Wrapper for sections with heading and optional description
 */
interface SectionLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
  titleSize?: 'sm' | 'md' | 'lg';
}

export const SectionLayout: React.FC<SectionLayoutProps> = ({
  children,
  title,
  description,
  className = '',
  titleSize = 'lg',
}) => {
  const titleSizeClasses = {
    sm: 'text-2xl sm:text-3xl',
    md: 'text-3xl sm:text-4xl',
    lg: 'text-4xl sm:text-5xl',
  };

  return (
    <section className={`py-12 sm:py-16 lg:py-20 ${className}`}>
      <div className="mb-12">
        <h2 className={`${titleSizeClasses[titleSize]} font-bold text-gray-900 mb-4`}>
          {title}
        </h2>
        {description && (
          <p className="text-lg text-gray-600 max-w-2xl">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
};

/**
 * CardGrid - Grid layout for cards
 */
interface CardGridProps {
  children: React.ReactNode;
  columns?: 'auto' | '2' | '3' | '4';
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CardGrid: React.FC<CardGridProps> = ({
  children,
  columns = 'auto',
  gap = 'md',
  className = '',
}) => {
  const columnClasses = {
    auto: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    '2': 'grid-cols-1 md:grid-cols-2',
    '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-4 sm:gap-6',
    lg: 'gap-6 sm:gap-8',
  };

  return (
    <div className={`grid ${columnClasses[columns]} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
};

/**
 * StatsGrid - Grid for displaying statistics/metrics
 */
interface Stat {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: { value: number; type: 'increase' | 'decrease' };
}

interface StatsGridProps {
  stats: Stat[];
  className?: string;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:shadow-md transition-shadow"
        >
          {stat.icon && (
            <div className="mb-4 text-primary-600">{stat.icon}</div>
          )}
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {stat.value}
          </div>
          <p className="text-gray-600 mb-2">{stat.label}</p>
          {stat.change && (
            <p className={`text-sm font-medium ${stat.change.type === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
              {stat.change.type === 'increase' ? '↑' : '↓'} {Math.abs(stat.change.value)}%
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

/**
 * FormWrapper - Consistent form styling
 */
interface FormWrapperProps {
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg';
}

export const FormWrapper: React.FC<FormWrapperProps> = ({
  children,
  onSubmit,
  className = '',
  maxWidth = 'md',
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  return (
    <form
      onSubmit={onSubmit}
      className={`${maxWidthClasses[maxWidth]} mx-auto ${className}`}
    >
      {children}
    </form>
  );
};

/**
 * EmptyState - Empty state placeholder
 */
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {icon && (
        <div className="mb-4 text-gray-400 text-5xl">{icon}</div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-600 mb-6 max-w-md text-center">{description}</p>
      )}
      {action && (
        <div className="mt-4">{action}</div>
      )}
    </div>
  );
};

/**
 * Loading State - Consistent loading placeholder
 */
export const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  );
};

/**
 * TwoColumnLayout - Two column layout for pages (e.g., sidebar + content)
 */
interface TwoColumnLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const TwoColumnLayout: React.FC<TwoColumnLayoutProps> = ({
  sidebar,
  children,
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-4 gap-8 ${className}`}>
      <div className="lg:col-span-1">{sidebar}</div>
      <div className="lg:col-span-3">{children}</div>
    </div>
  );
};

// Named export object for convenience (can also import individual components)
export const LayoutComponents = {
  PageContainer,
  SectionLayout,
  CardGrid,
  StatsGrid,
  FormWrapper,
  EmptyState,
  LoadingState,
  TwoColumnLayout,
};

export default LayoutComponents;
